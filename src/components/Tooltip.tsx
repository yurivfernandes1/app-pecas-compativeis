import React from 'react';
import styled from 'styled-components';
import { colors } from '../styles/GlobalStyles';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  visible?: boolean;
}

const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const TooltipContent = styled.div<{ $visible?: boolean }>`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.9);
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
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: rgba(0, 0, 0, 0.9);
  }
`;

const Tooltip: React.FC<TooltipProps> = ({ children, content, visible = false }) => {
  return (
    <TooltipContainer>
      {children}
      <TooltipContent $visible={visible}>
        {content}
      </TooltipContent>
    </TooltipContainer>
  );
};

export default Tooltip;
