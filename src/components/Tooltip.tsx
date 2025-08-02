import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { colors, media } from '../styles/GlobalStyles';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  visible?: boolean;
}

const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const TooltipContent = styled.div<{ $visible?: boolean; $position?: 'top' | 'bottom' }>`
  position: absolute;
  ${props => props.$position === 'bottom' ? 'top: 100%;' : 'bottom: 100%;'}
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: ${colors.white};
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.8rem;
  white-space: nowrap;
  z-index: 1000;
  opacity: ${props => props.$visible ? 1 : 0};
  visibility: ${props => props.$visible ? 'visible' : 'hidden'};
  transition: all 0.2s ease;
  pointer-events: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  max-width: 250px;
  
  ${media.mobile} {
    font-size: 0.75rem;
    padding: 0.4rem 0.8rem;
    max-width: 200px;
    white-space: normal;
    text-align: center;
  }
  
  &::after {
    content: '';
    position: absolute;
    ${props => props.$position === 'bottom' ? 'bottom: 100%;' : 'top: 100%;'}
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    ${props => props.$position === 'bottom' ? 
      'border-bottom-color: rgba(0, 0, 0, 0.95);' : 
      'border-top-color: rgba(0, 0, 0, 0.95);'
    }
  }
`;

const Tooltip: React.FC<TooltipProps> = ({ children, content, visible = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<'top' | 'bottom'>('top');

  useEffect(() => {
    if (visible && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceAbove = rect.top;
      const spaceBelow = window.innerHeight - rect.bottom;
      
      // Se não há espaço suficiente em cima (menos de 80px), mostra embaixo
      if (spaceAbove < 80 && spaceBelow > spaceAbove) {
        setPosition('bottom');
      } else {
        setPosition('top');
      }
    }
  }, [visible]);

  return (
    <TooltipContainer ref={containerRef}>
      {children}
      <TooltipContent $visible={visible} $position={position}>
        {content}
      </TooltipContent>
    </TooltipContainer>
  );
};

export default Tooltip;
