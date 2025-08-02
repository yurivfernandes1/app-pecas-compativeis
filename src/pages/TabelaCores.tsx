import React, { useState, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { Container, Title, Input, Card, Grid, colors, media } from '../styles/GlobalStyles';
import ScreenProtection from '../components/ScreenProtection';
import coresData from '../data/cores-vw.json';

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

const SearchSection = styled.section`
  background: ${colors.gray[900]};
  padding: 2rem 0;
  border-bottom: 1px solid ${colors.gray[800]};
  
  ${media.mobile} {
    padding: 1.5rem 0;
  }
`;

const SearchForm = styled.div`
  display: grid;
  grid-template-columns: 1fr 200px;
  gap: 1rem;
  margin-bottom: 2rem;

  ${media.tablet} {
    grid-template-columns: 1fr;
  }
  
  ${media.mobile} {
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }
`;

const ColorCard = styled(Card)`
  transition: all 0.3s ease;
  cursor: pointer;
  background: ${colors.surface};
  border: 2px solid transparent;
  border-left: 4px solid ${colors.primary};
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 0.6s ease-out;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(220, 38, 38, 0.25);
    border-color: ${colors.primary};
    background: linear-gradient(135deg, rgba(220, 38, 38, 0.05) 0%, rgba(220, 38, 38, 0.02) 100%);
  }

  .color-info {
    display: grid;
    grid-template-columns: 80px 1fr;
    gap: 1rem;
    align-items: center;
    
    ${media.mobile} {
      grid-template-columns: 60px 1fr;
      gap: 0.75rem;
    }
  }

  .color-preview {
    width: 80px;
    height: 60px;
    border-radius: 8px;
    border: 2px solid ${colors.gray[700]};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    color: ${colors.gray[400]};
    font-weight: 500;
    position: relative;
    overflow: hidden;
    
    ${media.mobile} {
      width: 60px;
      height: 45px;
      font-size: 0.65rem;
    }
    
    &.has-color {
      border-color: ${colors.gray[600]};
    }
    
    .color-swatch {
      width: 100%;
      height: 100%;
      border-radius: 6px;
    }
    
    .color-code {
      position: absolute;
      bottom: 2px;
      right: 2px;
      font-size: 0.6rem;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 1px 3px;
      border-radius: 2px;
      font-family: monospace;
      
      ${media.mobile} {
        font-size: 0.5rem;
        padding: 1px 2px;
      }
    }
  }

  .color-details {
    h3 {
      color: ${colors.white};
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      
      ${media.mobile} {
        font-size: 1rem;
        margin-bottom: 0.3rem;
      }
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
      
      ${media.mobile} {
        font-size: 0.75rem;
        padding: 0.2rem 0.4rem;
      }
    }

    .meta {
      color: ${colors.gray[400]};
      font-size: 0.875rem;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
      
      ${media.mobile} {
        font-size: 0.8rem;
        grid-template-columns: 1fr;
        gap: 0.3rem;
      }
      
      .info-item {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        
        .label {
          font-weight: 600;
          color: ${colors.gray[300]};
          
          ${media.mobile} {
            font-size: 0.75rem;
          }
        }
        
        .value {
          color: ${colors.gray[400]};
          
          ${media.mobile} {
            font-size: 0.75rem;
          }
          
          &.vw-code {
            background: ${colors.gray[800]};
            color: ${colors.primary};
            padding: 0.125rem 0.375rem;
            border-radius: 3px;
            font-family: monospace;
            font-size: 0.75rem;
            font-weight: 600;
            display: inline-block;
            width: fit-content;
            
            ${media.mobile} {
              font-size: 0.65rem;
              padding: 0.1rem 0.3rem;
            }
          }
          
          &.observacao {
            font-style: italic;
            color: ${colors.gray[500]};
          }
        }
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

const YearSection = styled.div`
  margin-bottom: 2rem;
  border: 1px solid ${colors.gray[800]};
  border-radius: 15px;
  overflow: hidden;
  background: ${colors.surface};
  border-left: 4px solid ${colors.primary};
  animation: fadeIn 0.6s ease-out;
  
  ${media.mobile} {
    margin-bottom: 1.5rem;
    border-radius: 12px;
  }
`;

const YearHeader = styled.button`
  width: 100%;
  padding: 1.5rem;
  background: ${colors.surface};
  border: none;
  color: ${colors.white};
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.125rem;
  font-weight: 600;
  transition: all 0.3s ease;
  border: 2px solid transparent;

  ${media.mobile} {
    padding: 1rem;
    font-size: 1rem;
  }

  &:hover {
    background: linear-gradient(135deg, rgba(220, 38, 38, 0.15) 0%, rgba(220, 38, 38, 0.08) 100%);
    border-color: ${colors.primary};
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(220, 38, 38, 0.15);
  }

  .year-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    
    ${media.mobile} {
      gap: 0.75rem;
    }
  }

  .year-count {
    background: ${colors.primary};
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 500;
    
    ${media.mobile} {
      font-size: 0.7rem;
      padding: 0.2rem 0.4rem;
    }
  }

  .chevron {
    transition: transform 0.3s ease;
    font-size: 1.25rem;
    color: ${colors.primary};
    
    ${media.mobile} {
      font-size: 1.1rem;
    }
    
    &.expanded {
      transform: rotate(180deg);
    }
  }
`;

const YearContent = styled.div<{ isExpanded: boolean }>`
  overflow: hidden;
  opacity: ${props => props.isExpanded ? '1' : '0'};
  max-height: ${props => props.isExpanded ? '2000px' : '0'};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: ${colors.surface};
  border-bottom: 2px solid ${colors.primary};
  padding: ${props => props.isExpanded ? '1.5rem' : '0'};
  
  ${media.mobile} {
    padding: ${props => props.isExpanded ? '1rem' : '0'};
    max-height: ${props => props.isExpanded ? 'none' : '0'};
    transition: all 0.3s ease;
  }

  .content-inner {
    min-height: 0;
    height: auto;
    
    ${media.mobile} {
      display: ${props => props.isExpanded ? 'block' : 'none'};
    }
  }
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
  cor: string;
  observacao: string;
  codigoVW: string;
}

const TabelaCores: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedColor, setSelectedColor] = useState<Cor | null>(null);
  const [expandedYears, setExpandedYears] = useState<Set<string>>(new Set()); // Todos os anos colapsados por padrão

  const years = useMemo(() => {
    const uniqueYears = Array.from(new Set(coresData.map(cor => cor.ano))).sort();
    return uniqueYears;
  }, []);

  const filteredColors = useMemo(() => {
    return coresData.filter(cor => {
      const matchesSearch = !searchTerm || 
        cor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cor.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cor.codigoVW.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cor.observacao.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesYear = !selectedYear || cor.ano === selectedYear;
      
      return matchesSearch && matchesYear;
    });
  }, [searchTerm, selectedYear]);

  // Agrupa as cores por ano
  const colorsByYear = useMemo(() => {
    const grouped: { [key: string]: Cor[] } = {};
    filteredColors.forEach(cor => {
      if (!grouped[cor.ano]) {
        grouped[cor.ano] = [];
      }
      grouped[cor.ano].push(cor);
    });
    
    // Ordena os anos de forma decrescente e as cores dentro de cada ano por nome
    const sortedGroups: { [key: string]: Cor[] } = {};
    Object.keys(grouped)
      .sort((a, b) => parseInt(b) - parseInt(a))
      .forEach(year => {
        sortedGroups[year] = grouped[year].sort((a, b) => a.nome.localeCompare(b.nome));
      });
    
    return sortedGroups;
  }, [filteredColors]);

  // Reset expandedYears quando um ano específico é selecionado no filtro
  React.useEffect(() => {
    if (selectedYear) {
      setExpandedYears(new Set([selectedYear]));
    } else {
      setExpandedYears(new Set()); // Todos colapsados por padrão
    }
  }, [selectedYear]);

  const toggleYear = (year: string) => {
    const newExpanded = new Set(expandedYears);
    if (newExpanded.has(year)) {
      newExpanded.delete(year);
    } else {
      newExpanded.add(year);
    }
    setExpandedYears(newExpanded);
  };

  const expandAllYears = () => {
    setExpandedYears(new Set(Object.keys(colorsByYear)));
  };

  const collapseAllYears = () => {
    setExpandedYears(new Set());
  };

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
      <SearchSection data-testid="tabela-cores-page">
        <Container>
          <Title data-testid="page-title">Tabela de Cores VW</Title>
          <p style={{ marginBottom: '2rem', color: colors.gray[400] }}>
            Encontre o código de cor exato do seu Golf MK3. Use os filtros para refinar sua busca.
          </p>
          
          <SearchForm>
            <Input
              data-testid="search-input"
              type="text"
              placeholder="Buscar por nome, código de tinta, código VW ou tipo..."
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
            {filteredColors.length} cor(es) encontrada(s) em {Object.keys(colorsByYear).length} ano(s)
          </ResultsCount>

          {Object.keys(colorsByYear).length > 1 && (
            <div style={{ 
              display: 'flex', 
              gap: '0.5rem', 
              marginBottom: '1rem',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={expandAllYears}
                style={{
                  padding: '0.5rem 1rem',
                  background: colors.primary,
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                Expandir Todos
              </button>
              <button
                onClick={collapseAllYears}
                style={{
                  padding: '0.5rem 1rem',
                  background: colors.gray[700],
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}
              >
                Colapsar Todos
              </button>
            </div>
          )}
        </Container>
      </SearchSection>

      <section style={{ padding: '2rem 0' }}>
        <Container>
          {Object.keys(colorsByYear).length === 0 ? (
            <NoResults>
              <h3>Nenhuma cor encontrada</h3>
              <p>Tente ajustar os filtros ou usar termos de busca diferentes.</p>
            </NoResults>
          ) : (
            <div>
              {Object.entries(colorsByYear).map(([year, cores]) => (
                <YearSection key={year}>
                  <YearHeader onClick={() => toggleYear(year)}>
                    <div className="year-info">
                      <span>Ano {year}</span>
                      <span className="year-count">{cores.length}</span>
                    </div>
                    <span className={`chevron ${expandedYears.has(year) ? 'expanded' : ''}`}>
                      ▼
                    </span>
                  </YearHeader>
                  <YearContent isExpanded={expandedYears.has(year)}>
                    <div className="content-inner">
                      <Grid columns={2} gap="1.5rem">
                        {cores.map((cor, index) => (
                          <ColorCard key={`${year}-${index}`} onClick={() => openModal(cor)}>
                            <div className="color-info">
                              <div className={`color-preview ${cor.cor ? 'has-color' : ''}`}>
                                {cor.cor ? (
                                  <>
                                    <div 
                                      className="color-swatch" 
                                      style={{ backgroundColor: cor.cor }}
                                      title={`Cor: ${cor.cor}`}
                                    />
                                    <div className="color-code">{cor.codigoVW}</div>
                                  </>
                                ) : (
                                  'Sem cor'
                                )}
                              </div>
                              <div className="color-details">
                                <h3>{cor.nome}</h3>
                                <div className="code">{cor.codigo}</div>
                                <div className="meta">
                                  <div className="info-item">
                                    <span className="label">Ano:</span>
                                    <span className="value">{cor.ano}</span>
                                  </div>
                                  <div className="info-item">
                                    <span className="label">Código VW:</span>
                                    <span className="value vw-code">{cor.codigoVW}</span>
                                  </div>
                                  <div className="info-item">
                                    <span className="label">Tipo:</span>
                                    <span className="value observacao">{cor.observacao}</span>
                                  </div>
                                  <div className="info-item">
                                    <span className="label">Marca:</span>
                                    <span className="value">{cor.marca}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </ColorCard>
                        ))}
                      </Grid>
                    </div>
                  </YearContent>
                </YearSection>
              ))}
            </div>
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
                <div 
                  className="color-preview" 
                  style={{ 
                    width: '100%', 
                    height: '120px', 
                    marginBottom: '1rem',
                    backgroundColor: selectedColor.cor || colors.gray[800],
                    border: `2px solid ${colors.gray[600]}`,
                    borderRadius: '8px',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {!selectedColor.cor && (
                    <span style={{ color: colors.gray[400] }}>Cor não disponível</span>
                  )}
                  {selectedColor.cor && (
                    <div style={{
                      position: 'absolute',
                      bottom: '8px',
                      right: '8px',
                      background: 'rgba(0, 0, 0, 0.7)',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontFamily: 'monospace',
                      fontSize: '0.875rem'
                    }}>
                      {selectedColor.cor}
                    </div>
                  )}
                </div>
              </div>
              
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <strong>Código de Tinta:</strong>
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
                  <strong>Código VW:</strong>
                  <div 
                    style={{ 
                      marginTop: '0.5rem',
                      background: colors.gray[800],
                      color: colors.primary,
                      padding: '0.75rem',
                      borderRadius: '4px',
                      fontFamily: 'monospace',
                      fontWeight: '600',
                      cursor: 'pointer',
                      border: `1px solid ${colors.gray[700]}`
                    }}
                    onClick={() => copyToClipboard(selectedColor.codigoVW)}
                    title="Clique para copiar"
                  >
                    {selectedColor.codigoVW}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <strong>Ano:</strong> {selectedColor.ano}
                  </div>
                  
                  <div>
                    <strong>Tipo:</strong> <em>{selectedColor.observacao}</em>
                  </div>
                </div>
                
                <div>
                  <strong>Marca:</strong> {selectedColor.marca}
                </div>

                {selectedColor.cor && (
                  <div>
                    <strong>Código Hexadecimal:</strong>
                    <div 
                      style={{ 
                        marginTop: '0.5rem',
                        background: colors.gray[800],
                        color: colors.white,
                        padding: '0.75rem',
                        borderRadius: '4px',
                        fontFamily: 'monospace',
                        cursor: 'pointer',
                        border: `1px solid ${colors.gray[700]}`
                      }}
                      onClick={() => copyToClipboard(selectedColor.cor)}
                      title="Clique para copiar"
                    >
                      {selectedColor.cor}
                    </div>
                  </div>
                )}
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
                antes de fazer a compra da tinta. Clique nos códigos para copiá-los.
                {selectedColor.observacao !== '---' && (
                  <>
                    <br /><br />
                    <strong>Observação:</strong> Esta cor é do tipo <em>{selectedColor.observacao}</em>.
                  </>
                )}
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
