# Sistema de Gestão de Departamento Pessoal - eSocial

Sistema SaaS completo para gestão de departamento pessoal com integração eSocial.

## 🎯 Funcionalidades

- ✅ **Multi-tenant** - Múltiplas organizações e usuários
- ✅ **Autenticação JWT** - Login seguro com tokens
- ✅ **Gestão de Empregadores** - CRUD completo de empresas
- ✅ **Tabelas eSocial** - Rubricas, lotações, cargos
- ✅ **Geração de Eventos** - S-1000, S-1010 (mais em desenvolvimento)
- ✅ **Fila de Eventos** - Gerenciamento de envios
- 🚧 **Gestão de Trabalhadores** - Em desenvolvimento
- 🚧 **Folha de Pagamento** - Em desenvolvimento

## 🏗️ Arquitetura

```
Frontend (React + Vite)
    ↓
Backend (Express + TypeScript)
    ↓
Database (PostgreSQL + Prisma)
    ↓
eSocial (SOAP + Certificado Digital)
```

## 📦 Tecnologias

- **Frontend:** React 19, TypeScript, Vite
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL 16
- **ORM:** Prisma 5.22
- **Auth:** JWT + bcrypt
- **eSocial:** node-forge, xml-crypto

## 🚀 Instalação

### Pré-requisitos

- Node.js 18+
- PostgreSQL 16+
- npm ou yarn

### 1. Clonar e Instalar

```bash
cd c:\Users\André\Downloads\esocial-xml
npm install
cd server
npm install
```

### 2. Configurar Banco de Dados

Criar banco PostgreSQL:
```sql
CREATE DATABASE dp;
```

Executar schema:
```bash
psql -U postgres -d dp -f database/schema.sql
```

Ou usar Prisma:
```bash
npx prisma db push
npx prisma generate
```

### 3. Configurar Variáveis de Ambiente

Criar arquivo `.env`:
```env
DATABASE_URL="postgresql://postgres:123456@localhost:5432/dp"
JWT_SECRET="sua-chave-secreta-aqui"
NODE_ENV="development"
```

### 4. Iniciar Servidores

Backend:
```bash
cd server
npm start
```

Frontend:
```bash
npm run dev
```

## 📖 Documentação

- [Guia de Uso](./USAGE_GUIDE.md) - Como usar o sistema
- [Database Schema](./database/README.md) - Estrutura do banco
- [API Documentation](./docs/API.md) - Endpoints REST

## 🗄️ Estrutura do Banco

15 tabelas organizadas em 5 módulos:

1. **Multi-tenant:** organizacoes, usuarios
2. **Empregadores:** empregadores, lotacoes, rubricas, cargos
3. **Trabalhadores:** trabalhadores, contratos, dependentes, afastamentos
4. **Folha:** competencias, lancamentos_folha, totalizadores_folha
5. **eSocial:** eventos_esocial

## 📡 APIs Principais

### Autenticação
- `POST /api/v1/auth/register` - Criar conta
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/verify` - Verificar token

### Empregadores
- `GET /api/v1/empregadores` - Listar
- `POST /api/v1/empregadores` - Criar
- `PUT /api/v1/empregadores/:id` - Atualizar
- `DELETE /api/v1/empregadores/:id` - Deletar

### Eventos eSocial
- `POST /api/v1/empregadores/:id/eventos/s1000` - Gerar S-1000
- `POST /api/v1/empregadores/:id/eventos/s1010` - Gerar S-1010
- `GET /api/v1/empregadores/:id/eventos` - Listar eventos

## 🧪 Testes

Executar teste de integração:
```bash
npx tsx test-integration.ts
```

## 📝 Roadmap

- [x] Infraestrutura de dados
- [x] Autenticação e multi-tenant
- [x] CRUD de empregadores
- [x] Geração de eventos S-1000 e S-1010
- [ ] CRUD de trabalhadores
- [ ] Admissão (S-2200)
- [ ] Folha de pagamento (S-1200)
- [ ] Desligamento (S-2299)
- [ ] Dashboard frontend
- [ ] Integração completa com eSocial

## 👥 Contribuindo

Este é um projeto em desenvolvimento ativo. Contribuições são bem-vindas!

## 📄 Licença

Proprietary - Todos os direitos reservados
