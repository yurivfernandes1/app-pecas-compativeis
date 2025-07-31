// Design System - Golf MK3 App

export const colors = {
  // Cores Principais
  primary: '#DC2626',      // Vermelho
  secondary: '#374151',    // Cinza escuro
  background: '#FFFFFF',   // Branco
  surface: '#F9FAFB',     // Cinza claro
  
  // Cores de Texto
  text: '#111827',        // Texto principal
  textSecondary: '#6B7280', // Texto secundário
  textLight: '#9CA3AF',   // Texto claro
  
  // Cores de Borda
  border: '#E5E7EB',      // Borda padrão
  borderLight: '#F3F4F6', // Borda clara
  
  // Estados
  success: '#10B981',     // Verde sucesso
  warning: '#F59E0B',     // Amarelo aviso
  error: '#EF4444',       // Vermelho erro
  info: '#3B82F6',        // Azul informação
  
  // Transparências
  overlay: 'rgba(0, 0, 0, 0.5)',
  backdrop: 'rgba(0, 0, 0, 0.3)',
  
  // Cores específicas das categorias
  categories: {
    motor: '#DC2626',
    freios: '#EF4444',
    suspensao: '#F59E0B',
    eletrica: '#3B82F6',
    carroceria: '#10B981',
    outros: '#6B7280'
  }
};

export const typography = {
  // Família de fontes
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System'
  },
  
  // Tamanhos e pesos
  h1: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '700' as const
  },
  h2: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600' as const
  },
  h3: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600' as const
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const
  },
  bodyMedium: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500' as const
  },
  small: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const
  }
};

export const spacing = {
  // Sistema de espaçamento baseado em 8px
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  
  // Espaçamentos específicos
  screenPadding: 16,
  cardPadding: 16,
  sectionSpacing: 24
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  }
};

export const breakpoints = {
  mobile: 0,
  tablet: 768,
  desktop: 1024
};

// Tema completo
export const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  breakpoints
};

export type Theme = typeof theme;