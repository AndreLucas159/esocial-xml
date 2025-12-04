import prisma from '../../db/prisma';
import { EventType } from '../../types/eventType';

export class S1010Generator {
    /**
     * Gera evento S-1010 (Tabela de Rubricas) a partir do banco de dados
     */
    static async generate(empregadorId: string, rubricaId?: string) {
        // Se rubricaId for fornecido, gera apenas uma rubrica
        // Senão, gera todas as rubricas ativas do empregador

        const where: any = {
            empregadorId,
            ativo: true
        };

        if (rubricaId) {
            where.id = rubricaId;
        }

        const rubricas = await prisma.rubrica.findMany({
            where,
            include: {
                empregador: true
            }
        });

        if (rubricas.length === 0) {
            throw new Error('Nenhuma rubrica encontrada');
        }

        // Pegar dados do empregador da primeira rubrica
        const empregador = rubricas[0].empregador;

        // Montar estrutura do evento S-1010
        const evento = {
            tipo: EventType.S1010,

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

            // Informações das Rubricas
            infoRubrica: rubricas.map((rubrica: typeof rubricas[0]) => ({
                inclusao: {
                    ideRubrica: {
                        codRubr: rubrica.codigo,
                        ideTabRubr: rubrica.id,
                        iniValid: rubrica.vigenciaInicio.toISOString().split('T')[0].replace(/-/g, ''),
                        fimValid: rubrica.vigenciaFim?.toISOString().split('T')[0].replace(/-/g, '')
                    },

                    dadosRubrica: {
                        dscRubr: rubrica.descricao,
                        natRubr: rubrica.natureza.toString(),
                        tpRubr: rubrica.tipo,

                        // Incidências
                        codIncCP: rubrica.incideCp ? '00' : '90',
                        codIncIRRF: rubrica.incideIrrf ? '00' : '90',
                        codIncFGTS: rubrica.incideFgts ? '00' : '90'
                    }
                }
            }))
        };

        return evento;
    }

    /**
     * Gera XML do evento S-1010
     */
    static async generateXml(empregadorId: string, rubricaId?: string): Promise<string> {
        const evento = await this.generate(empregadorId, rubricaId);
        return JSON.stringify(evento, null, 2);
    }
}
