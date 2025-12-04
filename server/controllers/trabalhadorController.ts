import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../db/prisma';

export class TrabalhadorController {
    // Listar trabalhadores do empregador
    static async list(req: AuthRequest, res: Response) {
        try {
            const { empregadorId } = req.params;

            const trabalhadores = await prisma.trabalhador.findMany({
                where: { empregadorId },
                include: {
                    contratos: {
                        include: {
                            cargo: true,
                            lotacao: true
                        }
                    }
                },
                orderBy: { nome: 'asc' }
            });

            res.json(trabalhadores);
        } catch (error) {
            console.error('Erro ao listar trabalhadores:', error);
            res.status(500).json({ error: 'Erro ao listar trabalhadores' });
        }
    }

    // Buscar trabalhador por ID
    static async getById(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;

            const trabalhador = await prisma.trabalhador.findUnique({
                where: { id },
                include: {
                    contratos: {
                        include: {
                            cargo: true,
                            lotacao: true,
                            empregador: true
                        }
                    },
                    dependentes: {
                        where: { ativo: true }
                    }
                }
            });

            if (!trabalhador) {
                return res.status(404).json({ error: 'Trabalhador não encontrado' });
            }

            res.json(trabalhador);
        } catch (error) {
            console.error('Erro ao buscar trabalhador:', error);
            res.status(500).json({ error: 'Erro ao buscar trabalhador' });
        }
    }

    // Criar trabalhador
    static async create(req: AuthRequest, res: Response) {
        try {
            const { empregadorId } = req.params;
            const data = req.body;

            const trabalhador = await prisma.trabalhador.create({
                data: {
                    ...data,
                    empregadorId
                }
            });

            res.status(201).json(trabalhador);
        } catch (error) {
            console.error('Erro ao criar trabalhador:', error);
            res.status(500).json({ error: 'Erro ao criar trabalhador' });
        }
    }

    // Atualizar trabalhador
    static async update(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;
            const data = req.body;

            const trabalhador = await prisma.trabalhador.update({
                where: { id },
                data
            });

            res.json(trabalhador);
        } catch (error) {
            console.error('Erro ao atualizar trabalhador:', error);
            res.status(500).json({ error: 'Erro ao atualizar trabalhador' });
        }
    }

    // Deletar trabalhador (soft delete)
    static async delete(req: AuthRequest, res: Response) {
        try {
            const { id } = req.params;

            await prisma.trabalhador.update({
                where: { id },
                data: { ativo: false }
            });

            res.json({ message: 'Trabalhador desativado com sucesso' });
        } catch (error) {
            console.error('Erro ao deletar trabalhador:', error);
            res.status(500).json({ error: 'Erro ao deletar trabalhador' });
        }
    }

    // Criar contrato (admissão)
    static async createContrato(req: AuthRequest, res: Response) {
        try {
            const { trabalhadorId } = req.params;
            const data = req.body;

            const contrato = await prisma.contrato.create({
                data: {
                    ...data,
                    trabalhadorId
                },
                include: {
                    trabalhador: true,
                    empregador: true,
                    cargo: true,
                    lotacao: true
                }
            });

            res.status(201).json(contrato);
        } catch (error) {
            console.error('Erro ao criar contrato:', error);
            res.status(500).json({ error: 'Erro ao criar contrato' });
        }
    }

    // Listar contratos do trabalhador
    static async listContratos(req: AuthRequest, res: Response) {
        try {
            const { trabalhadorId } = req.params;

            const contratos = await prisma.contrato.findMany({
                where: { trabalhadorId },
                include: {
                    empregador: true,
                    cargo: true,
                    lotacao: true
                },
                orderBy: { dataAdmissao: 'desc' }
            });

            res.json(contratos);
        } catch (error) {
            console.error('Erro ao listar contratos:', error);
            res.status(500).json({ error: 'Erro ao listar contratos' });
        }
    }
}
