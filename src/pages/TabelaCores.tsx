import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { Container, Title, Input, Card, Grid, colors, media } from '../styles/GlobalStyles';
import ScreenProtection from '../components/ScreenProtection';
import coresData from '../data/cores-vw.json';

const SearchSection = styled.section`
  background: ${colors.gray[900]};
  padding: 2rem 0;
  border-bottom: 1px solid ${colors.gray[800]};
`;

const SearchForm = styled.div`
  display: grid;
  grid-template-columns: 1fr 200px;
  gap: 1rem;
  margin-bottom: 2rem;

  ${media.tablet} {
    grid-template-columns: 1fr;
  }
`;

const ColorCard = styled(Card)`
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  background: ${colors.surface};
  border: 1px solid ${colors.gray[800]};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px 0 rgba(220, 38, 38, 0.2);
    border-color: ${colors.primary};
  }

  .color-info {
    display: grid;
    grid-template-columns: 80px 1fr;
    gap: 1rem;
    align-items: center;
  }

  .color-preview {
    width: 80px;
    height: 60px;
    border-radius: 8px;
    border: 2px solid ${colors.gray[700]};
    background: linear-gradient(45deg, 
      ${colors.gray[800]} 25%, 
      transparent 25%, 
      transparent 75%, 
      ${colors.gray[800]} 75%),
    linear-gradient(45deg, 
      ${colors.gray[800]} 25%, 
      ${colors.gray[700]} 25%, 
      ${colors.gray[700]} 75%, 
      ${colors.gray[800]} 75%);
    background-size: 8px 8px;
    background-position: 0 0, 4px 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    color: ${colors.gray[400]};
    font-weight: 500;
  }

  .color-details {
    h3 {
      color: ${colors.white};
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .code {
      background: ${colors.gray[800]};
      color: ${colors.primary};
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-family: monospace;
      font-weight: 600;
      font-size: 0.875rem;
      display: inline-block;
      margin-bottom: 0.5rem;
      border: 1px solid ${colors.gray[700]};
    }

    .meta {
      color: ${colors.gray[400]};
      font-size: 0.875rem;
      
      span {
        margin-right: 1rem;
      }
    }
  }
`;

const NoResults = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${colors.gray[400]};

  h3 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
    color: ${colors.white};
  }
`;

const ResultsCount = styled.div`
  color: ${colors.gray[400]};
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const YearFilter = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${colors.gray[700]};
  border-radius: 6px;
  font-size: 1rem;
  background-color: ${colors.surface};
  color: ${colors.white};
  cursor: pointer;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.2);
  }

  option {
    background-color: ${colors.surface};
    color: ${colors.white};
  }
`;

const ColorModal = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: ${props => props.$isOpen ? 1 : 0};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  padding: 1rem;
`;

const ModalContent = styled.div`
  background: ${colors.surface};
  border: 1px solid ${colors.gray[800]};
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;

  h2 {
    color: ${colors.white};
    margin-bottom: 1rem;
  }

  .close-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: ${colors.gray[400]};

    &:hover {
      color: ${colors.white};
    }
  }
`;

interface Cor {
  codigo: string;
  nome: string;
  ano: string;
  marca: string;
}

const TabelaCores: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedColor, setSelectedColor] = useState<Cor | null>(null);

  const years = useMemo(() => {
    const uniqueYears = Array.from(new Set(coresData.map(cor => cor.ano))).sort();
    return uniqueYears;
  }, []);

  const filteredColors = useMemo(() => {
    return coresData.filter(cor => {
      const matchesSearch = !searchTerm || 
        cor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cor.codigo.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesYear = !selectedYear || cor.ano === selectedYear;
      
      return matchesSearch && matchesYear;
    });
  }, [searchTerm, selectedYear]);

  React.useEffect(() => {
    // Track page view
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: 'Tabela de Cores',
        page_location: window.location.href
      });
    }
  }, []);

  const openModal = (cor: Cor) => {
    setSelectedColor(cor);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedColor(null);
    document.body.style.overflow = 'unset';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Você pode adicionar uma notificação aqui
  };

  return (
    <ScreenProtection>
      <>
      <SearchSection>
        <Container>
          <Title>Tabela de Cores VW</Title>
          <p style={{ marginBottom: '2rem', color: colors.gray[400] }}>
            Encontre o código de cor exato do seu Golf MK3. Use os filtros para refinar sua busca.
          </p>
          
          <SearchForm>
            <Input
              type="text"
              placeholder="Buscar por nome da cor ou código..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <YearFilter
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">Todos os anos</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </YearFilter>
          </SearchForm>

          <ResultsCount>
            {filteredColors.length} cor(es) encontrada(s)
          </ResultsCount>
        </Container>
      </SearchSection>

      <section style={{ padding: '2rem 0' }}>
        <Container>
          {filteredColors.length === 0 ? (
            <NoResults>
              <h3>Nenhuma cor encontrada</h3>
              <p>Tente ajustar os filtros ou usar termos de busca diferentes.</p>
            </NoResults>
          ) : (
            <Grid columns={2} gap="1.5rem">
              {filteredColors.map((cor, index) => (
                <ColorCard key={index} onClick={() => openModal(cor)}>
                  <div className="color-info">
                    <div className="color-preview">
                      Sem imagem
                    </div>
                    <div className="color-details">
                      <h3>{cor.nome}</h3>
                      <div className="code">{cor.codigo}</div>
                      <div className="meta">
                        <span><strong>Ano:</strong> {cor.ano}</span>
                        <span><strong>Marca:</strong> {cor.marca}</span>
                      </div>
                    </div>
                  </div>
                </ColorCard>
              ))}
            </Grid>
          )}
        </Container>
      </section>

      <ColorModal $isOpen={!!selectedColor} onClick={closeModal}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <button className="close-button" onClick={closeModal}>×</button>
          {selectedColor && (
            <>
              <h2>{selectedColor.nome}</h2>
              <div style={{ marginBottom: '1rem' }}>
                <div className="color-preview" style={{ width: '100%', height: '120px', marginBottom: '1rem' }}>
                  Sem imagem disponível
                </div>
              </div>
              
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <strong>Código:</strong>
                  <div 
                    className="code" 
                    style={{ 
                      marginTop: '0.5rem', 
                      cursor: 'pointer',
                      padding: '0.75rem'
                    }}
                    onClick={() => copyToClipboard(selectedColor.codigo)}
                    title="Clique para copiar"
                  >
                    {selectedColor.codigo}
                  </div>
                </div>
                
                <div>
                  <strong>Ano:</strong> {selectedColor.ano}
                </div>
                
                <div>
                  <strong>Marca:</strong> {selectedColor.marca}
                </div>
              </div>

              <div style={{ 
                marginTop: '2rem', 
                padding: '1rem', 
                background: colors.gray[800], 
                borderRadius: '8px',
                fontSize: '0.875rem',
                color: colors.gray[300],
                border: `1px solid ${colors.gray[700]}`
              }}>
                <strong>Dica:</strong> Sempre confirme o código de cor com um profissional 
                antes de fazer a compra da tinta. Clique no código para copiá-lo.
              </div>
            </>
          )}
        </ModalContent>
      </ColorModal>
    </>
    </ScreenProtection>
  );
};

export default TabelaCores;
