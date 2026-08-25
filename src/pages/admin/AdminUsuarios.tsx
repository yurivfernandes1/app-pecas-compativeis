import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { supabase } from '../../lib/supabase';
import { useNavigate, NavLink as RouterNavLink } from 'react-router-dom';
import { colors } from '../../styles/GlobalStyles';

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  color: white;
  min-height: 80vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: ${colors.primary};
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid #333;
  padding-bottom: 1rem;
`;

const NavLink = styled(RouterNavLink)`
  color: #999;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  
  &.active {
    color: white;
    background: #333;
  }
  
  &:hover:not(.active) {
    color: white;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #111;
  border-radius: 8px;
  overflow: hidden;
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem;
  background: #222;
  color: #ccc;
  font-weight: 600;
`;

const Td = styled.td`
  padding: 1rem;
  border-top: 1px solid #333;
  color: #eee;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ $danger?: boolean, $success?: boolean }>`
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  background: ${props => props.$danger ? '#dc2626' : props.$success ? '#16a34a' : '#4b5563'};
  color: white;

  &:hover {
    opacity: 0.9;
  }
`;

export default function AdminUsuarios() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    checkAdmin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    fetchUsers();
  }, []);

  const checkAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/admin/login');
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    // Para simplificar, buscamos de mk3_users
    const { data, error } = await supabase
      .from('mk3_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
    } else if (data) {
      setUsers(data);
    }
    setLoading(false);
  };

  const togglePremiumManual = async (id: string, currentStatus: boolean) => {
    const confirm = window.confirm(`Deseja ${currentStatus ? 'remover' : 'conceder'} acesso Premium Manual?`);
    if (!confirm) return;

    await supabase
      .from('mk3_users')
      .update({ premium_manual: !currentStatus })
      .eq('id', id);
      
    fetchUsers();
  };

  const toggleActiveStatus = async (id: string, currentStatus: boolean) => {
    const confirm = window.confirm(`Deseja ${currentStatus ? 'desativar' : 'reativar'} este usuário?`);
    if (!confirm) return;

    await supabase
      .from('mk3_users')
      .update({ is_active: !currentStatus })
      .eq('id', id);
      
    fetchUsers();
  };

  return (
    <Container>
      <Header>
        <Title>Painel Administrativo - Usuários</Title>
      </Header>

      <NavLinks>
        <NavLink to="/admin/produtos">Produtos</NavLink>
        <NavLink to="/admin/categorias">Categorias</NavLink>
        <NavLink to="/admin/usuarios">Usuários</NavLink>
        <NavLink to="/admin/lista-negra">Lista Negra</NavLink>
      </NavLinks>

      {loading ? (
        <p>Carregando usuários...</p>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Username</Th>
              <Th>Data de Cadastro</Th>
              <Th>Plano Stripe</Th>
              <Th>Status Premium</Th>
              <Th>Ações</Th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ opacity: u.is_active ? 1 : 0.5 }}>
                <Td>@{u.username}</Td>
                <Td>{new Date(u.created_at).toLocaleDateString('pt-BR')}</Td>
                <Td>{u.is_premium ? 'Ativo' : 'Inativo'}</Td>
                <Td>
                  {u.premium_manual ? (
                    <span style={{ color: '#16a34a', fontWeight: 'bold' }}>Manual Ativo</span>
                  ) : (
                    <span style={{ color: '#999' }}>Sem Manual</span>
                  )}
                </Td>
                <Td>
                  <ButtonGroup>
                    <ActionButton 
                      $success={!u.premium_manual} 
                      $danger={u.premium_manual}
                      onClick={() => togglePremiumManual(u.id, u.premium_manual)}
                    >
                      {u.premium_manual ? 'Remover Premium' : 'Dar Premium'}
                    </ActionButton>
                    <ActionButton 
                      $danger={u.is_active}
                      onClick={() => toggleActiveStatus(u.id, u.is_active)}
                    >
                      {u.is_active ? 'Desativar' : 'Reativar'}
                    </ActionButton>
                  </ButtonGroup>
                </Td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <Td colSpan={5} style={{ textAlign: 'center' }}>Nenhum usuário cadastrado.</Td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </Container>
  );
}
