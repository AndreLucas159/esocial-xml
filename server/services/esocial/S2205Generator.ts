import prisma from '../../db/prisma';
import { EventType } from '../../types/eventType';

export class S2205Generator {
    /**
     * Gera evento S-2205 (Alteração de Dados Cadastrais)
     * Requer objeto com os dados da alteração, pois o banco guarda apenas o estado atual.
     */
    static async generate(trabalhadorId: string, alteracaoData: any) {
        const trabalhador = await prisma.trabalhador.findUnique({
            where: { id: trabalhadorId },
            include: {
                empregador: true
            }
        });

        if (!trabalhador) {
            throw new Error('Trabalhador não encontrado');
        }

        const { empregador } = trabalhador;

        const evento = {
            tipo: EventType.S2205,
            ideEvento: {
                tpAmb: empregador.ambienteEsocial,
                procEmi: 1,
                verProc: '1.0.0'
            },
            ideEmpregador: {
                tpInsc: empregador.tipoInscricao,
                nrInsc: empregador.cnpj
            },
            ideTrabalhador: {
                cpfTrab: trabalhador.cpf
            },
            alteracao: {
                dtAlteracao: alteracaoData.dtAlteracao,
                dadosTrabalhador: {
                    nmTrab: alteracaoData.nmTrab || trabalhador.nome,
                    sexo: alteracaoData.sexo || trabalhador.sexo,
                    racaCor: alteracaoData.racaCor || trabalhador.racaCor,
                    estCiv: alteracaoData.estCiv || trabalhador.estadoCivil,
                    grauInstr: alteracaoData.grauInstr || trabalhador.grauInstrucao,
                    paisNac: '105',
                    endereco: {
                        brasil: {
                            tpLograd: 'R',
                            dscLograd: alteracaoData.logradouro || trabalhador.logradouro,
                            nrLograd: alteracaoData.numero || trabalhador.numero,
                            complemento: alteracaoData.complemento || trabalhador.complemento,
                            bairro: alteracaoData.bairro || trabalhador.bairro,
                            cep: alteracaoData.cep || trabalhador.cep,
                            codMunic: alteracaoData.codMunic || '', // Obrigatório
                            uf: alteracaoData.uf || trabalhador.uf
                        }
                    },
                    infoDeficiencia: null, // Opcional
                    contato: {
                        fonePrinc: alteracaoData.telefone || trabalhador.telefone,
                        email: alteracaoData.email || trabalhador.email
                    }
                }
            }
        };

        return evento;
    }

    static async generateXml(trabalhadorId: string, alteracaoData: any): Promise<string> {
        const evento = await this.generate(trabalhadorId, alteracaoData);
        return JSON.stringify(evento, null, 2);
    }
}
