import { useEffect, useState } from 'react';
import { Platform, AppState, AppStateStatus } from 'react-native';
import ProtectionService from '../services/ProtectionService';

interface UseProtectionOptions {
  enableScreenshotProtection?: boolean;
  enableRecordingProtection?: boolean;
  enableWatermark?: boolean;
  onViolationDetected?: (type: 'screenshot' | 'recording') => void;
}

interface ProtectionState {
  isProtected: boolean;
  violationCount: number;
  lastViolation: number;
  isRecording: boolean;
  watermarkText: string;
}

export const useProtection = (options: UseProtectionOptions = {}) => {
  const {
    enableScreenshotProtection = true,
    enableRecordingProtection = true,
    enableWatermark = true,
    onViolationDetected,
  } = options;

  const [protectionState, setProtectionState] = useState<ProtectionState>({
    isProtected: false,
    violationCount: 0,
    lastViolation: 0,
    isRecording: false,
    watermarkText: '',
  });

  const protectionService = ProtectionService.getInstance();

  useEffect(() => {
    // Inicializar proteção
    initializeProtection();
    
    // Configurar listeners
    const appStateListener = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      appStateListener?.remove();
      cleanupProtection();
    };
  }, []);

  useEffect(() => {
    // Atualizar estado quando opções mudam
    protectionService.setProtectionEnabled(
      enableScreenshotProtection || enableRecordingProtection
    );
    
    updateProtectionState();
  }, [enableScreenshotProtection, enableRecordingProtection, enableWatermark]);

  const initializeProtection = async () => {
    try {
      // Aplicar proteções específicas da plataforma
      protectionService.applyPlatformSpecificProtections();
      
      // Configurar detecção de screenshot
      if (enableScreenshotProtection) {
        setupScreenshotDetection();
      }
      
      // Configurar detecção de gravação
      if (enableRecordingProtection) {
        setupRecordingDetection();
      }
      
      // Gerar watermark
      if (enableWatermark) {
        const watermarkText = protectionService.generateWatermarkText();
        setProtectionState(prev => ({
          ...prev,
          watermarkText,
        }));
      }
      
      setProtectionState(prev => ({
        ...prev,
        isProtected: true,
      }));
    } catch (error) {
      console.error('Erro ao inicializar proteção:', error);
    }
  };

  const setupScreenshotDetection = () => {
    // TODO: Implementar quando bibliotecas estiverem funcionando
    // const listener = addScreenshotListener(() => {
    //   handleViolationDetected('screenshot');
    // });
    
    // Simulação para desenvolvimento
    if (__DEV__) {
      console.log('Screenshot detection enabled (simulated)');
    }
  };

  const setupRecordingDetection = () => {
    // TODO: Implementar detecção real de gravação
    if (__DEV__) {
      console.log('Recording detection enabled (simulated)');
    }
  };

  const handleViolationDetected = (type: 'screenshot' | 'recording') => {
    // Atualizar estado
    const stats = protectionService.getViolationStats();
    setProtectionState(prev => ({
      ...prev,
      violationCount: stats.count,
      lastViolation: stats.lastViolation,
    }));
    
    // Callback externo
    onViolationDetected?.(type);
  };

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'background') {
      // App foi para background, pode ser tentativa de screenshot
      console.log('App moved to background - potential screenshot attempt');
    } else if (nextAppState === 'active') {
      // App voltou para foreground
      updateProtectionState();
    }
  };

  const updateProtectionState = () => {
    const stats = protectionService.getViolationStats();
    const watermarkText = protectionService.generateWatermarkText();
    
    setProtectionState(prev => ({
      ...prev,
      violationCount: stats.count,
      lastViolation: stats.lastViolation,
      watermarkText,
    }));
  };

  const cleanupProtection = () => {
    // Limpar listeners e recursos
    console.log('Cleaning up protection resources');
  };

  // Métodos públicos
  const triggerScreenshotDetection = () => {
    if (enableScreenshotProtection) {
      protectionService.handleScreenshotDetected();
      handleViolationDetected('screenshot');
    }
  };

  const triggerRecordingDetection = () => {
    if (enableRecordingProtection) {
      protectionService.handleScreenRecordingDetected();
      handleViolationDetected('recording');
    }
  };

  const resetViolationStats = () => {
    protectionService.resetViolationStats();
    updateProtectionState();
  };

  const validateDataIntegrity = (data: any, expectedHash?: string): boolean => {
    return protectionService.validateDataIntegrity(data, expectedHash);
  };

  const generateWatermark = (): string => {
    return protectionService.generateWatermarkText();
  };

  const isRunningOnEmulator = (): boolean => {
    return protectionService.isRunningOnEmulator();
  };

  return {
    // Estado
    ...protectionState,
    
    // Métodos
    triggerScreenshotDetection,
    triggerRecordingDetection,
    resetViolationStats,
    validateDataIntegrity,
    generateWatermark,
    isRunningOnEmulator,
    
    // Utilitários
    shouldShowCopyrightToast: protectionService.shouldShowCopyrightToast.bind(protectionService),
    generateCopyrightToastMessage: protectionService.generateCopyrightToastMessage.bind(protectionService),
  };
};

// Hook específico para watermark
export const useWatermark = (enabled: boolean = true) => {
  const [watermarkText, setWatermarkText] = useState('');
  const protectionService = ProtectionService.getInstance();

  useEffect(() => {
    if (enabled) {
      const text = protectionService.generateWatermarkText();
      setWatermarkText(text);
      
      // Atualizar watermark periodicamente
      const interval = setInterval(() => {
        const newText = protectionService.generateWatermarkText();
        setWatermarkText(newText);
      }, 60000); // A cada minuto
      
      return () => clearInterval(interval);
    }
  }, [enabled]);

  return {
    watermarkText,
    enabled,
  };
};

// Hook para detecção de screenshot (desenvolvimento/teste)
export const useScreenshotDetection = (onDetected?: () => void) => {
  const [detectionCount, setDetectionCount] = useState(0);

  const simulateScreenshot = () => {
    setDetectionCount(prev => prev + 1);
    onDetected?.();
    
    // Simular detecção para desenvolvimento
    if (__DEV__) {
      console.log('Screenshot simulated for testing');
    }
  };

  return {
    detectionCount,
    simulateScreenshot,
  };
};