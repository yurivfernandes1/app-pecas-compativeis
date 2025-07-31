import React from 'react';
import styled from 'styled-components';
import { colors, media } from '../styles/GlobalStyles';

const FooterContainer = styled.footer`
  background: ${colors.gray[800]};
  color: ${colors.gray[200]};
  padding: 2rem 0 1rem;
  margin-top: 4rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;

  ${media.tablet} {
    padding: 0 2rem;
  }
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  ${media.tablet} {
    grid-template-columns: 2fr 1fr 1fr;
  }
`;

const FooterSection = styled.div`
  h3 {
    color: ${colors.white};
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 1rem;
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
    transition: color 0.2s;

    &:hover {
      color: ${colors.primary};
    }
  }
`;

const Copyright = styled.div`
  border-top: 1px solid ${colors.gray[700]};
  margin-top: 2rem;
  padding-top: 1rem;
  text-align: center;
  color: ${colors.gray[400]};
  font-size: 0.875rem;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;

  a {
    width: 40px;
    height: 40px;
    background: ${colors.gray[700]};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;

    &:hover {
      background: ${colors.primary};
    }
  }
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterGrid>
          <FooterSection>
            <h3>Golf MK3 Peças Compatíveis</h3>
            <p>
              Sua fonte confiável para encontrar peças compatíveis com Volkswagen Golf MK3. 
              Base de dados completa e atualizada para facilitar suas pesquisas.
            </p>
            <p>
              <strong>Desenvolvido por:</strong> Falando de GTI<br />
              <strong>Empresa:</strong> Grupo iFernandes
            </p>
            <SocialLinks>
              <a href="https://www.instagram.com/falandodegti" target="_blank" rel="noopener noreferrer" title="Instagram">📷</a>
              <a href="https://www.youtube.com/falandodegti" target="_blank" rel="noopener noreferrer" title="YouTube">📹</a>
              <a href="https://www.facebook.com/falandodegti" target="_blank" rel="noopener noreferrer" title="Facebook">�</a>
            </SocialLinks>
          </FooterSection>

          <FooterSection>
            <h3>Links Úteis</h3>
            <ul>
              <li><a href="/">Início</a></li>
              <li><a href="/pecas">Peças Compatíveis</a></li>
              <li><a href="/fusiveis">Mapa de Fusíveis</a></li>
              <li><a href="/cores">Tabela de Cores</a></li>
              <li><a href="/sobre">Sobre o Projeto</a></li>
            </ul>
          </FooterSection>

          <FooterSection>
            <h3>Informações</h3>
            <ul>
              <li>App 100% Gratuito</li>
              <li>Dados Verificados</li>
              <li>Interface Responsiva</li>
              <li>Suporte Mobile/Desktop</li>
              <li>Atualizações Constantes</li>
            </ul>
          </FooterSection>
        </FooterGrid>

        <Copyright>
          <p>
            © 2025 Falando de GTI - Grupo iFernandes. Todos os direitos reservados.
          </p>
          <p>
            Este app é uma ferramenta educacional e informativa. Sempre consulte um profissional 
            qualificado antes de realizar qualquer modificação em seu veículo.
          </p>
        </Copyright>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
