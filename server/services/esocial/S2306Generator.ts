import prisma from '../../db/prisma';
import { EventType } from '../../types/eventType';

export class S2306Generator {
    /**
     * Gera evento S-2306 (TSVE - Alteração Contratual)
     */
    static async generate(contratoId: string, alteracaoData: any) {
        const contrato = await prisma.contrato.findUnique({
            where: { id: contratoId },
            include: {
                trabalhador: true,
                empregador: true,
                cargo: true
            }
        });

        if (!contrato) {
            throw new Error('Contrato não encontrado');
        }

        const { trabalhador, empregador, cargo } = contrato;

        const evento = {
            tipo: EventType.S2306,
            ideEvento: {
                tpAmb: empregador.ambienteEsocial,
                procEmi: 1,
                verProc: '1.0.0'
            },
            ideEmpregador: {
                tpInsc: empregador.tipoInscricao,
                nrInsc: empregador.cnpj
            },
            ideTrabSemVinculo: {
                cpfTrab: trabalhador.cpf,
                matricula: contrato.matricula,
                codCateg: contrato.categoria
            },
            infoTSVAlteracao: {
                dtAlteracao: alteracaoData.dtAlteracao,
                natAtividade: 1,
                infoComplementares: {
                    cargoFuncao: {
                        nmCargo: alteracaoData.nmCargo || cargo?.nome,
                        CBOCargo: alteracaoData.CBOCargo || cargo?.cbo
                    },
                    remuneracao: alteracaoData.salario ? {
                        vrSalFx: parseFloat(alteracaoData.salario),
                        undSalFixo: contrato.tipoSalario || 1
                    } : undefined
                }
            }
        };

        return evento;
    }

    static async generateXml(contratoId: string, alteracaoData: any): Promise<string> {
        const evento = await this.generate(contratoId, alteracaoData);
        return JSON.stringify(evento, null, 2);
    }
}
