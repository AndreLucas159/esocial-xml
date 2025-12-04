import prisma from '../../db/prisma';
import { S1000Generator } from './S1000Generator';
import { S1010Generator } from './S1010Generator';
import { S1200Generator } from './S1200Generator';
import { S1299Generator } from './S1299Generator';
import { S2200Generator } from './S2200Generator';
import { S2206Generator } from './S2206Generator';
import { S2299Generator } from './S2299Generator';

export class EventQueueService {
    /**
     * Cria um evento na fila para posterior envio
     */
    static async createEvent(
        empregadorId: string,
        tipoEvento: string,
        xmlGerado: string,
        usuarioId?: string
    ) {
        const evento = await prisma.eventoEsocial.create({
            data: {
                empregadorId,
                tipoEvento,
                xmlGerado,
                status: 'pendente',
                usuarioId
            }
        });

        return evento;
    }

    /**
     * Gera e enfileira evento S-1000
     */
    static async generateS1000(empregadorId: string, usuarioId?: string) {
        try {
            const xml = await S1000Generator.generateXml(empregadorId);
            const evento = await this.createEvent(empregadorId, 'S-1000', xml, usuarioId);
            return { success: true, eventoId: evento.id, xml };
        } catch (error) {
            console.error('Erro ao gerar S-1000:', error);
            throw error;
        }
    }

    /**
     * Gera e enfileira evento S-1010 (rubricas)
     */
    static async generateS1010(empregadorId: string, rubricaId?: string, usuarioId?: string) {
        try {
            const xml = await S1010Generator.generateXml(empregadorId, rubricaId);
            const evento = await this.createEvent(empregadorId, 'S-1010', xml, usuarioId);
            return { success: true, eventoId: evento.id, xml };
        } catch (error) {
            console.error('Erro ao gerar S-1010:', error);
            throw error;
        }
    }

    /**
     * Gera e enfileira evento S-1200 (folha)
     */
    static async generateS1200(competenciaId: string, contratoId: string, usuarioId?: string) {
        try {
            const contrato = await prisma.contrato.findUnique({
                where: { id: contratoId },
                select: { empregadorId: true }
            });

            if (!contrato) throw new Error('Contrato não encontrado');

            const xml = await S1200Generator.generateXml(competenciaId, contratoId);
            const evento = await this.createEvent(contrato.empregadorId, 'S-1200', xml, usuarioId);
            return { success: true, eventoId: evento.id, xml };
        } catch (error) {
            console.error('Erro ao gerar S-1200:', error);
            throw error;
        }
    }

    /**
     * Gera e enfileira evento S-1299 (fechamento)
     */
    static async generateS1299(competenciaId: string, usuarioId?: string) {
        try {
            const competencia = await prisma.competencia.findUnique({
                where: { id: competenciaId },
                select: { empregadorId: true }
            });

            if (!competencia) throw new Error('Competência não encontrada');

            const xml = await S1299Generator.generateXml(competenciaId);
            const evento = await this.createEvent(competencia.empregadorId, 'S-1299', xml, usuarioId);
            return { success: true, eventoId: evento.id, xml };
        } catch (error) {
            console.error('Erro ao gerar S-1299:', error);
            throw error;
        }
    }

    /**
     * Gera e enfileira evento S-2200 (admissão)
     */
    static async generateS2200(contratoId: string, usuarioId?: string) {
        try {
            const contrato = await prisma.contrato.findUnique({
                where: { id: contratoId },
                select: { empregadorId: true }
            });

            if (!contrato) throw new Error('Contrato não encontrado');

            const xml = await S2200Generator.generateXml(contratoId);
            const evento = await this.createEvent(contrato.empregadorId, 'S-2200', xml, usuarioId);
            return { success: true, eventoId: evento.id, xml };
        } catch (error) {
            console.error('Erro ao gerar S-2200:', error);
            throw error;
        }
    }

    /**
     * Gera e enfileira evento S-2206 (alteração contratual)
     */
    static async generateS2206(contratoId: string, alteracaoData: any, usuarioId?: string) {
        try {
            const contrato = await prisma.contrato.findUnique({
                where: { id: contratoId },
                select: { empregadorId: true }
            });

            if (!contrato) throw new Error('Contrato não encontrado');

            const xml = await S2206Generator.generateXml(contratoId, alteracaoData);
            const evento = await this.createEvent(contrato.empregadorId, 'S-2206', xml, usuarioId);
            return { success: true, eventoId: evento.id, xml };
        } catch (error) {
            console.error('Erro ao gerar S-2206:', error);
            throw error;
        }
    }

    /**
     * Gera e enfileira evento S-2299 (desligamento)
     */
    static async generateS2299(contratoId: string, usuarioId?: string) {
        try {
            const contrato = await prisma.contrato.findUnique({
                where: { id: contratoId },
                select: { empregadorId: true }
            });

            if (!contrato) throw new Error('Contrato não encontrado');

            const xml = await S2299Generator.generateXml(contratoId);
            const evento = await this.createEvent(contrato.empregadorId, 'S-2299', xml, usuarioId);
            return { success: true, eventoId: evento.id, xml };
        } catch (error) {
            console.error('Erro ao gerar S-2299:', error);
            throw error;
        }
    }

    /**
     * Lista eventos da fila
     */
    static async listEvents(empregadorId: string, status?: string) {
        const where: any = { empregadorId };
        if (status) where.status = status;

        const eventos = await prisma.eventoEsocial.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: 50
        });

        return eventos;
    }

    /**
     * Atualiza status do evento após envio
     */
    static async updateEventStatus(
        eventoId: string,
        status: string,
        protocolo?: string,
        mensagemRetorno?: string
    ) {
        const evento = await prisma.eventoEsocial.update({
            where: { id: eventoId },
            data: {
                status,
                protocolo,
                mensagemRetorno,
                dataEnvio: status === 'enviado' ? new Date() : undefined,
                dataProcessamento: status === 'processado' ? new Date() : undefined
            }
        });

        return evento;
    }
}
