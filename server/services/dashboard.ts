import prisma from '../db/prisma';

export class DashboardService {
    static async getStats(empregadorId: string) {
        // If empregadorId is 'default-empregador-id', we might want to fetch the first available employer
        // or return zeros if no valid ID is provided.
        // For now, let's assume we need a valid UUID. If it's the default string, we'll try to find one.

        let targetEmpregadorId = empregadorId;

        if (empregadorId === 'default-empregador-id') {
            const firstEmpregador = await prisma.empregador.findFirst();
            if (firstEmpregador) {
                targetEmpregadorId = firstEmpregador.id;
            } else {
                // No employer found, return zero stats
                return {
                    totalTrabalhadores: 0,
                    totalContratos: 0,
                    competenciasAbertas: 0,
                    eventosPendentes: 0,
                    eventosEnviados: 0,
                    eventosComErro: 0
                };
            }
        }

        const [
            totalTrabalhadores,
            totalContratos,
            competenciasAbertas,
            eventosPendentes,
            eventosEnviados,
            eventosComErro
        ] = await Promise.all([
            prisma.trabalhador.count({ where: { empregadorId: targetEmpregadorId, ativo: true } }),
            prisma.contrato.count({ where: { empregadorId: targetEmpregadorId, status: 'ativo' } }),
            prisma.competencia.count({ where: { empregadorId: targetEmpregadorId, status: 'aberta' } }),
            prisma.eventoEsocial.count({ where: { empregadorId: targetEmpregadorId, status: 'pendente' } }),
            prisma.eventoEsocial.count({
                where: {
                    empregadorId: targetEmpregadorId,
                    status: 'enviado',
                    dataEnvio: {
                        gte: new Date(new Date().setDate(new Date().getDate() - 30)) // Last 30 days
                    }
                }
            }),
            prisma.eventoEsocial.count({ where: { empregadorId: targetEmpregadorId, status: 'erro' } })
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

    static async getRecentEvents(empregadorId: string, limit: number = 10) {
        let targetEmpregadorId = empregadorId;

        if (empregadorId === 'default-empregador-id') {
            const firstEmpregador = await prisma.empregador.findFirst();
            if (firstEmpregador) {
                targetEmpregadorId = firstEmpregador.id;
            } else {
                return [];
            }
        }

        const events = await prisma.eventoEsocial.findMany({
            where: { empregadorId: targetEmpregadorId },
            orderBy: { createdAt: 'desc' },
            take: limit,
            include: {
                usuario: {
                    select: { nome: true }
                }
            }
        });

        return events.map(event => ({
            id: event.id,
            tipoEvento: event.tipoEvento,
            status: event.status,
            createdAt: event.createdAt.toISOString(),
            numeroRecibo: event.numeroRecibo,
            protocolo: event.protocolo,
            usuario: event.usuario
        }));
    }
}
