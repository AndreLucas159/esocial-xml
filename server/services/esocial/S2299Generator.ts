import prisma from '../../db/prisma';
import { EventType } from '../../types/eventType';

export class S2299Generator {
    /**
     * Gera evento S-2299 (Desligamento) a partir do banco de dados
     */
    static async generate(contratoId: string) {
        // Buscar contrato com todas as relações
        const contrato = await prisma.contrato.findUnique({
            where: { id: contratoId },
            include: {
                trabalhador: true,
                empregador: true
            }
        });

        if (!contrato) {
            throw new Error('Contrato não encontrado');
        }

        if (!contrato.dataDesligamento) {
            throw new Error('Contrato não possui data de desligamento');
        }

        if (contrato.status !== 'desligado') {
            throw new Error('Contrato não está com status desligado');
        }

        const { trabalhador, empregador } = contrato;

        // Montar estrutura do evento S-2299
        const evento = {
            tipo: EventType.S2299,

            // Identificação do Evento
            ideEvento: {
                indRetif: 1, // Original
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

            // Informações do Desligamento
            infoDeslig: {
                // Data do Desligamento
                dtDeslig: contrato.dataDesligamento.toISOString().split('T')[0],

                // Motivo do Desligamento
                mtvDeslig: '01', // Padrão: Rescisão sem justa causa por iniciativa do empregador

                // Data do Aviso Prévio
                dtAvPrv: null,

                // Indicativo de Aviso Prévio
                indPagtoAvPrv: 'N',

                // Data de Projeção do Término do Aviso Prévio
                dtProjFimAPI: null,

                // Pensão Alimentícia
                pensAlim: 0,

                // Percentual de Pensão Alimentícia
                percAliment: null,

                // Valor de Pensão Alimentícia
                vrAlim: null,

                // Número do Processo Trabalhista
                nrProcTrab: null,

                // Indicativo de Cumprimento de Aviso Prévio
                indCumprParc: null,

                // Quantidade de Dias de Aviso Prévio
                qtdDiasAvPrv: null,

                // Observações
                observacao: null
            }
        };

        return evento;
    }

    /**
     * Gera XML do evento S-2299
     */
    static async generateXml(contratoId: string): Promise<string> {
        const evento = await this.generate(contratoId);
        return JSON.stringify(evento, null, 2);
    }
}
