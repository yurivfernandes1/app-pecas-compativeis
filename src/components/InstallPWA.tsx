import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { colors, media } from '../styles/GlobalStyles';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallButton = styled.button`
  background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.red[700]} 100%);
  color: ${colors.white};
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(220, 38, 38, 0.4);
  }

  ${media.mobile} {
    font-size: 0.9rem;
    padding: 10px 20px;
  }
`;

const InstallContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from {
      transform: translateY(100px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  ${media.mobile} {
    bottom: 16px;
    right: 16px;
    left: 16px;
    
    ${InstallButton} {
      width: 100%;
      justify-content: center;
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: -8px;
  right: -8px;
  background: ${colors.gray[800]};
  color: ${colors.white};
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${colors.gray[700]};
  }
`;

const InstallPWA: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Verificar se já está instalado como PWA
    const checkIfInstalled = () => {
      // iOS Safari
      if ((window.navigator as any).standalone) {
        setIsInstalled(true);
        return;
      }
      
      // Android Chrome
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        return;
      }
    };

    checkIfInstalled();

    // Escutar evento de instalação disponível
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Mostrar botão apenas se não estiver instalado
      if (!isInstalled) {
        setShowInstallButton(true);
      }
    };

    // Escutar quando o app foi instalado
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallButton(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Para iOS Safari - mostrar botão se não estiver instalado
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isInStandaloneMode = (window.navigator as any).standalone;
    
    if (isIOS && !isInStandaloneMode) {
      setShowInstallButton(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Android Chrome
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setShowInstallButton(false);
      }
      
      setDeferredPrompt(null);
    } else {
      // iOS Safari - mostrar instruções
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      
      if (isIOS) {
        alert('Para instalar este app:\n\n1. Toque no botão de compartilhar (📤)\n2. Selecione "Adicionar à Tela de Início"\n3. Toque em "Adicionar"');
      } else {
        alert('Para instalar este app, use o menu do seu navegador e procure por "Instalar" ou "Adicionar à tela inicial"');
      }
    }
  };

  const handleClose = () => {
    setShowInstallButton(false);
  };

  if (!showInstallButton || isInstalled) {
    return null;
  }

  return (
    <InstallContainer>
      <CloseButton onClick={handleClose}>×</CloseButton>
      <InstallButton onClick={handleInstallClick}>
        📱 Instalar App
      </InstallButton>
    </InstallContainer>
  );
};

export default InstallPWA;
