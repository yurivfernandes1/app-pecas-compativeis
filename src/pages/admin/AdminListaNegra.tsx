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
  background: #111;
  color: white;
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem;
  border-bottom: 1px solid #333;
`;

const Td = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #333;
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
  background: #111;
  border: 1px solid #333;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  color: white;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
  }
  
  input, textarea {
    width: 100%;
    padding: 0.8rem;
    background: #222;
    border: 1px solid #444;
    color: white;
    border-radius: 4px;
  }
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
`;

export default function AdminListaNegra() {
  const [lista, setLista] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [form, setForm] = useState({
    numero: '',
    descricao: '',
    is_active: true
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin/login');
      }
    };
    checkSession();
    fetchLista();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchLista = async () => {
    const { data } = await supabase.from('pecas_lista_negra').select('*').order('created_at', { ascending: false });
    if (data) setLista(data);
  };



  const openModal = (item: any = null) => {
    if (item) {
      setEditingItem(item);
      setForm({
        numero: item.numero,
        descricao: item.descricao,
        is_active: item.is_active
      });
    } else {
      setEditingItem(null);
      setForm({ numero: '', descricao: '', is_active: true });
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    if (editingItem) {
      await supabase.from('pecas_lista_negra').update(form).eq('id', editingItem.id);
    } else {
      await supabase.from('pecas_lista_negra').insert(form);
    }
    setShowModal(false);
    fetchLista();
  };

  return (
    <Container>
      <Header>
        <Title>Painel Administrativo - Lista Negra</Title>
      </Header>

      <NavLinks>
        <NavLink onClick={() => navigate('/admin/produtos')}>Produtos (Shopee)</NavLink>
        <NavLink onClick={() => navigate('/admin/categorias')}>Categorias</NavLink>
        <NavLink onClick={() => navigate('/admin/usuarios')}>Usuários</NavLink>
        <NavLink $active>Lista Negra</NavLink>
      </NavLinks>

      <Button style={{ marginBottom: '1.5rem' }} onClick={() => openModal()}>+ Novo Número</Button>

      <Table>
        <thead>
          <tr>
            <Th>Número</Th>
            <Th>Descrição</Th>
            <Th>Ativo</Th>
            <Th>Ações</Th>
          </tr>
        </thead>
        <tbody>
          {lista.map(item => (
            <tr key={item.id} style={{ opacity: item.is_active ? 1 : 0.5 }}>
              <Td>{item.numero}</Td>
              <Td>{item.descricao}</Td>
              <Td>{item.is_active ? 'Sim' : 'Não'}</Td>
              <Td>
                <Button onClick={() => openModal(item)} style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem' }}>Editar</Button>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>

      {showModal && (
        <ModalOverlay>
          <ModalContent>
            <h3>{editingItem ? 'Editar Número' : 'Novo Número'}</h3>
            <FormGroup>
              <label>Número (WhatsApp/Telefone)</label>
              <input value={form.numero} onChange={e => setForm({...form, numero: e.target.value})} />
            </FormGroup>
            <FormGroup>
              <label>Descrição do Golpe / Denúncia</label>
              <textarea rows={4} value={form.descricao} onChange={e => setForm({...form, descricao: e.target.value})} />
            </FormGroup>
            <FormGroup style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" style={{ width: 'auto' }} checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} />
              <label style={{ margin: 0 }}>Ativo (Aparecer na lista pública)</label>
            </FormGroup>

            <ModalActions>
              <Button style={{ background: '#444' }} onClick={() => setShowModal(false)}>Cancelar</Button>
              <Button onClick={handleSave}>Salvar</Button>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}
