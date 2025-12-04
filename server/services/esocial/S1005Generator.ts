import prisma from '../../db/prisma';
import { EventType } from '../../types/eventType';

export class S1005Generator {
    /**
     * Gera evento S-1005 (Tabela de Estabelecimentos) a partir do banco de dados
     * Nota: Como não há tabela de Estabelecimentos, usamos o próprio Empregador como Matriz/Filial Principal
     */
    static async generate(empregadorId: string) {
        const empregador = await prisma.empregador.findUnique({
            where: { id: empregadorId }
        });

        if (!empregador) {
            throw new Error('Empregador não encontrado');
        }

        // Montar estrutura do evento S-1005
        const evento = {
            tipo: EventType.S1005,

            // Identificação do Evento
            ideEvento: {
                tpAmb: empregador.ambienteEsocial,
                procEmi: 1,
                verProc: '1.0.0'
            },

            // Identificação do Empregador
            ideEmpregador: {
                tpInsc: empregador.tipoInscricao,
                nrInsc: empregador.cnpj
            },

            // Informações do Estabelecimento
            infoEstab: {
                inclusao: {
                    ideEstab: {
                        tpInsc: empregador.tipoInscricao,
                        nrInsc: empregador.cnpj,
                        iniValid: empregador.createdAt.toISOString().split('T')[0].substring(0, 7), // YYYY-MM
                        fimValid: null
                    },
                    dadosEstab: {
                        cnaePrep: empregador.cnaePrincipal,
                        cnpjResp: null, // Apenas para obras (CNO)
                        aliqGilrat: {
                            aliqRat: 1, // Valor padrão (não tem no banco)
                            fap: 1.0000, // Valor padrão (não tem no banco)
                            procAdmJudRat: null,
                            procAdmJudFap: null
                        },
                        infoCaepf: null,
                        infoObra: null,
                        infoTrab: null
                    }
                }
            }
        };

        return evento;
    }

    /**
     * Gera XML do evento S-1005
     */
    static async generateXml(empregadorId: string): Promise<string> {
        const evento = await this.generate(empregadorId);
        return JSON.stringify(evento, null, 2);
    }
}
