import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Hook para controlar as modais de spam
export const useSocialModals = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalCount, setModalCount] = useState(0);
  const [lastModalTime, setLastModalTime] = useState(0);
  const location = useLocation();

  useEffect(() => {
    // Don't show modals on home page
    if (location.pathname === '/') {
      return;
    }

    // Check if enough time has passed since last modal (3 minutes = 180000ms)
    const now = Date.now();
    const timeSinceLastModal = now - lastModalTime;
    
    // Set up modal timer (3 minutes = 180000ms)
    const modalTimer = setTimeout(() => {
      // Limit to 3 modals per session to avoid being too annoying
      if (modalCount < 3 && timeSinceLastModal >= 180000) {
        setShowModal(true);
        setModalCount(prev => prev + 1);
        setLastModalTime(now);
      }
    }, 180000); // 3 minutes

    return () => {
      clearTimeout(modalTimer);
    };
  }, [location.pathname, modalCount, lastModalTime]);

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
