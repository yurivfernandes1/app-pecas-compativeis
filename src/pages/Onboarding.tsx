import React, { useState } from 'react';
import styled from 'styled-components';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { colors } from '../styles/GlobalStyles';

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: #000;
`;

const FormContainer = styled.div`
  background: #111;
  padding: 3rem;
  border-radius: 12px;
  border: 1px solid #333;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
`;

const Title = styled.h1`
  color: ${colors.white};
  text-align: center;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: ${colors.gray[400]};
  text-align: center;
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    color: ${colors.gray[300]};
    font-size: 0.9rem;
  }
  
  input, textarea, select {
    width: 100%;
    padding: 0.8rem 1rem;
    background: #1a1a1a;
    border: 1px solid #333;
    color: white;
    border-radius: 6px;
    
    &:focus {
      outline: none;
      border-color: ${colors.primary};
    }
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem;
  background: ${colors.primary};
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;
  margin-top: 1rem;
  
  &:hover:not(:disabled) {
    background: #b91c1c;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default function Onboarding() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    modelo: 'GTI',
    ano: '1995',
    cor: 'Vermelho Tornado',
    descricao: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      await supabase.from('mk3_garagem').insert({
        user_id: session.user.id,
        modelo: form.modelo,
        ano: form.ano,
        cor: form.cor,
        descricao: form.descricao
      });
      navigate('/feed');
    } else {
      navigate('/login');
    }
  };

  return (
    <PageWrapper>
      <FormContainer>
        <Title>Bem-vindo à Garagem! 🚗💨</Title>
        <Subtitle>Para começar, cadastre o seu primeiro carro na sua garagem virtual.</Subtitle>
        
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <label>Versão / Modelo</label>
            <select value={form.modelo} onChange={e => setForm({...form, modelo: e.target.value})}>
              <option value="GTI">GTI (2.0 8v/16v)</option>
              <option value="GLX">GLX (2.0 8v)</option>
              <option value="VR6">VR6 (2.8 12v)</option>
              <option value="GL">GL (1.8 / 2.0)</option>
              <option value="Cabrio">Cabrio</option>
              <option value="Outro">Outro</option>
            </select>
          </FormGroup>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <FormGroup style={{ flex: 1 }}>
              <label>Ano</label>
              <input type="text" value={form.ano} onChange={e => setForm({...form, ano: e.target.value})} placeholder="Ex: 1995" />
            </FormGroup>
            <FormGroup style={{ flex: 1 }}>
              <label>Cor</label>
              <input type="text" value={form.cor} onChange={e => setForm({...form, cor: e.target.value})} placeholder="Ex: Vermelho Tornado" />
            </FormGroup>
          </div>

          <FormGroup>
            <label>Conte-nos um pouco sobre o seu projeto (Opcional)</label>
            <textarea 
              rows={4}
              value={form.descricao} 
              onChange={e => setForm({...form, descricao: e.target.value})}
              placeholder="Minha história com esse carro..."
            />
          </FormGroup>

          <Button type="submit" disabled={loading}>
            {loading ? 'Salvando Garagem...' : 'Estacionar o Carro e Continuar'}
          </Button>
          
          <button 
            type="button" 
            onClick={() => navigate('/feed')} 
            style={{ width: '100%', background: 'transparent', color: '#999', border: 'none', marginTop: '1rem', cursor: 'pointer' }}
          >
            Pular por enquanto (Fazer isso depois)
          </button>
        </form>
      </FormContainer>
    </PageWrapper>
  );
}
