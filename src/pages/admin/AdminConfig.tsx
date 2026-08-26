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

const FormBox = styled.div`
  background: #111;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #ccc;
    font-weight: 500;
  }
  
  input {
    width: 100%;
    padding: 0.8rem 1rem;
    background: #1a1a1a;
    border: 1px solid #444;
    color: white;
    border-radius: 6px;
    font-size: 1.1rem;
    
    &:focus {
      outline: none;
      border-color: ${colors.primary};
    }
  }
`;

const SaveButton = styled.button`
  background: ${colors.primary};
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  
  &:hover {
    background: #b91c1c;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Message = styled.div<{ $success?: boolean }>`
  padding: 1rem;
  border-radius: 6px;
  margin-top: 1rem;
  background: ${props => props.$success ? 'rgba(22, 163, 74, 0.1)' : 'rgba(220, 38, 38, 0.1)'};
  color: ${props => props.$success ? '#16a34a' : '#ef4444'};
  border: 1px solid ${props => props.$success ? '#16a34a' : '#ef4444'};
`;

export default function AdminConfig() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [price, setPrice] = useState('19.90');
  const [settingsId, setSettingsId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string, type: 'success'|'error' } | null>(null);
  const navigate = useNavigate();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    checkAdmin();
    fetchSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/admin/login');
      return;
    }
    const { data: profile } = await supabase.from('mk3_users').select('is_admin').eq('id', session.user.id).single();
    if (!profile?.is_admin) {
      navigate('/');
    }
  };

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('mk3_settings').select('*').limit(1).single();
    if (data) {
      setPrice(data.premium_price.toString());
      setSettingsId(data.id);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    const numPrice = parseFloat(price.replace(',', '.'));
    
    if (isNaN(numPrice)) {
      setMessage({ text: 'Valor inválido.', type: 'error' });
      setSaving(false);
      return;
    }

    if (settingsId) {
      const { error } = await supabase
        .from('mk3_settings')
        .update({ premium_price: numPrice })
        .eq('id', settingsId);
        
      if (error) {
        setMessage({ text: 'Erro ao salvar: ' + error.message, type: 'error' });
      } else {
        setMessage({ text: 'Configurações salvas com sucesso!', type: 'success' });
      }
    } else {
      // In case it's completely empty
      const { data, error } = await supabase.from('mk3_settings').insert({ premium_price: numPrice }).select().single();
      if (!error && data) {
         setSettingsId(data.id);
         setMessage({ text: 'Configurações salvas com sucesso!', type: 'success' });
      } else if (error) {
         setMessage({ text: 'Erro ao salvar: ' + error.message, type: 'error' });
      }
    }
    setSaving(false);
  };

  return (
    <Container>
      <Header>
        <Title>Painel Administrativo - Configurações</Title>
      </Header>

      <NavLinks>
        <NavLink to="/admin/produtos">Produtos</NavLink>
        <NavLink to="/admin/categorias">Categorias</NavLink>
        <NavLink to="/admin/usuarios">Usuários</NavLink>
        <NavLink to="/admin/lista-negra">Lista Negra</NavLink>
        <NavLink to="/admin/configuracoes">Configurações Gerais</NavLink>
      </NavLinks>

      {loading ? (
        <p>Carregando configurações...</p>
      ) : (
        <FormBox>
          <FormGroup>
            <label>Preço do Plano Premium Mensal (R$)</label>
            <input 
              type="text" 
              value={price} 
              onChange={e => setPrice(e.target.value)} 
              placeholder="Ex: 19.90"
            />
          </FormGroup>
          
          <SaveButton onClick={handleSave} disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </SaveButton>

          {message && (
            <Message $success={message.type === 'success'}>
              {message.text}
            </Message>
          )}
        </FormBox>
      )}
    </Container>
  );
}
