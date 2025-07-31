import React from 'react';
import styled from 'styled-components';
import { Container, Card, colors, media } from '../styles/GlobalStyles';

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
    width: 80px;
    height: 80px;
    background: ${colors.primary};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    color: ${colors.white};
    margin: 0 auto 1rem;
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
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;

  ${media.mobile} {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 0.75rem;
  }

  .tech {
    background: ${colors.gray[800]};
    padding: 0.75rem;
    border-radius: 8px;
    text-align: center;
    font-weight: 600;
    color: ${colors.white};
    border-left: 4px solid ${colors.primary};
    border: 1px solid ${colors.gray[700]};
    
    ${media.mobile} {
      padding: 0.5rem;
      font-size: 0.8rem;
    }
  }
`;

const Sobre: React.FC = () => {
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
    <AboutSection>
      <Container>
        <HeroCard>
          <h1>Sobre o Projeto</h1>
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
                <div className="tech">React</div>
                <div className="tech">TypeScript</div>
                <div className="tech">Styled Components</div>
                <div className="tech">React Router</div>
                <div className="tech">JSON Database</div>
                <div className="tech">Google Analytics</div>
                <div className="tech">Meta Pixel</div>
                <div className="tech">Responsive Design</div>
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

            <TeamCard>
              <div className="avatar">🚗</div>
              <h3>Falando de GTI</h3>
              <div className="role">Desenvolvimento</div>
              <p>
                Empresa especializada em soluções automotivas do Grupo iFernandes, 
                focada em criar ferramentas úteis para a comunidade automobilística.
              </p>
            </TeamCard>

            <InfoCard>
              <h2>Contato e Suporte</h2>
              <p>
                <strong>URL Oficial:</strong><br />
                https://app.falandodegti.com.br
              </p>
              
              <p>
                <strong>Empresa:</strong><br />
                Grupo iFernandes
              </p>
              
              <p>
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
