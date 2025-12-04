/**
 * Tabela de Naturezas de Rubricas do eSocial
 */

export interface NaturezaRubrica {
    codigo: number;
    nome: string;
    dtInicio: string;
    dtFim: string | null;
    descricao: string;
    incidenciaExclusivaEmpregado: 'S' | 'N' | '';
}

export const NATUREZAS_RUBRICAS: NaturezaRubrica[] = [
    // Salários e Vencimentos (1000-1099)
    { codigo: 1000, nome: 'Salário, vencimento, soldo', dtInicio: '01/01/2014', dtFim: null, descricao: 'Corresponde ao salário básico contratual do empregado contratado de acordo com a CLT e o vencimento mensal do servidor público e do militar', incidenciaExclusivaEmpregado: '' },
    { codigo: 1001, nome: 'Subsídio', dtInicio: '01/01/2014', dtFim: null, descricao: 'Corresponde à remuneração paga na forma de subsídio', incidenciaExclusivaEmpregado: '' },
    { codigo: 1002, nome: 'Descanso semanal remunerado - DSR', dtInicio: '01/01/2014', dtFim: null, descricao: 'Valor correspondente a um dia de trabalho incidente sobre as verbas de natureza variável', incidenciaExclusivaEmpregado: '' },
    { codigo: 1003, nome: 'Horas extraordinárias', dtInicio: '01/01/2014', dtFim: null, descricao: 'Valor correspondente à hora extraordinária de trabalho, acrescido de percentual de no mínimo 50%', incidenciaExclusivaEmpregado: '' },
    { codigo: 1004, nome: 'Horas extraordinárias - Banco de horas', dtInicio: '01/01/2014', dtFim: null, descricao: 'Valor correspondente a pagamento das horas extraordinárias, inicialmente destinadas para o banco de horas e que não foram compensadas', incidenciaExclusivaEmpregado: '' },
    { codigo: 1016, nome: 'Férias', dtInicio: '01/01/2026', dtFim: null, descricao: 'Valor correspondente à remuneração devida na época da concessão das férias', incidenciaExclusivaEmpregado: '' },
    { codigo: 1017, nome: 'Terço constitucional de férias', dtInicio: '01/01/2026', dtFim: null, descricao: 'Valor correspondente ao terço constitucional de férias', incidenciaExclusivaEmpregado: 'S' },

    // Adicionais (1201-1299)
    { codigo: 1201, nome: 'Adicional de função / cargo confiança', dtInicio: '01/01/2014', dtFim: null, descricao: 'Adicional ou gratificação concedida em virtude de cargo ou função de confiança', incidenciaExclusivaEmpregado: '' },
    { codigo: 1202, nome: 'Adicional de insalubridade', dtInicio: '01/01/2014', dtFim: null, descricao: 'Adicional por serviços em condições de insalubridade', incidenciaExclusivaEmpregado: '' },
    { codigo: 1203, nome: 'Adicional de periculosidade', dtInicio: '01/01/2014', dtFim: null, descricao: 'Adicional por serviços em condições perigosas', incidenciaExclusivaEmpregado: '' },
    { codigo: 1205, nome: 'Adicional noturno', dtInicio: '01/01/2014', dtFim: null, descricao: 'Adicional por trabalho em horário noturno', incidenciaExclusivaEmpregado: '' },
    { codigo: 1207, nome: 'Comissões, porcentagens, produção', dtInicio: '01/01/2014', dtFim: null, descricao: 'Valor correspondente a contraprestação de serviço', incidenciaExclusivaEmpregado: '' },

    // PLR e Bolsas (1300-1352)
    { codigo: 1300, nome: 'PLR - Participação em Lucros ou Resultados', dtInicio: '01/01/2014', dtFim: null, descricao: 'Valor correspondente a participação em lucros ou resultados da empresa', incidenciaExclusivaEmpregado: '' },
    { codigo: 1350, nome: 'Bolsa de estudo - Estagiário', dtInicio: '01/01/2014', dtFim: null, descricao: 'Valor devido ao estagiário em atividades práticas', incidenciaExclusivaEmpregado: '' },
    { codigo: 1351, nome: 'Bolsa de estudo - Médico residente', dtInicio: '01/01/2014', dtFim: null, descricao: 'Bolsa de estudo ao médico residente', incidenciaExclusivaEmpregado: '' },

    // Auxílios (1401-1412)
    { codigo: 1409, nome: 'Salário-família', dtInicio: '01/01/2014', dtFim: null, descricao: 'Valor do salário-família, conforme definição legal aplicável', incidenciaExclusivaEmpregado: '' },
    { codigo: 1799, nome: 'Alimentação concedida em pecúnia com caráter indenizatório', dtInicio: '01/01/2014', dtFim: null, descricao: 'Auxílio-alimentação ou alimentação concedida sob a forma de pecúnia com natureza indenizatória', incidenciaExclusivaEmpregado: 'S' },
    { codigo: 1800, nome: 'Alimentação concedida em pecúnia com caráter salarial', dtInicio: '01/01/2026', dtFim: null, descricao: 'Alimentação concedida sob a forma de pecúnia com natureza salarial', incidenciaExclusivaEmpregado: 'S' },
    { codigo: 1810, nome: 'Vale-transporte ou auxílio-transporte com caráter indenizatório', dtInicio: '01/01/2026', dtFim: null, descricao: 'Vale-transporte ou auxílio-transporte com natureza indenizatória', incidenciaExclusivaEmpregado: 'S' },

    // Remuneração de terceiros (3501-3525)
    { codigo: 3501, nome: 'Remuneração por prestação de serviços', dtInicio: '01/01/2014', dtFim: null, descricao: 'Remuneração a contribuintes individuais', incidenciaExclusivaEmpregado: '' },
    { codigo: 3505, nome: 'Retiradas (pró-labore) de diretores empregados', dtInicio: '01/01/2014', dtFim: null, descricao: 'Pró-labore ou retirada a diretores empregados (CLT)', incidenciaExclusivaEmpregado: '' },
    { codigo: 3506, nome: 'Retiradas (pró-labore) de diretores não empregados', dtInicio: '01/01/2014', dtFim: null, descricao: 'Pró-labore ou retirada a diretores não empregados', incidenciaExclusivaEmpregado: '' },

    // Complementações (4010-4051)
    { codigo: 4050, nome: 'Salário-maternidade', dtInicio: '01/01/2014', dtFim: null, descricao: 'Remuneração mensal da trabalhadora empregada durante a licença maternidade', incidenciaExclusivaEmpregado: 'S' },
    { codigo: 4051, nome: 'Salário-maternidade - 13° salário', dtInicio: '01/01/2014', dtFim: null, descricao: 'Valor correspondente ao 13° salário pago no período de licença maternidade', incidenciaExclusivaEmpregado: 'S' },

    // 13º Salário (5001-5005)
    { codigo: 5001, nome: '13º salário', dtInicio: '01/01/2014', dtFim: null, descricao: 'Valor relativo ao 13° salário de trabalhador', incidenciaExclusivaEmpregado: '' },
    { codigo: 5504, nome: '13º salário - Adiantamento', dtInicio: '01/01/2014', dtFim: null, descricao: 'Valor relativo a adiantamento do 13° salário', incidenciaExclusivaEmpregado: '' },

    // Rescisórias (6000-6129)
    { codigo: 6000, nome: 'Saldo de salários na rescisão contratual', dtInicio: '01/01/2014', dtFim: null, descricao: 'Valor correspondente aos dias trabalhados no mês da rescisão', incidenciaExclusivaEmpregado: '' },
    { codigo: 6003, nome: 'Indenização compensatória do aviso prévio', dtInicio: '01/01/2014', dtFim: null, descricao: 'Valor da maior remuneração do trabalhador', incidenciaExclusivaEmpregado: '' },
    { codigo: 6101, nome: 'Indenização compensatória - Multa rescisória 20 ou 40%', dtInicio: '01/01/2014', dtFim: null, descricao: 'Valor correspondente à indenização por demissão sem justa causa', incidenciaExclusivaEmpregado: '' },

    // Descontos (9200-9299)
    { codigo: 9200, nome: 'Desconto de adiantamentos', dtInicio: '01/01/2014', dtFim: null, descricao: 'Valor relativo a descontos a título de adiantamentos', incidenciaExclusivaEmpregado: '' },
    { codigo: 9201, nome: 'Contribuição previdenciária', dtInicio: '01/01/2014', dtFim: null, descricao: 'Desconto a título de contribuição previdenciária', incidenciaExclusivaEmpregado: '' },
    { codigo: 9203, nome: 'Imposto de Renda Retido na Fonte', dtInicio: '01/01/2014', dtFim: null, descricao: 'Desconto a título de IRRF', incidenciaExclusivaEmpregado: '' },
    { codigo: 9213, nome: 'Pensão alimentícia', dtInicio: '01/01/2014', dtFim: null, descricao: 'Desconto correspondente a pensão alimentícia', incidenciaExclusivaEmpregado: '' },
    { codigo: 9253, nome: 'Empréstimos eConsignado - Desconto', dtInicio: '01/07/2024', dtFim: null, descricao: 'Desconto de empréstimos na modalidade eConsignado', incidenciaExclusivaEmpregado: '' },
];

export function getNaturezasAtivas(data?: Date) {
    const dataRef = data || new Date();
    return NATUREZAS_RUBRICAS.filter(nat => {
        const inicio = parseDate(nat.dtInicio);
        const fim = nat.dtFim ? parseDate(nat.dtFim) : null;
        return dataRef >= inicio && (!fim || dataRef <= fim);
    });
}

export function getNaturezasOptions(data?: Date) {
    return getNaturezasAtivas(data).map(nat => ({
        value: nat.codigo,
        label: `${nat.codigo} - ${nat.nome}`
    }));
}

function parseDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split('/');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
}
