export interface Peca {
  id: string;
  nome: string;
  categoria: string;
  veiculosCompativeis: string[];
  observacoes?: string;
  codigo?: string;
}

export interface CategoriaPecas {
  [categoria: string]: {
    [nomePeca: string]: string[];
  };
}

export interface FusilRele {
  funcao: string;
  amperagem: number | null;
}

export interface MapaFusiveis {
  fusiveis: { [posicao: string]: FusilRele };
  reles: { [posicao: string]: string };
}

export interface CorVW {
  codigo: string;
  nome: string;
  ano: string;
  imagemUrl?: string;
  marca: string;
}

export interface SearchFilters {
  categoria?: string;
  veiculo?: string;
  termo?: string;
}

export interface Analytics {
  trackEvent: (eventName: string, parameters?: Record<string, any>) => void;
  trackPageView: (pageName: string) => void;
}
