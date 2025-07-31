# UX/UI Guidelines - Golf MK3 App

## Princípios de Design

### 1. Minimalismo Funcional
- Interface limpa e focada no conteúdo
- Hierarquia visual clara
- Redução de elementos desnecessários
- Foco na funcionalidade principal

### 2. Usabilidade Intuitiva
- Navegação simples e previsível
- Feedback visual imediato
- Padrões familiares aos usuários
- Acessibilidade em primeiro lugar

### 3. Performance Visual
- Carregamento rápido de conteúdo
- Transições suaves
- Estados de loading claros
- Otimização para diferentes dispositivos

## Design System

### Paleta de Cores
```css
/* Cores Principais */
--primary-red: #DC2626;
--dark-gray: #374151;
--white: #FFFFFF;

/* Cores Secundárias */
--light-gray: #F9FAFB;
--medium-gray: #6B7280;
--dark-text: #111827;
--border-gray: #E5E7EB;

/* Estados */
--success: #10B981;
--warning: #F59E0B;
--error: #EF4444;
--info: #3B82F6;
```

### Tipografia
```css
/* Hierarquia Tipográfica */
--font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;

--h1: 24px/32px, weight: 700;
--h2: 20px/28px, weight: 600;
--h3: 18px/24px, weight: 600;
--body: 16px/24px, weight: 400;
--small: 14px/20px, weight: 400;
--caption: 12px/16px, weight: 400;
```

### Espaçamento
```css
/* Sistema de Espaçamento (8px base) */
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;
```

## Componentes UI

### 1. Cards de Peças
```typescript
interface PecaCardProps {
  nome: string;
  categoria: string;
  compatibilidade: string[];
  preco?: string;
  onPress: () => void;
}
```

**Design:**
- Background branco com sombra sutil
- Border radius: 8px
- Padding: 16px
- Ícone da categoria à esquerda
- Título em destaque
- Subtítulo com compatibilidade
- Preço (se disponível) em destaque

### 2. Barra de Busca
```typescript
interface SearchBarProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onFilter: () => void;
}
```

**Design:**
- Background cinza claro
- Border radius: 24px
- Ícone de busca à esquerda
- Ícone de filtro à direita
- Placeholder em cinza médio

### 3. Filtros
```typescript
interface FilterChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
}
```

**Design:**
- Chips horizontais scrolláveis
- Background vermelho quando ativo
- Background cinza claro quando inativo
- Texto branco quando ativo
- Border radius: 16px

### 4. Tabela de Cores
```typescript
interface CorCardProps {
  codigo: string;
  nome: string;
  imagemUrl?: string;
  onPress: () => void;
}
```

**Design:**
- Grid responsivo (2-3 colunas)
- Preview da cor como círculo
- Código em destaque
- Nome da cor abaixo
- Tap para expandir detalhes

### 5. Mapa de Fusíveis
```typescript
interface FusivelMapProps {
  fusiveisDados: FusivelData[];
  onFusivelPress: (fusivel: FusivelData) => void;
}
```

**Design:**
- Imagem do diagrama como base
- Pontos interativos sobre fusíveis
- Tooltip com informações básicas
- Modal com detalhes completos

## Fluxos de Navegação

### 1. Fluxo Principal
```
Home → Categorias → Lista de Peças → Detalhes da Peça
```

### 2. Fluxo de Busca
```
Busca → Resultados → Filtros → Detalhes
```

### 3. Fluxo de Cores
```
Cores → Grid de Cores → Detalhes da Cor
```

### 4. Fluxo de Fusíveis
```
Fusíveis → Mapa Interativo → Detalhes do Fusível
```

## Estados da Interface

### Loading States
- Skeleton screens para listas
- Spinners para ações rápidas
- Progress bars para uploads
- Shimmer effect para cards

### Empty States
- Ilustrações amigáveis
- Mensagens claras
- CTAs para ação
- Sugestões de próximos passos

### Error States
- Mensagens de erro claras
- Botões de retry
- Informações de contato
- Fallbacks visuais

## Micro-interações

### Feedback Visual
- Tap feedback em todos os elementos clicáveis
- Hover states para web
- Loading states durante transições
- Confirmações visuais para ações

### Transições
- Fade in/out para modais
- Slide transitions para navegação
- Scale animations para botões
- Parallax para headers

## Acessibilidade

### Diretrizes WCAG
- Contraste mínimo 4.5:1
- Tamanho mínimo de toque: 44px
- Labels descritivos
- Navegação por teclado
- Screen reader support

### Implementação
```typescript
// Exemplo de acessibilidade
<TouchableOpacity
  accessible={true}
  accessibilityLabel="Buscar peças compatíveis"
  accessibilityHint="Toque para abrir a busca"
  accessibilityRole="button"
>
  <Text>Buscar</Text>
</TouchableOpacity>
```

## Responsividade

### Mobile (< 768px)
- Layout single column
- Navigation tabs na parte inferior
- Cards full-width
- Typography otimizada para mobile

### Tablet (768px - 1024px)
- Layout two-column
- Sidebar navigation
- Cards em grid 2x2
- Maior densidade de informação

### Desktop (> 1024px)
- Layout three-column
- Navigation sidebar fixa
- Cards em grid 3x3
- Hover states ativos