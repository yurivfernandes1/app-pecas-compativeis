# Arquitetura Frontend - Golf MK3 App

## Stack Tecnológico

### Core
- **React Native:** Aplicação multiplataforma (Web, iOS, Android)
- **Expo:** Framework para desenvolvimento e deploy
- **TypeScript:** Tipagem estática para maior robustez

### Navegação e Estado
- **React Navigation:** Navegação entre telas
- **Context API:** Gerenciamento de estado global
- **AsyncStorage:** Persistência local de dados

### UI/UX
- **React Native Elements:** Componentes base
- **Styled Components:** Estilização componentizada
- **React Native Vector Icons:** Ícones

## Estrutura de Pastas

```
src/
├── components/           # Componentes reutilizáveis
│   ├── common/          # Componentes genéricos
│   ├── forms/           # Formulários
│   └── navigation/      # Componentes de navegação
├── screens/             # Telas da aplicação
│   ├── Home/
│   ├── Pecas/
│   ├── Cores/
│   └── Fusiveis/
├── data/                # Arquivos JSON com dados
│   ├── pecas.json
│   ├── cores.json
│   └── fusiveis.json
├── services/            # Serviços e utilitários
├── styles/              # Estilos globais e temas
├── types/               # Definições TypeScript
└── utils/               # Funções utilitárias
```

## Componentes Principais

### 1. Navegação
- **TabNavigator:** Navegação principal entre seções
- **StackNavigator:** Navegação hierárquica dentro das seções
- **DrawerNavigator:** Menu lateral (se necessário)

### 2. Busca e Filtros
- **SearchBar:** Barra de busca universal
- **FilterModal:** Modal com filtros avançados
- **CategoryFilter:** Filtro por categoria de peças

### 3. Listagem e Detalhes
- **PecasList:** Lista de peças compatíveis
- **PecaCard:** Card individual de peça
- **PecaDetail:** Tela de detalhes da peça

### 4. Cores
- **CoresGrid:** Grid de cores disponíveis
- **CorCard:** Card individual de cor com preview
- **CorDetail:** Detalhes da cor com código

### 5. Fusíveis
- **FusiveisMap:** Mapa interativo de fusíveis
- **FusivelDetail:** Detalhes do fusível selecionado

## Design System

### Paleta de Cores
```typescript
export const colors = {
  primary: '#DC2626',      // Vermelho
  secondary: '#374151',    // Cinza escuro
  background: '#FFFFFF',   // Branco
  surface: '#F9FAFB',     // Cinza claro
  text: '#111827',        // Texto principal
  textSecondary: '#6B7280' // Texto secundário
};
```

### Tipografia
```typescript
export const typography = {
  h1: { fontSize: 24, fontWeight: 'bold' },
  h2: { fontSize: 20, fontWeight: 'bold' },
  h3: { fontSize: 18, fontWeight: '600' },
  body: { fontSize: 16, fontWeight: 'normal' },
  caption: { fontSize: 14, fontWeight: 'normal' }
};
```

## Funcionalidades Específicas

### Proteção Anti-Screenshot
```typescript
// Implementar watermark e detecção de screenshot
import { preventScreenshot } from 'react-native-screenshot-prevent';

// Aplicar em telas sensíveis
useEffect(() => {
  preventScreenshot(true);
  return () => preventScreenshot(false);
}, []);
```

### Analytics
```typescript
// Google Analytics e Meta Pixel
import analytics from '@react-native-firebase/analytics';
import { Pixel } from 'react-native-facebook-pixel';

// Tracking de eventos
const trackEvent = (eventName: string, parameters: object) => {
  analytics().logEvent(eventName, parameters);
  Pixel.track(eventName, parameters);
};
```

### Performance
- **Lazy Loading:** Carregamento sob demanda de componentes
- **Memoization:** React.memo para componentes pesados
- **Virtual Lists:** Para listas grandes de peças
- **Image Optimization:** Otimização de imagens de cores

## Responsividade

### Breakpoints
```typescript
export const breakpoints = {
  mobile: 0,
  tablet: 768,
  desktop: 1024
};
```

### Layout Adaptativo
- **Mobile First:** Design prioritário para mobile
- **Flexbox:** Layout flexível e responsivo
- **Conditional Rendering:** Componentes específicos por plataforma