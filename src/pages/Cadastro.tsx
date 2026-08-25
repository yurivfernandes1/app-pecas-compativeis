import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
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
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) {
        setEmail(data.session.user.email || '');
      }
    });
  }, []);

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
    if (session) {
      // User is already logged in (like an admin). Just create the mk3_users record.
      const { error: profileError } = await supabase
        .from('mk3_users')
        .insert({
          id: session.user.id,
          username: username.toLowerCase().replace(/[^a-z0-9_]/g, ''),
          nome_completo: nome,
          telefone: telefone,
          cep: cep,
          cidade: cidade,
          estado: estado,
          is_premium: true, // Se já estava logado, provável que seja admin, damos premium
        });

      if (profileError) {
        if (profileError.code === '23505') {
          setError('Este nome de usuário já está em uso.');
        } else {
          setError(profileError.message);
        }
        setLoading(false);
      } else {
        navigate('/onboarding');
      }
      return;
    }

    // Normal signup flow
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
          username: username.toLowerCase().replace(/[^a-z0-9_]/g, ''),
          nome_completo: nome,
          telefone: telefone,
          cep: cep,
          cidade: cidade,
          estado: estado
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
        <ProfileImage
          src="https://raw.githubusercontent.com/yurivfernandes1/app-pecas-compativeis/refs/heads/main/Perfil1.png"
          alt="Falando de GTI"
        />
        <Title>Criar Garagem</Title>
        <Subtitle>Junte-se à maior comunidade de Golf MK3</Subtitle>
        
        <form onSubmit={handleCadastro} style={{ width: '100%' }}>
          <FormGroup>
            <label>Nome Completo</label>
            <input 
              type="text" 
              required 
              value={nome}
              onChange={e => setNome(e.target.value)}
              placeholder="João da Silva"
            />
          </FormGroup>

          <FormGroup>
            <label>Telefone / WhatsApp</label>
            <input 
              type="text" 
              required 
              value={telefone}
              onChange={e => setTelefone(e.target.value)}
              placeholder="(11) 99999-9999"
            />
          </FormGroup>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <FormGroup style={{ flex: 1 }}>
              <label>CEP</label>
              <input 
                type="text" 
                required 
                value={cep}
                onChange={e => setCep(e.target.value)}
                placeholder="00000-000"
              />
            </FormGroup>
            <FormGroup style={{ flex: 1 }}>
              <label>Cidade</label>
              <input 
                type="text" 
                required 
                value={cidade}
                onChange={e => setCidade(e.target.value)}
                placeholder="São Paulo"
              />
            </FormGroup>
            <FormGroup style={{ flex: 0.5 }}>
              <label>Estado</label>
              <input 
                type="text" 
                required 
                value={estado}
                onChange={e => setEstado(e.target.value)}
                placeholder="SP"
                maxLength={2}
              />
            </FormGroup>
          </div>

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
            <label>Nome de Usuário (@)</label>
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

          {!session && (
            <FormGroup>
              <label>Senha</label>
              <input 
                type="password" 
                required 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                minLength={6}
              />
            </FormGroup>
          )}

          {error && <ErrorText>{error}</ErrorText>}

          <Button type="submit" disabled={loading}>
            {loading ? 'Criando garagem...' : session ? 'Completar Meu Perfil' : 'Criar Garagem'}
          </Button>
        </form>

        {!session && (
          <Links>
            Já tem uma garagem? <Link to="/login">Fazer login</Link>
          </Links>
        )}
      </FormContainer>
    </PageWrapper>
  );
}
