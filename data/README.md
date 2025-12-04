# Tabela de Categorias de Trabalhadores

Este arquivo contém a Tabela 01 do eSocial - Categorias de Trabalhadores, conforme o Manual do eSocial.

## Uso

### Importar a tabela

```typescript
import { 
  CATEGORIAS_TRABALHADORES, 
  getCategoriasAtivas,
  getCategoriaByCode,
  getCategoriasOptions,
  getCategoriasGroupedOptions 
} from './data/categorias';
```

### Obter todas as categorias ativas

```typescript
const categoriasAtivas = getCategoriasAtivas(); // Data atual
const categoriasEm2020 = getCategoriasAtivas(new Date('2020-01-01'));
```

### Buscar categoria por código

```typescript
const categoria = getCategoriaByCode(101);
// { codigo: 101, descricao: 'Empregado - Geral...', ... }
```

### Opções para select (simples)

```typescript
const options = getCategoriasOptions();
// [{ value: 101, label: '101 - Empregado - Geral...' }, ...]
```

### Opções para select (agrupadas)

```typescript
const groupedOptions = getCategoriasGroupedOptions();
// [
//   { label: 'Empregados', options: [...] },
//   { label: 'Servidores Públicos', options: [...] },
//   ...
// ]
```

## Estrutura dos Dados

Cada categoria contém:

- **codigo**: Código numérico da categoria (ex: 101, 201, 301)
- **descricao**: Descrição completa da categoria
- **dtInicio**: Data de início de vigência (formato DD/MM/AAAA)
- **dtFim**: Data de fim de vigência ou null se ainda vigente
- **grupo**: Grupo da categoria
  - `SE`: Empregados
  - `AV`: Trabalhadores Avulsos
  - `SP`: Servidores Públicos
  - `CE`: Categorias Especiais
  - `SG`: Segurado Especial
  - `CI`: Contribuintes Individuais
  - `ES`: Estagiários e Bolsistas
- **aliqFGTS**: Alíquota do FGTS (%) ou null
- **obriga**: Indicador de obrigatoriedade (0, 1 ou 2)
- **aliqFGTSCo**: Alíquota compensatória do FGTS ou null
- **cp**: Código de contribuição previdenciária (0, 1, 2, 3 ou 9)
- **eConsignado**: Permite empréstimo consignado ('S' ou 'N')

## Integração com Formulários

A tabela está integrada com o `eventLibrary.ts` e pode ser usada em qualquer campo de categoria:

```typescript
{
  name: 'codCateg',
  label: 'Categoria do Trabalhador',
  type: 'select',
  path: 'categoria',
  required: true,
  options: getCategoriasGroupedOptions()
}
```

## Categorias Principais

### Empregados (SE)
- 101: Empregado Geral
- 102: Trabalhador Rural
- 103: Aprendiz
- 104: Doméstico
- 111: Contrato Intermitente

### Servidores Públicos (SP)
- 301: Cargo Efetivo
- 302: Cargo em Comissão
- 306: Contrato Temporário
- 314: Militar das Forças Armadas

### Contribuintes Individuais (CI)
- 701: Autônomo
- 721: Diretor com FGTS
- 722: Diretor sem FGTS
- 731: Cooperado

### Estagiários (ES)
- 901: Estagiário
- 902: Médico Residente
- 903: Bolsista

## Observações

- Categorias com `dtFim` preenchido não estão mais vigentes
- Use `getCategoriasAtivas()` para obter apenas categorias válidas
- A função considera a data atual por padrão, mas aceita data customizada
