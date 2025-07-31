import React, { useEffect } from 'react';
import styled from 'styled-components';
import { colors } from '../styles/GlobalStyles';

const ProtectionOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 1;
  background: transparent;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      repeating-linear-gradient(
        45deg,
        transparent,
        transparent 50px,
        rgba(220, 38, 38, 0.02) 50px,
        rgba(220, 38, 38, 0.02) 100px
      ),
      repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 50px,
        rgba(220, 38, 38, 0.02) 50px,
        rgba(220, 38, 38, 0.02) 100px
      );
    pointer-events: none;
  }
  
  &::after {
    content: 'FALANDO DE GTI • GOLF MK3 • FALANDO DE GTI • GOLF MK3 • ';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-45deg);
    white-space: nowrap;
    font-size: 14px;
    color: rgba(220, 38, 38, 0.08);
    font-weight: bold;
    letter-spacing: 20px;
    animation: watermarkMove 30s linear infinite;
    pointer-events: none;
    user-select: none;
  }
  
  @keyframes watermarkMove {
    0% {
      transform: translate(-50%, -50%) rotate(-45deg) translateX(-100px);
    }
    100% {
      transform: translate(-50%, -50%) rotate(-45deg) translateX(100px);
    }
  }
`;

const AlertOverlay = styled.div<{ $show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
  opacity: ${props => props.$show ? 1 : 0};
  visibility: ${props => props.$show ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
`;

const AlertContent = styled.div`
  background: ${colors.surface};
  border: 2px solid ${colors.primary};
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  max-width: 400px;
  
  h3 {
    color: ${colors.primary};
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  p {
    color: ${colors.white};
    font-size: 1.1rem;
    line-height: 1.5;
    margin-bottom: 1.5rem;
  }
  
  button {
    background: ${colors.primary};
    color: ${colors.white};
    border: none;
    padding: 0.8rem 2rem;
    border-radius: 25px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      background: ${colors.red[700]};
    }
  }
`;

interface ScreenProtectionProps {
  children: React.ReactNode;
}

const ScreenProtection: React.FC<ScreenProtectionProps> = ({ children }) => {
  const [showAlert, setShowAlert] = React.useState(false);

  useEffect(() => {
    let devtoolsOpen = false;
    
    // Função para detectar se o DevTools está aberto
    const detectDevTools = () => {
      const threshold = 160;
      if (
        window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold
      ) {
        if (!devtoolsOpen) {
          devtoolsOpen = true;
          setShowAlert(true);
        }
      } else {
        devtoolsOpen = false;
      }
    };

    // Função para detectar tentativas de screenshot
    const detectScreenshot = () => {
      // Detectar mudanças de visibilidade que podem indicar screenshot
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          // Usuário saiu da aba, possível screenshot
          console.clear();
          setShowAlert(true);
        }
      });
      
      // Detectar blur da janela (alt+tab, print screen, etc)
      window.addEventListener('blur', () => {
        setShowAlert(true);
      });
      
      // Detectar resize da janela (possível DevTools)
      window.addEventListener('resize', () => {
        detectDevTools();
      });
    };

    // Desabilitar atalhos de teclado
    const handleKeyDown = (e: KeyboardEvent) => {
      // Print Screen
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        setShowAlert(true);
        return false;
      }
      
      // Ctrl+Shift+I ou F12 (DevTools)
      if ((e.ctrlKey && e.shiftKey && e.key === 'I') || e.key === 'F12') {
        e.preventDefault();
        setShowAlert(true);
        return false;
      }
      
      // Ctrl+Shift+C (Inspect)
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        setShowAlert(true);
        return false;
      }
      
      // Ctrl+U (View Source)
      if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        setShowAlert(true);
        return false;
      }
      
      // Ctrl+S (Save)
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        setShowAlert(true);
        return false;
      }
      
      // Cmd+Shift+3/4 (Mac Screenshots)
      if (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4')) {
        e.preventDefault();
        setShowAlert(true);
        return false;
      }
    };

    // Desabilitar menu de contexto
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setShowAlert(true);
      return false;
    };

    // Desabilitar seleção de texto
    const disableSelection = () => {
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
      (document.body.style as any).mozUserSelect = 'none';
      (document.body.style as any).msUserSelect = 'none';
    };

    // Aplicar proteções
    const interval = setInterval(detectDevTools, 1000);
    detectScreenshot();
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);
    disableSelection();

    // Limpar console periodicamente
    const clearConsole = () => {
      console.clear();
      console.log('%c🚗 FALANDO DE GTI', 'color: #DC2626; font-size: 20px; font-weight: bold;');
      console.log('%cConteúdo protegido - Acesse nosso canal no YouTube!', 'color: #DC2626; font-size: 14px;');
    };
    
    const consoleInterval = setInterval(clearConsole, 3000);
    clearConsole();

    // Cleanup
    return () => {
      clearInterval(interval);
      clearInterval(consoleInterval);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
      (document.body.style as any).mozUserSelect = '';
      (document.body.style as any).msUserSelect = '';
    };
  }, []);

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return (
    <>
      <ProtectionOverlay />
      {children}
      
      <AlertOverlay $show={showAlert}>
        <AlertContent>
          <h3>⚠️ Ação Restrita</h3>
          <p>
            Esta funcionalidade foi desabilitada para proteger o conteúdo. 
            Visite nosso canal do YouTube para mais conteúdo sobre Golf MK3!
          </p>
          <button onClick={handleCloseAlert}>
            Entendi
          </button>
        </AlertContent>
      </AlertOverlay>
    </>
  );
};

export default ScreenProtection;
