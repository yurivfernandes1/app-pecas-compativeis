import styled, { createGlobalStyle } from 'styled-components';

// Cores do design system - Tema escuro
export const colors = {
  primary: '#DC2626', // Vermelho principal (Falando de GTI)
  secondary: '#3A3A3A', // Cinza escuro neutro
  background: '#0a0a0a', // Fundo escuro como no site principal
  surface: '#1a1a1a', // Superfícies escuras
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#3A3A3A',
    800: '#2A2A2A',
    900: '#1A1A1A'
  },
  red: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D'
  }
};

// Breakpoints responsivos
export const breakpoints = {
  mobile: '320px',
  tablet: '768px',
  desktop: '1024px',
  largeDesktop: '1440px'
};

// Media queries
export const media = {
  mobile: `@media (max-width: 767px)`,
  tablet: `@media (min-width: 768px)`,
  desktop: `@media (min-width: 1024px)`,
  largeDesktop: `@media (min-width: ${breakpoints.largeDesktop})`
};

// Estilo global - Tema escuro
export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${colors.background} !important;
    color: ${colors.white};
    line-height: 1.6;
    min-height: 100vh;
  }
  
  // Garantir que links e botões não tenham cores azuis padrão do navegador
  a {
    color: inherit;
    text-decoration: none;
  }
  
  a:visited {
    color: inherit;
  }
  
  // Apenas sobrescrever elementos sem estilo explícito
  button:not([class]):not([style]) {
    background: ${colors.gray[800]};
    color: ${colors.white};
    border: 1px solid ${colors.gray[700]};
  }

  // Reset específico para inputs e selects para evitar estilos azuis padrão do navegador
  input, select {
    &:focus {
      outline: none !important;
      box-shadow: none !important;
    }
    
    &:not([class]):not([style]) {
      background: ${colors.gray[700]} !important;
      color: ${colors.white} !important;
      border: 1px solid ${colors.gray[600]} !important;
    }
  }
  
  // Evitar auto-complete com fundo azul
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px ${colors.gray[700]} inset !important;
    -webkit-text-fill-color: ${colors.white} !important;
    background-color: ${colors.gray[700]} !important;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  // Prevenção de screenshot (básica) - com exceções específicas para PWA
  body {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
  }

  // Permitir seleção e interação em elementos específicos
  input, textarea, select, [data-selectable="true"], button {
    -webkit-user-select: text !important;
    -moz-user-select: text !important;
    -ms-user-select: text !important;
    user-select: text !important;
    -webkit-touch-callout: default !important;
    -webkit-tap-highlight-color: rgba(220, 38, 38, 0.2) !important;
    pointer-events: auto !important;
  }
  
  // Garantir que inputs funcionem corretamente em PWA
  input[type="text"], input[type="search"], textarea {
    -webkit-appearance: none !important;
    -moz-appearance: none !important;
    appearance: none !important;
    touch-action: manipulation !important;
    -webkit-touch-callout: default !important;
    -webkit-user-select: text !important;
    -moz-user-select: text !important;
    user-select: text !important;
  }

  // Scrollbar escura customizada (oculta)
  ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: transparent;
  }

  // Firefox
  html {
    scrollbar-width: none;
  }
`;

// Container principal
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;

  ${media.tablet} {
    padding: 0 2rem;
  }

  ${media.desktop} {
    padding: 0 3rem;
  }
  
  @media (max-width: 480px) {
    padding: 0 0.75rem;
  }
`;

// Componente de cartão base - Tema escuro
export const Card = styled.div`
  background: ${colors.surface};
  border: 1px solid ${colors.gray[800]};
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3);
  padding: 1.5rem;
  color: ${colors.white};

  ${media.mobile} {
    padding: 1rem;
  }
`;

// Botão base - Tema escuro
export const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  ${props => props.variant === 'primary' ? `
    background-color: ${colors.primary};
    color: ${colors.white};
    
    &:hover {
      background-color: ${colors.red[700]};
      box-shadow: 0 0 15px rgba(220, 38, 38, 0.5);
    }
  ` : `
    background-color: ${colors.gray[800]};
    color: ${colors.white};
    border: 1px solid ${colors.gray[700]};
    
    &:hover {
      background-color: ${colors.gray[700]};
      border-color: ${colors.gray[600]};
    }
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${media.mobile} {
    width: 100%;
    padding: 1rem;
  }
`;

// Input base - Tema escuro
export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${colors.gray[700]};
  border-radius: 6px;
  font-size: 1rem;
  background-color: ${colors.surface};
  color: ${colors.white};
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.2);
  }

  &::placeholder {
    color: ${colors.gray[400]};
  }
`;

// Select base - Tema escuro
export const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${colors.gray[700]};
  border-radius: 6px;
  font-size: 1rem;
  background-color: ${colors.surface};
  color: ${colors.white};
  cursor: pointer;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.2);
  }

  option {
    background-color: ${colors.surface};
    color: ${colors.white};
  }
`;

// Título base - Tema escuro
export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${colors.white};
  margin-bottom: 1rem;

  ${media.mobile} {
    font-size: 1.5rem;
  }
`;

// Subtítulo - Tema escuro
export const Subtitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${colors.gray[200]};
  margin-bottom: 0.75rem;

  ${media.mobile} {
    font-size: 1.25rem;
  }
`;

// Grid responsivo
export const Grid = styled.div<{ columns?: number; gap?: string }>`
  display: grid;
  grid-template-columns: repeat(${props => props.columns || 1}, 1fr);
  gap: ${props => props.gap || '1rem'};

  ${media.mobile} {
    grid-template-columns: 1fr;
    gap: ${props => props.gap === '2rem' ? '1rem' : props.gap || '0.75rem'};
  }

  ${media.tablet} {
    grid-template-columns: repeat(${props => Math.min(props.columns || 1, 2)}, 1fr);
    gap: ${props => props.gap || '1rem'};
  }

  ${media.desktop} {
    grid-template-columns: repeat(${props => props.columns || 1}, 1fr);
    gap: ${props => props.gap || '1rem'};
  }
  
  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

// Watermark de direitos autorais
export const Watermark = styled.div`
  position: fixed;
  bottom: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  z-index: 1000;
  pointer-events: none;
`;
