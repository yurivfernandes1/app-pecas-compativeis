import Share from 'react-native-share';
import { Peca, CorVW, Fusivel } from '../types/data';

interface ShareOptions {
  type: 'peca' | 'cor' | 'fusivel' | 'app';
  id?: string;
  data?: Peca | CorVW | Fusivel;
  customMessage?: string;
}

class ShareService {
  private static instance: ShareService;
  private baseUrl = 'https://app.falandodegti.com.br';

  private constructor() {}

  static getInstance(): ShareService {
    if (!ShareService.instance) {
      ShareService.instance = new ShareService();
    }
    return ShareService.instance;
  }

  // Compartilhar peça
  async sharePeca(peca: Peca, customMessage?: string): Promise<boolean> {
    try {
      const url = this.generatePecaUrl(peca.id);
      const message = customMessage || this.generatePecaMessage(peca);
      
      const shareOptions = {
        title: 'Peça Compatível Golf MK3',
        message: `${message}\n\n${url}`,
        url: url,
        subject: `Peça compatível: ${peca.nome}`,
      };

      const result = await Share.open(shareOptions);
      
      // Track compartilhamento
      this.trackShare('peca', peca.id, result.app || 'unknown');
      
      return result.success || false;
    } catch (error) {
      console.error('Erro ao compartilhar peça:', error);
      return false;
    }
  }

  // Compartilhar cor
  async shareCor(cor: CorVW, customMessage?: string): Promise<boolean> {
    try {
      const url = this.generateCorUrl(cor.codigo);
      const message = customMessage || this.generateCorMessage(cor);
      
      const shareOptions = {
        title: 'Cor VW Golf MK3',
        message: `${message}\n\n${url}`,
        url: url,
        subject: `Cor VW: ${cor.codigo} - ${cor.nome}`,
      };

      const result = await Share.open(shareOptions);
      
      // Track compartilhamento
      this.trackShare('cor', cor.codigo, result.app || 'unknown');
      
      return result.success || false;
    } catch (error) {
      console.error('Erro ao compartilhar cor:', error);
      return false;
    }
  }

  // Compartilhar fusível
  async shareFusivel(fusivel: Fusivel, customMessage?: string): Promise<boolean> {
    try {
      const url = this.generateFusivelUrl(fusivel.posicao, fusivel.localizacao);
      const message = customMessage || this.generateFusivelMessage(fusivel);
      
      const shareOptions = {
        title: 'Fusível Golf MK3',
        message: `${message}\n\n${url}`,
        url: url,
        subject: `Fusível ${fusivel.posicao}: ${fusivel.funcao}`,
      };

      const result = await Share.open(shareOptions);
      
      // Track compartilhamento
      this.trackShare('fusivel', `${fusivel.localizacao}-${fusivel.posicao}`, result.app || 'unknown');
      
      return result.success || false;
    } catch (error) {
      console.error('Erro ao compartilhar fusível:', error);
      return false;
    }
  }

  // Compartilhar app
  async shareApp(customMessage?: string): Promise<boolean> {
    try {
      const message = customMessage || this.generateAppMessage();
      
      const shareOptions = {
        title: 'App Peças Compatíveis Golf MK3',
        message: `${message}\n\n${this.baseUrl}`,
        url: this.baseUrl,
        subject: 'Confira este app para Golf MK3!',
      };

      const result = await Share.open(shareOptions);
      
      // Track compartilhamento
      this.trackShare('app', 'general', result.app || 'unknown');
      
      return result.success || false;
    } catch (error) {
      console.error('Erro ao compartilhar app:', error);
      return false;
    }
  }

  // Compartilhar com opções específicas de plataforma
  async shareToSpecificPlatform(
    platform: 'whatsapp' | 'telegram' | 'instagram' | 'facebook',
    options: ShareOptions
  ): Promise<boolean> {
    try {
      let shareOptions: any = {};
      
      switch (options.type) {
        case 'peca':
          const peca = options.data as Peca;
          shareOptions = {
            title: 'Peça Compatível Golf MK3',
            message: `${this.generatePecaMessage(peca)}\n\n${this.generatePecaUrl(peca.id)}`,
            social: this.getPlatformKey(platform),
          };
          break;
          
        case 'cor':
          const cor = options.data as CorVW;
          shareOptions = {
            title: 'Cor VW Golf MK3',
            message: `${this.generateCorMessage(cor)}\n\n${this.generateCorUrl(cor.codigo)}`,
            social: this.getPlatformKey(platform),
          };
          break;
          
        case 'fusivel':
          const fusivel = options.data as Fusivel;
          shareOptions = {
            title: 'Fusível Golf MK3',
            message: `${this.generateFusivelMessage(fusivel)}\n\n${this.generateFusivelUrl(fusivel.posicao, fusivel.localizacao)}`,
            social: this.getPlatformKey(platform),
          };
          break;
          
        case 'app':
          shareOptions = {
            title: 'App Peças Compatíveis Golf MK3',
            message: `${this.generateAppMessage()}\n\n${this.baseUrl}`,
            social: this.getPlatformKey(platform),
          };
          break;
      }

      const result = await Share.shareSingle(shareOptions);
      
      // Track compartilhamento específico
      this.trackShare(options.type, options.id || 'unknown', platform);
      
      return result.success || false;
    } catch (error) {
      console.error(`Erro ao compartilhar no ${platform}:`, error);
      return false;
    }
  }

  // Gerar URLs específicas
  private generatePecaUrl(pecaId: string): string {
    return `${this.baseUrl}/peca/${pecaId}`;
  }

  private generateCorUrl(corCodigo: string): string {
    return `${this.baseUrl}/cor/${corCodigo}`;
  }

  private generateFusivelUrl(posicao: string, localizacao: string): string {
    return `${this.baseUrl}/fusivel/${localizacao}/${posicao}`;
  }

  // Gerar mensagens personalizadas
  private generatePecaMessage(peca: Peca): string {
    const compatibilidades = peca.compativel_com
      .slice(0, 2)
      .map(comp => `${comp.veiculo} ${comp.modelo}`)
      .join(', ');
    
    return `🔧 Encontrei essa peça compatível para Golf MK3!\n\n` +
           `📦 ${peca.nome}\n` +
           `🚗 Compatível com: ${compatibilidades}${peca.compativel_com.length > 2 ? ' e mais...' : ''}\n\n` +
           `Confira no app Falando de GTI:`;
  }

  private generateCorMessage(cor: CorVW): string {
    return `🎨 Código de cor VW encontrado!\n\n` +
           `🏷️ ${cor.codigo} - ${cor.nome}\n` +
           `📅 Ano: ${cor.ano}\n` +
           `✨ Tipo: ${cor.tipo.charAt(0).toUpperCase() + cor.tipo.slice(1)}\n\n` +
           `Confira mais cores no app Falando de GTI:`;
  }

  private generateFusivelMessage(fusivel: Fusivel): string {
    return `⚡ Informação sobre fusível Golf MK3!\n\n` +
           `📍 Posição: ${fusivel.posicao}\n` +
           `🔌 ${fusivel.amperagem}\n` +
           `⚙️ Função: ${fusivel.funcao}\n\n` +
           `Veja o mapa completo no app Falando de GTI:`;
  }

  private generateAppMessage(): string {
    return `🚗 Descobri este app incrível para Golf MK3!\n\n` +
           `✅ Peças compatíveis com preços\n` +
           `🎨 Tabela completa de cores VW\n` +
           `⚡ Mapa interativo de fusíveis\n\n` +
           `Desenvolvido por Falando de GTI:`;
  }

  // Mapear plataformas para chaves do react-native-share
  private getPlatformKey(platform: string): string {
    const platformMap: Record<string, string> = {
      'whatsapp': Share.Social.WHATSAPP,
      'telegram': Share.Social.TELEGRAM,
      'instagram': Share.Social.INSTAGRAM,
      'facebook': Share.Social.FACEBOOK,
    };
    
    return platformMap[platform] || Share.Social.WHATSAPP;
  }

  // Track compartilhamentos (integrar com analytics depois)
  private trackShare(type: string, id: string, platform: string): void {
    console.log('Share tracked:', { type, id, platform, timestamp: Date.now() });
    
    // TODO: Integrar com AnalyticsService quando implementado
    // AnalyticsService.trackShare(type, platform, id);
  }

  // Verificar se plataforma está disponível
  async isPlatformAvailable(platform: string): Promise<boolean> {
    try {
      const platformKey = this.getPlatformKey(platform);
      return await Share.isPackageInstalled(platformKey);
    } catch (error) {
      return false;
    }
  }

  // Obter plataformas disponíveis
  async getAvailablePlatforms(): Promise<string[]> {
    const platforms = ['whatsapp', 'telegram', 'instagram', 'facebook'];
    const available: string[] = [];
    
    for (const platform of platforms) {
      if (await this.isPlatformAvailable(platform)) {
        available.push(platform);
      }
    }
    
    return available;
  }

  // Gerar link de referral
  generateReferralLink(userId?: string): string {
    const referralCode = userId ? `GTI${userId.slice(-6)}` : 'GTIAPP';
    return `${this.baseUrl}?ref=${referralCode}`;
  }

  // Compartilhar com código de referral
  async shareWithReferral(userId?: string, customMessage?: string): Promise<boolean> {
    try {
      const referralUrl = this.generateReferralLink(userId);
      const message = customMessage || 
        `🚗 Confira este app incrível para Golf MK3!\n\n` +
        `Desenvolvido por Falando de GTI com muito carinho para a comunidade VW.\n\n` +
        `${referralUrl}`;
      
      const shareOptions = {
        title: 'App Peças Compatíveis Golf MK3',
        message: message,
        url: referralUrl,
      };

      const result = await Share.open(shareOptions);
      
      // Track referral share
      this.trackShare('referral', userId || 'anonymous', result.app || 'unknown');
      
      return result.success || false;
    } catch (error) {
      console.error('Erro ao compartilhar com referral:', error);
      return false;
    }
  }
}

export default ShareService;