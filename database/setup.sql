-- Execute este script no PostgreSQL para criar o banco e as tabelas
-- Comando: psql -U postgres -f database/setup.sql

-- Criar o banco de dados
CREATE DATABASE dp;

-- Conectar ao banco
\c dp

-- Executar o schema
\i database/schema.sql
