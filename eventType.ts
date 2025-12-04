export enum EventType {
    // Tabelas (Tables)
    S1000 = 'S-1000', // Empregador
    S1005 = 'S-1005', // Estabelecimentos
    S1010 = 'S-1010', // Rubricas
    S1020 = 'S-1020', // Lotações
    S1070 = 'S-1070', // Processos Adm/Jud

    // Não Periódicos (Non-Periodic)
    S2190 = 'S-2190', // Admissão Preliminar
    S2200 = 'S-2200', // Admissão/Ingresso
    S2205 = 'S-2205', // Alteração Cadastral
    S2206 = 'S-2206', // Alteração Contrato
    S2210 = 'S-2210', // CAT - Acidente de Trabalho
    S2220 = 'S-2220', // ASO - Saúde Ocupacional
    S2221 = 'S-2221', // Exame Toxicológico
    S2230 = 'S-2230', // Afastamento Temporário
    S2231 = 'S-2231', // Cessão/Exercício em Outro Órgão
    S5011 = 'S-5011', // Contribuições Sociais Consolidadas
    S2240 = 'S-2240', // Condições Ambientais (SST)
    S2298 = 'S-2298', // Reintegração
    S2299 = 'S-2299', // Desligamento
    S2300 = 'S-2300', // TSVE - Início (Sem Vínculo)
    S2306 = 'S-2306', // TSVE - Alteração
    S2399 = 'S-2399', // TSVE - Término

    // Processo Trabalhista (Reclamatória)
    S2500 = 'S-2500', // Processo Trabalhista
    S2501 = 'S-2501', // Tributos Proc. Trabalhista
    S2555 = 'S-2555', // Consolidação Tributos Proc. Trab.

    // Periódicos (Periodic) - Geral
    S1200 = 'S-1200', // Remuneração RGPS
    S1210 = 'S-1210', // Pagamentos
    S1260 = 'S-1260', // Comercialização Rural
    S1270 = 'S-1270', // Avulsos
    S1280 = 'S-1280', // Informações Complementares (Desoneração)
    S1298 = 'S-1298', // Reabertura
    S1299 = 'S-1299', // Fechamento

    // Setor Público (RPPS) & Benefícios
    S1202 = 'S-1202', // Remuneração RPPS
    S1207 = 'S-1207', // Benefícios RPPS
    S2400 = 'S-2400', // Cadastro Beneficiário
    S2405 = 'S-2405', // Alt. Cadastral Beneficiário
    S2410 = 'S-2410', // Cadastro Benefício
    S2416 = 'S-2416', // Alt. Benefício
    S2418 = 'S-2418', // Reativação Benefício
    S2420 = 'S-2420', // Término Benefício

    // Judicial (Anotação)
    S8200 = 'S-8200', // Anotação Judicial Vínculo
    S8299 = 'S-8299', // Baixa Judicial Vínculo

    // Benefícios

    // Controle
    S3000 = 'S-3000', // Exclusão de Eventos
    S3500 = 'S-3500', // Exclusão de Eventos - Processo Trabalhista

    // Retorno (Return Events)
    S5001 = 'S-5001', // Informações das Contribuições Sociais por Trabalhador
    S5002 = 'S-5002', // Imposto de Renda Retido na Fonte por Trabalhador
    S5003 = 'S-5003', // Informações do FGTS por Trabalhador
    S5012 = 'S-5012', // Imposto de Renda Retido na Fonte Consolidado por Contribuinte
    S5013 = 'S-5013', // Informações do FGTS Consolidadas por Contribuinte
    S5501 = 'S-5501', // Tributos Processo Trabalhista
    S5503 = 'S-5503', // Informações do FGTS por Trabalhador em Processo Trabalhista
}
