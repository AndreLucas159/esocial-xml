import prisma from '../../db/prisma';
import { EventType } from '../../types/eventType';

export class S2300Generator {
    /**
     * Gera evento S-2300 (TSVE - Início) a partir do banco de dados
     */
    static async generate(contratoId: string) {
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

        // Validar categoria (deve ser TSVE: 7xx ou 9xx)
        if (contrato.categoria < 700) {
            throw new Error('Categoria do contrato não é compatível com TSVE (S-2300). Use S-2200.');
        }

        const { trabalhador, empregador, cargo } = contrato;

        const evento = {
            tipo: EventType.S2300,
            ideEvento: {
                tpAmb: empregador.ambienteEsocial,
                procEmi: 1,
                verProc: '1.0.0'
            },
            ideEmpregador: {
                tpInsc: empregador.tipoInscricao,
                nrInsc: empregador.cnpj
            },
            trabalhador: {
                cpfTrab: trabalhador.cpf,
                nmTrab: trabalhador.nome,
                dtNasc: trabalhador.dataNascimento.toISOString().split('T')[0],
                sexo: trabalhador.sexo,
                racaCor: trabalhador.racaCor,
                estCiv: trabalhador.estadoCivil,
                grauInstr: trabalhador.grauInstrucao,
                endereco: {
                    brasil: {
                        tpLograd: 'R',
                        dscLograd: trabalhador.logradouro,
                        nrLograd: trabalhador.numero,
                        complemento: trabalhador.complemento,
                        bairro: trabalhador.bairro,
                        cep: trabalhador.cep,
                        codMunic: '',
                        uf: trabalhador.uf
                    }
                }
            },
            infoTSVInicio: {
                matricula: contrato.matricula, // Opcional para alguns, obrigatório para outros
                codCateg: contrato.categoria,
                dtInicio: contrato.dataAdmissao.toISOString().split('T')[0],
                natAtividade: 1,
                infoComplementares: {
                    cargoFuncao: {
                        nmCargo: cargo?.nome,
                        CBOCargo: cargo?.cbo
                    },
                    remuneracao: {
                        vrSalFx: parseFloat(contrato.salario.toString()),
                        undSalFixo: contrato.tipoSalario || 1
                    },
                    localTrabGeral: {
                        tpInsc: contrato.lotacao?.tipoInscricao || empregador.tipoInscricao,
                        nrInsc: contrato.lotacao?.numeroInscricao || empregador.cnpj,
                        descComp: contrato.lotacao?.descricao
                    }
                }
            }
        };

        return evento;
    }

    static async generateXml(contratoId: string): Promise<string> {
        const evento = await this.generate(contratoId);
        return JSON.stringify(evento, null, 2);
    }
}
