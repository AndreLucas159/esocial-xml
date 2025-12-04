# Guia de Uso - Sistema de Gestão de DP

Este guia demonstra como usar o sistema completo, desde o cadastro até a geração de eventos eSocial.

## 🚀 Iniciando o Sistema

### 1. Iniciar o Servidor Backend
```bash
cd c:\Users\André\Downloads\esocial-xml\server
npm start
```

### 2. Iniciar o Frontend (opcional)
```bash
cd c:\Users\André\Downloads\esocial-xml
npm run dev
```

## 📝 Fluxo Completo via API

### Passo 1: Registrar Organização

```bash
POST http://localhost:3001/api/v1/auth/register
Content-Type: application/json

{
  "organizacao": {
    "nome": "Contabilidade XYZ Ltda",
    "cnpj": "12345678000190",
    "email": "contato@xyz.com",
    "telefone": "1133334444"
  },
  "usuario": {
    "nome": "Admin",
    "email": "admin@xyz.com",
    "senha": "senha123"
  }
}
```

**Resposta:**
```json
{
  "message": "Organização criada com sucesso",
  "organizacao": {
    "id": "uuid",
    "nome": "Contabilidade XYZ Ltda",
    "cnpj": "12345678000190"
  }
}
```

### Passo 2: Fazer Login

```bash
POST http://localhost:3001/api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@xyz.com",
  "senha": "senha123"
}
```

**Resposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "uuid",
    "nome": "Admin",
    "email": "admin@xyz.com",
    "role": "admin",
    "organizacao": {
      "id": "uuid",
      "nome": "Contabilidade XYZ Ltda"
    }
  }
}
```

💡 **Importante:** Copie o `token` para usar nas próximas requisições!

### Passo 3: Cadastrar Empregador

```bash
POST http://localhost:3001/api/v1/empregadores
Authorization: Bearer {seu-token-aqui}
Content-Type: application/json

{
  "razaoSocial": "Empresa ABC Ltda",
  "nomeFantasia": "ABC",
  "cnpj": "98765432000100",
  "naturezaJuridica": "2062",
  "cnaePrincipal": "6201500",
  "classificacaoTributaria": 1,
  "email": "contato@empresaabc.com",
  "telefone": "1133334444",
  "logradouro": "Rua Teste",
  "numero": "123",
  "bairro": "Centro",
  "cidade": "São Paulo",
  "uf": "SP",
  "cep": "01310100",
  "ambienteEsocial": 2
}
```

**Resposta:**
```json
{
  "id": "empregador-uuid",
  "razaoSocial": "Empresa ABC Ltda",
  ...
}
```

### Passo 4: Gerar Evento S-1000

```bash
POST http://localhost:3001/api/v1/empregadores/{empregador-uuid}/eventos/s1000
Authorization: Bearer {seu-token-aqui}
```

**Resposta:**
```json
{
  "success": true,
  "eventoId": "evento-uuid",
  "xml": "{...estrutura do evento...}"
}
```

### Passo 5: Listar Eventos na Fila

```bash
GET http://localhost:3001/api/v1/empregadores/{empregador-uuid}/eventos
Authorization: Bearer {seu-token-aqui}
```

**Resposta:**
```json
[
  {
    "id": "evento-uuid",
    "tipoEvento": "S-1000",
    "status": "pendente",
    "xmlGerado": "{...}",
    "createdAt": "2024-12-01T20:00:00.000Z"
  }
]
```

## 🧪 Teste Automatizado

Execute o script de teste para ver todo o fluxo funcionando:

```bash
npx tsx test-integration.ts
```

Este script irá:
1. ✅ Criar organização
2. ✅ Criar empregador
3. ✅ Criar rubricas
4. ✅ Gerar eventos S-1000 e S-1010
5. ✅ Enfileirar eventos
6. ✅ Listar fila de eventos

## 📊 Próximos Passos

Após gerar os eventos, você pode:

1. **Assinar o XML** com certificado digital
2. **Enviar para eSocial** via SOAP
3. **Monitorar retornos** e atualizar status
4. **Gerar mais eventos** (S-2200, S-1200, etc.)

## 🔧 Troubleshooting

### Erro: "Token inválido"
- Verifique se o token está no header `Authorization: Bearer {token}`
- Faça login novamente para obter um novo token

### Erro: "Empregador não encontrado"
- Verifique se o UUID do empregador está correto
- Certifique-se de que o empregador pertence à sua organização

### Erro de conexão com banco
- Verifique se o PostgreSQL está rodando
- Confirme as credenciais no arquivo `.env`
