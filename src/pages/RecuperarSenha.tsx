import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { colors } from '../styles/GlobalStyles';

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: #000;
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const FormContainer = styled.div`
  background: #111;
  padding: 3rem;
  border-radius: 12px;
  border: 1px solid #333;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
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

const Title = styled.h1`
  color: ${colors.white};
  text-align: center;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: ${colors.gray[400]};
  text-align: center;
  margin-bottom: 2rem;
  font-size: 0.95rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  width: 100%;
  
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

const SuccessText = styled.div`
  color: #4ade80;
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

export default function RecuperarSenha() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/nova-senha`,
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  return (
    <PageWrapper>
      <FormContainer>
        <ProfileImage
          src="https://raw.githubusercontent.com/yurivfernandes1/app-pecas-compativeis/refs/heads/main/Perfil1.png"
          alt="Falando de GTI"
        />
        <Title>Recuperar Senha</Title>
        <Subtitle>
          Digite o e-mail cadastrado na sua conta para enviarmos um link de redefinição de senha.
        </Subtitle>
        
        {!success ? (
          <form onSubmit={handleReset} style={{ width: '100%' }}>
            <FormGroup>
              <label>E-mail da sua conta</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
              />
            </FormGroup>

            {error && <ErrorText>{error}</ErrorText>}

            <Button type="submit" disabled={loading}>
              {loading ? 'Enviando link...' : 'Enviar link de recuperação'}
            </Button>
          </form>
        ) : (
          <SuccessText>
            Link de recuperação enviado! Verifique sua caixa de entrada e spam.
          </SuccessText>
        )}

        <Links>
          Lembrou a senha? <Link to="/login">Voltar ao Login</Link>
        </Links>
      </FormContainer>
    </PageWrapper>
  );
}
