import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { supabase } from '../../lib/supabase';
import { colors } from '../../styles/GlobalStyles';
import AdminTabs from '../../components/AdminTabs';
import { useNavigate } from 'react-router-dom';

const PageWrapper = styled.div`
  min-height: 100vh;
  padding: 2rem;
  background: #000;
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  background: #111;
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid #333;
`;

const Title = styled.h2`
  color: white;
  margin-bottom: 2rem;
`;

const FlexRow = styled.div`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Column = styled.div`
  flex: 1;
  background: #1a1a1a;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #333;
`;

const FormRow = styled.form`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;

  input {
    flex: 1;
    padding: 0.6rem 1rem;
    border-radius: 6px;
    border: 1px solid #444;
    background: #222;
    color: white;

    &:focus {
      outline: none;
      border-color: ${colors.primary};
    }
  }

  button {
    background: ${colors.primary};
    color: white;
    border: none;
    padding: 0 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;

    &:hover {
      background: #b91c1c;
    }
  }
`;

const TagList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #222;
    padding: 0.8rem 1rem;
    border-radius: 6px;
    margin-bottom: 0.5rem;
    color: #ccc;
    border: 1px solid #333;

    button {
      background: transparent;
      color: #ef4444;
      border: none;
      cursor: pointer;
      font-size: 1.1rem;

      &:hover {
        color: #dc2626;
      }
    }
  }
`;

export default function AdminTags() {
  const [opcionais, setOpcionais] = useState<any[]>([]);
  const [pecasRaras, setPecasRaras] = useState<any[]>([]);
  const [newOpcional, setNewOpcional] = useState('');
  const [newPeca, setNewPeca] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdmin();
    fetchTags();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/admin/login');
      return;
    }
    const { data: user } = await supabase.from('mk3_users').select('is_admin').eq('id', session.user.id).single();
    if (!user || !user.is_admin) {
      navigate('/');
    }
  };

  const fetchTags = async () => {
    setLoading(true);
    const { data } = await supabase.from('mk3_car_tags').select('*').order('nome', { ascending: true });
    if (data) {
      setOpcionais(data.filter(t => t.tipo === 'opcional'));
      setPecasRaras(data.filter(t => t.tipo === 'peca_rara'));
    }
    setLoading(false);
  };

  const handleAdd = async (e: React.FormEvent, tipo: 'opcional' | 'peca_rara', value: string, setter: (s: string) => void) => {
    e.preventDefault();
    if (!value.trim()) return;

    await supabase.from('mk3_car_tags').insert({ tipo, nome: value.trim() });
    setter('');
    fetchTags();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este item? Ele deixará de aparecer para novos carros.')) {
      await supabase.from('mk3_car_tags').delete().eq('id', id);
      fetchTags();
    }
  };

  return (
    <PageWrapper>
      <Container>
        <Title>Painel Administrativo</Title>
        <AdminTabs />
        
        {loading ? (
          <p style={{ color: 'white' }}>Carregando...</p>
        ) : (
          <FlexRow>
            {/* OPCIONAIS */}
            <Column>
              <h3 style={{ color: 'white', marginBottom: '1rem' }}><i className="fas fa-list-ul"></i> Opcionais</h3>
              
              <FormRow onSubmit={(e) => handleAdd(e, 'opcional', newOpcional, setNewOpcional)}>
                <input 
                  type="text" 
                  placeholder="Novo Opcional (Ex: Retrovisor Elétrico)" 
                  value={newOpcional}
                  onChange={e => setNewOpcional(e.target.value)}
                />
                <button type="submit"><i className="fas fa-plus"></i></button>
              </FormRow>

              <TagList>
                {opcionais.map(tag => (
                  <li key={tag.id}>
                    {tag.nome}
                    <button onClick={() => handleDelete(tag.id)} title="Remover">
                      <i className="fas fa-trash"></i>
                    </button>
                  </li>
                ))}
              </TagList>
            </Column>

            {/* PEÇAS RARAS */}
            <Column>
              <h3 style={{ color: 'white', marginBottom: '1rem' }}><i className="fas fa-gem"></i> Peças Raras</h3>
              
              <FormRow onSubmit={(e) => handleAdd(e, 'peca_rara', newPeca, setNewPeca)}>
                <input 
                  type="text" 
                  placeholder="Nova Peça (Ex: Farol Hella Dual)" 
                  value={newPeca}
                  onChange={e => setNewPeca(e.target.value)}
                />
                <button type="submit"><i className="fas fa-plus"></i></button>
              </FormRow>

              <TagList>
                {pecasRaras.map(tag => (
                  <li key={tag.id}>
                    {tag.nome}
                    <button onClick={() => handleDelete(tag.id)} title="Remover">
                      <i className="fas fa-trash"></i>
                    </button>
                  </li>
                ))}
              </TagList>
            </Column>
          </FlexRow>
        )}
      </Container>
    </PageWrapper>
  );
}
