import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Container, Title, Button, Card, Grid, colors, media } from '../styles/GlobalStyles';
import { logger } from '../utils';
import { useAppMonitoring } from '../hooks';
import { useAppStats } from '../utils/appStats';
import produtosData from '../data/produtos-shopee.json';

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

const DocsSection = styled.section`
  background: ${colors.surface};
  padding: 3rem 0;
  border-top: 1px solid ${colors.gray[800]};
  display: flex;
  justify-content: center;

  .docs {
    text-align: center;
    max-width: 760px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 0 1rem;
  }

  .docIcon {
    font-size: 2.4rem;
    line-height: 1;
    margin-bottom: 0.25rem;
    display: block;
  }

  h3 {
    font-size: 1.6rem;
    color: ${colors.primary};
    margin: 0;
    font-weight: 700;
  }

  p {
    color: ${colors.gray[400]};
    margin: 0;
    line-height: 1.4;
  }

  a[role="button"] {
    margin-top: 0.75rem;
  }

  ${media.mobile} {
    padding: 1.5rem 0;
    .docIcon {
      font-size: 2rem;
    }
    h3 {
      font-size: 1.25rem;
    }
  }
`;

const ProductsSection = styled.section`
  background: ${colors.gray[900]};
  padding: 3rem 0;
  border-top: 1px solid ${colors.gray[800]};

  ${media.mobile} {
    padding: 2rem 0;
  }
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2rem;
  color: ${colors.white};
  margin-bottom: 1rem;
  
  ${media.mobile} {
    font-size: 1.5rem;
  }
`;

const SectionSubtitle = styled.p`
  text-align: center;
  color: ${colors.gray[300]};
  margin-bottom: 2.5rem;
  font-size: 1.1rem;
  
  ${media.mobile} {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  ${media.mobile} {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const ProductCard = styled.a`
  background: ${colors.surface};
  border: 1px solid ${colors.gray[800]};
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(220, 38, 38, 0.3);
    border-color: ${colors.primary};
  }
`;

const ProductImage = styled.div`
  width: 100%;
  height: 200px;
  background: ${colors.gray[900]};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProductInfo = styled.div`
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  
  h3 {
    color: ${colors.white};
    font-size: 1rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }
  
  p {
    color: ${colors.gray[400]};
    font-size: 0.9rem;
    line-height: 1.4;
    margin-bottom: 1rem;
    flex: 1;
  }
`;

const ProductButton = styled.div`
  background: ${colors.primary};
  color: ${colors.white};
  padding: 0.65rem 1.25rem;
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${colors.red[600]};
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
  }
`;

const ViewMoreButton = styled(Button)`
  display: block;
  margin: 0 auto;
  max-width: 300px;
  text-align: center;
`;

const Home: React.FC = () => {
  const { logUserInteraction } = useAppMonitoring('Home');
  const stats = useAppStats();
  const [randomProducts, setRandomProducts] = React.useState<typeof produtosData>([]);

  React.useEffect(() => {
    // Seleciona 3 produtos aleatórios
    const shuffled = [...produtosData].sort(() => 0.5 - Math.random());
    setRandomProducts(shuffled.slice(0, 3));
  }, []);

  React.useEffect(() => {
    // Log da visualização da página
    logger.info('Página Home carregada', 'Home', {
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      url: window.location.href
    });

    // Track page view
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: 'Home',
        page_location: window.location.href
      });
      logger.debug('Google Analytics page view tracked', 'Home');
    }
  }, []);

  const handleFeatureClick = (featureName: string, url: string) => {
    logUserInteraction(`feature_click_${featureName.toLowerCase().replace(/\s+/g, '_')}`, {
      feature: featureName,
      destinationUrl: url,
      timestamp: new Date().toISOString()
    });
  };

  const handleShareClick = () => {
    logUserInteraction('share_button_click', {});
    
    if (navigator.share) {
      navigator.share({
        title: 'Golf MK3 Peças Compatíveis',
        text: 'Encontre peças compatíveis para seu Golf MK3',
        url: window.location.href
      }).then(() => {
        logUserInteraction('share_success_web_api', {});
      }).catch((error) => {
        logger.error('Erro ao compartilhar via Web Share API', 'Home', error);
      });
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Link copiado para a área de transferência!');
        logUserInteraction('share_success_clipboard', {});
      }).catch((error) => {
        logger.error('Erro ao copiar link para clipboard', 'Home', error);
      });
    }
  };

  return (
    <PageWrapper data-testid="home-page">
      <HeroSection>
        <Container>
          <HeroTitle data-testid="hero-title">Peças Compatíveis para Golf MK3</HeroTitle>
          <HeroSubtitle>
            Encontre facilmente peças compatíveis com seu Volkswagen Golf MK3. 
            Base de dados com {stats.totalPecas} peças verificadas para facilitar suas pesquisas.
          </HeroSubtitle>
          <Button as={Link} to="/pecas" variant="primary" data-testid="search-parts-button">
            Buscar Peças Agora
          </Button>
        </Container>
      </HeroSection>

      <FeaturesSection>
        <Container>
          <Title style={{ textAlign: 'center', marginBottom: '2rem' }}>
            Funcionalidades Principais
          </Title>
          <Grid columns={3} gap="2rem" data-testid="features-grid">
            <FeatureCard 
              as={Link} 
              to="/pecas" 
              style={{ textDecoration: 'none', color: 'inherit' }}
              onClick={() => handleFeatureClick('Peças Compatíveis', '/pecas')}
              data-testid="feature-pecas"
            >
              <span className="icon">🔧</span>
              <h3>Peças Compatíveis</h3>
              <p>
                Consulte nossa base de dados com {stats.totalPecas} peças compatíveis 
                organizadas por categoria para facilitar sua busca.
              </p>
              <Button variant="secondary">Explorar Peças</Button>
            </FeatureCard>

            <FeatureCard 
              as={Link} 
              to="/fusiveis" 
              style={{ textDecoration: 'none', color: 'inherit' }}
              onClick={() => handleFeatureClick('Mapa de Fusíveis', '/fusiveis')}
            >
              <span className="icon">⚡</span>
              <h3>Mapa de Fusíveis</h3>
              <p>
                Acesse o diagrama completo da caixa de fusíveis e relés do Golf MK3 
                com funções e amperagens detalhadas.
              </p>
              <Button variant="secondary">Ver Mapa</Button>
            </FeatureCard>

            <FeatureCard 
              as={Link} 
              to="/cores" 
              style={{ textDecoration: 'none', color: 'inherit' }}
              onClick={() => handleFeatureClick('Tabela de Cores', '/cores')}
            >
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
            <StatCard data-testid="stat-pecas">
              <span className="number">{stats.totalPecas}</span>
              <span className="label">Peças Catalogadas</span>
            </StatCard>
            <StatCard data-testid="stat-fusiveis">
              <span className="number">{stats.totalFusiveis}</span>
              <span className="label">Fusíveis Mapeados</span>
            </StatCard>
            <StatCard data-testid="stat-cores">
              <span className="number">{stats.totalCores}</span>
              <span className="label">Códigos de Cores</span>
            </StatCard>
            <StatCard data-testid="stat-verificacao">
              <span className="number">{stats.dataVerification}</span>
              <span className="label">Dados Verificados</span>
            </StatCard>
          </Grid>
        </Container>
      </StatsSection>

      <ProductsSection>
        <Container>
          <SectionTitle>🛒 Produtos em Destaque</SectionTitle>
          <SectionSubtitle>
            Confira alguns produtos para o seu Golf MK3
          </SectionSubtitle>
          <ProductsGrid>
            {randomProducts.map((produto) => (
              <ProductCard
                key={produto.id}
                href={produto.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => logUserInteraction('product_click', { 
                  productId: produto.id,
                  productName: produto.nome 
                })}
              >
                <ProductImage>
                  <img src={produto.imagem} alt={produto.nome} />
                </ProductImage>
                <ProductInfo>
                  <h3>{produto.nome}</h3>
                  <p>{produto.descricao}</p>
                  <ProductButton>Ver na Shopee</ProductButton>
                </ProductInfo>
              </ProductCard>
            ))}
          </ProductsGrid>
          <ViewMoreButton 
            as={Link} 
            to="/produtos" 
            variant="primary"
            onClick={() => logUserInteraction('view_more_products_click', {})}
          >
            Ver Todos os Produtos →
          </ViewMoreButton>
        </Container>
      </ProductsSection>

      <CTASection>
        <Container>
          <h2>Compartilhe com Outros Entusiastas</h2>
          <p>
            Ajude outros proprietários de Golf MK3 a encontrar as peças que precisam. 
            Compartilhe este app e faça parte da comunidade!
          </p>
          <Button 
            variant="primary" 
            onClick={handleShareClick}
          >
            Compartilhar App
          </Button>
        </Container>
      </CTASection>
      <DocsSection>
        <Container>
          <div className="docs">
            <span className="docIcon" aria-hidden>📄</span>
            <h3>Documentos Golf MK3</h3>
            <p>Acesse documentos úteis, manuais e referências do Golf MK3.</p>
            <Button
              as="a"
              href="https://drive.google.com/drive/u/0/folders/1b-gDeYOAiJFC42XdfN5CcnloT9QkgTfV"
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              onClick={() => handleFeatureClick('Documentos Golf MK3', 'https://drive.google.com/drive/u/0/folders/1b-gDeYOAiJFC42XdfN5CcnloT9QkgTfV')}
              data-testid="docs-golf-link"
              role="button"
            >
              Abrir Documentos
            </Button>
          </div>
        </Container>
      </DocsSection>
    </PageWrapper>
  );
};

export default Home;
