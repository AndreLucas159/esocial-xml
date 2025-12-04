import prisma from '../../db/prisma';
import { EventType } from '../../types/eventType';

export class S2200Generator {
    /**
     * Gera evento S-2200 (Admissão de Trabalhador) a partir do banco de dados
     */
    static async generate(contratoId: string) {
        // Buscar contrato com todas as relações necessárias
        const contrato = await prisma.contrato.findUnique({
            where: { id: contratoId },
            include: {
                trabalhador: {
                    include: {
                        dependentes: {
                            where: { ativo: true }
                        }
                    }
                },
                empregador: true,
                cargo: true,
                lotacao: true
            }
        });

        if (!contrato) {
            throw new Error('Contrato não encontrado');
        }

        const { trabalhador, empregador, cargo, lotacao } = contrato;

        // Montar estrutura do evento S-2200
        const evento = {
            tipo: EventType.S2200,

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

            // Informações do Trabalhador
            trabalhador: {
                // CPF do trabalhador
                cpfTrab: trabalhador.cpf,

                // Nome do trabalhador
                nmTrab: trabalhador.nome,

                // Sexo
                sexo: trabalhador.sexo || 'M',

                // Raça/Cor
                racaCor: trabalhador.racaCor || 1,

                // Estado Civil
                estCiv: trabalhador.estadoCivil || 1,

                // Grau de Instrução
                grauInstr: trabalhador.grauInstrucao || 1,

                // Nome Social (se houver)
                nmSoc: trabalhador.nomeSocial,

                // Nascimento
                nascimento: {
                    dtNascto: trabalhador.dataNascimento.toISOString().split('T')[0],
                    paisNascto: '105', // Brasil
                    paisNac: '105'
                },

                // Documentos
                documentos: {
                    // CTPS
                    CTPS: trabalhador.ctps ? {
                        nrCtps: trabalhador.ctps,
                        serieCtps: trabalhador.ctpsSerie,
                        ufCtps: trabalhador.ctpsUf
                    } : undefined,

                    // RIC (RG)
                    RIC: trabalhador.rg ? {
                        nrRic: trabalhador.rg,
                        orgaoEmissor: trabalhador.rgOrgaoEmissor,
                        dtExped: trabalhador.rgDataEmissao?.toISOString().split('T')[0]
                    } : undefined,

                    // RG
                    RG: trabalhador.rg ? {
                        nrRg: trabalhador.rg,
                        orgaoEmissor: trabalhador.rgOrgaoEmissor,
                        dtExped: trabalhador.rgDataEmissao?.toISOString().split('T')[0]
                    } : undefined
                },

                // Endereço
                endereco: {
                    brasil: {
                        tpLograd: 'R',
                        dscLograd: trabalhador.logradouro,
                        nrLograd: trabalhador.numero,
                        complemento: trabalhador.complemento,
                        bairro: trabalhador.bairro,
                        cep: trabalhador.cep,
                        codMunic: '', // Precisa ser mapeado
                        uf: trabalhador.uf
                    }
                },

                // Dependentes
                dependente: trabalhador.dependentes.map((dep: typeof trabalhador.dependentes[0]) => ({
                    tpDep: dep.tipo.toString().padStart(2, '0'),
                    nmDep: dep.nome,
                    dtNascto: dep.dataNascimento.toISOString().split('T')[0],
                    cpfDep: dep.cpf,
                    depIRRF: dep.depIrrf ? 'S' : 'N',
                    depSF: dep.depSf ? 'S' : 'N',
                    incTrab: 'N'
                })),

                // Contato
                contato: {
                    fonePrinc: trabalhador.telefone?.replace(/\D/g, ''),
                    emailPrinc: trabalhador.email
                }
            },

            // Vínculo
            vinculo: {
                // Matrícula
                matricula: contrato.matricula,

                // Tipo de Regime Trabalhista
                tpRegTrab: 1, // CLT

                // Tipo de Regime Previdenciário
                tpRegPrev: 1, // RGPS

                // Cadastramento Inicial
                cadIni: 'S',

                // Informações do Registro
                infoRegimeTrab: {
                    infoCeletista: {
                        // Data de Admissão
                        dtAdm: contrato.dataAdmissao.toISOString().split('T')[0],

                        // Tipo de Admissão
                        tpAdmissao: 1,

                        // Indicativo de Admissão
                        indAdmissao: 1,

                        // Tipo de Regime Jornada
                        tpRegJor: contrato.tipoJornada || 1,

                        // Natureza da Atividade
                        natAtividade: 1,

                        // Informações do Contrato
                        infoContrato: {
                            // Código da Categoria
                            codCateg: contrato.categoria,

                            // Remuneração
                            remuneracao: {
                                vrSalFx: parseFloat(contrato.salario.toString()),
                                undSalFixo: contrato.tipoSalario || 1,
                                dscSalVar: contrato.tipoSalario === 1 ? undefined : 'Variável'
                            },

                            // Local de Trabalho
                            localTrabalho: {
                                localTrabGeral: {
                                    tpInsc: lotacao?.tipoInscricao || empregador.tipoInscricao,
                                    nrInsc: lotacao?.numeroInscricao || empregador.cnpj,
                                    descComp: lotacao?.descricao
                                }
                            },

                            // Horário Contratual
                            horContratual: {
                                qtdHrsSem: contrato.horasSemanais || 40,
                                tpJornada: contrato.tipoJornada || 2,
                                tmpParc: 0 // Tempo integral
                            },

                            // Aliquota FGTS
                            aliqFGTS: contrato.optanteFgts ? 8 : 0,

                            // Cargo/Função
                            cargoFuncao: cargo ? {
                                nmCargo: cargo.nome,
                                CBOCargo: cargo.cbo
                            } : undefined
                        }
                    }
                }
            }
        };

        return evento;
    }

    /**
     * Gera XML do evento S-2200
     */
    static async generateXml(contratoId: string): Promise<string> {
        const evento = await this.generate(contratoId);
        return JSON.stringify(evento, null, 2);
    }
}
