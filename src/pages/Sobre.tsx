import React from 'react';
import styled from 'styled-components';
import { Container, Card, colors, media } from '../styles/GlobalStyles';
import { useAppStats } from '../utils/appStats';

const AboutSection = styled.section`
  padding: 2rem 0;
  
  ${media.mobile} {
    padding: 1rem 0;
  }
`;

const HeroCard = styled(Card)`
  background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.red[700]} 100%);
  color: ${colors.white};
  text-align: center;
  margin-bottom: 3rem;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 1.125rem;
    opacity: 0.9;
    max-width: 600px;
    margin: 0 auto;
  }

  ${media.mobile} {
    h1 {
      font-size: 2rem;
    }
    
    p {
      font-size: 1rem;
    }
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  ${media.desktop} {
    grid-template-columns: 2fr 1fr;
  }
  
  ${media.mobile} {
    gap: 1.5rem;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SidebarContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const InfoCard = styled(Card)`
  h2 {
    color: ${colors.primary};
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  h3 {
    color: ${colors.white};
    font-size: 1.25rem;
    margin: 1.5rem 0 0.75rem;
  }

  p, li {
    color: ${colors.gray[300]};
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  ul {
    padding-left: 1.5rem;
    margin-bottom: 1rem;
  }

  .highlight {
    background: ${colors.gray[800]};
    color: ${colors.primary};
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-weight: 600;
    border: 1px solid ${colors.gray[700]};
  }
`;

const StatCard = styled(Card)`
  text-align: center;
  
  .number {
    font-size: 2rem;
    font-weight: 700;
    color: ${colors.primary};
    display: block;
    margin-bottom: 0.5rem;
  }

  .label {
    color: ${colors.gray[300]};
    font-weight: 500;
    font-size: 0.875rem;
  }
`;

const TeamCard = styled(Card)`
  text-align: center;

  .avatar {
    width: 120px;
    height: 120px;
    background: ${colors.primary};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
    overflow: hidden;
    border: 3px solid ${colors.primary};
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  h3 {
    color: ${colors.white};
    margin-bottom: 0.5rem;
  }

  .role {
    color: ${colors.primary};
    font-weight: 600;
    margin-bottom: 1rem;
  }

  p {
    color: ${colors.gray[300]};
    font-size: 0.875rem;
    line-height: 1.5;
  }
`;

const TechStack = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin: 1.5rem 0;
  flex-wrap: wrap;

  ${media.mobile} {
    gap: 1.5rem;
  }

  .tech {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-4px);
    }
    
    i {
      font-size: 3rem;
      color: ${colors.primary};
      transition: all 0.3s ease;
      
      ${media.mobile} {
        font-size: 2.5rem;
      }
    }
    
    span {
      font-size: 0.875rem;
      font-weight: 600;
      color: ${colors.gray[300]};
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    &:hover i {
      color: ${colors.red[500]};
      transform: scale(1.1);
    }
  }
`;

const ContactLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const ContactLink = styled.a`
  color: ${colors.white};
  font-size: 2rem;
  transition: all 0.3s ease;
  padding: 0.75rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 60px;
  min-height: 60px;
  background: ${colors.gray[800]};
  border: 2px solid ${colors.gray[700]};
  text-decoration: none;
  
  &:hover {
    color: ${colors.primary};
    background: rgba(220, 38, 38, 0.1);
    transform: translateY(-4px);
    border-color: ${colors.primary};
    box-shadow: 0 6px 20px rgba(220, 38, 38, 0.3);
  }
`;

const Sobre: React.FC = () => {
  const stats = useAppStats();
  
  React.useEffect(() => {
    // Track page view
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_title: 'Sobre',
        page_location: window.location.href
      });
    }
  }, []);

  return (
    <AboutSection data-testid="sobre-page">
      <Container>
        <HeroCard>
          <h1 data-testid="page-title">Sobre o Projeto</h1>
          <p>
            Recriando e modernizando a experiência de busca por peças compatíveis 
            para Volkswagen Golf MK3 com tecnologia atual e design responsivo.
          </p>
        </HeroCard>

        <ContentGrid>
          <MainContent>
            <InfoCard>
              <h2>Visão Geral do Projeto</h2>
              <p>
                O <span className="highlight">Golf MK3 Peças Compatíveis</span> é uma aplicação 
                web desenvolvida para resolver a dor latente dos proprietários de Golf MK3 que 
                precisam encontrar peças compatíveis de outros veículos.
              </p>
              
              <p>
                Oferecemos uma base de dados completa e acessível através de uma interface 
                moderna e intuitiva, recriando uma solução que existia anteriormente no mercado 
                mas com tecnologia atualizada.
              </p>

              <h3>Objetivo Principal</h3>
              <p>
                Facilitar a vida dos entusiastas e proprietários de Golf MK3, fornecendo 
                informações precisas e organizadas sobre:
              </p>
              <ul>
                <li>Peças compatíveis por categoria</li>
                <li>Códigos e funções dos fusíveis</li>
                <li>Tabela completa de cores VW</li>
                <li>Referências de compatibilidade verificadas</li>
              </ul>

              <h3>Diferenciais</h3>
              <ul>
                <li><strong>100% Gratuito:</strong> Acesso livre a todas as funcionalidades</li>
                <li><strong>Responsivo:</strong> Funciona perfeitamente em mobile, tablet e desktop</li>
                <li><strong>Dados Verificados:</strong> Informações baseadas em fontes confiáveis</li>
                <li><strong>Busca Avançada:</strong> Filtros por categoria, veículo e termo de busca</li>
                <li><strong>Interface Moderna:</strong> Design clean e fácil navegação</li>
              </ul>
            </InfoCard>

            <InfoCard>
              <h2>Tecnologias Utilizadas</h2>
              <p>
                Desenvolvido seguindo os padrões iFernandes de qualidade e performance:
              </p>
              
              <TechStack>
                <div className="tech">
                  <i className="fab fa-react"></i>
                  <span>React</span>
                </div>
                <div className="tech">
                  <i className="fab fa-js"></i>
                  <span>JavaScript</span>
                </div>
                <div className="tech">
                  <i className="fas fa-code"></i>
                  <span>TypeScript</span>
                </div>
                <div className="tech">
                  <i className="fab fa-cloudflare"></i>
                  <span>Cloudflare</span>
                </div>
                <div className="tech">
                  <i className="fas fa-database"></i>
                  <span>JSON</span>
                </div>
              </TechStack>

              <h3>Arquitetura</h3>
              <ul>
                <li><strong>Frontend Only:</strong> Aplicação 100% client-side</li>
                <li><strong>Sem Backend:</strong> Dados em JSON integrados ao frontend</li>
                <li><strong>Mobile-First:</strong> Design responsivo com foco em mobile</li>
                <li><strong>Performance:</strong> Carregamento rápido e otimizado</li>
              </ul>
            </InfoCard>
          </MainContent>

          <SidebarContent>
            <StatCard>
              <span className="number">{stats.totalPecas}</span>
              <span className="label">Peças Catalogadas</span>
            </StatCard>

            <StatCard>
              <span className="number">{stats.totalFusiveis}</span>
              <span className="label">Fusíveis Mapeados</span>
            </StatCard>

            <StatCard>
              <span className="number">{stats.totalCores}</span>
              <span className="label">Códigos de Cores</span>
            </StatCard>

            <TeamCard>
              <div className="avatar">
                <img src="/galeria/hero.jpeg" alt="Yuri Viana Fernandes" />
              </div>
              <h3>Yuri Viana Fernandes</h3>
              <div className="role">Desenvolvedor & Criador</div>
              <p>
                Dono do canal Falando de GTI, analista de dados e desenvolvedor web. 
                Apaixonado por tecnologia e automóveis, criando soluções úteis para 
                a comunidade automobilística.
              </p>
            </TeamCard>

            <InfoCard>
              <h2>Contato e Suporte</h2>
              <p>
                <strong>Desenvolvedor:</strong><br />
                Yuri Viana Fernandes
              </p>
              
              <p>
                <strong>Canal:</strong><br />
                Falando de GTI
              </p>
              
              <ContactLinks>
                <ContactLink href="https://linkedin.com/in/yurianalistabi" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                  <i className="fab fa-linkedin"></i>
                </ContactLink>
                
                <ContactLink href="https://wa.me/5531987798823" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                  <i className="fab fa-whatsapp"></i>
                </ContactLink>
                
                <ContactLink href="https://yurivf.com.br" target="_blank" rel="noopener noreferrer" aria-label="Website">
                  <i className="fas fa-globe"></i>
                </ContactLink>
                
                <ContactLink href="https://github.com/yurivfernandes1" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                  <i className="fab fa-github"></i>
                </ContactLink>
              </ContactLinks>
              
              <p style={{ marginTop: '1.5rem' }}>
                Este projeto é mantido pela comunidade e está em constante evolução. 
                Sugestões e melhorias são sempre bem-vindas!
              </p>
            </InfoCard>
          </SidebarContent>
        </ContentGrid>
      </Container>
    </AboutSection>
  );
};

export default Sobre;
