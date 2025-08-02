import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Hook para controlar as modais de spam
export const useSocialModals = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalCount, setModalCount] = useState(0);
  const [lastModalTime, setLastModalTime] = useState(0);
  const [isFirstModal, setIsFirstModal] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastModal = now - lastModalTime;
    
    // Determinar o tempo para o próximo modal
    const modalDelay = isFirstModal ? 5000 : 300000; // 5 segundos na primeira vez, depois 5 minutos (300000ms)
    
    // Set up modal timer
    const modalTimer = setTimeout(() => {
      // Verificar se é o primeiro modal ou se já passou tempo suficiente desde o último
      if (isFirstModal || timeSinceLastModal >= 300000) {
        setShowModal(true);
        setModalCount(prev => prev + 1);
        setLastModalTime(now);
        setIsFirstModal(false);
      }
    }, modalDelay);

    return () => {
      clearTimeout(modalTimer);
    };
  }, [location.pathname, modalCount, lastModalTime, isFirstModal]);

  const closeModal = () => {
    setShowModal(false);
  };

  return {
    showModal,
    closeModal,
    modalCount
  };
};

// Hook para proteção contra print screen (simplificado)
export const useScreenshotProtection = () => {
  const location = useLocation();

  useEffect(() => {
    const protectedPages = ['/pecas', '/fusiveis', '/cores'];
    const isProtectedPage = protectedPages.some(page => location.pathname.includes(page));

    if (isProtectedPage) {
      // Básico: desabilitar menu de contexto
      const disableContextMenu = (e: MouseEvent) => {
        e.preventDefault();
        return false;
      };

      // Desabilitar alguns atalhos de teclado principais
      const disableKeyShortcuts = (e: KeyboardEvent) => {
        // Print Screen
        if (e.key === 'PrintScreen') {
          e.preventDefault();
          return false;
        }
        
        // F12 (Dev Tools)
        if (e.key === 'F12') {
          e.preventDefault();
          return false;
        }
      };

      document.addEventListener('contextmenu', disableContextMenu);
      document.addEventListener('keydown', disableKeyShortcuts);

      // Cleanup function
      return () => {
        document.removeEventListener('contextmenu', disableContextMenu);
        document.removeEventListener('keydown', disableKeyShortcuts);
      };
    }
  }, [location.pathname]);
};

// Hook combinado para usar ambas as funcionalidades
export const useAppProtection = () => {
  const socialModals = useSocialModals();
  useScreenshotProtection();
  
  return socialModals;
};
