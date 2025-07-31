import React, { useState } from 'react';
import styled from 'styled-components';
import { Container, Title, Card, Grid, colors, media } from '../styles/GlobalStyles';
import mapaFusiveisData from '../data/mapa-fusiveis.json';

const DiagramSection = styled.section`
  padding: 2rem 0;
  background: ${colors.gray[50]};
`;

const FuseBoxContainer = styled.div`
  background: ${colors.white};
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const FuseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(11, 1fr);
  gap: 0.5rem;
  margin: 2rem 0;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;

  ${media.mobile} {
    grid-template-columns: repeat(6, 1fr);
  }
`;

const FuseSlot = styled.div<{ $isEmpty?: boolean; $isSelected?: boolean }>`
  aspect-ratio: 1;
  background: ${props => 
    props.$isSelected ? colors.primary : 
    props.$isEmpty ? colors.gray[200] : colors.gray[300]};
  border: 2px solid ${props => 
    props.$isSelected ? colors.red[700] : 
    props.$isEmpty ? colors.gray[300] : colors.gray[400]};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: ${props => props.$isEmpty ? 'default' : 'pointer'};
  transition: all 0.2s;
  color: ${props => 
    props.$isSelected ? colors.white :
    props.$isEmpty ? colors.gray[400] : colors.gray[700]};

  &:hover {
    ${props => !props.$isEmpty && `
      background: ${props.$isSelected ? colors.red[700] : colors.gray[400]};
      transform: translateY(-1px);
    `}
  }
`;

const FuseInfo = styled(Card)`
  margin-top: 2rem;
  
  h3 {
    color: ${colors.primary};
    font-size: 1.25rem;
    margin-bottom: 1rem;
  }

  .info-grid {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 1rem;
    align-items: center;
  }

  .amperage {
    background: ${colors.primary};
    color: ${colors.white};
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-weight: 600;
    font-size: 0.875rem;
  }

  .empty-amperage {
    background: ${colors.gray[300]};
    color: ${colors.gray[600]};
  }
`;

const RelaySection = styled.section`
  padding: 2rem 0;
`;

const RelayCard = styled(Card)`
  h4 {
    color: ${colors.primary};
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  p {
    color: ${colors.gray[600]};
    line-height: 1.5;
    font-size: 0.875rem;
  }
`;

const Legend = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin: 1rem 0;
  font-size: 0.875rem;

  ${media.mobile} {
    flex-direction: column;
    gap: 0.5rem;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    .color-box {
      width: 16px;
      height: 16px;
      border-radius: 2px;
      border: 1px solid ${colors.gray[400]};
    }
  }
`;

const MapaFusiveis: React.FC = () => {
  const [selectedFuse, setSelectedFuse] = useState<string>('1');
  
  const fusePositions = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
    ['12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22']
  ];

  const selectedFuseData = mapaFusiveisData.fusiveis[selectedFuse as keyof typeof mapaFusiveisData.fusiveis];

  React.useEffect(() => {
    // Track page view
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: 'Mapa de Fusíveis',
        page_location: window.location.href
      });
    }
  }, []);

  return (
    <>
      <Container>
        <Title style={{ marginTop: '2rem', textAlign: 'center' }}>
          Mapa de Fusíveis Golf MK3
        </Title>
        <p style={{ textAlign: 'center', color: colors.gray[600], marginBottom: '2rem' }}>
          Clique em um fusível para ver sua função e amperagem
        </p>
      </Container>

      <DiagramSection>
        <Container>
          <FuseBoxContainer>
            <h3 style={{ textAlign: 'center', marginBottom: '1rem', color: colors.gray[800] }}>
              Caixa de Fusíveis
            </h3>
            
            <Legend>
              <div className="legend-item">
                <div className="color-box" style={{ background: colors.gray[300] }}></div>
                <span>Fusível</span>
              </div>
              <div className="legend-item">
                <div className="color-box" style={{ background: colors.primary }}></div>
                <span>Selecionado</span>
              </div>
              <div className="legend-item">
                <div className="color-box" style={{ background: colors.gray[200] }}></div>
                <span>Vazio</span>
              </div>
            </Legend>

            {fusePositions.map((row, rowIndex) => (
              <FuseGrid key={rowIndex}>
                {row.map((position) => {
                  const fuseData = mapaFusiveisData.fusiveis[position as keyof typeof mapaFusiveisData.fusiveis];
                  const isEmpty = !fuseData || fuseData.funcao === '—';
                  
                  return (
                    <FuseSlot
                      key={position}
                      $isEmpty={isEmpty}
                      $isSelected={selectedFuse === position}
                      onClick={() => !isEmpty && setSelectedFuse(position)}
                    >
                      {position}
                    </FuseSlot>
                  );
                })}
              </FuseGrid>
            ))}

            {selectedFuseData && (
              <FuseInfo>
                <h3>Fusível {selectedFuse}</h3>
                <div className="info-grid">
                  <strong>Função:</strong>
                  <span>{selectedFuseData.funcao}</span>
                  <span className={`amperage ${!selectedFuseData.amperagem ? 'empty-amperage' : ''}`}>
                    {selectedFuseData.amperagem ? `${selectedFuseData.amperagem}A` : 'N/A'}
                  </span>
                </div>
              </FuseInfo>
            )}
          </FuseBoxContainer>
        </Container>
      </DiagramSection>

      <RelaySection>
        <Container>
          <Title style={{ textAlign: 'center', marginBottom: '2rem' }}>
            Relés
          </Title>
          
          <Grid columns={3} gap="1.5rem">
            {Object.entries(mapaFusiveisData.reles).map(([posicao, funcao]) => (
              <RelayCard key={posicao}>
                <h4>{posicao}</h4>
                <p>{funcao}</p>
              </RelayCard>
            ))}
          </Grid>
        </Container>
      </RelaySection>
    </>
  );
};

export default MapaFusiveis;
