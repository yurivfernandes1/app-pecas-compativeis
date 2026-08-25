import React, { useState } from 'react';
import styled from 'styled-components';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
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
  max-width: 500px;
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
  
  input {
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

const ErrorText = styled.div`
  color: #f87171;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  text-align: center;
`;

const Links = styled.div`
  margin-top: 2rem;
  text-align: center;
  font-size: 0.9rem;
  
  a {
    color: ${colors.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default function Cadastro() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // 1. Check if username is available
    const { data: existingUser } = await supabase
      .from('mk3_users')
      .select('id')
      .eq('username', username)
      .single();

    if (existingUser) {
      setError('Este nome de usuário já está em uso.');
      setLoading(false);
      return;
    }

    // 2. Sign up
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
      // 3. Create profile in mk3_users
      const { error: profileError } = await supabase
        .from('mk3_users')
        .insert({
          id: authData.user.id,
          username: username.toLowerCase().replace(/[^a-z0-9_]/g, '')
        });

      if (profileError) {
        console.error(profileError);
        // We shouldn't fail completely, but maybe show an error
      }
      
      // Redirect to Onboarding
      navigate('/onboarding');
    }
    setLoading(false);
  };

  return (
    <PageWrapper>
      <FormContainer>
        <Title>Criar Garagem</Title>
        <Subtitle>Junte-se à maior comunidade de Golf MK3</Subtitle>
        
        <form onSubmit={handleCadastro}>
          <FormGroup>
            <label>E-mail</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="seu@email.com"
            />
          </FormGroup>

          <FormGroup>
            <label>Nome de Usuário</label>
            <input 
              type="text" 
              required 
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="@meugolf"
              pattern="[a-zA-Z0-9_]+"
              title="Apenas letras, números e underline"
            />
          </FormGroup>

          <FormGroup>
            <label>Senha</label>
            <input 
              type="password" 
              required 
              minLength={6}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min. 6 caracteres"
            />
          </FormGroup>

          {error && <ErrorText>{error}</ErrorText>}

          <Button type="submit" disabled={loading}>
            {loading ? 'Criando Conta...' : 'Cadastrar e Criar Garagem'}
          </Button>
        </form>

        <Links>
          Já tem uma garagem? <Link to="/login">Fazer Login</Link>
        </Links>
      </FormContainer>
    </PageWrapper>
  );
}
