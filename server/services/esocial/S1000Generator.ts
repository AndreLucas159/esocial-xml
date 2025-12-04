import prisma from '../../db/prisma';
import { EventType } from '../../types/eventType';

export class S1000Generator {
    /**
     * Gera evento S-1000 (Informações do Empregador) a partir do banco de dados
     */
    static async generate(empregadorId: string) {
        // Buscar empregador no banco
        const empregador = await prisma.empregador.findUnique({
            where: { id: empregadorId }
        });

        if (!empregador) {
            throw new Error('Empregador não encontrado');
        }

        // Montar estrutura do evento S-1000
        const evento = {
            tipo: EventType.S1000,

            // Identificação do Evento
            ideEvento: {
                tpAmb: empregador.ambienteEsocial,
                procEmi: 1, // Aplicação do empregador
                verProc: '1.0.0'
            },

            // Identificação do Empregador
            ideEmpregador: {
                tpInsc: empregador.tipoInscricao,
                nrInsc: empregador.cnpj
            },

            // Informações do Empregador
            infoEmpregador: {
                nmRazao: empregador.razaoSocial,
                classTrib: empregador.classificacaoTributaria?.toString() || '00',

                // Informações Cadastrais
                infoCadastro: {
                    nmRazao: empregador.razaoSocial,
                    nmFantasia: empregador.nomeFantasia,
                    classTrib: empregador.classificacaoTributaria?.toString() || '00',
                    natJurid: empregador.naturezaJuridica,

                    // Dados do Contato
                    contato: {
                        nmCtt: empregador.razaoSocial,
                        cpfCtt: '',
                        foneFixo: empregador.telefone?.replace(/\D/g, ''),
                        email: empregador.email
                    },

                    // Endereço
                    endereco: {
                        tpLograd: 'R',
                        dscLograd: empregador.logradouro,
                        nrLograd: empregador.numero,
                        complemento: empregador.complemento,
                        bairro: empregador.bairro,
                        cep: empregador.cep,
                        codMunic: '', // Precisa ser mapeado
                        uf: empregador.uf
                    }
                },

                // CNAE Principal
                infoCNAE: {
                    cnae: empregador.cnaePrincipal
                }
            }
        };

        return evento;
    }

    /**
     * Gera XML do evento S-1000
     */
    static async generateXml(empregadorId: string): Promise<string> {
        const evento = await this.generate(empregadorId);

        // Aqui você pode usar o eventLibrary existente para gerar o XML
        // Por enquanto, retornamos a estrutura do objeto
        return JSON.stringify(evento, null, 2);
    }
}
