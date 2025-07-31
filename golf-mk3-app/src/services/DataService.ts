import AsyncStorage from '@react-native-async-storage/async-storage';
import { PecasData, CoresData, FusiveisData } from '../types/data';

class DataService {
  private static instance: DataService;
  private pecasData: PecasData | null = null;
  private coresData: CoresData | null = null;
  private fusiveisData: FusiveisData | null = null;

  private constructor() {}

  static getInstance(): DataService {
    if (!DataService.instance) {
      DataService.instance = new DataService();
    }
    return DataService.instance;
  }

  // Carregar dados de peças
  async loadPecasData(): Promise<PecasData> {
    if (this.pecasData) {
      return this.pecasData;
    }

    try {
      // Tentar carregar do cache primeiro
      const cachedData = await AsyncStorage.getItem('pecas_data');
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        if (this.validateDataIntegrity(parsed, 'pecas')) {
          this.pecasData = parsed;
          return this.pecasData;
        }
      }

      // Carregar dados do arquivo local
      const data = require('../data/pecas.json') as PecasData;
      
      if (this.validateDataIntegrity(data, 'pecas')) {
        this.pecasData = data;
        // Cache os dados
        await AsyncStorage.setItem('pecas_data', JSON.stringify(data));
        return this.pecasData;
      } else {
        throw new Error('Dados de peças corrompidos');
      }
    } catch (error) {
      console.error('Erro ao carregar dados de peças:', error);
      throw error;
    }
  }

  // Carregar dados de cores
  async loadCoresData(): Promise<CoresData> {
    if (this.coresData) {
      return this.coresData;
    }

    try {
      const cachedData = await AsyncStorage.getItem('cores_data');
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        if (this.validateDataIntegrity(parsed, 'cores')) {
          this.coresData = parsed;
          return this.coresData;
        }
      }

      const data = require('../data/cores.json') as CoresData;
      
      if (this.validateDataIntegrity(data, 'cores')) {
        this.coresData = data;
        await AsyncStorage.setItem('cores_data', JSON.stringify(data));
        return this.coresData;
      } else {
        throw new Error('Dados de cores corrompidos');
      }
    } catch (error) {
      console.error('Erro ao carregar dados de cores:', error);
      throw error;
    }
  }

  // Carregar dados de fusíveis
  async loadFusiveisData(): Promise<FusiveisData> {
    if (this.fusiveisData) {
      return this.fusiveisData;
    }

    try {
      const cachedData = await AsyncStorage.getItem('fusiveis_data');
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        if (this.validateDataIntegrity(parsed, 'fusiveis')) {
          this.fusiveisData = parsed;
          return this.fusiveisData;
        }
      }

      const data = require('../data/fusiveis.json') as FusiveisData;
      
      if (this.validateDataIntegrity(data, 'fusiveis')) {
        this.fusiveisData = data;
        await AsyncStorage.setItem('fusiveis_data', JSON.stringify(data));
        return this.fusiveisData;
      } else {
        throw new Error('Dados de fusíveis corrompidos');
      }
    } catch (error) {
      console.error('Erro ao carregar dados de fusíveis:', error);
      throw error;
    }
  }

  // Validar integridade dos dados
  private validateDataIntegrity(data: any, type: 'pecas' | 'cores' | 'fusiveis'): boolean {
    try {
      switch (type) {
        case 'pecas':
          return data && 
                 data.version && 
                 Array.isArray(data.pecas) && 
                 Array.isArray(data.categorias);
        case 'cores':
          return data && 
                 data.version && 
                 Array.isArray(data.cores) && 
                 Array.isArray(data.anos);
        case 'fusiveis':
          return data && 
                 data.version && 
                 Array.isArray(data.fusiveis) && 
                 Array.isArray(data.mapas);
        default:
          return false;
      }
    } catch (error) {
      return false;
    }
  }

  // Gerar hash para validação (implementação simples)
  private generateHash(data: string): string {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString();
  }

  // Limpar cache
  async clearCache(): Promise<void> {
    try {
      await AsyncStorage.multiRemove(['pecas_data', 'cores_data', 'fusiveis_data']);
      this.pecasData = null;
      this.coresData = null;
      this.fusiveisData = null;
    } catch (error) {
      console.error('Erro ao limpar cache:', error);
    }
  }

  // Verificar se dados estão em cache
  async isCached(type: 'pecas' | 'cores' | 'fusiveis'): Promise<boolean> {
    try {
      const key = `${type}_data`;
      const data = await AsyncStorage.getItem(key);
      return data !== null;
    } catch (error) {
      return false;
    }
  }

  // Obter informações de versão
  getVersionInfo(): { pecas?: string; cores?: string; fusiveis?: string } {
    return {
      pecas: this.pecasData?.version,
      cores: this.coresData?.version,
      fusiveis: this.fusiveisData?.version
    };
  }
}

export default DataService;