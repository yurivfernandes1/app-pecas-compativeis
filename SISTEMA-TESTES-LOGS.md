# Sistema de Testes e Monitoramento - Golf MK3 App

## Acesso à Página de Diagnósticos

A página de diagnósticos foi implementada como uma ferramenta interna de monitoramento e testing do aplicativo. Ela não aparece no menu principal para manter a interface limpa para os usuários finais.

### Como Acessar

**URL da Página de Diagnósticos:**
```
/diag-sys-internal-2025
```

**Exemplo completo:**
- Local: `http://localhost:3000/diag-sys-internal-2025`
- Produção: `https://seudominio.com/diag-sys-internal-2025`

### Funcionalidades Implementadas

#### 1. Sistema de Logs
- **Logs automáticos** de todas as ações do usuário
- **Níveis de log**: Info, Warning, Error, Debug
- **Filtragem** por nível de log
- **Armazenamento local** dos últimos 100 logs
- **Exportação** de logs em JSON

#### 2. Testes Automatizados
Os seguintes testes são executados:

- **DOM Elements**: Verifica se elementos essenciais estão presentes
- **Navigation**: Testa se todos os links de navegação funcionam
- **Data Loading**: Verifica se os dados JSON são acessíveis
- **Responsiveness**: Testa se o layout é responsivo
- **Accessibility**: Verifica elementos básicos de acessibilidade
- **Performance**: Monitora tempo de carregamento e uso de memória
- **PWA Features**: Testa funcionalidades de Progressive Web App
- **Connectivity**: Verifica conectividade com servidor

#### 3. Monitoramento de Saúde do Sistema
- **Status geral** do sistema (Healthy/Warning/Error)
- **Métricas de performance** (tempo de carregamento, memória)
- **Status da rede** (online/offline)
- **Verificações automáticas** de componentes críticos

#### 4. Monitoramento em Tempo Real
Implementado através do hook `useAppMonitoring` que monitora:

- **Interações do usuário** (cliques, navegação, buscas)
- **Tempo de sessão** e duração por página
- **Erros JavaScript** capturados automaticamente
- **Métricas de performance** por componente

### Páginas Monitoradas

As seguintes páginas já possuem monitoramento implementado:

1. **Home** (`/`)
   - Cliques em funcionalidades
   - Compartilhamento de conteúdo
   - Tempo de permanência

2. **Peças Compatíveis** (`/pecas`)
   - Buscas realizadas
   - Filtros aplicados
   - Expansão/colapso de categorias
   - Performance da busca

3. **Outras páginas** podem ser facilmente adicionadas usando o hook `useAppMonitoring`

### Como Usar o Sistema de Monitoramento

#### Em Componentes React:
```typescript
import { useAppMonitoring } from '../hooks';

const MeuComponente = () => {
  const { logUserInteraction, logError, logDebug } = useAppMonitoring('MeuComponente');

  const handleClick = () => {
    logUserInteraction('button_click', { buttonId: 'save' });
  };

  const handleError = (error: Error) => {
    logError('Erro ao salvar dados', { error: error.message });
  };

  return (
    <button onClick={handleClick}>
      Salvar
    </button>
  );
};
```

#### Usando o Logger Diretamente:
```typescript
import { logger } from '../utils';

// Log de informação
logger.info('Usuário fez login', 'AuthComponent', { userId: 123 });

// Log de erro
logger.error('Falha na API', 'DataService', { endpoint: '/api/data' });

// Log de debug (só aparece em desenvolvimento)
logger.debug('Estado atualizado', 'StateManager', { newState });
```

### Dados Coletados

#### Logs Incluem:
- **Timestamp** preciso
- **Nível** do log (info/warn/error/debug)
- **Componente** origem
- **Mensagem** descritiva
- **User Agent** do navegador
- **URL** atual
- **Dados contextuais** específicos da ação

#### Métricas de Performance:
- Tempo de carregamento das páginas
- Tempo de renderização dos componentes
- Uso de memória JavaScript
- Status da conectividade de rede

### Exportação de Dados

A página de diagnósticos permite exportar todos os dados coletados em formato JSON:

```json
{
  "timestamp": "2025-08-02T...",
  "logs": [...],
  "testResults": [...],
  "systemHealth": {...}
}
```

### Segurança e Privacidade

- **Sem dados pessoais**: O sistema não coleta informações pessoais
- **Apenas técnicos**: Foca em métricas técnicas e de performance
- **Local**: Dados armazenados localmente no navegador
- **Opt-in**: Sistema interno, não afeta usuários finais

### Desenvolvimento e Manutenção

Para adicionar novos testes ou monitoramento:

1. **Novos testes**: Adicione em `src/utils/testing.ts`
2. **Novos componentes**: Use o hook `useAppMonitoring`
3. **Logs customizados**: Use `logger` diretamente
4. **Métricas específicas**: Estenda `useAppMonitoring`

### Troubleshooting

Se a página de diagnósticos não carregar:

1. Verifique se a rota está correta
2. Verifique o console do navegador por erros
3. Teste em modo incógnito para evitar cache
4. Limpe o localStorage se necessário: `localStorage.clear()`

### Próximos Passos Sugeridos

1. **Alertas automáticos** para erros críticos
2. **Dashboard de métricas** em tempo real
3. **Testes E2E** automatizados
4. **Relatórios periódicos** de performance
5. **Integração com serviços** de monitoramento externos
