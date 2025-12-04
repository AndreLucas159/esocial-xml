import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../db/prisma';

export class DashboardController {
    /**
     * Obter estatísticas do dashboard
     */
    static async getStats(req: AuthRequest, res: Response) {
        try {
            let { empregadorId } = req.params;

            if (empregadorId === 'default-empregador-id') {
                const firstEmpregador = await prisma.empregador.findFirst();
                if (firstEmpregador) {
                    empregadorId = firstEmpregador.id;
                } else {
                    return res.json({
                        totalTrabalhadores: 0,
                        totalContratos: 0,
                        competenciasAbertas: 0,
                        eventosPendentes: 0,
                        eventosEnviados: 0,
                        eventosComErro: 0
                    });
                }
            }

            // Total de trabalhadores ativos
            const totalTrabalhadores = await prisma.trabalhador.count({
                where: {
                    empregadorId,
                    ativo: true
                }
            });

            // Total de contratos ativos
            const totalContratos = await prisma.contrato.count({
                where: {
                    empregadorId,
                    status: 'ativo'
                }
            });

            // Competências abertas
            const competenciasAbertas = await prisma.competencia.count({
                where: {
                    empregadorId,
                    status: 'aberta'
                }
            });

            // Eventos pendentes
            const eventosPendentes = await prisma.eventoEsocial.count({
                where: {
                    empregadorId,
                    status: 'pendente'
                }
            });

            // Eventos enviados no último mês
            const umMesAtras = new Date();
            umMesAtras.setMonth(umMesAtras.getMonth() - 1);

            const eventosEnviados = await prisma.eventoEsocial.count({
                where: {
                    empregadorId,
                    status: 'enviado',
                    dataEnvio: {
                        gte: umMesAtras
                    }
                }
            });

            // Eventos com erro
            const eventosComErro = await prisma.eventoEsocial.count({
                where: {
                    empregadorId,
                    status: 'erro'
                }
            });

            res.json({
                totalTrabalhadores,
                totalContratos,
                competenciasAbertas,
                eventosPendentes,
                eventosEnviados,
                eventosComErro
            });
        } catch (error) {
            console.error('Erro ao obter estatísticas:', error);
            res.status(500).json({ error: 'Erro ao obter estatísticas do dashboard' });
        }
    }

    /**
     * Obter eventos recentes
     */
    static async getRecentEvents(req: AuthRequest, res: Response) {
        try {
            let { empregadorId } = req.params;
            const limit = parseInt(req.query.limit as string) || 10;

            if (empregadorId === 'default-empregador-id') {
                const firstEmpregador = await prisma.empregador.findFirst();
                if (firstEmpregador) {
                    empregadorId = firstEmpregador.id;
                } else {
                    return res.json([]);
                }
            }

            const eventos = await prisma.eventoEsocial.findMany({
                where: {
                    empregadorId
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: limit,
                include: {
                    usuario: {
                        select: {
                            nome: true,
                            email: true
                        }
                    }
                }
            });

            res.json(eventos);
        } catch (error) {
            console.error('Erro ao obter eventos recentes:', error);
            res.status(500).json({ error: 'Erro ao obter eventos recentes' });
        }
    }

    /**
     * Obter resumo completo do dashboard
     */
    static async getSummary(req: AuthRequest, res: Response) {
        try {
            let { empregadorId } = req.params;

            if (empregadorId === 'default-empregador-id') {
                const firstEmpregador = await prisma.empregador.findFirst();
                if (firstEmpregador) {
                    empregadorId = firstEmpregador.id;
                } else {
                    return res.json({
                        stats: {
                            totalTrabalhadores: 0,
                            totalContratos: 0,
                            competenciasAbertas: 0,
                            eventosPendentes: 0,
                            eventosEnviados: 0,
                            eventosComErro: 0
                        },
                        recentEvents: [],
                        eventsByStatus: [],
                        eventsByType: [],
                        competencias: []
                    });
                }
            }

            // Executar todas as queries em paralelo
            const [
                stats,
                recentEvents,
                eventsByStatus,
                eventsByType,
                competencias
            ] = await Promise.all([
                // Estatísticas gerais
                DashboardController.getStatsData(empregadorId),

                // Eventos recentes
                prisma.eventoEsocial.findMany({
                    where: { empregadorId },
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                    include: {
                        usuario: {
                            select: { nome: true }
                        }
                    }
                }),

                // Distribuição por status
                prisma.eventoEsocial.groupBy({
                    by: ['status'],
                    where: { empregadorId },
                    _count: true
                }),

                // Distribuição por tipo
                prisma.eventoEsocial.groupBy({
                    by: ['tipoEvento'],
                    where: { empregadorId },
                    _count: true
                }),

                // Competências recentes
                prisma.competencia.findMany({
                    where: { empregadorId },
                    orderBy: [
                        { ano: 'desc' },
                        { mes: 'desc' }
                    ],
                    take: 3
                })
            ]);

            res.json({
                stats,
                recentEvents,
                eventsByStatus,
                eventsByType,
                competencias
            });
        } catch (error) {
            console.error('Erro ao obter resumo do dashboard:', error);
            res.status(500).json({ error: 'Erro ao obter resumo do dashboard' });
        }
    }

    /**
     * Método auxiliar para obter estatísticas
     */
    private static async getStatsData(empregadorId: string) {
        const umMesAtras = new Date();
        umMesAtras.setMonth(umMesAtras.getMonth() - 1);

        const [
            totalTrabalhadores,
            totalContratos,
            competenciasAbertas,
            eventosPendentes,
            eventosEnviados,
            eventosComErro
        ] = await Promise.all([
            prisma.trabalhador.count({
                where: { empregadorId, ativo: true }
            }),
            prisma.contrato.count({
                where: { empregadorId, status: 'ativo' }
            }),
            prisma.competencia.count({
                where: { empregadorId, status: 'aberta' }
            }),
            prisma.eventoEsocial.count({
                where: { empregadorId, status: 'pendente' }
            }),
            prisma.eventoEsocial.count({
                where: {
                    empregadorId,
                    status: 'enviado',
                    dataEnvio: { gte: umMesAtras }
                }
            }),
            prisma.eventoEsocial.count({
                where: { empregadorId, status: 'erro' }
            })
        ]);

        return {
            totalTrabalhadores,
            totalContratos,
            competenciasAbertas,
            eventosPendentes,
            eventosEnviados,
            eventosComErro
        };
    }
}
