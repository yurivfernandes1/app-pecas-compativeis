import { Alert, Platform } from 'react-native';
import Share from 'react-native-share';

interface ProtectionEvent {
  type: 'screenshot' | 'recording' | 'data_extraction';
  timestamp: number;
  platform: string;
  details?: any;
}

class ProtectionService {
  private static instance: ProtectionService;
  private violationCount = 0;
  private lastViolationTime = 0;
  private isProtectionEnabled = true;

  private constructor() {}

  static getInstance(): ProtectionService {
    if (!ProtectionService.instance) {
      ProtectionService.instance = new ProtectionService();
    }
    return ProtectionService.instance;
  }

  // Habilitar/desabilitar proteção
  setProtectionEnabled(enabled: boolean): void {
    this.isProtectionEnabled = enabled;
  }

  // Detectar tentativa de screenshot
  handleScreenshotDetected(): void {
    if (!this.isProtectionEnabled) return;

    const now = Date.now();
    this.violationCount++;
    this.lastViolationTime = now;

    // Log da violação
    this.logViolation({
      type: 'screenshot',
      timestamp: now,
      platform: Platform.OS,
      details: {
        violationCount: this.violationCount,
        timeSinceLastViolation: now - this.lastViolationTime
      }
    });

    // Mostrar alerta educativo
    this.showScreenshotAlert();
  }

  // Detectar gravação de tela
  handleScreenRecordingDetected(): void {
    if (!this.isProtectionEnabled) return;

    const now = Date.now();
    this.violationCount++;

    this.logViolation({
      type: 'recording',
      timestamp: now,
      platform: Platform.OS,
      details: {
        violationCount: this.violationCount
      }
    });

    // Mostrar alerta mais severo para gravação
    this.showRecordingAlert();
  }

  // Mostrar alerta de screenshot
  private showScreenshotAlert(): void {
    Alert.alert(
      '📸 Screenshot Detectado',
      'Este conteúdo é protegido por direitos autorais.\n\nPara compartilhar informações do app, use o botão de compartilhamento oficial.',
      [
        {
          text: 'Compartilhar App',
          onPress: () => this.shareAppOfficial(),
          style: 'default'
        },
        {
          text: 'Entendi',
          style: 'cancel'
        }
      ],
      { 
        cancelable: false,
        onDismiss: () => this.trackAlertDismissed('screenshot')
      }
    );
  }

  // Mostrar alerta de gravação
  private showRecordingAlert(): void {
    Alert.alert(
      '🎥 Gravação de Tela Detectada',
      'A gravação de tela deste aplicativo não é permitida.\n\nO conteúdo é protegido por direitos autorais da Falando de GTI.',
      [
        {
          text: 'Compartilhar App',
          onPress: () => this.shareAppOfficial(),
          style: 'default'
        },
        {
          text: 'Parar Gravação',
          style: 'destructive'
        }
      ],
      { 
        cancelable: false,
        onDismiss: () => this.trackAlertDismissed('recording')
      }
    );
  }

  // Compartilhar app oficialmente
  private async shareAppOfficial(): Promise<void> {
    try {
      const shareOptions = {
        title: 'App Peças Compatíveis Golf MK3',
        message: '🚗 Confira este app incrível para Golf MK3!\n\n' +
                 '✅ Peças compatíveis com preços\n' +
                 '🎨 Tabela completa de cores VW\n' +
                 '⚡ Mapa interativo de fusíveis\n\n' +
                 'Desenvolvido por Falando de GTI:\n' +
                 'https://app.falandodegti.com.br',
        url: 'https://app.falandodegti.com.br',
      };

      await Share.open(shareOptions);
      
      // Track compartilhamento via alerta
      this.trackShare('alert_share', 'screenshot_protection');
    } catch (error) {
      console.error('Erro ao compartilhar via alerta:', error);
    }
  }

  // Gerar watermark dinâmico
  generateWatermarkText(): string {
    const timestamp = new Date().toISOString().slice(0, 10);
    const baseText = '© Falando de GTI - app.falandodegti.com.br';
    
    // Adicionar timestamp para tornar único
    return `${baseText} - ${timestamp}`;
  }

  // Validar integridade dos dados
  validateDataIntegrity(data: any, expectedHash?: string): boolean {
    try {
      const dataString = JSON.stringify(data);
      const currentHash = this.generateSimpleHash(dataString);
      
      if (expectedHash && currentHash !== expectedHash) {
        this.logViolation({
          type: 'data_extraction',
          timestamp: Date.now(),
          platform: Platform.OS,
          details: {
            expectedHash,
            currentHash,
            dataSize: dataString.length
          }
        });
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Erro na validação de integridade:', error);
      return false;
    }
  }

  // Gerar hash simples para validação
  private generateSimpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
  }

  // Log de violações
  private logViolation(event: ProtectionEvent): void {
    console.warn('Security violation detected:', event);
    
    // TODO: Enviar para sistema de monitoramento
    // this.sendToMonitoring(event);
    
    // Armazenar localmente para análise
    this.storeViolationLocally(event);
  }

  // Armazenar violação localmente
  private storeViolationLocally(event: ProtectionEvent): void {
    try {
      // TODO: Implementar storage local seguro
      // AsyncStorage.setItem(`violation_${event.timestamp}`, JSON.stringify(event));
    } catch (error) {
      console.error('Erro ao armazenar violação:', error);
    }
  }

  // Track compartilhamento
  private trackShare(source: string, context: string): void {
    console.log('Share tracked from protection:', { source, context, timestamp: Date.now() });
    
    // TODO: Integrar com AnalyticsService
    // AnalyticsService.trackEvent('share_from_protection', { source, context });
  }

  // Track dismissal de alertas
  private trackAlertDismissed(alertType: string): void {
    console.log('Protection alert dismissed:', { alertType, timestamp: Date.now() });
    
    // TODO: Integrar com AnalyticsService
    // AnalyticsService.trackEvent('protection_alert_dismissed', { alertType });
  }

  // Obter estatísticas de violações
  getViolationStats(): { count: number; lastViolation: number } {
    return {
      count: this.violationCount,
      lastViolation: this.lastViolationTime
    };
  }

  // Reset estatísticas
  resetViolationStats(): void {
    this.violationCount = 0;
    this.lastViolationTime = 0;
  }

  // Verificar se deve mostrar toast de copyright
  shouldShowCopyrightToast(): boolean {
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    
    // Mostrar toast a cada 5 minutos de uso
    return (now - this.lastViolationTime) > fiveMinutes;
  }

  // Gerar mensagem de copyright para toast
  generateCopyrightToastMessage(): string {
    const messages = [
      '© Falando de GTI - Conteúdo protegido',
      '© 2024 Falando de GTI - Todos os direitos reservados',
      'app.falandodegti.com.br - Conteúdo original',
      '© Falando de GTI - Reprodução não autorizada'
    ];
    
    return messages[Math.floor(Math.random() * messages.length)];
  }

  // Verificar se app está sendo executado em emulador (proteção adicional)
  isRunningOnEmulator(): boolean {
    if (Platform.OS === 'android') {
      // Verificações básicas para Android
      return (
        Platform.constants?.Brand?.toLowerCase().includes('generic') ||
        Platform.constants?.Model?.toLowerCase().includes('emulator') ||
        Platform.constants?.Manufacturer?.toLowerCase().includes('genymotion')
      );
    }
    
    if (Platform.OS === 'ios') {
      // Verificações básicas para iOS Simulator
      return Platform.constants?.utsname?.machine?.includes('x86');
    }
    
    return false;
  }

  // Aplicar proteções específicas por plataforma
  applyPlatformSpecificProtections(): void {
    if (Platform.OS === 'android') {
      // Proteções específicas do Android
      this.applyAndroidProtections();
    } else if (Platform.OS === 'ios') {
      // Proteções específicas do iOS
      this.applyIOSProtections();
    }
  }

  private applyAndroidProtections(): void {
    // TODO: Implementar FLAG_SECURE via módulo nativo
    console.log('Applying Android-specific protections');
  }

  private applyIOSProtections(): void {
    // TODO: Implementar proteções específicas do iOS
    console.log('Applying iOS-specific protections');
  }
}

export default ProtectionService;