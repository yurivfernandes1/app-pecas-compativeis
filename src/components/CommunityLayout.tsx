import React, { useState, useEffect } from 'react';
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

const NotificationBadgeDesktop = styled.span`
  background: ${colors.primary};
  color: white;
  font-size: 0.65rem;
  font-weight: bold;
  border-radius: 12px;
  padding: 0.1rem 0.4rem;
  margin-left: auto;
`;

const MobileBar = styled.nav<{ $visible: boolean }>`
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
    padding-bottom: env(safe-area-inset-bottom, 0.4rem);
    z-index: 999;
    justify-content: space-around;
    align-items: center;
    backdrop-filter: blur(10px);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform: translateY(${p => p.$visible ? '0' : '100%'});
  }
`;

const MobileItem = styled(Link)<{ $active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  text-decoration: none;
  color: ${p => p.$active ? `${colors.primary} !important` : '#666'};
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  padding: 0.4rem;
  border-radius: 8px;
  transition: all 0.2s;
  position: relative;
  flex: 1;

  i {
    font-size: 1.25rem;
    color: ${p => p.$active ? `${colors.primary} !important` : 'inherit'};
  }

  img {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid ${p => p.$active ? colors.primary : 'transparent'};
  }

  &:hover {
    color: ${colors.primary};
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: 0;
  right: 50%;
  margin-right: -12px;
  background: ${colors.primary};
  color: white;
  font-size: 0.55rem;
  font-weight: bold;
  border-radius: 50%;
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #0a0a0a;
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
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMobileBarVisible, setIsMobileBarVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.pageYOffset;
    
    const handleScroll = () => {
      const currentScrollY = window.pageYOffset;
      if (currentScrollY > lastScrollY && currentScrollY > 60) {
        setIsMobileBarVisible(false);
      } else {
        setIsMobileBarVisible(true);
      }
      lastScrollY = currentScrollY;
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchProfileAndData = async (userId: string) => {
      const { data: userProfile } = await supabase.from('mk3_users').select('*').eq('id', userId).single();
      if (userProfile) setProfile(userProfile);
      
      const { count } = await supabase
        .from('mk3_notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);
        
      if (count !== null) setUnreadCount(count);
    };

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) fetchProfileAndData(data.session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => {
      setSession(s);
      if (s) fetchProfileAndData(s.user.id);
      else setProfile(null);
    });

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
                  <SidebarLink to="/notificacoes" $active={isActive('/notificacoes')}>
                    <i className="fas fa-bell" /> Notificações
                    {unreadCount > 0 && <NotificationBadgeDesktop>{unreadCount}</NotificationBadgeDesktop>}
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
      <MobileBar $visible={isMobileBarVisible}>
        <MobileItem to="/feed" $active={isActive('/feed')}>
          <i className="fas fa-home" />
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
        {session && profile ? (
          <>
            <MobileItem to="/notificacoes" $active={isActive('/notificacoes')}>
              {unreadCount > 0 && <NotificationBadge>{unreadCount}</NotificationBadge>}
              <i className="fas fa-bell" />
              Alertas
            </MobileItem>
            <MobileItem to={`/u/${profile.username}`} $active={isActive(`/u/${profile.username}`)}>
              <img 
                src={profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.username}&background=222222&color=dc2626`} 
                alt="Perfil" 
              />
              Perfil
            </MobileItem>
          </>
        ) : (
          <MobileItem to="/login" $active={isActive('/login')}>
            <i className="fas fa-user" />
            Entrar
          </MobileItem>
        )}
      </MobileBar>
    </>
  );
};

export default CommunityLayout;
