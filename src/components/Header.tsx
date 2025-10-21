import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { colors, media } from '../styles/GlobalStyles';

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
    margin: 0 1rem;
    max-width: 600px;
  }

  ${media.desktop} {
    margin: 0 2rem;
    max-width: 700px;
  }
`;

const NavMenu = styled.ul`
  display: flex;
  align-items: center;
  gap: 1rem;
  list-style: none;
  margin: 0;
  padding: 0;

  ${media.desktop} {
    gap: 1.5rem;
  }
`;

const NavLink = styled(Link)<{ $isActive: boolean }>`
  color: ${props => props.$isActive ? colors.primary : colors.white};
  text-decoration: none;
  font-weight: 500;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0.4rem 0.8rem;
  border-radius: 25px;
  transition: all 0.3s ease;
  position: relative;
  white-space: nowrap;

  ${media.desktop} {
    font-size: 0.85rem;
    padding: 0.5rem 1rem;
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

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

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
          </MobileNavList>
        </MobileMenu>
      </Container>
    </HeaderContainer>
  );
};

export default Header;
