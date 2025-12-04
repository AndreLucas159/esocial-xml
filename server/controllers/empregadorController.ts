import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../db/prisma';

export class EmpregadorController {
    // Listar empregadores da organização
    static async list(req: AuthRequest, res: Response) {
        try {
            const empregadores = await prisma.empregador.findMany({
                where: { organizacaoId: req.organizacaoId },
                orderBy: { razaoSocial: 'asc' }
            });

            res.json(empregadores);
        } catch (error) {
            console.error('Erro ao listar empregadores:', error);
            res.status(500).json({ error: 'Erro ao listar empregadores' });
        }
    }

    // Buscar empregador por ID
    static async getById(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;

            const empregador = await prisma.empregador.findFirst({
                where: {
                    id,
                    organizacaoId: req.organizacaoId
                },
                include: {
                    lotacoes: true,
                    rubricas: true,
                    cargos: true
                }
            });

            if (!empregador) {
                return res.status(404).json({ error: 'Empregador não encontrado' });
            }

            res.json(empregador);
        } catch (error) {
            console.error('Erro ao buscar empregador:', error);
            res.status(500).json({ error: 'Erro ao buscar empregador' });
        }
    }

    // Criar empregador
    static async create(req: AuthRequest, res: Response) {
        try {
            const data = req.body;

            const empregador = await prisma.empregador.create({
                data: {
                    ...data,
                    organizacaoId: req.organizacaoId
                }
            });

            res.status(201).json(empregador);
        } catch (error) {
            console.error('Erro ao criar empregador:', error);
            res.status(500).json({ error: 'Erro ao criar empregador' });
        }
    }

    // Atualizar empregador
    static async update(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const data = req.body;

            const empregador = await prisma.empregador.updateMany({
                where: {
                    id,
                    organizacaoId: req.organizacaoId
                },
                data
            });

            if (empregador.count === 0) {
                return res.status(404).json({ error: 'Empregador não encontrado' });
            }

            res.json({ message: 'Empregador atualizado com sucesso' });
        } catch (error) {
            console.error('Erro ao atualizar empregador:', error);
            res.status(500).json({ error: 'Erro ao atualizar empregador' });
        }
    }

    // Deletar empregador (soft delete)
    static async delete(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;

            const empregador = await prisma.empregador.updateMany({
                where: {
                    id,
                    organizacaoId: req.organizacaoId
                },
                data: { ativo: false }
            });

            if (empregador.count === 0) {
                return res.status(404).json({ error: 'Empregador não encontrado' });
            }

            res.json({ message: 'Empregador desativado com sucesso' });
        } catch (error) {
            console.error('Erro ao deletar empregador:', error);
            res.status(500).json({ error: 'Erro ao deletar empregador' });
        }
    }
}
