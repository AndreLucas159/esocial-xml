import prisma from '../../db/prisma';
import { EventType } from '../../types/eventType';

export class S2399Generator {
    /**
     * Gera evento S-2399 (TSVE - Término)
     */
    static async generate(contratoId: string) {
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

        const { trabalhador, empregador } = contrato;

        const evento = {
            tipo: EventType.S2399,
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
            infoTSVTermino: {
                dtTerm: contrato.dataDesligamento.toISOString().split('T')[0],
                mtvDesligTSV: '99', // Outros (Padrão)
                verbasResc: null // Implementar se houver verbas
            }
        };

        return evento;
    }

    static async generateXml(contratoId: string): Promise<string> {
        const evento = await this.generate(contratoId);
        return JSON.stringify(evento, null, 2);
    }
}
