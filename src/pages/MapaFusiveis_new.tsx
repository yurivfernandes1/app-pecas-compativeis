import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { Container, Card, colors, media } from '../styles/GlobalStyles';
import fusiveisData from '../data/mapa-fusiveis.json';

const PageContainer = styled.div`
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  min-height: 100vh;
  padding: 2rem 0;
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, ${colors.primary} 0%, #dc1818 100%);
  color: ${colors.white};
  padding: 3rem 0;
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
  background: ${colors.white};
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 2px solid transparent;
  transition: all 0.3s ease;
  
  &:focus-within {
    border-color: ${colors.primary};
    box-shadow: 0 8px 32px rgba(220, 38, 38, 0.2);
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1rem 1.5rem;
  border: 2px solid ${colors.gray[200]};
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  background: ${colors.gray[50]};
  
  &:focus {
    outline: none;
    border-color: ${colors.primary};
    background: ${colors.white};
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
  }
  
  &::placeholder {
    color: ${colors.gray[400]};
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  ${media.tablet} {
    grid-template-columns: 1fr 1fr;
  }
`;

const FusiveisListSection = styled.section``;

const DiagramSection = styled.section``;

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

const FusivelCard = styled(Card)<{ $highlighted?: boolean }>`
  margin-bottom: 1rem;
  padding: 1.5rem;
  background: ${props => props.$highlighted ? 
    'linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(220, 38, 38, 0.05) 100%)' : 
    colors.white
  };
  border: 2px solid ${props => props.$highlighted ? colors.primary : 'transparent'};
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-color: ${colors.primary};
  }
`;

const FusivelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const FusivelNumero = styled.span`
  background: ${colors.primary};
  color: ${colors.white};
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
`;

const FusivelAmperagem = styled.span`
  background: ${colors.gray[100]};
  color: ${colors.gray[700]};
  padding: 0.3rem 0.8rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
`;

const FusivelInfo = styled.div`
  h3 {
    color: ${colors.gray[800]};
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: ${colors.gray[600]};
    font-size: 0.9rem;
    line-height: 1.5;
    margin-bottom: 0.3rem;
  }
`;

const DiagramContainer = styled.div`
  background: ${colors.white};
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 100px;
`;

const DiagramImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: ${colors.white};
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 2px solid transparent;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${colors.primary};
    transform: translateY(-2px);
  }
  
  .number {
    font-size: 2rem;
    font-weight: 700;
    color: ${colors.primary};
    display: block;
  }
  
  .label {
    font-size: 0.9rem;
    color: ${colors.gray[600]};
    margin-top: 0.5rem;
  }
`;

const MapaFusiveis: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedFusivel, setHighlightedFusivel] = useState<string | null>(null);

  const filteredFusiveis = useMemo(() => {
    if (!searchTerm) {
      return Object.entries(fusiveisData.fusiveis).map(([numero, data]) => ({
        numero,
        ...data,
        posicao: `Posição ${numero}`
      }));
    }
    
    const term = searchTerm.toLowerCase();
    return Object.entries(fusiveisData.fusiveis)
      .map(([numero, data]) => ({
        numero,
        ...data,
        posicao: `Posição ${numero}`
      }))
      .filter(fusivel => 
        fusivel.funcao.toLowerCase().includes(term) ||
        fusivel.posicao.toLowerCase().includes(term) ||
        (fusivel.amperagem && fusivel.amperagem.toString().includes(term)) ||
        fusivel.numero.toString().includes(term)
      );
  }, [searchTerm]);

  const fusiveisArray = Object.entries(fusiveisData.fusiveis).map(([numero, data]) => ({
    numero,
    ...data
  }));
  
  const totalFusiveis = fusiveisArray.length;
  const totalAmperagem = fusiveisArray.reduce((sum, f) => sum + (f.amperagem || 0), 0);
  const mediaAmperagem = (totalAmperagem / totalFusiveis).toFixed(1);

  return (
    <PageContainer>
      <HeroSection>
        <Container>
          <HeroContent>
            <h1>
              <i className="fas fa-bolt"></i> Mapa de Fusíveis Golf MK3
            </h1>
            <p>
              Localização completa dos fusíveis e relés da caixa do Golf MK3. 
              Consulte função, amperagem e posição de cada componente.
            </p>
          </HeroContent>
        </Container>
      </HeroSection>

      <Container>
        <SearchSection>
          <SearchBox>
            <SearchInput
              type="text"
              placeholder="🔍 Pesquisar por função, posição, amperagem ou número..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchBox>
        </SearchSection>

        <StatsContainer>
          <StatCard>
            <span className="number">{totalFusiveis}</span>
            <span className="label">Total de Fusíveis</span>
          </StatCard>
          <StatCard>
            <span className="number">{filteredFusiveis.length}</span>
            <span className="label">Resultados Encontrados</span>
          </StatCard>
          <StatCard>
            <span className="number">{mediaAmperagem}A</span>
            <span className="label">Amperagem Média</span>
          </StatCard>
        </StatsContainer>

        <ContentGrid>
          <FusiveisListSection>
            <SectionTitle>
              <i className="fas fa-list"></i>
              Lista de Fusíveis e Relés
            </SectionTitle>
            
            {filteredFusiveis.map((fusivel) => (
              <FusivelCard 
                key={fusivel.numero}
                $highlighted={highlightedFusivel === fusivel.numero}
                onMouseEnter={() => setHighlightedFusivel(fusivel.numero)}
                onMouseLeave={() => setHighlightedFusivel(null)}
              >
                <FusivelHeader>
                  <FusivelNumero>#{fusivel.numero}</FusivelNumero>
                  <FusivelAmperagem>{fusivel.amperagem || 'N/A'}A</FusivelAmperagem>
                </FusivelHeader>
                
                <FusivelInfo>
                  <h3>{fusivel.funcao}</h3>
                  <p><strong>Posição:</strong> {fusivel.posicao}</p>
                </FusivelInfo>
              </FusivelCard>
            ))}
            
            {filteredFusiveis.length === 0 && (
              <Card style={{ textAlign: 'center', padding: '2rem' }}>
                <i className="fas fa-search" style={{ fontSize: '3rem', color: colors.gray[400], marginBottom: '1rem' }}></i>
                <h3 style={{ color: colors.gray[600] }}>Nenhum fusível encontrado</h3>
                <p style={{ color: colors.gray[500] }}>Tente uma pesquisa diferente</p>
              </Card>
            )}
          </FusiveisListSection>

          <DiagramSection>
            <SectionTitle>
              <i className="fas fa-project-diagram"></i>
              Diagrama da Caixa
            </SectionTitle>
            
            <DiagramContainer>
              <DiagramImage 
                src="/mapa_fusiveis.png" 
                alt="Diagrama da caixa de fusíveis Golf MK3"
              />
              <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <p style={{ color: colors.gray[600], fontSize: '0.9rem' }}>
                  {highlightedFusivel ? 
                    `Fusível ${highlightedFusivel} destacado` : 
                    'Passe o mouse sobre um fusível para destacá-lo'
                  }
                </p>
              </div>
            </DiagramContainer>
          </DiagramSection>
        </ContentGrid>
      </Container>
    </PageContainer>
  );
};

export default MapaFusiveis;
