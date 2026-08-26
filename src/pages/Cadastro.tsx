import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { colors } from '../styles/GlobalStyles';
import { AsYouType, CountryCode } from 'libphonenumber-js';

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

const AvatarPreview = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 2px solid ${colors.primary};
  object-fit: cover;
  background: #222;
  box-shadow: 0 0 15px rgba(220, 38, 38, 0.4);
`;

const DropZone = styled.div<{ $isDragActive: boolean }>`
  width: 100%;
  border: 2px dashed ${props => props.$isDragActive ? colors.primary : '#333'};
  background: ${props => props.$isDragActive ? 'rgba(220, 38, 38, 0.05)' : '#1a1a1a'};
  border-radius: 12px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;

  &:hover {
    border-color: ${colors.primary};
    background: rgba(220, 38, 38, 0.05);
  }

  i {
    font-size: 2rem;
    color: ${props => props.$isDragActive ? colors.primary : colors.gray[400]};
    margin-bottom: 1rem;
    transition: color 0.3s ease;
  }

  p {
    color: ${colors.gray[300]};
    font-size: 0.95rem;
    margin: 0;
  }
  
  span {
    color: ${colors.primary};
    font-weight: bold;
  }
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

const FormGroup = styled.div<{ $visible?: boolean }>`
  margin-bottom: 1.5rem;
  display: ${props => (props.$visible === false ? 'none' : 'block')};
  animation: ${fadeIn} 0.4s ease-out forwards;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    color: ${colors.gray[300]};
    font-size: 0.9rem;
  }
  
  input, select {
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

const OutlineButton = styled(Button)`
  background: transparent;
  border: 1px solid ${colors.primary};
  color: ${colors.primary};
  margin-top: 0.5rem;

  &:hover:not(:disabled) {
    background: rgba(220, 38, 38, 0.1);
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

const StepsIndicator = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
`;

const StepDot = styled.div<{ $active: boolean }>`
  width: 30px;
  height: 6px;
  border-radius: 3px;
  background: ${props => props.$active ? colors.primary : '#333'};
  transition: all 0.3s ease;
`;

const CustomSelectWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const CustomSelectHeader = styled.div<{ $isOpen: boolean }>`
  width: 100%;
  padding: 0.8rem 1rem;
  background: #1a1a1a;
  border: 1px solid ${props => props.$isOpen ? colors.primary : '#333'};
  color: white;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: border-color 0.2s;

  i {
    transition: transform 0.3s ease;
    transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  }
`;

const CustomSelectList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 6px;
  margin-top: 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 100;
  padding: 0;
  list-style: none;
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
  animation: ${fadeIn} 0.2s ease-out;
`;

const CustomSelectOption = styled.li`
  padding: 0.8rem 1rem;
  color: white;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(220, 38, 38, 0.1);
    color: ${colors.primary};
  }
`;

export default function Cadastro() {
  const [step, setStep] = useState(1);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [pais, setPais] = useState('');
  const [cep, setCep] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');

  // Validation States
  const [emailStatus, setEmailStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [session, setSession] = useState<any>(null);
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const countries: { name: string, flag: string, code: CountryCode }[] = [
    { name: 'Brasil', flag: '🇧🇷', code: 'BR' },
    { name: 'México', flag: '🇲🇽', code: 'MX' },
    { name: 'Estados Unidos', flag: '🇺🇸', code: 'US' },
    { name: 'Alemanha', flag: '🇩🇪', code: 'DE' },
    { name: 'Andorra', flag: '🇦🇩', code: 'AD' },
    { name: 'Áustria', flag: '🇦🇹', code: 'AT' },
    { name: 'Bélgica', flag: '🇧🇪', code: 'BE' },
    { name: 'Bósnia e Herzegovina', flag: '🇧🇦', code: 'BA' },
    { name: 'Bulgária', flag: '🇧🇬', code: 'BG' },
    { name: 'Chipre', flag: '🇨🇾', code: 'CY' },
    { name: 'Croácia', flag: '🇭🇷', code: 'HR' },
    { name: 'Dinamarca', flag: '🇩🇰', code: 'DK' },
    { name: 'Eslováquia', flag: '🇸🇰', code: 'SK' },
    { name: 'Eslovênia', flag: '🇸🇮', code: 'SI' },
    { name: 'Espanha', flag: '🇪🇸', code: 'ES' },
    { name: 'Estônia', flag: '🇪🇪', code: 'EE' },
    { name: 'Finlândia', flag: '🇫🇮', code: 'FI' },
    { name: 'França', flag: '🇫🇷', code: 'FR' },
    { name: 'Grécia', flag: '🇬🇷', code: 'GR' },
    { name: 'Hungria', flag: '🇭🇺', code: 'HU' },
    { name: 'Irlanda', flag: '🇮🇪', code: 'IE' },
    { name: 'Islândia', flag: '🇮🇸', code: 'IS' },
    { name: 'Itália', flag: '🇮🇹', code: 'IT' },
    { name: 'Letônia', flag: '🇱🇻', code: 'LV' },
    { name: 'Liechtenstein', flag: '🇱🇮', code: 'LI' },
    { name: 'Lituânia', flag: '🇱🇹', code: 'LT' },
    { name: 'Luxemburgo', flag: '🇱🇺', code: 'LU' },
    { name: 'Malta', flag: '🇲🇹', code: 'MT' },
    { name: 'Moldávia', flag: '🇲🇩', code: 'MD' },
    { name: 'Mônaco', flag: '🇲🇨', code: 'MC' },
    { name: 'Montenegro', flag: '🇲🇪', code: 'ME' },
    { name: 'Noruega', flag: '🇳🇴', code: 'NO' },
    { name: 'Países Baixos', flag: '🇳🇱', code: 'NL' },
    { name: 'Polônia', flag: '🇵🇱', code: 'PL' },
    { name: 'Portugal', flag: '🇵🇹', code: 'PT' },
    { name: 'Reino Unido', flag: '🇬🇧', code: 'GB' },
    { name: 'República Tcheca', flag: '🇨🇿', code: 'CZ' },
    { name: 'Romênia', flag: '🇷🇴', code: 'RO' },
    { name: 'San Marino', flag: '🇸🇲', code: 'SM' },
    { name: 'Sérvia', flag: '🇷🇸', code: 'RS' },
    { name: 'Suécia', flag: '🇸🇪', code: 'SE' },
    { name: 'Suíça', flag: '🇨🇭', code: 'CH' },
    { name: 'Ucrânia', flag: '🇺🇦', code: 'UA' },
    { name: 'Vaticano', flag: '🇻🇦', code: 'VA' }
  ];

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) {
        setEmail(data.session.user.email || '');
      }
    });
  }, []);

  // Real-time Email Validation
  useEffect(() => {
    if (session || !email || !email.includes('@')) {
      setEmailStatus('idle');
      return;
    }
    setEmailStatus('checking');
    const timer = setTimeout(async () => {
      const { data, error } = await supabase.rpc('check_email_available', { email_to_check: email });
      if (!error) {
        setEmailStatus(data ? 'available' : 'taken');
      } else {
        setEmailStatus('idle');
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [email, session]);

  // Real-time Username Validation
  useEffect(() => {
    if (!username || username.length < 3) {
      setUsernameStatus('idle');
      return;
    }
    setUsernameStatus('checking');
    const timer = setTimeout(async () => {
      const { data, error } = await supabase.rpc('check_username_available', { username_to_check: username });
      if (!error) {
        setUsernameStatus(data ? 'available' : 'taken');
      } else {
        setUsernameStatus('idle');
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [username]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    const country = countries.find(c => c.name === pais);
    
    if (country) {
      // Uso da biblioteca AsYouType para formatar impecavelmente em tempo real!
      const formatter = new AsYouType(country.code);
      // Extraimos os números limpos e mandamos pro formatador pra evitar sujeiras
      const digits = value.replace(/\D/g, '');
      const formatted = formatter.input(digits);
      setTelefone(formatted);
    } else {
      setTelefone(value.replace(/\D/g, ''));
    }
  };

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    
    if (pais === 'Brasil') {
      val = val.replace(/\D/g, '');
      if (val.length > 8) val = val.slice(0, 8);
      if (val.length > 5) {
        val = `${val.slice(0, 5)}-${val.slice(5)}`;
      }
    }
    setCep(val);

    // Auto-fill logic
    const cleanVal = val.replace(/\D/g, '');
    
    if (pais === 'Brasil' && cleanVal.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanVal}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setCidade(data.localidade);
          setEstado(data.uf);
        }
      } catch (err) {
        console.error('Erro ao buscar CEP', err);
      }
    } else if (pais === 'Estados Unidos' && cleanVal.length >= 5) {
      try {
        const res = await fetch(`https://api.zippopotam.us/us/${cleanVal}`);
        if (res.ok) {
          const data = await res.json();
          setCidade(data.places[0]['place name']);
          setEstado(data.places[0]['state abbreviation']);
        }
      } catch (err) {}
    } else if (pais === 'México' && cleanVal.length >= 5) {
      try {
        const res = await fetch(`https://api.zippopotam.us/mx/${cleanVal}`);
        if (res.ok) {
          const data = await res.json();
          setCidade(data.places[0]['place name']);
          setEstado(data.places[0]['state abbreviation']);
        }
      } catch (err) {}
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
      } else {
        setError('Por favor, envie apenas arquivos de imagem.');
      }
    }
  };

  const handleNextStep = () => {
    setError('');
    
    // Validações básicas Passo 1
    if (!nome || !telefone || !pais || !cep || !cidade || !estado || !username) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    if (!session && !email) {
      setError('O E-mail é obrigatório.');
      return;
    }

    setStep(2);
  };

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!session) {
      if (password !== confirmPassword) {
        setError('As senhas não coincidem.');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('A senha deve ter no mínimo 6 caracteres.');
        setLoading(false);
        return;
      }
    }

    let avatar_url = null;

    if (session) {
      // Se tiver avatar, faz o upload (opcional)
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${session.user.id}-${Math.random()}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
          .from('avatars')
          .upload(fileName, avatarFile);
        
        if (!uploadError && data) {
          const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
          avatar_url = publicUrlData.publicUrl;
        }
      }

      const { error: profileError } = await supabase
        .from('mk3_users')
        .insert({
          id: session.user.id,
          username: username.toLowerCase().replace(/[^a-z0-9_]/g, ''),
          nome_completo: nome,
          telefone: telefone,
          pais: pais,
          cep: cep,
          cidade: cidade,
          estado: estado,
          avatar_url: avatar_url,
          is_premium: true,
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
      if (!authData.session) {
        // Isso acontece se:
        // 1. O e-mail já está cadastrado (proteção contra enumeração do Supabase retorna usuário falso sem sessão)
        // 2. Ou se a confirmação de e-mail ainda está ligada no painel.
        setError('Este e-mail já está cadastrado ou requer confirmação. Tente fazer login ou use outro e-mail.');
        setLoading(false);
        return;
      }

      // Se tiver avatar, faz o upload
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${authData.user.id}-${Math.random()}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
          .from('avatars')
          .upload(fileName, avatarFile);
        
        if (!uploadError && data) {
          const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
          avatar_url = publicUrlData.publicUrl;
        }
      }

      const { error: profileError } = await supabase
        .from('mk3_users')
        .insert({
          id: authData.user.id,
          username: username.toLowerCase().replace(/[^a-z0-9_]/g, ''),
          nome_completo: nome,
          bio: bio,
          telefone: telefone,
          pais: pais,
          cep: cep,
          cidade: cidade,
          estado: estado,
          avatar_url: avatar_url
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
    } else {
      setError('Erro ao criar usuário.');
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <FormContainer>
        <ProfileImage
          src="https://raw.githubusercontent.com/yurivfernandes1/app-pecas-compativeis/refs/heads/main/Perfil1.png"
          alt="Falando de GTI"
        />
        <Title>{session ? 'Completar Perfil' : 'Criar Garagem'}</Title>
        <Subtitle>
          {session 
            ? 'Precisamos apenas de mais alguns dados.' 
            : 'Junte-se à maior comunidade de Golf MK3'
          }
        </Subtitle>
        
        {!session && (
          <StepsIndicator>
            <StepDot $active={step >= 1} />
            <StepDot $active={step >= 2} />
            <StepDot $active={step >= 3} />
          </StepsIndicator>
        )}

        <form onSubmit={session ? handleCadastro : (step === 3 ? handleCadastro : (e) => { e.preventDefault(); setError(''); setStep(step + 1); })} style={{ width: '100%' }}>
          
          {/* ETAPA 1: Dados Básicos */}
          {step === 1 && (
            <>
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
                <label>Biografia curta (Opcional)</label>
                <textarea 
                  rows={2}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Amante de carros antigos..."
                  style={{ width: '100%', padding: '0.8rem 1rem', background: '#1a1a1a', border: '1px solid #333', color: 'white', borderRadius: '6px' }}
                />
              </FormGroup>

              {nome.length > 2 && (
                <FormGroup style={{ position: 'relative', zIndex: 50 }}>
                  <label>País</label>
                  <CustomSelectWrapper>
                    <CustomSelectHeader 
                      $isOpen={isSelectOpen}
                      onClick={() => setIsSelectOpen(!isSelectOpen)}
                    >
                      {pais ? (
                        <span>
                          {countries.find(c => c.name === pais)?.flag} {pais}
                        </span>
                      ) : 'Selecione o País...'}
                      <i className="fas fa-chevron-down"></i>
                    </CustomSelectHeader>
                    {isSelectOpen && (
                      <CustomSelectList>
                        {countries.map(country => (
                          <CustomSelectOption 
                            key={country.name}
                            onClick={() => {
                              setPais(country.name);
                              setTelefone(''); // Reseta o telefone pra evitar conflito de máscara
                              setIsSelectOpen(false);
                            }}
                          >
                            {country.flag} {country.name}
                          </CustomSelectOption>
                        ))}
                      </CustomSelectList>
                    )}
                  </CustomSelectWrapper>
                </FormGroup>
              )}

              {pais && (
                <>
                  <FormGroup>
                    <label>Telefone / WhatsApp</label>
                    <input 
                      type="text" 
                      required 
                      value={telefone}
                      onChange={handlePhoneChange}
                      placeholder={
                        pais === 'Brasil' ? "(11) 99999-9999" : 
                        (pais === 'Estados Unidos' || pais === 'México') ? "(555) 555-5555" : 
                        "Digite seu número"
                      }
                    />
                  </FormGroup>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <FormGroup style={{ flex: 1 }}>
                      <label>{pais === 'Estados Unidos' ? 'Zip Code' : 'CEP (Cód Postal)'}</label>
                      <input 
                        type="text" 
                        required 
                        value={cep}
                        onChange={handleCepChange}
                        placeholder={pais === 'Estados Unidos' ? '00000' : '00000-000'}
                      />
                    </FormGroup>
                    <FormGroup style={{ flex: 1 }}>
                      <label>Cidade</label>
                      <input 
                        type="text" 
                        required 
                        value={cidade}
                        onChange={e => setCidade(e.target.value)}
                        placeholder="Sua cidade"
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

                  {!session && (
                    <FormGroup>
                      <label>E-mail</label>
                      <input 
                        type="email" 
                        required 
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        style={{ borderColor: emailStatus === 'taken' ? '#f87171' : emailStatus === 'available' ? '#4ade80' : '#333' }}
                      />
                      {emailStatus === 'checking' && <small style={{ color: colors.gray[400] }}>Verificando...</small>}
                      {emailStatus === 'taken' && <small style={{ color: '#f87171' }}>Este e-mail já está em uso.</small>}
                      {emailStatus === 'available' && <small style={{ color: '#4ade80' }}>E-mail disponível!</small>}
                    </FormGroup>
                  )}

                  <FormGroup>
                    <label>Nome de Usuário (@)</label>
                    <input 
                      type="text" 
                      required 
                      value={username}
                      onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      placeholder="seunome"
                      style={{ borderColor: usernameStatus === 'taken' ? '#f87171' : usernameStatus === 'available' ? '#4ade80' : '#333' }}
                    />
                    {usernameStatus === 'checking' && <small style={{ color: colors.gray[400] }}>Verificando...</small>}
                    {usernameStatus === 'taken' && <small style={{ color: '#f87171' }}>Nome de usuário já existe.</small>}
                    {usernameStatus === 'available' && <small style={{ color: '#4ade80' }}>Nome de usuário disponível!</small>}
                  </FormGroup>
                </>
              )}

              {error && <ErrorText>{error}</ErrorText>}

              <Button type="button" onClick={handleNextStep}>
                {session ? 'Próxima Etapa (Foto)' : 'Próxima Etapa'}
              </Button>
            </>
          )}

          {/* ETAPA 2: Foto de Perfil */}
          {step === 2 && (
            <>
              <FormGroup>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', marginTop: '1rem', marginBottom: '2rem' }}>
                  
                  <DropZone 
                    $isDragActive={isDragActive}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {avatarPreview ? (
                      <AvatarPreview src={avatarPreview} alt="Preview do Perfil" />
                    ) : (
                      <i className="fas fa-cloud-upload-alt"></i>
                    )}
                    <p style={{ marginTop: avatarPreview ? '1rem' : '0' }}>
                      {avatarPreview ? 'Clique ou arraste outra imagem para trocar' : <>Arraste sua foto para cá ou <span>clique para procurar</span></>}
                    </p>
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept="image/*"
                      onChange={e => {
                        if (e.target.files && e.target.files.length > 0) {
                          const file = e.target.files[0];
                          if (file.type.startsWith('image/')) {
                            setAvatarFile(file);
                            setAvatarPreview(URL.createObjectURL(file));
                          }
                        }
                      }}
                      style={{ display: 'none' }}
                    />
                  </DropZone>
                </div>
              </FormGroup>

              {error && <ErrorText>{error}</ErrorText>}

              <Button type="submit">
                {session ? 'Finalizar Cadastro' : 'Próxima Etapa (Senha)'}
              </Button>
              <OutlineButton type="button" onClick={() => { setStep(1); setError(''); }}>
                Voltar
              </OutlineButton>
            </>
          )}

          {/* ETAPA 3: Senha */}
          {step === 3 && !session && (
            <>
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

              <FormGroup>
                <label>Confirmar Senha</label>
                <input 
                  type="password" 
                  required 
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Digite a senha novamente"
                  minLength={6}
                />
              </FormGroup>

              {error && <ErrorText>{error}</ErrorText>}

              <Button type="submit" disabled={loading}>
                {loading ? 'Criando garagem...' : 'Finalizar Cadastro'}
              </Button>
              <OutlineButton type="button" onClick={() => { setStep(2); setError(''); }}>
                Voltar
              </OutlineButton>
            </>
          )}

        </form>

        {!session && step === 1 && (
          <Links>
            Já tem uma garagem? <Link to="/login">Fazer login</Link>
          </Links>
        )}
      </FormContainer>
    </PageWrapper>
  );
}
