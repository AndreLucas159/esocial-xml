import prisma from '../../db/prisma';
import { EventType } from '../../types/eventType';

export class S2230Generator {
    /**
     * Gera evento S-2230 (Afastamento Temporário) a partir do banco de dados
     */
    static async generate(afastamentoId: string) {
        // Buscar afastamento com contrato e trabalhador
        const afastamento = await prisma.afastamento.findUnique({
            where: { id: afastamentoId },
            include: {
                contrato: {
                    include: {
                        trabalhador: true,
                        empregador: true
                    }
                }
            }
        });

        if (!afastamento) {
            throw new Error('Afastamento não encontrado');
        }

        const { contrato } = afastamento;
        const { trabalhador, empregador } = contrato;

        // Montar estrutura do evento S-2230
        const evento = {
            tipo: EventType.S2230,

            // Identificação do Evento
            ideEvento: {
                indRetif: 1,
                nrRecibo: null,
                tpAmb: empregador.ambienteEsocial,
                procEmi: 1,
                verProc: '1.0.0'
            },

            // Identificação do Empregador
            ideEmpregador: {
                tpInsc: empregador.tipoInscricao,
                nrInsc: empregador.cnpj
            },

            // Identificação do Vínculo
            ideVinculo: {
                cpfTrab: trabalhador.cpf,
                matricula: contrato.matricula
            },

            // Informações do Afastamento
            infoAfastamento: {
                iniAfastamento: {
                    dtIniAfast: afastamento.dataInicio.toISOString().split('T')[0],
                    codMotAfast: afastamento.motivo.toString().padStart(2, '0'),
                    infoMesmoMtv: 'N', // Padrão
                    tpAcidTransito: null,
                    observacao: afastamento.observacao
                },
                // Se tiver data fim, preenche também o fimAfastamento (ou deve ser evento separado? 
                // No S-2230 pode mandar inicio e fim se for retificação ou envio tardio, mas geralmente é separado.
                // Vamos assumir que se tiver dataFim, manda.
                fimAfastamento: afastamento.dataFim ? {
                    dtTermAfast: afastamento.dataFim.toISOString().split('T')[0]
                } : undefined
            }
        };

        return evento;
    }

    /**
     * Gera XML do evento S-2230
     */
    static async generateXml(afastamentoId: string): Promise<string> {
        const evento = await this.generate(afastamentoId);
        return JSON.stringify(evento, null, 2);
    }
}
