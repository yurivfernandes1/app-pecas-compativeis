// Interfaces para dados do app Golf MK3

export interface CompatibilidadeInfo {
  veiculo: string;
  modelo: string;
  observacoes?: string;
  ano_inicio?: number;
  ano_fim?: number;
}

export interface Peca {
  id: string;
  nome: string;
  categoria: 'motor' | 'freios' | 'suspensao' | 'eletrica' | 'carroceria' | 'outros';
  modelo_golf: ('GTI' | 'GL' | 'GLX')[];
  compativel_com: CompatibilidadeInfo[];
  preco_original?: string;
  preco_compativel?: string;
  observacoes?: string;
}

export interface Categoria {
  id: string;
  nome: string;
  icone: string;
  cor: string;
}

export interface PecasData {
  version: string;
  last_updated: string;
  categorias: Categoria[];
  pecas: Peca[];
}

export interface CorVW {
  codigo: string;
  nome: string;
  ano: string;
  imagem_url?: string;
  disponivel: boolean;
  tipo: 'solida' | 'metalica' | 'perolizada';
}

export interface CoresData {
  version: string;
  last_updated: string;
  anos: string[];
  cores: CorVW[];
}

export interface Fusivel {
  posicao: string;
  amperagem: string;
  funcao: string;
  tipo: 'fusivel' | 'rele';
  localizacao: 'caixa_principal' | 'caixa_reles';
  coordenadas?: {
    x: number;
    y: number;
  };
}

export interface MapaFusivel {
  tipo: 'caixa_principal' | 'caixa_reles';
  imagem: string;
  dimensoes: {
    width: number;
    height: number;
  };
}

export interface FusiveisData {
  version: string;
  last_updated: string;
  mapas: MapaFusivel[];
  fusiveis: Fusivel[];
}

// Tipos para busca e filtros
export interface SearchFilters {
  categoria?: string;
  modelo_golf?: string;
  texto?: string;
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  query: string;
  filters: SearchFilters;
}

// Tipos para analytics
export interface AnalyticsEvent {
  name: string;
  parameters: Record<string, any>;
  timestamp: number;
}

// Tipos para erros
export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  DATA_CORRUPTION = 'DATA_CORRUPTION',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  SCREENSHOT_VIOLATION = 'SCREENSHOT_VIOLATION',
  ANALYTICS_ERROR = 'ANALYTICS_ERROR'
}

export interface AppError {
  type: ErrorType;
  message: string;
  details?: any;
  timestamp: number;
  userId?: string;
}