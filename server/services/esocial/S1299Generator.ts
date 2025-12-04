import prisma from '../../db/prisma';
import { EventType } from '../../types/eventType';

export class S1299Generator {
    /**
     * Gera evento S-1299 (Fechamento de Eventos Periódicos) a partir do banco de dados
     */
    static async generate(competenciaId: string) {
        // Buscar competência
        const competencia = await prisma.competencia.findUnique({
            where: { id: competenciaId },
            include: {
                empregador: true,
                lancamentosFolha: {
                    include: {
                        contrato: {
                            include: {
                                trabalhador: true
                            }
                        }
                    }
                }
            }
        });

        if (!competencia) {
            throw new Error('Competência não encontrada');
        }

        if (competencia.status !== 'aberta') {
            throw new Error('Competência já foi fechada');
        }

        const { empregador } = competencia;
        const perApur = `${competencia.ano}-${competencia.mes.toString().padStart(2, '0')}`;

        // Verificar se há eventos S-1200 enviados
        const hasS1200 = competencia.lancamentosFolha.length > 0;

        // Montar estrutura do evento S-1299
        const evento = {
            tipo: EventType.S1299,

            // Identificação do Evento
            ideEvento: {
                indRetif: 1, // Original
                nrRecibo: null,
                indApuracao: 1, // Mensal
                perApur,
                tpAmb: empregador.ambienteEsocial,
                procEmi: 1,
                verProc: '1.0.0'
            },

            // Identificação do Empregador
            ideEmpregador: {
                tpInsc: empregador.tipoInscricao,
                nrInsc: empregador.cnpj
            },

            // Informações de Fechamento
            infoFech: {
                evtRemun: hasS1200 ? 'S' : 'N', // Há eventos S-1200?
                evtPgtos: 'N', // S-1210 (não implementado ainda)
                evtAquis: 'N', // S-1260 (não implementado)
                evtComProd: 'N', // S-1270 (não implementado)
                evtContratAvNP: 'N', // S-1280 (não implementado)
                evtInfoComplPer: 'N', // S-1295 (não implementado)
                compSemMovto: hasS1200 ? null : perApur // Se não tem movimento, informar competência
            }
        };

        return evento;
    }

    /**
     * Gera XML do evento S-1299
     */
    static async generateXml(competenciaId: string): Promise<string> {
        const evento = await this.generate(competenciaId);
        return JSON.stringify(evento, null, 2);
    }
}
