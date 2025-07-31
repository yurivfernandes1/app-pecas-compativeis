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
  // Proteção visual leve, sem bloqueio de interação nem alertas.
  return (
    <>
      <ProtectionOverlay />
      {children}
    </>
  );
};

export default ScreenProtection;
