import prisma from '../../db/prisma';
import { EventType } from '../../types/eventType';

export class S2190Generator {
    /**
     * Gera evento S-2190 (Admissão Preliminar) a partir do banco de dados
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

        const { trabalhador, empregador } = contrato;

        const evento = {
            tipo: EventType.S2190,
            ideEvento: {
                tpAmb: empregador.ambienteEsocial,
                procEmi: 1,
                verProc: '1.0.0'
            },
            ideEmpregador: {
                tpInsc: empregador.tipoInscricao,
                nrInsc: empregador.cnpj
            },
            infoRegPrelim: {
                cpfTrab: trabalhador.cpf,
                dtNasc: trabalhador.dataNascimento.toISOString().split('T')[0],
                dtAdm: contrato.dataAdmissao.toISOString().split('T')[0],
                matricula: contrato.matricula,
                codCateg: contrato.categoria,
                natAtividade: 1, // Urbano (Padrão)
                infoRegCTPS: null // Opcional
            }
        };

        return evento;
    }

    static async generateXml(contratoId: string): Promise<string> {
        const evento = await this.generate(contratoId);
        return JSON.stringify(evento, null, 2);
    }
}
