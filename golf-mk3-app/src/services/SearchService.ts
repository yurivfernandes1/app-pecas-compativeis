import { Peca, CorVW, Fusivel, SearchFilters, SearchResult } from '../types/data';

class SearchService {
  private static instance: SearchService;

  private constructor() {}

  static getInstance(): SearchService {
    if (!SearchService.instance) {
      SearchService.instance = new SearchService();
    }
    return SearchService.instance;
  }

  // Busca em peças
  searchPecas(
    pecas: Peca[], 
    query: string, 
    filters: SearchFilters = {}
  ): SearchResult<Peca> {
    let filtered = [...pecas];

    // Aplicar filtros
    if (filters.categoria) {
      filtered = filtered.filter(peca => peca.categoria === filters.categoria);
    }

    if (filters.modelo_golf) {
      filtered = filtered.filter(peca => 
        peca.modelo_golf.includes(filters.modelo_golf as any)
      );
    }

    // Aplicar busca textual
    if (query.trim()) {
      filtered = this.filterPecasByText(filtered, query);
    }

    return {
      items: filtered,
      total: filtered.length,
      query,
      filters
    };
  }

  // Busca fuzzy em peças
  private filterPecasByText(pecas: Peca[], query: string): Peca[] {
    const normalizedQuery = this.normalizeText(query);
    const queryWords = normalizedQuery.split(' ').filter(word => word.length > 0);

    return pecas.filter(peca => {
      // Buscar no nome da peça
      const normalizedName = this.normalizeText(peca.nome);
      if (this.fuzzyMatch(normalizedName, normalizedQuery)) {
        return true;
      }

      // Buscar em cada palavra do nome
      if (queryWords.some(word => normalizedName.includes(word))) {
        return true;
      }

      // Buscar em compatibilidade
      const hasCompatibilityMatch = peca.compativel_com.some(comp => {
        const normalizedVeiculo = this.normalizeText(comp.veiculo);
        const normalizedModelo = this.normalizeText(comp.modelo);
        const normalizedObservacoes = this.normalizeText(comp.observacoes || '');

        return this.fuzzyMatch(normalizedVeiculo, normalizedQuery) ||
               this.fuzzyMatch(normalizedModelo, normalizedQuery) ||
               this.fuzzyMatch(normalizedObservacoes, normalizedQuery) ||
               queryWords.some(word => 
                 normalizedVeiculo.includes(word) ||
                 normalizedModelo.includes(word) ||
                 normalizedObservacoes.includes(word)
               );
      });

      if (hasCompatibilityMatch) {
        return true;
      }

      // Buscar em observações da peça
      if (peca.observacoes) {
        const normalizedObservacoes = this.normalizeText(peca.observacoes);
        if (this.fuzzyMatch(normalizedObservacoes, normalizedQuery) ||
            queryWords.some(word => normalizedObservacoes.includes(word))) {
          return true;
        }
      }

      return false;
    });
  }

  // Busca em cores
  searchCores(
    cores: CorVW[], 
    query: string, 
    filters: { ano?: string; tipo?: string } = {}
  ): SearchResult<CorVW> {
    let filtered = [...cores];

    // Aplicar filtros
    if (filters.ano) {
      filtered = filtered.filter(cor => cor.ano === filters.ano);
    }

    if (filters.tipo) {
      filtered = filtered.filter(cor => cor.tipo === filters.tipo);
    }

    // Aplicar busca textual
    if (query.trim()) {
      filtered = this.filterCoresByText(filtered, query);
    }

    return {
      items: filtered,
      total: filtered.length,
      query,
      filters
    };
  }

  private filterCoresByText(cores: CorVW[], query: string): CorVW[] {
    const normalizedQuery = this.normalizeText(query);
    const queryWords = normalizedQuery.split(' ').filter(word => word.length > 0);

    return cores.filter(cor => {
      const normalizedCodigo = this.normalizeText(cor.codigo);
      const normalizedNome = this.normalizeText(cor.nome);

      // Busca exata no código (prioridade)
      if (normalizedCodigo.includes(normalizedQuery)) {
        return true;
      }

      // Busca fuzzy no nome
      if (this.fuzzyMatch(normalizedNome, normalizedQuery)) {
        return true;
      }

      // Busca por palavras
      return queryWords.some(word => 
        normalizedCodigo.includes(word) ||
        normalizedNome.includes(word)
      );
    });
  }

  // Busca em fusíveis
  searchFusiveis(
    fusiveis: Fusivel[], 
    query: string, 
    filters: { localizacao?: string; tipo?: string } = {}
  ): SearchResult<Fusivel> {
    let filtered = [...fusiveis];

    // Aplicar filtros
    if (filters.localizacao) {
      filtered = filtered.filter(fusivel => fusivel.localizacao === filters.localizacao);
    }

    if (filters.tipo) {
      filtered = filtered.filter(fusivel => fusivel.tipo === filters.tipo);
    }

    // Aplicar busca textual
    if (query.trim()) {
      filtered = this.filterFusiveisByText(filtered, query);
    }

    return {
      items: filtered,
      total: filtered.length,
      query,
      filters
    };
  }

  private filterFusiveisByText(fusiveis: Fusivel[], query: string): Fusivel[] {
    const normalizedQuery = this.normalizeText(query);
    const queryWords = normalizedQuery.split(' ').filter(word => word.length > 0);

    return fusiveis.filter(fusivel => {
      const normalizedPosicao = this.normalizeText(fusivel.posicao);
      const normalizedFuncao = this.normalizeText(fusivel.funcao);
      const normalizedAmperagem = this.normalizeText(fusivel.amperagem);

      // Busca exata na posição
      if (normalizedPosicao.includes(normalizedQuery)) {
        return true;
      }

      // Busca na função
      if (this.fuzzyMatch(normalizedFuncao, normalizedQuery)) {
        return true;
      }

      // Busca na amperagem
      if (normalizedAmperagem.includes(normalizedQuery)) {
        return true;
      }

      // Busca por palavras
      return queryWords.some(word => 
        normalizedPosicao.includes(word) ||
        normalizedFuncao.includes(word) ||
        normalizedAmperagem.includes(word)
      );
    });
  }

  // Normalizar texto para busca
  private normalizeText(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^\w\s]/g, ' ') // Remove pontuação
      .replace(/\s+/g, ' ') // Normaliza espaços
      .trim();
  }

  // Busca fuzzy simples
  private fuzzyMatch(text: string, query: string, threshold: number = 0.6): boolean {
    if (text.includes(query)) {
      return true;
    }

    // Calcular similaridade usando Levenshtein distance simplificada
    const similarity = this.calculateSimilarity(text, query);
    return similarity >= threshold;
  }

  // Calcular similaridade entre strings
  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) {
      return 1.0;
    }
    
    const distance = this.levenshteinDistance(longer, shorter);
    return (longer.length - distance) / longer.length;
  }

  // Distância de Levenshtein simplificada
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  // Obter sugestões de busca
  getSuggestions(
    items: (Peca | CorVW | Fusivel)[], 
    query: string, 
    type: 'pecas' | 'cores' | 'fusiveis'
  ): string[] {
    if (!query.trim()) {
      return [];
    }

    const normalizedQuery = this.normalizeText(query);
    const suggestions = new Set<string>();

    items.forEach(item => {
      if (type === 'pecas') {
        const peca = item as Peca;
        if (this.normalizeText(peca.nome).includes(normalizedQuery)) {
          suggestions.add(peca.nome);
        }
        peca.compativel_com.forEach(comp => {
          if (this.normalizeText(comp.veiculo).includes(normalizedQuery)) {
            suggestions.add(comp.veiculo);
          }
          if (this.normalizeText(comp.modelo).includes(normalizedQuery)) {
            suggestions.add(`${comp.veiculo} ${comp.modelo}`);
          }
        });
      } else if (type === 'cores') {
        const cor = item as CorVW;
        if (this.normalizeText(cor.codigo).includes(normalizedQuery)) {
          suggestions.add(cor.codigo);
        }
        if (this.normalizeText(cor.nome).includes(normalizedQuery)) {
          suggestions.add(cor.nome);
        }
      } else if (type === 'fusiveis') {
        const fusivel = item as Fusivel;
        if (this.normalizeText(fusivel.posicao).includes(normalizedQuery)) {
          suggestions.add(fusivel.posicao);
        }
        if (this.normalizeText(fusivel.funcao).includes(normalizedQuery)) {
          suggestions.add(fusivel.funcao);
        }
      }
    });

    return Array.from(suggestions).slice(0, 5); // Limitar a 5 sugestões
  }
}

export default SearchService;