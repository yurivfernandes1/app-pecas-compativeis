import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { Container, Card, colors, media } from '../styles/GlobalStyles';
import ScreenProtection from '../components/ScreenProtection';
import fusiveisData from '../data/mapa-fusiveis.json';

// Tipos
type FuseColor = 'red' | 'blue' | 'yellow' | 'green';

interface FusePosition {
  id: number;
  funcao: string;
  amperagem: number | null;
  color: FuseColor;
}

interface RelayPosition {
  id: string;
  descricao: string;
}

const PageContainer = styled.div`
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  min-height: 100vh;
  padding: 2rem 0;
  
  ${media.mobile} {
    padding: 1rem 0;
  }
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, ${colors.primary} 0%, #dc1818 100%);
  color: ${colors.white};
  padding: 3rem 0;
  margin-bottom: 3rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  
  ${media.mobile} {
    padding: 2rem 0 1.5rem;
    margin-bottom: 2rem;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
    opacity: 0.3;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  
  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    
    ${media.mobile} {
      font-size: 2rem;
    }
  }
  
  p {
    font-size: 1.1rem;
    opacity: 0.9;
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }
`;

const SearchSection = styled.section`
  margin-bottom: 2rem;
`;

const SearchBox = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  
  ${media.mobile} {
    padding: 1rem;
    border-radius: 12px;
  }
  
  &:focus-within {
    border-color: ${colors.primary};
    box-shadow: 0 8px 32px rgba(220, 38, 38, 0.2);
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1.5rem;
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1);
  color: ${colors.white};
  
  /* Configurações específicas para PWA */
  -webkit-user-select: text !important;
  -moz-user-select: text !important;
  user-select: text !important;
  -webkit-touch-callout: default !important;
  -webkit-tap-highlight-color: rgba(220, 38, 38, 0.2) !important;
  touch-action: manipulation !important;
  -webkit-appearance: none !important;
  appearance: none !important;
  pointer-events: auto !important;
  
  ${media.mobile} {
    padding: 0.8rem 1rem;
    font-size: 0.9rem;
  }
  
  &:focus {
    outline: none;
    border-color: ${colors.primary};
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
    -webkit-user-select: text !important;
    -moz-user-select: text !important;
    user-select: text !important;
  }
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  ${media.desktop} {
    grid-template-columns: 1.2fr 1fr;
  }
  
  ${media.mobile} {
    gap: 1.5rem;
  }
`;

const DiagramSection = styled.section``;

const InfoSection = styled.section``;

const SectionTitle = styled.h2`
  color: ${colors.white};
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  i {
    color: ${colors.primary};
  }
`;

// Componente do Diagrama da Caixa de Fusíveis
const FuseBoxContainer = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  
  ${media.mobile} {
    padding: 1rem;
    border-radius: 12px;
  }
`;

const FuseBoxDiagram = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  padding: 1.5rem;
  position: relative;
  max-width: 100%;
  margin: 0;
  overflow-x: auto;
  
  ${media.mobile} {
    padding: 0.5rem;
    border-radius: 6px;
    border-width: 1px;
    overflow-x: hidden;
  }
  
  @media (max-width: 480px) {
    padding: 0.3rem;
    border-radius: 4px;
  }
`;

// Grid de fusíveis (linha única com todos os fusíveis)
const FuseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(22, 1fr);
  gap: 0.2rem;
  margin-bottom: 1rem;
  justify-items: center;
  min-width: 100%;
  
  ${media.mobile} {
    gap: 0.1rem;
    grid-template-columns: repeat(22, minmax(18px, 1fr));
    font-size: 0.6rem;
    margin-bottom: 0.5rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(22, minmax(15px, 1fr));
    gap: 0.05rem;
    font-size: 0.5rem;
  }
`;

const FuseSlot = styled.div<{ $color: FuseColor; $highlighted?: boolean; $isEmpty?: boolean }>`
  width: 30px;
  height: 60px;
  border: 2px solid #333;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  min-width: 30px;
  
  ${media.mobile} {
    width: 18px;
    height: 36px;
    min-width: 18px;
    font-size: 0.5rem;
    border-width: 1px;
    border-radius: 2px;
  }
  
  background-color: ${props => {
    if (props.$isEmpty) return '#e0e0e0';
    switch (props.$color) {
      case 'red': return '#ff4444';
      case 'blue': return '#4444ff';
      case 'yellow': return '#ffff00';
      case 'green': return '#44ff44';
      default: return '#ff4444';
    }
  }};
  
  color: ${props => props.$color === 'yellow' ? '#000' : '#fff'};
  
  ${props => props.$highlighted && `
    transform: scale(1.1);
    box-shadow: 0 0 20px rgba(220, 38, 38, 0.6);
    z-index: 10;
  `}
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
  
  @media (max-width: 480px) {
    width: 15px;
    height: 30px;
    min-width: 15px;
    font-size: 0.45rem;
  }
  
  @media (max-width: 360px) {
    width: 12px;
    height: 24px;
    min-width: 12px;
    font-size: 0.4rem;
  }
`;

// Grid de relés (2 linhas de 6 relés cada)
const RelayGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
  
  ${media.mobile} {
    gap: 0.3rem;
    grid-template-columns: repeat(6, minmax(44px, 1fr));
    margin-bottom: 0.5rem;
  }
  
  @media (max-width: 480px) {
    gap: 0.25rem;
    grid-template-columns: repeat(6, minmax(40px, 1fr));
  }
`;

const RelaySlot = styled.div<{ $highlighted?: boolean }>`
  width: 60px;
  height: 60px;
  border: 2px solid #333;
  border-radius: 4px;
  background-color: #666;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  
  ${media.mobile} {
    width: 44px;
    height: 44px;
    font-size: 0.65rem;
    border-width: 1px;
    border-radius: 3px;
  }
  
  ${props => props.$highlighted && `
    transform: scale(1.1);
    box-shadow: 0 0 20px rgba(220, 38, 38, 0.6);
    z-index: 10;
    background-color: ${colors.primary};
  `}
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    background-color: ${colors.primary};
  }
  
  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    font-size: 0.6rem;
  }
  
  @media (max-width: 360px) {
    width: 36px;
    height: 36px;
    font-size: 0.55rem;
  }
`;

// Separador visual entre relés e fusíveis
const Separator = styled.div`
  height: 2px;
  background: rgba(255, 255, 255, 0.3);
  margin: 1rem 0;
  border-radius: 1px;
`;

// Seção com título
const DiagramPart = styled.div`
  margin-bottom: 1rem;
`;

const SectionLabel = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.8rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  ${media.mobile} {
    font-size: 0.6rem;
    margin-bottom: 0.3rem;
    letter-spacing: 0.5px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.5rem;
    margin-bottom: 0.2rem;
  }
`;
const ColorLegend = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
  
  ${media.mobile} {
    gap: 0.3rem;
    margin-top: 0.5rem;
    justify-content: space-around;
  }
  
  @media (max-width: 480px) {
    gap: 0.2rem;
    margin-top: 0.3rem;
  }
`;

const LegendItem = styled.div<{ $color: FuseColor }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: ${colors.white};
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  
  ${media.mobile} {
    font-size: 0.6rem;
    padding: 0.25rem 0.5rem;
    gap: 0.25rem;
    border-radius: 4px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.55rem;
    padding: 0.2rem 0.4rem;
  }
  
  &::before {
    content: '';
    width: 20px;
    height: 20px;
    border-radius: 3px;
    
    ${media.mobile} {
      width: 12px;
      height: 12px;
      border-radius: 2px;
    }
    
    @media (max-width: 480px) {
      width: 10px;
      height: 10px;
    }
    
    background-color: ${props => {
      switch (props.$color) {
        case 'red': return '#ff4444';
        case 'blue': return '#4444ff'; // Azul correto
        case 'yellow': return '#ffdd44'; // Amarelo mais escuro
        case 'green': return '#44ff44'; // Verde correto
        default: return '#ff4444';
      }
    }};
  }
`;

// Painel de informações
const InfoPanel = styled(Card)<{ $highlighted?: boolean }>`
  padding: 1.5rem;
  margin-bottom: 1rem;
  background: ${props => props.$highlighted ? 
    'linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(220, 38, 38, 0.1) 100%)' : 
    'rgba(255, 255, 255, 0.1)'
  };
  backdrop-filter: blur(10px);
  border: 2px solid ${props => props.$highlighted ? colors.primary : 'rgba(255, 255, 255, 0.2)'};
  color: ${colors.white};
`;

const FuseList = styled.div`
  max-height: 400px;
  overflow-y: auto;
  
  ${media.mobile} {
    max-height: 300px;
  }
  
  @media (max-width: 480px) {
    max-height: 250px;
  }
  
  /* Scrollbar personalizada */
  &::-webkit-scrollbar {
    width: 8px;
    
    ${media.mobile} {
      width: 4px;
    }
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    
    &:hover {
      background: rgba(255, 255, 255, 0.4);
    }
  }
`;

const FuseListItem = styled.div<{ $highlighted?: boolean; $expanded?: boolean }>`
  border-radius: 8px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  overflow: hidden;
  
  background: ${props => props.$highlighted ? 
    'linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(220, 38, 38, 0.1) 100%)' : 
    'rgba(255, 255, 255, 0.05)'
  };
  
  border-color: ${props => props.$highlighted ? colors.primary : 'transparent'};
  
  &:hover {
    background: linear-gradient(135deg, rgba(220, 38, 38, 0.15) 0%, rgba(220, 38, 38, 0.08) 100%);
    border-color: ${colors.primary};
  }
`;

const FuseItemHeader = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  ${media.mobile} {
    padding: 0.75rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem;
    flex-wrap: wrap;
    gap: 0.25rem;
  }
  
  .fuse-number {
    font-weight: bold;
    color: ${colors.primary};
    margin-right: 0.5rem;
    
    ${media.mobile} {
      font-size: 0.9rem;
      margin-right: 0.3rem;
    }
    
    @media (max-width: 480px) {
      font-size: 0.8rem;
    }
  }
  
  .fuse-function {
    color: ${colors.white};
    font-size: 0.9rem;
    flex: 1;
    
    ${media.mobile} {
      font-size: 0.8rem;
    }
    
    @media (max-width: 480px) {
      font-size: 0.75rem;
      flex-basis: 100%;
      order: 3;
      margin-top: 0.25rem;
    }
  }
  
  .fuse-amperage {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.8rem;
    margin-left: 1rem;
    
    ${media.mobile} {
      font-size: 0.75rem;
      margin-left: 0.5rem;
    }
    
    @media (max-width: 480px) {
      font-size: 0.7rem;
      margin-left: 0;
    }
  }
  
  .expand-icon {
    color: rgba(255, 255, 255, 0.6);
    margin-left: 0.5rem;
    transition: transform 0.3s ease;
    
    ${media.mobile} {
      font-size: 0.9rem;
    }
    
    @media (max-width: 480px) {
      font-size: 0.8rem;
      margin-left: 0;
    }
    
    &.expanded {
      transform: rotate(180deg);
    }
  }
`;

const FuseItemDetails = styled.div<{ $expanded?: boolean }>`
  max-height: ${props => props.$expanded ? '200px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease;
  border-top: ${props => props.$expanded ? '1px solid rgba(255, 255, 255, 0.2)' : 'none'};
`;

const FuseDetailsContent = styled.div`
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  
  .detail-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    
    &:last-child {
      border-bottom: none;
      margin-bottom: 0;
    }
  }
  
  .label {
    font-weight: 600;
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.8rem;
  }
  
  .value {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.8rem;
  }
  
  .color-indicator {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 2px;
    margin-left: 0.5rem;
    vertical-align: middle;
  }
`;

const RelayListItem = styled.div<{ $highlighted?: boolean; $expanded?: boolean }>`
  border-radius: 8px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  overflow: hidden;
  
  background: ${props => props.$highlighted ? 
    'linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(220, 38, 38, 0.1) 100%)' : 
    'rgba(255, 255, 255, 0.05)'
  };
  
  border-color: ${props => props.$highlighted ? colors.primary : 'transparent'};
  
  &:hover {
    background: linear-gradient(135deg, rgba(220, 38, 38, 0.15) 0%, rgba(220, 38, 38, 0.08) 100%);
    border-color: ${colors.primary};
  }
`;

const RelayItemHeader = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  ${media.mobile} {
    padding: 0.75rem;
  }
  
  @media (max-width: 480px) {
    padding: 0.5rem;
    flex-wrap: wrap;
    gap: 0.25rem;
  }
  
  .relay-id {
    font-weight: bold;
    color: ${colors.primary};
    margin-right: 0.5rem;
    min-width: 40px;
    
    ${media.mobile} {
      font-size: 0.9rem;
      min-width: 30px;
      margin-right: 0.3rem;
    }
    
    @media (max-width: 480px) {
      font-size: 0.8rem;
      min-width: 25px;
    }
  }
  
  .relay-description {
    color: ${colors.white};
    font-size: 0.9rem;
    flex: 1;
    
    ${media.mobile} {
      font-size: 0.8rem;
    }
    
    @media (max-width: 480px) {
      font-size: 0.75rem;
      flex-basis: 100%;
      order: 3;
      margin-top: 0.25rem;
    }
  }
  
  .expand-icon {
    color: rgba(255, 255, 255, 0.6);
    margin-left: 0.5rem;
    transition: transform 0.3s ease;
    
    ${media.mobile} {
      font-size: 0.9rem;
    }
    
    @media (max-width: 480px) {
      font-size: 0.8rem;
      margin-left: 0;
    }
    
    &.expanded {
      transform: rotate(180deg);
    }
  }
`;

const RelayItemDetails = styled.div<{ $expanded?: boolean }>`
  max-height: ${props => props.$expanded ? '180px' : '0'};
  overflow: hidden;
  transition: max-height 0.3s ease;
  border-top: ${props => props.$expanded ? '1px solid rgba(255, 255, 255, 0.2)' : 'none'};
`;

const RelayDetailsContent = styled.div`
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  
  .detail-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    padding: 0.5rem 0;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  .label {
    font-weight: 600;
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.8rem;
  }
  
  .value {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.8rem;
  }
`;

const MapaFusiveis: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFuse, setSelectedFuse] = useState<number | null>(null);
  const [selectedRelay, setSelectedRelay] = useState<string | null>(null);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  // Função para lidar com clique em fusível
  const handleFuseClick = (fuseId: number) => {
    const itemKey = `fuse-${fuseId}`;
    if (expandedItem === itemKey) {
      setExpandedItem(null);
      setSelectedFuse(null);
    } else {
      setExpandedItem(itemKey);
      setSelectedFuse(fuseId);
      setSelectedRelay(null);
      
      // Scroll automático para o item na lista
      setTimeout(() => {
        const element = document.querySelector(`[data-item-id="${itemKey}"]`);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 100);
    }
  };

  // Função para lidar com clique em relé
  const handleRelayClick = (relayId: string) => {
    const itemKey = `relay-${relayId}`;
    if (expandedItem === itemKey) {
      setExpandedItem(null);
      setSelectedRelay(null);
    } else {
      setExpandedItem(itemKey);
      setSelectedRelay(relayId);
      setSelectedFuse(null);
      
      // Scroll automático para o item na lista
      setTimeout(() => {
        const element = document.querySelector(`[data-item-id="${itemKey}"]`);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 100);
    }
  };

  // Função para determinar a cor do fusível baseada na amperagem
  const getFuseColor = (amperagem: number | null): FuseColor => {
    if (!amperagem) return 'red';
    if (amperagem === 10) return 'red';
    if (amperagem === 15) return 'blue';
    if (amperagem === 20) return 'yellow';
    if (amperagem === 30) return 'green';
    return 'red';
  };

  // Mapeamento dos fusíveis nas posições corretas
  const fusePositions: FusePosition[] = useMemo(() => {
    return Object.entries(fusiveisData.fusiveis).map(([numero, dados]) => ({
      id: parseInt(numero),
      funcao: dados.funcao,
      amperagem: dados.amperagem,
      color: getFuseColor(dados.amperagem)
    }));
  }, []);

  // Mapeamento dos relés
  const relayPositions: RelayPosition[] = [
    { id: 'R1', descricao: fusiveisData.reles.R1 },
    { id: 'R2', descricao: fusiveisData.reles.R2 },
    { id: 'R3', descricao: fusiveisData.reles.R3 },
    { id: 'R4', descricao: fusiveisData.reles.R4 },
    { id: 'R5', descricao: fusiveisData.reles.R5 },
    { id: 'R6', descricao: fusiveisData.reles.R6 },
    { id: 'R7', descricao: fusiveisData.reles.R7 },
    { id: 'R8', descricao: fusiveisData.reles.R8 },
    { id: 'R9', descricao: fusiveisData.reles.R9 },
    { id: 'R10', descricao: fusiveisData.reles.R10 },
    { id: 'R11', descricao: fusiveisData.reles.R11 },
    { id: 'R12', descricao: fusiveisData.reles.R12 },
  ];

  // Fusíveis filtrados pela pesquisa
  const filteredFuses = useMemo(() => {
    if (!searchTerm.trim()) return fusePositions;
    
    const term = searchTerm.toLowerCase();
    return fusePositions.filter(fuse => 
      fuse.funcao.toLowerCase().includes(term) ||
      fuse.id.toString().includes(term) ||
      (fuse.amperagem || 0).toString().includes(term)
    );
  }, [searchTerm, fusePositions]);

  // Renderizar linha única de fusíveis (1-22)
  const renderAllFuses = () => {
    const fusesInRow = [];
    for (let i = 1; i <= 22; i++) {
      const fuse = fusePositions.find(f => f.id === i);
      const isHighlighted = selectedFuse === i || filteredFuses.some(f => f.id === i && searchTerm.trim());
      const isEmpty = !fuse || fuse.funcao === '—';
      
      fusesInRow.push(
        <FuseSlot
          key={i}
          $color={fuse ? fuse.color : 'red'}
          $highlighted={isHighlighted}
          $isEmpty={isEmpty}
          onClick={() => handleFuseClick(i)}
        >
          {i}
        </FuseSlot>
      );
    }
    return fusesInRow;
  };

  // Renderizar linha de relés
  const renderRelayRow = (startIndex: number, endIndex: number) => {
    const relaysInRow = [];
    for (let i = startIndex; i <= endIndex; i++) {
      const relayId = `R${i}`;
      const relayData = relayPositions.find(r => r.id === relayId);
      const isHighlighted = selectedRelay === relayId;
      
      relaysInRow.push(
        <RelaySlot
          key={relayId}
          $highlighted={isHighlighted}
          onClick={() => handleRelayClick(relayId)}
        >
          {relayId}
        </RelaySlot>
      );
    }
    return relaysInRow;
  };

  // Dados removidos temporariamente para evitar warnings no build
  // const selectedFuseData = selectedFuse ? fusePositions.find(f => f.id === selectedFuse) : null;
  // const selectedRelayData = selectedRelay ? relayPositions.find(r => r.id === selectedRelay) : null;

  return (
    <ScreenProtection>
      <PageContainer data-testid="mapa-fusiveis-page">
        <HeroSection>
          <Container>
            <HeroContent>
              <h1 data-testid="page-title">
                <i className="fas fa-bolt"></i> Mapa de Fusíveis Golf MK3
              </h1>
              <p>
                Localização visual completa dos fusíveis e relés da caixa do Golf MK3. 
                Clique nos fusíveis para ver detalhes ou use a pesquisa.
              </p>
            </HeroContent>
          </Container>
        </HeroSection>

        <Container>
          <SearchSection>
            <SearchBox>
              <SearchInput
                type="text"
                placeholder="🔍 Pesquisar por função, número do fusível ou amperagem..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
            </SearchBox>
          </SearchSection>

          <ContentGrid>
            <DiagramSection>
              <SectionTitle>
                <i className="fas fa-project-diagram"></i>
                Diagrama Interativo da Caixa
              </SectionTitle>
              
              <FuseBoxContainer>
                <FuseBoxDiagram>
                  <DiagramPart>
                    <SectionLabel>Relés</SectionLabel>
                    {/* Primeira linha de relés (R1-R6) */}
                    <RelayGrid>
                      {renderRelayRow(1, 6)}
                    </RelayGrid>
                    
                    {/* Segunda linha de relés (R7-R12) */}
                    <RelayGrid>
                      {renderRelayRow(7, 12)}
                    </RelayGrid>
                  </DiagramPart>
                  
                  <Separator />
                  
                  <DiagramPart>
                    <SectionLabel>Fusíveis</SectionLabel>
                    {/* Linha única com todos os fusíveis (1-22) */}
                    <FuseGrid>
                      {renderAllFuses()}
                    </FuseGrid>
                  </DiagramPart>
                </FuseBoxDiagram>
                
                <ColorLegend>
                  <LegendItem $color="red">10A - Vermelho</LegendItem>
                  <LegendItem $color="blue">15A - Azul</LegendItem>
                  <LegendItem $color="yellow">20A - Amarelo</LegendItem>
                  <LegendItem $color="green">30A - Verde</LegendItem>
                </ColorLegend>
              </FuseBoxContainer>
            </DiagramSection>

            <InfoSection>
              <SectionTitle>
                <i className="fas fa-list"></i>
                Lista de Relés e Fusíveis
              </SectionTitle>
              
              <InfoPanel>
                <FuseList>
                  {/* Seção de Relés */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <SectionTitle style={{ marginBottom: '1rem', color: colors.white, fontSize: '1rem' }}>
                      <i className="fas fa-microchip"></i>
                      Relés
                    </SectionTitle>
                    
                    {relayPositions.map((relay) => {
                      const itemKey = `relay-${relay.id}`;
                      const isExpanded = expandedItem === itemKey;
                      
                      return (
                        <RelayListItem
                          key={relay.id}
                          data-item-id={itemKey}
                          $highlighted={selectedRelay === relay.id}
                          $expanded={isExpanded}
                          onClick={() => handleRelayClick(relay.id)}
                        >
                          <RelayItemHeader>
                            <span className="relay-id">{relay.id}</span>
                            <span className="relay-description">{relay.descricao}</span>
                            <i className={`fas fa-chevron-down expand-icon ${isExpanded ? 'expanded' : ''}`}></i>
                          </RelayItemHeader>
                          
                          <RelayItemDetails $expanded={isExpanded}>
                            <RelayDetailsContent>
                              <div className="detail-row">
                                <span className="label">Posição:</span>
                                <span className="value">{relay.id}</span>
                              </div>
                              <div className="detail-row">
                                <span className="label">Função Completa:</span>
                                <span className="value">{relay.descricao}</span>
                              </div>
                              <div className="detail-row">
                                <span className="label">Tipo:</span>
                                <span className="value">Relé</span>
                              </div>
                              <div className="detail-row">
                                <span className="label">Localização:</span>
                                <span className="value">Caixa de fusíveis principal</span>
                              </div>
                            </RelayDetailsContent>
                          </RelayItemDetails>
                        </RelayListItem>
                      );
                    })}
                  </div>

                  {/* Seção de Fusíveis */}
                  <div>
                    <SectionTitle style={{ marginBottom: '1rem', color: colors.white, fontSize: '1rem' }}>
                      <i className="fas fa-bolt"></i>
                      Fusíveis
                    </SectionTitle>
                    
                    {filteredFuses.map((fuse) => {
                      const itemKey = `fuse-${fuse.id}`;
                      const isExpanded = expandedItem === itemKey;
                      const isEmpty = fuse.funcao === '—';
                      
                      return (
                        <FuseListItem
                          key={fuse.id}
                          data-item-id={itemKey}
                          $highlighted={selectedFuse === fuse.id}
                          $expanded={isExpanded}
                          onClick={() => handleFuseClick(fuse.id)}
                        >
                          <FuseItemHeader>
                            <span className="fuse-number">#{fuse.id}</span>
                            <span className="fuse-function">{fuse.funcao}</span>
                            <span className="fuse-amperage">{fuse.amperagem || 'N/A'}A</span>
                            <i className={`fas fa-chevron-down expand-icon ${isExpanded ? 'expanded' : ''}`}></i>
                          </FuseItemHeader>
                          
                          {!isEmpty && (
                            <FuseItemDetails $expanded={isExpanded}>
                              <FuseDetailsContent>
                                <div className="detail-row">
                                  <span className="label">Posição:</span>
                                  <span className="value">F{fuse.id}</span>
                                </div>
                                <div className="detail-row">
                                  <span className="label">Função:</span>
                                  <span className="value">{fuse.funcao}</span>
                                </div>
                                <div className="detail-row">
                                  <span className="label">Amperagem:</span>
                                  <span className="value">{fuse.amperagem || 'N/A'}A</span>
                                </div>
                                <div className="detail-row">
                                  <span className="label">Cor do Fusível:</span>
                                  <span className="value">
                                    {fuse.color === 'red' && 'Vermelho (10A)'}
                                    {fuse.color === 'blue' && 'Azul (15A)'}
                                    {fuse.color === 'yellow' && 'Amarelo (20A)'}
                                    {fuse.color === 'green' && 'Verde (30A)'}
                                    <span 
                                      className="color-indicator"
                                      style={{
                                        backgroundColor: fuse.color === 'red' ? '#ff4444' :
                                                       fuse.color === 'blue' ? '#4444ff' :
                                                       fuse.color === 'yellow' ? '#ffff00' :
                                                       fuse.color === 'green' ? '#44ff44' : '#ff4444'
                                      }}
                                    ></span>
                                  </span>
                                </div>
                                <div className="detail-row">
                                  <span className="label">Status:</span>
                                  <span className="value" style={{ color: '#4ade80' }}>
                                    ✓ Funcional
                                  </span>
                                </div>
                                <div className="detail-row">
                                  <span className="label">Localização:</span>
                                  <span className="value">Caixa de fusíveis principal</span>
                                </div>
                              </FuseDetailsContent>
                            </FuseItemDetails>
                          )}
                        </FuseListItem>
                      );
                    })}
                    
                    {filteredFuses.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                        <i className="fas fa-search" style={{ fontSize: '2rem', marginBottom: '1rem' }}></i>
                        <p>Nenhum fusível encontrado para "{searchTerm}"</p>
                      </div>
                    )}
                  </div>
                </FuseList>
              </InfoPanel>
            </InfoSection>
          </ContentGrid>
        </Container>
      </PageContainer>
    </ScreenProtection>
  );
};

export default MapaFusiveis;
