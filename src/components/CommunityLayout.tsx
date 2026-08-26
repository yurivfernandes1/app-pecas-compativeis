import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { colors, media } from '../styles/GlobalStyles';
import { supabase } from '../lib/supabase';

// ─── Styles ─────────────────────────────────────────────────────────

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 2rem;
  align-items: start;
  min-height: 80vh;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    padding-bottom: 5rem;
  }

  ${media.mobile} {
    padding: 1rem 1rem 5rem 1rem;
  }
`;

const Sidebar = styled.aside`
  position: sticky;
  top: 90px;

  @media (max-width: 900px) {
    display: none;
  }
`;

const SidebarSection = styled.div`
  margin-bottom: 1.5rem;
`;

const SidebarTitle = styled.div`
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: #555;
  margin-bottom: 0.5rem;
  padding: 0 0.75rem;
`;

const SidebarNav = styled.nav`
  background: #111;
  border: 1px solid #1e1e1e;
  border-radius: 12px;
  overflow: hidden;
`;

const SidebarLink = styled(Link)<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  color: ${p => p.$active ? colors.primary : '#bbb'};
  background: ${p => p.$active ? 'rgba(220,38,38,0.08)' : 'transparent'};
  text-decoration: none;
  border-left: 3px solid ${p => p.$active ? colors.primary : 'transparent'};
  font-size: 0.9rem;
  font-weight: ${p => p.$active ? '600' : '400'};
  transition: all 0.2s;

  &:hover {
    background: rgba(255,255,255,0.04);
    color: white;
  }

  i {
    width: 20px;
    text-align: center;
    font-size: 1rem;
    opacity: ${p => p.$active ? 1 : 0.7};
  }
`;

const MobileBar = styled.nav`
  display: none;

  @media (max-width: 900px) {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(10, 10, 10, 0.97);
    border-top: 1px solid #222;
    padding: 0.4rem 0;
    z-index: 999;
    justify-content: space-around;
    align-items: center;
    backdrop-filter: blur(10px);
  }
`;

const MobileItem = styled(Link)<{ $active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  text-decoration: none;
  color: ${p => p.$active ? colors.primary : '#666'};
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  transition: all 0.2s;

  i {
    font-size: 1.25rem;
  }

  &:hover {
    color: ${colors.primary};
  }
`;

const Content = styled.main`
  width: 100%;
  min-width: 0;
`;

// ─── Component ───────────────────────────────────────────────────────

interface CommunityLayoutProps {
  children: React.ReactNode;
}

const CommunityLayout: React.FC<CommunityLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [session, setSession] = React.useState<any>(null);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <Wrapper>
        <Sidebar>
          <SidebarSection>
            <SidebarTitle>Comunidade</SidebarTitle>
            <SidebarNav>
              <SidebarLink to="/feed" $active={isActive('/feed')}>
                <i className="fas fa-stream" /> Feed
              </SidebarLink>
              <SidebarLink to="/galeria" $active={isActive('/galeria')}>
                <i className="fas fa-images" /> Galeria de Projetos
              </SidebarLink>
            </SidebarNav>
          </SidebarSection>

          <SidebarSection>
            <SidebarTitle>Minha Conta</SidebarTitle>
            <SidebarNav>
              <SidebarLink to="/minha-garagem" $active={isActive('/minha-garagem')}>
                <i className="fas fa-car" /> Minha Garagem
              </SidebarLink>
              {session ? (
                <>
                  <SidebarLink to="/onboarding" $active={isActive('/onboarding')}>
                    <i className="fas fa-plus-circle" /> Novo Projeto
                  </SidebarLink>
                  <SidebarLink to="/editar-perfil" $active={isActive('/editar-perfil')}>
                    <i className="fas fa-user-edit" /> Editar Perfil
                  </SidebarLink>
                </>
              ) : (
                <SidebarLink to="/login">
                  <i className="fas fa-sign-in-alt" /> Entrar
                </SidebarLink>
              )}
            </SidebarNav>
          </SidebarSection>
        </Sidebar>

        <Content>{children}</Content>
      </Wrapper>

      {/* Barra de navegação inferior para mobile */}
      <MobileBar>
        <MobileItem to="/feed" $active={isActive('/feed')}>
          <i className="fas fa-stream" />
          Feed
        </MobileItem>
        <MobileItem to="/galeria" $active={isActive('/galeria')}>
          <i className="fas fa-images" />
          Galeria
        </MobileItem>
        <MobileItem to="/minha-garagem" $active={isActive('/minha-garagem')}>
          <i className="fas fa-car" />
          Garagem
        </MobileItem>
        {session && (
          <MobileItem to="/onboarding" $active={isActive('/onboarding')}>
            <i className="fas fa-plus-circle" />
            Novo
          </MobileItem>
        )}
      </MobileBar>
    </>
  );
};

export default CommunityLayout;
