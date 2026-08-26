import React from 'react';
import styled from 'styled-components';
import { NavLink as RouterNavLink } from 'react-router-dom';
import { colors } from '../styles/GlobalStyles';

const NavLinksWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  padding: 0.5rem;
  background: #111;
  border-radius: 8px;
  border: 1px solid #333;
  overflow-x: auto;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const StyledNavLink = styled(RouterNavLink)`
  color: #999;
  text-decoration: none;
  font-weight: 600;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  white-space: nowrap;
  transition: all 0.2s ease;
  
  &.active {
    color: white;
    background: ${colors.primary};
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
  }
  
  &:hover:not(.active) {
    color: white;
    background: #222;
  }
`;

export default function AdminTabs() {
  return (
    <NavLinksWrapper>
      <StyledNavLink to="/admin/produtos">Produtos (Shopee)</StyledNavLink>
      <StyledNavLink to="/admin/categorias">Categorias</StyledNavLink>
      <StyledNavLink to="/admin/usuarios">Usuários</StyledNavLink>
      <StyledNavLink to="/admin/lista-negra">Lista Negra</StyledNavLink>
      <StyledNavLink to="/admin/configuracoes">Configurações Gerais</StyledNavLink>
    </NavLinksWrapper>
  );
}
