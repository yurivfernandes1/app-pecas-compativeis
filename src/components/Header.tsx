import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { colors, media } from '../styles/GlobalStyles';
import { supabase } from '../lib/supabase';

const HeaderContainer = styled.header`
  background: #0a0a0a;
  box-shadow: 0 4px 20px rgba(220, 38, 38, 0.3);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 2px solid ${colors.primary};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
  gap: 0.5rem;

  ${media.tablet} {
    padding: 0 1rem;
    gap: 1rem;
  }

  ${media.desktop} {
    padding: 0 2rem;
    gap: 1.5rem;
  }
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  flex-shrink: 0;
  
  img {
    width: 100px;
    height: auto;
    transition: transform 0.3s ease;

    ${media.tablet} {
      width: 110px;
    }

    ${media.desktop} {
      width: 120px;
    }
  }
  
  &:hover img {
    transform: scale(1.05);
  }
`;

const Nav = styled.nav`
  display: none;
  
  ${media.tablet} {
    display: flex;
    flex: 1;
    justify-content: center;
    margin: 0 0.5rem;
  }

  ${media.desktop} {
    margin: 0 1rem;
  }
`;

const NavMenu = styled.ul`
  display: flex;
  align-items: center;
  gap: 0.1rem;
  list-style: none;
  margin: 0;
  padding: 0;

  ${media.desktop} {
    gap: 0.25rem;
  }
`;

const NavLink = styled(Link)<{ $isActive: boolean }>`
  color: ${props => props.$isActive ? colors.primary : colors.white};
  text-decoration: none;
  font-weight: 500;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  padding: 0.4rem 0.45rem;
  border-radius: 25px;
  transition: all 0.3s ease;
  position: relative;
  white-space: nowrap;

  ${media.desktop} {
    font-size: 0.72rem;
    padding: 0.5rem 0.6rem;
  }
  
  &::before {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    width: 0;
    height: 2px;
    background: ${colors.primary};
    transition: all 0.3s ease;
    transform: translateX(-50%);
  }

  &:hover {
    color: ${colors.primary};
    background: rgba(220, 38, 38, 0.1);
    text-shadow: 0 0 10px rgba(220, 38, 38, 0.5);
    
    &::before {
      width: 80%;
    }
  }

  ${props => props.$isActive && `
    background: rgba(220, 38, 38, 0.15);
    text-shadow: 0 0 10px rgba(220, 38, 38, 0.7);
    
    &::before {
      width: 80%;
    }
  `}
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 0.6rem;
  align-items: center;
  flex-shrink: 0;

  ${media.desktop} {
    gap: 0.8rem;
  }
`;

const SocialLink = styled.a`
  color: ${colors.white};
  font-size: 1rem;
  transition: all 0.3s ease;
  padding: 0.3rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  min-height: 32px;

  ${media.tablet} {
    font-size: 1.1rem;
    padding: 0.4rem;
    min-width: 36px;
    min-height: 36px;
  }

  ${media.desktop} {
    font-size: 1.2rem;
    padding: 0.5rem;
    min-width: 40px;
    min-height: 40px;
  }
  
  &:hover {
    color: ${colors.primary};
    background: rgba(220, 38, 38, 0.1);
    transform: translateY(-2px);
    text-shadow: 0 0 10px rgba(220, 38, 38, 0.7);
  }
`;

const MenuToggle = styled.button`
  display: flex;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  flex-direction: column;
  gap: 4px;
  flex-shrink: 0;
  
  span {
    width: 25px;
    height: 3px;
    background: ${colors.white};
    border-radius: 2px;
    transition: all 0.3s ease;
  }

  &:hover span {
    background: ${colors.primary};
    box-shadow: 0 0 8px rgba(220, 38, 38, 0.6);
  }

  ${media.tablet} {
    display: none;
  }
`;

const MobileRightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  ${media.tablet} {
    gap: 1rem;
  }
`;

const MobileMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #0a0a0a;
  border-top: 1px solid ${colors.primary};
  transform: ${props => props.$isOpen ? 'translateY(0)' : 'translateY(-100%)'};
  opacity: ${props => props.$isOpen ? '1' : '0'};
  visibility: ${props => props.$isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8);

  ${media.desktop} {
    display: none;
  }
`;

const MobileNavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 1rem 0;
`;

const MobileNavLink = styled(Link)<{ $isActive: boolean }>`
  display: block;
  color: ${props => props.$isActive ? colors.primary : colors.white};
  text-decoration: none;
  padding: 1rem 2rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  &:hover {
    color: ${colors.primary};
    background: rgba(220, 38, 38, 0.1);
    padding-left: 2.5rem;
  }

  ${props => props.$isActive && `
    background: rgba(220, 38, 38, 0.15);
    border-left: 4px solid ${colors.primary};
  `}
`;

const UserMenuContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-left: 1rem;

  @media (max-width: 900px) {
    display: none;
  }
`;

const UserButton = styled.button`
  background: transparent;
  color: ${colors.white};
  border: 1px solid ${colors.primary};
  padding: 0.4rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(220, 38, 38, 0.1);
  }
`;

const DropdownMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: #111;
  border: 1px solid #333;
  border-radius: 8px;
  min-width: 150px;
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
  z-index: 1001;
`;

const DropdownItem = styled(Link)`
  padding: 0.8rem 1rem;
  color: ${colors.white};
  text-decoration: none;
  font-size: 0.9rem;
  transition: background 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.6rem;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const DropdownItemButton = styled.button`
  padding: 0.8rem 1rem;
  color: ${colors.white};
  background: transparent;
  border: none;
  text-align: left;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.6rem;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const AuthButton = styled(Link)<{ $primary?: boolean }>`
  color: ${props => props.$primary ? colors.white : colors.gray[300]};
  background: ${props => props.$primary ? colors.primary : 'transparent'};
  border: ${props => props.$primary ? 'none' : `1px solid ${colors.gray[600]}`};
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: bold;
  font-size: 0.85rem;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: ${props => props.$primary ? '#b91c1c' : 'rgba(255,255,255,0.1)'};
    color: ${colors.white};
  }
`;

const DesktopAuth = styled.div`
  display: none;

  ${media.tablet} {
    display: flex;
    align-items: center;
  }
`;

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const location = useLocation();

  React.useEffect(() => {
    const fetchProfile = async (userId: string) => {
      const { data } = await supabase.from('mk3_users').select('username, nome_completo, is_admin').eq('id', userId).single();
      if (data) setProfile(data);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const navigation = [
    { path: '/', label: 'Início' },
    { path: '/pecas', label: 'Peças Compatíveis' },
    { path: '/fusiveis', label: 'Mapa de Fusíveis' },
    { path: '/cores', label: 'Tabela de Cores' },
    { path: '/produtos', label: 'Vendas Peças' },
    { path: '/lista-negra', label: 'Lista Negra' },
    { path: '/sobre', label: 'Sobre' },
  ];

  return (
    <HeaderContainer>
      <Container>
        <LogoSection>
          <Logo to="/" onClick={handleLinkClick}>
            <img 
              src="https://raw.githubusercontent.com/yurivfernandes1/falando-de-gti-frontend/refs/heads/main/src/public/galeria/logo.png" 
              alt="Falando de GTI" 
            />
          </Logo>
        </LogoSection>

        <Nav>
          <NavMenu>
            {navigation.map((item) => (
              <li key={item.path}>
                <NavLink 
                  to={item.path} 
                  $isActive={isActive(item.path)}
                  onClick={handleLinkClick}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </NavMenu>
        </Nav>

        <MobileRightSection>
          <SocialLinks>
            <SocialLink href="https://falandodegti.com.br" target="_blank" aria-label="Site Oficial">
              <i className="fas fa-globe"></i>
            </SocialLink>
            <SocialLink href="https://www.youtube.com/falandodegti" target="_blank" aria-label="YouTube">
              <i className="fab fa-youtube"></i>
            </SocialLink>
            <SocialLink href="https://www.instagram.com/falandodegti" target="_blank" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </SocialLink>
            <SocialLink href="https://www.facebook.com/falandodegti" target="_blank" aria-label="Facebook">
              <i className="fab fa-facebook"></i>
            </SocialLink>
          </SocialLinks>

          <UserMenuContainer>
            {user ? (
              <>
                <UserButton onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                  {profile ? profile.username : user.email.split('@')[0]} <i className="fas fa-caret-down"></i>
                </UserButton>
                <DropdownMenu $isOpen={isUserMenuOpen}>
                  <DropdownItem to="/minha-garagem" onClick={() => setIsUserMenuOpen(false)}>
                    <i className="fas fa-car"></i> Minha Garagem
                  </DropdownItem>
                  <DropdownItem to="/feed" onClick={() => setIsUserMenuOpen(false)}>
                    <i className="fas fa-users"></i> Comunidade
                  </DropdownItem>
                  {profile?.is_admin && (
                    <DropdownItem to="/admin/produtos" onClick={() => setIsUserMenuOpen(false)}>
                      <i className="fas fa-cog"></i> Configurações
                    </DropdownItem>
                  )}
                  <DropdownItemButton onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i> Sair
                  </DropdownItemButton>
                </DropdownMenu>
              </>
            ) : (
              <DesktopAuth>
                <AuthButton to="/login" style={{ border: `1px solid ${colors.primary}`, color: colors.white }}>Entrar</AuthButton>
              </DesktopAuth>
            )}
          </UserMenuContainer>

          <MenuToggle onClick={handleMenuToggle}>
            <span></span>
            <span></span>
            <span></span>
          </MenuToggle>
        </MobileRightSection>

        <MobileMenu $isOpen={isMenuOpen}>
          <MobileNavList>
            {navigation.map((item) => (
              <li key={item.path}>
                <MobileNavLink 
                  to={item.path} 
                  $isActive={isActive(item.path)}
                  onClick={handleLinkClick}
                >
                  {item.label}
                </MobileNavLink>
              </li>
            ))}
            <li>
              <MobileNavLink 
                to="/minha-garagem" 
                $isActive={isActive('/minha-garagem')}
                onClick={handleLinkClick}
              >
                Minha Garagem
              </MobileNavLink>
            </li>
            {user && (
              <>
                <li>
                  <MobileNavLink 
                    to="/feed" 
                    $isActive={isActive('/feed')}
                    onClick={handleLinkClick}
                  >
                    Comunidade
                  </MobileNavLink>
                </li>
                {profile?.is_admin && (
                  <li>
                    <MobileNavLink 
                      to="/admin/produtos" 
                      $isActive={isActive('/admin/produtos')}
                      onClick={handleLinkClick}
                    >
                      Configurações
                    </MobileNavLink>
                  </li>
                )}
              </>
            )}
            {!user && (
              <>
                <li>
                  <MobileNavLink 
                    to="/login" 
                    $isActive={isActive('/login')}
                    onClick={handleLinkClick}
                    style={{ color: colors.primary, fontWeight: 'bold' }}
                  >
                    <i className="fas fa-sign-in-alt" style={{ marginRight: '8px' }}></i> Entrar
                  </MobileNavLink>
                </li>
                <li>
                  <MobileNavLink 
                    to="/cadastro" 
                    $isActive={isActive('/cadastro')}
                    onClick={handleLinkClick}
                  >
                    Criar conta
                  </MobileNavLink>
                </li>
              </>
            )}
            {user && (
              <li>
                <button
                  onClick={() => {
                    handleLogout();
                    handleLinkClick();
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '1rem 2rem',
                    color: '#ff4444',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    fontSize: '1rem',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  <i className="fas fa-sign-out-alt" style={{ marginRight: '8px' }}></i> Sair
                </button>
              </li>
            )}
          </MobileNavList>
        </MobileMenu>
      </Container>
    </HeaderContainer>
  );
};

export default Header;
