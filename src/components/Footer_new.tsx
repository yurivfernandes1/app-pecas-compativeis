import React from 'react';
import styled from 'styled-components';
import { colors, media } from '../styles/GlobalStyles';

const FooterContainer = styled.footer`
  background: #0a0a0a;
  color: ${colors.gray[300]};
  padding: 3rem 0 1rem;
  margin-top: 4rem;
  border-top: 2px solid ${colors.primary};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;

  ${media.tablet} {
    padding: 0 2rem;
  }
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  ${media.tablet} {
    grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 3rem;
  }
`;

const FooterSection = styled.div`
  h3 {
    color: ${colors.white};
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 30px;
      height: 2px;
      background: ${colors.primary};
    }
  }

  p, li {
    color: ${colors.gray[300]};
    line-height: 1.6;
    margin-bottom: 0.5rem;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  a {
    color: ${colors.gray[300]};
    text-decoration: none;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0;

    &:hover {
      color: ${colors.primary};
      transform: translateX(5px);
      text-shadow: 0 0 10px rgba(220, 38, 38, 0.5);
    }

    i {
      width: 16px;
      color: ${colors.primary};
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;

  a {
    width: 45px;
    height: 45px;
    background: rgba(220, 38, 38, 0.1);
    border: 2px solid transparent;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    font-size: 1.2rem;
    
    &:hover {
      background: ${colors.primary};
      border-color: ${colors.primary};
      transform: translateY(-3px) scale(1.1);
      box-shadow: 0 8px 25px rgba(220, 38, 38, 0.4);
      
      i {
        color: ${colors.white} !important;
      }
    }

    i {
      color: ${colors.primary};
    }
  }
`;

const Copyright = styled.div`
  border-top: 1px solid rgba(220, 38, 38, 0.3);
  margin-top: 2rem;
  padding-top: 2rem;
  text-align: center;
  color: ${colors.gray[400]};
  font-size: 0.875rem;
  
  p {
    margin-bottom: 0.5rem;
    
    &:first-child {
      font-weight: 500;
      color: ${colors.white};
    }
  }

  i.fas.fa-heart {
    color: ${colors.primary};
    animation: heartbeat 1.5s ease-in-out infinite;
  }

  @keyframes heartbeat {
    0%, 50%, 100% {
      transform: scale(1);
    }
    25%, 75% {
      transform: scale(1.1);
    }
  }
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <Container>
        <FooterContent>
          <FooterSection>
            <h3>Golf MK3 Peças Compatíveis</h3>
            <p>
              Sua fonte confiável para encontrar peças compatíveis com Volkswagen Golf MK3. 
              Base de dados completa e atualizada para facilitar suas pesquisas e manter seu GTI sempre em movimento.
            </p>
            <p>
              <strong>Desenvolvido por:</strong> Falando de GTI<br />
              <strong>Canal:</strong> YouTube desde 2017
            </p>
            <SocialLinks>
              <a href="https://www.instagram.com/falandodegti" target="_blank" rel="noopener noreferrer" title="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://www.youtube.com/falandodegti" target="_blank" rel="noopener noreferrer" title="YouTube">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="https://www.facebook.com/falandodegti" target="_blank" rel="noopener noreferrer" title="Facebook">
                <i className="fab fa-facebook"></i>
              </a>
            </SocialLinks>
          </FooterSection>

          <FooterSection>
            <h3>Navegação</h3>
            <ul>
              <li><a href="/"><i className="fas fa-home"></i>Início</a></li>
              <li><a href="/pecas"><i className="fas fa-cogs"></i>Peças Compatíveis</a></li>
              <li><a href="/fusiveis"><i className="fas fa-bolt"></i>Mapa de Fusíveis</a></li>
              <li><a href="/cores"><i className="fas fa-palette"></i>Tabela de Cores</a></li>
              <li><a href="/sobre"><i className="fas fa-info-circle"></i>Sobre o Projeto</a></li>
            </ul>
          </FooterSection>

          <FooterSection>
            <h3>Recursos</h3>
            <ul>
              <li><i className="fas fa-check"></i>App 100% Gratuito</li>
              <li><i className="fas fa-check"></i>Dados Verificados</li>
              <li><i className="fas fa-check"></i>Interface Responsiva</li>
              <li><i className="fas fa-check"></i>Suporte Mobile/Desktop</li>
              <li><i className="fas fa-check"></i>Atualizações Constantes</li>
            </ul>
          </FooterSection>

          <FooterSection>
            <h3>Canal Falando de GTI</h3>
            <ul>
              <li><a href="https://www.youtube.com/falandodegti" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-youtube"></i>Últimos Vídeos
              </a></li>
              <li><a href="https://drive.google.com/drive/u/0/mobile/folders/1b-gDeYOAiJFC42XdfN5CcnloT9QkgTfV" target="_blank" rel="noopener noreferrer">
                <i className="fas fa-file-alt"></i>Documentação GTI
              </a></li>
              <li><a href="https://falandodegti.com.br" target="_blank" rel="noopener noreferrer">
                <i className="fas fa-globe"></i>Site Principal
              </a></li>
            </ul>
          </FooterSection>
        </FooterContent>

        <Copyright>
          <p>
            © 2025 Falando de GTI - Todos os direitos reservados.
          </p>
          <p>
            Desenvolvido por Yuri Fernandes | 
            Este app é uma ferramenta educacional e informativa. Sempre consulte um profissional 
            qualificado antes de realizar qualquer modificação em seu veículo.
          </p>
        </Copyright>
      </Container>
    </FooterContainer>
  );
};

export default Footer;
