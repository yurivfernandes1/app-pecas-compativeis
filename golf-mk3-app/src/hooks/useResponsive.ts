import { useState, useEffect } from 'react';
import { Dimensions, Platform } from 'react-native';

interface ScreenDimensions {
  width: number;
  height: number;
}

interface ResponsiveInfo {
  screenData: ScreenDimensions;
  isTablet: boolean;
  isDesktop: boolean;
  isMobile: boolean;
  orientation: 'portrait' | 'landscape';
  breakpoint: 'mobile' | 'tablet' | 'desktop';
  platform: typeof Platform.OS;
}

export const useResponsive = (): ResponsiveInfo => {
  const [screenData, setScreenData] = useState<ScreenDimensions>(
    Dimensions.get('window')
  );

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setScreenData(window);
    });

    return () => subscription?.remove();
  }, []);

  const { width, height } = screenData;

  // Determinar tipo de dispositivo
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;
  const isMobile = width < 768;

  // Determinar orientação
  const orientation: 'portrait' | 'landscape' = height > width ? 'portrait' : 'landscape';

  // Determinar breakpoint
  let breakpoint: 'mobile' | 'tablet' | 'desktop';
  if (width >= 1024) {
    breakpoint = 'desktop';
  } else if (width >= 768) {
    breakpoint = 'tablet';
  } else {
    breakpoint = 'mobile';
  }

  return {
    screenData,
    isTablet,
    isDesktop,
    isMobile,
    orientation,
    breakpoint,
    platform: Platform.OS,
  };
};

// Hook para valores responsivos
export const useResponsiveValue = <T>(values: {
  mobile: T;
  tablet?: T;
  desktop?: T;
}): T => {
  const { breakpoint } = useResponsive();
  
  switch (breakpoint) {
    case 'desktop':
      return values.desktop ?? values.tablet ?? values.mobile;
    case 'tablet':
      return values.tablet ?? values.mobile;
    default:
      return values.mobile;
  }
};

// Hook para colunas responsivas
export const useResponsiveColumns = (
  mobileColumns: number = 1,
  tabletColumns: number = 2,
  desktopColumns: number = 3
): number => {
  return useResponsiveValue({
    mobile: mobileColumns,
    tablet: tabletColumns,
    desktop: desktopColumns,
  });
};

// Hook para espaçamento responsivo
export const useResponsiveSpacing = () => {
  const { breakpoint } = useResponsive();
  
  const spacing = {
    mobile: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
    },
    tablet: {
      xs: 6,
      sm: 12,
      md: 20,
      lg: 28,
      xl: 36,
    },
    desktop: {
      xs: 8,
      sm: 16,
      md: 24,
      lg: 32,
      xl: 48,
    },
  };
  
  return spacing[breakpoint];
};

// Hook para tipografia responsiva
export const useResponsiveTypography = () => {
  const { breakpoint } = useResponsive();
  
  const typography = {
    mobile: {
      h1: { fontSize: 24, lineHeight: 32 },
      h2: { fontSize: 20, lineHeight: 28 },
      h3: { fontSize: 18, lineHeight: 24 },
      body: { fontSize: 16, lineHeight: 24 },
      small: { fontSize: 14, lineHeight: 20 },
      caption: { fontSize: 12, lineHeight: 16 },
    },
    tablet: {
      h1: { fontSize: 28, lineHeight: 36 },
      h2: { fontSize: 24, lineHeight: 32 },
      h3: { fontSize: 20, lineHeight: 28 },
      body: { fontSize: 16, lineHeight: 24 },
      small: { fontSize: 14, lineHeight: 20 },
      caption: { fontSize: 12, lineHeight: 16 },
    },
    desktop: {
      h1: { fontSize: 32, lineHeight: 40 },
      h2: { fontSize: 28, lineHeight: 36 },
      h3: { fontSize: 24, lineHeight: 32 },
      body: { fontSize: 18, lineHeight: 28 },
      small: { fontSize: 16, lineHeight: 24 },
      caption: { fontSize: 14, lineHeight: 20 },
    },
  };
  
  return typography[breakpoint];
};

// Utilitário para calcular largura de card responsiva
export const useCardWidth = (
  columns?: number,
  spacing: number = 16
): number => {
  const { screenData } = useResponsive();
  const responsiveColumns = columns || useResponsiveColumns();
  
  const availableWidth = screenData.width - (spacing * 2); // Padding lateral
  const spacingBetweenCards = spacing * (responsiveColumns - 1);
  const cardWidth = (availableWidth - spacingBetweenCards) / responsiveColumns;
  
  return Math.floor(cardWidth);
};

// Hook para detectar mudanças de orientação
export const useOrientationChange = (
  callback: (orientation: 'portrait' | 'landscape') => void
) => {
  const { orientation } = useResponsive();
  
  useEffect(() => {
    callback(orientation);
  }, [orientation, callback]);
};

// Hook para valores baseados na plataforma
export const usePlatformValue = <T>(values: {
  ios?: T;
  android?: T;
  web?: T;
  default: T;
}): T => {
  const platform = Platform.OS;
  
  switch (platform) {
    case 'ios':
      return values.ios ?? values.default;
    case 'android':
      return values.android ?? values.default;
    case 'web':
      return values.web ?? values.default;
    default:
      return values.default;
  }
};

// Hook para safe area responsiva
export const useResponsiveSafeArea = () => {
  const { breakpoint, platform } = useResponsive();
  
  // Web não precisa de safe area
  if (platform === 'web') {
    return {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    };
  }
  
  // Valores base para mobile
  let safeArea = {
    top: 44,
    bottom: 34,
    left: 0,
    right: 0,
  };
  
  // Ajustar para tablet/desktop
  if (breakpoint !== 'mobile') {
    safeArea = {
      top: 20,
      bottom: 20,
      left: 0,
      right: 0,
    };
  }
  
  return safeArea;
};

// Utilitários de breakpoint
export const breakpoints = {
  mobile: 0,
  tablet: 768,
  desktop: 1024,
};

export const isBreakpoint = (breakpoint: keyof typeof breakpoints): boolean => {
  const { width } = Dimensions.get('window');
  
  switch (breakpoint) {
    case 'mobile':
      return width < breakpoints.tablet;
    case 'tablet':
      return width >= breakpoints.tablet && width < breakpoints.desktop;
    case 'desktop':
      return width >= breakpoints.desktop;
    default:
      return false;
  }
};

// Hook para performance em dispositivos diferentes
export const usePerformanceSettings = () => {
  const { breakpoint, platform } = useResponsive();
  
  return {
    // Reduzir animações em dispositivos menos potentes
    reduceAnimations: platform === 'android' && breakpoint === 'mobile',
    
    // Lazy loading mais agressivo em mobile
    lazyLoadingThreshold: breakpoint === 'mobile' ? 2 : 5,
    
    // Batch size para listas
    batchSize: breakpoint === 'mobile' ? 5 : 10,
    
    // Window size para VirtualizedList
    windowSize: breakpoint === 'mobile' ? 5 : 10,
    
    // Remover clipped subviews
    removeClippedSubviews: breakpoint === 'mobile',
    
    // Qualidade de imagem
    imageQuality: breakpoint === 'mobile' ? 'medium' : 'high',
  };
};