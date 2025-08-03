import React, { useState, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { Container, Card, colors, media } from '../styles/GlobalStyles';
import ScreenProtection from '../components/ScreenProtection';
import { useAppMonitoring } from '../hooks';
import pecasData from '../data/pecas-compativeis.json';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const PageContainer = styled.div`
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  min-height: 100vh;
  padding: 2rem 0;
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, ${colors.primary} 0%, #dc1818 100%);
  color: ${colors.white};
  padding: 4rem 0;
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
  animation: ${fadeIn} 1s ease-out;
  
  h1 {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 1rem;
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    
    ${media.mobile} {
      font-size: 1.8rem;
      margin-bottom: 0.5rem;
    }
  }
  
  p {
    font-size: 1.2rem;
    opacity: 0.9;
    max-width: 700px;
    margin: 0 auto;
    line-height: 1.6;
    
    ${media.mobile} {
      font-size: 1rem;
      padding: 0 1rem;
      line-height: 1.5;
    }
  }
`;

const InfoSection = styled.section`
  margin-bottom: 2rem;
`;

const InfoCard = styled.div`
  background: ${colors.surface};
  border-radius: 15px;
  border: 2px solid transparent;
  border-left: 4px solid ${colors.primary};
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  overflow: hidden;
  
  &:hover {
    border-color: ${colors.primary};
    box-shadow: 0 10px 40px rgba(220, 38, 38, 0.15);
  }
`;

const InfoHeader = styled.div<{ $expanded?: boolean }>`
  padding: 1.5rem 2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(220, 38, 38, 0.05);
  
  ${media.mobile} {
    padding: 1rem 1.5rem;
  }
  
  h3 {
    color: ${colors.white};
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    
    ${media.mobile} {
      font-size: 1rem;
    }
  }
  
  .icon {
    color: ${colors.primary};
    font-size: 1.2rem;
  }
  
  .expand-icon {
    color: ${colors.primary};
    font-size: 1rem;
    transition: transform 0.3s ease;
    transform: ${props => props.$expanded ? 'rotate(180deg)' : 'rotate(0deg)'};
  }
`;

const InfoContent = styled.div<{ $expanded?: boolean }>`
  max-height: ${props => props.$expanded ? '1500px' : '0'};
  overflow: hidden;
  transition: max-height 0.4s ease, padding 0.4s ease;
  padding: ${props => props.$expanded ? '0 2rem 2rem' : '0 2rem'};
  
  ${media.mobile} {
    padding: ${props => props.$expanded ? '0 1.5rem 1.5rem' : '0 1.5rem'};
  }
  
  p {
    color: ${colors.gray[300]};
    line-height: 1.7;
    margin: 0;
    text-align: justify;
    
    ${media.mobile} {
      font-size: 0.95rem;
      line-height: 1.6;
    }
  }
`;

const VideoContainer = styled.div`
  margin: 1.5rem 0;
  position: relative;
  width: 100%;
  height: 0;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 12px;
  }
  
  ${media.mobile} {
    margin: 1rem 0;
    border-radius: 8px;
  }
`;

const FiltersSection = styled.section`
  margin-bottom: 3rem;
`;

const FiltersCard = styled(Card)`
  padding: 2rem;
  background: ${colors.surface};
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  border: 2px solid transparent;
  transition: all 0.3s ease;
  
  ${media.mobile} {
    padding: 1rem;
    border-radius: 15px;
  }
  
  &:focus-within {
    border-color: ${colors.primary};
    box-shadow: 0 10px 40px rgba(220, 38, 38, 0.2);
  }
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  ${media.tablet} {
    grid-template-columns: 2fr 1fr;
  }
  
  ${media.mobile} {
    gap: 1rem;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  
  label {
    font-weight: 600;
    color: ${colors.white};
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const SearchInput = styled.input`
  padding: 1rem 1.5rem;
  border: 2px solid ${colors.gray[600]};
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: ${colors.gray[700]} !important;
  color: ${colors.white} !important;
  
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
  
  &:focus {
    outline: none !important;
    border-color: ${colors.gray[500]} !important;
    background: ${colors.gray[600]} !important;
    box-shadow: 0 0 0 4px rgba(107, 114, 128, 0.1) !important;
    -webkit-user-select: text !important;
    -moz-user-select: text !important;
    user-select: text !important;
  }
  
  &::placeholder {
    color: ${colors.gray[400]} !important;
  }
  
  /* Garantir que não seja sobrescrito por estilos do navegador */
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px ${colors.gray[700]} inset !important;
    -webkit-text-fill-color: ${colors.white} !important;
    background-color: ${colors.gray[700]} !important;
  }
`;

const Select = styled.select`
  padding: 1rem 1.5rem;
  border: 2px solid ${colors.gray[600]};
  border-radius: 12px;
  font-size: 1rem;
  background: ${colors.gray[700]} !important;
  color: ${colors.white} !important;
  cursor: pointer;
  transition: all 0.3s ease;
  
  /* Configurações específicas para PWA */
  -webkit-user-select: text !important;
  -moz-user-select: text !important;
  user-select: text !important;
  -webkit-touch-callout: default !important;
  -webkit-tap-highlight-color: rgba(220, 38, 38, 0.2) !important;
  touch-action: manipulation !important;
  pointer-events: auto !important;
  
  &:focus {
    outline: none !important;
    border-color: ${colors.gray[500]} !important;
    background: ${colors.gray[600]} !important;
    box-shadow: 0 0 0 4px rgba(107, 114, 128, 0.1) !important;
    -webkit-user-select: text !important;
    -moz-user-select: text !important;
    user-select: text !important;
  }

  option {
    background: ${colors.gray[700]} !important;
    color: ${colors.white} !important;
    padding: 0.5rem;
    
    &:hover {
      background: ${colors.gray[600]} !important;
    }
    
    &:checked {
      background: ${colors.gray[600]} !important;
      color: ${colors.white} !important;
    }
    
    &:selected {
      background: ${colors.gray[600]} !important;
      color: ${colors.white} !important;
    }
  }
  
  /* Personalizar a seta do dropdown */
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1rem;
  padding-right: 3rem;
  
  /* Estilos específicos para Firefox */
  &::-moz-color-swatch {
    border: none;
  }
  
  /* Garantir que não seja sobrescrito por estilos do navegador */
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px ${colors.gray[700]} inset !important;
    -webkit-text-fill-color: ${colors.white} !important;
    background-color: ${colors.gray[700]} !important;
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
  
  ${media.mobile} {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const StatCard = styled.div`
  background: ${colors.surface};
  padding: 2rem;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.3);
  border: 2px solid transparent;
  border-left: 4px solid ${colors.primary};
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.8s ease-out;
  
  ${media.mobile} {
    padding: 1.5rem 1rem;
  }
  
  &:hover {
    border-color: ${colors.primary};
    transform: translateY(-5px);
    box-shadow: 0 10px 40px rgba(220, 38, 38, 0.15);
    
    .number {
      animation: ${pulse} 0.6s ease-in-out;
    }
  }
  
  .number {
    font-size: 2.5rem;
    font-weight: 700;
    color: ${colors.primary};
    display: block;
    margin-bottom: 0.5rem;
    
    ${media.mobile} {
      font-size: 2rem;
    }
  }
  
  .label {
    font-size: 1rem;
    color: ${colors.gray[300]};
    font-weight: 500;
    
    ${media.mobile} {
      font-size: 0.9rem;
    }
  }
  
  .icon {
    font-size: 2rem;
    color: ${colors.primary};
    margin-bottom: 1rem;
    opacity: 0.8;
    
    ${media.mobile} {
      font-size: 1.5rem;
      margin-bottom: 0.8rem;
    }
  }
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
`;

const CategorySection = styled.div`
  margin-bottom: 2rem;
  animation: ${fadeIn} 0.6s ease-out;
`;

const CategoryTitle = styled.h2<{ $expanded?: boolean }>`
  color: ${colors.white};
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: ${props => props.$expanded ? '0' : '1rem'};
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  padding: 1.5rem;
  background: ${colors.surface};
  border-radius: 15px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  
  &:hover {
    border-color: ${colors.primary};
    background: rgba(220, 38, 38, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(220, 38, 38, 0.15);
  }
  
  &::before {
    content: '';
    width: 4px;
    height: 40px;
    background: ${colors.primary};
    border-radius: 2px;
  }
  
  .icon {
    color: ${colors.primary};
    font-size: 1.5rem;
  }
  
  .expand-icon {
    margin-left: auto;
    transition: transform 0.3s ease;
    transform: ${props => props.$expanded ? 'rotate(180deg)' : 'rotate(0deg)'};
    color: ${colors.primary};
    font-size: 1.2rem;
  }
  
  .category-info {
    display: flex;
    flex-direction: column;
    flex: 1;
    
    .category-name {
      font-size: 1.8rem;
      margin-bottom: 0.3rem;
    }
    
    .category-count {
      font-size: 0.9rem;
      font-weight: normal;
      opacity: 0.7;
      color: ${colors.gray[300]};
    }
  }
`;

const PecasGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  
  ${media.mobile} {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const CollapsibleContent = styled.div<{ $expanded?: boolean }>`
  max-height: ${props => props.$expanded ? '5000px' : '0'};
  overflow: hidden;
  transition: all 0.5s ease;
  opacity: ${props => props.$expanded ? 1 : 0};
  transform: ${props => props.$expanded ? 'translateY(0)' : 'translateY(-10px)'};
  margin-top: ${props => props.$expanded ? '1.5rem' : '0'};
`;

const PecaCard = styled(Card)`
  padding: 2rem;
  border-radius: 15px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  background: ${colors.surface};
  animation: ${fadeIn} 0.5s ease-out;
  position: relative;
  overflow: hidden;
  border-left: 4px solid ${colors.primary};
  
  ${media.mobile} {
    padding: 1rem;
    border-radius: 12px;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, ${colors.primary}, #dc1818);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
  }
  
  &:hover {
    border-color: ${colors.primary};
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(220, 38, 38, 0.25);
    
    &::before {
      transform: translateX(0);
    }
  }
`;

const PecaHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const PecaTitle = styled.h3`
  color: ${colors.white};
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0;
  flex: 1;
`;

const PecaIcon = styled.div`
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, ${colors.primary}, #dc1818);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.white};
  font-size: 1.5rem;
  margin-left: 1rem;
`;

const VeiculosList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  max-height: none;
  
  .show-more-btn {
    background: transparent;
    border: 2px dashed ${colors.primary};
    color: ${colors.primary};
    padding: 0.4rem 0.8rem;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      background: rgba(220, 38, 38, 0.1);
      border-style: solid;
    }
  }
`;

const VeiculoTag = styled.span`
  background: ${colors.gray[700]};
  color: ${colors.white};
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  border: 1px solid transparent;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(220, 38, 38, 0.2);
    border-color: ${colors.primary};
    color: ${colors.primary};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: ${colors.surface};
  border-radius: 20px;
  margin: 2rem 0;
  animation: ${fadeIn} 0.6s ease-out;
  border-left: 4px solid ${colors.primary};
  
  .icon {
    font-size: 4rem;
    color: ${colors.gray[400]};
    margin-bottom: 1.5rem;
  }
  
  h3 {
    color: ${colors.white};
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  p {
    color: ${colors.gray[300]};
    font-size: 1.1rem;
  }
`;

const PecasCompativeis: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedVehicles, setExpandedVehicles] = useState<Set<string>>(new Set());
  const [infoExpanded, setInfoExpanded] = useState(false);

  // Sistema de monitoramento e estatísticas centralizadas
  const { logUserInteraction, logError, logDebug } = useAppMonitoring('PecasCompativeis');

  // Funções auxiliares com logging
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    logUserInteraction('search', {
      query: value,
      length: value.length,
      timestamp: new Date().toISOString()
    });
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    logUserInteraction('filter_category', {
      category: category || 'all',
      previousCategory: selectedCategory || 'all'
    });
  };

  const toggleInfo = () => {
    setInfoExpanded(!infoExpanded);
    logUserInteraction('toggle_info', { expanded: !infoExpanded });
  };

  const toggleCategory = (categoria: string) => {
    const newExpanded = new Set(expandedCategories);
    const wasExpanded = newExpanded.has(categoria);
    
    if (wasExpanded) {
      newExpanded.delete(categoria);
    } else {
      newExpanded.add(categoria);
    }
    setExpandedCategories(newExpanded);
    
    logUserInteraction('toggle_category', {
      categoria,
      action: wasExpanded ? 'collapse' : 'expand',
      totalExpanded: newExpanded.size
    });
  };

  const toggleVehiclesList = (cardId: string) => {
    const newExpanded = new Set(expandedVehicles);
    const wasExpanded = newExpanded.has(cardId);
    
    if (wasExpanded) {
      newExpanded.delete(cardId);
    } else {
      newExpanded.add(cardId);
    }
    setExpandedVehicles(newExpanded);
    
    logUserInteraction('toggle_vehicles_list', {
      cardId,
      action: wasExpanded ? 'collapse' : 'expand',
      totalExpanded: newExpanded.size
    });
  };

  const results = useMemo(() => {
    const startTime = performance.now();
    const resultsMap: { [key: string]: { peca: string; veiculos: string[] }[] } = {};

    try {
      Object.entries(pecasData).forEach(([categoria, pecasCategoria]) => {
        if (selectedCategory && categoria !== selectedCategory) return;

        const pecasFiltered: { peca: string; veiculos: string[] }[] = [];

        Object.entries(pecasCategoria as any).forEach(([nomePeca, veiculos]) => {
          // Filtrar por termo de busca
          if (searchTerm && !nomePeca.toLowerCase().includes(searchTerm.toLowerCase()) &&
              !(veiculos as string[]).some((v: string) => v.toLowerCase().includes(searchTerm.toLowerCase()))) {
            return;
          }

          pecasFiltered.push({
            peca: nomePeca,
            veiculos: veiculos as string[]
          });
        });

        if (pecasFiltered.length > 0) {
          resultsMap[categoria] = pecasFiltered;
        }
      });

      const processingTime = performance.now() - startTime;
      const totalResults = Object.values(resultsMap).reduce((sum, pecas) => sum + pecas.length, 0);
      
      logDebug('Resultados da busca calculados', {
        processingTime: `${processingTime.toFixed(2)}ms`,
        totalResults,
        totalCategories: Object.keys(resultsMap).length,
        filters: {
          searchTerm: searchTerm || 'none',
          category: selectedCategory || 'all'
        }
      });

      return resultsMap;
    } catch (error) {
      logError('Erro ao calcular resultados da busca', { error, filters: { searchTerm, selectedCategory } });
      return {};
    }
  }, [searchTerm, selectedCategory, logDebug, logError]);

  const totalPecas = Object.values(results).reduce((sum, pecas) => sum + pecas.length, 0);
  const totalCategorias = Object.keys(results).length;

  const categorias = Object.keys(pecasData);

  const getCategoryIcon = (categoria: string) => {
    if (categoria.includes('Motor')) return 'fas fa-cog';
    if (categoria.includes('Transmissão') || categoria.includes('Embreagem')) return 'fas fa-tools';
    if (categoria.includes('Freios')) return 'fas fa-stop-circle';
    if (categoria.includes('Suspensão')) return 'fas fa-car';
    if (categoria.includes('Elétrica')) return 'fas fa-bolt';
    if (categoria.includes('Carroceria')) return 'fas fa-car-side';
    return 'fas fa-wrench';
  };

  return (
    <ScreenProtection>
      <PageContainer data-testid="pecas-compativeis-page">
      <HeroSection>
        <Container>
          <HeroContent>
            <h1 data-testid="page-title">
              <i className="fas fa-cogs"></i> Peças Compatíveis Golf MK3
            </h1>
            <p>
              Encontre peças compatíveis para seu Golf MK3 em nossa base de dados completa. 
              77 peças catalogadas com informações verificadas de compatibilidade.
            </p>
          </HeroContent>
        </Container>
      </HeroSection>

      <Container>
        <InfoSection>
          <InfoCard data-testid="info-card">
            <InfoHeader $expanded={infoExpanded} onClick={toggleInfo} data-testid="info-header">
              <h3>
                <i className="fas fa-info-circle icon"></i>
                Como identificar se meu MK3 é Mexicano ou Alemão?
              </h3>
              <i className="fas fa-chevron-down expand-icon"></i>
            </InfoHeader>
            <InfoContent $expanded={infoExpanded}>
              <VideoContainer>
                <iframe
                  src="https://www.youtube.com/embed/Q5OUwh7BFS4"
                  title="Como identificar se meu Golf MK3 é Mexicano ou Alemão"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </VideoContainer>
              <p>
                A terceira geração do Golf foi lançada na Europa no final de 1991, porém em países como o Brasil e os Estados Unidos, eles só chegaram em 1994.
                <br/><br/>
                No Brasil o MK3 chegou inicialmente somente na versão GTI em 1994, com modelos produzidos ainda em 1993 mas no ano modelo 1994. Em 1995 com a versão GL importada da alemanha, com o motor 1.8 monoponto e a versão GLX importada do México. Em 1996 a VW passou a trazer a versão GL do México já com o motor 1.8 com injeção multiponto.
                <br/><br/>
                Ou seja, a única versão do Golf MK3 trazida da Alemanha é o GL no ano de 1995.
                <br/><br/>
                Tirando alguns Golf's MK3 na versão VR6 e Cabrio trazidos em poucas unidades da Alemanha pela fábrica, e da versão GL 1995 com motor monoponto, todas as demais versões foram trazidas do México. O Golf MK3 não foi produzido no Brasil nem mesmo na Argentina e a versão GLX só foi produzida no México.
              </p>
            </InfoContent>
          </InfoCard>
        </InfoSection>

        <FiltersSection>
          <FiltersCard data-testid="filters-card">
            <FiltersGrid>
              <FilterGroup>
                <label>Buscar Peças</label>
                <SearchInput
                  data-testid="search-input"
                  type="text"
                  placeholder="🔍 Digite o nome da peça ou veículo..."
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                />
              </FilterGroup>
              
              <FilterGroup>
                <label>Categoria</label>
                <Select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                >
                  <option value="">Todas as categorias</option>
                  {categorias.map(categoria => (
                    <option key={categoria} value={categoria}>{categoria}</option>
                  ))}
                </Select>
              </FilterGroup>
            </FiltersGrid>
          </FiltersCard>
        </FiltersSection>

        <StatsContainer>
          <StatCard data-testid="pecas-filtradas-stat">
            <div className="icon">�🔧</div>
            <span className="number">{totalPecas}</span>
            <span className="label">Peças Encontradas</span>
          </StatCard>
          <StatCard>
            <div className="icon">📂</div>
            <span className="number">{totalCategorias}</span>
            <span className="label">Categorias Exibidas</span>
          </StatCard>
        </StatsContainer>

        <ResultsGrid data-testid="results-grid">
          {Object.entries(results).map(([categoria, pecas]) => {
            const isExpanded = expandedCategories.has(categoria);
            
            return (
              <CategorySection key={categoria} data-testid={`category-${categoria.toLowerCase().replace(/\s+/g, '-')}`}>
                <CategoryTitle 
                  $expanded={isExpanded}
                  onClick={() => toggleCategory(categoria)}
                  data-testid={`category-title-${categoria.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <i className={getCategoryIcon(categoria)}></i>
                  <div className="category-info">
                    <div className="category-name">{categoria}</div>
                    <div className="category-count">
                      {pecas.length} peças • {
                        new Set(pecas.flatMap(p => p.veiculos)).size
                      } veículos compatíveis
                    </div>
                  </div>
                  <i className="fas fa-chevron-down expand-icon"></i>
                </CategoryTitle>
                
                <CollapsibleContent $expanded={isExpanded}>
                  <PecasGrid>
                    {pecas.map((item, index) => {
                      const cardId = `${categoria}-${index}`;
                      const isVehiclesExpanded = expandedVehicles.has(cardId);
                      const maxVeiculosVisible = 5;
                      const veiculosToShow = isVehiclesExpanded ? item.veiculos : item.veiculos.slice(0, maxVeiculosVisible);
                      const hasMoreVeiculos = item.veiculos.length > maxVeiculosVisible;
                      
                      return (
                        <PecaCard key={cardId}>
                          <PecaHeader>
                            <PecaTitle>{item.peca}</PecaTitle>
                            <PecaIcon>
                              <i className={getCategoryIcon(categoria)}></i>
                            </PecaIcon>
                          </PecaHeader>
                          
                          <VeiculosList>
                            {veiculosToShow.map((veiculo, idx) => (
                              <VeiculoTag key={idx}>{veiculo}</VeiculoTag>
                            ))}
                            
                            {hasMoreVeiculos && (
                              <button
                                className="show-more-btn"
                                onClick={() => toggleVehiclesList(cardId)}
                              >
                                {isVehiclesExpanded 
                                  ? `Mostrar menos` 
                                  : `+${item.veiculos.length - maxVeiculosVisible} mais`
                                }
                              </button>
                            )}
                          </VeiculosList>
                        </PecaCard>
                      );
                    })}
                  </PecasGrid>
                </CollapsibleContent>
              </CategorySection>
            );
          })}
          
          {totalPecas === 0 && (
            <EmptyState>
              <div className="icon">🔍</div>
              <h3>Nenhuma peça encontrada</h3>
              <p>Tente ajustar os filtros ou usar termos de busca diferentes</p>
            </EmptyState>
          )}
        </ResultsGrid>
      </Container>
    </PageContainer>
    </ScreenProtection>
  );
};

export default PecasCompativeis;
