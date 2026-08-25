import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 20px;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  gap: 15px;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
`;

const Button = styled.button`
  padding: 12px;
  background: #333;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  font-weight: bold;
  
  &:hover {
    background: #444;
  }
  
  &:disabled {
    background: #999;
  }
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #333;
`;

const ErrorMsg = styled.div`
  color: red;
  text-align: center;
  font-size: 14px;
`;

const Login: React.FC = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    let loginEmail = identifier;

    if (!identifier.includes('@')) {
      const { data, error: rpcError } = await supabase.rpc('get_login_email', {
        p_username: identifier.toLowerCase()
      });

      if (rpcError || !data) {
        setError('Credenciais inválidas.');
        setLoading(false);
        return;
      }
      loginEmail = data;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password,
    });

    if (error) {
      setError(error.message === 'Invalid login credentials' ? 'Credenciais inválidas.' : error.message);
      setLoading(false);
    } else {
      navigate('/admin/produtos');
    }
  };

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleLogin}>
        <Title>Admin Login</Title>
        {error && <ErrorMsg>{error}</ErrorMsg>}
        <Input 
          type="text" 
          placeholder="E-mail ou Nome de Usuário" 
          value={identifier} 
          onChange={e => setIdentifier(e.target.value)} 
          required 
        />
        <Input 
          type="password" 
          placeholder="Senha" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          required 
        />
        <Button type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </LoginForm>
    </LoginContainer>
  );
};

export default Login;
