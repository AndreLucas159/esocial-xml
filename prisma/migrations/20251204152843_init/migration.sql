-- CreateTable
CREATE TABLE "organizacoes" (
    "id" UUID NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "cnpj" VARCHAR(14) NOT NULL,
    "email" VARCHAR(255),
    "telefone" VARCHAR(20),
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" UUID NOT NULL,
    "organizacao_id" UUID NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "senha_hash" VARCHAR(255) NOT NULL,
    "role" VARCHAR(50) NOT NULL DEFAULT 'user',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "ultimo_acesso" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "empregadores" (
    "id" UUID NOT NULL,
    "organizacao_id" UUID NOT NULL,
    "razao_social" VARCHAR(255) NOT NULL,
    "nome_fantasia" VARCHAR(255),
    "cnpj" VARCHAR(14) NOT NULL,
    "natureza_juridica" VARCHAR(10),
    "cnae_principal" VARCHAR(10),
    "classificacao_tributaria" INTEGER,
    "email" VARCHAR(255),
    "telefone" VARCHAR(20),
    "logradouro" VARCHAR(255),
    "numero" VARCHAR(10),
    "complemento" VARCHAR(100),
    "bairro" VARCHAR(100),
    "cidade" VARCHAR(100),
    "uf" CHAR(2),
    "cep" VARCHAR(8),
    "tipo_inscricao" INTEGER NOT NULL DEFAULT 1,
    "numero_inscricao" VARCHAR(14),
    "ambiente_esocial" INTEGER NOT NULL DEFAULT 2,
    "certificado_path" VARCHAR(500),
    "certificado_senha" VARCHAR(255),
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "empregadores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lotacoes" (
    "id" UUID NOT NULL,
    "empregador_id" UUID NOT NULL,
    "codigo" VARCHAR(30) NOT NULL,
    "descricao" VARCHAR(255) NOT NULL,
    "tipo_inscricao" INTEGER,
    "numero_inscricao" VARCHAR(14),
    "fpas" VARCHAR(3),
    "cod_terceiros" VARCHAR(4),
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lotacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rubricas" (
    "id" UUID NOT NULL,
    "empregador_id" UUID NOT NULL,
    "codigo" VARCHAR(30) NOT NULL,
    "descricao" VARCHAR(255) NOT NULL,
    "natureza" INTEGER NOT NULL,
    "tipo" INTEGER NOT NULL,
    "incide_cp" BOOLEAN NOT NULL DEFAULT true,
    "incide_irrf" BOOLEAN NOT NULL DEFAULT true,
    "incide_fgts" BOOLEAN NOT NULL DEFAULT true,
    "vigencia_inicio" DATE NOT NULL,
    "vigencia_fim" DATE,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rubricas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cargos" (
    "id" UUID NOT NULL,
    "empregador_id" UUID NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "cbo" VARCHAR(10),
    "descricao" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cargos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trabalhadores" (
    "id" UUID NOT NULL,
    "empregador_id" UUID NOT NULL,
    "cpf" VARCHAR(11) NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "nome_social" VARCHAR(255),
    "data_nascimento" DATE NOT NULL,
    "sexo" CHAR(1),
    "raca_cor" INTEGER,
    "estado_civil" INTEGER,
    "grau_instrucao" INTEGER,
    "rg" VARCHAR(20),
    "rg_orgao_emissor" VARCHAR(10),
    "rg_uf" CHAR(2),
    "rg_data_emissao" DATE,
    "ctps" VARCHAR(20),
    "ctps_serie" VARCHAR(10),
    "ctps_uf" CHAR(2),
    "pis_pasep" VARCHAR(11),
    "email" VARCHAR(255),
    "telefone" VARCHAR(20),
    "logradouro" VARCHAR(255),
    "numero" VARCHAR(10),
    "complemento" VARCHAR(100),
    "bairro" VARCHAR(100),
    "cidade" VARCHAR(100),
    "uf" CHAR(2),
    "cep" VARCHAR(8),
    "banco" VARCHAR(3),
    "agencia" VARCHAR(10),
    "conta" VARCHAR(20),
    "tipo_conta" INTEGER,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trabalhadores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contratos" (
    "id" UUID NOT NULL,
    "trabalhador_id" UUID NOT NULL,
    "empregador_id" UUID NOT NULL,
    "cargo_id" UUID,
    "lotacao_id" UUID,
    "matricula" VARCHAR(30) NOT NULL,
    "categoria" INTEGER NOT NULL,
    "data_admissao" DATE NOT NULL,
    "data_desligamento" DATE,
    "salario" DECIMAL(15,2) NOT NULL,
    "tipo_salario" INTEGER,
    "tipo_jornada" INTEGER,
    "horas_semanais" INTEGER,
    "optante_fgts" BOOLEAN NOT NULL DEFAULT true,
    "data_opcao_fgts" DATE,
    "status" VARCHAR(20) NOT NULL DEFAULT 'ativo',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contratos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dependentes" (
    "id" UUID NOT NULL,
    "trabalhador_id" UUID NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "cpf" VARCHAR(11),
    "data_nascimento" DATE NOT NULL,
    "tipo" INTEGER NOT NULL,
    "dep_irrf" BOOLEAN NOT NULL DEFAULT false,
    "dep_sf" BOOLEAN NOT NULL DEFAULT false,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dependentes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "afastamentos" (
    "id" UUID NOT NULL,
    "contrato_id" UUID NOT NULL,
    "motivo" INTEGER NOT NULL,
    "data_inicio" DATE NOT NULL,
    "data_fim" DATE,
    "observacao" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "afastamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competencias" (
    "id" UUID NOT NULL,
    "empregador_id" UUID NOT NULL,
    "ano" INTEGER NOT NULL,
    "mes" INTEGER NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'aberta',
    "data_fechamento" TIMESTAMP(3),
    "data_envio" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "competencias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lancamentos_folha" (
    "id" UUID NOT NULL,
    "competencia_id" UUID NOT NULL,
    "contrato_id" UUID NOT NULL,
    "rubrica_id" UUID,
    "codigo_rubrica" VARCHAR(30) NOT NULL,
    "descricao" VARCHAR(255),
    "quantidade" DECIMAL(10,2) NOT NULL DEFAULT 1,
    "valor" DECIMAL(15,2) NOT NULL,
    "base_inss" DECIMAL(15,2),
    "base_irrf" DECIMAL(15,2),
    "base_fgts" DECIMAL(15,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lancamentos_folha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "totalizadores_folha" (
    "id" UUID NOT NULL,
    "competencia_id" UUID NOT NULL,
    "contrato_id" UUID NOT NULL,
    "total_proventos" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "total_descontos" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "salario_liquido" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "base_inss" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "valor_inss" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "base_irrf" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "valor_irrf" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "base_fgts" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "valor_fgts" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "totalizadores_folha_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventos_esocial" (
    "id" UUID NOT NULL,
    "empregador_id" UUID NOT NULL,
    "tipo_evento" VARCHAR(10) NOT NULL,
    "numero_recibo" VARCHAR(50),
    "xml_gerado" TEXT,
    "xml_assinado" TEXT,
    "status" VARCHAR(20) NOT NULL DEFAULT 'pendente',
    "data_envio" TIMESTAMP(3),
    "data_processamento" TIMESTAMP(3),
    "protocolo" VARCHAR(50),
    "mensagem_retorno" TEXT,
    "codigo_retorno" VARCHAR(10),
    "usuario_id" UUID,
    "tentativas" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "eventos_esocial_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "organizacoes_cnpj_key" ON "organizacoes"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "empregadores_cnpj_key" ON "empregadores"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "lotacoes_empregador_id_codigo_key" ON "lotacoes"("empregador_id", "codigo");

-- CreateIndex
CREATE UNIQUE INDEX "rubricas_empregador_id_codigo_key" ON "rubricas"("empregador_id", "codigo");

-- CreateIndex
CREATE UNIQUE INDEX "trabalhadores_cpf_key" ON "trabalhadores"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "contratos_empregador_id_matricula_key" ON "contratos"("empregador_id", "matricula");

-- CreateIndex
CREATE UNIQUE INDEX "competencias_empregador_id_ano_mes_key" ON "competencias"("empregador_id", "ano", "mes");

-- CreateIndex
CREATE UNIQUE INDEX "totalizadores_folha_competencia_id_contrato_id_key" ON "totalizadores_folha"("competencia_id", "contrato_id");

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_organizacao_id_fkey" FOREIGN KEY ("organizacao_id") REFERENCES "organizacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empregadores" ADD CONSTRAINT "empregadores_organizacao_id_fkey" FOREIGN KEY ("organizacao_id") REFERENCES "organizacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lotacoes" ADD CONSTRAINT "lotacoes_empregador_id_fkey" FOREIGN KEY ("empregador_id") REFERENCES "empregadores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rubricas" ADD CONSTRAINT "rubricas_empregador_id_fkey" FOREIGN KEY ("empregador_id") REFERENCES "empregadores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cargos" ADD CONSTRAINT "cargos_empregador_id_fkey" FOREIGN KEY ("empregador_id") REFERENCES "empregadores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trabalhadores" ADD CONSTRAINT "trabalhadores_empregador_id_fkey" FOREIGN KEY ("empregador_id") REFERENCES "empregadores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contratos" ADD CONSTRAINT "contratos_trabalhador_id_fkey" FOREIGN KEY ("trabalhador_id") REFERENCES "trabalhadores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contratos" ADD CONSTRAINT "contratos_empregador_id_fkey" FOREIGN KEY ("empregador_id") REFERENCES "empregadores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contratos" ADD CONSTRAINT "contratos_cargo_id_fkey" FOREIGN KEY ("cargo_id") REFERENCES "cargos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contratos" ADD CONSTRAINT "contratos_lotacao_id_fkey" FOREIGN KEY ("lotacao_id") REFERENCES "lotacoes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dependentes" ADD CONSTRAINT "dependentes_trabalhador_id_fkey" FOREIGN KEY ("trabalhador_id") REFERENCES "trabalhadores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "afastamentos" ADD CONSTRAINT "afastamentos_contrato_id_fkey" FOREIGN KEY ("contrato_id") REFERENCES "contratos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "competencias" ADD CONSTRAINT "competencias_empregador_id_fkey" FOREIGN KEY ("empregador_id") REFERENCES "empregadores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lancamentos_folha" ADD CONSTRAINT "lancamentos_folha_competencia_id_fkey" FOREIGN KEY ("competencia_id") REFERENCES "competencias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lancamentos_folha" ADD CONSTRAINT "lancamentos_folha_contrato_id_fkey" FOREIGN KEY ("contrato_id") REFERENCES "contratos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lancamentos_folha" ADD CONSTRAINT "lancamentos_folha_rubrica_id_fkey" FOREIGN KEY ("rubrica_id") REFERENCES "rubricas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "totalizadores_folha" ADD CONSTRAINT "totalizadores_folha_competencia_id_fkey" FOREIGN KEY ("competencia_id") REFERENCES "competencias"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "totalizadores_folha" ADD CONSTRAINT "totalizadores_folha_contrato_id_fkey" FOREIGN KEY ("contrato_id") REFERENCES "contratos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos_esocial" ADD CONSTRAINT "eventos_esocial_empregador_id_fkey" FOREIGN KEY ("empregador_id") REFERENCES "empregadores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventos_esocial" ADD CONSTRAINT "eventos_esocial_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
