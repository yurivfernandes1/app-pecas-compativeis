import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { colors } from '../../styles/GlobalStyles';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  color: ${colors.white};
`;

const Button = styled.button`
  background: ${colors.primary};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  
  &:hover {
    background: #b91c1c;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const NavLink = styled.button<{ $active?: boolean }>`
  background: ${props => props.$active ? colors.primary : 'transparent'};
  color: ${colors.white};
  border: 1px solid ${colors.primary};
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background: rgba(220, 38, 38, 0.2);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  background: #111;
  border-radius: 8px;
  overflow: hidden;

  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #333;
  }

  th {
    background: #222;
    color: ${colors.primary};
    font-weight: bold;
  }

  td {
    color: white;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

const Input = styled.input`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #444;
  background: #222;
  color: white;
  margin-right: 1rem;
`;

export default function AdminCategorias() {
  const [categorias, setCategorias] = useState<any[]>([]);
  const [novaCategoria, setNovaCategoria] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingNome, setEditingNome] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin/login');
      }
    };
    checkSession();
    fetchCategorias();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCategorias = async () => {
    const { data } = await supabase.from('pecas_categorias').select('*').order('nome', { ascending: true });
    if (data) setCategorias(data);
  };

  const handleAdd = async () => {
    if (!novaCategoria.trim()) return;
    await supabase.from('pecas_categorias').insert({ nome: novaCategoria.trim() });
    setNovaCategoria('');
    fetchCategorias();
  };

  const handleUpdate = async (id: string, ativo: boolean) => {
    if (editingId === id && editingNome.trim()) {
      await supabase.from('pecas_categorias').update({ nome: editingNome.trim(), is_active: ativo }).eq('id', id);
      setEditingId(null);
    } else {
      await supabase.from('pecas_categorias').update({ is_active: ativo }).eq('id', id);
    }
    fetchCategorias();
  };

  return (
    <Container>
      <Header>
        <Title>Painel Administrativo - Categorias</Title>
      </Header>

      <NavLinks>
        <NavLink onClick={() => navigate('/admin/produtos')}>Produtos (Shopee)</NavLink>
        <NavLink $active>Categorias</NavLink>
        <NavLink onClick={() => navigate('/admin/usuarios')}>Usuários</NavLink>
        <NavLink onClick={() => navigate('/admin/lista-negra')}>Lista Negra</NavLink>
      </NavLinks>

      <div style={{ marginBottom: '1.5rem', display: 'flex' }}>
        <Input 
          type="text" 
          placeholder="Nova Categoria..." 
          value={novaCategoria} 
          onChange={e => setNovaCategoria(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
        />
        <Button onClick={handleAdd}>Adicionar</Button>
      </div>

      <Table>
        <thead>
          <tr>
            <th>Nome da Categoria</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map(cat => (
            <tr key={cat.id} style={{ opacity: cat.is_active ? 1 : 0.5 }}>
              <td>
                {editingId === cat.id ? (
                  <Input 
                    autoFocus
                    value={editingNome} 
                    onChange={e => setEditingNome(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleUpdate(cat.id, cat.is_active)}
                  />
                ) : (
                  cat.nome
                )}
              </td>
              <td style={{ color: cat.is_active ? '#4ade80' : '#f87171' }}>
                {cat.is_active ? 'Ativa' : 'Inativa'}
              </td>
              <td>
                {editingId === cat.id ? (
                  <Button onClick={() => handleUpdate(cat.id, cat.is_active)}>Salvar</Button>
                ) : (
                  <Button onClick={() => { setEditingId(cat.id); setEditingNome(cat.nome); }} style={{ marginRight: '0.5rem' }}>Editar</Button>
                )}
                
                <Button 
                  style={{ background: '#333' }}
                  onClick={() => handleUpdate(cat.id, !cat.is_active)}
                >
                  {cat.is_active ? 'Desativar' : 'Ativar'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}
