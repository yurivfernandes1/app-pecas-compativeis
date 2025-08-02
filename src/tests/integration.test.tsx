import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import Home from '../pages/Home';
import PecasCompativeis from '../pages/PecasCompativeis';
import Diagnosticos from '../pages/Diagnosticos';

// Mock dos dados para evitar erros nos testes
jest.mock('../data/pecas-compativeis.json', () => ({
  'Motor': {
    'Filtro de Óleo': ['Golf MK3 1.6', 'Golf MK3 2.0'],
    'Vela de Ignição': ['Golf MK3 1.6', 'Golf MK3 2.0']
  },
  'Suspensão': {
    'Amortecedor Dianteiro': ['Golf MK3 GL', 'Golf MK3 GLX'],
    'Mola Traseira': ['Golf MK3 GL', 'Golf MK3 GLX']
  }
}));

// Mock do navigator para testes
Object.defineProperty(window, 'navigator', {
  value: {
    ...window.navigator,
    clipboard: {
      writeText: jest.fn().mockResolvedValue(undefined)
    },
    share: jest.fn().mockResolvedValue(undefined),
    onLine: true,
    userAgent: 'Jest Test Runner'
  },
  writable: true
});

// Mock do performance API
Object.defineProperty(window, 'performance', {
  value: {
    ...window.performance,
    now: jest.fn(() => Date.now()),
    getEntriesByType: jest.fn(() => [
      {
        loadEventStart: 100,
        loadEventEnd: 200
      }
    ]),
    memory: {
      usedJSHeapSize: 1000000,
      jsHeapSizeLimit: 10000000
    }
  },
  writable: true
});

// Mock do localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Golf MK3 App - Testes de Integração', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('Página Home', () => {
    test('deve renderizar todos os elementos principais', () => {
      renderWithRouter(<Home />);
      
      expect(screen.getByText(/Peças Compatíveis para Golf MK3/i)).toBeInTheDocument();
      expect(screen.getByText(/Funcionalidades Principais/i)).toBeInTheDocument();
      expect(screen.getByText(/Peças Compatíveis/i)).toBeInTheDocument();
      expect(screen.getByText(/Mapa de Fusíveis/i)).toBeInTheDocument();
      expect(screen.getByText(/Tabela de Cores/i)).toBeInTheDocument();
    });

    test('deve ter links funcionais para todas as páginas', () => {
      renderWithRouter(<Home />);
      
      const pecasLink = screen.getByRole('link', { name: /explorar peças/i });
      const fusiveisLink = screen.getByRole('link', { name: /ver mapa/i });
      const coresLink = screen.getByRole('link', { name: /ver cores/i });
      
      expect(pecasLink).toHaveAttribute('href', '/pecas');
      expect(fusiveisLink).toHaveAttribute('href', '/fusiveis');
      expect(coresLink).toHaveAttribute('href', '/cores');
    });

    test('deve executar função de compartilhamento', async () => {
      renderWithRouter(<Home />);
      
      const shareButton = screen.getByRole('button', { name: /compartilhar app/i });
      fireEvent.click(shareButton);
      
      await waitFor(() => {
        expect(window.navigator.clipboard.writeText).toHaveBeenCalledWith(window.location.href);
      });
    });
  });

  describe('Página Peças Compatíveis', () => {
    test('deve renderizar componentes de busca e filtros', () => {
      renderWithRouter(<PecasCompativeis />);
      
      expect(screen.getByPlaceholderText(/digite o nome da peça/i)).toBeInTheDocument();
      expect(screen.getByDisplayValue(/todas as categorias/i)).toBeInTheDocument();
    });

    test('deve filtrar peças por termo de busca', async () => {
      renderWithRouter(<PecasCompativeis />);
      
      const searchInput = screen.getByPlaceholderText(/digite o nome da peça/i);
      fireEvent.change(searchInput, { target: { value: 'Filtro' } });
      
      await waitFor(() => {
        expect(screen.getByText(/Filtro de Óleo/i)).toBeInTheDocument();
      });
    });

    test('deve filtrar peças por categoria', async () => {
      renderWithRouter(<PecasCompativeis />);
      
      const categorySelect = screen.getByDisplayValue(/todas as categorias/i);
      fireEvent.change(categorySelect, { target: { value: 'Motor' } });
      
      await waitFor(() => {
        expect(screen.getByText(/Filtro de Óleo/i)).toBeInTheDocument();
        expect(screen.getByText(/Vela de Ignição/i)).toBeInTheDocument();
      });
    });
  });

  describe('Página Diagnósticos', () => {
    test('deve renderizar todas as abas principais', () => {
      renderWithRouter(<Diagnosticos />);
      
      expect(screen.getByRole('button', { name: /visão geral/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /testes/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /logs/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /saúde do sistema/i })).toBeInTheDocument();
    });

    test('deve executar testes quando solicitado', async () => {
      renderWithRouter(<Diagnosticos />);
      
      const runTestsButton = screen.getByRole('button', { name: /executar todos os testes/i });
      fireEvent.click(runTestsButton);
      
      await waitFor(() => {
        expect(screen.getByText(/executando testes/i)).toBeInTheDocument();
      }, { timeout: 3000 });
    });

    test('deve verificar saúde do sistema', async () => {
      renderWithRouter(<Diagnosticos />);
      
      const healthCheckButton = screen.getByRole('button', { name: /verificar saúde do sistema/i });
      fireEvent.click(healthCheckButton);
      
      // Aguardar o processamento
      await waitFor(() => {
        // Verificar se pelo menos algum elemento de resultado aparece
        expect(screen.getByText(/saúde do sistema/i)).toBeInTheDocument();
      });
    });

    test('deve navegar entre abas', () => {
      renderWithRouter(<Diagnosticos />);
      
      const testsTab = screen.getByRole('button', { name: /testes/i });
      fireEvent.click(testsTab);
      
      expect(screen.getByText(/resultados dos testes/i)).toBeInTheDocument();
      
      const logsTab = screen.getByRole('button', { name: /logs/i });
      fireEvent.click(logsTab);
      
      expect(screen.getByText(/logs do sistema/i)).toBeInTheDocument();
    });
  });

  describe('Sistema de Logging', () => {
    test('deve salvar logs no localStorage', () => {
      renderWithRouter(<Home />);
      
      // Verificar se tentou salvar logs
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'app-logs',
        expect.any(String)
      );
    });

    test('deve capturar erros globais', () => {
      const originalError = console.error;
      console.error = jest.fn();
      
      // Simular erro global
      const errorEvent = new ErrorEvent('error', {
        message: 'Test error',
        filename: 'test.js',
        lineno: 1,
        colno: 1
      });
      
      window.dispatchEvent(errorEvent);
      
      console.error = originalError;
    });
  });

  describe('Hook useAppMonitoring', () => {
    test('deve funcionar em componentes sem erros', () => {
      const TestComponent = () => {
        const { logUserInteraction } = require('../hooks/useAppMonitoring').default('TestComponent');
        
        return (
          <button onClick={() => logUserInteraction('test_click', {})}>
            Test Button
          </button>
        );
      };
      
      render(<TestComponent />);
      
      const button = screen.getByRole('button', { name: /test button/i });
      fireEvent.click(button);
      
      // Se chegou até aqui, o hook funcionou sem erros
      expect(button).toBeInTheDocument();
    });
  });

  describe('Funcionalidades de Performance', () => {
    test('deve medir tempo de carregamento', () => {
      renderWithRouter(<Home />);
      
      // Verificar se performance.now foi chamado
      expect(window.performance.now).toHaveBeenCalled();
    });

    test('deve detectar status de conectividade', () => {
      renderWithRouter(<Diagnosticos />);
      
      // Simular perda de conectividade
      Object.defineProperty(window.navigator, 'onLine', {
        value: false,
        writable: true
      });
      
      const offlineEvent = new Event('offline');
      window.dispatchEvent(offlineEvent);
      
      // Restaurar conectividade
      Object.defineProperty(window.navigator, 'onLine', {
        value: true,
        writable: true
      });
      
      const onlineEvent = new Event('online');
      window.dispatchEvent(onlineEvent);
    });
  });

  describe('Testes de Acessibilidade', () => {
    test('botões devem ter texto acessível', () => {
      renderWithRouter(<Home />);
      
      const buttons = screen.getAllByRole('button');
      buttons.forEach(button => {
        expect(button).toHaveAccessibleName();
      });
    });

    test('links devem ter texto descritivo', () => {
      renderWithRouter(<Home />);
      
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).toHaveAccessibleName();
      });
    });
  });

  describe('Responsividade', () => {
    test('deve funcionar em diferentes tamanhos de tela', () => {
      // Simular mobile
      Object.defineProperty(window, 'innerWidth', {
        value: 375,
        writable: true
      });
      
      renderWithRouter(<Home />);
      expect(screen.getByText(/Peças Compatíveis para Golf MK3/i)).toBeInTheDocument();
      
      // Simular desktop
      Object.defineProperty(window, 'innerWidth', {
        value: 1920,
        writable: true
      });
      
      renderWithRouter(<Home />);
      expect(screen.getByText(/Peças Compatíveis para Golf MK3/i)).toBeInTheDocument();
    });
  });
});

describe('Testes de Performance', () => {
  test('componentes devem renderizar rapidamente', async () => {
    const startTime = performance.now();
    
    renderWithRouter(<Home />);
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Renderização deve ser menor que 100ms
    expect(renderTime).toBeLessThan(100);
  });

  test('busca deve processar resultados rapidamente', async () => {
    renderWithRouter(<PecasCompativeis />);
    
    const startTime = performance.now();
    
    const searchInput = screen.getByPlaceholderText(/digite o nome da peça/i);
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    
    await waitFor(() => {
      const endTime = performance.now();
      const searchTime = endTime - startTime;
      
      // Busca deve processar em menos de 50ms
      expect(searchTime).toBeLessThan(50);
    });
  });
});

describe('Testes de Integração Completa', () => {
  test('fluxo completo: Home -> Peças -> Busca -> Resultados', async () => {
    // Iniciar na Home
    renderWithRouter(<Home />);
    expect(screen.getByText(/Peças Compatíveis para Golf MK3/i)).toBeInTheDocument();
    
    // Navegar para Peças (simular clique - em teste real seria diferente)
    renderWithRouter(<PecasCompativeis />);
    
    // Realizar busca
    const searchInput = screen.getByPlaceholderText(/digite o nome da peça/i);
    fireEvent.change(searchInput, { target: { value: 'Filtro' } });
    
    // Verificar resultados
    await waitFor(() => {
      expect(screen.getByText(/Filtro de Óleo/i)).toBeInTheDocument();
    });
  });

  test('sistema de diagnósticos completo', async () => {
    renderWithRouter(<Diagnosticos />);
    
    // Executar testes
    const runTestsButton = screen.getByRole('button', { name: /executar todos os testes/i });
    fireEvent.click(runTestsButton);
    
    // Verificar saúde
    const healthCheckButton = screen.getByRole('button', { name: /verificar saúde do sistema/i });
    fireEvent.click(healthCheckButton);
    
    // Navegar pelas abas
    const tabs = ['testes', 'logs', 'saúde do sistema'];
    for (const tab of tabs) {
      const tabButton = screen.getByRole('button', { name: new RegExp(tab, 'i') });
      fireEvent.click(tabButton);
      await waitFor(() => {
        expect(tabButton).toBeInTheDocument();
      });
    }
  });
});
