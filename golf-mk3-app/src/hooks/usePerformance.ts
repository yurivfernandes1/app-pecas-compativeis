import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Platform, InteractionManager } from 'react-native';

// Hook para lazy loading de componentes
export const useLazyComponent = <T>(
  importFunction: () => Promise<{ default: T }>,
  fallback?: T
) => {
  const [Component, setComponent] = useState<T | null>(fallback || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadComponent = async () => {
      try {
        const module = await importFunction();
        if (mounted) {
          setComponent(module.default);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
          setLoading(false);
        }
      }
    };

    // Aguardar interações para carregar
    InteractionManager.runAfterInteractions(() => {
      loadComponent();
    });

    return () => {
      mounted = false;
    };
  }, [importFunction]);

  return { Component, loading, error };
};

// Hook para debounce
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

// Hook para throttle
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const lastRun = useRef(Date.now());

  return useCallback(
    ((...args) => {
      if (Date.now() - lastRun.current >= delay) {
        callback(...args);
        lastRun.current = Date.now();
      }
    }) as T,
    [callback, delay]
  );
};

// Hook para memoização com cache LRU
export const useMemoizedCache = <K, V>(maxSize: number = 100) => {
  const cache = useRef(new Map<K, V>());
  const accessOrder = useRef<K[]>([]);

  const get = useCallback((key: K): V | undefined => {
    const value = cache.current.get(key);
    if (value !== undefined) {
      // Mover para o final (mais recente)
      const index = accessOrder.current.indexOf(key);
      if (index > -1) {
        accessOrder.current.splice(index, 1);
      }
      accessOrder.current.push(key);
    }
    return value;
  }, []);

  const set = useCallback((key: K, value: V): void => {
    // Se já existe, atualizar
    if (cache.current.has(key)) {
      cache.current.set(key, value);
      const index = accessOrder.current.indexOf(key);
      if (index > -1) {
        accessOrder.current.splice(index, 1);
      }
      accessOrder.current.push(key);
      return;
    }

    // Se cache está cheio, remover o menos usado
    if (cache.current.size >= maxSize) {
      const leastUsed = accessOrder.current.shift();
      if (leastUsed !== undefined) {
        cache.current.delete(leastUsed);
      }
    }

    cache.current.set(key, value);
    accessOrder.current.push(key);
  }, [maxSize]);

  const clear = useCallback((): void => {
    cache.current.clear();
    accessOrder.current = [];
  }, []);

  const has = useCallback((key: K): boolean => {
    return cache.current.has(key);
  }, []);

  return { get, set, clear, has, size: cache.current.size };
};

// Hook para otimização de listas grandes
export const useVirtualizedList = <T>(
  data: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) => {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleRange = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(
      start + Math.ceil(containerHeight / itemHeight),
      data.length - 1
    );

    return {
      start: Math.max(0, start - overscan),
      end: Math.min(data.length - 1, end + overscan),
    };
  }, [scrollTop, itemHeight, containerHeight, data.length, overscan]);

  const visibleItems = useMemo(() => {
    return data.slice(visibleRange.start, visibleRange.end + 1);
  }, [data, visibleRange]);

  const totalHeight = data.length * itemHeight;
  const offsetY = visibleRange.start * itemHeight;

  return {
    visibleItems,
    totalHeight,
    offsetY,
    setScrollTop,
    visibleRange,
  };
};

// Hook para monitoramento de performance
export const usePerformanceMonitor = (componentName: string) => {
  const renderCount = useRef(0);
  const mountTime = useRef(Date.now());
  const lastRenderTime = useRef(Date.now());

  useEffect(() => {
    renderCount.current += 1;
    const now = Date.now();
    const timeSinceMount = now - mountTime.current;
    const timeSinceLastRender = now - lastRenderTime.current;
    
    if (__DEV__) {
      console.log(`[Performance] ${componentName}:`, {
        renderCount: renderCount.current,
        timeSinceMount,
        timeSinceLastRender,
      });
    }
    
    lastRenderTime.current = now;
  });

  const logPerformanceMetric = useCallback((metricName: string, value: number) => {
    if (__DEV__) {
      console.log(`[Performance] ${componentName}.${metricName}:`, value);
    }
  }, [componentName]);

  return { logPerformanceMetric };
};

// Hook para otimização de imagens
export const useImageOptimization = () => {
  const getOptimizedImageUri = useCallback((
    uri: string,
    width: number,
    height: number,
    quality: number = 80
  ): string => {
    // Para web, podemos usar parâmetros de query para otimização
    if (Platform.OS === 'web') {
      const url = new URL(uri);
      url.searchParams.set('w', width.toString());
      url.searchParams.set('h', height.toString());
      url.searchParams.set('q', quality.toString());
      return url.toString();
    }
    
    // Para mobile, retornar URI original (otimização seria feita no servidor)
    return uri;
  }, []);

  const preloadImage = useCallback((uri: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (Platform.OS === 'web') {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = uri;
      } else {
        // Para React Native, usar Image.prefetch
        // Image.prefetch(uri).then(resolve).catch(reject);
        resolve(); // Placeholder
      }
    });
  }, []);

  return { getOptimizedImageUri, preloadImage };
};

// Hook para bundle splitting e code splitting
export const useCodeSplitting = () => {
  const loadChunk = useCallback(async <T>(
    chunkLoader: () => Promise<T>
  ): Promise<T> => {
    try {
      // Aguardar interações antes de carregar
      await new Promise(resolve => {
        InteractionManager.runAfterInteractions(resolve);
      });
      
      return await chunkLoader();
    } catch (error) {
      console.error('Error loading chunk:', error);
      throw error;
    }
  }, []);

  return { loadChunk };
};

// Hook para otimização de re-renders
export const useStableCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T => {
  return useCallback(callback, deps);
};

// Hook para batching de updates
export const useBatchedUpdates = <T>(initialValue: T) => {
  const [value, setValue] = useState<T>(initialValue);
  const pendingUpdates = useRef<((prev: T) => T)[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const batchedSetValue = useCallback((updater: (prev: T) => T) => {
    pendingUpdates.current.push(updater);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setValue(currentValue => {
        let newValue = currentValue;
        pendingUpdates.current.forEach(update => {
          newValue = update(newValue);
        });
        pendingUpdates.current = [];
        return newValue;
      });
    }, 16); // ~60fps
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [value, batchedSetValue] as const;
};

// Hook para intersection observer (web only)
export const useIntersectionObserver = (
  options: IntersectionObserverInit = {}
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const elementRef = useRef<Element | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web' || !elementRef.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
      setEntry(entry);
    }, options);

    observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, [options]);

  return { isIntersecting, entry, elementRef };
};

// Utilitários de performance
export const PerformanceUtils = {
  // Medir tempo de execução
  measureTime: <T>(name: string, fn: () => T): T => {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    if (__DEV__) {
      console.log(`[Performance] ${name}: ${end - start}ms`);
    }
    
    return result;
  },

  // Aguardar próximo frame
  nextFrame: (): Promise<void> => {
    return new Promise(resolve => {
      if (Platform.OS === 'web') {
        requestAnimationFrame(() => resolve());
      } else {
        InteractionManager.runAfterInteractions(() => resolve());
      }
    });
  },

  // Chunked processing para evitar bloqueio da UI
  processInChunks: async <T, R>(
    items: T[],
    processor: (item: T) => R,
    chunkSize: number = 10
  ): Promise<R[]> => {
    const results: R[] = [];
    
    for (let i = 0; i < items.length; i += chunkSize) {
      const chunk = items.slice(i, i + chunkSize);
      const chunkResults = chunk.map(processor);
      results.push(...chunkResults);
      
      // Aguardar próximo frame para não bloquear UI
      await PerformanceUtils.nextFrame();
    }
    
    return results;
  },
};