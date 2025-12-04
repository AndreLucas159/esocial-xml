import prisma from '../../db/prisma';
import { EventType } from '../../types/eventType';

export class S1200Generator {
    /**
     * Gera evento S-1200 (Remuneração de Trabalhador) a partir do banco de dados
     */
    static async generate(competenciaId: string, contratoId: string) {
        // Buscar competência
        const competencia = await prisma.competencia.findUnique({
            where: { id: competenciaId },
            include: {
                empregador: true
            }
        });

        if (!competencia) {
            throw new Error('Competência não encontrada');
        }

        // Buscar contrato
        const contrato = await prisma.contrato.findUnique({
            where: { id: contratoId },
            include: {
                trabalhador: true,
                empregador: true,
                cargo: true,
                lotacao: true
            }
        });

        if (!contrato) {
            throw new Error('Contrato não encontrado');
        }

        // Buscar lançamentos da folha
        const lancamentos = await prisma.lancamentoFolha.findMany({
            where: {
                competenciaId,
                contratoId
            },
            include: {
                rubrica: true
            }
        });

        if (lancamentos.length === 0) {
            throw new Error('Nenhum lançamento encontrado para esta competência');
        }

        const { empregador, trabalhador } = contrato;
        const perApur = `${competencia.ano}-${competencia.mes.toString().padStart(2, '0')}`;

        // Montar estrutura do evento S-1200
        const evento = {
            tipo: EventType.S1200,

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

            // Identificação do Trabalhador
            ideTrabalhador: {
                cpfTrab: trabalhador.cpf
            },

            // Demonstrativos de Valores Devidos
            dmDev: [{
                ideDmDev: '1',
                codCateg: contrato.categoria,

                // Informações de Remuneração por Estabelecimento/Lotação
                infoPerApur: {
                    ideEstabLot: [{
                        tpInsc: contrato.lotacao?.tipoInscricao || empregador.tipoInscricao,
                        nrInsc: contrato.lotacao?.numeroInscricao || empregador.cnpj,
                        codLotacao: contrato.lotacao?.codigo || 'DEFAULT',

                        // Remuneração do Trabalhador
                        remunPerApur: [{
                            matricula: contrato.matricula,
                            codCateg: contrato.categoria,

                            // Itens da Remuneração
                            itensRemun: lancamentos.map((lanc: typeof lancamentos[0]): {
                                codRubr: string;
                                ideTabRubr: string;
                                qtdRubr: number;
                                fatorRubr: number;
                                vrRubr: number;
                                indApurIR: number;
                            } => ({
                                codRubr: lanc.codigoRubrica,
                                ideTabRubr: lanc.rubricaId || lanc.codigoRubrica,
                                qtdRubr: parseFloat(lanc.quantidade.toString()),
                                fatorRubr: 1,
                                vrRubr: parseFloat(lanc.valor.toString()),
                                indApurIR: 0 // Mensal
                            }))
                        }]
                    }]
                }
            }]
        };

        return evento;
    }

    /**
     * Gera XML do evento S-1200
     */
    static async generateXml(competenciaId: string, contratoId: string): Promise<string> {
        const evento = await this.generate(competenciaId, contratoId);
        return JSON.stringify(evento, null, 2);
    }
}
