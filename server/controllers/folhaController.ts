import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../db/prisma';

export class FolhaController {
    // Criar competência (mês de folha)
    static async createCompetencia(req: AuthRequest, res: Response) {
        try {
            const { empregadorId } = req.params;
            const { ano, mes } = req.body;

            const competencia = await prisma.competencia.create({
                data: {
                    empregadorId,
                    ano,
                    mes,
                    status: 'aberta'
                }
            });

            res.status(201).json(competencia);
        } catch (error) {
            console.error('Erro ao criar competência:', error);
            res.status(500).json({ error: 'Erro ao criar competência' });
        }
    }

    // Listar competências
    static async listCompetencias(req: AuthRequest, res: Response) {
        try {
            const { empregadorId } = req.params;

            const competencias = await prisma.competencia.findMany({
                where: { empregadorId },
                orderBy: [{ ano: 'desc' }, { mes: 'desc' }]
            });

            res.json(competencias);
        } catch (error) {
            console.error('Erro ao listar competências:', error);
            res.status(500).json({ error: 'Erro ao listar competências' });
        }
    }

    // Criar lançamento de folha
    static async createLancamento(req: AuthRequest, res: Response) {
        try {
            const { competenciaId } = req.params;
            const data = req.body;

            const lancamento = await prisma.lancamentoFolha.create({
                data: {
                    ...data,
                    competenciaId
                },
                include: {
                    rubrica: true,
                    contrato: {
                        include: {
                            trabalhador: true
                        }
                    }
                }
            });

            res.status(201).json(lancamento);
        } catch (error) {
            console.error('Erro ao criar lançamento:', error);
            res.status(500).json({ error: 'Erro ao criar lançamento' });
        }
    }

    // Listar lançamentos da competência
    static async listLancamentos(req: AuthRequest, res: Response) {
        try {
            const { competenciaId } = req.params;
            const { contratoId } = req.query;

            const where: any = { competenciaId };
            if (contratoId) {
                where.contratoId = contratoId;
            }

            const lancamentos = await prisma.lancamentoFolha.findMany({
                where,
                include: {
                    rubrica: true,
                    contrato: {
                        include: {
                            trabalhador: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });

            res.json(lancamentos);
        } catch (error) {
            console.error('Erro ao listar lançamentos:', error);
            res.status(500).json({ error: 'Erro ao listar lançamentos' });
        }
    }

    // Fechar competência
    static async fecharCompetencia(req: AuthRequest, res: Response) {
        try {
            const { competenciaId } = req.params;

            const competencia = await prisma.competencia.update({
                where: { id: competenciaId },
                data: {
                    status: 'fechada',
                    dataFechamento: new Date()
                }
            });

            res.json(competencia);
        } catch (error) {
            console.error('Erro ao fechar competência:', error);
            res.status(500).json({ error: 'Erro ao fechar competência' });
        }
    }

    // Reabrir competência
    static async reabrirCompetencia(req: AuthRequest, res: Response) {
        try {
            const { competenciaId } = req.params;

            const competencia = await prisma.competencia.update({
                where: { id: competenciaId },
                data: {
                    status: 'aberta',
                    dataFechamento: null
                }
            });

            res.json(competencia);
        } catch (error) {
            console.error('Erro ao reabrir competência:', error);
            res.status(500).json({ error: 'Erro ao reabrir competência' });
        }
    }
}
