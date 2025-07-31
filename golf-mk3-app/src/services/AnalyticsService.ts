import analytics from '@react-native-firebase/analytics';
import { Platform } from 'react-native';

interface AnalyticsEvent {
  name: string;
  parameters?: Record<string, any>;
}

interface UserProperties {
  user_type?: 'free' | 'premium';
  golf_model?: 'GTI' | 'GL' | 'GLX';
  app_version?: string;
  platform?: string;
}

class AnalyticsService {
  private static instance: AnalyticsService;
  private isInitialized = false;
  private userId: string | null = null;

  private constructor() {}

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  // Inicializar analytics
  async initialize(): Promise<void> {
    try {
      // Configurar propriedades básicas
      await analytics().setAnalyticsCollectionEnabled(true);
      
      // Definir propriedades do usuário
      await this.setUserProperties({
        user_type: 'free',
        platform: Platform.OS,
        app_version: '1.0.0'
      });

      this.isInitialized = true;
      console.log('Analytics initialized successfully');
    } catch (error) {
      console.error('Error initializing analytics:', error);
    }
  }

  // Definir ID do usuário
  async setUserId(userId: string): Promise<void> {
    try {
      this.userId = userId;
      await analytics().setUserId(userId);
    } catch (error) {
      console.error('Error setting user ID:', error);
    }
  }

  // Definir propriedades do usuário
  async setUserProperties(properties: UserProperties): Promise<void> {
    try {
      for (const [key, value] of Object.entries(properties)) {
        await analytics().setUserProperty(key, value);
      }
    } catch (error) {
      console.error('Error setting user properties:', error);
    }
  }

  // Rastrear evento genérico
  async trackEvent(eventName: string, parameters: Record<string, any> = {}): Promise<void> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      // Adicionar metadados padrão
      const enrichedParameters = {
        ...parameters,
        timestamp: Date.now(),
        platform: Platform.OS,
        user_id: this.userId,
      };

      await analytics().logEvent(eventName, enrichedParameters);
      console.log(`Analytics event tracked: ${eventName}`, enrichedParameters);
    } catch (error) {
      console.error(`Error tracking event ${eventName}:`, error);
    }
  }

  // Rastrear visualização de tela
  async trackScreenView(screenName: string, screenClass?: string): Promise<void> {
    try {
      await analytics().logScreenView({
        screen_name: screenName,
        screen_class: screenClass || screenName,
      });
    } catch (error) {
      console.error('Error tracking screen view:', error);
    }
  }

  // Eventos específicos do app

  // Navegação
  async trackAppOpen(): Promise<void> {
    await this.trackEvent('app_open', {
      method: 'direct'
    });
  }

  async trackSessionStart(): Promise<void> {
    await this.trackEvent('session_start', {
      session_id: Date.now().toString()
    });
  }

  // Busca
  async trackSearch(query: string, results: number, category?: string): Promise<void> {
    await this.trackEvent('search', {
      search_term: query,
      results_count: results,
      category: category || 'all',
      search_length: query.length
    });
  }

  async trackSearchResults(query: string, results: number): Promise<void> {
    await this.trackEvent('view_search_results', {
      search_term: query,
      results_count: results
    });
  }

  // Peças
  async trackPecaView(pecaId: string, categoria: string, nome: string): Promise<void> {
    await this.trackEvent('view_item', {
      item_id: pecaId,
      item_name: nome,
      item_category: categoria,
      content_type: 'peca'
    });
  }

  async trackPecasList(categoria?: string, count?: number): Promise<void> {
    await this.trackEvent('view_item_list', {
      item_list_name: categoria || 'all_pecas',
      item_count: count || 0,
      content_type: 'pecas'
    });
  }

  // Cores
  async trackCorView(codigo: string, nome: string, ano: string): Promise<void> {
    await this.trackEvent('view_item', {
      item_id: codigo,
      item_name: nome,
      item_category: 'cor_vw',
      content_type: 'cor',
      year: ano
    });
  }

  async trackColorTable(): Promise<void> {
    await this.trackEvent('view_color_table', {
      content_type: 'cores_vw'
    });
  }

  // Fusíveis
  async trackFusivelView(posicao: string, funcao: string, localizacao: string): Promise<void> {
    await this.trackEvent('view_item', {
      item_id: posicao,
      item_name: funcao,
      item_category: 'fusivel',
      content_type: 'fusivel',
      location: localizacao
    });
  }

  async trackFuseMap(mapType: string): Promise<void> {
    await this.trackEvent('view_fuse_map', {
      map_type: mapType,
      content_type: 'fusivel_map'
    });
  }

  // Compartilhamento
  async trackShare(contentType: string, method: string, itemId?: string): Promise<void> {
    await this.trackEvent('share', {
      content_type: contentType,
      method: method,
      item_id: itemId || 'unknown'
    });
  }

  async trackShareFromAlert(source: string): Promise<void> {
    await this.trackEvent('share_from_alert', {
      source: source,
      content_type: 'app'
    });
  }

  // Filtros
  async trackFilterUsage(filterType: string, filterValue: string, section: string): Promise<void> {
    await this.trackEvent('filter_applied', {
      filter_type: filterType,
      filter_value: filterValue,
      section: section
    });
  }

  // Engajamento
  async trackTimeSpent(screenName: string, timeInSeconds: number): Promise<void> {
    await this.trackEvent('time_spent', {
      screen_name: screenName,
      duration_seconds: timeInSeconds,
      duration_minutes: Math.round(timeInSeconds / 60)
    });
  }

  // Erros
  async trackError(errorType: string, errorMessage: string, context?: string): Promise<void> {
    await this.trackEvent('app_error', {
      error_type: errorType,
      error_message: errorMessage,
      context: context || 'unknown'
    });
  }

  // Proteção de conteúdo
  async trackContentViolation(violationType: string, context?: string): Promise<void> {
    await this.trackEvent('content_violation_attempt', {
      violation_type: violationType,
      context: context || 'unknown',
      user_agent: Platform.OS
    });
  }

  // Conversões e objetivos
  async trackGoalCompletion(goalName: string, value?: number): Promise<void> {
    await this.trackEvent('goal_completion', {
      goal_name: goalName,
      value: value || 1
    });
  }

  // Retenção
  async trackReturnUser(daysSinceLastVisit: number): Promise<void> {
    await this.trackEvent('return_user', {
      days_since_last_visit: daysSinceLastVisit,
      user_segment: daysSinceLastVisit <= 7 ? 'weekly_active' : 'monthly_active'
    });
  }

  // Funil de engajamento
  async trackFunnelStep(stepName: string, stepNumber: number, userId?: string): Promise<void> {
    await this.trackEvent('funnel_step', {
      step_name: stepName,
      step_number: stepNumber,
      user_id: userId || this.userId,
      funnel_name: 'user_engagement'
    });
  }

  // Conquistas/Gamificação
  async trackAchievement(achievementId: string, achievementName: string): Promise<void> {
    await this.trackEvent('unlock_achievement', {
      achievement_id: achievementId,
      achievement_name: achievementName
    });
  }

  // Referrals
  async trackReferral(referralCode: string, source?: string): Promise<void> {
    await this.trackEvent('referral_used', {
      referral_code: referralCode,
      referral_source: source || 'unknown'
    });
  }

  // Configurações
  async trackSettingChanged(settingName: string, oldValue: any, newValue: any): Promise<void> {
    await this.trackEvent('setting_changed', {
      setting_name: settingName,
      old_value: String(oldValue),
      new_value: String(newValue)
    });
  }

  // Métricas de performance
  async trackPerformanceMetric(metricName: string, value: number, unit: string): Promise<void> {
    await this.trackEvent('performance_metric', {
      metric_name: metricName,
      metric_value: value,
      metric_unit: unit
    });
  }

  // Batch tracking para múltiplos eventos
  async trackBatch(events: AnalyticsEvent[]): Promise<void> {
    for (const event of events) {
      await this.trackEvent(event.name, event.parameters);
    }
  }

  // Obter ID de sessão atual
  getCurrentSessionId(): string {
    return Date.now().toString();
  }

  // Verificar se analytics está habilitado
  async isAnalyticsEnabled(): Promise<boolean> {
    try {
      return await analytics().isSupported();
    } catch (error) {
      return false;
    }
  }

  // Desabilitar analytics (GDPR compliance)
  async disableAnalytics(): Promise<void> {
    try {
      await analytics().setAnalyticsCollectionEnabled(false);
      this.isInitialized = false;
    } catch (error) {
      console.error('Error disabling analytics:', error);
    }
  }

  // Habilitar analytics
  async enableAnalytics(): Promise<void> {
    try {
      await analytics().setAnalyticsCollectionEnabled(true);
      await this.initialize();
    } catch (error) {
      console.error('Error enabling analytics:', error);
    }
  }
}

export default AnalyticsService;