/**
 * Tabela 01 - Categorias de Trabalhadores do eSocial
 * Fonte: Manual do eSocial
 */

export interface CategoriaTrabalh {
    codigo: number;
    descricao: string;
    dtInicio: string;
    dtFim: string | null;
    grupo: 'SE' | 'AV' | 'SP' | 'CE' | 'SG' | 'CI' | 'ES';
    aliqFGTS: number | null;
    obriga: number;
    aliqFGTSCo: number | null;
    cp: number;
    eConsignado: 'S' | 'N';
}

export const CATEGORIAS_TRABALHADORES: CategoriaTrabalh[] = [
    // Empregados (SE)
    { codigo: 101, descricao: 'Empregado - Geral, inclusive o empregado público da administração direta ou indireta contratado pela CLT', dtInicio: '01/01/2014', dtFim: null, grupo: 'SE', aliqFGTS: 8, obriga: 1, aliqFGTSCo: null, cp: 2, eConsignado: 'S' },
    { codigo: 102, descricao: 'Empregado - Trabalhador rural por pequeno prazo da Lei 11.718/2008', dtInicio: '01/01/2014', dtFim: null, grupo: 'SE', aliqFGTS: 8, obriga: 1, aliqFGTSCo: null, cp: 1, eConsignado: 'N' },
    { codigo: 103, descricao: 'Empregado - Aprendiz', dtInicio: '01/01/2014', dtFim: null, grupo: 'SE', aliqFGTS: 2, obriga: 1, aliqFGTSCo: null, cp: 2, eConsignado: 'N' },
    { codigo: 104, descricao: 'Empregado - Doméstico', dtInicio: '01/01/2014', dtFim: null, grupo: 'SE', aliqFGTS: 8, obriga: 1, aliqFGTSCo: 3.2, cp: 2, eConsignado: 'S' },
    { codigo: 105, descricao: 'Empregado - Contrato a termo firmado nos termos da Lei 9.601/1998', dtInicio: '01/01/2014', dtFim: null, grupo: 'SE', aliqFGTS: 8, obriga: 1, aliqFGTSCo: null, cp: 2, eConsignado: 'N' },
    { codigo: 106, descricao: 'Trabalhador temporário - Contrato nos termos da Lei 6.019/1974', dtInicio: '01/01/2014', dtFim: null, grupo: 'SE', aliqFGTS: 8, obriga: 1, aliqFGTSCo: null, cp: 2, eConsignado: 'N' },
    { codigo: 107, descricao: 'Empregado - Contrato de trabalho Verde e Amarelo - sem acordo para antecipação mensal da multa rescisória do FGTS', dtInicio: '01/01/2020', dtFim: '31/12/2022', grupo: 'SE', aliqFGTS: 2, obriga: 1, aliqFGTSCo: null, cp: 2, eConsignado: 'N' },
    { codigo: 108, descricao: 'Empregado - Contrato de trabalho Verde e Amarelo - com acordo para antecipação mensal da multa rescisória do FGTS', dtInicio: '01/01/2020', dtFim: '31/12/2022', grupo: 'SE', aliqFGTS: 0.4, obriga: 1, aliqFGTSCo: null, cp: 2, eConsignado: 'N' },
    { codigo: 111, descricao: 'Empregado - Contrato de trabalho intermitente', dtInicio: '01/01/2014', dtFim: null, grupo: 'SE', aliqFGTS: 8, obriga: 1, aliqFGTSCo: null, cp: 2, eConsignado: 'N' },

    // Trabalhadores Avulsos (AV)
    { codigo: 201, descricao: 'Trabalhador avulso portuário', dtInicio: '01/01/2014', dtFim: null, grupo: 'AV', aliqFGTS: 8, obriga: 2, aliqFGTSCo: null, cp: 2, eConsignado: 'N' },
    { codigo: 202, descricao: 'Trabalhador avulso não portuário', dtInicio: '01/01/2014', dtFim: null, grupo: 'AV', aliqFGTS: 8, obriga: 2, aliqFGTSCo: null, cp: 2, eConsignado: 'N' },

    // Servidores Públicos (SP)
    { codigo: 301, descricao: 'Servidor público titular de cargo efetivo, magistrado, ministro de Tribunal de Contas, conselheiro de Tribunal de Contas e membro do Ministério Público', dtInicio: '01/01/2014', dtFim: null, grupo: 'SP', aliqFGTS: null, obriga: 1, aliqFGTSCo: null, cp: 2, eConsignado: 'N' },
    { codigo: 302, descricao: 'Servidor público ocupante de cargo exclusivo em comissão', dtInicio: '01/01/2014', dtFim: null, grupo: 'SP', aliqFGTS: null, obriga: 1, aliqFGTSCo: null, cp: 2, eConsignado: 'N' },
    { codigo: 303, descricao: 'Exercente de mandato eletivo', dtInicio: '01/01/2014', dtFim: null, grupo: 'SP', aliqFGTS: null, obriga: 1, aliqFGTSCo: null, cp: 2, eConsignado: 'N' },
    { codigo: 304, descricao: 'Servidor público exercente de mandato eletivo, inclusive com exercício de cargo em comissão', dtInicio: '01/01/2014', dtFim: null, grupo: 'SP', aliqFGTS: null, obriga: 2, aliqFGTSCo: null, cp: 2, eConsignado: 'N' },
    { codigo: 305, descricao: 'Servidor público indicado para conselho ou órgão deliberativo, na condição de representante do governo, órgão ou entidade da administração pública', dtInicio: '01/01/2014', dtFim: null, grupo: 'SP', aliqFGTS: null, obriga: 2, aliqFGTSCo: null, cp: 2, eConsignado: 'N' },
    { codigo: 306, descricao: 'Servidor público contratado por tempo determinado, sujeito a regime administrativo especial definido em lei própria', dtInicio: '01/01/2014', dtFim: null, grupo: 'SP', aliqFGTS: null, obriga: 1, aliqFGTSCo: null, cp: 2, eConsignado: 'N' },
    { codigo: 307, descricao: 'Militar dos Estados e Distrito Federal', dtInicio: '01/01/2014', dtFim: null, grupo: 'SP', aliqFGTS: null, obriga: 1, aliqFGTSCo: null, cp: 2, eConsignado: 'N' },
    { codigo: 308, descricao: 'Conscrito', dtInicio: '01/01/2014', dtFim: '25/04/2023', grupo: 'SP', aliqFGTS: null, obriga: 2, aliqFGTSCo: null, cp: 0, eConsignado: 'N' },
    { codigo: 309, descricao: 'Agente público - Outros', dtInicio: '01/01/2014', dtFim: null, grupo: 'SP', aliqFGTS: null, obriga: 1, aliqFGTSCo: null, cp: 2, eConsignado: 'N' },
    { codigo: 310, descricao: 'Servidor público eventual', dtInicio: '01/01/2014', dtFim: null, grupo: 'SP', aliqFGTS: null, obriga: 1, aliqFGTSCo: null, cp: 2, eConsignado: 'N' },
    { codigo: 311, descricao: 'Ministros, juízes, procuradores, promotores ou oficiais de justiça à disposição da Justiça Eleitoral', dtInicio: '01/01/2014', dtFim: null, grupo: 'SP', aliqFGTS: null, obriga: 0, aliqFGTSCo: null, cp: 0, eConsignado: 'N' },
    { codigo: 312, descricao: 'Auxiliar local', dtInicio: '01/01/2014', dtFim: null, grupo: 'SP', aliqFGTS: null, obriga: 1, aliqFGTSCo: null, cp: 2, eConsignado: 'N' },
    { codigo: 313, descricao: 'Servidor público exercente de atividade de instrutoria, capacitação, treinamento, curso ou concurso, ou convocado para pareceres técnicos ou depoimentos', dtInicio: '01/01/2014', dtFim: null, grupo: 'SP', aliqFGTS: null, obriga: 0, aliqFGTSCo: null, cp: 0, eConsignado: 'N' },
    { codigo: 314, descricao: 'Militar das Forças Armadas', dtInicio: '01/01/2014', dtFim: null, grupo: 'SP', aliqFGTS: null, obriga: 1, aliqFGTSCo: null, cp: 2, eConsignado: 'N' },

    // Categorias Especiais (CE)
    { codigo: 401, descricao: 'Dirigente sindical - Informação prestada pelo sindicato', dtInicio: '01/01/2014', dtFim: null, grupo: 'CE', aliqFGTS: null, obriga: 2, aliqFGTSCo: null, cp: 9, eConsignado: 'N' },
    { codigo: 410, descricao: 'Trabalhador cedido/exercício em outro órgão/juiz auxiliar - Informação prestada pelo cessionário/destino', dtInicio: '01/01/2014', dtFim: null, grupo: 'CE', aliqFGTS: null, obriga: 2, aliqFGTSCo: null, cp: 9, eConsignado: 'N' },

    // Segurado Especial (SG)
    { codigo: 501, descricao: 'Dirigente sindical - Segurado especial', dtInicio: '01/01/2014', dtFim: null, grupo: 'SG', aliqFGTS: null, obriga: 0, aliqFGTSCo: null, cp: 0, eConsignado: 'N' },

    // Contribuintes Individuais (CI)
    { codigo: 701, descricao: 'Contribuinte individual - Autônomo em geral, exceto se enquadrado em uma das demais categorias de contribuinte individual', dtInicio: '01/01/2014', dtFim: null, grupo: 'CI', aliqFGTS: null, obriga: 0, aliqFGTSCo: null, cp: 3, eConsignado: 'N' },
    { codigo: 711, descricao: 'Contribuinte individual - Transportador autônomo de passageiros', dtInicio: '01/01/2014', dtFim: null, grupo: 'CI', aliqFGTS: null, obriga: 0, aliqFGTSCo: null, cp: 3, eConsignado: 'N' },
    { codigo: 712, descricao: 'Contribuinte individual - Transportador autônomo de carga', dtInicio: '01/01/2014', dtFim: null, grupo: 'CI', aliqFGTS: null, obriga: 0, aliqFGTSCo: null, cp: 3, eConsignado: 'N' },
    { codigo: 721, descricao: 'Contribuinte individual - Diretor não empregado, com FGTS', dtInicio: '01/01/2014', dtFim: null, grupo: 'CI', aliqFGTS: 8, obriga: 2, aliqFGTSCo: null, cp: 3, eConsignado: 'S' },
    { codigo: 722, descricao: 'Contribuinte individual - Diretor não empregado, sem FGTS', dtInicio: '01/01/2014', dtFim: null, grupo: 'CI', aliqFGTS: null, obriga: 2, aliqFGTSCo: null, cp: 3, eConsignado: 'N' },
    { codigo: 723, descricao: 'Contribuinte individual - Empresário, sócio e membro de conselho de administração ou fiscal', dtInicio: '01/01/2014', dtFim: null, grupo: 'CI', aliqFGTS: null, obriga: 2, aliqFGTSCo: null, cp: 3, eConsignado: 'N' },
    { codigo: 731, descricao: 'Contribuinte individual - Cooperado que presta serviços por intermédio de cooperativa de trabalho', dtInicio: '01/01/2014', dtFim: null, grupo: 'CI', aliqFGTS: null, obriga: 2, aliqFGTSCo: null, cp: 3, eConsignado: 'N' },
    { codigo: 734, descricao: 'Contribuinte individual - Transportador cooperado que presta serviços por intermédio de cooperativa de trabalho', dtInicio: '01/01/2014', dtFim: null, grupo: 'CI', aliqFGTS: null, obriga: 2, aliqFGTSCo: null, cp: 3, eConsignado: 'N' },
    { codigo: 738, descricao: 'Contribuinte individual - Cooperado filiado a cooperativa de produção', dtInicio: '01/01/2014', dtFim: null, grupo: 'CI', aliqFGTS: null, obriga: 2, aliqFGTSCo: null, cp: 3, eConsignado: 'N' },
    { codigo: 741, descricao: 'Contribuinte individual - Microempreendedor individual', dtInicio: '01/01/2014', dtFim: null, grupo: 'CI', aliqFGTS: null, obriga: 0, aliqFGTSCo: null, cp: 3, eConsignado: 'N' },
    { codigo: 751, descricao: 'Contribuinte individual - Magistrado classista temporário da Justiça do Trabalho ou da Justiça Eleitoral que seja aposentado de qualquer regime previdenciário', dtInicio: '01/01/2014', dtFim: null, grupo: 'CI', aliqFGTS: null, obriga: 0, aliqFGTSCo: null, cp: 3, eConsignado: 'N' },
    { codigo: 761, descricao: 'Contribuinte individual - Associado eleito para direção de cooperativa, associação ou entidade de classe de qualquer natureza ou finalidade, bem como o síndico ou administrador eleito para exercer atividade de direção condominial, desde que recebam remuneração', dtInicio: '01/01/2014', dtFim: null, grupo: 'CI', aliqFGTS: null, obriga: 2, aliqFGTSCo: null, cp: 3, eConsignado: 'N' },
    { codigo: 771, descricao: 'Contribuinte individual - Membro de conselho tutelar, nos termos da Lei 8.069/1990', dtInicio: '01/01/2014', dtFim: null, grupo: 'CI', aliqFGTS: null, obriga: 2, aliqFGTSCo: null, cp: 3, eConsignado: 'N' },
    { codigo: 781, descricao: 'Ministro de confissão religiosa ou membro de vida consagrada, de congregação ou de ordem religiosa', dtInicio: '01/01/2014', dtFim: null, grupo: 'CI', aliqFGTS: null, obriga: 0, aliqFGTSCo: null, cp: 3, eConsignado: 'N' },

    // Estagiários e Bolsistas (ES)
    { codigo: 901, descricao: 'Estagiário', dtInicio: '01/01/2014', dtFim: null, grupo: 'ES', aliqFGTS: null, obriga: 2, aliqFGTSCo: null, cp: 0, eConsignado: 'N' },
    { codigo: 902, descricao: 'Médico residente, residente em área profissional de saúde ou médico em curso de formação', dtInicio: '01/01/2014', dtFim: null, grupo: 'ES', aliqFGTS: null, obriga: 2, aliqFGTSCo: null, cp: 3, eConsignado: 'N' },
    { codigo: 903, descricao: 'Bolsista', dtInicio: '01/01/2014', dtFim: null, grupo: 'ES', aliqFGTS: null, obriga: 0, aliqFGTSCo: null, cp: 0, eConsignado: 'N' },
    { codigo: 904, descricao: 'Participante de curso de formação, como etapa de concurso público, sem vínculo de emprego/estatutário', dtInicio: '01/01/2014', dtFim: null, grupo: 'ES', aliqFGTS: null, obriga: 0, aliqFGTSCo: null, cp: 0, eConsignado: 'N' },
    { codigo: 905, descricao: 'Atleta não profissional em formação que receba bolsa', dtInicio: '01/01/2014', dtFim: '18/07/2021', grupo: 'ES', aliqFGTS: null, obriga: 0, aliqFGTSCo: null, cp: 3, eConsignado: 'N' },
    { codigo: 906, descricao: 'Beneficiário do Programa Nacional de Prestação de Serviço Civil Voluntário', dtInicio: '28/01/2022', dtFim: null, grupo: 'ES', aliqFGTS: null, obriga: 2, aliqFGTSCo: null, cp: 0, eConsignado: 'N' },
];

/**
 * Retorna categorias ativas na data especificada
 */
export function getCategoriasAtivas(data?: Date): CategoriaTrabalh[] {
    const dataRef = data || new Date();
    return CATEGORIAS_TRABALHADORES.filter(cat => {
        const inicio = parseDate(cat.dtInicio);
        const fim = cat.dtFim ? parseDate(cat.dtFim) : null;
        return dataRef >= inicio && (!fim || dataRef <= fim);
    });
}

/**
 * Busca categoria por código
 */
export function getCategoriaByCode(codigo: number): CategoriaTrabalh | undefined {
    return CATEGORIAS_TRABALHADORES.find(cat => cat.codigo === codigo);
}

/**
 * Retorna opções para select de categorias
 */
export function getCategoriasOptions(data?: Date) {
    return getCategoriasAtivas(data).map(cat => ({
        value: cat.codigo,
        label: `${cat.codigo} - ${cat.descricao}`
    }));
}

/**
 * Retorna opções agrupadas por tipo
 */
export function getCategoriasGroupedOptions(data?: Date) {
    const categorias = getCategoriasAtivas(data);
    const grupos = {
        SE: 'Empregados',
        AV: 'Trabalhadores Avulsos',
        SP: 'Servidores Públicos',
        CE: 'Categorias Especiais',
        SG: 'Segurado Especial',
        CI: 'Contribuintes Individuais',
        ES: 'Estagiários e Bolsistas'
    };

    return Object.entries(grupos).map(([key, label]) => ({
        label,
        options: categorias
            .filter(cat => cat.grupo === key)
            .map(cat => ({
                value: cat.codigo,
                label: `${cat.codigo} - ${cat.descricao}`
            }))
    })).filter(group => group.options.length > 0);
}

function parseDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split('/');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
}
