import { useState, useEffect, useMemo } from 'react';
import { Peca, CorVW, Fusivel, SearchFilters } from '../types/data';
import SearchService from '../services/SearchService';

// Hook para busca de peças
export const usePecasSearch = (
  pecas: Peca[],
  initialQuery: string = '',
  initialFilters: SearchFilters = {}
) => {
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<SearchFilters>(initialFilters);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  const searchService = SearchService.getInstance();

  // Resultados da busca memoizados
  const searchResults = useMemo(() => {
    return searchService.searchPecas(pecas, query, filters);
  }, [pecas, query, filters, searchService]);

  // Sugestões memoizadas
  const searchSuggestions = useMemo(() => {
    if (query.length < 2) return [];
    return searchService.getSuggestions(pecas, query, 'pecas');
  }, [pecas, query, searchService]);

  // Atualizar sugestões quando query muda
  useEffect(() => {
    setSuggestions(searchSuggestions);
  }, [searchSuggestions]);

  const updateQuery = (newQuery: string) => {
    setQuery(newQuery);
  };

  const updateFilters = (newFilters: SearchFilters) => {
    setFilters(newFilters);
  };

  const clearSearch = () => {
    setQuery('');
    setFilters({});
    setSuggestions([]);
  };

  const applyFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const removeFilter = (key: keyof SearchFilters) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[key];
      return newFilters;
    });
  };

  return {
    query,
    filters,
    results: searchResults.items,
    totalResults: searchResults.total,
    suggestions,
    updateQuery,
    updateFilters,
    clearSearch,
    applyFilter,
    removeFilter,
    hasActiveFilters: Object.keys(filters).length > 0,
    hasResults: searchResults.items.length > 0
  };
};

// Hook para busca de cores
export const useCoresSearch = (
  cores: CorVW[],
  initialQuery: string = '',
  initialFilters: { ano?: string; tipo?: string } = {}
) => {
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState(initialFilters);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  const searchService = SearchService.getInstance();

  const searchResults = useMemo(() => {
    return searchService.searchCores(cores, query, filters);
  }, [cores, query, filters, searchService]);

  const searchSuggestions = useMemo(() => {
    if (query.length < 2) return [];
    return searchService.getSuggestions(cores, query, 'cores');
  }, [cores, query, searchService]);

  useEffect(() => {
    setSuggestions(searchSuggestions);
  }, [searchSuggestions]);

  const updateQuery = (newQuery: string) => {
    setQuery(newQuery);
  };

  const updateFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const clearSearch = () => {
    setQuery('');
    setFilters({});
    setSuggestions([]);
  };

  return {
    query,
    filters,
    results: searchResults.items,
    totalResults: searchResults.total,
    suggestions,
    updateQuery,
    updateFilters,
    clearSearch,
    hasActiveFilters: Object.keys(filters).length > 0,
    hasResults: searchResults.items.length > 0
  };
};

// Hook para busca de fusíveis
export const useFusiveisSearch = (
  fusiveis: Fusivel[],
  initialQuery: string = '',
  initialFilters: { localizacao?: string; tipo?: string } = {}
) => {
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState(initialFilters);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  const searchService = SearchService.getInstance();

  const searchResults = useMemo(() => {
    return searchService.searchFusiveis(fusiveis, query, filters);
  }, [fusiveis, query, filters, searchService]);

  const searchSuggestions = useMemo(() => {
    if (query.length < 2) return [];
    return searchService.getSuggestions(fusiveis, query, 'fusiveis');
  }, [fusiveis, query, searchService]);

  useEffect(() => {
    setSuggestions(searchSuggestions);
  }, [searchSuggestions]);

  const updateQuery = (newQuery: string) => {
    setQuery(newQuery);
  };

  const updateFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const clearSearch = () => {
    setQuery('');
    setFilters({});
    setSuggestions([]);
  };

  return {
    query,
    filters,
    results: searchResults.items,
    totalResults: searchResults.total,
    suggestions,
    updateQuery,
    updateFilters,
    clearSearch,
    hasActiveFilters: Object.keys(filters).length > 0,
    hasResults: searchResults.items.length > 0
  };
};

// Hook genérico para debounce
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};