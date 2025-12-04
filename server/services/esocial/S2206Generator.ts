import prisma from '../../db/prisma';
import { EventType } from '../../types/eventType';

export class S2206Generator {
    /**
     * Gera evento S-2206 (Alteração de Contrato de Trabalho) a partir do banco de dados
     */
    static async generate(contratoId: string, alteracaoData: any) {
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

        const { trabalhador, empregador, cargo } = contrato;

        // Montar estrutura do evento S-2206
        const evento = {
            tipo: EventType.S2206,

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

            // Informações da Alteração
            altContratual: {
                // Data da Alteração
                dtAlteracao: alteracaoData.dtAlteracao,

                // Data do Efeito da Alteração
                dtEf: alteracaoData.dtEf || alteracaoData.dtAlteracao,

                // Descrição da Alteração
                dscAlt: alteracaoData.dscAlt || 'Alteração contratual',

                // Informações de Contrato
                infoContrato: {
                    // Código da Categoria (se alterou)
                    codCateg: alteracaoData.codCateg || contrato.categoria,

                    // Remuneração (se alterou)
                    remuneracao: alteracaoData.salario ? {
                        vrSalFx: parseFloat(alteracaoData.salario),
                        undSalFixo: contrato.tipoSalario || 1
                    } : undefined,

                    // Duração do Contrato (se alterou)
                    duracao: alteracaoData.duracao,

                    // Local de Trabalho (se alterou)
                    localTrabalho: alteracaoData.localTrabalho,

                    // Horário Contratual (se alterou)
                    horContratual: alteracaoData.horasSemanais ? {
                        qtdHrsSem: alteracaoData.horasSemanais,
                        tpJornada: contrato.tipoJornada || 2,
                        tmpParc: 0
                    } : undefined,

                    // Cargo/Função (se alterou)
                    cargoFuncao: alteracaoData.cargoId || cargo ? {
                        nmCargo: alteracaoData.nmCargo || cargo?.nome,
                        CBOCargo: alteracaoData.CBOCargo || cargo?.cbo
                    } : undefined
                }
            }
        };

        return evento;
    }

    /**
     * Gera XML do evento S-2206
     */
    static async generateXml(contratoId: string, alteracaoData: any): Promise<string> {
        const evento = await this.generate(contratoId, alteracaoData);
        return JSON.stringify(evento, null, 2);
    }
}
