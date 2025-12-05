import { Request, Response } from 'express';
import prisma from '../db/prisma';
import { XmlBuilder } from '../services/xmlBuilder';

export class EventGenerationController {
    /**
     * Generate S-1000 from form data
     */
    static async generateS1000FromForm(req: Request, res: Response) {
        try {
            const { empregadorId, formData } = req.body;

            if (!empregadorId || !formData) {
                return res.status(400).json({ error: 'empregadorId and formData are required' });
            }

            // Generate XML from form data
            const xml = XmlBuilder.buildS1000(formData);

            // Create event in database
            const evento = await prisma.eventoEsocial.create({
                data: {
                    empregadorId,
                    tipoEvento: 'S-1000',
                    xmlGerado: xml,
                    status: 'pendente'
                }
            });

            res.json({
                success: true,
                eventoId: evento.id,
                xml,
                message: 'Evento S-1000 gerado com sucesso'
            });
        } catch (error) {
            console.error('Error generating S-1000:', error);
            res.status(500).json({ error: 'Erro ao gerar evento S-1000' });
        }
    }

    /**
     * Generate S-1010 from form data
     */
    static async generateS1010FromForm(req: Request, res: Response) {
        try {
            const { empregadorId, formData } = req.body;

            if (!empregadorId || !formData) {
                return res.status(400).json({ error: 'empregadorId and formData are required' });
            }

            const xml = XmlBuilder.buildS1010(formData);

            const evento = await prisma.eventoEsocial.create({
                data: {
                    empregadorId,
                    tipoEvento: 'S-1010',
                    xmlGerado: xml,
                    status: 'pendente'
                }
            });

            res.json({
                success: true,
                eventoId: evento.id,
                xml,
                message: 'Evento S-1010 gerado com sucesso'
            });
        } catch (error) {
            console.error('Error generating S-1010:', error);
            res.status(500).json({ error: 'Erro ao gerar evento S-1010' });
        }
    }

    /**
     * Generate S-1200 from form data
     */
    static async generateS1200FromForm(req: Request, res: Response) {
        try {
            const { empregadorId, formData } = req.body;

            if (!empregadorId || !formData) {
                return res.status(400).json({ error: 'empregadorId and formData are required' });
            }

            const xml = XmlBuilder.buildS1200(formData);

            const evento = await prisma.eventoEsocial.create({
                data: {
                    empregadorId,
                    tipoEvento: 'S-1200',
                    xmlGerado: xml,
                    status: 'pendente'
                }
            });

            res.json({
                success: true,
                eventoId: evento.id,
                xml,
                message: 'Evento S-1200 gerado com sucesso'
            });
        } catch (error) {
            console.error('Error generating S-1200:', error);
            res.status(500).json({ error: 'Erro ao gerar evento S-1200' });
        }
    }

    /**
     * Generic event generation for any event type
     */
    static async generateEvent(req: Request, res: Response) {
        try {
            const { eventType } = req.params;
            const { empregadorId, formData } = req.body;

            if (!empregadorId || !formData) {
                return res.status(400).json({ error: 'empregadorId and formData are required' });
            }

            // Map event type to XML builder method
            const xmlBuilderMethod = `build${eventType.replace('-', '')}`;

            if (typeof (XmlBuilder as any)[xmlBuilderMethod] !== 'function') {
                return res.status(400).json({ error: `Event type ${eventType} not supported` });
            }

            const xml = (XmlBuilder as any)[xmlBuilderMethod](formData);

            const evento = await prisma.eventoEsocial.create({
                data: {
                    empregadorId,
                    tipoEvento: eventType,
                    xmlGerado: xml,
                    status: 'pendente'
                }
            });

            res.json({
                success: true,
                eventoId: evento.id,
                xml,
                message: `Evento ${eventType} gerado com sucesso`
            });
        } catch (error) {
            console.error('Error generating event:', error);
            res.status(500).json({ error: 'Erro ao gerar evento' });
        }
    }
}
