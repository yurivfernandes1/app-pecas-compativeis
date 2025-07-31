import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Container, Title, Button, Card, Grid, colors, media } from '../styles/GlobalStyles';

const PageWrapper = styled.div`
  background: ${colors.background};
  min-height: 100vh;
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.red[700]} 100%);
  color: ${colors.white};
  padding: 4rem 0;
  text-align: center;

  ${media.mobile} {
    padding: 2rem 0;
  }
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  
  ${media.mobile} {
    font-size: 2rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;

  ${media.mobile} {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
`;

const FeaturesSection = styled.section`
  padding: 4rem 0;
  background: ${colors.gray[900]};

  ${media.mobile} {
    padding: 2rem 0;
  }

  @media (max-width: 600px) {
    padding: 1.2rem 0;
  }
`;

const FeatureCard = styled(Card)`
  text-align: center;
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  background: ${colors.surface};
  border: 1px solid ${colors.gray[800]};

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px 0 rgba(220, 38, 38, 0.2);
    border-color: ${colors.primary};
  }

  h3 {
    color: ${colors.primary};
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  p {
    color: ${colors.gray[300]};
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }

  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    display: block;
  }

  @media (max-width: 600px) {
    padding: 1rem 0.5rem;
    h3 {
      font-size: 1.1rem;
    }
    .icon {
      font-size: 2.2rem;
    }
    p {
      font-size: 0.95rem;
    }
  }
`;

const StatsSection = styled.section`
  background: ${colors.gray[800]};
  padding: 3rem 0;

  ${media.mobile} {
    padding: 2rem 0;
  }
`;

const StatCard = styled.div`
  text-align: center;
  
  .number {
    font-size: 2.5rem;
    font-weight: 700;
    color: ${colors.primary};
    display: block;
    margin-bottom: 0.5rem;
  }

  .label {
    color: ${colors.gray[300]};
    font-weight: 500;
  }

  ${media.mobile} {
    .number {
      font-size: 2rem;
    }
  }
`;

const CTASection = styled.section`
  background: ${colors.gray[900]};
  color: ${colors.white};
  padding: 3rem 0;
  text-align: center;
  border-top: 1px solid ${colors.gray[700]};

  h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: ${colors.white};
  }

  p {
    font-size: 1.125rem;
    margin-bottom: 2rem;
    opacity: 0.9;
    color: ${colors.gray[300]};
  }

  ${media.mobile} {
    padding: 2rem 0;
    
    h2 {
      font-size: 1.5rem;
    }
    
    p {
      font-size: 1rem;
    }
  }
`;

const Home: React.FC = () => {
  React.useEffect(() => {
    // Track page view
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: 'Home',
        page_location: window.location.href
      });
    }
  }, []);

  return (
    <PageWrapper>
      <HeroSection>
        <Container>
          <HeroTitle>Peças Compatíveis para Golf MK3</HeroTitle>
          <HeroSubtitle>
            Encontre facilmente peças compatíveis com seu Volkswagen Golf MK3. 
            Base de dados completa e verificada para facilitar suas pesquisas.
          </HeroSubtitle>
          <Button as={Link} to="/pecas" variant="primary">
            Buscar Peças Agora
          </Button>
        </Container>
      </HeroSection>

      <FeaturesSection>
        <Container>
          <Title style={{ textAlign: 'center', marginBottom: '2rem' }}>
            Funcionalidades Principais
          </Title>
          <Grid columns={3} gap="2rem" style={{
            gridTemplateColumns: 'repeat(3, 1fr)',
            ...(window.innerWidth < 900 ? { gridTemplateColumns: '1fr' } : {}),
            ...(window.innerWidth < 600 ? { gap: '1rem' } : {})
          }}>
            <FeatureCard as={Link} to="/pecas" style={{ textDecoration: 'none', color: 'inherit' }}>
              <span className="icon">🔧</span>
              <h3>Peças Compatíveis</h3>
              <p>
                Consulte nossa base de dados completa com centenas de peças compatíveis 
                organizadas por categoria para facilitar sua busca.
              </p>
              <Button variant="secondary">Explorar Peças</Button>
            </FeatureCard>

            <FeatureCard as={Link} to="/fusiveis" style={{ textDecoration: 'none', color: 'inherit' }}>
              <span className="icon">⚡</span>
              <h3>Mapa de Fusíveis</h3>
              <p>
                Acesse o diagrama completo da caixa de fusíveis e relés do Golf MK3 
                com funções e amperagens detalhadas.
              </p>
              <Button variant="secondary">Ver Mapa</Button>
            </FeatureCard>

            <FeatureCard as={Link} to="/cores" style={{ textDecoration: 'none', color: 'inherit' }}>
              <span className="icon">🎨</span>
              <h3>Tabela de Cores</h3>
              <p>
                Encontre o código de cor exato do seu Golf MK3 com nossa tabela 
                completa de códigos VW por ano e modelo.
              </p>
              <Button variant="secondary">Ver Cores</Button>
            </FeatureCard>
          </Grid>
        </Container>
      </FeaturesSection>

      <StatsSection>
        <Container>
          <Grid columns={4} gap="2rem">
            <StatCard>
              <span className="number">500+</span>
              <span className="label">Peças Catalogadas</span>
            </StatCard>
            <StatCard>
              <span className="number">22</span>
              <span className="label">Fusíveis Mapeados</span>
            </StatCard>
            <StatCard>
              <span className="number">60+</span>
              <span className="label">Códigos de Cores</span>
            </StatCard>
            <StatCard>
              <span className="number">100%</span>
              <span className="label">Dados Verificados</span>
            </StatCard>
          </Grid>
        </Container>
      </StatsSection>

      <CTASection>
        <Container>
          <h2>Compartilhe com Outros Entusiastas</h2>
          <p>
            Ajude outros proprietários de Golf MK3 a encontrar as peças que precisam. 
            Compartilhe este app e faça parte da comunidade!
          </p>
          <Button 
            variant="primary" 
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Golf MK3 Peças Compatíveis',
                  text: 'Encontre peças compatíveis para seu Golf MK3',
                  url: window.location.href
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copiado para a área de transferência!');
              }
            }}
          >
            Compartilhar App
          </Button>
        </Container>
      </CTASection>
    </PageWrapper>
  );
};

export default Home;
