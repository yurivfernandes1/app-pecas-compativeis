import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { colors } from '../styles/GlobalStyles';

const slideIn = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`;

const ModalOverlay = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  opacity: ${props => props.$isVisible ? 1 : 0};
  visibility: ${props => props.$isVisible ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: linear-gradient(135deg, ${colors.surface} 0%, ${colors.gray[900]} 100%);
  border: 2px solid ${colors.primary};
  border-radius: 20px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  text-align: center;
  animation: ${slideIn} 0.5s ease-out;
  box-shadow: 0 20px 40px rgba(220, 38, 38, 0.3);
  position: relative;
  overflow: hidden;
`;

const GTIIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: ${pulse} 2s infinite;
  
  .car-icon {
    color: ${colors.primary};
    filter: drop-shadow(0 0 20px rgba(220, 38, 38, 0.6));
  }
`;

const ModalTitle = styled.h2`
  color: ${colors.white};
  font-size: 1.8rem;
  margin-bottom: 1rem;
  text-shadow: 0 0 10px rgba(220, 38, 38, 0.5);
`;

const ModalText = styled.p`
  color: ${colors.gray[300]};
  font-size: 1.1rem;
  line-height: 1.5;
  margin-bottom: 2rem;
`;

const SocialButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const SocialButton = styled.a`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background: ${colors.primary};
  color: ${colors.white};
  text-decoration: none;
  border-radius: 25px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(220, 38, 38, 0.4);

  &:hover {
    background: ${colors.red[700]};
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(220, 38, 38, 0.6);
  }

  i {
    font-size: 1.2rem;
  }
`;

const CloseButton = styled.button<{ $disabled: boolean }>`
  background: ${props => props.$disabled ? colors.gray[700] : colors.gray[600]};
  color: ${props => props.$disabled ? colors.gray[500] : colors.white};
  border: none;
  border-radius: 25px;
  padding: 0.8rem 2rem;
  font-weight: 600;
  cursor: ${props => props.$disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;
  opacity: ${props => props.$disabled ? 0.5 : 1};

  &:hover {
    background: ${props => !props.$disabled ? colors.gray[500] : colors.gray[700]};
  }
`;

const CountdownTimer = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: ${colors.primary};
  color: ${colors.white};
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.2rem;
`;

const FunMessages = [
  {
    title: "🏎️ Aceleração em Primeira!",
    text: "Que tal acelerar também nas redes sociais? Siga o Falando de GTI e fique por dentro de todo conteúdo exclusivo sobre Golf MK3!"
  },
  {
    title: "🔧 Peça que Faltava!",
    text: "Encontrou as peças que procurava? Agora só falta seguir nosso canal para não perder nenhuma dica de modificação!"
  },
  {
    title: "⚡ Turbo nas Redes!",
    text: "Coloque um turbo na sua timeline! Siga o Falando de GTI e receba conteúdo de qualidade sobre o mundo GTI!"
  },
  {
    title: "🎯 Na Medida Certa!",
    text: "Como um fusível na amperagem certa, nosso conteúdo é feito sob medida para os apaixonados por GTI. Siga-nos!"
  },
  {
    title: "🚗 Carro Chefe!",
    text: "Seu Golf MK3 é o carro chefe, e nosso canal é o canal chefe do conteúdo GTI! Não perca tempo e siga agora!"
  }
];

interface SocialModalProps {
  onClose: () => void;
}

const SocialModal: React.FC<SocialModalProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [canClose, setCanClose] = useState(false);
  const [message] = useState(() => FunMessages[Math.floor(Math.random() * FunMessages.length)]);

  useEffect(() => {
    setIsVisible(true);
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setCanClose(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleClose = () => {
    if (!canClose) return;
    
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleSocialClick = (platform: string) => {
    // Track social click
    if (window.gtag) {
      window.gtag('event', 'social_modal_click', {
        platform: platform,
        source: 'spam_modal'
      });
    }
  };

  return (
    <ModalOverlay $isVisible={isVisible} onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        {!canClose && <CountdownTimer>{countdown}</CountdownTimer>}
        
        <GTIIcon>
          <i className="fas fa-car car-icon"></i>
        </GTIIcon>
        
        <ModalTitle>{message.title}</ModalTitle>
        <ModalText>{message.text}</ModalText>
        
        <SocialButtons>
          <SocialButton 
            href="https://www.youtube.com/falandodegti?sub_confirmation=1" 
            target="_blank"
            onClick={() => handleSocialClick('youtube')}
          >
            <i className="fab fa-youtube"></i>
            YouTube
          </SocialButton>
          <SocialButton 
            href="https://www.instagram.com/falandodegti" 
            target="_blank"
            onClick={() => handleSocialClick('instagram')}
          >
            <i className="fab fa-instagram"></i>
            Instagram
          </SocialButton>
          <SocialButton 
            href="https://www.facebook.com/falandodegti" 
            target="_blank"
            onClick={() => handleSocialClick('facebook')}
          >
            <i className="fab fa-facebook"></i>
            Facebook
          </SocialButton>
        </SocialButtons>
        
        <CloseButton 
          $disabled={!canClose} 
          onClick={handleClose}
          title={!canClose ? `Aguarde ${countdown} segundos` : 'Fechar'}
        >
          {canClose ? 'Fechar' : `Aguarde ${countdown}s`}
        </CloseButton>
      </ModalContent>
    </ModalOverlay>
  );
};

export default SocialModal;
