

import { EventSchema, InscriptionType, Environment, FormField, EventType } from '../types';
import { getCategoriasGroupedOptions } from '../data/categorias';
import { getNaturezasOptions } from '../data/naturezasRubricas';

const commonIdentification: FormField[] = [
  { name: 'tpAmb', label: 'Ambiente', type: 'select', path: 'tpAmb', required: true, group: 'Controle', options: [{ label: 'Produção', value: 1 }, { label: 'Produção Restrita (Testes)', value: 2 }] },
  { name: 'tpInsc', label: 'Tipo Inscrição Empregador', type: 'select', path: 'tpInsc', required: true, group: 'Controle', options: [{ label: 'CNPJ', value: 1 }, { label: 'CPF', value: 2 }] },
  { name: 'nrInsc', label: 'Número Inscrição Empregador', type: 'text', path: 'nrInsc', required: true, maxLength: 14, group: 'Controle' },
];

export const EVENT_SCHEMAS: Record<string, EventSchema> = {
  // --- TABELAS (TABLES) ---
  [EventType.S1000]: {
    id: EventType.S1000,
    title: 'Informações do Empregador',
    description: 'Cadastro das informações do empregador e configurações tributárias.',
    defaultState: {
      tpAmb: Environment.ProductionRestricted,
      procEmi: 1, verProc: '1.0.0', tpInsc: 1, nrInsc: '',
      infoEmpregador: { inclusao: { idePeriodo: { iniValid: '' }, infoCadastro: { classTrib: '', indCoop: 0, indConstr: 0, indDesFolha: 0, contato: { nmCtt: '', cpfCtt: '', email: '' } } } }
    },
    fields: [
      ...commonIdentification,
      { name: 'iniValid', label: 'Início Validade', type: 'month', path: 'infoEmpregador.inclusao.idePeriodo.iniValid', required: true, group: 'Vigência' },
      { name: 'classTrib', label: 'Classificação Tributária', type: 'text', path: 'infoEmpregador.inclusao.infoCadastro.classTrib', required: true, group: 'Dados Tributários', placeholder: 'Ex: 99 (PJ em Geral)' },
      { name: 'indCoop', label: 'Ind. Cooperativa', type: 'select', path: 'infoEmpregador.inclusao.infoCadastro.indCoop', required: true, group: 'Dados Tributários', options: [{ label: '0 - Não é cooperativa', value: 0 }, { label: '1 - Coop. Trabalho', value: 1 }] },
      { name: 'indConstr', label: 'Ind. Construtora', type: 'select', path: 'infoEmpregador.inclusao.infoCadastro.indConstr', required: true, group: 'Dados Tributários', options: [{ label: '0 - Não é Construtora', value: 0 }, { label: '1 - Empresa Construtora', value: 1 }] },
      { name: 'indDesFolha', label: 'Desoneração Folha', type: 'select', path: 'infoEmpregador.inclusao.infoCadastro.indDesFolha', required: true, group: 'Dados Tributários', options: [{ label: '0 - Não Aplicável', value: 0 }, { label: '1 - Empresa Enquadrada', value: 1 }] },
      { name: 'nmCtt', label: 'Nome do Contato', type: 'text', path: 'infoEmpregador.inclusao.infoCadastro.contato.nmCtt', required: true, group: 'Contato' },
      { name: 'cpfCtt', label: 'CPF do Contato', type: 'text', path: 'infoEmpregador.inclusao.infoCadastro.contato.cpfCtt', required: true, group: 'Contato', maxLength: 11 },
      { name: 'email', label: 'Email', type: 'email', path: 'infoEmpregador.inclusao.infoCadastro.contato.email', required: true, group: 'Contato' },
    ]
  },
  [EventType.S1005]: {
    id: EventType.S1005,
    title: 'Tabela de Estabelecimentos',
    description: 'Cadastro de filiais, obras (CNO) ou CAEPF.',
    defaultState: {
      tpAmb: 2, tpInsc: 1, nrInsc: '',
      ideEvento: { indRetif: 1, nrRecibo: '', tpAmb: 2, procEmi: 1, verProc: '1.0.0' },
      ideEmpregador: { tpInsc: 1, nrInsc: '' },
      infoEstab: {
        inclusao: {
          ideEstab: { tpInsc: 1, nrInsc: '', iniValid: '', fimValid: '' },
          dadosEstab: {
            cnaePrep: '',
            cnpjResp: '',
            aliqGilrat: { aliqRat: 1, fap: 1.0000, procAdmJudRat: { tpProc: 1, nrProc: '', codSusp: 0 }, procAdmJudFap: { tpProc: 1, nrProc: '', codSusp: 0 } },
            infoCaepf: { tpCaepf: 1 },
            infoObra: { indSubstPatrObra: 1 },
            infoTrab: {
              infoApr: { nrProcJud: '', infoEntEduc: [{ nrInsc: '' }] },
              infoPCD: { nrProcJud: '' }
            }
          }
        }
      }
    },
    fields: [
      ...commonIdentification,
      { name: 'iniValid', label: 'Início Validade', type: 'month', path: 'infoEstab.inclusao.ideEstab.iniValid', required: true, group: 'Vigência' },
      { name: 'fimValid', label: 'Fim Validade', type: 'month', path: 'infoEstab.inclusao.ideEstab.fimValid', required: false, group: 'Vigência' },
      { name: 'tpInscEstab', label: 'Tipo Inscrição Estab.', type: 'select', path: 'infoEstab.inclusao.ideEstab.tpInsc', required: true, group: 'Estabelecimento', options: [{ label: 'CNPJ', value: 1 }, { label: 'CAEPF', value: 3 }, { label: 'CNO', value: 4 }] },
      { name: 'nrInscEstab', label: 'Número Inscrição Estab.', type: 'text', path: 'infoEstab.inclusao.ideEstab.nrInsc', required: true, maxLength: 14, group: 'Estabelecimento' },
      { name: 'cnaePrep', label: 'CNAE Preponderante', type: 'text', path: 'infoEstab.inclusao.dadosEstab.cnaePrep', required: true, group: 'Dados Técnicos', maxLength: 7 },
      { name: 'aliqRat', label: 'Alíquota RAT', type: 'select', path: 'infoEstab.inclusao.dadosEstab.aliqGilrat.aliqRat', required: true, group: 'Dados Técnicos', options: [{ label: '1%', value: 1 }, { label: '2%', value: 2 }, { label: '3%', value: 3 }] },
      { name: 'fap', label: 'FAP', type: 'number', path: 'infoEstab.inclusao.dadosEstab.aliqGilrat.fap', required: true, group: 'Dados Técnicos', placeholder: '1.0000' },
      { name: 'cnpjResp', label: 'CNPJ Responsável (CNO)', type: 'text', path: 'infoEstab.inclusao.dadosEstab.cnpjResp', required: false, maxLength: 14, group: 'Dados Técnicos' },
    ]
  },
  [EventType.S1010]: {
    id: EventType.S1010,
    title: 'Tabela de Rubricas',
    description: 'Detalhamento das rubricas da folha de pagamento.',
    defaultState: {
      tpAmb: 2, tpInsc: 1, nrInsc: '',
      ideEvento: { indRetif: 1, nrRecibo: '', tpAmb: 2, procEmi: 1, verProc: '1.0.0' },
      ideEmpregador: { tpInsc: 1, nrInsc: '' },
      infoRubrica: {
        inclusao: {
          ideRubrica: { codRubr: '', ideTabRubr: '', iniValid: '', fimValid: '' },
          dadosRubrica: {
            dscRubr: '',
            natRubr: '1000',
            tpRubr: 1,
            codIncCP: '00',
            codIncIRRF: 0,
            codIncFGTS: '00',
            codIncCPRP: '00',
            codIncPisPasep: '00',
            tetoRemun: 'N',
            observacao: '',
            ideProcessoCP: [{ tpProc: 1, nrProc: '', extDecisao: 1, codSusp: 0 }],
            ideProcessoIRRF: [{ nrProc: '', codSusp: 0 }],
            ideProcessoFGTS: [{ nrProc: '' }],
            ideProcessoPisPasep: [{ nrProc: '', codSusp: 0 }]
          }
        }
      }
    },
    fields: [
      ...commonIdentification,
      { name: 'iniValid', label: 'Início Validade', type: 'month', path: 'infoRubrica.inclusao.ideRubrica.iniValid', required: true, group: 'Vigência' },
      { name: 'fimValid', label: 'Fim Validade', type: 'month', path: 'infoRubrica.inclusao.ideRubrica.fimValid', required: false, group: 'Vigência' },
      { name: 'codRubr', label: 'Código da Rubrica', type: 'text', path: 'infoRubrica.inclusao.ideRubrica.codRubr', required: true, maxLength: 30, group: 'Identificação' },
      { name: 'ideTabRubr', label: 'ID Tabela Rubrica', type: 'text', path: 'infoRubrica.inclusao.ideRubrica.ideTabRubr', required: true, maxLength: 30, group: 'Identificação' },
      { name: 'dscRubr', label: 'Descrição', type: 'text', path: 'infoRubrica.inclusao.dadosRubrica.dscRubr', required: true, maxLength: 100, group: 'Dados' },
      { name: 'natRubr', label: 'Natureza', type: 'text', path: 'infoRubrica.inclusao.dadosRubrica.natRubr', required: true, maxLength: 4, group: 'Dados', placeholder: 'Ex: 1000' },
      { name: 'tpRubr', label: 'Tipo', type: 'select', path: 'infoRubrica.inclusao.dadosRubrica.tpRubr', required: true, group: 'Dados', options: [{ label: '1 - Vencimento', value: 1 }, { label: '2 - Desconto', value: 2 }, { label: '3 - Informativa', value: 3 }, { label: '4 - Inf. Dedutora', value: 4 }] },
      { name: 'codIncCP', label: 'Incidência CP', type: 'text', path: 'infoRubrica.inclusao.dadosRubrica.codIncCP', required: true, group: 'Incidências', placeholder: 'Ex: 11 (Mensal)' },
      { name: 'codIncFGTS', label: 'Incidência FGTS', type: 'text', path: 'infoRubrica.inclusao.dadosRubrica.codIncFGTS', required: true, group: 'Incidências', placeholder: 'Ex: 11 (Mensal)' },
      { name: 'codIncIRRF', label: 'Incidência IRRF', type: 'number', path: 'infoRubrica.inclusao.dadosRubrica.codIncIRRF', required: true, group: 'Incidências', placeholder: 'Ex: 11 (Mensal)' },
      { name: 'codIncCPRP', label: 'Incidência RPPS (Público)', type: 'text', path: 'infoRubrica.inclusao.dadosRubrica.codIncCPRP', required: false, group: 'Incidências', placeholder: 'Ex: 11' },
      { name: 'codIncPisPasep', label: 'Incidência PIS/PASEP', type: 'text', path: 'infoRubrica.inclusao.dadosRubrica.codIncPisPasep', required: false, group: 'Incidências', placeholder: 'Ex: 11' },
    ]
  },
  [EventType.S1020]: {
    id: EventType.S1020,
    title: 'Tabela de Lotações',
    description: 'Classificação da atividade para fins de atribuição do código FPAS.',
    defaultState: {
      tpAmb: 2, tpInsc: 1, nrInsc: '',
      ideEvento: { indRetif: 1, nrRecibo: '', tpAmb: 2, procEmi: 1, verProc: '1.0.0' },
      ideEmpregador: { tpInsc: 1, nrInsc: '' },
      infoLotacao: {
        inclusao: {
          ideLotacao: { codLotacao: '', iniValid: '', fimValid: '' },
          dadosLotacao: {
            tpLotacao: '01',
            tpInsc: 1, nrInsc: '',
            fpasLotacao: {
              fpas: '515',
              codTercs: '0000',
              codTercsSusp: '',
              infoProcJudTerceiros: { procJudTerceiro: [{ codTerc: '', nrProcJud: '', codSusp: 0 }] }
            },
            infoEmprParcial: { tpInscContrat: 1, nrInscContrat: '', tpInscProp: 1, nrInscProp: '' },
            dadosOpPort: { aliqRat: 1, fap: 1.0000 }
          }
        }
      }
    },
    fields: [
      ...commonIdentification,
      { name: 'iniValid', label: 'Início Validade', type: 'month', path: 'infoLotacao.inclusao.ideLotacao.iniValid', required: true, group: 'Vigência' },
      { name: 'fimValid', label: 'Fim Validade', type: 'month', path: 'infoLotacao.inclusao.ideLotacao.fimValid', required: false, group: 'Vigência' },
      { name: 'codLotacao', label: 'Código Lotação', type: 'text', path: 'infoLotacao.inclusao.ideLotacao.codLotacao', required: true, group: 'Dados' },
      { name: 'tpLotacao', label: 'Tipo Lotação', type: 'text', path: 'infoLotacao.inclusao.dadosLotacao.tpLotacao', required: true, group: 'Dados', placeholder: 'Ex: 01' },
      { name: 'fpas', label: 'Código FPAS', type: 'text', path: 'infoLotacao.inclusao.dadosLotacao.fpasLotacao.fpas', required: true, group: 'Tributação', placeholder: 'Ex: 515' },
      { name: 'codTercs', label: 'Cód. Terceiros', type: 'text', path: 'infoLotacao.inclusao.dadosLotacao.fpasLotacao.codTercs', required: true, group: 'Tributação', placeholder: 'Ex: 0115' },
      { name: 'codTercsSusp', label: 'Cód. Terceiros Susp.', type: 'text', path: 'infoLotacao.inclusao.dadosLotacao.fpasLotacao.codTercsSusp', required: false, group: 'Tributação' },
    ]
  },
  [EventType.S1070]: {
    id: EventType.S1070,
    title: 'Tabela de Processos',
    description: 'Registro de processos administrativos e judiciais.',
    defaultState: {
      tpAmb: 2, tpInsc: 1, nrInsc: '',
      ideEvento: { indRetif: 1, nrRecibo: '', tpAmb: 2, procEmi: 1, verProc: '1.0.0' },
      ideEmpregador: { tpInsc: 1, nrInsc: '' },
      infoProcesso: {
        inclusao: {
          ideProcesso: { tpProc: 1, nrProc: '', iniValid: '', fimValid: '' },
          dadosProc: {
            indAutoria: 1,
            indMatProc: 1,
            observacao: '',
            dadosProcJud: { ufVara: 'SP', codMunic: '', idVara: '' },
            infoSusp: [
              { codSusp: '', indSusp: '01', dtDecisao: '', indDeposito: 'N' }
            ]
          }
        }
      }
    },
    fields: [
      ...commonIdentification,
      { name: 'iniValid', label: 'Início Validade', type: 'month', path: 'infoProcesso.inclusao.ideProcesso.iniValid', required: true, group: 'Vigência' },
      { name: 'fimValid', label: 'Fim Validade', type: 'month', path: 'infoProcesso.inclusao.ideProcesso.fimValid', required: false, group: 'Vigência' },
      { name: 'tpProc', label: 'Tipo Processo', type: 'select', path: 'infoProcesso.inclusao.ideProcesso.tpProc', required: true, group: 'Dados', options: [{ label: '1 - Administrativo', value: 1 }, { label: '2 - Judicial', value: 2 }, { label: '4 - Arbitral', value: 4 }] },
      { name: 'nrProc', label: 'Número Processo', type: 'text', path: 'infoProcesso.inclusao.ideProcesso.nrProc', required: true, group: 'Dados' },
      { name: 'indAutoria', label: 'Autoria', type: 'select', path: 'infoProcesso.inclusao.dadosProc.indAutoria', required: true, group: 'Detalhes', options: [{ label: '1 - Próprio', value: 1 }, { label: '2 - Outra Entidade', value: 2 }] },
      { name: 'indMatProc', label: 'Matéria', type: 'select', path: 'infoProcesso.inclusao.dadosProc.indMatProc', required: true, group: 'Detalhes', options: [{ label: '1 - Tributária/Contribuições', value: 1 }, { label: '7 - FGTS', value: 7 }] },

      // Dados Proc Jud
      { name: 'ufVara', label: 'UF Vara', type: 'text', path: 'infoProcesso.inclusao.dadosProc.dadosProcJud.ufVara', required: false, maxLength: 2, group: 'Judicial' },
      { name: 'codMunic', label: 'Cód. Município', type: 'text', path: 'infoProcesso.inclusao.dadosProc.dadosProcJud.codMunic', required: false, maxLength: 7, group: 'Judicial' },
      { name: 'idVara', label: 'ID Vara', type: 'number', path: 'infoProcesso.inclusao.dadosProc.dadosProcJud.idVara', required: false, group: 'Judicial' },

      // Suspensão (Simplificado - Primeiro item)
      { name: 'codSusp', label: 'Cód. Suspensão', type: 'text', path: 'infoProcesso.inclusao.dadosProc.infoSusp[0].codSusp', required: false, group: 'Suspensão' },
      { name: 'indSusp', label: 'Ind. Suspensão', type: 'select', path: 'infoProcesso.inclusao.dadosProc.infoSusp[0].indSusp', required: false, group: 'Suspensão', options: [{ label: '01 - Liminar MS', value: '01' }, { label: '02 - Depósito Judicial', value: '02' }, { label: '90 - Decisão Definitiva', value: '90' }, { label: '92 - Sem Suspensão', value: '92' }] },
      { name: 'dtDecisao', label: 'Data Decisão', type: 'date', path: 'infoProcesso.inclusao.dadosProc.infoSusp[0].dtDecisao', required: false, group: 'Suspensão' },
      { name: 'indDeposito', label: 'Depósito Integral?', type: 'select', path: 'infoProcesso.inclusao.dadosProc.infoSusp[0].indDeposito', required: false, group: 'Suspensão', options: [{ label: 'Sim', value: 'S' }, { label: 'Não', value: 'N' }] },
    ]
  },

  // --- NÃO PERIÓDICOS (NON-PERIODIC) ---
  [EventType.S2190]: {
    id: EventType.S2190,
    title: 'Admissão Preliminar',
    description: 'Registro preliminar de admissão para cumprimento de prazos legais.',
    defaultState: {
      tpAmb: 2, tpInsc: 1, nrInsc: '',
      infoRegPrelim: {
        cpfTrab: '', dtNasc: '', dtAdm: '', matricula: '', codCateg: 101, natAtividade: 1,
        infoRegCTPS: { CBOCargo: '', vrSalFx: 0, undSalFixo: 5, tpContr: 1, dtTerm: '' }
      }
    },
    fields: [
      ...commonIdentification,
      // Trabalhador
      { name: 'cpfTrab', label: 'CPF Trabalhador', type: 'text', path: 'infoRegPrelim.cpfTrab', required: true, maxLength: 11, group: 'Trabalhador' },
      { name: 'dtNasc', label: 'Data Nascimento', type: 'date', path: 'infoRegPrelim.dtNasc', required: true, group: 'Trabalhador' },

      // Vínculo
      { name: 'matricula', label: 'Matrícula', type: 'text', path: 'infoRegPrelim.matricula', required: false, group: 'Vínculo' },
      { name: 'dtAdm', label: 'Data Admissão', type: 'date', path: 'infoRegPrelim.dtAdm', required: true, group: 'Vínculo' },
      { name: 'codCateg', label: 'Categoria', type: 'select', path: 'infoRegPrelim.codCateg', required: true, group: 'Vínculo', options: [{ label: '101 - Empregado', value: 101 }, { label: '103 - Aprendiz', value: 103 }, { label: '106 - Trab. Temporário', value: 106 }] },
      { name: 'natAtividade', label: 'Natureza Atividade', type: 'select', path: 'infoRegPrelim.natAtividade', required: false, group: 'Vínculo', options: [{ label: '1 - Urbano', value: 1 }, { label: '2 - Rural', value: 2 }] },

      // CTPS / Contrato
      { name: 'CBOCargo', label: 'CBO Cargo', type: 'text', path: 'infoRegPrelim.infoRegCTPS.CBOCargo', required: false, maxLength: 6, group: 'Contrato (CTPS)' },
      { name: 'vrSalFx', label: 'Salário Base', type: 'number', path: 'infoRegPrelim.infoRegCTPS.vrSalFx', required: false, group: 'Contrato (CTPS)' },
      { name: 'undSalFixo', label: 'Unidade Salário', type: 'select', path: 'infoRegPrelim.infoRegCTPS.undSalFixo', required: false, group: 'Contrato (CTPS)', options: [{ label: '5-Por Mês', value: 5 }, { label: '1-Por Hora', value: 1 }] },
      { name: 'tpContr', label: 'Tipo Contrato', type: 'select', path: 'infoRegPrelim.infoRegCTPS.tpContr', required: false, group: 'Contrato (CTPS)', options: [{ label: '1-Prazo Indeterminado', value: 1 }, { label: '2-Prazo Determinado', value: 2 }] },
      { name: 'dtTerm', label: 'Data Término', type: 'date', path: 'infoRegPrelim.infoRegCTPS.dtTerm', required: false, group: 'Contrato (CTPS)' },
    ]
  },
  [EventType.S2200]: {
    id: EventType.S2200,
    title: 'Admissão de Trabalhador',
    description: 'Cadastramento inicial do vínculo e admissão/ingresso de trabalhador.',
    defaultState: {
      tpAmb: 2, tpInsc: 1, nrInsc: '',
      trabalhador: {
        cpfTrab: '', nmTrab: '', sexo: 'M', racaCor: 1, estCiv: 1, grauInstr: '07',
        nascimento: { dtNasc: '', paisNac: '105' },
        endereco: { brasil: { tpLograd: '', dscLograd: '', nrLograd: '', complemento: '', bairro: '', cep: '', codMunic: '', uf: '' } },
        contato: { fonePrinc: '', email: '' }
      },
      vinculo: {
        matricula: '', tpRegTrab: 1, tpRegPrev: 1, cadIni: 'S',
        infoRegimeTrab: {
          infoCeletista: { dtAdm: '', tpAdmissao: 1, indAdmissao: 1, tpRegJor: 1, natAtividade: 1, dtBase: '', cnpjSindCategProf: '' }
        },
        infoContrato: {
          codCateg: 101,
          cargo: { nmCargo: '', CBOCargo: '' },
          remuneracao: { vrSalFx: 0, undSalFixo: 5, dscSalVar: '' },
          duracao: { tpContr: 1, dtTerm: '' },
          horContratual: { qtdHrsSem: 44, tpJornada: 2, tmpParc: 0 }
        }
      }
    },
    fields: [
      ...commonIdentification,
      // Trabalhador - Pessoais
      { name: 'cpfTrab', label: 'CPF', type: 'text', path: 'trabalhador.cpfTrab', required: true, maxLength: 11, group: 'Trabalhador - Pessoais' },
      { name: 'nmTrab', label: 'Nome Completo', type: 'text', path: 'trabalhador.nmTrab', required: true, group: 'Trabalhador - Pessoais' },
      { name: 'dtNasc', label: 'Data Nascimento', type: 'date', path: 'trabalhador.nascimento.dtNasc', required: true, group: 'Trabalhador - Pessoais' },
      { name: 'sexo', label: 'Sexo', type: 'select', path: 'trabalhador.sexo', required: true, group: 'Trabalhador - Pessoais', options: [{ label: 'Masculino', value: 'M' }, { label: 'Feminino', value: 'F' }] },
      { name: 'racaCor', label: 'Raça/Cor', type: 'select', path: 'trabalhador.racaCor', required: true, group: 'Trabalhador - Pessoais', options: [{ label: '1-Branca', value: 1 }, { label: '2-Preta', value: 2 }, { label: '3-Parda', value: 3 }, { label: '4-Amarela', value: 4 }, { label: '5-Indígena', value: 5 }] },
      { name: 'estCiv', label: 'Estado Civil', type: 'select', path: 'trabalhador.estCiv', required: false, group: 'Trabalhador - Pessoais', options: [{ label: '1-Solteiro', value: 1 }, { label: '2-Casado', value: 2 }, { label: '5-Separado', value: 5 }, { label: '6-Viúvo', value: 6 }] },
      { name: 'grauInstr', label: 'Grau Instrução', type: 'select', path: 'trabalhador.grauInstr', required: true, group: 'Trabalhador - Pessoais', options: [{ label: '07-Médio Completo', value: '07' }, { label: '09-Superior Completo', value: '09' }] },

      // Trabalhador - Endereço
      { name: 'cep', label: 'CEP', type: 'text', path: 'trabalhador.endereco.brasil.cep', required: true, maxLength: 8, group: 'Trabalhador - Endereço' },
      { name: 'tpLograd', label: 'Tipo Logradouro', type: 'text', path: 'trabalhador.endereco.brasil.tpLograd', required: true, group: 'Trabalhador - Endereço', placeholder: 'Rua, Av, etc' },
      { name: 'dscLograd', label: 'Logradouro', type: 'text', path: 'trabalhador.endereco.brasil.dscLograd', required: true, group: 'Trabalhador - Endereço' },
      { name: 'nrLograd', label: 'Número', type: 'text', path: 'trabalhador.endereco.brasil.nrLograd', required: true, group: 'Trabalhador - Endereço' },
      { name: 'bairro', label: 'Bairro', type: 'text', path: 'trabalhador.endereco.brasil.bairro', required: true, group: 'Trabalhador - Endereço' },
      { name: 'codMunic', label: 'Cód. Município (IBGE)', type: 'text', path: 'trabalhador.endereco.brasil.codMunic', required: true, maxLength: 7, group: 'Trabalhador - Endereço' },
      { name: 'uf', label: 'UF', type: 'text', path: 'trabalhador.endereco.brasil.uf', required: true, maxLength: 2, group: 'Trabalhador - Endereço' },

      // Vínculo
      { name: 'matricula', label: 'Matrícula', type: 'text', path: 'vinculo.matricula', required: true, group: 'Vínculo' },
      { name: 'tpRegTrab', label: 'Regime Trabalhista', type: 'select', path: 'vinculo.tpRegTrab', required: true, group: 'Vínculo', options: [{ label: '1-CLT', value: 1 }, { label: '2-Estatutário', value: 2 }] },
      { name: 'tpRegPrev', label: 'Regime Previdenciário', type: 'select', path: 'vinculo.tpRegPrev', required: true, group: 'Vínculo', options: [{ label: '1-RGPS', value: 1 }, { label: '2-RPPS', value: 2 }] },
      { name: 'cadIni', label: 'Cadastramento Inicial?', type: 'select', path: 'vinculo.cadIni', required: true, group: 'Vínculo', options: [{ label: 'Sim (Carga Inicial)', value: 'S' }, { label: 'Não (Admissão Nova)', value: 'N' }] },
      { name: 'dtAdm', label: 'Data Admissão', type: 'date', path: 'vinculo.infoRegimeTrab.infoCeletista.dtAdm', required: true, group: 'Vínculo' },
      { name: 'tpAdmissao', label: 'Tipo Admissão', type: 'select', path: 'vinculo.infoRegimeTrab.infoCeletista.tpAdmissao', required: true, group: 'Vínculo', options: [{ label: '1-Admissão', value: 1 }, { label: '2-Transf. Grupo Econ.', value: 2 }] },

      // Contrato
      { name: 'nmCargo', label: 'Nome do Cargo', type: 'text', path: 'vinculo.infoContrato.cargo.nmCargo', required: true, group: 'Contrato' },
      { name: 'CBOCargo', label: 'CBO Cargo', type: 'text', path: 'vinculo.infoContrato.cargo.CBOCargo', required: true, maxLength: 6, group: 'Contrato' },
      { name: 'vrSalFx', label: 'Salário Base', type: 'number', path: 'vinculo.infoContrato.remuneracao.vrSalFx', required: true, group: 'Contrato' },
      { name: 'undSalFixo', label: 'Unidade Salário', type: 'select', path: 'vinculo.infoContrato.remuneracao.undSalFixo', required: true, group: 'Contrato', options: [{ label: '5-Por Mês', value: 5 }, { label: '1-Por Hora', value: 1 }] },
      { name: 'tpContr', label: 'Tipo Contrato', type: 'select', path: 'vinculo.infoContrato.duracao.tpContr', required: true, group: 'Contrato', options: [{ label: '1-Prazo Indeterminado', value: 1 }, { label: '2-Prazo Determinado', value: 2 }] },
    ]
  },
  [EventType.S2205]: {
    id: EventType.S2205,
    title: 'Alteração de Dados Cadastrais',
    description: 'Atualização de dados pessoais do trabalhador (Endereço, Estado Civil, etc).',
    defaultState: {
      tpAmb: 2, tpInsc: 1, nrInsc: '',
      ideTrabalhador: { cpfTrab: '' },
      alteracao: {
        dtAlteracao: '',
        dadosTrabalhador: {
          nmTrab: '', sexo: 'M', racaCor: 1, estCiv: 1, grauInstr: '07', nmSoc: '', paisNac: '105',
          endereco: { brasil: { tpLograd: '', dscLograd: '', nrLograd: '', complemento: '', bairro: '', cep: '', codMunic: '', uf: '' } },
          infoDeficiencia: { defFisica: 'N', defVisual: 'N', defAuditiva: 'N', defMental: 'N', defIntelectual: 'N', reabReadap: 'N', infoCota: 'N', observacao: '' },
          contato: { fonePrinc: '', email: '' }
        }
      }
    },
    fields: [
      ...commonIdentification,
      { name: 'cpfTrab', label: 'CPF Trabalhador', type: 'text', path: 'ideTrabalhador.cpfTrab', required: true, maxLength: 11, group: 'Trabalhador' },
      { name: 'dtAlteracao', label: 'Data Alteração', type: 'date', path: 'alteracao.dtAlteracao', required: true, group: 'Alteração' },

      // Dados Pessoais
      { name: 'nmTrab', label: 'Novo Nome', type: 'text', path: 'alteracao.dadosTrabalhador.nmTrab', required: true, group: 'Dados Pessoais' },
      { name: 'sexo', label: 'Sexo', type: 'select', path: 'alteracao.dadosTrabalhador.sexo', required: true, group: 'Dados Pessoais', options: [{ label: 'Masculino', value: 'M' }, { label: 'Feminino', value: 'F' }] },
      { name: 'racaCor', label: 'Raça/Cor', type: 'select', path: 'alteracao.dadosTrabalhador.racaCor', required: true, group: 'Dados Pessoais', options: [{ label: '1-Branca', value: 1 }, { label: '2-Preta', value: 2 }, { label: '3-Parda', value: 3 }, { label: '4-Amarela', value: 4 }, { label: '5-Indígena', value: 5 }] },
      { name: 'estCiv', label: 'Estado Civil', type: 'select', path: 'alteracao.dadosTrabalhador.estCiv', required: false, group: 'Dados Pessoais', options: [{ label: '1-Solteiro', value: 1 }, { label: '2-Casado', value: 2 }, { label: '5-Separado', value: 5 }, { label: '6-Viúvo', value: 6 }] },
      { name: 'grauInstr', label: 'Grau Instrução', type: 'select', path: 'alteracao.dadosTrabalhador.grauInstr', required: true, group: 'Dados Pessoais', options: [{ label: '07-Médio Completo', value: '07' }, { label: '09-Superior Completo', value: '09' }] },
      { name: 'paisNac', label: 'País Nascimento', type: 'text', path: 'alteracao.dadosTrabalhador.paisNac', required: true, group: 'Dados Pessoais', placeholder: '105 (Brasil)' },

      // Endereço
      { name: 'cep', label: 'CEP', type: 'text', path: 'alteracao.dadosTrabalhador.endereco.brasil.cep', required: true, maxLength: 8, group: 'Endereço' },
      { name: 'tpLograd', label: 'Tipo Logradouro', type: 'text', path: 'alteracao.dadosTrabalhador.endereco.brasil.tpLograd', required: true, group: 'Endereço', placeholder: 'Rua, Av, etc' },
      { name: 'dscLograd', label: 'Logradouro', type: 'text', path: 'alteracao.dadosTrabalhador.endereco.brasil.dscLograd', required: true, group: 'Endereço' },
      { name: 'nrLograd', label: 'Número', type: 'text', path: 'alteracao.dadosTrabalhador.endereco.brasil.nrLograd', required: true, group: 'Endereço' },
      { name: 'bairro', label: 'Bairro', type: 'text', path: 'alteracao.dadosTrabalhador.endereco.brasil.bairro', required: true, group: 'Endereço' },
      { name: 'codMunic', label: 'Cód. Município (IBGE)', type: 'text', path: 'alteracao.dadosTrabalhador.endereco.brasil.codMunic', required: true, maxLength: 7, group: 'Endereço' },
      { name: 'uf', label: 'UF', type: 'text', path: 'alteracao.dadosTrabalhador.endereco.brasil.uf', required: true, maxLength: 2, group: 'Endereço' },

      // Deficiência
      { name: 'defFisica', label: 'Def. Física?', type: 'select', path: 'alteracao.dadosTrabalhador.infoDeficiencia.defFisica', required: false, group: 'Deficiência', options: [{ label: 'Sim', value: 'S' }, { label: 'Não', value: 'N' }] },
      { name: 'infoCota', label: 'Cota PCD?', type: 'select', path: 'alteracao.dadosTrabalhador.infoDeficiencia.infoCota', required: false, group: 'Deficiência', options: [{ label: 'Sim', value: 'S' }, { label: 'Não', value: 'N' }] },

      // Contato
      { name: 'fonePrinc', label: 'Telefone', type: 'text', path: 'alteracao.dadosTrabalhador.contato.fonePrinc', required: false, group: 'Contato' },
      { name: 'email', label: 'Email', type: 'email', path: 'alteracao.dadosTrabalhador.contato.email', required: false, group: 'Contato' },
    ]
  },
  [EventType.S2206]: {
    id: EventType.S2206,
    title: 'Alteração de Contrato de Trabalho',
    description: 'Mudança de cargo, salário, horário ou local de trabalho.',
    defaultState: {
      tpAmb: 2, tpInsc: 1, nrInsc: '',
      ideVinculo: { cpfTrab: '', matricula: '' },
      altContratual: {
        dtAlteracao: '', dtEf: '', dscAlt: '',
        vinculo: {
          tpRegPrev: 1,
          infoRegimeTrab: { infoCeletista: { tpRegJor: 1, natAtividade: 1, cnpjSindCategProf: '' } },
          infoContrato: {
            nmCargo: '', CBOCargo: '', codCateg: 101,
            remuneracao: { vrSalFx: 0, undSalFixo: 5, dscSalVar: '' },
            duracao: { tpContr: 1, dtTerm: '' },
            localTrabalho: { localTrabGeral: { tpInsc: 1, nrInsc: '' } },
            horContratual: { qtdHrsSem: 44, tpJornada: 2, tmpParc: 0 }
          }
        }
      }
    },
    fields: [
      ...commonIdentification,
      { name: 'cpfTrab', label: 'CPF Trabalhador', type: 'text', path: 'ideVinculo.cpfTrab', required: true, maxLength: 11, group: 'Trabalhador' },
      { name: 'matricula', label: 'Matrícula', type: 'text', path: 'ideVinculo.matricula', required: true, group: 'Trabalhador' },

      // Alteração
      { name: 'dtAlteracao', label: 'Data Alteração', type: 'date', path: 'altContratual.dtAlteracao', required: true, group: 'Alteração' },
      { name: 'dtEf', label: 'Data Efeitos', type: 'date', path: 'altContratual.dtEf', required: false, group: 'Alteração' },
      { name: 'dscAlt', label: 'Descrição Alteração', type: 'text', path: 'altContratual.dscAlt', required: false, group: 'Alteração' },

      // Vínculo / Regime
      { name: 'tpRegPrev', label: 'Regime Previdenciário', type: 'select', path: 'altContratual.vinculo.tpRegPrev', required: true, group: 'Regime', options: [{ label: '1-RGPS', value: 1 }, { label: '2-RPPS', value: 2 }] },
      { name: 'tpRegJor', label: 'Regime Jornada', type: 'select', path: 'altContratual.vinculo.infoRegimeTrab.infoCeletista.tpRegJor', required: true, group: 'Regime', options: [{ label: '1-Subordinado', value: 1 }, { label: '2-12x36', value: 2 }, { label: '3-Intermitente', value: 3 }] },
      { name: 'natAtividade', label: 'Natureza Atividade', type: 'select', path: 'altContratual.vinculo.infoRegimeTrab.infoCeletista.natAtividade', required: true, group: 'Regime', options: [{ label: '1-Urbano', value: 1 }, { label: '2-Rural', value: 2 }] },

      // Contrato - Cargo/Categoria
      { name: 'nmCargo', label: 'Nome do Cargo', type: 'text', path: 'altContratual.vinculo.infoContrato.nmCargo', required: true, group: 'Contrato' },
      { name: 'CBOCargo', label: 'CBO Cargo', type: 'text', path: 'altContratual.vinculo.infoContrato.CBOCargo', required: false, maxLength: 6, group: 'Contrato' },
      { name: 'codCateg', label: 'Categoria', type: 'select', path: 'altContratual.vinculo.infoContrato.codCateg', required: true, group: 'Contrato', options: [{ label: '101 - Empregado', value: 101 }, { label: '103 - Aprendiz', value: 103 }, { label: '106 - Trab. Temporário', value: 106 }] },

      // Remuneração
      { name: 'vrSalFx', label: 'Salário Base', type: 'number', path: 'altContratual.vinculo.infoContrato.remuneracao.vrSalFx', required: true, group: 'Remuneração' },
      { name: 'undSalFixo', label: 'Unidade Salário', type: 'select', path: 'altContratual.vinculo.infoContrato.remuneracao.undSalFixo', required: true, group: 'Remuneração', options: [{ label: '5-Por Mês', value: 5 }, { label: '1-Por Hora', value: 1 }] },
      { name: 'dscSalVar', label: 'Desc. Salário Variável', type: 'text', path: 'altContratual.vinculo.infoContrato.remuneracao.dscSalVar', required: false, group: 'Remuneração' },

      // Duração
      { name: 'tpContr', label: 'Tipo Contrato', type: 'select', path: 'altContratual.vinculo.infoContrato.duracao.tpContr', required: true, group: 'Duração', options: [{ label: '1-Prazo Indeterminado', value: 1 }, { label: '2-Prazo Determinado', value: 2 }] },
      { name: 'dtTerm', label: 'Data Término', type: 'date', path: 'altContratual.vinculo.infoContrato.duracao.dtTerm', required: false, group: 'Duração' },

      // Horário
      { name: 'qtdHrsSem', label: 'Qtd Horas Semanais', type: 'number', path: 'altContratual.vinculo.infoContrato.horContratual.qtdHrsSem', required: true, group: 'Horário' },
      { name: 'tpJornada', label: 'Tipo Jornada', type: 'select', path: 'altContratual.vinculo.infoContrato.horContratual.tpJornada', required: true, group: 'Horário', options: [{ label: '2-Jornada 8h Diárias', value: 2 }, { label: '3-Jornada Variável', value: 3 }] },
    ]
  },
  [EventType.S2230]: {
    id: EventType.S2230,
    title: 'Afastamento Temporário',
    description: 'Evento utilizado para informar os afastamentos temporários dos trabalhadores.',
    defaultState: {
      tpAmb: 2, tpInsc: 1, nrInsc: '',
      ideVinculo: { cpfTrab: '', matricula: '', codCateg: '' },
      infoAfastamento: {
        iniAfastamento: {
          dtIniAfast: '', codMotAfast: '', infoMesmoMtv: 'N', tpAcidTransito: '', observacao: '',
          perAquis: { dtInicio: '', dtFim: '' }
        },
        fimAfastamento: { dtTermAfast: '' }
      }
    },
    fields: [
      ...commonIdentification,
      // Vínculo
      { name: 'cpfTrab', label: 'CPF Trabalhador', type: 'text', path: 'ideVinculo.cpfTrab', required: true, maxLength: 11, group: 'Trabalhador' },
      { name: 'matricula', label: 'Matrícula', type: 'text', path: 'ideVinculo.matricula', required: false, group: 'Trabalhador' },
      { name: 'codCateg', label: 'Cód. Categoria', type: 'text', path: 'ideVinculo.codCateg', required: false, group: 'Trabalhador', placeholder: 'Preencher se sem matrícula' },

      // Início Afastamento
      { name: 'dtIniAfast', label: 'Data Início Afastamento', type: 'date', path: 'infoAfastamento.iniAfastamento.dtIniAfast', required: false, group: 'Início Afastamento' },
      { name: 'codMotAfast', label: 'Motivo Afastamento', type: 'text', path: 'infoAfastamento.iniAfastamento.codMotAfast', required: false, group: 'Início Afastamento', placeholder: 'Ex: 01, 03, 15 (Ver Tabela 18)' },
      { name: 'infoMesmoMtv', label: 'Mesmo Motivo Anterior?', type: 'select', path: 'infoAfastamento.iniAfastamento.infoMesmoMtv', required: false, group: 'Início Afastamento', options: [{ label: 'Sim', value: 'S' }, { label: 'Não', value: 'N' }] },
      { name: 'tpAcidTransito', label: 'Tipo Acidente Trânsito', type: 'select', path: 'infoAfastamento.iniAfastamento.tpAcidTransito', required: false, group: 'Início Afastamento', options: [{ label: '1-Atropelamento', value: 1 }, { label: '2-Colisão', value: 2 }, { label: '3-Outros', value: 3 }] },
      { name: 'observacao', label: 'Observação', type: 'text', path: 'infoAfastamento.iniAfastamento.observacao', required: false, group: 'Início Afastamento' },

      // Período Aquisitivo (Férias)
      { name: 'dtInicio', label: 'Início Per. Aquisitivo', type: 'date', path: 'infoAfastamento.iniAfastamento.perAquis.dtInicio', required: false, group: 'Período Aquisitivo (Férias)' },
      { name: 'dtFim', label: 'Fim Per. Aquisitivo', type: 'date', path: 'infoAfastamento.iniAfastamento.perAquis.dtFim', required: false, group: 'Período Aquisitivo (Férias)' },

      // Fim Afastamento
      { name: 'dtTermAfast', label: 'Data Término Afastamento', type: 'date', path: 'infoAfastamento.fimAfastamento.dtTermAfast', required: false, group: 'Término Afastamento' },
    ]
  },
  [EventType.S2298]: {
    id: EventType.S2298,
    title: 'Reintegração',
    description: 'Reintegração de empregado previamente desligado.',
    defaultState: {
      tpAmb: 2, tpInsc: 1, nrInsc: '',
      ideEvento: { indRetif: 1, nrRecibo: '' },
      ideEmpregador: { tpInsc: 1, nrInsc: '' },
      ideVinculo: { cpfTrab: '', matricula: '' },
      infoReintegr: { tpReint: 1, nrProcJud: '', nrLeiAnistia: '', dtEfetRetorno: '', dtEfeito: '' }
    },
    fields: [
      ...commonIdentification,
      { name: 'cpfTrab', label: 'CPF Trabalhador', type: 'text', path: 'ideVinculo.cpfTrab', required: true, maxLength: 11, group: 'Trabalhador' },
      { name: 'matricula', label: 'Matrícula', type: 'text', path: 'ideVinculo.matricula', required: true, group: 'Trabalhador' },
      { name: 'tpReint', label: 'Tipo Reintegração', type: 'select', path: 'infoReintegr.tpReint', required: true, group: 'Reintegração', options: [{ label: '1 - Decisão Judicial', value: 1 }, { label: '2 - Anistia', value: 2 }, { label: '9 - Outros', value: 9 }] },
      { name: 'nrProcJud', label: 'Nr. Processo Judicial', type: 'text', path: 'infoReintegr.nrProcJud', required: false, maxLength: 20, group: 'Reintegração' },
      { name: 'nrLeiAnistia', label: 'Lei de Anistia', type: 'text', path: 'infoReintegr.nrLeiAnistia', required: false, group: 'Reintegração' },
      { name: 'dtEfetRetorno', label: 'Data Efetivo Retorno', type: 'date', path: 'infoReintegr.dtEfetRetorno', required: true, group: 'Reintegração' },
      { name: 'dtEfeito', label: 'Data Efeito Financeiro', type: 'date', path: 'infoReintegr.dtEfeito', required: true, group: 'Reintegração' },
    ]
  },

  [EventType.S2300]: {
    id: EventType.S2300,
    title: 'TSVE - Início',
    description: 'Início de trabalhador sem vínculo de emprego (Estagiário, Diretor, etc).',
    defaultState: {
      tpAmb: 2, tpInsc: 1, nrInsc: '',
      trabalhador: { cpfTrab: '', nmTrab: '', dtNasc: '' },
      infoTSVInicio: { matricula: '', codCateg: 901, dtInicio: '' }
    },
    fields: [
      ...commonIdentification,
      { name: 'cpfTrab', label: 'CPF Trabalhador', type: 'text', path: 'trabalhador.cpfTrab', required: true, maxLength: 11, group: 'Trabalhador' },
      { name: 'nmTrab', label: 'Nome', type: 'text', path: 'trabalhador.nmTrab', required: true, group: 'Trabalhador' },
      { name: 'dtNasc', label: 'Data Nascimento', type: 'date', path: 'trabalhador.dtNasc', required: true, group: 'Trabalhador' },
      { name: 'matricula', label: 'Matrícula (se houver)', type: 'text', path: 'infoTSVInicio.matricula', required: false, group: 'Vínculo' },
      { name: 'codCateg', label: 'Categoria', type: 'select', path: 'infoTSVInicio.codCateg', required: true, group: 'Vínculo', options: [{ label: '901 - Estagiário', value: 901 }, { label: '722 - Diretor s/ FGTS', value: 722 }, { label: '723 - Empresário/Sócio', value: 723 }] },
      { name: 'dtInicio', label: 'Data Início', type: 'date', path: 'infoTSVInicio.dtInicio', required: true, group: 'Vínculo' }
    ]
  },
  [EventType.S2306]: {
    id: EventType.S2306,
    title: 'TSVE - Alteração Contratual',
    description: 'Alteração contratual de trabalhador sem vínculo de emprego/estatutário.',
    defaultState: {
      tpAmb: 2, tpInsc: 1, nrInsc: '',
      ideEvento: { indRetif: 1, nrRecibo: '', tpAmb: 2, procEmi: 1, verProc: '1.0.0' },
      ideEmpregador: { tpInsc: 1, nrInsc: '' },
      ideTrabSemVinculo: { cpfTrab: '', matricula: '', codCateg: 0 },
      infoTSVAlteracao: {
        dtAlteracao: '',
        natAtividade: 1,
        infoComplementares: {
          cargoFuncao: { nmCargo: '', CBOCargo: '', nmFuncao: '', CBOFuncao: '' },
          remuneracao: { vrSalFx: 0, undSalFixo: 1, dscSalVar: '' },
          infoDirigenteSindical: { tpRegPrev: 1 },
          infoTrabCedido: { tpRegPrev: 1 },
          infoMandElet: { indRemunCargo: 'S', tpRegPrev: 1 },
          infoEstagiario: { natEstagio: 'O', nivEstagio: 1, areaAtuacao: '', nrApol: '', dtPrevTerm: '' },
          localTrabGeral: { tpInsc: 1, nrInsc: '', descComp: '' }
        }
      }
    },
    fields: [
      ...commonIdentification,
      { name: 'cpfTrab', label: 'CPF do Trabalhador', type: 'text', path: 'ideTrabSemVinculo.cpfTrab', required: true, maxLength: 11, group: 'Trabalhador' },
      { name: 'matricula', label: 'Matrícula', type: 'text', path: 'ideTrabSemVinculo.matricula', required: false, maxLength: 30, group: 'Trabalhador' },
      { name: 'codCateg', label: 'Código Categoria', type: 'number', path: 'ideTrabSemVinculo.codCateg', required: true, group: 'Trabalhador' },

      // Alteração
      { name: 'dtAlteracao', label: 'Data Alteração', type: 'date', path: 'infoTSVAlteracao.dtAlteracao', required: true, group: 'Alteração' },
      { name: 'natAtividade', label: 'Natureza Atividade', type: 'select', path: 'infoTSVAlteracao.natAtividade', required: false, group: 'Alteração', options: [{ label: '1 - Trabalho urbano', value: 1 }, { label: '2 - Trabalho rural', value: 2 }] },

      // Cargo/Função
      { name: 'nmCargo', label: 'Nome Cargo', type: 'text', path: 'infoTSVAlteracao.infoComplementares.cargoFuncao.nmCargo', required: false, maxLength: 100, group: 'Cargo/Função' },
      { name: 'CBOCargo', label: 'CBO Cargo', type: 'text', path: 'infoTSVAlteracao.infoComplementares.cargoFuncao.CBOCargo', required: false, maxLength: 6, group: 'Cargo/Função' },

      // Remuneração
      { name: 'vrSalFx', label: 'Valor Salário Fixo', type: 'number', path: 'infoTSVAlteracao.infoComplementares.remuneracao.vrSalFx', required: false, group: 'Remuneração' },
      { name: 'undSalFixo', label: 'Unidade Salário', type: 'select', path: 'infoTSVAlteracao.infoComplementares.remuneracao.undSalFixo', required: false, group: 'Remuneração', options: [{ label: '1 - Por Hora', value: 1 }, { label: '2 - Por Dia', value: 2 }, { label: '3 - Por Semana', value: 3 }, { label: '4 - Por Quinzena', value: 4 }, { label: '5 - Por Mês', value: 5 }, { label: '6 - Por Tarefa', value: 6 }, { label: '7 - Não aplicável', value: 7 }] },
    ]
  },

  [EventType.S1299]: {
    id: EventType.S1299,
    title: 'Fechamento Periódicos',
    description: 'Fechamento dos eventos periódicos (Folha de Pagamento).',
    defaultState: {
      tpAmb: 2, tpInsc: 1, nrInsc: '',
      ideEvento: { indApuracao: 1, perApur: '', indGuia: '' },
      infoFech: {
        evtRemun: 'N',
        evtPgtos: 'N',
        evtComProd: 'N',
        evtContratAvNP: 'N',
        evtInfoComplPer: 'N',
        indExcApur1250: 'N',
        transDCTFWeb: 'S',
        naoValid: 'N'
      }
    },
    fields: [
      ...commonIdentification,
      // Identificação Evento
      { name: 'perApur', label: 'Período Apuração', type: 'month', path: 'ideEvento.perApur', required: true, group: 'Evento' },
      { name: 'indApuracao', label: 'Ind. Apuração', type: 'select', path: 'ideEvento.indApuracao', required: true, group: 'Evento', options: [{ label: '1 - Mensal', value: 1 }, { label: '2 - Anual (13°)', value: 2 }] },
      { name: 'indGuia', label: 'Indicativo Guia', type: 'text', path: 'ideEvento.indGuia', required: false, group: 'Evento', placeholder: 'Opcional' },

      // Informações Fechamento
      { name: 'evtRemun', label: 'Possui Remuneração (S-1200/S-2299)?', type: 'select', path: 'infoFech.evtRemun', required: true, group: 'Fechamento', options: [{ label: 'Sim', value: 'S' }, { label: 'Não', value: 'N' }] },
      { name: 'evtPgtos', label: 'Possui Pagamentos (S-1210)?', type: 'select', path: 'infoFech.evtPgtos', required: true, group: 'Fechamento', options: [{ label: 'Sim', value: 'S' }, { label: 'Não', value: 'N' }] },
      { name: 'evtComProd', label: 'Possui Comercialização (S-1260)?', type: 'select', path: 'infoFech.evtComProd', required: true, group: 'Fechamento', options: [{ label: 'Sim', value: 'S' }, { label: 'Não', value: 'N' }] },
      { name: 'evtContratAvNP', label: 'Contratou Avulsos (S-1270)?', type: 'select', path: 'infoFech.evtContratAvNP', required: true, group: 'Fechamento', options: [{ label: 'Sim', value: 'S' }, { label: 'Não', value: 'N' }] },
      { name: 'evtInfoComplPer', label: 'Possui Desoneração (S-1280)?', type: 'select', path: 'infoFech.evtInfoComplPer', required: true, group: 'Fechamento', options: [{ label: 'Sim', value: 'S' }, { label: 'Não', value: 'N' }] },

      { name: 'transDCTFWeb', label: 'Transmitir DCTFWeb Imediata?', type: 'select', path: 'infoFech.transDCTFWeb', required: true, group: 'Fechamento', options: [{ label: 'Sim', value: 'S' }, { label: 'Não', value: 'N' }] },
      { name: 'naoValid', label: 'Ignorar Validações (Grandes Contrib.)?', type: 'select', path: 'infoFech.naoValid', required: true, group: 'Fechamento', options: [{ label: 'Sim', value: 'S' }, { label: 'Não', value: 'N' }] },
    ]
  },
  [EventType.S2399]: {
    id: EventType.S2399,
    title: 'TSVE - Término',
    description: 'Término de trabalhador sem vínculo de emprego/estatutário.',
    defaultState: {
      tpAmb: 2, tpInsc: 1, nrInsc: '',
      ideEvento: { indRetif: 1, nrRecibo: '', tpAmb: 2, procEmi: 1, verProc: '1.0.0', indGuia: '1' },
      ideEmpregador: { tpInsc: 1, nrInsc: '' },
      ideTrabSemVinculo: { cpfTrab: '', matricula: '', codCateg: 0 },
      infoTSVTermino: {
        dtTerm: '',
        mtvDesligTSV: '99',
        pensAlim: 0,
        percAliment: 0,
        vrAlim: 0,
        nrProcTrab: '',
        mudancaCPF: { novoCPF: '' },
        verbasResc: {
          dmDev: [{
            ideDmDev: '',
            indRRA: 'N',
            ideEstabLot: [{
              tpInsc: 1,
              nrInsc: '',
              codLotacao: '',
              detVerbas: [{
                codRubr: '',
                ideTabRubr: '',
                qtdRubr: 0,
                fatorRubr: 0,
                vrRubr: 0,
                indApurIR: 0
              }]
            }]
          }]
        },
        remunAposTerm: { indRemun: 1, dtFimRemun: '' }
      }
    },
    fields: [
      ...commonIdentification,
      { name: 'cpfTrab', label: 'CPF do Trabalhador', type: 'text', path: 'ideTrabSemVinculo.cpfTrab', required: true, maxLength: 11, group: 'Trabalhador' },
      { name: 'matricula', label: 'Matrícula', type: 'text', path: 'ideTrabSemVinculo.matricula', required: false, maxLength: 30, group: 'Trabalhador' },
      { name: 'codCateg', label: 'Código Categoria', type: 'number', path: 'ideTrabSemVinculo.codCateg', required: true, group: 'Trabalhador' },

      // Término
      { name: 'dtTerm', label: 'Data Término', type: 'date', path: 'infoTSVTermino.dtTerm', required: true, group: 'Término' },
      { name: 'mtvDesligTSV', label: 'Motivo Desligamento', type: 'select', path: 'infoTSVTermino.mtvDesligTSV', required: false, group: 'Término', options: [{ label: '01 - Exoneração sem justa causa', value: '01' }, { label: '02 - Término de mandato', value: '02' }, { label: '03 - Exoneração a pedido', value: '03' }, { label: '04 - Exoneração culpa recíproca', value: '04' }, { label: '05 - Morte', value: '05' }, { label: '06 - Falência/Encerramento', value: '06' }, { label: '07 - Mudança de CPF', value: '07' }, { label: '99 - Outros', value: '99' }] },
      { name: 'pensAlim', label: 'Pensão Alimentícia', type: 'number', path: 'infoTSVTermino.pensAlim', required: false, group: 'Término' },

      // Verbas Rescisórias (Simplificado - Primeiro item)
      { name: 'ideDmDev', label: 'ID Demonstrativo', type: 'text', path: 'infoTSVTermino.verbasResc.dmDev[0].ideDmDev', required: false, group: 'Verbas Rescisórias' },
      { name: 'codRubr', label: 'Cód. Rubrica', type: 'text', path: 'infoTSVTermino.verbasResc.dmDev[0].ideEstabLot[0].detVerbas[0].codRubr', required: false, group: 'Verbas Rescisórias' },
      { name: 'vrRubr', label: 'Valor Rubrica', type: 'number', path: 'infoTSVTermino.verbasResc.dmDev[0].ideEstabLot[0].detVerbas[0].vrRubr', required: false, group: 'Verbas Rescisórias' },
    ]
  },

  // --- SST ---
  [EventType.S2210]: {
    id: EventType.S2210,
    title: 'CAT - Acidente de Trabalho',
    description: 'Comunicação de acidente de trabalho ou doença ocupacional.',
    defaultState: {
      tpAmb: 2, tpInsc: 1, nrInsc: '',
      ideEvento: { indRetif: 1, nrRecibo: '' },
      ideEmpregador: { tpInsc: 1, nrInsc: '' },
      ideVinculo: { cpfTrab: '', matricula: '' },
      cat: {
        dtAcid: '', tpAcid: 1, hrAcid: '', hrsTrabAntesAcid: '', tpCat: 1, indCatObito: 'N', dtObito: '', indComunPolicia: 'N', codSitGeradora: '', iniciatCAT: 1, obsCAT: '', ultDiaTrab: '', houveAfast: 'N',
        localAcidente: { tpLocal: 1, dscLocal: '', tpLograd: '', dscLograd: '', nrLograd: '', complemento: '', bairro: '', cep: '', codMunic: '', uf: '', pais: '', codPostal: '', ideLocalAcid: { tpInsc: 1, nrInsc: '' } },
        parteAtingida: { codParteAting: '', lateralidade: 0 },
        agenteCausador: { codAgntCausador: '' },
        atestado: { dtAtendimento: '', hrAtendimento: '', indInternacao: 'N', durTrat: 0, indAfast: 'N', dscLesao: '', dscCompLesao: '', diagProvavel: '', codCID: '', observacao: '', emitente: { nmEmit: '', ideOC: 1, nrOC: '', ufOC: '' } },
        catOrigem: { nrRecCatOrig: '' }
      }
    },
    fields: [
      ...commonIdentification,
      { name: 'cpfTrab', label: 'CPF Trabalhador', type: 'text', path: 'ideVinculo.cpfTrab', required: true, maxLength: 11, group: 'Trabalhador' },
      { name: 'matricula', label: 'Matrícula', type: 'text', path: 'ideVinculo.matricula', required: true, group: 'Trabalhador' },

      // CAT Geral
      { name: 'dtAcid', label: 'Data do Acidente', type: 'date', path: 'cat.dtAcid', required: true, group: 'Acidente' },
      { name: 'tpAcid', label: 'Tipo Acidente', type: 'select', path: 'cat.tpAcid', required: true, group: 'Acidente', options: [{ label: '1 - Típico', value: 1 }, { label: '2 - Doença', value: 2 }, { label: '3 - Trajeto', value: 3 }] },
      { name: 'hrAcid', label: 'Hora do Acidente', type: 'time', path: 'cat.hrAcid', required: false, group: 'Acidente' },
      { name: 'hrsTrabAntesAcid', label: 'Horas Trab. Antes', type: 'time', path: 'cat.hrsTrabAntesAcid', required: false, group: 'Acidente' },
      { name: 'tpCat', label: 'Tipo CAT', type: 'select', path: 'cat.tpCat', required: true, group: 'Acidente', options: [{ label: '1 - Inicial', value: 1 }, { label: '2 - Reabertura', value: 2 }, { label: '3 - Óbito', value: 3 }] },
      { name: 'indCatObito', label: 'Houve Óbito?', type: 'select', path: 'cat.indCatObito', required: true, group: 'Acidente', options: [{ label: 'Sim', value: 'S' }, { label: 'Não', value: 'N' }] },
      { name: 'dtObito', label: 'Data Óbito', type: 'date', path: 'cat.dtObito', required: false, group: 'Acidente' },
      { name: 'indComunPolicia', label: 'Comun. Polícia?', type: 'select', path: 'cat.indComunPolicia', required: true, group: 'Acidente', options: [{ label: 'Sim', value: 'S' }, { label: 'Não', value: 'N' }] },
      { name: 'codSitGeradora', label: 'Cód. Situação Geradora', type: 'text', path: 'cat.codSitGeradora', required: true, group: 'Acidente' },
      { name: 'iniciatCAT', label: 'Iniciativa', type: 'select', path: 'cat.iniciatCAT', required: true, group: 'Acidente', options: [{ label: '1 - Empregador', value: 1 }, { label: '2 - Ordem Judicial', value: 2 }, { label: '3 - Órgão Fiscalizador', value: 3 }] },
      { name: 'obsCAT', label: 'Observação', type: 'textarea', path: 'cat.obsCAT', required: false, group: 'Acidente' },

      // Local Acidente
      { name: 'tpLocal', label: 'Tipo Local', type: 'select', path: 'cat.localAcidente.tpLocal', required: true, group: 'Local Acidente', options: [{ label: '1 - Estab. Empregador', value: 1 }, { label: '2 - Estab. Exterior', value: 2 }, { label: '3 - Estab. Terceiros', value: 3 }, { label: '4 - Via Pública', value: 4 }, { label: '5 - Área Rural', value: 5 }, { label: '6 - Embarcação', value: 6 }, { label: '9 - Outros', value: 9 }] },
      { name: 'dscLocal', label: 'Descrição Local', type: 'text', path: 'cat.localAcidente.dscLocal', required: false, group: 'Local Acidente' },
      { name: 'cep', label: 'CEP', type: 'text', path: 'cat.localAcidente.cep', required: false, maxLength: 8, group: 'Local Acidente' },
      { name: 'tpLograd', label: 'Tipo Logradouro', type: 'text', path: 'cat.localAcidente.tpLograd', required: false, group: 'Local Acidente' },
      { name: 'dscLograd', label: 'Logradouro', type: 'text', path: 'cat.localAcidente.dscLograd', required: true, group: 'Local Acidente' },
      { name: 'nrLograd', label: 'Número', type: 'text', path: 'cat.localAcidente.nrLograd', required: true, group: 'Local Acidente' },
      { name: 'bairro', label: 'Bairro', type: 'text', path: 'cat.localAcidente.bairro', required: false, group: 'Local Acidente' },
      { name: 'codMunic', label: 'Cód. Município', type: 'text', path: 'cat.localAcidente.codMunic', required: false, maxLength: 7, group: 'Local Acidente' },
      { name: 'uf', label: 'UF', type: 'text', path: 'cat.localAcidente.uf', required: false, maxLength: 2, group: 'Local Acidente' },

      // Parte Atingida / Agente
      { name: 'codParteAting', label: 'Cód. Parte Atingida', type: 'text', path: 'cat.parteAtingida.codParteAting', required: true, group: 'Parte Atingida' },
      { name: 'lateralidade', label: 'Lateralidade', type: 'select', path: 'cat.parteAtingida.lateralidade', required: true, group: 'Parte Atingida', options: [{ label: '0 - N/A', value: 0 }, { label: '1 - Esquerda', value: 1 }, { label: '2 - Direita', value: 2 }, { label: '3 - Ambas', value: 3 }] },
      { name: 'codAgntCausador', label: 'Cód. Agente Causador', type: 'text', path: 'cat.agenteCausador.codAgntCausador', required: true, group: 'Agente Causador' },

      // Atestado
      { name: 'dtAtendimento', label: 'Data Atendimento', type: 'date', path: 'cat.atestado.dtAtendimento', required: true, group: 'Atestado Médico' },
      { name: 'hrAtendimento', label: 'Hora Atendimento', type: 'time', path: 'cat.atestado.hrAtendimento', required: true, group: 'Atestado Médico' },
      { name: 'indInternacao', label: 'Internação?', type: 'select', path: 'cat.atestado.indInternacao', required: true, group: 'Atestado Médico', options: [{ label: 'Sim', value: 'S' }, { label: 'Não', value: 'N' }] },
      { name: 'durTrat', label: 'Duração Tratamento (dias)', type: 'number', path: 'cat.atestado.durTrat', required: true, group: 'Atestado Médico' },
      { name: 'indAfast', label: 'Afastamento?', type: 'select', path: 'cat.atestado.indAfast', required: true, group: 'Atestado Médico', options: [{ label: 'Sim', value: 'S' }, { label: 'Não', value: 'N' }] },
      { name: 'dscLesao', label: 'Cód. Descrição Lesão', type: 'text', path: 'cat.atestado.dscLesao', required: true, group: 'Atestado Médico' },
      { name: 'codCID', label: 'CID', type: 'text', path: 'cat.atestado.codCID', required: true, group: 'Atestado Médico' },
      { name: 'nmEmit', label: 'Nome Médico', type: 'text', path: 'cat.atestado.emitente.nmEmit', required: true, group: 'Atestado Médico' },
      { name: 'ideOC', label: 'Órgão Classe', type: 'select', path: 'cat.atestado.emitente.ideOC', required: true, group: 'Atestado Médico', options: [{ label: '1 - CRM', value: 1 }, { label: '2 - CRO', value: 2 }, { label: '3 - RMS', value: 3 }] },
      { name: 'nrOC', label: 'Número OC', type: 'text', path: 'cat.atestado.emitente.nrOC', required: true, group: 'Atestado Médico' },
      { name: 'ufOC', label: 'UF OC', type: 'text', path: 'cat.atestado.emitente.ufOC', required: false, maxLength: 2, group: 'Atestado Médico' },
    ]
  },
  [EventType.S2220]: {
    id: EventType.S2220,
    title: 'ASO - Monitoramento Saúde',
    description: 'Atestado de Saúde Ocupacional e exames complementares.',
    defaultState: {
      tpAmb: 2, tpInsc: 1, nrInsc: '',
      ideVinculo: { cpfTrab: '', matricula: '' },
      examedMedico: { dtAso: '', tpExameOcup: 1 }
    },
    fields: [
      ...commonIdentification,
      { name: 'cpfTrab', label: 'CPF Trabalhador', type: 'text', path: 'ideVinculo.cpfTrab', required: true, maxLength: 11, group: 'Trabalhador' },
      { name: 'matricula', label: 'Matrícula', type: 'text', path: 'ideVinculo.matricula', required: true, group: 'Trabalhador' },
      { name: 'dtAso', label: 'Data ASO', type: 'date', path: 'examedMedico.dtAso', required: true, group: 'Exame' },
      { name: 'tpExameOcup', label: 'Tipo Exame', type: 'select', path: 'examedMedico.tpExameOcup', required: true, group: 'Exame', options: [{ label: '1 - Admissional', value: 1 }, { label: '2 - Periódico', value: 2 }, { label: '3 - Retorno', value: 3 }, { label: '4 - Mudança Função', value: 4 }, { label: '5 - Demissional', value: 5 }] },
    ]
  },
  [EventType.S2231]: {
    id: EventType.S2231,
    title: 'Cessão/Exercício em Outro Órgão',
    description: 'Cessão de trabalhadores para outro órgão.',
    defaultState: {
      tpAmb: 2, tpInsc: 1, nrInsc: '',
      ideEvento: { indRetif: 1, nrRecibo: '' },
      ideEmpregador: { tpInsc: 1, nrInsc: '' },
      ideVinculo: { cpfTrab: '', matricula: '' },
      infoCessao: {
        iniCessao: { dtIniCessao: '', cnpjCess: '', respRemun: 'N' },
        fimCessao: { dtTermCessao: '' }
      }
    },
    fields: [
      ...commonIdentification,
      { name: 'cpfTrab', label: 'CPF Trabalhador', type: 'text', path: 'ideVinculo.cpfTrab', required: true, maxLength: 11, group: 'Trabalhador' },
      { name: 'matricula', label: 'Matrícula', type: 'text', path: 'ideVinculo.matricula', required: true, group: 'Trabalhador' },

      // Início Cessão
      { name: 'dtIniCessao', label: 'Data Início Cessão', type: 'date', path: 'infoCessao.iniCessao.dtIniCessao', required: false, group: 'Início Cessão' },
      { name: 'cnpjCess', label: 'CNPJ Cessionário', type: 'text', path: 'infoCessao.iniCessao.cnpjCess', required: false, maxLength: 14, group: 'Início Cessão' },
      { name: 'respRemun', label: 'Ônus Cessão?', type: 'select', path: 'infoCessao.iniCessao.respRemun', required: false, group: 'Início Cessão', options: [{ label: 'Sim', value: 'S' }, { label: 'Não', value: 'N' }] },

      // Término Cessão
      { name: 'dtTermCessao', label: 'Data Término Cessão', type: 'date', path: 'infoCessao.fimCessao.dtTermCessao', required: false, group: 'Término Cessão' },
    ]
  },
  [EventType.S2240]: {
    id: EventType.S2240,
    title: 'Condições Ambientais (SST)',
    description: 'Fatores de risco, EPIs e ambientes de trabalho.',
    defaultState: {
      tpAmb: 2, tpInsc: 1, nrInsc: '',
      ideVinculo: { cpfTrab: '', matricula: '' },
      infoExpRisco: {
        dtIniCondicao: '',
        infoAmb: { localAmb: 1, dscSetor: '', tpInsc: 1, nrInsc: '' },
        infoAtiv: { dscAtivDes: '' },
        agNoc: [
          {
            codAgNoc: '', dscAgNoc: '', tpAval: 1, intConc: 0, limTol: 0, unMed: 1, tecMedicao: '',
            epcEpi: { utilizEPC: 0, eficEpc: 'S', utilizEPI: 0, eficEpi: 'S' }
          }
        ],
        respReg: [{ cpfResp: '', ideOC: 1, dscOC: '', nrOC: '', ufOC: '' }]
      }
    },
    fields: [
      ...commonIdentification,
      { name: 'cpfTrab', label: 'CPF Trabalhador', type: 'text', path: 'ideVinculo.cpfTrab', required: true, maxLength: 11, group: 'Trabalhador' },
      { name: 'matricula', label: 'Matrícula', type: 'text', path: 'ideVinculo.matricula', required: true, group: 'Trabalhador' },

      // Exposição
      { name: 'dtIniCondicao', label: 'Data Início Condição', type: 'date', path: 'infoExpRisco.dtIniCondicao', required: true, group: 'Exposição' },

      // Ambiente
      { name: 'localAmb', label: 'Ambiente', type: 'select', path: 'infoExpRisco.infoAmb.localAmb', required: true, group: 'Ambiente', options: [{ label: '1 - Próprio', value: 1 }, { label: '2 - Terceiros', value: 2 }] },
      { name: 'dscSetor', label: 'Descrição do Setor', type: 'text', path: 'infoExpRisco.infoAmb.dscSetor', required: true, group: 'Ambiente' },
      { name: 'tpInscAmb', label: 'Tipo Inscrição Amb.', type: 'select', path: 'infoExpRisco.infoAmb.tpInsc', required: true, group: 'Ambiente', options: [{ label: '1 - CNPJ', value: 1 }, { label: '3 - CAEPF', value: 3 }, { label: '4 - CNO', value: 4 }] },
      { name: 'nrInscAmb', label: 'Nr. Inscrição Amb.', type: 'text', path: 'infoExpRisco.infoAmb.nrInsc', required: true, maxLength: 14, group: 'Ambiente' },

      // Atividades
      { name: 'dscAtivDes', label: 'Descrição das Atividades', type: 'textarea', path: 'infoExpRisco.infoAtiv.dscAtivDes', required: true, group: 'Atividades' },

      // Agente Nocivo (Simplificado - Primeiro item)
      { name: 'codAgNoc', label: 'Código Agente Nocivo', type: 'text', path: 'infoExpRisco.agNoc[0].codAgNoc', required: true, group: 'Agente Nocivo', placeholder: 'Ex: 09.01.001' },
      { name: 'dscAgNoc', label: 'Descrição Agente', type: 'text', path: 'infoExpRisco.agNoc[0].dscAgNoc', required: false, group: 'Agente Nocivo' },
      { name: 'tpAval', label: 'Tipo Avaliação', type: 'select', path: 'infoExpRisco.agNoc[0].tpAval', required: false, group: 'Agente Nocivo', options: [{ label: '1 - Quantitativo', value: 1 }, { label: '2 - Qualitativo', value: 2 }] },
      { name: 'intConc', label: 'Intensidade/Conc.', type: 'number', path: 'infoExpRisco.agNoc[0].intConc', required: false, group: 'Agente Nocivo' },
      { name: 'limTol', label: 'Limite Tolerância', type: 'number', path: 'infoExpRisco.agNoc[0].limTol', required: false, group: 'Agente Nocivo' },
      { name: 'unMed', label: 'Unidade Medida', type: 'select', path: 'infoExpRisco.agNoc[0].unMed', required: false, group: 'Agente Nocivo', options: [{ label: '1 - dose diária', value: 1 }, { label: '2 - dB(linear)', value: 2 }, { label: '18 - dose anual', value: 18 }] },
      { name: 'tecMedicao', label: 'Técnica Medição', type: 'text', path: 'infoExpRisco.agNoc[0].tecMedicao', required: false, group: 'Agente Nocivo' },

      // EPC / EPI (Simplificado - Primeiro item de Agente Nocivo)
      { name: 'utilizEPC', label: 'Utiliza EPC?', type: 'select', path: 'infoExpRisco.agNoc[0].epcEpi.utilizEPC', required: true, group: 'EPC/EPI', options: [{ label: '0 - N/A', value: 0 }, { label: '1 - Não', value: 1 }, { label: '2 - Sim', value: 2 }] },
      { name: 'utilizEPI', label: 'Utiliza EPI?', type: 'select', path: 'infoExpRisco.agNoc[0].epcEpi.utilizEPI', required: true, group: 'EPC/EPI', options: [{ label: '0 - N/A', value: 0 }, { label: '1 - Não', value: 1 }, { label: '2 - Sim', value: 2 }] },

      // Responsável (Simplificado - Primeiro item)
      { name: 'cpfResp', label: 'CPF Responsável', type: 'text', path: 'infoExpRisco.respReg[0].cpfResp', required: true, maxLength: 11, group: 'Responsável' },
      { name: 'ideOC', label: 'Órgão Classe', type: 'select', path: 'infoExpRisco.respReg[0].ideOC', required: false, group: 'Responsável', options: [{ label: '1 - CRM', value: 1 }, { label: '4 - CREA', value: 4 }, { label: '9 - Outros', value: 9 }] },
      { name: 'nrOC', label: 'Número OC', type: 'text', path: 'infoExpRisco.respReg[0].nrOC', required: false, group: 'Responsável' },
      { name: 'ufOC', label: 'UF OC', type: 'text', path: 'infoExpRisco.respReg[0].ufOC', required: false, maxLength: 2, group: 'Responsável' },
    ]
  },

  // --- PROCESSOS TRABALHISTAS ---
  [EventType.S2500]: {
    id: EventType.S2500,
    title: 'Processo Trabalhista',
    description: 'Informações de processos trabalhistas e acordos.',
    defaultState: {
      tpAmb: 2, tpInsc: 1, nrInsc: '',
      ideEvento: { indRetif: 1, nrRecibo: '' },
      ideEmpregador: { tpInsc: 1, nrInsc: '' },
      infoProcesso: {
        origem: 1, nrProcTrab: '', obsProcTrab: '',
        dadosCompl: { infoProcJud: { dtSent: '', ufVara: '', codMunic: '', idVara: 0 }, infoCCP: { dtCCP: '', tpCCP: 1, cnpjCCP: '' } }
      },
      ideTrab: {
        cpfTrab: '', nmTrab: '', dtNascto: '', ideSeqTrab: 1,
        infoContr: [
          {
            tpContr: 1, indContr: 'N', dtAdmOrig: '', indReint: 'N', indCateg: 'N', indNatAtiv: 'N', indMotDeslig: 'N', matricula: '', codCateg: 101, dtInicio: '',
            infoCompl: { codCBO: '', natAtividade: 1, remuneracao: [{ dtRemun: '', vrSalFx: 0, undSalFixo: 1, dscSalVar: '' }], infoVinc: { tpRegTrab: 1, tpRegPrev: 1, dtAdm: '', tmpParc: 0, duracao: { tpContr: 1, dtTerm: '', clauAssec: 'N', objDet: '' }, observacoes: [{ observacao: '' }], sucessaoVinc: { tpInsc: 1, nrInsc: '', matricAnt: '', dtTransf: '' }, infoDeslig: { dtDeslig: '', mtvDeslig: '', dtProjFimAPI: '', pensAlim: 0, percAliment: 0, vrAlim: 0 }, infoTerm: { dtTerm: '', mtvDesligTSV: '' } } },
            mudCategAtiv: [{ codCateg: 101, natAtividade: 1, dtMudCategAtiv: '' }],
            unicContr: [{ matUnic: '', codCateg: 101, dtInicio: '' }],
            ideEstab: { tpInsc: 1, nrInsc: '', infoVlr: { compIni: '', compFim: '', indReperc: 1, indenSD: 'N', indenAbono: 'N', abono: [{ anoBase: 0 }], idePeriodo: [{ perRef: '', baseCalculo: { vrBcCpMensal: 0, vrBcCp13: 0, infoAgNocivo: { grauExp: 1 } }, infoFGTS: { vrBcFGTSProcTrab: 0, vrBcFGTSSefip: 0, vrBcFGTSDecAnt: 0 }, baseMudCateg: { codCateg: 101, vrBcCPrev: 0 }, infoInterm: [{ dia: 0 }] }] } }
          }
        ]
      }
    },
    fields: [
      ...commonIdentification,
      { name: 'nrProcTrab', label: 'Número Processo', type: 'text', path: 'infoProcesso.nrProcTrab', required: true, group: 'Processo' },
      { name: 'origem', label: 'Origem', type: 'select', path: 'infoProcesso.origem', required: true, group: 'Processo', options: [{ label: '1 - Judicial', value: 1 }, { label: '2 - CCP', value: 2 }] },
      { name: 'obsProcTrab', label: 'Observações', type: 'text', path: 'infoProcesso.obsProcTrab', required: false, group: 'Processo' },

      // Dados Complementares (Judicial)
      { name: 'dtSent', label: 'Data Sentença', type: 'date', path: 'infoProcesso.dadosCompl.infoProcJud.dtSent', required: false, group: 'Dados Judiciais' },
      { name: 'ufVara', label: 'UF Vara', type: 'text', path: 'infoProcesso.dadosCompl.infoProcJud.ufVara', required: false, maxLength: 2, group: 'Dados Judiciais' },
      { name: 'codMunic', label: 'Cód. Município', type: 'text', path: 'infoProcesso.dadosCompl.infoProcJud.codMunic', required: false, group: 'Dados Judiciais' },

      // Trabalhador
      { name: 'cpfTrab', label: 'CPF Trabalhador', type: 'text', path: 'ideTrab.cpfTrab', required: true, maxLength: 11, group: 'Trabalhador' },
      { name: 'nmTrab', label: 'Nome Trabalhador', type: 'text', path: 'ideTrab.nmTrab', required: true, group: 'Trabalhador' },
      { name: 'dtNascto', label: 'Data Nascimento', type: 'date', path: 'ideTrab.dtNascto', required: true, group: 'Trabalhador' },

      // Contrato (Simplificado - Primeiro item)
      { name: 'tpContr', label: 'Tipo Contrato', type: 'select', path: 'ideTrab.infoContr[0].tpContr', required: true, group: 'Contrato', options: [{ label: '1 - Vínculo Formalizado', value: 1 }, { label: '2 - Vínculo com Alt. Admissão', value: 2 }, { label: '3 - Vínculo com Alt. Desligamento', value: 3 }, { label: '5 - Reconhecimento de Vínculo', value: 5 }, { label: '6 - TSVE', value: 6 }] },
      { name: 'indContr', label: 'Contrato Existente?', type: 'select', path: 'ideTrab.infoContr[0].indContr', required: true, group: 'Contrato', options: [{ label: 'Sim', value: 'S' }, { label: 'Não', value: 'N' }] },
      { name: 'matricula', label: 'Matrícula', type: 'text', path: 'ideTrab.infoContr[0].matricula', required: false, group: 'Contrato' },
      { name: 'codCateg', label: 'Cód. Categoria', type: 'number', path: 'ideTrab.infoContr[0].codCateg', required: true, group: 'Contrato' },
      { name: 'dtInicio', label: 'Data Início', type: 'date', path: 'ideTrab.infoContr[0].dtInicio', required: true, group: 'Contrato' },

      // Estabelecimento (Simplificado - Primeiro item)
      { name: 'tpInscEstab', label: 'Tipo Inscrição Estab.', type: 'select', path: 'ideTrab.infoContr[0].ideEstab.tpInsc', required: true, group: 'Estabelecimento', options: [{ label: '1 - CNPJ', value: 1 }, { label: '3 - CAEPF', value: 3 }, { label: '4 - CNO', value: 4 }] },
      { name: 'nrInscEstab', label: 'Nr. Inscrição Estab.', type: 'text', path: 'ideTrab.infoContr[0].ideEstab.nrInsc', required: true, maxLength: 14, group: 'Estabelecimento' },

      // Valores (Simplificado - Primeiro item)
      { name: 'compIni', label: 'Competência Inicial', type: 'month', path: 'ideTrab.infoContr[0].ideEstab.infoVlr.compIni', required: true, group: 'Valores' },
      { name: 'compFim', label: 'Competência Final', type: 'month', path: 'ideTrab.infoContr[0].ideEstab.infoVlr.compFim', required: true, group: 'Valores' },
      { name: 'indReperc', label: 'Repercussão', type: 'select', path: 'ideTrab.infoContr[0].ideEstab.infoVlr.indReperc', required: true, group: 'Valores', options: [{ label: '1 - Tributária/FGTS', value: 1 }, { label: '2 - Sem Repercussão', value: 2 }, { label: '3 - Exclusiva IRRF', value: 3 }] },
    ]
  },
  [EventType.S2501]: {
    id: EventType.S2501,
    title: 'Tributos Proc. Trabalhista',
    description: 'Informações de tributos decorrentes de processo trabalhista.',
    defaultState: {
      tpAmb: 2, tpInsc: 1, nrInsc: '',
      ideEvento: { indRetif: 1, nrRecibo: '' },
      ideEmpregador: { tpInsc: 1, nrInsc: '' },
      ideProc: { nrProcTrab: '', perApurPgto: '', ideSeqProc: 1, obs: '' },
      ideTrab: [
        {
          cpfTrab: '',
          calcTrib: [
            {
              perRef: '', vrBcCpMensal: 0, vrBcCp13: 0,
              infoCRContrib: [{ tpCR: 0, vrCR: 0 }],
              infoCRIRRF: [
                {
                  tpCR: 0, vrCR: 0, vrCR13: 0,
                  infoIR: { vrRendTrib: 0, vrRendTrib13: 0, vrRendMoleGrave: 0, vrRendMoleGrave13: 0, vrRendIsen65: 0, vrRendIsen65Dec: 0, vrJurosMora: 0, vrJurosMora13: 0, vrRendIsenNTrib: 0, descIsenNTrib: '', vrPrevOficial: 0, vrPrevOficial13: 0 },
                  infoRRA: { descRRA: '', qtdMesesRRA: 0, despProcJud: { vlrDespCustas: 0, vlrDespAdvogados: 0 } },
                  dedDepen: [{ tpRend: 11, cpfDep: '', vlrDeducao: 0 }],
                  penAlim: [{ tpRend: 11, cpfDep: '', vlrPensao: 0 }]
                }
              ]
            }
          ],
          infoIRComplem: { infoDep: [{ cpfDep: '', dtNascto: '', nome: '', depIRRF: 'N', tpDep: '', descrDep: '' }] }
        }
      ]
    },
    fields: [
      ...commonIdentification,
      { name: 'nrProcTrab', label: 'Número Processo', type: 'text', path: 'ideProc.nrProcTrab', required: true, group: 'Processo' },
      { name: 'perApurPgto', label: 'Mês Pagamento', type: 'month', path: 'ideProc.perApurPgto', required: true, group: 'Processo' },
      { name: 'ideSeqProc', label: 'Sequencial', type: 'number', path: 'ideProc.ideSeqProc', required: false, group: 'Processo' },
      { name: 'obs', label: 'Observação', type: 'text', path: 'ideProc.obs', required: false, group: 'Processo' },

      // Trabalhador (Simplificado - Primeiro item)
      { name: 'cpfTrab', label: 'CPF Trabalhador', type: 'text', path: 'ideTrab[0].cpfTrab', required: true, maxLength: 11, group: 'Trabalhador' },

      // Cálculos Tributários (Simplificado - Primeiro item)
      { name: 'perRef', label: 'Período Referência', type: 'month', path: 'ideTrab[0].calcTrib[0].perRef', required: true, group: 'Cálculos' },
      { name: 'vrBcCpMensal', label: 'Base CP Mensal', type: 'number', path: 'ideTrab[0].calcTrib[0].vrBcCpMensal', required: true, group: 'Cálculos' },
      { name: 'vrBcCp13', label: 'Base CP 13º', type: 'number', path: 'ideTrab[0].calcTrib[0].vrBcCp13', required: true, group: 'Cálculos' },

      // Contribuições Sociais (Simplificado - Primeiro item)
      { name: 'tpCRContrib', label: 'CR Contribuição', type: 'number', path: 'ideTrab[0].calcTrib[0].infoCRContrib[0].tpCR', required: false, group: 'Contribuições' },
      { name: 'vrCRContrib', label: 'Valor CR Contrib.', type: 'number', path: 'ideTrab[0].calcTrib[0].infoCRContrib[0].vrCR', required: false, group: 'Contribuições' },

      // IRRF (Simplificado - Primeiro item)
      { name: 'tpCRIRRF', label: 'CR IRRF', type: 'select', path: 'ideTrab[0].calcTrib[0].infoCRIRRF[0].tpCR', required: false, group: 'IRRF', options: [{ label: '593656 - IRRF Justiça Trabalho', value: 593656 }, { label: '056152 - IRRF CCP/NINTER', value: 56152 }, { label: '188951 - IRRF RRA', value: 188951 }] },
      { name: 'vrCRIRRF', label: 'Valor CR IRRF', type: 'number', path: 'ideTrab[0].calcTrib[0].infoCRIRRF[0].vrCR', required: false, group: 'IRRF' },
      { name: 'vrRendTrib', label: 'Rendimento Tributável', type: 'number', path: 'ideTrab[0].calcTrib[0].infoCRIRRF[0].infoIR.vrRendTrib', required: false, group: 'IRRF Detalhes' },
    ]
  },
  [EventType.S2555]: {
    id: EventType.S2555,
    title: 'Consolidação Proc. Trab.',
    description: 'Consolidação de tributos de processo trabalhista.',
    defaultState: {
      tpAmb: 2, tpInsc: 1, nrInsc: '',
      ideEvento: { indRetif: 1, nrRecibo: '' },
      ideEmpregador: { tpInsc: 1, nrInsc: '' },
      ideProc: { nrProcTrab: '', perApurPgto: '' }
    },
    fields: [
      ...commonIdentification,
      { name: 'nrProcTrab', label: 'Número Processo', type: 'text', path: 'ideProc.nrProcTrab', required: true, group: 'Processo' },
      { name: 'perApurPgto', label: 'Mês Pagamento', type: 'month', path: 'ideProc.perApurPgto', required: true, group: 'Processo' }
    ]
  },

  // --- PERIÓDICOS (PERIODIC) ---
  [EventType.S1200]: {
    id: EventType.S1200,
    title: 'Remuneração (RGPS)',
    description: 'Informações relativas à remuneração do trabalhador no período de apuração (RGPS).',
    defaultState: {
      tpAmb: 2, tpInsc: 1, nrInsc: '',
      ideEvento: { indRetif: 1, nrRecibo: '', indApuracao: 1, perApur: new Date().toISOString().slice(0, 7) },
      ideEmpregador: { tpInsc: 1, nrInsc: '' },
      ideTrabalhador: {
        cpfTrab: '',
        infoMV: { indMV: 1, remunOutrEmpr: [{ tpInsc: 1, nrInsc: '', codCateg: 101, vlrRemunOE: 0 }] },
        infoComplem: { nmTrab: '', dtNascto: '', sucessaoVinc: { tpInsc: 1, nrInsc: '', matricAnt: '', dtAdm: '' } },
        procJudTrab: [{ tpTrib: 1, nrProcJud: '', codSusp: 0 }],
        infoInterm: [{ dia: 0 }]
      },
      dmDev: [
        {
          ideDmDev: 'ID1000', codCateg: 101,
          infoPerApur: {
            ideEstabLot: [
              {
                tpInsc: 1, nrInsc: '', codLotacao: '01',
                remunPerApur: [
                  {
                    matricula: '',
                    itensRemun: [
                      { codRubr: '', ideTabRubr: { ideTabRubr: '', nrRubr: '' }, vrRubr: 0, qtdRubr: 0, fatorRubr: 0, indApurIR: 0 }
                    ]
                  }
                ]
              }
            ]
          },
          infoPerAnt: {
            ideADC: [
              {
                dtAcConv: '', tpAcConv: 'A', dsc: '', remunSuc: 'N',
                idePeriodo: [
                  {
                    perRef: '',
                    ideEstabLot: [
                      {
                        tpInsc: 1, nrInsc: '', codLotacao: '',
                        remunPerAnt: [
                          {
                            matricula: '',
                            itensRemun: [{ codRubr: '', ideTabRubr: { ideTabRubr: '', nrRubr: '' }, vrRubr: 0 }]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    fields: [
      ...commonIdentification,
      { name: 'perApur', label: 'Período Apuração', type: 'month', path: 'ideEvento.perApur', required: true, group: 'Referência' },
      { name: 'indApuracao', label: 'Ind. Apuração', type: 'select', path: 'ideEvento.indApuracao', required: true, group: 'Referência', options: [{ label: '1 - Mensal', value: 1 }, { label: '2 - Anual (13º)', value: 2 }] },

      // Trabalhador
      { name: 'cpfTrab', label: 'CPF Trabalhador', type: 'text', path: 'ideTrabalhador.cpfTrab', required: true, maxLength: 11, group: 'Trabalhador' },

      // Demonstrativo (Simplificado - Primeiro item)
      { name: 'ideDmDev', label: 'ID Demonstrativo', type: 'text', path: 'dmDev[0].ideDmDev', required: true, group: 'Demonstrativo', placeholder: 'Ex: ID1000' },
      { name: 'codCateg', label: 'Cód. Categoria', type: 'number', path: 'dmDev[0].codCateg', required: true, group: 'Demonstrativo' },

      // Lotação (Simplificado - Primeiro item)
      { name: 'codLotacao', label: 'Cód. Lotação', type: 'text', path: 'dmDev[0].infoPerApur.ideEstabLot[0].codLotacao', required: true, group: 'Lotação' },

      // Remuneração (Simplificado - Primeiro item)
      { name: 'matricula', label: 'Matrícula', type: 'text', path: 'dmDev[0].infoPerApur.ideEstabLot[0].remunPerApur[0].matricula', required: true, group: 'Remuneração' },

      // Itens Remuneração (Simplificado - Primeiro item)
      { name: 'codRubr', label: 'Cod. Rubrica', type: 'text', path: 'dmDev[0].infoPerApur.ideEstabLot[0].remunPerApur[0].itensRemun[0].codRubr', required: true, group: 'Itens Remuneração' },
      { name: 'vrRubr', label: 'Valor Rubrica', type: 'number', path: 'dmDev[0].infoPerApur.ideEstabLot[0].remunPerApur[0].itensRemun[0].vrRubr', required: true, group: 'Itens Remuneração' },
      { name: 'qtdRubr', label: 'Qtd. Rubrica', type: 'number', path: 'dmDev[0].infoPerApur.ideEstabLot[0].remunPerApur[0].itensRemun[0].qtdRubr', required: false, group: 'Itens Remuneração' },
    ]
  },
  [EventType.S1202]: {
    id: EventType.S1202,
    title: 'Remuneração (RPPS)',
    description: 'Remuneração de servidores vinculados a Regime Próprio de Previdência Social.',
    defaultState: {
      tpAmb: 2, tpInsc: 1, nrInsc: '',
      ideEvento: { indRetif: 1, nrRecibo: '', indApuracao: 1, perApur: new Date().toISOString().slice(0, 7) },
      ideEmpregador: { tpInsc: 1, nrInsc: '' },
      ideTrabalhador: {
        cpfTrab: '',
        infoComplem: { nmTrab: '', dtNascto: '', sucessaoVinc: { cnpjOrgaoAnt: '', matricAnt: '', dtExercicio: '' } }
      },
      dmDev: [
        {
          ideDmDev: 'ID1000', codCateg: 301,
          infoPerApur: {
            ideEstab: [
              {
                tpInsc: 1, nrInsc: '',
                remunPerApur: [
                  {
                    matricula: '',
                    itensRemun: [
                      { codRubr: '', ideTabRubr: { ideTabRubr: '', nrRubr: '' }, vrRubr: 0, qtdRubr: 0, fatorRubr: 0, indApurIR: 0 }
                    ]
                  }
                ]
              }
            ]
          },
          infoPerAnt: {
            remunOrgSuc: 'N',
            idePeriodo: [
              {
                perRef: '',
                ideEstab: [
                  {
                    tpInsc: 1, nrInsc: '',
                    remunPerAnt: [
                      {
                        matricula: '',
                        itensRemun: [{ codRubr: '', ideTabRubr: { ideTabRubr: '', nrRubr: '' }, vrRubr: 0 }]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    fields: [
      ...commonIdentification,
      { name: 'perApur', label: 'Período Apuração', type: 'month', path: 'ideEvento.perApur', required: true, group: 'Referência' },
      { name: 'indApuracao', label: 'Ind. Apuração', type: 'select', path: 'ideEvento.indApuracao', required: true, group: 'Referência', options: [{ label: '1 - Mensal', value: 1 }, { label: '2 - Anual (13º)', value: 2 }] },

      // Trabalhador
      { name: 'cpfTrab', label: 'CPF Servidor', type: 'text', path: 'ideTrabalhador.cpfTrab', required: true, maxLength: 11, group: 'Servidor' },

      // Demonstrativo (Simplificado - Primeiro item)
      { name: 'ideDmDev', label: 'ID Demonstrativo', type: 'text', path: 'dmDev[0].ideDmDev', required: true, group: 'Demonstrativo', placeholder: 'Ex: ID1000' },
      { name: 'codCateg', label: 'Cód. Categoria', type: 'number', path: 'dmDev[0].codCateg', required: true, group: 'Demonstrativo' },

      // Estabelecimento (Simplificado - Primeiro item)
      { name: 'nrInscEstab', label: 'CNPJ Unidade', type: 'text', path: 'dmDev[0].infoPerApur.ideEstab[0].nrInsc', required: true, group: 'Unidade Órgão' },

      // Remuneração (Simplificado - Primeiro item)
      { name: 'matricula', label: 'Matrícula', type: 'text', path: 'dmDev[0].infoPerApur.ideEstab[0].remunPerApur[0].matricula', required: true, group: 'Remuneração' },

      // Itens Remuneração (Simplificado - Primeiro item)
      { name: 'codRubr', label: 'Cod. Rubrica', type: 'text', path: 'dmDev[0].infoPerApur.ideEstab[0].remunPerApur[0].itensRemun[0].codRubr', required: true, group: 'Itens Remuneração' },
      { name: 'vrRubr', label: 'Valor Rubrica', type: 'number', path: 'dmDev[0].infoPerApur.ideEstab[0].remunPerApur[0].itensRemun[0].vrRubr', required: true, group: 'Itens Remuneração' },
      { name: 'qtdRubr', label: 'Qtd. Rubrica', type: 'number', path: 'dmDev[0].infoPerApur.ideEstab[0].remunPerApur[0].itensRemun[0].qtdRubr', required: false, group: 'Itens Remuneração' },
    ]
  },
  [EventType.S1207]: {
    id: EventType.S1207,
    title: 'Benefícios - Entes Públicos',
    description: 'Evento utilizado para prestação de informações relativas aos benefícios previdenciários mantidos pelos Regimes Próprios de Previdência Social.',
    defaultState: {
      tpAmb: 2, tpInsc: 1, nrInsc: '',
      ideEvento: { indApuracao: 1, perApur: '', tpAmb: 2, procEmi: 1, verProc: '1.0.0' },
      ideEmpregador: { tpInsc: 1, nrInsc: '' },
      ideBenef: { cpfBenef: '' },
      dmDev: [
        {
          ideDmDev: '', nrBeneficio: '',
          infoPerApur: {
            ideEstab: [
              {
                tpInsc: 1, nrInsc: '',
                itensRemun: [
                  { codRubr: '', ideTabRubr: '', qtdRubr: 0, fatorRubr: 0, vrRubr: 0, indApurIR: 0 }
                ]
              }
            ]
          }
        }
      ]
    },
    fields: [
      ...commonIdentification,
      // Identificação Evento
      { name: 'perApur', label: 'Período Apuração', type: 'month', path: 'ideEvento.perApur', required: true, group: 'Evento' },
      { name: 'indApuracao', label: 'Ind. Apuração', type: 'select', path: 'ideEvento.indApuracao', required: true, group: 'Evento', options: [{ label: '1-Mensal', value: 1 }, { label: '2-Anual (13°)', value: 2 }] },

      // Beneficiário
      { name: 'cpfBenef', label: 'CPF Beneficiário', type: 'text', path: 'ideBenef.cpfBenef', required: true, maxLength: 11, group: 'Beneficiário' },

      // Demonstrativo (Simplificado para 1º item)
      { name: 'ideDmDev', label: 'ID Demonstrativo', type: 'text', path: 'dmDev[0].ideDmDev', required: true, maxLength: 30, group: 'Demonstrativo' },
      { name: 'nrBeneficio', label: 'Número Benefício', type: 'text', path: 'dmDev[0].nrBeneficio', required: true, maxLength: 20, group: 'Demonstrativo' },

      // Estabelecimento (Simplificado para 1º item)
      { name: 'nrInscEstab', label: 'CNPJ Órgão Público', type: 'text', path: 'dmDev[0].infoPerApur.ideEstab[0].nrInsc', required: true, maxLength: 14, group: 'Estabelecimento' },

      // Itens Remuneração (Simplificado para 1º item)
      { name: 'codRubr', label: 'Código Rubrica', type: 'text', path: 'dmDev[0].infoPerApur.ideEstab[0].itensRemun[0].codRubr', required: true, maxLength: 30, group: 'Remuneração' },
      { name: 'ideTabRubr', label: 'ID Tabela Rubrica', type: 'text', path: 'dmDev[0].infoPerApur.ideEstab[0].itensRemun[0].ideTabRubr', required: true, maxLength: 8, group: 'Remuneração' },
      { name: 'vrRubr', label: 'Valor Rubrica', type: 'number', path: 'dmDev[0].infoPerApur.ideEstab[0].itensRemun[0].vrRubr', required: true, group: 'Remuneração' },
      { name: 'qtdRubr', label: 'Quantidade', type: 'number', path: 'dmDev[0].infoPerApur.ideEstab[0].itensRemun[0].qtdRubr', required: false, group: 'Remuneração' },
      { name: 'fatorRubr', label: 'Fator', type: 'number', path: 'dmDev[0].infoPerApur.ideEstab[0].itensRemun[0].fatorRubr', required: false, group: 'Remuneração' },
    ]
  },
  [EventType.S1210]: {
    id: EventType.S1210,
    title: 'Pagamentos de Rendimentos do Trabalho',
    description: 'Informações de pagamentos de rendimentos do trabalho e de apuração de IRRF.',
    defaultState: {
      tpAmb: 2, tpInsc: 1, nrInsc: '',
      ideEvento: { indRetif: 1, perApur: new Date().toISOString().slice(0, 7) },
      ideBenef: {
        cpfBenef: '',
        infoPgto: [
          {
            dtPgto: '', tpPgto: 1, perRef: '', ideDmDev: '', vrLiq: 0,
            paisResidExt: '',
            infoPgtoExt: { indNIF: 1, nifBenef: '', frmTribut: '', endExt: { endDscLograd: '', endNrLograd: '', endComplem: '', endBairro: '', endCidade: '', endEstado: '', endCodPostal: '', telef: '' } }
          }
        ],
        infoIRComplem: [
          {
            dtLaudo: '',
            perAnt: { perRefAjuste: '', nrRec1210Orig: '' },
            infoDep: [{ cpfDep: '', dtNascto: '', nome: '', depIRRF: 'N', tpDep: '', descrDep: '' }],
            infoIRCR: [
              {
                tpCR: 0,
                dedDepen: [{ tpRend: 0, cpfDep: '', vlrDedDep: 0 }],
                penAlim: [{ tpRend: 0, cpfDep: '', vlrDedPenAlim: 0 }],
                previdCompl: [{ tpPrev: 0, cnpjEntidPC: '', vlrDedPC: 0, vlrDedPC13: 0, vlrPatrocFunp: 0, vlrPatrocFunp13: 0 }],
                infoProcRet: [{ tpProcRet: 1, nrProcRet: '', codSusp: '', infoValores: [{ indApuracao: 1, vlrNRetido: 0, vlrDepJud: 0, vlrCmpAnoCal: 0, vlrCmpAnoAnt: 0, vlrRendSusp: 0, dedSusp: [{ indTpDeducao: 1, vlrDedSusp: 0, cnpjEntidPC: '', vlrPatrocFunp: 0, benefPen: [{ cpfDep: '', vlrDepenSusp: 0 }] }] }] }]
              }
            ],
            planSaude: [{ cnpjOper: '', regANS: '', vlrSaudeTit: 0, infoDepSau: [{ cpfDep: '', vlrSaudeDep: 0 }] }],
            infoReembMed: [{ indOrgReemb: 1, cnpjOper: '', regANS: '', detReembTit: { tpInsc: 1, nrInsc: '', vlrReemb: 0, vlrReembAnt: 0 }, infoReembDep: [{ cpfBenef: '', detReembDep: { tpInsc: 1, nrInsc: '', vlrReemb: 0, vlrReembAnt: 0 } }] }]
          }
        ]
      }
    },
    fields: [
      ...commonIdentification,
      { name: 'perApur', label: 'Mês de Apuração', type: 'month', path: 'ideEvento.perApur', required: true, group: 'Referência' },
      { name: 'cpfBenef', label: 'CPF Beneficiário', type: 'text', path: 'ideBenef.cpfBenef', required: true, maxLength: 11, group: 'Beneficiário' },

      // Pagamentos (Simplificado - Primeiro item)
      { name: 'dtPgto', label: 'Data Pagamento', type: 'date', path: 'ideBenef.infoPgto[0].dtPgto', required: true, group: 'Pagamento' },
      { name: 'tpPgto', label: 'Tipo Pagamento', type: 'select', path: 'ideBenef.infoPgto[0].tpPgto', required: true, group: 'Pagamento', options: [{ label: '1 - Remuneração Mensal', value: 1 }, { label: '2 - Rescisão', value: 2 }, { label: '3 - Rescisão (Término TSVE)', value: 3 }, { label: '4 - Remuneração RPPS', value: 4 }, { label: '5 - Benefício RPPS', value: 5 }] },
      { name: 'perRef', label: 'Período Ref. (Competência)', type: 'month', path: 'ideBenef.infoPgto[0].perRef', required: true, group: 'Pagamento' },
      { name: 'ideDmDev', label: 'ID Demonstrativo', type: 'text', path: 'ideBenef.infoPgto[0].ideDmDev', required: true, group: 'Pagamento', placeholder: 'ID do S-1200/S-2299...' },
      { name: 'vrLiq', label: 'Valor Líquido', type: 'number', path: 'ideBenef.infoPgto[0].vrLiq', required: true, group: 'Pagamento' },

      // Info IR Complementar (Simplificado - Primeiro item)
      { name: 'dtLaudo', label: 'Data Laudo Moléstia', type: 'date', path: 'ideBenef.infoIRComplem[0].dtLaudo', required: false, group: 'IR Complementar' },

      // Dependentes (Simplificado - Primeiro item)
      { name: 'cpfDep', label: 'CPF Dependente', type: 'text', path: 'ideBenef.infoIRComplem[0].infoDep[0].cpfDep', required: false, maxLength: 11, group: 'Dependentes' },
      { name: 'nomeDep', label: 'Nome Dependente', type: 'text', path: 'ideBenef.infoIRComplem[0].infoDep[0].nome', required: false, group: 'Dependentes' },
      { name: 'depIRRF', label: 'Dependente IRRF?', type: 'select', path: 'ideBenef.infoIRComplem[0].infoDep[0].depIRRF', required: false, group: 'Dependentes', options: [{ label: 'Sim', value: 'S' }, { label: 'Não', value: 'N' }] },

      // Info IR por CR (Simplificado - Primeiro item)
      { name: 'tpCR', label: 'Código Receita (CR)', type: 'number', path: 'ideBenef.infoIRComplem[0].infoIRCR[0].tpCR', required: false, group: 'Imposto de Renda' },

      // Plano de Saúde (Simplificado - Primeiro item)
      { name: 'cnpjOper', label: 'CNPJ Operadora', type: 'text', path: 'ideBenef.infoIRComplem[0].planSaude[0].cnpjOper', required: false, maxLength: 14, group: 'Plano de Saúde' },
      { name: 'regANS', label: 'Registro ANS', type: 'text', path: 'ideBenef.infoIRComplem[0].planSaude[0].regANS', required: false, maxLength: 6, group: 'Plano de Saúde' },
      { name: 'vlrSaudeTit', label: 'Valor Titular', type: 'number', path: 'ideBenef.infoIRComplem[0].planSaude[0].vlrSaudeTit', required: false, group: 'Plano de Saúde' },
    ]
  },
  [EventType.S1260]: {
    id: EventType.S1260,
    title: 'Comercialização Rural',
    description: 'Comercialização da produção rural PF.',
    defaultState: {
      tpAmb: 2, tpInsc: 1, nrInsc: '',
      ideEvento: { indRetif: 1, perApur: new Date().toISOString().slice(0, 7) },
      ideEmpregador: { tpInsc: 1, nrInsc: '' },
      infoComProd: {
        ideEstabel: {
          nrInscEstabRural: '',
          tpComerc: [
            {
              indComerc: 1,
              vrTotCom: 0,
              ideAdquir: [
                {
                  tpInsc: 1, nrInsc: '', vrComerc: 0,
                  nfs: [{ serie: '', nrDocto: '', dtEmisNF: '', vlrBruto: 0, vrCPDescPR: 0, vrRatDescPR: 0, vrSenarDesc: 0 }],
                  infoProcJud: [{ tpProc: 1, nrProc: '', codSusp: '', vrCPSusp: 0, vrRatSusp: 0, vrSenarSusp: 0 }]
                }
              ]
            }
          ]
        }
      }
    },
    fields: [
      ...commonIdentification,
      { name: 'perApur', label: 'Período Apuração', type: 'month', path: 'ideEvento.perApur', required: true, group: 'Referência' },

      // Estabelecimento Rural
      { name: 'nrInscEstabRural', label: 'CAEPF Estabelecimento', type: 'text', path: 'infoComProd.ideEstabel.nrInscEstabRural', required: true, maxLength: 14, group: 'Estabelecimento' },

      // Comercialização (Simplificado - Primeiro item)
      { name: 'indComerc', label: 'Ind. Comercialização', type: 'select', path: 'infoComProd.ideEstabel.tpComerc[0].indComerc', required: true, group: 'Comercialização', options: [{ label: '1 - Comercialização PF', value: 1 }, { label: '2 - Varejo Consumidor Final', value: 2 }, { label: '3 - Isento', value: 3 }, { label: '7 - Integrador', value: 7 }, { label: '8 - Cooperativa', value: 8 }, { label: '9 - Exportação', value: 9 }] },
      { name: 'vrTotCom', label: 'Valor Total', type: 'number', path: 'infoComProd.ideEstabel.tpComerc[0].vrTotCom', required: true, group: 'Comercialização' },

      // Adquirente (Simplificado - Primeiro item)
      { name: 'tpInscAdquir', label: 'Tipo Inscrição Adquirente', type: 'select', path: 'infoComProd.ideEstabel.tpComerc[0].ideAdquir[0].tpInsc', required: false, group: 'Adquirente', options: [{ label: '1 - CNPJ', value: 1 }, { label: '2 - CPF', value: 2 }] },
      { name: 'nrInscAdquir', label: 'Nr. Inscrição Adquirente', type: 'text', path: 'infoComProd.ideEstabel.tpComerc[0].ideAdquir[0].nrInsc', required: false, maxLength: 14, group: 'Adquirente' },
      { name: 'vrComercAdquir', label: 'Valor Comercialização', type: 'number', path: 'infoComProd.ideEstabel.tpComerc[0].ideAdquir[0].vrComerc', required: false, group: 'Adquirente' },

      // Nota Fiscal (Simplificado - Primeiro item)
      { name: 'serie', label: 'Série NF', type: 'text', path: 'infoComProd.ideEstabel.tpComerc[0].ideAdquir[0].nfs[0].serie', required: false, maxLength: 5, group: 'Nota Fiscal' },
      { name: 'nrDocto', label: 'Número NF', type: 'text', path: 'infoComProd.ideEstabel.tpComerc[0].ideAdquir[0].nfs[0].nrDocto', required: false, maxLength: 20, group: 'Nota Fiscal' },
      { name: 'dtEmisNF', label: 'Data Emissão', type: 'date', path: 'infoComProd.ideEstabel.tpComerc[0].ideAdquir[0].nfs[0].dtEmisNF', required: false, group: 'Nota Fiscal' },
      { name: 'vlrBruto', label: 'Valor Bruto', type: 'number', path: 'infoComProd.ideEstabel.tpComerc[0].ideAdquir[0].nfs[0].vlrBruto', required: false, group: 'Nota Fiscal' },
    ]
  },
  [EventType.S1270]: {
    id: EventType.S1270,
    title: 'Avulsos Não Portuários',
    description: 'Contratação de trabalhadores avulsos não portuários.',
    defaultState: {
      tpAmb: 2, tpInsc: 1, nrInsc: '',
      ideEvento: { indRetif: 1, perApur: new Date().toISOString().slice(0, 7) },
      ideEmpregador: { tpInsc: 1, nrInsc: '' },
      remunAvNP: [
        {
          tpInsc: 1, nrInsc: '', codLotacao: '',
          vrBcCp00: 0, vrBcCp15: 0, vrBcCp20: 0, vrBcCp25: 0,
          vrBcCp13: 0, vrBcFgts: 0, vrDescCP: 0
        }
      ]
    },
    fields: [
      ...commonIdentification,
      { name: 'perApur', label: 'Período Apuração', type: 'month', path: 'ideEvento.perApur', required: true, group: 'Referência' },

      // Remuneração (Simplificado - Primeiro item)
      { name: 'tpInscEstab', label: 'Tipo Inscrição Estab.', type: 'select', path: 'remunAvNP[0].tpInsc', required: true, group: 'Local', options: [{ label: '1 - CNPJ', value: 1 }, { label: '3 - CAEPF', value: 3 }, { label: '4 - CNO', value: 4 }] },
      { name: 'nrInscEstab', label: 'Nr. Inscrição Estab.', type: 'text', path: 'remunAvNP[0].nrInsc', required: true, maxLength: 14, group: 'Local' },
      { name: 'codLotacao', label: 'Lotação', type: 'text', path: 'remunAvNP[0].codLotacao', required: true, group: 'Local' },

      { name: 'vrBcCp00', label: 'Base CP', type: 'number', path: 'remunAvNP[0].vrBcCp00', required: true, group: 'Valores' },
      { name: 'vrBcCp15', label: 'Base CP 15 Anos', type: 'number', path: 'remunAvNP[0].vrBcCp15', required: true, group: 'Valores' },
      { name: 'vrBcCp20', label: 'Base CP 20 Anos', type: 'number', path: 'remunAvNP[0].vrBcCp20', required: true, group: 'Valores' },
      { name: 'vrBcCp25', label: 'Base CP 25 Anos', type: 'number', path: 'remunAvNP[0].vrBcCp25', required: true, group: 'Valores' },
      { name: 'vrBcCp13', label: 'Base CP 13º', type: 'number', path: 'remunAvNP[0].vrBcCp13', required: true, group: 'Valores' },
      { name: 'vrBcFgts', label: 'Base FGTS', type: 'number', path: 'remunAvNP[0].vrBcFgts', required: true, group: 'Valores' },
      { name: 'vrDescCP', label: 'Desc. CP Segurados', type: 'number', path: 'remunAvNP[0].vrDescCP', required: true, group: 'Valores' },
    ]
  },
  [EventType.S1280]: {
    id: EventType.S1280,
    title: 'Informações Complementares',
    description: 'Informações complementares aos eventos periódicos (Desoneração, etc).',
    defaultState: {
      tpAmb: 2, tpInsc: 1, nrInsc: '',
      ideEvento: { indApuracao: 1, perApur: '', indGuia: '' },
      ideEmpregador: { tpInsc: 1, nrInsc: '' },
      infoSubstPatr: { indSubstPatr: '', percRedContrib: 0 },
      infoSubstPatrOpPort: [{ codLotacao: '' }],
      infoAtivConcom: { fatorMes: 0, fator13: 0 },
      infoPercTransf11096: { percTransf: 0 }
    },
    fields: [
      ...commonIdentification,
      // Identificação Evento
      { name: 'indApuracao', label: 'Ind. Apuração', type: 'select', path: 'ideEvento.indApuracao', required: true, group: 'Evento', options: [{ label: '1-Mensal', value: 1 }, { label: '2-Anual (13°)', value: 2 }] },
      { name: 'perApur', label: 'Período Apuração', type: 'month', path: 'ideEvento.perApur', required: true, group: 'Evento' },

      // Substituição Patronal
      { name: 'indSubstPatr', label: 'Ind. Subst. Patronal', type: 'select', path: 'infoSubstPatr.indSubstPatr', required: true, group: 'Subst. Patronal', options: [{ label: '1-Integralmente Substituída', value: 1 }, { label: '2-Parcialmente Substituída', value: 2 }] },
      { name: 'percRedContrib', label: '% Redução Contrib.', type: 'number', path: 'infoSubstPatr.percRedContrib', required: true, group: 'Subst. Patronal' },

      // Operador Portuário (Simplificado)
      { name: 'codLotacao', label: 'Cód. Lotação (Op. Port.)', type: 'text', path: 'infoSubstPatrOpPort[0].codLotacao', required: false, group: 'Op. Portuário' },

      // Atividades Concomitantes
      { name: 'fatorMes', label: 'Fator Mês', type: 'number', path: 'infoAtivConcom.fatorMes', required: false, group: 'Ativ. Concomitantes' },
      { name: 'fator13', label: 'Fator 13°', type: 'number', path: 'infoAtivConcom.fator13', required: false, group: 'Ativ. Concomitantes' },

      // Transformação 11096
      { name: 'percTransf', label: '% Transformação', type: 'number', path: 'infoPercTransf11096.percTransf', required: false, group: 'Transformação' },
    ]
  },
  [EventType.S1298]: {
    id: EventType.S1298,
    title: 'Reabertura de Periódicos',
    description: 'Reabertura de movimento de um período já encerrado.',
    defaultState: {
      tpAmb: 2, tpInsc: 1, nrInsc: '',
      ideEvento: { perApur: new Date().toISOString().slice(0, 7) },
      ideEmpregador: { tpInsc: 1, nrInsc: '' }
    },
    fields: [
      ...commonIdentification,
      { name: 'perApur', label: 'Período Apuração', type: 'month', path: 'ideEvento.perApur', required: true, group: 'Referência' },
    ]
  },


  // --- BENEFÍCIOS RPPS (PUBLIC SECTOR BENEFITS) ---
  [EventType.S2400]: {
    id: EventType.S2400,
    title: 'Cadastro Beneficiário (Entes Públicos)',
    description: 'Cadastro de beneficiários dos regimes próprios de previdência.',
    defaultState: {
      tpAmb: 2, tpInsc: 1, nrInsc: '',
      ideEvento: { indRetif: 1, nrRecibo: '' },
      ideEmpregador: { tpInsc: 1, nrInsc: '' },
      beneficiario: {
        cpfBenef: '', nmBenefic: '', dtNascto: '', dtInicio: '', sexo: 'M', racaCor: 1, estCiv: 1, incFisMen: 'N', dtIncFisMen: '',
        endereco: { brasil: { tpLograd: '', dscLograd: '', nrLograd: '', complemento: '', bairro: '', cep: '', codMunic: '', uf: '' } },
        dependente: { tpDep: '', nmDep: '', dtNascto: '', cpfDep: '', sexoDep: 'M', depIRRF: 'N', incFisMen: 'N', descrDep: '' }
      }
    },
    fields: [
      ...commonIdentification,
      { name: 'cpfBenef', label: 'CPF Beneficiário', type: 'text', path: 'beneficiario.cpfBenef', required: true, maxLength: 11, group: 'Beneficiário' },
      { name: 'nmBenefic', label: 'Nome Completo', type: 'text', path: 'beneficiario.nmBenefic', required: true, group: 'Beneficiário' },
      { name: 'dtNascto', label: 'Data Nascimento', type: 'date', path: 'beneficiario.dtNascto', required: true, group: 'Beneficiário' },
      { name: 'dtInicio', label: 'Data Início', type: 'date', path: 'beneficiario.dtInicio', required: true, group: 'Beneficiário' },
      { name: 'sexo', label: 'Sexo', type: 'select', path: 'beneficiario.sexo', required: true, group: 'Beneficiário', options: [{ label: 'Masculino', value: 'M' }, { label: 'Feminino', value: 'F' }] },
      { name: 'racaCor', label: 'Raça/Cor', type: 'select', path: 'beneficiario.racaCor', required: true, group: 'Beneficiário', options: [{ label: '1-Branca', value: 1 }, { label: '2-Preta', value: 2 }, { label: '3-Parda', value: 3 }, { label: '4-Amarela', value: 4 }, { label: '5-Indígena', value: 5 }] },
      { name: 'estCiv', label: 'Estado Civil', type: 'select', path: 'beneficiario.estCiv', required: false, group: 'Beneficiário', options: [{ label: '1-Solteiro', value: 1 }, { label: '2-Casado', value: 2 }, { label: '5-Separado', value: 5 }, { label: '6-Viúvo', value: 6 }] },
      { name: 'incFisMen', label: 'Incapacidade?', type: 'select', path: 'beneficiario.incFisMen', required: true, group: 'Beneficiário', options: [{ label: 'Sim', value: 'S' }, { label: 'Não', value: 'N' }] },
      { name: 'dtIncFisMen', label: 'Data Incapacidade', type: 'date', path: 'beneficiario.dtIncFisMen', required: false, group: 'Beneficiário' },

      // Endereço
      { name: 'cep', label: 'CEP', type: 'text', path: 'beneficiario.endereco.brasil.cep', required: true, maxLength: 8, group: 'Endereço' },
      { name: 'tpLograd', label: 'Tipo Logradouro', type: 'text', path: 'beneficiario.endereco.brasil.tpLograd', required: true, group: 'Endereço', placeholder: 'Rua, Av, etc' },
      { name: 'dscLograd', label: 'Logradouro', type: 'text', path: 'beneficiario.endereco.brasil.dscLograd', required: true, group: 'Endereço' },
      { name: 'nrLograd', label: 'Número', type: 'text', path: 'beneficiario.endereco.brasil.nrLograd', required: true, group: 'Endereço' },
      { name: 'bairro', label: 'Bairro', type: 'text', path: 'beneficiario.endereco.brasil.bairro', required: true, group: 'Endereço' },
      { name: 'codMunic', label: 'Cód. Município (IBGE)', type: 'text', path: 'beneficiario.endereco.brasil.codMunic', required: true, maxLength: 7, group: 'Endereço' },
      { name: 'uf', label: 'UF', type: 'text', path: 'beneficiario.endereco.brasil.uf', required: true, maxLength: 2, group: 'Endereço' },

      // Dependente (Simplificado - Um dependente)
      { name: 'tpDep', label: 'Tipo Dependente', type: 'select', path: 'beneficiario.dependente.tpDep', required: false, group: 'Dependente', options: [{ label: '01 - Cônjuge', value: '01' }, { label: '03 - Filho', value: '03' }] },
      { name: 'nmDep', label: 'Nome Dependente', type: 'text', path: 'beneficiario.dependente.nmDep', required: false, group: 'Dependente' },
      { name: 'dtNascto', label: 'Data Nasc. Dep.', type: 'date', path: 'beneficiario.dependente.dtNascto', required: false, group: 'Dependente' },
      { name: 'cpfDep', label: 'CPF Dependente', type: 'text', path: 'beneficiario.dependente.cpfDep', required: false, maxLength: 11, group: 'Dependente' },
    ]
  },
  [EventType.S2405]: {
    id: EventType.S2405,
    title: 'Alteração Cadastral Beneficiário',
    description: 'Alteração de dados cadastrais do beneficiário (RPPS).',
    defaultState: {
      tpAmb: 2, tpInsc: 1, nrInsc: '',
      ideEvento: { indRetif: 1, nrRecibo: '' },
      ideEmpregador: { tpInsc: 1, nrInsc: '' },
      ideBenef: { cpfBenef: '' },
      alteracao: {
        dtAlteracao: '',
        dadosBenef: {
          nmBenefic: '', sexo: 'M', racaCor: 1, estCiv: 1, incFisMen: 'N',
          endereco: { brasil: { tpLograd: '', dscLograd: '', nrLograd: '', complemento: '', bairro: '', cep: '', codMunic: '', uf: '' } },
          dependente: { tpDep: '', nmDep: '', dtNascto: '', cpfDep: '', sexoDep: 'M', depIRRF: 'N', incFisMen: 'N', descrDep: '' }
        }
      }
    },
    fields: [
      ...commonIdentification,
      { name: 'cpfBenef', label: 'CPF Beneficiário', type: 'text', path: 'ideBenef.cpfBenef', required: true, maxLength: 11, group: 'Identificação' },

      // Alteração
      { name: 'dtAlteracao', label: 'Data Alteração', type: 'date', path: 'alteracao.dtAlteracao', required: true, group: 'Alteração' },

      // Dados Beneficiário
      { name: 'nmBenefic', label: 'Novo Nome', type: 'text', path: 'alteracao.dadosBenef.nmBenefic', required: true, group: 'Dados Pessoais' },
      { name: 'sexo', label: 'Sexo', type: 'select', path: 'alteracao.dadosBenef.sexo', required: true, group: 'Dados Pessoais', options: [{ label: 'Masculino', value: 'M' }, { label: 'Feminino', value: 'F' }] },
      { name: 'racaCor', label: 'Raça/Cor', type: 'select', path: 'alteracao.dadosBenef.racaCor', required: true, group: 'Dados Pessoais', options: [{ label: '1-Branca', value: 1 }, { label: '2-Preta', value: 2 }, { label: '3-Parda', value: 3 }, { label: '4-Amarela', value: 4 }, { label: '5-Indígena', value: 5 }] },
      { name: 'estCiv', label: 'Estado Civil', type: 'select', path: 'alteracao.dadosBenef.estCiv', required: false, group: 'Dados Pessoais', options: [{ label: '1-Solteiro', value: 1 }, { label: '2-Casado', value: 2 }, { label: '5-Separado', value: 5 }, { label: '6-Viúvo', value: 6 }] },
      { name: 'incFisMen', label: 'Incapacidade?', type: 'select', path: 'alteracao.dadosBenef.incFisMen', required: true, group: 'Dados Pessoais', options: [{ label: 'Sim', value: 'S' }, { label: 'Não', value: 'N' }] },

      // Endereço
      { name: 'cep', label: 'CEP', type: 'text', path: 'alteracao.dadosBenef.endereco.brasil.cep', required: true, maxLength: 8, group: 'Endereço' },
      { name: 'tpLograd', label: 'Tipo Logradouro', type: 'text', path: 'alteracao.dadosBenef.endereco.brasil.tpLograd', required: true, group: 'Endereço', placeholder: 'Rua, Av, etc' },
      { name: 'dscLograd', label: 'Logradouro', type: 'text', path: 'alteracao.dadosBenef.endereco.brasil.dscLograd', required: true, group: 'Endereço' },
      { name: 'nrLograd', label: 'Número', type: 'text', path: 'alteracao.dadosBenef.endereco.brasil.nrLograd', required: true, group: 'Endereço' },
      { name: 'bairro', label: 'Bairro', type: 'text', path: 'alteracao.dadosBenef.endereco.brasil.bairro', required: true, group: 'Endereço' },
      { name: 'codMunic', label: 'Cód. Município (IBGE)', type: 'text', path: 'alteracao.dadosBenef.endereco.brasil.codMunic', required: true, maxLength: 7, group: 'Endereço' },
      { name: 'uf', label: 'UF', type: 'text', path: 'alteracao.dadosBenef.endereco.brasil.uf', required: true, maxLength: 2, group: 'Endereço' },

      // Dependente (Simplificado - Um dependente)
      { name: 'tpDep', label: 'Tipo Dependente', type: 'select', path: 'alteracao.dadosBenef.dependente.tpDep', required: false, group: 'Dependente', options: [{ label: '01 - Cônjuge', value: '01' }, { label: '03 - Filho', value: '03' }] },
      { name: 'nmDep', label: 'Nome Dependente', type: 'text', path: 'alteracao.dadosBenef.dependente.nmDep', required: false, group: 'Dependente' },
      { name: 'dtNascto', label: 'Data Nasc. Dep.', type: 'date', path: 'alteracao.dadosBenef.dependente.dtNascto', required: false, group: 'Dependente' },
      { name: 'cpfDep', label: 'CPF Dependente', type: 'text', path: 'alteracao.dadosBenef.dependente.cpfDep', required: false, maxLength: 11, group: 'Dependente' },
    ]
  },
  [EventType.S2410]: {
    id: EventType.S2410,
    title: 'Cadastro de Benefício',
    description: 'Cadastro de benefícios concedidos (Aposentadoria, Pensão).',
    defaultState: {
      tpAmb: 2, tpInsc: 1, nrInsc: '',
      beneficiario: { cpfBenef: '', matricula: '' },
      infoBen: { nrBeneficio: '', dtIniBeneficio: '', tpBeneficio: '', tpPlanRP: 1 }
    },
    fields: [
      ...commonIdentification,
      { name: 'cpfBenef', label: 'CPF Beneficiário', type: 'text', path: 'beneficiario.cpfBenef', required: true, maxLength: 11, group: 'Identificação' },
      { name: 'nrBeneficio', label: 'Número Benefício', type: 'text', path: 'infoBen.nrBeneficio', required: true, group: 'Dados do Benefício' },
      { name: 'tpBeneficio', label: 'Tipo Benefício', type: 'select', path: 'infoBen.tpBeneficio', required: true, group: 'Dados do Benefício', options: [{ label: '01 - Aposentadoria', value: '01' }, { label: '02 - Pensão', value: '02' }] },
      { name: 'dtIniBeneficio', label: 'Data Início', type: 'date', path: 'infoBen.dtIniBeneficio', required: true, group: 'Dados do Benefício' },
      { name: 'tpPlanRP', label: 'Tipo Plano Segregação', type: 'select', path: 'infoBen.tpPlanRP', required: true, group: 'Dados do Benefício', options: [{ label: '0 - Sem Segregação', value: 0 }, { label: '1 - Fundo em Capitalização', value: 1 }, { label: '2 - Fundo em Repartição', value: 2 }] },
    ]
  },
  [EventType.S2416]: {
    id: EventType.S2416,
    title: 'Alteração de Benefício',
    description: 'Alteração de informações do benefício.',
    defaultState: {
      tpAmb: 2, tpInsc: 1, nrInsc: '',
      ideEvento: { indRetif: 1, nrRecibo: '' },
      ideEmpregador: { tpInsc: 1, nrInsc: '' },
      ideBeneficio: { cpfBenef: '', nrBeneficio: '' },
      infoBenAlteracao: {
        dtAltBeneficio: '',
        dadosBeneficio: {
          tpBeneficio: '', tpPlanRP: 0, dsc: '', indSuspensao: 'N',
          infoPenMorte: { tpPenMorte: '', instPenMorte: { tpDepInst: '', descrDepInst: '' } },
          suspensao: { mtvSuspensao: '', dscSuspensao: '' }
        }
      }
    },
    fields: [
      ...commonIdentification,
      { name: 'cpfBenef', label: 'CPF Beneficiário', type: 'text', path: 'ideBeneficio.cpfBenef', required: true, maxLength: 11, group: 'Identificação' },
      { name: 'nrBeneficio', label: 'Número Benefício', type: 'text', path: 'ideBeneficio.nrBeneficio', required: true, group: 'Identificação' },

      // Alteração
      { name: 'dtAltBeneficio', label: 'Data Alteração', type: 'date', path: 'infoBenAlteracao.dtAltBeneficio', required: true, group: 'Alteração' },

      // Dados Benefício
      { name: 'tpBeneficio', label: 'Tipo Benefício', type: 'text', path: 'infoBenAlteracao.dadosBeneficio.tpBeneficio', required: true, group: 'Dados Benefício', placeholder: 'Ver Tabela 25' },
      { name: 'tpPlanRP', label: 'Tipo Plano Segregação', type: 'select', path: 'infoBenAlteracao.dadosBeneficio.tpPlanRP', required: true, group: 'Dados Benefício', options: [{ label: '0 - Sem Segregação', value: 0 }, { label: '1 - Fundo em Capitalização', value: 1 }, { label: '2 - Fundo em Repartição', value: 2 }] },
      { name: 'dsc', label: 'Descrição', type: 'text', path: 'infoBenAlteracao.dadosBeneficio.dsc', required: false, group: 'Dados Benefício' },
      { name: 'indSuspensao', label: 'Suspensão?', type: 'select', path: 'infoBenAlteracao.dadosBeneficio.indSuspensao', required: true, group: 'Dados Benefício', options: [{ label: 'Sim', value: 'S' }, { label: 'Não', value: 'N' }] },

      // Pensão por Morte
      { name: 'tpPenMorte', label: 'Tipo Pensão Morte', type: 'select', path: 'infoBenAlteracao.dadosBeneficio.infoPenMorte.tpPenMorte', required: false, group: 'Pensão por Morte', options: [{ label: '1 - Vitalícia', value: 1 }, { label: '2 - Temporária', value: 2 }] },
      { name: 'tpDepInst', label: 'Tipo Dependente', type: 'select', path: 'infoBenAlteracao.dadosBeneficio.infoPenMorte.instPenMorte.tpDepInst', required: false, group: 'Pensão por Morte', options: [{ label: '01 - Cônjuge', value: '01' }, { label: '02 - Companheiro', value: '02' }, { label: '03 - Filho', value: '03' }] },
      { name: 'descrDepInst', label: 'Descrição Dependente', type: 'text', path: 'infoBenAlteracao.dadosBeneficio.infoPenMorte.instPenMorte.descrDepInst', required: false, group: 'Pensão por Morte' },

      // Suspensão
      { name: 'mtvSuspensao', label: 'Motivo Suspensão', type: 'select', path: 'infoBenAlteracao.dadosBeneficio.suspensao.mtvSuspensao', required: false, group: 'Suspensão', options: [{ label: '01 - Não Recadastramento', value: '01' }, { label: '99 - Outros', value: '99' }] },
      { name: 'dscSuspensao', label: 'Descrição Suspensão', type: 'text', path: 'infoBenAlteracao.dadosBeneficio.suspensao.dscSuspensao', required: false, group: 'Suspensão' },
    ]
  },
  [EventType.S2418]: {
    id: EventType.S2418,
    title: 'Reativação de Benefício',
    description: 'Reativação de benefício previamente cessado.',
    defaultState: {
      tpAmb: 2, tpInsc: 1, nrInsc: '',
      ideEvento: { indRetif: 1, nrRecibo: '' },
      ideEmpregador: { tpInsc: 1, nrInsc: '' },
      ideBeneficio: { cpfBenef: '', nrBeneficio: '' },
      infoReativ: { dtEfetReativ: '', dtEfeito: '' }
    },
    fields: [
      ...commonIdentification,
      { name: 'cpfBenef', label: 'CPF Beneficiário', type: 'text', path: 'ideBeneficio.cpfBenef', required: true, maxLength: 11, group: 'Identificação' },
      { name: 'nrBeneficio', label: 'Número Benefício', type: 'text', path: 'ideBeneficio.nrBeneficio', required: true, group: 'Identificação' },
      { name: 'dtEfetReativ', label: 'Data Efetiva Reativação', type: 'date', path: 'infoReativ.dtEfetReativ', required: true, group: 'Dados' },
      { name: 'dtEfeito', label: 'Data Efeito Financeiro', type: 'date', path: 'infoReativ.dtEfeito', required: true, group: 'Dados' },
    ]
  },
  [EventType.S2420]: {
    id: EventType.S2420,
    title: 'Término de Benefício',
    description: 'Encerramento do benefício.',
    defaultState: {
      tpAmb: 2, tpInsc: 1, nrInsc: '',
      ideEvento: { indRetif: 1, nrRecibo: '' },
      ideEmpregador: { tpInsc: 1, nrInsc: '' },
      ideBeneficio: { cpfBenef: '', nrBeneficio: '' },
      infoBenTermino: { dtTermBeneficio: '', mtvTermino: '', cnpjOrgaoSuc: '', novoCPF: '' }
    },
    fields: [
      ...commonIdentification,
      { name: 'cpfBenef', label: 'CPF Beneficiário', type: 'text', path: 'ideBeneficio.cpfBenef', required: true, maxLength: 11, group: 'Identificação' },
      { name: 'nrBeneficio', label: 'Número Benefício', type: 'text', path: 'ideBeneficio.nrBeneficio', required: true, group: 'Identificação' },

      // Término
      { name: 'dtTermBeneficio', label: 'Data Término', type: 'date', path: 'infoBenTermino.dtTermBeneficio', required: true, group: 'Término' },
      { name: 'mtvTermino', label: 'Motivo Término', type: 'select', path: 'infoBenTermino.mtvTermino', required: true, group: 'Término', options: [{ label: '01 - Óbito', value: '01' }, { label: '02 - Cessação', value: '02' }, { label: '09 - Transferência', value: '09' }, { label: '10 - Mudança CPF', value: '10' }] },
      { name: 'cnpjOrgaoSuc', label: 'CNPJ Sucessor', type: 'text', path: 'infoBenTermino.cnpjOrgaoSuc', required: false, maxLength: 14, group: 'Término' },
      { name: 'novoCPF', label: 'Novo CPF', type: 'text', path: 'infoBenTermino.novoCPF', required: false, maxLength: 11, group: 'Término' },
    ]
  },


  // --- JUDICIAL ---
  [EventType.S8200]: {
    id: EventType.S8200,
    title: 'Anotação Judicial do Vínculo',
    description: 'Evento utilizado para prestar informações de anotação judicial do vínculo trabalhista.',
    defaultState: {
      tpAmb: 2, tpInsc: 1, nrInsc: '',
      infoProcesso: { nrProcTrab: '', dtSent: '', ufVara: '', codMunic: '', idVara: '' },
      infoAnotJud: {
        cpfTrab: '', nmTrab: '', dtNascto: '', dtAdm: '', matricula: '', codCateg: 101, natAtividade: 1,
        tpContr: 1, dtTerm: '', tpRegTrab: 1, tpRegPrev: 1,
        cargo: { dtCargo: '', CBOCargo: '' },
        remuneracao: { dtRemun: '', vrSalFx: 0, undSalFixo: 5, dscSalVar: '' }
      }
    },
    fields: [
      ...commonIdentification,
      // Processo Judicial
      { name: 'nrProcTrab', label: 'Número Processo', type: 'text', path: 'infoProcesso.nrProcTrab', required: true, maxLength: 20, group: 'Processo Judicial' },
      { name: 'dtSent', label: 'Data Sentença', type: 'date', path: 'infoProcesso.dtSent', required: true, group: 'Processo Judicial' },
      { name: 'ufVara', label: 'UF Vara', type: 'text', path: 'infoProcesso.ufVara', required: true, maxLength: 2, group: 'Processo Judicial' },
      { name: 'codMunic', label: 'Cód. Município', type: 'text', path: 'infoProcesso.codMunic', required: true, maxLength: 7, group: 'Processo Judicial' },
      { name: 'idVara', label: 'ID Vara', type: 'text', path: 'infoProcesso.idVara', required: true, group: 'Processo Judicial' },

      // Trabalhador
      { name: 'cpfTrab', label: 'CPF Trabalhador', type: 'text', path: 'infoAnotJud.cpfTrab', required: true, maxLength: 11, group: 'Trabalhador' },
      { name: 'nmTrab', label: 'Nome Completo', type: 'text', path: 'infoAnotJud.nmTrab', required: true, group: 'Trabalhador' },
      { name: 'dtNascto', label: 'Data Nascimento', type: 'date', path: 'infoAnotJud.dtNascto', required: true, group: 'Trabalhador' },
      { name: 'matricula', label: 'Matrícula (eSocial-JUD-...)', type: 'text', path: 'infoAnotJud.matricula', required: true, group: 'Trabalhador', placeholder: 'eSocial-JUD-...' },
      { name: 'dtAdm', label: 'Data Admissão', type: 'date', path: 'infoAnotJud.dtAdm', required: true, group: 'Trabalhador' },

      // Contrato
      { name: 'codCateg', label: 'Categoria', type: 'select', path: 'infoAnotJud.codCateg', required: true, group: 'Contrato', options: [{ label: '101 - Empregado', value: 101 }, { label: '106 - Trab. Temporário', value: 106 }] },
      { name: 'natAtividade', label: 'Natureza Atividade', type: 'select', path: 'infoAnotJud.natAtividade', required: true, group: 'Contrato', options: [{ label: '1-Urbano', value: 1 }, { label: '2-Rural', value: 2 }] },
      { name: 'tpContr', label: 'Tipo Contrato', type: 'select', path: 'infoAnotJud.tpContr', required: true, group: 'Contrato', options: [{ label: '1-Prazo Indeterminado', value: 1 }, { label: '2-Prazo Determinado', value: 2 }] },
      { name: 'dtTerm', label: 'Data Término', type: 'date', path: 'infoAnotJud.dtTerm', required: false, group: 'Contrato' },
      { name: 'tpRegTrab', label: 'Regime Trabalhista', type: 'select', path: 'infoAnotJud.tpRegTrab', required: true, group: 'Contrato', options: [{ label: '1-CLT', value: 1 }] },
      { name: 'tpRegPrev', label: 'Regime Previdenciário', type: 'select', path: 'infoAnotJud.tpRegPrev', required: true, group: 'Contrato', options: [{ label: '1-RGPS', value: 1 }, { label: '2-RPPS', value: 2 }] },

      // Cargo
      { name: 'dtCargo', label: 'Data Início Cargo', type: 'date', path: 'infoAnotJud.cargo.dtCargo', required: true, group: 'Cargo' },
      { name: 'CBOCargo', label: 'CBO Cargo', type: 'text', path: 'infoAnotJud.cargo.CBOCargo', required: true, maxLength: 6, group: 'Cargo' },

      // Remuneração
      { name: 'dtRemun', label: 'Data Início Remuneração', type: 'date', path: 'infoAnotJud.remuneracao.dtRemun', required: true, group: 'Remuneração' },
      { name: 'vrSalFx', label: 'Salário Base', type: 'number', path: 'infoAnotJud.remuneracao.vrSalFx', required: true, group: 'Remuneração' },
      { name: 'undSalFixo', label: 'Unidade Salário', type: 'select', path: 'infoAnotJud.remuneracao.undSalFixo', required: true, group: 'Remuneração', options: [{ label: '5-Por Mês', value: 5 }, { label: '1-Por Hora', value: 1 }] },
    ]
  },
  [EventType.S8299]: {
    id: EventType.S8299,
    title: 'Baixa Judicial do Vínculo',
    description: 'Evento utilizado para informar a baixa judicial do vínculo trabalhista.',
    defaultState: {
      tpAmb: 2, tpInsc: 1, nrInsc: '',
      ideVinculo: { cpfTrab: '', matricula: '' },
      infoBaixa: { mtvDeslig: '', dtDeslig: '', dtProjFimAPI: '', nrProcTrab: '', observacao: '' }
    },
    fields: [
      ...commonIdentification,
      // Vínculo
      { name: 'cpfTrab', label: 'CPF Trabalhador', type: 'text', path: 'ideVinculo.cpfTrab', required: true, maxLength: 11, group: 'Trabalhador' },
      { name: 'matricula', label: 'Matrícula', type: 'text', path: 'ideVinculo.matricula', required: true, group: 'Trabalhador' },

      // Baixa
      { name: 'mtvDeslig', label: 'Motivo Desligamento', type: 'text', path: 'infoBaixa.mtvDeslig', required: true, group: 'Baixa Judicial', placeholder: 'Ver Tabela 19' },
      { name: 'dtDeslig', label: 'Data Desligamento', type: 'date', path: 'infoBaixa.dtDeslig', required: true, group: 'Baixa Judicial' },
      { name: 'dtProjFimAPI', label: 'Data Proj. Fim Aviso Prévio', type: 'date', path: 'infoBaixa.dtProjFimAPI', required: false, group: 'Baixa Judicial' },
      { name: 'nrProcTrab', label: 'Número Processo', type: 'text', path: 'infoBaixa.nrProcTrab', required: true, maxLength: 20, group: 'Baixa Judicial' },
      { name: 'observacao', label: 'Observação', type: 'text', path: 'infoBaixa.observacao', required: false, group: 'Baixa Judicial' },
    ]
  },

  // --- CONTROLE ---
  [EventType.S3000]: {
    id: EventType.S3000,
    title: 'Exclusão de Eventos',
    description: 'Torna sem efeito um evento enviado indevidamente.',
    defaultState: {
      tpAmb: 2, tpInsc: 1, nrInsc: '',
      infoExclusao: { tpEvento: '', nrRecEvt: '', ideTrabalhador: { cpfTrab: '' }, ideFolhaPagto: { indApuracao: '', perApur: '' } }
    },
    fields: [
      ...commonIdentification,
      { name: 'tpEvento', label: 'Tipo do Evento a Excluir', type: 'text', path: 'infoExclusao.tpEvento', required: true, placeholder: 'S-1200', group: 'Dados Exclusão' },
      { name: 'nrRecEvt', label: 'Número do Recibo', type: 'text', path: 'infoExclusao.nrRecEvt', required: true, group: 'Dados Exclusão' },

      // Identificação do Trabalhador (Condicional)
      { name: 'cpfTrab', label: 'CPF do Trabalhador', type: 'text', path: 'infoExclusao.ideTrabalhador.cpfTrab', required: false, maxLength: 11, group: 'Identificação (Se houver)' },

      // Folha de Pagamento (Condicional)
      { name: 'perApur', label: 'Período Apuração', type: 'month', path: 'infoExclusao.ideFolhaPagto.perApur', required: false, group: 'Folha (Se houver)' },
      { name: 'indApuracao', label: 'Ind. Apuração', type: 'select', path: 'infoExclusao.ideFolhaPagto.indApuracao', required: false, group: 'Folha (Se houver)', options: [{ label: '1 - Mensal', value: 1 }, { label: '2 - Anual (13°)', value: 2 }] },
    ]
  },
  [EventType.S3500]: {
    id: EventType.S3500,
    title: 'Exclusão de Eventos - Proc. Trab.',
    description: 'Exclusão de eventos de Processo Trabalhista (S-2500, S-2501, S-2555).',
    defaultState: {
      tpAmb: 2, tpInsc: 1, nrInsc: '',
      infoExclusao: {
        tpEvento: '',
        nrRecEvt: '',
        ideProcTrab: {
          nrProcTrab: '',
          cpfTrab: '',
          perApurPgto: '',
          ideSeqProc: ''
        }
      }
    },
    fields: [
      ...commonIdentification,
      { name: 'tpEvento', label: 'Tipo do Evento', type: 'select', path: 'infoExclusao.tpEvento', required: true, group: 'Dados Exclusão', options: [{ label: 'S-2500 - Processo Trabalhista', value: 'S-2500' }, { label: 'S-2501 - Tributos Proc. Trab.', value: 'S-2501' }, { label: 'S-2555 - Consolidação Proc. Trab.', value: 'S-2555' }] },
      { name: 'nrRecEvt', label: 'Número do Recibo', type: 'text', path: 'infoExclusao.nrRecEvt', required: true, group: 'Dados Exclusão' },

      // Identificação Processo
      { name: 'nrProcTrab', label: 'Número do Processo', type: 'text', path: 'infoExclusao.ideProcTrab.nrProcTrab', required: true, group: 'Identificação Processo' },
      { name: 'cpfTrab', label: 'CPF do Trabalhador', type: 'text', path: 'infoExclusao.ideProcTrab.cpfTrab', required: false, maxLength: 11, group: 'Identificação Processo', placeholder: 'Obrigatório se S-2500' },
      { name: 'perApurPgto', label: 'Mês/Ano Pagamento', type: 'month', path: 'infoExclusao.ideProcTrab.perApurPgto', required: false, group: 'Identificação Processo', placeholder: 'Obrigatório se S-2501/S-2555' },
      { name: 'ideSeqProc', label: 'Seq. Processo', type: 'number', path: 'infoExclusao.ideProcTrab.ideSeqProc', required: false, group: 'Identificação Processo' },
    ]
  },

  // --- RETORNO CONTRIBUIÇÕES SOCIAIS ---
  [EventType.S5001]: {
    id: EventType.S5001,
    title: 'Informações das Contribuições Sociais por Trabalhador',
    description: 'Evento de retorno com informações consolidadas das contribuições sociais.',
    defaultState: {
      tpAmb: 2, tpInsc: 1, nrInsc: '',
      ideEvento: { nrRecArqBase: '', indApuracao: 1, perApur: '' },
      ideTrabalhador: { cpfTrab: '' },
      infoCpCalc: [{ tpCR: '', vrCpSeg: 0, vrDescSeg: 0 }],
      infoCp: {
        classTrib: '',
        ideEstabLot: [
          {
            tpInsc: 1, nrInsc: '', codLotacao: '',
            infoCategIncid: [
              {
                matricula: '', codCateg: 101, indSimples: 1,
                infoBaseCS: [{ ind13: 0, tpValor: 11, valor: 0 }]
              }
            ]
          }
        ]
      }
    },
    fields: [
      ...commonIdentification,
      { name: 'nrRecArqBase', label: 'Recibo Arquivo Base', type: 'text', path: 'ideEvento.nrRecArqBase', required: true, group: 'Evento' },
      { name: 'perApur', label: 'Período Apuração', type: 'month', path: 'ideEvento.perApur', required: true, group: 'Evento' },
      { name: 'cpfTrab', label: 'CPF Trabalhador', type: 'text', path: 'ideTrabalhador.cpfTrab', required: true, maxLength: 11, group: 'Trabalhador' },

      // Cálculo CP (Simplificado)
      { name: 'tpCR', label: 'Código Receita (CR)', type: 'text', path: 'infoCpCalc[0].tpCR', required: true, group: 'Cálculo CP' },
      { name: 'vrCpSeg', label: 'Valor CP Segurado', type: 'number', path: 'infoCpCalc[0].vrCpSeg', required: true, group: 'Cálculo CP' },
      { name: 'vrDescSeg', label: 'Valor Descontado', type: 'number', path: 'infoCpCalc[0].vrDescSeg', required: true, group: 'Cálculo CP' },
    ]
  },
  [EventType.S5002]: {
    id: EventType.S5002,
    title: 'Imposto de Renda Retido na Fonte por Trabalhador',
    description: 'Evento de retorno com informações de IRRF por trabalhador.',
    defaultState: {
      tpAmb: 2, tpInsc: 1, nrInsc: '',
      ideEvento: { nrRecArqBase: '', perApur: '' },
      ideEmpregador: { tpInsc: 1, nrInsc: '' },
      ideTrabalhador: {
        cpfBenef: '',
        dmDev: [
          {
            perRef: '', ideDmDev: '', tpPgto: 1, dtPgto: '', codCateg: 101,
            infoIR: [{ tpInfoIR: 11, valor: 0, descRendimento: '' }],
            totApurMen: [{ CRMen: '', vlrRendTrib: 0, vlrRendTrib13: 0, vlrPrevOficial: 0, vlrPrevOficial13: 0, vlrCRMen: 0, vlrCR13Men: 0, vlrParcIsenta65: 0, vlrParcIsenta65Dec: 0, vlrDiarias: 0, vlrAjudaCusto: 0, vlrIndResContrato: 0, vlrAbonoPec: 0, vlrRendMoleGrave: 0, vlrRendMoleGrave13: 0 }],
            totApurDia: [{ perApurDia: '', CRDia: '', vlrRendTrib: 0, vlrRendTrib13: 0, vlrPrevOficial: 0, vlrPrevOficial13: 0, vlrCRDia: 0, vlrCR13Dia: 0, vlrParcIsenta65: 0, vlrParcIsenta65Dec: 0, vlrDiarias: 0, vlrAjudaCusto: 0, vlrIndResContrato: 0, vlrAbonoPec: 0, vlrRendMoleGrave: 0, vlrRendMoleGrave13: 0 }]
          }
        ]
      }
    },
    fields: [
      ...commonIdentification,
      { name: 'nrRecArqBase', label: 'Recibo Arquivo Base', type: 'text', path: 'ideEvento.nrRecArqBase', required: true, group: 'Evento' },
      { name: 'perApur', label: 'Período Apuração', type: 'month', path: 'ideEvento.perApur', required: true, group: 'Evento' },
      { name: 'cpfBenef', label: 'CPF Beneficiário', type: 'text', path: 'ideTrabalhador.cpfBenef', required: true, maxLength: 11, group: 'Trabalhador' },

      // Demonstrativo de Valores Devidos (Simplificado - Primeiro Item)
      { name: 'perRef', label: 'Período Referência', type: 'month', path: 'ideTrabalhador.dmDev[0].perRef', required: true, group: 'Demonstrativo' },
      { name: 'ideDmDev', label: 'ID Demonstrativo', type: 'text', path: 'ideTrabalhador.dmDev[0].ideDmDev', required: true, group: 'Demonstrativo' },
      { name: 'tpPgto', label: 'Tipo Pagamento', type: 'select', path: 'ideTrabalhador.dmDev[0].tpPgto', required: true, group: 'Demonstrativo', options: [{ label: '1-S-1200', value: 1 }, { label: '2-S-2299', value: 2 }, { label: '3-S-2399', value: 3 }, { label: '4-S-1202', value: 4 }, { label: '5-S-1207', value: 5 }] },
      { name: 'dtPgto', label: 'Data Pagamento', type: 'date', path: 'ideTrabalhador.dmDev[0].dtPgto', required: true, group: 'Demonstrativo' },
      { name: 'codCateg', label: 'Cód. Categoria', type: 'number', path: 'ideTrabalhador.dmDev[0].codCateg', required: true, group: 'Demonstrativo' },

      // Info IR (Simplificado - Primeiro Item)
      { name: 'tpInfoIR', label: 'Tipo Info IR', type: 'number', path: 'ideTrabalhador.dmDev[0].infoIR[0].tpInfoIR', required: true, group: 'Info IR' },
      { name: 'valor', label: 'Valor', type: 'number', path: 'ideTrabalhador.dmDev[0].infoIR[0].valor', required: true, group: 'Info IR' },

      // Totalizador Mensal (Simplificado - Primeiro Item)
      { name: 'CRMen', label: 'CR Mensal', type: 'text', path: 'ideTrabalhador.dmDev[0].totApurMen[0].CRMen', required: true, group: 'Total Mensal' },
      { name: 'vlrRendTrib', label: 'Rend. Tributável', type: 'number', path: 'ideTrabalhador.dmDev[0].totApurMen[0].vlrRendTrib', required: true, group: 'Total Mensal' },
      { name: 'vlrCRMen', label: 'Valor IRRF', type: 'number', path: 'ideTrabalhador.dmDev[0].totApurMen[0].vlrCRMen', required: true, group: 'Total Mensal' },
    ]
  },


  // --- RETORNO FGTS ---
  [EventType.S5003]: {
    id: EventType.S5003,
    title: 'Informações do FGTS por Trabalhador',
    description: 'Evento de retorno com informações consolidadas do FGTS.',
    defaultState: {
      tpAmb: 2, tpInsc: 1, nrInsc: '',
      ideEvento: { nrRecArqBase: '', indApuracao: 1, perApur: '' },
      ideTrabalhador: { cpfTrab: '' },
      infoFGTS: {
        dtVenc: '',
        classTrib: '',
        ideEstab: [
          {
            tpInsc: 1, nrInsc: '',
            ideLotacao: [
              {
                codLotacao: '', tpLotacao: '', tpInsc: 1, nrInsc: '',
                infoTrabFGTS: [
                  {
                    matricula: '', codCateg: 101, remunSuc: 'N',
                    infoBaseFGTS: {
                      basePerApur: [{ tpValor: 11, indIncid: 1, remFGTS: 0, dpsFGTS: 0 }]
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    fields: [
      ...commonIdentification,
      // Identificação Evento
      { name: 'nrRecArqBase', label: 'Recibo Arquivo Base', type: 'text', path: 'ideEvento.nrRecArqBase', required: true, group: 'Evento Base' },
      { name: 'perApur', label: 'Período Apuração', type: 'month', path: 'ideEvento.perApur', required: true, group: 'Evento Base' },
      { name: 'indApuracao', label: 'Ind. Apuração', type: 'select', path: 'ideEvento.indApuracao', required: true, group: 'Evento Base', options: [{ label: '1-Mensal', value: 1 }, { label: '2-Anual (13°)', value: 2 }] },

      // Trabalhador
      { name: 'cpfTrab', label: 'CPF Trabalhador', type: 'text', path: 'ideTrabalhador.cpfTrab', required: true, maxLength: 11, group: 'Trabalhador' },

      // Info FGTS
      { name: 'dtVenc', label: 'Data Vencimento', type: 'date', path: 'infoFGTS.dtVenc', required: false, group: 'FGTS Geral' },

      // Estabelecimento (Simplificado para 1º item)
      { name: 'nrInscEstab', label: 'Nr Inscrição Estab.', type: 'text', path: 'infoFGTS.ideEstab[0].nrInsc', required: true, group: 'Estabelecimento' },

      // Lotação (Simplificado para 1º item)
      { name: 'codLotacao', label: 'Cód. Lotação', type: 'text', path: 'infoFGTS.ideEstab[0].ideLotacao[0].codLotacao', required: true, group: 'Lotação' },

      // Trab FGTS (Simplificado para 1º item)
      { name: 'matricula', label: 'Matrícula', type: 'text', path: 'infoFGTS.ideEstab[0].ideLotacao[0].infoTrabFGTS[0].matricula', required: true, group: 'Dados FGTS' },
      { name: 'codCateg', label: 'Categoria', type: 'text', path: 'infoFGTS.ideEstab[0].ideLotacao[0].infoTrabFGTS[0].codCateg', required: true, group: 'Dados FGTS' },

      // Base FGTS (Simplificado para 1º item)
      { name: 'remFGTS', label: 'Remuneração FGTS', type: 'number', path: 'infoFGTS.ideEstab[0].ideLotacao[0].infoTrabFGTS[0].infoBaseFGTS.basePerApur[0].remFGTS', required: true, group: 'Valores FGTS' },
      { name: 'dpsFGTS', label: 'Valor Depósito', type: 'number', path: 'infoFGTS.ideEstab[0].ideLotacao[0].infoTrabFGTS[0].infoBaseFGTS.basePerApur[0].dpsFGTS', required: true, group: 'Valores FGTS' },
    ]
  },
  [EventType.S5011]: {
    id: EventType.S5011,
    title: 'Contribuições Sociais Consolidadas',
    description: 'Informações das contribuições sociais consolidadas por contribuinte.',
    defaultState: {
      tpAmb: 2, tpInsc: 1, nrInsc: '',
      ideEvento: { indRetif: 1, perApur: new Date().toISOString().slice(0, 7) },
      ideEmpregador: { tpInsc: 1, nrInsc: '' },
      infoCS: {
        nrRecArqBase: '',
        indExistInfo: 1,
        infoContrib: {
          classTrib: '',
          infoPJ: { indCoop: 0, indConstr: 0 }
        },
        ideEstab: [
          {
            tpInsc: 1, nrInsc: '',
            infoEstab: {
              cnaePrep: '', aliqRat: 0, fap: 0, aliqRatAjust: 0,
              ideLotacao: [
                {
                  codLotacao: '', fpas: '', codTercs: '',
                  basesRemun: [
                    {
                      indIncid: 1, codCateg: 0,
                      basesCp: { vrBcCp00: 0, vrBcCp15: 0, vrBcCp20: 0, vrBcCp25: 0, vrSuspBcCp00: 0, vrDescSest: 0, vrCalcSest: 0, vrDescSenat: 0, vrCalcSenat: 0, vrSalFam: 0, vrSalMat: 0 }
                    }
                  ]
                }
              ]
            }
          }
        ]
      }
    },
    fields: [
      ...commonIdentification,
      { name: 'perApur', label: 'Período Apuração', type: 'month', path: 'ideEvento.perApur', required: true, group: 'Referência' },
      { name: 'nrRecArqBase', label: 'Recibo Arquivo Base', type: 'text', path: 'infoCS.nrRecArqBase', required: true, group: 'Referência' },

      // Info Contribuinte
      { name: 'classTrib', label: 'Classificação Tributária', type: 'text', path: 'infoCS.infoContrib.classTrib', required: true, group: 'Contribuinte' },

      // Estabelecimento (Simplificado - Primeiro item)
      { name: 'tpInscEstab', label: 'Tipo Inscrição Estab.', type: 'select', path: 'infoCS.ideEstab[0].tpInsc', required: true, group: 'Estabelecimento', options: [{ label: '1 - CNPJ', value: 1 }, { label: '3 - CAEPF', value: 3 }, { label: '4 - CNO', value: 4 }] },
      { name: 'nrInscEstab', label: 'Nr. Inscrição Estab.', type: 'text', path: 'infoCS.ideEstab[0].nrInsc', required: true, maxLength: 14, group: 'Estabelecimento' },
      { name: 'aliqRat', label: 'Alíquota RAT', type: 'number', path: 'infoCS.ideEstab[0].infoEstab.aliqRat', required: true, group: 'Estabelecimento' },
      { name: 'fap', label: 'FAP', type: 'number', path: 'infoCS.ideEstab[0].infoEstab.fap', required: true, group: 'Estabelecimento' },

      // Lotação (Simplificado - Primeiro item do primeiro estabelecimento)
      { name: 'codLotacao', label: 'Cód. Lotação', type: 'text', path: 'infoCS.ideEstab[0].infoEstab.ideLotacao[0].codLotacao', required: true, group: 'Lotação' },
      { name: 'fpas', label: 'FPAS', type: 'text', path: 'infoCS.ideEstab[0].infoEstab.ideLotacao[0].fpas', required: true, group: 'Lotação' },

      // Bases Remuneração (Simplificado - Primeiro item da primeira lotação)
      { name: 'indIncid', label: 'Indicativo Incidência', type: 'select', path: 'infoCS.ideEstab[0].infoEstab.ideLotacao[0].basesRemun[0].indIncid', required: true, group: 'Bases', options: [{ label: '1 - Normal', value: 1 }, { label: '2 - Ativ. Concomitante', value: 2 }, { label: '9 - Substituída/Isenta', value: 9 }] },
      { name: 'codCateg', label: 'Cód. Categoria', type: 'number', path: 'infoCS.ideEstab[0].infoEstab.ideLotacao[0].basesRemun[0].codCateg', required: true, group: 'Bases' },
      { name: 'vrBcCp00', label: 'Base CP', type: 'number', path: 'infoCS.ideEstab[0].infoEstab.ideLotacao[0].basesRemun[0].basesCp.vrBcCp00', required: true, group: 'Bases' },
      { name: 'vrBcCp15', label: 'Base CP 15 Anos', type: 'number', path: 'infoCS.ideEstab[0].infoEstab.ideLotacao[0].basesRemun[0].basesCp.vrBcCp15', required: true, group: 'Bases' },
    ]
  },
  [EventType.S5012]: {
    id: EventType.S5012,
    title: 'IRRF Consolidado',
    description: 'Imposto de Renda Retido na Fonte Consolidado por Contribuinte.',
    defaultState: {
      tpAmb: 2, tpInsc: 1, nrInsc: '',
      ideEvento: { indRetif: 1, perApur: new Date().toISOString().slice(0, 7) },
      ideEmpregador: { tpInsc: 1, nrInsc: '' },
      infoIRRF: {
        nrRecArqBase: '',
        indExistInfo: 1,
        infoCRMen: [{ CRMen: '', vrCRMen: 0 }],
        infoCRDia: [{ perApurDia: '', CRDia: '', vrCRDia: 0 }]
      }
    },
    fields: [
      ...commonIdentification,
      // Identificação Evento
      { name: 'nrRecArqBase', label: 'Recibo Arquivo Base', type: 'text', path: 'infoIRRF.nrRecArqBase', required: true, group: 'Evento Base' },
      { name: 'perApur', label: 'Período Apuração', type: 'month', path: 'ideEvento.perApur', required: true, group: 'Evento Base' },
      { name: 'indExistInfo', label: 'Ind. Existência Info', type: 'select', path: 'infoIRRF.indExistInfo', required: true, group: 'Evento Base', options: [{ label: '1 - Há Informações', value: 1 }, { label: '2 - Há Movimento, Sem Info', value: 2 }, { label: '3 - Sem Movimento', value: 3 }] },

      // CR Mensal (Simplificado)
      { name: 'CRMen', label: 'CR Mensal', type: 'text', path: 'infoIRRF.infoCRMen[0].CRMen', required: false, group: 'CR Mensal' },
      { name: 'vrCRMen', label: 'Valor CR Mensal', type: 'number', path: 'infoIRRF.infoCRMen[0].vrCRMen', required: false, group: 'CR Mensal' },

      // CR Diário (Simplificado)
      { name: 'perApurDia', label: 'Dia Apuração', type: 'number', path: 'infoIRRF.infoCRDia[0].perApurDia', required: false, group: 'CR Diário', placeholder: '1-31' },
      { name: 'CRDia', label: 'CR Diário', type: 'text', path: 'infoIRRF.infoCRDia[0].CRDia', required: false, group: 'CR Diário' },
      { name: 'vrCRDia', label: 'Valor CR Diário', type: 'number', path: 'infoIRRF.infoCRDia[0].vrCRDia', required: false, group: 'CR Diário' },
    ]
  },
  [EventType.S5013]: {
    id: EventType.S5013,
    title: 'FGTS Consolidado',
    description: 'Informações do FGTS consolidadas por contribuinte.',
    defaultState: {
      tpAmb: 2, tpInsc: 1, nrInsc: '',
      ideEvento: { nrRecArqBase: '', indApuracao: 1, perApur: '' },
      ideEmpregador: { tpInsc: 1, nrInsc: '' },
      infoFGTS: {
        nrRecArqBase: '',
        indExistInfo: 1,
        ideEstab: [
          {
            tpInsc: 1, nrInsc: '',
            ideLotacao: [
              {
                codLotacao: '', tpLotacao: '', tpInsc: 1, nrInsc: '',
                infoBaseFGTS: {
                  basePerApur: [{ tpValor: 11, indIncid: 1, baseFGTS: 0, vrFGTS: 0 }]
                }
              }
            ]
          }
        ]
      }
    },
    fields: [
      ...commonIdentification,
      // Identificação Evento
      { name: 'nrRecArqBase', label: 'Recibo Arquivo Base', type: 'text', path: 'ideEvento.nrRecArqBase', required: true, group: 'Evento Base' },
      { name: 'perApur', label: 'Período Apuração', type: 'month', path: 'ideEvento.perApur', required: true, group: 'Evento Base' },
      { name: 'indApuracao', label: 'Ind. Apuração', type: 'select', path: 'ideEvento.indApuracao', required: true, group: 'Evento Base', options: [{ label: '1-Mensal', value: 1 }, { label: '2-Anual (13°)', value: 2 }] },

      // Info FGTS
      { name: 'indExistInfo', label: 'Indicativo Existência', type: 'select', path: 'infoFGTS.indExistInfo', required: true, group: 'FGTS Geral', options: [{ label: '1-Há Informações', value: 1 }, { label: '2-Há Movimento, s/ Info', value: 2 }, { label: '3-Sem Movimento', value: 3 }] },

      // Estabelecimento (Simplificado para 1º item)
      { name: 'nrInscEstab', label: 'Nr Inscrição Estab.', type: 'text', path: 'infoFGTS.ideEstab[0].nrInsc', required: true, group: 'Estabelecimento' },

      // Lotação (Simplificado para 1º item)
      { name: 'codLotacao', label: 'Cód. Lotação', type: 'text', path: 'infoFGTS.ideEstab[0].ideLotacao[0].codLotacao', required: true, group: 'Lotação' },
      { name: 'tpLotacao', label: 'Tipo Lotação', type: 'text', path: 'infoFGTS.ideEstab[0].ideLotacao[0].tpLotacao', required: true, group: 'Lotação' },

      // Base FGTS (Simplificado para 1º item)
      { name: 'tpValor', label: 'Tipo Valor', type: 'text', path: 'infoFGTS.ideEstab[0].ideLotacao[0].infoBaseFGTS.basePerApur[0].tpValor', required: true, group: 'Base FGTS' },
      { name: 'baseFGTS', label: 'Base FGTS', type: 'number', path: 'infoFGTS.ideEstab[0].ideLotacao[0].infoBaseFGTS.basePerApur[0].baseFGTS', required: true, group: 'Base FGTS' },
      { name: 'vrFGTS', label: 'Valor FGTS', type: 'number', path: 'infoFGTS.ideEstab[0].ideLotacao[0].infoBaseFGTS.basePerApur[0].vrFGTS', required: true, group: 'Base FGTS' },
    ]
  },
  [EventType.S5503]: {
    id: EventType.S5503,
    title: 'FGTS Proc. Trabalhista',
    description: 'Informações do FGTS por trabalhador em processo trabalhista.',
    defaultState: {
      tpAmb: 2, tpInsc: 1, nrInsc: '',
      ideEvento: { nrRecArqBase: '', perApur: '' },
      ideEmpregador: { tpInsc: 1, nrInsc: '' },
      ideProc: { origem: '', nrProcTrab: '' },
      ideTrabalhador: { cpfTrab: '' },
      infoTrabFGTS: [
        {
          matricula: '', codCateg: '', categOrig: '',
          infoFGTSProcTrab: {
            totalFGTS: 0,
            ideEstab: {
              tpInsc: 1, nrInsc: '',
              basePerRef: [
                {
                  perRef: '', codCateg: '', tpValorProcTrab: 71,
                  remFGTSProcTrab: 0, dpsFGTSProcTrab: 0,
                  remFGTSSefip: 0, dpsFGTSSefip: 0,
                  remFGTSDecAnt: 0, dpsFGTSDecAnt: 0
                }
              ]
            }
          }
        }
      ]
    },
    fields: [
      ...commonIdentification,
      // Identificação Evento
      { name: 'nrRecArqBase', label: 'Recibo Arquivo Base', type: 'text', path: 'ideEvento.nrRecArqBase', required: true, group: 'Evento Base' },
      { name: 'perApur', label: 'Período Apuração', type: 'month', path: 'ideEvento.perApur', required: true, group: 'Evento Base' },

      // Processo
      { name: 'nrProcTrab', label: 'Nr Processo', type: 'text', path: 'ideProc.nrProcTrab', required: true, group: 'Processo' },

      // Trabalhador
      { name: 'cpfTrab', label: 'CPF Trabalhador', type: 'text', path: 'ideTrabalhador.cpfTrab', required: true, maxLength: 11, group: 'Trabalhador' },
      { name: 'matricula', label: 'Matrícula', type: 'text', path: 'infoTrabFGTS[0].matricula', required: false, group: 'Trabalhador' },
      { name: 'codCateg', label: 'Categoria', type: 'text', path: 'infoTrabFGTS[0].codCateg', required: false, group: 'Trabalhador' },

      // FGTS Processo
      { name: 'totalFGTS', label: 'Total FGTS', type: 'number', path: 'infoTrabFGTS[0].infoFGTSProcTrab.totalFGTS', required: true, group: 'FGTS Processo' },

      // Estabelecimento
      { name: 'nrInscEstab', label: 'Nr Inscrição Estab.', type: 'text', path: 'infoTrabFGTS[0].infoFGTSProcTrab.ideEstab.nrInsc', required: true, group: 'Estabelecimento' },

      // Base Período (Simplificado para 1º item)
      { name: 'perRef', label: 'Período Ref.', type: 'month', path: 'infoTrabFGTS[0].infoFGTSProcTrab.ideEstab.basePerRef[0].perRef', required: true, group: 'Base Período' },
      { name: 'remFGTSProcTrab', label: 'Rem. FGTS Proc.', type: 'number', path: 'infoTrabFGTS[0].infoFGTSProcTrab.ideEstab.basePerRef[0].remFGTSProcTrab', required: true, group: 'Base Período' },
      { name: 'dpsFGTSProcTrab', label: 'Dep. FGTS Proc.', type: 'number', path: 'infoTrabFGTS[0].infoFGTSProcTrab.ideEstab.basePerRef[0].dpsFGTSProcTrab', required: true, group: 'Base Período' },
    ]
  },
  [EventType.S2299]: {
    id: EventType.S2299,
    title: 'Desligamento',
    description: 'Informações relativas ao desligamento do vínculo trabalhista.',
    defaultState: {
      tpAmb: 2, tpInsc: 1, nrInsc: '',
      ideEvento: { indRetif: 1, nrRecibo: '' },
      ideEmpregador: { tpInsc: 1, nrInsc: '' },
      ideVinculo: { cpfTrab: '', matricula: '' },
      infoDeslig: {
        mtvDeslig: '', dtDeslig: '', dtAvPrv: '', indPagtoAPI: 'N',
        verbasResc: {
          dmDev: [
            {
              ideDmDev: '',
              infoPerApur: {
                ideEstabLot: [
                  {
                    tpInsc: 1, nrInsc: '', codLotacao: '',
                    detVerbas: [
                      { codRubr: '', ideTabRubr: '', vrRubr: 0 }
                    ]
                  }
                ]
              }
            }
          ]
        }
      }
    },
    fields: [
      ...commonIdentification,
      { name: 'cpfTrab', label: 'CPF do Trabalhador', type: 'text', path: 'ideVinculo.cpfTrab', required: true, maxLength: 11, group: 'Vínculo' },
      { name: 'matricula', label: 'Matrícula', type: 'text', path: 'ideVinculo.matricula', required: true, maxLength: 30, group: 'Vínculo' },

      // Info Desligamento
      { name: 'mtvDeslig', label: 'Motivo Desligamento', type: 'text', path: 'infoDeslig.mtvDeslig', required: true, group: 'Desligamento' },
      { name: 'dtDeslig', label: 'Data Desligamento', type: 'date', path: 'infoDeslig.dtDeslig', required: true, group: 'Desligamento' },
      { name: 'dtAvPrv', label: 'Data Aviso Prévio', type: 'date', path: 'infoDeslig.dtAvPrv', required: false, group: 'Desligamento' },
      { name: 'indPagtoAPI', label: 'Pagto Aviso Prévio Indenizado', type: 'select', path: 'infoDeslig.indPagtoAPI', required: true, group: 'Desligamento', options: [{ label: 'Sim', value: 'S' }, { label: 'Não', value: 'N' }] },

      // Verbas Rescisórias (Simplificado - Primeiro item de cada nível)
      { name: 'ideDmDev', label: 'ID Demonstrativo', type: 'text', path: 'infoDeslig.verbasResc.dmDev[0].ideDmDev', required: true, group: 'Verbas Rescisórias' },
      { name: 'tpInscEstab', label: 'Tipo Inscrição Estab.', type: 'select', path: 'infoDeslig.verbasResc.dmDev[0].infoPerApur.ideEstabLot[0].tpInsc', required: true, group: 'Verbas Rescisórias', options: [{ label: '1 - CNPJ', value: 1 }, { label: '3 - CAEPF', value: 3 }, { label: '4 - CNO', value: 4 }] },
      { name: 'nrInscEstab', label: 'Nr. Inscrição Estab.', type: 'text', path: 'infoDeslig.verbasResc.dmDev[0].infoPerApur.ideEstabLot[0].nrInsc', required: true, maxLength: 14, group: 'Verbas Rescisórias' },
      { name: 'codLotacao', label: 'Cód. Lotação', type: 'text', path: 'infoDeslig.verbasResc.dmDev[0].infoPerApur.ideEstabLot[0].codLotacao', required: true, group: 'Verbas Rescisórias' },

      // Detalhe Verbas (Simplificado - Primeiro item)
      { name: 'codRubr', label: 'Cód. Rubrica', type: 'text', path: 'infoDeslig.verbasResc.dmDev[0].infoPerApur.ideEstabLot[0].detVerbas[0].codRubr', required: true, group: 'Detalhe Verbas' },
      { name: 'ideTabRubr', label: 'ID Tabela Rubrica', type: 'text', path: 'infoDeslig.verbasResc.dmDev[0].infoPerApur.ideEstabLot[0].detVerbas[0].ideTabRubr', required: true, group: 'Detalhe Verbas' },
      { name: 'vrRubr', label: 'Valor Rubrica', type: 'number', path: 'infoDeslig.verbasResc.dmDev[0].infoPerApur.ideEstabLot[0].detVerbas[0].vrRubr', required: true, group: 'Detalhe Verbas' },
    ]
  },
  [EventType.S2221]: {
    id: EventType.S2221,
    title: 'Exame Toxicológico',
    description: 'Exame toxicológico do motorista profissional empregado.',
    defaultState: {
      tpAmb: 2, tpInsc: 1, nrInsc: '',
      ideEvento: { indRetif: 1, nrRecibo: '', tpAmb: 2, procEmi: 1, verProc: '1.0.0' },
      ideEmpregador: { tpInsc: 1, nrInsc: '' },
      ideVinculo: { cpfTrab: '', matricula: '' },
      toxicologico: {
        dtExame: '',
        cnpjLab: '',
        codSeqExame: '',
        nmMed: '',
        nrCRM: '',
        ufCRM: ''
      }
    },
    fields: [
      ...commonIdentification,
      { name: 'cpfTrab', label: 'CPF do Trabalhador', type: 'text', path: 'ideVinculo.cpfTrab', required: true, maxLength: 11, group: 'Vínculo' },
      { name: 'matricula', label: 'Matrícula', type: 'text', path: 'ideVinculo.matricula', required: true, maxLength: 30, group: 'Vínculo' },

      // Exame Toxicológico
      { name: 'dtExame', label: 'Data do Exame', type: 'date', path: 'toxicologico.dtExame', required: true, group: 'Exame' },
      { name: 'cnpjLab', label: 'CNPJ Laboratório', type: 'text', path: 'toxicologico.cnpjLab', required: true, maxLength: 14, group: 'Exame' },
      { name: 'codSeqExame', label: 'Código do Exame', type: 'text', path: 'toxicologico.codSeqExame', required: true, maxLength: 11, group: 'Exame', placeholder: 'Ex: AB123456789' },
      { name: 'nmMed', label: 'Nome do Médico', type: 'text', path: 'toxicologico.nmMed', required: true, maxLength: 70, group: 'Médico' },
      { name: 'nrCRM', label: 'Número CRM', type: 'text', path: 'toxicologico.nrCRM', required: false, maxLength: 10, group: 'Médico' },
      { name: 'ufCRM', label: 'UF CRM', type: 'text', path: 'toxicologico.ufCRM', required: false, maxLength: 2, group: 'Médico' },
    ]
  },
  [EventType.S5501]: {
    id: EventType.S5501,
    title: 'Tributos Processo Trabalhista',
    description: 'Informações consolidadas de tributos decorrentes de processo trabalhista.',
    defaultState: {
      tpAmb: 2, tpInsc: 1, nrInsc: '',
      ideEvento: { nrRecArqBase: '' },
      ideEmpregador: { tpInsc: 1, nrInsc: '' },
      ideProc: {
        nrProcTrab: '',
        perApur: '',
        infoTributos: [
          {
            perRef: '',
            infoCRContrib: [{ tpCR: 0, vrCR: 0 }],
            infoCRIRRF: [{ tpCR: 593656, vrCR: 0 }]
          }
        ]
      }
    },
    fields: [
      { name: 'tpInsc', label: 'Tipo Inscrição', type: 'select', path: 'tpInsc', required: true, group: 'Identificação', options: [{ label: '1 - CNPJ', value: 1 }, { label: '2 - CPF', value: 2 }] },
      { name: 'nrInsc', label: 'Número Inscrição', type: 'text', path: 'nrInsc', required: true, maxLength: 14, group: 'Identificação' },
      { name: 'nrRecArqBase', label: 'Nr. Recibo Arquivo Base', type: 'text', path: 'ideEvento.nrRecArqBase', required: true, maxLength: 52, group: 'Evento' },

      // Processo
      { name: 'nrProcTrab', label: 'Nr. Processo Trabalhista', type: 'text', path: 'ideProc.nrProcTrab', required: true, maxLength: 20, group: 'Processo' },
      { name: 'perApur', label: 'Período Apuração', type: 'month', path: 'ideProc.perApur', required: true, group: 'Processo' },

      // Info Tributos (Simplificado - Primeiro item)
      { name: 'perRef', label: 'Período Referência', type: 'month', path: 'ideProc.infoTributos[0].perRef', required: false, group: 'Tributos' },

      // Contribuições (Simplificado - Primeiro item)
      { name: 'tpCRContrib', label: 'Código Receita Contrib.', type: 'number', path: 'ideProc.infoTributos[0].infoCRContrib[0].tpCR', required: false, group: 'Contribuições' },
      { name: 'vrCRContrib', label: 'Valor CR Contrib.', type: 'number', path: 'ideProc.infoTributos[0].infoCRContrib[0].vrCR', required: false, group: 'Contribuições' },

      // IRRF (Simplificado - Primeiro item)
      { name: 'tpCRIRRF', label: 'Código Receita IRRF', type: 'select', path: 'ideProc.infoTributos[0].infoCRIRRF[0].tpCR', required: false, group: 'IRRF', options: [{ label: '593656 - Decisão Justiça Trabalho', value: 593656 }, { label: '056152 - CCP/NINTER', value: 56152 }, { label: '188951 - RRA', value: 188951 }] },
      { name: 'vrCRIRRF', label: 'Valor CR IRRF', type: 'number', path: 'ideProc.infoTributos[0].infoCRIRRF[0].vrCR', required: false, group: 'IRRF' },
    ]
  }
};