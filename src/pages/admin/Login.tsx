import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { colors } from '../../styles/GlobalStyles';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 20px;
  background: #000;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
  background: #111;
  padding: 3rem 2rem;
  border-radius: 12px;
  border: 1px solid #333;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  gap: 15px;
  animation: ${fadeIn} 0.6s ease-out forwards;
`;

const ProfileImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px solid ${colors.primary};
  object-fit: cover;
  margin-bottom: 1rem;
  box-shadow: 0 0 15px rgba(220, 38, 38, 0.4);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: ${colors.white};
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  background: #1a1a1a;
  border: 1px solid #333;
  color: white;
  border-radius: 6px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  background: ${colors.primary};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 10px;
  
  &:hover:not(:disabled) {
    background: #b91c1c;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMsg = styled.div`
  color: #f87171;
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
        <ProfileImage
          src="https://raw.githubusercontent.com/yurivfernandes1/app-pecas-compativeis/refs/heads/main/Perfil1.png"
          alt="Falando de GTI"
        />
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
