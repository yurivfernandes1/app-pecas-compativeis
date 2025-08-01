import React, { useState, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { Container, Card, colors, media } from '../styles/GlobalStyles';
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
      font-size: 2rem;
    }
  }
  
  p {
    font-size: 1.2rem;
    opacity: 0.9;
    max-width: 700px;
    margin: 0 auto;
    line-height: 1.6;
  }
`;

const FiltersSection = styled.section`
  margin-bottom: 3rem;
`;

const FiltersCard = styled(Card)`
  padding: 2rem;
  background: ${colors.white};
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 2px solid transparent;
  transition: all 0.3s ease;
  
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
    grid-template-columns: 2fr 1fr 1fr;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  
  label {
    font-weight: 600;
    color: ${colors.gray[700]};
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

const SearchInput = styled.input`
  padding: 1rem 1.5rem;
  border: 2px solid ${colors.gray[200]};
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: ${colors.gray[50]};
  
  &:focus {
    outline: none;
    border-color: ${colors.primary};
    background: ${colors.white};
    box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.1);
  }
  
  &::placeholder {
    color: ${colors.gray[400]};
  }
`;

const Select = styled.select`
  padding: 1rem 1.5rem;
  border: 2px solid ${colors.gray[200]};
  border-radius: 12px;
  font-size: 1rem;
  background: ${colors.gray[50]};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary};
    background: ${colors.white};
    box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.1);
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
  background: ${colors.white};
  padding: 2rem;
  border-radius: 15px;
  text-align: center;
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.1);
  border: 2px solid transparent;
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.8s ease-out;
  
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
  }
  
  .label {
    font-size: 1rem;
    color: ${colors.gray[600]};
    font-weight: 500;
  }
  
  .icon {
    font-size: 2rem;
    color: ${colors.primary};
    margin-bottom: 1rem;
    opacity: 0.8;
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

const CategoryTitle = styled.h2`
  color: ${colors.white};
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  
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
`;

const PecasGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const PecaCard = styled(Card)`
  padding: 2rem;
  border-radius: 15px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  background: ${colors.white};
  animation: ${fadeIn} 0.5s ease-out;
  position: relative;
  overflow: hidden;
  
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
    box-shadow: 0 15px 40px rgba(220, 38, 38, 0.15);
    
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
  color: ${colors.gray[800]};
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
`;

const VeiculoTag = styled.span`
  background: ${colors.gray[100]};
  color: ${colors.gray[700]};
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  border: 1px solid transparent;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(220, 38, 38, 0.1);
    border-color: ${colors.primary};
    color: ${colors.primary};
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: ${colors.white};
  border-radius: 20px;
  margin: 2rem 0;
  animation: ${fadeIn} 0.6s ease-out;
  
  .icon {
    font-size: 4rem;
    color: ${colors.gray[400]};
    margin-bottom: 1.5rem;
  }
  
  h3 {
    color: ${colors.gray[600]};
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
  
  p {
    color: ${colors.gray[500]};
    font-size: 1.1rem;
  }
`;

const PecasCompativeis: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');

  const results = useMemo(() => {
    const resultsMap: { [key: string]: { peca: string; veiculos: string[] }[] } = {};

    Object.entries(pecasData).forEach(([categoria, pecasCategoria]) => {
      if (selectedCategory && categoria !== selectedCategory) return;

      const pecasFiltered: { peca: string; veiculos: string[] }[] = [];

      Object.entries(pecasCategoria as any).forEach(([nomePeca, veiculos]) => {
        // Filtrar por termo de busca
        if (searchTerm && !nomePeca.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !(veiculos as string[]).some((v: string) => v.toLowerCase().includes(searchTerm.toLowerCase()))) {
          return;
        }

        // Filtrar por veículo
        if (selectedVehicle && !(veiculos as string[]).some((v: string) => v.toLowerCase().includes(selectedVehicle.toLowerCase()))) {
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

    return resultsMap;
  }, [searchTerm, selectedCategory, selectedVehicle]);

  const totalPecas = Object.values(results).reduce((sum, pecas) => sum + pecas.length, 0);
  const totalCategorias = Object.keys(results).length;
  const totalVeiculos = new Set(
    Object.values(results).flat().flatMap(p => p.veiculos)
  ).size;

  const categorias = Object.keys(pecasData);
  const todosVeiculos: string[] = Array.from(new Set(
    Object.values(pecasData).flatMap(cat => 
      Object.values(cat as any).flat()
    )
  )).sort() as string[];

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
    <PageContainer>
      <HeroSection>
        <Container>
          <HeroContent>
            <h1>
              <i className="fas fa-cogs"></i> Peças Compatíveis Golf MK3
            </h1>
            <p>
              Encontre peças compatíveis para seu Golf MK3 em nossa base de dados completa. 
              89 peças catalogadas com informações verificadas de compatibilidade.
            </p>
          </HeroContent>
        </Container>
      </HeroSection>

      <Container>
        <FiltersSection>
          <FiltersCard>
            <FiltersGrid>
              <FilterGroup>
                <label>Buscar Peças</label>
                <SearchInput
                  type="text"
                  placeholder="🔍 Digite o nome da peça ou veículo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </FilterGroup>
              
              <FilterGroup>
                <label>Categoria</label>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">Todas as categorias</option>
                  {categorias.map(categoria => (
                    <option key={categoria} value={categoria}>{categoria}</option>
                  ))}
                </Select>
              </FilterGroup>
              
              <FilterGroup>
                <label>Veículo</label>
                <Select
                  value={selectedVehicle}
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                >
                  <option value="">Todos os veículos</option>
                  {todosVeiculos.slice(0, 20).map(veiculo => (
                    <option key={veiculo} value={veiculo}>{veiculo}</option>
                  ))}
                </Select>
              </FilterGroup>
            </FiltersGrid>
          </FiltersCard>
        </FiltersSection>

        <StatsContainer>
          <StatCard>
            <div className="icon">🔧</div>
            <span className="number">{totalPecas}</span>
            <span className="label">Peças Encontradas</span>
          </StatCard>
          <StatCard>
            <div className="icon">📂</div>
            <span className="number">{totalCategorias}</span>
            <span className="label">Categorias</span>
          </StatCard>
          <StatCard>
            <div className="icon">🚗</div>
            <span className="number">{totalVeiculos}</span>
            <span className="label">Veículos Compatíveis</span>
          </StatCard>
        </StatsContainer>

        <ResultsGrid>
          {Object.entries(results).map(([categoria, pecas]) => (
            <CategorySection key={categoria}>
              <CategoryTitle>
                <i className={getCategoryIcon(categoria)}></i>
                {categoria}
                <span style={{ fontSize: '1rem', fontWeight: 'normal', opacity: 0.7 }}>
                  ({pecas.length} peças)
                </span>
              </CategoryTitle>
              
              <PecasGrid>
                {pecas.map((item, index) => (
                  <PecaCard key={`${categoria}-${index}`}>
                    <PecaHeader>
                      <PecaTitle>{item.peca}</PecaTitle>
                      <PecaIcon>
                        <i className={getCategoryIcon(categoria)}></i>
                      </PecaIcon>
                    </PecaHeader>
                    
                    <VeiculosList>
                      {item.veiculos.map((veiculo, idx) => (
                        <VeiculoTag key={idx}>{veiculo}</VeiculoTag>
                      ))}
                    </VeiculosList>
                  </PecaCard>
                ))}
              </PecasGrid>
            </CategorySection>
          ))}
          
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
  );
};

export default PecasCompativeis;
