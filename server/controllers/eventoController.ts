import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { EventQueueService } from '../services/esocial/EventQueueService';

export class EventoController {
    // Gerar S-1000 (Informações do Empregador)
    static async generateS1000(req: AuthRequest, res: Response) {
        try {
            const { empregadorId } = req.params;
            const result = await EventQueueService.generateS1000(empregadorId, req.userId);
            res.json(result);
        } catch (error) {
            console.error('Erro ao gerar S-1000:', error);
            res.status(500).json({ error: 'Erro ao gerar evento S-1000' });
        }
    }

    // Gerar S-1010 (Tabela de Rubricas)
    static async generateS1010(req: AuthRequest, res: Response) {
        try {
            const { empregadorId } = req.params;
            const { rubricaId } = req.query;
            const result = await EventQueueService.generateS1010(empregadorId, rubricaId as string, req.userId);
            res.json(result);
        } catch (error) {
            console.error('Erro ao gerar S-1010:', error);
            res.status(500).json({ error: 'Erro ao gerar evento S-1010' });
        }
    }

    // Gerar S-1200 (Remuneração)
    static async generateS1200(req: AuthRequest, res: Response) {
        try {
            const { competenciaId, contratoId } = req.params;
            const result = await EventQueueService.generateS1200(competenciaId, contratoId, req.userId);
            res.json(result);
        } catch (error) {
            console.error('Erro ao gerar S-1200:', error);
            res.status(500).json({ error: 'Erro ao gerar evento S-1200' });
        }
    }

    // Gerar S-1299 (Fechamento)
    static async generateS1299(req: AuthRequest, res: Response) {
        try {
            const { competenciaId } = req.params;
            const result = await EventQueueService.generateS1299(competenciaId, req.userId);
            res.json(result);
        } catch (error) {
            console.error('Erro ao gerar S-1299:', error);
            res.status(500).json({ error: 'Erro ao gerar evento S-1299' });
        }
    }

    // Gerar S-2200 (Admissão de Trabalhador)
    static async generateS2200(req: AuthRequest, res: Response) {
        try {
            const { contratoId } = req.params;
            const result = await EventQueueService.generateS2200(contratoId, req.userId);
            res.json(result);
        } catch (error) {
            console.error('Erro ao gerar S-2200:', error);
            res.status(500).json({ error: 'Erro ao gerar evento S-2200' });
        }
    }

    // Gerar S-2206 (Alteração Contratual)
    static async generateS2206(req: AuthRequest, res: Response) {
        try {
            const { contratoId } = req.params;
            const alteracaoData = req.body;
            const result = await EventQueueService.generateS2206(contratoId, alteracaoData, req.userId);
            res.json(result);
        } catch (error) {
            console.error('Erro ao gerar S-2206:', error);
            res.status(500).json({ error: 'Erro ao gerar evento S-2206' });
        }
    }

    // Gerar S-2299 (Desligamento)
    static async generateS2299(req: AuthRequest, res: Response) {
        try {
            const { contratoId } = req.params;
            const result = await EventQueueService.generateS2299(contratoId, req.userId);
            res.json(result);
        } catch (error) {
            console.error('Erro ao gerar S-2299:', error);
            res.status(500).json({ error: 'Erro ao gerar evento S-2299' });
        }
    }

    // Listar eventos da fila
    static async listEvents(req: AuthRequest, res: Response) {
        try {
            const { empregadorId } = req.params;
            const { status } = req.query;
            const eventos = await EventQueueService.listEvents(empregadorId, status as string);
            res.json(eventos);
        } catch (error) {
            console.error('Erro ao listar eventos:', error);
            res.status(500).json({ error: 'Erro ao listar eventos' });
        }
    }

    // Atualizar status do evento
    static async updateEventStatus(req: AuthRequest, res: Response) {
        try {
            const { eventoId } = req.params;
            const { status, protocolo, mensagemRetorno } = req.body;
            const evento = await EventQueueService.updateEventStatus(eventoId, status, protocolo, mensagemRetorno);
            res.json(evento);
        } catch (error) {
            console.error('Erro ao atualizar evento:', error);
            res.status(500).json({ error: 'Erro ao atualizar evento' });
        }
    }
}
