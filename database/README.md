# Instruções para Configuração do Banco de Dados

## Opção 1: Via pgAdmin (Recomendado para Windows)

1. Abra o **pgAdmin**
2. Conecte ao servidor PostgreSQL (usuário: `postgres`, senha: `123456`)
3. Clique com botão direito em "Databases" → "Create" → "Database"
4. Nome: `dp`
5. Clique em "Save"
6. Clique com botão direito no banco `dp` → "Query Tool"
7. Abra o arquivo `database/schema.sql` e execute

## Opção 2: Via Linha de Comando

Se o PostgreSQL estiver no PATH:

```bash
# Criar o banco
psql -U postgres -c "CREATE DATABASE dp;"

# Executar o schema
psql -U postgres -d dp -f database/schema.sql
```

Se não estiver no PATH, navegue até a pasta do PostgreSQL:

```bash
cd "C:\Program Files\PostgreSQL\<versão>\bin"
.\psql.exe -U postgres -c "CREATE DATABASE dp;"
.\psql.exe -U postgres -d dp -f "C:\Users\André\Downloads\esocial-xml\database\schema.sql"
```

## Opção 3: Usando Prisma (Após configuração)

```bash
cd c:\Users\André\Downloads\esocial-xml
npm install prisma @prisma/client
npx prisma db push
```

## Verificar Instalação

Após executar o schema, verifique se as tabelas foram criadas:

```sql
\dt  -- Lista todas as tabelas
```

Você deve ver 15 tabelas criadas:
- organizacoes
- usuarios
- empregadores
- lotacoes
- rubricas
- cargos
- trabalhadores
- contratos
- dependentes
- afastamentos
- competencias
- lancamentos_folha
- totalizadores_folha
- eventos_esocial
