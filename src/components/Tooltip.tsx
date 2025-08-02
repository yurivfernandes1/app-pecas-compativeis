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

const TooltipContent = styled.div<{ $visible?: boolean; $position?: 'top' | 'bottom'; $adjustX?: 'left' | 'right' | 'center' }>`
  position: absolute;
  ${props => props.$position === 'bottom' ? 'top: calc(100% + 12px);' : 'bottom: calc(100% + 12px);'}
  
  ${props => {
    if (props.$adjustX === 'left') return 'right: 0;';
    if (props.$adjustX === 'right') return 'left: 0;';
    return 'left: 50%; transform: translateX(-50%);';
  }}
  
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: ${colors.white};
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-size: 0.85rem;
  white-space: nowrap;
  z-index: 9999;
  opacity: ${props => props.$visible ? 1 : 0};
  visibility: ${props => props.$visible ? 'visible' : 'hidden'};
  transition: all 0.2s ease;
  pointer-events: none;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
  width: max-content;
  max-width: 300px;
  
  @media screen and (max-width: 768px) {
    max-width: calc(100vw - 20px);
    white-space: normal;
    text-align: center;
    font-size: 0.8rem;
    padding: 0.5rem 0.8rem;
    border-radius: 6px;
  }
  
  &::after {
    content: '';
    position: absolute;
    ${props => props.$position === 'bottom' ? 'bottom: 100%;' : 'top: 100%;'}
    border: 7px solid transparent;
    ${props => props.$position === 'bottom' ? 
      'border-bottom-color: rgba(0, 0, 0, 0.95);' : 
      'border-top-color: rgba(0, 0, 0, 0.95);'
    }
    
    ${props => {
      if (props.$adjustX === 'left') return 'right: 20px;';
      if (props.$adjustX === 'right') return 'left: 20px;';
      return 'left: 50%; transform: translateX(-50%);';
    }}
  }
`;

const Tooltip: React.FC<TooltipProps> = ({ children, content, visible = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<'top' | 'bottom'>('top');
  const [adjustX, setAdjustX] = useState<'left' | 'right' | 'center'>('center');

  useEffect(() => {
    if (visible && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const spaceAbove = containerRect.top;
      const spaceBelow = window.innerHeight - containerRect.bottom;
      const centerX = containerRect.left + containerRect.width / 2;
      const viewportWidth = window.innerWidth;
      
      // Determina posição vertical
      if (spaceAbove < 150 || (spaceBelow > spaceAbove && spaceBelow > 100)) {
        setPosition('bottom');
      } else {
        setPosition('top');
      }
      
      // Determina ajuste horizontal
      const tooltipWidth = 300; // max-width estimado
      const margin = 10;
      
      if (centerX + tooltipWidth/2 > viewportWidth - margin) {
        // Muito à direita - alinha pela direita
        setAdjustX('left');
      } else if (centerX - tooltipWidth/2 < margin) {
        // Muito à esquerda - alinha pela esquerda  
        setAdjustX('right');
      } else {
        // Centro
        setAdjustX('center');
      }
    }
  }, [visible]);

  return (
    <TooltipContainer ref={containerRef}>
      {children}
      <TooltipContent 
        $visible={visible} 
        $position={position}
        $adjustX={adjustX}
      >
        {content}
      </TooltipContent>
    </TooltipContainer>
  );
};

export default Tooltip;
