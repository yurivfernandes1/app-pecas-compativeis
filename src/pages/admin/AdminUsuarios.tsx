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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #1a1a1a;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #333;
  max-width: 400px;
  width: 90%;
  text-align: center;
  
  h3 {
    margin-top: 0;
    color: white;
    margin-bottom: 1rem;
  }
  
  p {
    color: #aaa;
    margin-bottom: 1.5rem;
  }
`;

const ModalActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  
  button {
    padding: 0.6rem 1.2rem;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
  }
  
  .cancel {
    background: transparent;
    color: white;
    border: 1px solid #555;
    
    &:hover { background: #333; }
  }
  
  .confirm {
    background: ${colors.primary};
    color: white;
    
    &:hover { background: #b91c1c; }
  }
`;

export default function AdminUsuarios() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{ id: string, action: 'premium' | 'active', status: boolean } | null>(null);
  const navigate = useNavigate();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    checkAdmin();
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const handleActionClick = (id: string, action: 'premium' | 'active', currentStatus: boolean) => {
    setModalData({ id, action, status: currentStatus });
    setModalOpen(true);
  };

  const confirmAction = async () => {
    if (!modalData) return;
    
    const { id, action, status } = modalData;
    
    if (action === 'premium') {
      await supabase
        .from('mk3_users')
        .update({ premium_manual: !status })
        .eq('id', id);
    } else if (action === 'active') {
      await supabase
        .from('mk3_users')
        .update({ is_active: !status })
        .eq('id', id);
    }
    
    setModalOpen(false);
    setModalData(null);
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
        <NavLink to="/admin/configuracoes">Configurações Gerais</NavLink>
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
                      onClick={() => handleActionClick(u.id, 'premium', u.premium_manual)}
                    >
                      {u.premium_manual ? 'Remover Premium' : 'Dar Premium'}
                    </ActionButton>
                    <ActionButton 
                      $danger={u.is_active}
                      onClick={() => handleActionClick(u.id, 'active', u.is_active)}
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

      {modalOpen && modalData && (
        <ModalOverlay onClick={() => setModalOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <h3>Confirmação Necessária</h3>
            <p>
              {modalData.action === 'premium' 
                ? `Você tem certeza que deseja ${modalData.status ? 'REMOVER' : 'CONCEDER'} o acesso Premium Manual para este usuário?`
                : `Você tem certeza que deseja ${modalData.status ? 'DESATIVAR' : 'REATIVAR'} este usuário?`
              }
            </p>
            <ModalActions>
              <button className="cancel" onClick={() => setModalOpen(false)}>Cancelar</button>
              <button className="confirm" onClick={confirmAction}>Sim, confirmar</button>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}
