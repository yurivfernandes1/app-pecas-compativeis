import { useState, useEffect } from 'react';
import { AccessibilityInfo, Platform } from 'react-native';

interface AccessibilityState {
  isScreenReaderEnabled: boolean;
  isReduceMotionEnabled: boolean;
  isReduceTransparencyEnabled: boolean;
  isBoldTextEnabled: boolean;
  isGrayscaleEnabled: boolean;
  isInvertColorsEnabled: boolean;
  isHighContrastEnabled: boolean;
}

export const useAccessibility = () => {
  const [accessibilityState, setAccessibilityState] = useState<AccessibilityState>({
    isScreenReaderEnabled: false,
    isReduceMotionEnabled: false,
    isReduceTransparencyEnabled: false,
    isBoldTextEnabled: false,
    isGrayscaleEnabled: false,
    isInvertColorsEnabled: false,
    isHighContrastEnabled: false,
  });

  useEffect(() => {
    // Verificar estado inicial
    checkAccessibilitySettings();

    // Listeners para mudanças
    const screenReaderListener = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      (isEnabled) => {
        setAccessibilityState(prev => ({
          ...prev,
          isScreenReaderEnabled: isEnabled,
        }));
      }
    );

    const reduceMotionListener = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (isEnabled) => {
        setAccessibilityState(prev => ({
          ...prev,
          isReduceMotionEnabled: isEnabled,
        }));
      }
    );

    const boldTextListener = AccessibilityInfo.addEventListener(
      'boldTextChanged',
      (isEnabled) => {
        setAccessibilityState(prev => ({
          ...prev,
          isBoldTextEnabled: isEnabled,
        }));
      }
    );

    return () => {
      screenReaderListener?.remove();
      reduceMotionListener?.remove();
      boldTextListener?.remove();
    };
  }, []);

  const checkAccessibilitySettings = async () => {
    try {
      const [
        screenReader,
        reduceMotion,
        reduceTransparency,
        boldText,
        grayscale,
        invertColors,
        highContrast,
      ] = await Promise.all([
        AccessibilityInfo.isScreenReaderEnabled(),
        AccessibilityInfo.isReduceMotionEnabled(),
        Platform.OS === 'ios' ? AccessibilityInfo.isReduceTransparencyEnabled() : Promise.resolve(false),
        Platform.OS === 'ios' ? AccessibilityInfo.isBoldTextEnabled() : Promise.resolve(false),
        Platform.OS === 'ios' ? AccessibilityInfo.isGrayscaleEnabled() : Promise.resolve(false),
        Platform.OS === 'ios' ? AccessibilityInfo.isInvertColorsEnabled() : Promise.resolve(false),
        Platform.OS === 'android' ? AccessibilityInfo.isAccessibilityServiceEnabled() : Promise.resolve(false),
      ]);

      setAccessibilityState({
        isScreenReaderEnabled: screenReader,
        isReduceMotionEnabled: reduceMotion,
        isReduceTransparencyEnabled: reduceTransparency,
        isBoldTextEnabled: boldText,
        isGrayscaleEnabled: grayscale,
        isInvertColorsEnabled: invertColors,
        isHighContrastEnabled: highContrast,
      });
    } catch (error) {
      console.error('Error checking accessibility settings:', error);
    }
  };

  // Anunciar mensagem para screen readers
  const announceForAccessibility = (message: string) => {
    AccessibilityInfo.announceForAccessibility(message);
  };

  // Definir foco de acessibilidade
  const setAccessibilityFocus = (reactTag: number) => {
    AccessibilityInfo.setAccessibilityFocus(reactTag);
  };

  // Verificar se um serviço de acessibilidade específico está ativo
  const isAccessibilityServiceEnabled = async (): Promise<boolean> => {
    try {
      if (Platform.OS === 'android') {
        return await AccessibilityInfo.isAccessibilityServiceEnabled();
      }
      return accessibilityState.isScreenReaderEnabled;
    } catch (error) {
      return false;
    }
  };

  return {
    ...accessibilityState,
    announceForAccessibility,
    setAccessibilityFocus,
    isAccessibilityServiceEnabled,
    checkAccessibilitySettings,
  };
};

// Hook para configurações de acessibilidade específicas
export const useAccessibilitySettings = () => {
  const accessibility = useAccessibility();

  return {
    // Configurações de animação
    shouldReduceAnimations: accessibility.isReduceMotionEnabled,
    animationDuration: accessibility.isReduceMotionEnabled ? 0 : 300,
    
    // Configurações de texto
    shouldUseBoldText: accessibility.isBoldTextEnabled,
    fontWeight: accessibility.isBoldTextEnabled ? '700' : '400',
    
    // Configurações de contraste
    shouldUseHighContrast: accessibility.isHighContrastEnabled,
    contrastRatio: accessibility.isHighContrastEnabled ? 7 : 4.5,
    
    // Configurações de transparência
    shouldReduceTransparency: accessibility.isReduceTransparencyEnabled,
    opacity: accessibility.isReduceTransparencyEnabled ? 1 : 0.8,
    
    // Configurações de cores
    shouldInvertColors: accessibility.isInvertColorsEnabled,
    shouldUseGrayscale: accessibility.isGrayscaleEnabled,
    
    // Screen reader
    isScreenReaderActive: accessibility.isScreenReaderEnabled,
  };
};

// Hook para props de acessibilidade comuns
export const useAccessibilityProps = (
  label: string,
  hint?: string,
  role?: string,
  state?: { selected?: boolean; disabled?: boolean; expanded?: boolean }
) => {
  const { isScreenReaderEnabled } = useAccessibility();

  return {
    accessible: true,
    accessibilityLabel: label,
    accessibilityHint: hint,
    accessibilityRole: role as any,
    accessibilityState: state,
    // Melhorar navegação por teclado
    focusable: true,
    // Importância para screen readers
    importantForAccessibility: isScreenReaderEnabled ? 'yes' : 'auto',
  };
};

// Hook para navegação por teclado
export const useKeyboardNavigation = () => {
  const [focusedElement, setFocusedElement] = useState<string | null>(null);

  const handleKeyPress = (key: string, elementId: string, onAction?: () => void) => {
    if (key === 'Enter' || key === ' ') {
      onAction?.();
    } else if (key === 'Tab') {
      setFocusedElement(elementId);
    }
  };

  const moveFocus = (direction: 'next' | 'previous', elements: string[]) => {
    if (!focusedElement) return;
    
    const currentIndex = elements.indexOf(focusedElement);
    let nextIndex;
    
    if (direction === 'next') {
      nextIndex = currentIndex + 1 >= elements.length ? 0 : currentIndex + 1;
    } else {
      nextIndex = currentIndex - 1 < 0 ? elements.length - 1 : currentIndex - 1;
    }
    
    setFocusedElement(elements[nextIndex]);
  };

  return {
    focusedElement,
    setFocusedElement,
    handleKeyPress,
    moveFocus,
  };
};

// Hook para feedback tátil acessível
export const useAccessibleFeedback = () => {
  const { isScreenReaderEnabled } = useAccessibility();

  const provideFeedback = (
    type: 'success' | 'error' | 'warning' | 'info',
    message: string,
    haptic?: boolean
  ) => {
    // Anunciar para screen readers
    if (isScreenReaderEnabled) {
      const prefix = {
        success: 'Sucesso: ',
        error: 'Erro: ',
        warning: 'Aviso: ',
        info: 'Informação: ',
      }[type];
      
      AccessibilityInfo.announceForAccessibility(prefix + message);
    }

    // Feedback tátil (se suportado e solicitado)
    if (haptic && Platform.OS === 'ios') {
      // TODO: Implementar feedback tátil quando biblioteca estiver disponível
      // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  return { provideFeedback };
};

// Utilitários de acessibilidade
export const AccessibilityUtils = {
  // Verificar se texto tem contraste suficiente
  hasGoodContrast: (foreground: string, background: string, level: 'AA' | 'AAA' = 'AA'): boolean => {
    // Implementação simplificada - em produção usar biblioteca de contraste
    const requiredRatio = level === 'AAA' ? 7 : 4.5;
    // TODO: Implementar cálculo real de contraste
    return true; // Placeholder
  },

  // Gerar ID único para elementos
  generateAccessibilityId: (prefix: string): string => {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  // Formatar texto para screen readers
  formatForScreenReader: (text: string): string => {
    return text
      .replace(/([A-Z])/g, ' $1') // Adicionar espaços antes de maiúsculas
      .replace(/\d+/g, (match) => ` ${match} `) // Separar números
      .replace(/\s+/g, ' ') // Normalizar espaços
      .trim();
  },

  // Verificar se elemento é focável
  isFocusable: (element: any): boolean => {
    return element && (
      element.accessible !== false &&
      element.accessibilityRole !== 'none' &&
      !element.accessibilityElementsHidden
    );
  },
};