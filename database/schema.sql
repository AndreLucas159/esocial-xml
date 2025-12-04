-- =====================================================
-- Sistema de Gestão de Departamento Pessoal
-- Schema PostgreSQL
-- =====================================================

-- Extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- 1. MÓDULO DE AUTENTICAÇÃO E MULTI-TENANT
-- =====================================================

-- Organizações (Escritórios de Contabilidade)
CREATE TABLE organizacoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    cnpj VARCHAR(14) UNIQUE NOT NULL,
    email VARCHAR(255),
    telefone VARCHAR(20),
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Usuários
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organizacao_id UUID REFERENCES organizacoes(id),
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user', -- admin, user, viewer
    ativo BOOLEAN DEFAULT true,
    ultimo_acesso TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 2. MÓDULO DE EMPREGADORES
-- =====================================================

-- Empregadores (Empresas Clientes)
CREATE TABLE empregadores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organizacao_id UUID REFERENCES organizacoes(id),
    
    -- Dados Básicos
    razao_social VARCHAR(255) NOT NULL,
    nome_fantasia VARCHAR(255),
    cnpj VARCHAR(14) UNIQUE NOT NULL,
    
    -- Classificação
    natureza_juridica VARCHAR(10),
    cnae_principal VARCHAR(10),
    classificacao_tributaria INTEGER,
    
    -- Contato
    email VARCHAR(255),
    telefone VARCHAR(20),
    
    -- Endereço
    logradouro VARCHAR(255),
    numero VARCHAR(10),
    complemento VARCHAR(100),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    uf CHAR(2),
    cep VARCHAR(8),
    
    -- eSocial
    tipo_inscricao INTEGER DEFAULT 1, -- 1=CNPJ, 2=CPF
    numero_inscricao VARCHAR(14),
    ambiente_esocial INTEGER DEFAULT 2, -- 1=Produção, 2=Teste
    
    -- Certificado Digital
    certificado_path VARCHAR(500),
    certificado_senha VARCHAR(255),
    
    -- Status
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lotações Tributárias (S-1020)
CREATE TABLE lotacoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empregador_id UUID REFERENCES empregadores(id) ON DELETE CASCADE,
    
    codigo VARCHAR(30) NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    tipo_inscricao INTEGER,
    numero_inscricao VARCHAR(14),
    
    -- FPAS
    fpas VARCHAR(3),
    cod_terceiros VARCHAR(4),
    
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(empregador_id, codigo)
);

-- Rubricas (S-1010)
CREATE TABLE rubricas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empregador_id UUID REFERENCES empregadores(id) ON DELETE CASCADE,
    
    codigo VARCHAR(30) NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    natureza INTEGER NOT NULL, -- Código da natureza (1000, 1001, etc)
    tipo INTEGER NOT NULL, -- 1=Vencimento, 2=Desconto, 3=Informativo, 4=Incidência
    
    -- Incidências
    incide_cp BOOLEAN DEFAULT true,
    incide_irrf BOOLEAN DEFAULT true,
    incide_fgts BOOLEAN DEFAULT true,
    
    vigencia_inicio DATE NOT NULL,
    vigencia_fim DATE,
    
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(empregador_id, codigo)
);

-- Cargos
CREATE TABLE cargos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empregador_id UUID REFERENCES empregadores(id) ON DELETE CASCADE,
    
    nome VARCHAR(255) NOT NULL,
    cbo VARCHAR(10),
    descricao TEXT,
    
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 3. MÓDULO DE TRABALHADORES
-- =====================================================

-- Trabalhadores
CREATE TABLE trabalhadores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empregador_id UUID REFERENCES empregadores(id) ON DELETE CASCADE,
    
    -- Dados Pessoais
    cpf VARCHAR(11) UNIQUE NOT NULL,
    nome VARCHAR(255) NOT NULL,
    nome_social VARCHAR(255),
    data_nascimento DATE NOT NULL,
    sexo CHAR(1), -- M, F
    raca_cor INTEGER,
    estado_civil INTEGER,
    grau_instrucao INTEGER,
    
    -- Documentos
    rg VARCHAR(20),
    rg_orgao_emissor VARCHAR(10),
    rg_uf CHAR(2),
    rg_data_emissao DATE,
    ctps VARCHAR(20),
    ctps_serie VARCHAR(10),
    ctps_uf CHAR(2),
    pis_pasep VARCHAR(11),
    
    -- Contato
    email VARCHAR(255),
    telefone VARCHAR(20),
    
    -- Endereço
    logradouro VARCHAR(255),
    numero VARCHAR(10),
    complemento VARCHAR(100),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    uf CHAR(2),
    cep VARCHAR(8),
    
    -- Dados Bancários
    banco VARCHAR(3),
    agencia VARCHAR(10),
    conta VARCHAR(20),
    tipo_conta INTEGER, -- 1=Corrente, 2=Poupança
    
    -- Status
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contratos de Trabalho
CREATE TABLE contratos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trabalhador_id UUID REFERENCES trabalhadores(id) ON DELETE CASCADE,
    empregador_id UUID REFERENCES empregadores(id) ON DELETE CASCADE,
    cargo_id UUID REFERENCES cargos(id),
    lotacao_id UUID REFERENCES lotacoes(id),
    
    -- Identificação
    matricula VARCHAR(30) NOT NULL,
    categoria INTEGER NOT NULL, -- Código da categoria (101, 102, etc)
    
    -- Datas
    data_admissao DATE NOT NULL,
    data_desligamento DATE,
    
    -- Remuneração
    salario DECIMAL(15,2) NOT NULL,
    tipo_salario INTEGER, -- 1=Mensal, 2=Hora, 3=Dia
    
    -- Jornada
    tipo_jornada INTEGER,
    horas_semanais INTEGER,
    
    -- FGTS
    optante_fgts BOOLEAN DEFAULT true,
    data_opcao_fgts DATE,
    
    -- Status
    status VARCHAR(20) DEFAULT 'ativo', -- ativo, afastado, desligado
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(empregador_id, matricula)
);

-- Dependentes
CREATE TABLE dependentes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trabalhador_id UUID REFERENCES trabalhadores(id) ON DELETE CASCADE,
    
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(11),
    data_nascimento DATE NOT NULL,
    tipo INTEGER NOT NULL, -- 1=Cônjuge, 2=Filho, etc
    
    dep_irrf BOOLEAN DEFAULT false,
    dep_sf BOOLEAN DEFAULT false,
    
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Afastamentos
CREATE TABLE afastamentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contrato_id UUID REFERENCES contratos(id) ON DELETE CASCADE,
    
    motivo INTEGER NOT NULL, -- Código do motivo (01=Doença, 02=Acidente, etc)
    data_inicio DATE NOT NULL,
    data_fim DATE,
    
    observacao TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- 4. MÓDULO DE FOLHA DE PAGAMENTO
-- =====================================================

-- Competências (Meses de Folha)
CREATE TABLE competencias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empregador_id UUID REFERENCES empregadores(id) ON DELETE CASCADE,
    
    ano INTEGER NOT NULL,
    mes INTEGER NOT NULL,
    
    status VARCHAR(20) DEFAULT 'aberta', -- aberta, fechada, enviada
    data_fechamento TIMESTAMP,
    data_envio TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(empregador_id, ano, mes)
);

-- Lançamentos de Folha
CREATE TABLE lancamentos_folha (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competencia_id UUID REFERENCES competencias(id) ON DELETE CASCADE,
    contrato_id UUID REFERENCES contratos(id) ON DELETE CASCADE,
    rubrica_id UUID REFERENCES rubricas(id),
    
    codigo_rubrica VARCHAR(30) NOT NULL,
    descricao VARCHAR(255),
    
    quantidade DECIMAL(10,2) DEFAULT 1,
    valor DECIMAL(15,2) NOT NULL,
    
    -- Bases de cálculo
    base_inss DECIMAL(15,2),
    base_irrf DECIMAL(15,2),
    base_fgts DECIMAL(15,2),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Totalizadores de Folha (por trabalhador/competência)
CREATE TABLE totalizadores_folha (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competencia_id UUID REFERENCES competencias(id) ON DELETE CASCADE,
    contrato_id UUID REFERENCES contratos(id) ON DELETE CASCADE,
    
    total_proventos DECIMAL(15,2) DEFAULT 0,
    total_descontos DECIMAL(15,2) DEFAULT 0,
    salario_liquido DECIMAL(15,2) DEFAULT 0,
    
    base_inss DECIMAL(15,2) DEFAULT 0,
    valor_inss DECIMAL(15,2) DEFAULT 0,
    
    base_irrf DECIMAL(15,2) DEFAULT 0,
    valor_irrf DECIMAL(15,2) DEFAULT 0,
    
    base_fgts DECIMAL(15,2) DEFAULT 0,
    valor_fgts DECIMAL(15,2) DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(competencia_id, contrato_id)
);

-- =====================================================
-- 5. MÓDULO DE EVENTOS eSocial
-- =====================================================

-- Fila de Eventos
CREATE TABLE eventos_esocial (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    empregador_id UUID REFERENCES empregadores(id) ON DELETE CASCADE,
    
    tipo_evento VARCHAR(10) NOT NULL, -- S-1000, S-2200, etc
    numero_recibo VARCHAR(50),
    
    -- Dados do Evento
    xml_gerado TEXT,
    xml_assinado TEXT,
    
    -- Status
    status VARCHAR(20) DEFAULT 'pendente', -- pendente, enviado, processado, erro
    data_envio TIMESTAMP,
    data_processamento TIMESTAMP,
    
    -- Retorno
    protocolo VARCHAR(50),
    mensagem_retorno TEXT,
    codigo_retorno VARCHAR(10),
    
    -- Metadados
    usuario_id UUID REFERENCES usuarios(id),
    tentativas INTEGER DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- ÍNDICES PARA PERFORMANCE
-- =====================================================

CREATE INDEX idx_usuarios_organizacao ON usuarios(organizacao_id);
CREATE INDEX idx_empregadores_organizacao ON empregadores(organizacao_id);
CREATE INDEX idx_empregadores_cnpj ON empregadores(cnpj);
CREATE INDEX idx_trabalhadores_cpf ON trabalhadores(cpf);
CREATE INDEX idx_trabalhadores_empregador ON trabalhadores(empregador_id);
CREATE INDEX idx_contratos_trabalhador ON contratos(trabalhador_id);
CREATE INDEX idx_contratos_empregador ON contratos(empregador_id);
CREATE INDEX idx_lancamentos_competencia ON lancamentos_folha(competencia_id);
CREATE INDEX idx_lancamentos_contrato ON lancamentos_folha(contrato_id);
CREATE INDEX idx_eventos_empregador ON eventos_esocial(empregador_id);
CREATE INDEX idx_eventos_status ON eventos_esocial(status);

-- =====================================================
-- TRIGGERS PARA UPDATED_AT
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger em todas as tabelas
CREATE TRIGGER update_organizacoes_updated_at BEFORE UPDATE ON organizacoes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_empregadores_updated_at BEFORE UPDATE ON empregadores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lotacoes_updated_at BEFORE UPDATE ON lotacoes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rubricas_updated_at BEFORE UPDATE ON rubricas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cargos_updated_at BEFORE UPDATE ON cargos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_trabalhadores_updated_at BEFORE UPDATE ON trabalhadores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contratos_updated_at BEFORE UPDATE ON contratos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dependentes_updated_at BEFORE UPDATE ON dependentes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_competencias_updated_at BEFORE UPDATE ON competencias FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_eventos_updated_at BEFORE UPDATE ON eventos_esocial FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
