import React from 'react';
import styled from 'styled-components';
import { colors, media } from '../styles/GlobalStyles';

const FooterContainer = styled.footer`
  background: #0a0a0a;
  color: ${colors.gray[300]};
  padding: 2rem 0 1rem;
  margin-top: 3rem;
  border-top: 1px solid rgba(220, 38, 38, 0.3);
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
  gap: 1.2rem;
  margin-bottom: 1.5rem;

  ${media.tablet} {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 2rem;
  }
`;

const FooterSection = styled.div`
  h3 {
    color: ${colors.white};
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -3px;
      left: 0;
      width: 25px;
      height: 2px;
      background: ${colors.primary};
    }
  }

  p, li {
    color: ${colors.gray[300]};
    line-height: 1.5;
    margin-bottom: 0.4rem;
    font-size: 0.9rem;
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
    gap: 0.4rem;
    padding: 0.15rem 0;
    font-size: 0.9rem;

    &:hover {
      color: ${colors.primary};
      transform: translateX(3px);
    }

    i {
      width: 14px;
      font-size: 0.8rem;
      color: ${colors.primary};
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 0.8rem;
  margin-top: 0.8rem;

  a {
    width: 35px;
    height: 35px;
    background: rgba(220, 38, 38, 0.1);
    border: 1px solid transparent;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    font-size: 1rem;
    
    &:hover {
      background: ${colors.primary};
      border-color: ${colors.primary};
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
      
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
  border-top: 1px solid rgba(220, 38, 38, 0.2);
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  text-align: center;
  color: ${colors.gray[400]};
  font-size: 0.8rem;
  
  p {
    margin-bottom: 0.3rem;
    
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
        </FooterContent>

        <Copyright>
          <p>
            © 2025 Falando de GTI - Todos os direitos reservados.
          </p>
          <p>
            Desenvolvido com <i className="fas fa-heart"></i> por Yuri Fernandes | 
            Este app é uma ferramenta educacional e informativa. Sempre consulte um profissional 
            qualificado antes de realizar qualquer modificação em seu veículo.
          </p>
        </Copyright>
      </Container>
    </FooterContainer>
  );
};

export default Footer;
