# Estruturação de Dados - Golf MK3 App

## Fontes de Dados Disponíveis

### 1. Prints do App Antigo
- **Localização:** `prints_app_antigo/`
- **Conteúdo:** Screenshots do aplicativo original com listas de peças compatíveis
- **Formato:** Imagens que precisam ser analisadas e convertidas para JSON
- **Objetivo:** Extrair dados de compatibilidade de peças

### 2. Relação de Peças em Texto
- **Localização:** `prints_app_antigo/relacao_pecas_comapativeis.md`
- **Conteúdo:** Lista textual detalhada de peças compatíveis organizadas por modelo (GTI 2.0, GL, etc.)
- **Formato:** Markdown estruturado
- **Objetivo:** Base principal para criação do JSON de peças

### 3. Tabela de Cores VW
- **Localização:** `cores/tabela_cores_mk3.md`
- **Conteúdo:** Códigos de cores Volkswagen com links para referências visuais
- **Formato:** Markdown com códigos e URLs de imagens
- **Objetivo:** Seção dedicada de consulta de cores

### 4. Mapas de Fusíveis
- **Localização:** `fusiveis/`
- **Arquivos:** 
  - `mapa_caixa_fusiveis_reles.png`
  - `mapa_fusiveis.png`
- **Objetivo:** Seção interativa com diagramas de fusíveis

## Estrutura JSON Requerida

### Peças Compatíveis
```json
{
  "pecas": [
    {
      "id": "string",
      "nome": "string",
      "categoria": "string",
      "modelo_golf": ["GTI", "GL", "GLX"],
      "compativel_com": [
        {
          "veiculo": "string",
          "modelo": "string",
          "observacoes": "string"
        }
      ],
      "preco_original": "string",
      "preco_compativel": "string"
    }
  ]
}
```

### Cores VW
```json
{
  "cores": [
    {
      "codigo": "string",
      "nome": "string",
      "ano": "string",
      "imagem_url": "string",
      "disponivel": boolean
    }
  ]
}
```

### Fusíveis
```json
{
  "fusiveis": [
    {
      "posicao": "string",
      "amperagem": "string",
      "funcao": "string",
      "tipo": "fusivel|rele"
    }
  ]
}
```

## Diretrizes de Processamento

1. **Análise de Imagens:** Usar OCR ou análise manual para extrair dados dos prints
2. **Validação de Dados:** Cruzar informações entre diferentes fontes
3. **Estruturação:** Organizar dados em categorias lógicas
4. **Otimização:** Minimizar tamanho dos JSONs para performance
5. **Versionamento:** Manter controle de versão dos dados estruturados