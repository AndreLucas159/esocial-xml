import prisma from '../../db/prisma';
import { EventType } from '../../types/eventType';

export class S1020Generator {
    /**
     * Gera evento S-1020 (Tabela de Lotações) a partir do banco de dados
     */
    static async generate(empregadorId: string, lotacaoId?: string) {
        // Se lotacaoId for fornecido, gera apenas uma lotação
        // Senão, gera todas as lotações ativas do empregador

        const where: any = {
            empregadorId,
            ativo: true
        };

        if (lotacaoId) {
            where.id = lotacaoId;
        }

        const lotacoes = await prisma.lotacao.findMany({
            where,
            include: {
                empregador: true
            }
        });

        if (lotacoes.length === 0) {
            throw new Error('Nenhuma lotação encontrada');
        }

        // Pegar dados do empregador da primeira lotação
        const empregador = lotacoes[0].empregador;

        // Montar estrutura do evento S-1020
        const evento = {
            tipo: EventType.S1020,

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

            // Informações das Lotações
            infoLotacao: lotacoes.map((lotacao: typeof lotacoes[0]) => ({
                inclusao: {
                    ideLotacao: {
                        codLotacao: lotacao.codigo,
                        iniValid: lotacao.createdAt.toISOString().split('T')[0].substring(0, 7), // YYYY-MM
                        fimValid: null
                    },
                    dadosLotacao: {
                        tpLotacao: '01', // Padrão: Classificação da atividade econômica exercida
                        tpInsc: lotacao.tipoInscricao || empregador.tipoInscricao,
                        nrInsc: lotacao.numeroInscricao || empregador.cnpj,
                        fpasLotacao: {
                            fpas: lotacao.fpas || '515', // Valor padrão comum
                            codTercs: lotacao.codTerceiros || '0000',
                            codTercsSusp: null,
                            infoProcJudTerceiros: null
                        },
                        infoEmprParcial: null,
                        dadosOpPort: null
                    }
                }
            }))
        };

        return evento;
    }

    /**
     * Gera XML do evento S-1020
     */
    static async generateXml(empregadorId: string, lotacaoId?: string): Promise<string> {
        const evento = await this.generate(empregadorId, lotacaoId);
        return JSON.stringify(evento, null, 2);
    }
}
