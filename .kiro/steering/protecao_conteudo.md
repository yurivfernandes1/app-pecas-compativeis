# Proteção de Conteúdo - Golf MK3 App

## Estratégia Anti-Screenshot

### Implementação Técnica
```typescript
// React Native Screenshot Prevention
import { preventScreenshot, allowScreenshot } from 'react-native-screenshot-prevent';
import { Alert } from 'react-native';

// Hook para proteção de tela
export const useScreenProtection = (enabled: boolean = true) => {
  useEffect(() => {
    if (enabled) {
      preventScreenshot(true);
    }
    
    return () => {
      preventScreenshot(false);
    };
  }, [enabled]);
};

// Detecção de tentativa de screenshot
import { addScreenshotListener } from 'react-native-screenshot-detector';

export const useScreenshotDetection = () => {
  useEffect(() => {
    const subscription = addScreenshotListener(() => {
      // Ação quando screenshot é detectado
      handleScreenshotDetected();
    });
    
    return () => subscription?.remove();
  }, []);
};
```

### Watermark Dinâmico
```typescript
// Componente de Watermark
interface WatermarkProps {
  text?: string;
  opacity?: number;
  position?: 'center' | 'bottom' | 'top';
}

const Watermark: React.FC<WatermarkProps> = ({
  text = '© Falando de GTI - app.falandodegti.com.br',
  opacity = 0.1,
  position = 'center'
}) => {
  return (
    <View style={[styles.watermark, styles[position]]}>
      <Text style={[styles.watermarkText, { opacity }]}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  watermark: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
    zIndex: 1000
  },
  watermarkText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
    transform: [{ rotate: '-45deg' }]
  },
  center: {
    justifyContent: 'center'
  },
  bottom: {
    justifyContent: 'flex-end',
    paddingBottom: 50
  },
  top: {
    justifyContent: 'flex-start',
    paddingTop: 50
  }
});
```

### Overlay de Proteção
```typescript
// Overlay que aparece sobre conteúdo sensível
const ProtectionOverlay: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showProtection, setShowProtection] = useState(false);
  
  useEffect(() => {
    // Detectar tentativas de screenshot/gravação
    const checkRecording = setInterval(() => {
      // Lógica para detectar gravação de tela (iOS/Android específico)
      if (isScreenRecording()) {
        setShowProtection(true);
      }
    }, 1000);
    
    return () => clearInterval(checkRecording);
  }, []);
  
  if (showProtection) {
    return (
      <View style={styles.protectionScreen}>
        <Text style={styles.protectionText}>
          Conteúdo protegido por direitos autorais
        </Text>
        <Text style={styles.protectionSubtext}>
          Compartilhe o link oficial: app.falandodegti.com.br
        </Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {children}
      <Watermark />
    </View>
  );
};
```

## Sistema de Alertas

### Modal de Aviso de Screenshot
```typescript
const ScreenshotAlert: React.FC = () => {
  const showScreenshotAlert = () => {
    Alert.alert(
      '📸 Screenshot Detectado',
      'Este conteúdo é protegido por direitos autorais.\n\nPara compartilhar, use o botão de compartilhamento oficial do app.',
      [
        {
          text: 'Compartilhar App',
          onPress: () => shareApp(),
          style: 'default'
        },
        {
          text: 'Entendi',
          style: 'cancel'
        }
      ],
      { cancelable: false }
    );
  };
  
  const shareApp = () => {
    Share.share({
      message: 'Confira o app de peças compatíveis para Golf MK3!\n\nhttps://app.falandodegti.com.br',
      title: 'App Peças Golf MK3'
    });
    
    // Track compartilhamento via alerta
    analytics().logEvent('share_from_alert', {
      source: 'screenshot_detection'
    });
  };
  
  return null; // Componente invisível que só mostra alertas
};
```

### Toast de Direitos Autorais
```typescript
// Toast sutil que aparece periodicamente
const CopyrightToast: React.FC = () => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    // Mostrar toast a cada 5 minutos de uso
    const interval = setInterval(() => {
      setVisible(true);
      setTimeout(() => setVisible(false), 3000);
    }, 300000); // 5 minutos
    
    return () => clearInterval(interval);
  }, []);
  
  if (!visible) return null;
  
  return (
    <Animated.View style={styles.toast}>
      <Text style={styles.toastText}>
        © Falando de GTI - Conteúdo protegido
      </Text>
    </Animated.View>
  );
};
```

## Proteção de Dados

### Ofuscação de Dados Sensíveis
```typescript
// Ofuscar dados em desenvolvimento/debug
const obfuscateData = (data: any, isDevelopment: boolean) => {
  if (!isDevelopment) return data;
  
  return {
    ...data,
    // Ofuscar informações sensíveis em dev
    userInfo: '***HIDDEN***',
    analytics: '***HIDDEN***'
  };
};

// Logs seguros
const secureLog = (message: string, data?: any) => {
  if (__DEV__) {
    console.log(message, obfuscateData(data, true));
  }
};
```

### Validação de Integridade
```typescript
// Verificar integridade dos dados JSON
const validateDataIntegrity = (jsonData: any) => {
  const expectedHash = 'hash_esperado_dos_dados';
  const currentHash = generateHash(JSON.stringify(jsonData));
  
  if (currentHash !== expectedHash) {
    // Dados foram modificados
    analytics().logEvent('data_integrity_violation', {
      expected: expectedHash,
      current: currentHash
    });
    
    return false;
  }
  
  return true;
};
```

## Compliance e Termos

### Aviso de Direitos Autorais
```typescript
const CopyrightNotice: React.FC = () => {
  return (
    <View style={styles.copyrightContainer}>
      <Text style={styles.copyrightText}>
        © 2024 Falando de GTI. Todos os direitos reservados.
      </Text>
      <Text style={styles.copyrightSubtext}>
        Conteúdo protegido por direitos autorais. 
        Reprodução não autorizada é proibida.
      </Text>
      <TouchableOpacity onPress={() => openTerms()}>
        <Text style={styles.termsLink}>
          Ver Termos de Uso
        </Text>
      </TouchableOpacity>
    </View>
  );
};
```

### Modal de Termos de Uso
```typescript
const TermsModal: React.FC<{ visible: boolean; onClose: () => void }> = ({
  visible,
  onClose
}) => {
  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={styles.modalContainer}>
        <ScrollView style={styles.termsContent}>
          <Text style={styles.termsTitle}>Termos de Uso</Text>
          
          <Text style={styles.termsSection}>
            1. PROPRIEDADE INTELECTUAL
          </Text>
          <Text style={styles.termsText}>
            Todo o conteúdo deste aplicativo, incluindo mas não limitado a 
            textos, imagens, dados e funcionalidades, é propriedade exclusiva 
            da Falando de GTI.
          </Text>
          
          <Text style={styles.termsSection}>
            2. USO PERMITIDO
          </Text>
          <Text style={styles.termsText}>
            O uso deste aplicativo é destinado exclusivamente para consulta 
            pessoal. É proibida a reprodução, distribuição ou uso comercial 
            do conteúdo sem autorização expressa.
          </Text>
          
          <Text style={styles.termsSection}>
            3. PROTEÇÃO DE CONTEÚDO
          </Text>
          <Text style={styles.termsText}>
            Este aplicativo possui sistemas de proteção contra cópia não 
            autorizada. Screenshots e gravações são monitorados.
          </Text>
        </ScrollView>
        
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Fechar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </Modal>
  );
};
```

## Monitoramento e Analytics

### Tracking de Violações
```typescript
// Monitorar tentativas de violação
const trackViolation = (type: 'screenshot' | 'recording' | 'data_extraction') => {
  analytics().logEvent('content_violation_attempt', {
    violation_type: type,
    timestamp: Date.now(),
    user_agent: getUserAgent(),
    platform: Platform.OS
  });
  
  // Enviar para sistema de monitoramento
  sendSecurityAlert({
    type: 'content_violation',
    details: {
      violation_type: type,
      app_version: getAppVersion(),
      device_info: getDeviceInfo()
    }
  });
};
```

### Dashboard de Segurança
```typescript
// Métricas de segurança para dashboard
const securityMetrics = {
  screenshot_attempts: 0,
  recording_attempts: 0,
  data_integrity_checks: 0,
  violations_blocked: 0,
  copyright_notices_shown: 0
};

const updateSecurityMetrics = (metric: keyof typeof securityMetrics) => {
  securityMetrics[metric]++;
  
  // Enviar métricas para analytics
  analytics().logEvent('security_metric_update', {
    metric_name: metric,
    metric_value: securityMetrics[metric]
  });
};
```

## Implementação por Plataforma

### iOS Específico
```typescript
// Proteções específicas do iOS
import { NativeModules } from 'react-native';

const iOSProtection = {
  // Detectar gravação de tela
  detectScreenRecording: () => {
    return NativeModules.ScreenRecordingDetector?.isRecording() || false;
  },
  
  // Bloquear screenshots em telas específicas
  setScreenshotBlocked: (blocked: boolean) => {
    NativeModules.ScreenshotBlocker?.setBlocked(blocked);
  }
};
```

### Android Específico
```typescript
// Proteções específicas do Android
const androidProtection = {
  // FLAG_SECURE para prevenir screenshots
  setSecureFlag: (secure: boolean) => {
    NativeModules.SecureScreen?.setSecure(secure);
  },
  
  // Detectar apps de gravação
  detectRecordingApps: () => {
    return NativeModules.RecordingDetector?.hasRecordingApps() || false;
  }
};
```