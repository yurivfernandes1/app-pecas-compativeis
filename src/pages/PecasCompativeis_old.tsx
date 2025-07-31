import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { Container, Title, Input, Select, Card, Grid, colors, media } from '../styles/GlobalStyles';
import pecasData from '../data/pecas-compativeis.json';
import { CategoriaPecas } from '../types';

const SearchSection = styled.section`
  background: ${colors.gray[50]};
  padding: 2rem 0;
  border-bottom: 1px solid ${colors.gray[200]};
`;

const SearchForm = styled.div`
  display: grid;
  grid-template-columns: 1fr 200px 150px;
  gap: 1rem;
  margin-bottom: 2rem;

  ${media.tablet} {
    grid-template-columns: 1fr;
  }
`;

const ResultsSection = styled.section`
  padding: 2rem 0;
`;

const CategoryTitle = styled.h2`
  color: ${colors.primary};
  font-size: 1.5rem;
  font-weight: 600;
  margin: 2rem 0 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid ${colors.primary};
`;

const PecaCard = styled(Card)`
  h3 {
    color: ${colors.gray[800]};
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .vehicles {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 1rem;
  }

  .vehicle-tag {
    background: ${colors.gray[100]};
    color: ${colors.gray[700]};
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .highlight {
    background: ${colors.red[50]};
    color: ${colors.primary};
  }
`;

const NoResults = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${colors.gray[500]};

  h3 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1rem;
    line-height: 1.6;
  }
`;

const ResultsCount = styled.div`
  color: ${colors.gray[600]};
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const PecasCompativeis: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState('');

  const categories = Object.keys(pecasData) as Array<keyof CategoriaPecas>;
  
  const allVehicles = useMemo(() => {
    const vehicles = new Set<string>();
    Object.values(pecasData).forEach(category => {
      Object.values(category).forEach(pecaVehicles => {
        pecaVehicles.forEach(vehicle => vehicles.add(vehicle));
      });
    });
    return Array.from(vehicles).sort();
  }, []);

  const filteredResults = useMemo(() => {
    let results: Array<{
      categoria: string;
      peca: string;
      veiculos: string[];
    }> = [];

    categories.forEach(categoria => {
      if (selectedCategory && categoria !== selectedCategory) return;

      const pecasCategoria = pecasData[categoria as keyof typeof pecasData];
      Object.entries(pecasCategoria).forEach(([nomePeca, veiculos]) => {
        // Filtrar por termo de busca
        if (searchTerm && !nomePeca.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !(veiculos as string[]).some((v: string) => v.toLowerCase().includes(searchTerm.toLowerCase()))) {
          return;
        }

        // Filtrar por veículo
        if (selectedVehicle && !(veiculos as string[]).some((v: string) => v.toLowerCase().includes(selectedVehicle.toLowerCase()))) {
          return;
        }

        results.push({
          categoria: categoria as string,
          peca: nomePeca,
          veiculos: veiculos as string[]
        });
      });
    });

    return results;
  }, [searchTerm, selectedCategory, selectedVehicle, categories]);

  const groupedResults = useMemo(() => {
    const grouped: { [categoria: string]: Array<{ peca: string; veiculos: string[] }> } = {};
    
    filteredResults.forEach(result => {
      if (!grouped[result.categoria]) {
        grouped[result.categoria] = [];
      }
      grouped[result.categoria].push({
        peca: result.peca,
        veiculos: result.veiculos
      });
    });

    return grouped;
  }, [filteredResults]);

  const highlightText = (text: string, search: string) => {
    if (!search) return text;
    
    const regex = new RegExp(`(${search})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };

  React.useEffect(() => {
    // Track page view
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: 'Peças Compatíveis',
        page_location: window.location.href
      });
    }
  }, []);

  React.useEffect(() => {
    // Track search
    if (searchTerm && window.gtag) {
      window.gtag('event', 'search', {
        search_term: searchTerm
      });
    }
  }, [searchTerm]);

  return (
    <>
      <SearchSection>
        <Container>
          <Title>Peças Compatíveis</Title>
          <p style={{ marginBottom: '2rem', color: colors.gray[600] }}>
            Encontre peças compatíveis com seu Golf MK3. Use os filtros abaixo para refinar sua busca.
          </p>
          
          <SearchForm>
            <Input
              type="text"
              placeholder="Buscar por peça ou veículo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Todas as categorias</option>
              {categories.map(categoria => (
                <option key={categoria} value={categoria}>{categoria}</option>
              ))}
            </Select>
            
            <Select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
            >
              <option value="">Todos os veículos</option>
              {allVehicles.slice(0, 20).map(vehicle => (
                <option key={vehicle} value={vehicle}>{vehicle}</option>
              ))}
            </Select>
          </SearchForm>

          <ResultsCount>
            {filteredResults.length} peça(s) encontrada(s)
          </ResultsCount>
        </Container>
      </SearchSection>

      <ResultsSection>
        <Container>
          {Object.keys(groupedResults).length === 0 ? (
            <NoResults>
              <h3>Nenhuma peça encontrada</h3>
              <p>
                Tente ajustar os filtros ou usar termos de busca diferentes. 
                Nossa base de dados está em constante atualização.
              </p>
            </NoResults>
          ) : (
            Object.entries(groupedResults).map(([categoria, pecas]) => (
              <div key={categoria}>
                <CategoryTitle>{categoria}</CategoryTitle>
                <Grid columns={2} gap="1.5rem">
                  {pecas.map((peca, index) => (
                    <PecaCard key={`${categoria}-${index}`}>
                      <h3
                        dangerouslySetInnerHTML={{
                          __html: highlightText(peca.peca, searchTerm)
                        }}
                      />
                      <div className="vehicles">
                        {peca.veiculos.map((veiculo, vIndex) => (
                          <span 
                            key={vIndex}
                            className={`vehicle-tag ${
                              selectedVehicle && veiculo.toLowerCase().includes(selectedVehicle.toLowerCase()) 
                                ? 'highlight' 
                                : ''
                            }`}
                            dangerouslySetInnerHTML={{
                              __html: highlightText(veiculo, searchTerm)
                            }}
                          />
                        ))}
                      </div>
                    </PecaCard>
                  ))}
                </Grid>
              </div>
            ))
          )}
        </Container>
      </ResultsSection>
    </>
  );
};

export default PecasCompativeis;
