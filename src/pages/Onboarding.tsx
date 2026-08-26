import React, { useState, useEffect, useRef } from 'react';
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
  
  input, textarea {
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

const DropZone = styled.div<{ $isDragActive: boolean }>`
  border: 2px dashed ${props => props.$isDragActive ? colors.primary : '#333'};
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  background: ${props => props.$isDragActive ? 'rgba(220, 38, 38, 0.05)' : '#1a1a1a'};
  color: ${colors.gray[300]};
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1rem;

  &:hover {
    border-color: ${colors.primary};
    background: rgba(220, 38, 38, 0.05);
  }

  i {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: ${props => props.$isDragActive ? colors.primary : colors.gray[400]};
  }
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const PhotoPreview = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  button {
    position: absolute;
    top: 5px;
    right: 5px;
    background: rgba(220, 38, 38, 0.9);
    color: white;
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 0.8rem;
  }
`;

const PremiumBanner = styled.div`
  background: linear-gradient(135deg, rgba(220,38,38,0.1) 0%, rgba(0,0,0,0) 100%);
  border: 1px solid ${colors.primary};
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  div {
    flex: 1;
  }

  h4 {
    color: ${colors.primary};
    margin: 0 0 0.25rem 0;
  }

  p {
    margin: 0;
    font-size: 0.85rem;
    color: ${colors.gray[300]};
  }

  button {
    background: ${colors.primary};
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
    margin-left: 1rem;
    
    &:hover {
      background: #b91c1c;
    }
  }
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

const PlanGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 2rem;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const PlanCard = styled.div<{ $isPremium?: boolean }>`
  background: ${props => props.$isPremium ? 'linear-gradient(145deg, #1a1010 0%, #111 100%)' : '#111'};
  border: 2px solid ${props => props.$isPremium ? colors.primary : '#333'};
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-5px);
  }
  
  h3 {
    color: ${props => props.$isPremium ? colors.primary : 'white'};
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
  
  .price {
    font-size: 2rem;
    color: white;
    font-weight: bold;
    margin-bottom: 1.5rem;
    
    span {
      font-size: 1rem;
      color: #999;
    }
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0 0 2rem 0;
    text-align: left;
    flex: 1;
    
    li {
      margin-bottom: 0.8rem;
      color: #ccc;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      
      i {
        color: ${props => props.$isPremium ? colors.primary : '#666'};
      }
    }
  }
`;

const PopularBadge = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: ${colors.primary};
  color: white;
  padding: 0.2rem 1rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
  letter-spacing: 1px;
`;

export default function Onboarding() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [isPremium, setIsPremium] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [showPremiumOffer, setShowPremiumOffer] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);
  const [premiumPrice, setPremiumPrice] = useState('19.90');

  useEffect(() => {
    const fetchInitData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        let isUserPremium = false;
        const { data } = await supabase.from('mk3_users').select('is_premium, premium_manual').eq('id', session.user.id).single();
        if (data && (data.is_premium || data.premium_manual)) {
          isUserPremium = true;
          setIsPremium(true);
        }

        if (!isUserPremium) {
          const { count } = await supabase.from('mk3_garagem').select('*', { count: 'exact', head: true }).eq('user_id', session.user.id);
          if (count && count >= 1) {
            alert('Você atingiu o limite de carros do plano Grátis. Assine o Premium para adicionar mais!');
            navigate('/minha-garagem');
          }
        }
      }
      
      const { data: settings } = await supabase.from('mk3_settings').select('premium_price').limit(1).single();
      if (settings) {
        setPremiumPrice(Number(settings.premium_price).toFixed(2).replace('.', ','));
      }
    };
    fetchInitData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [form, setForm] = useState({
    modelo: 'GTI',
    ano: '1995',
    cor: 'Vermelho Tornado',
    descricao: ''
  });
  
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const modelos = [
    { label: 'GTI (2.0 8v/16v)', value: 'GTI' },
    { label: 'GLX (2.0 8v)', value: 'GLX' },
    { label: 'VR6 (2.8 12v)', value: 'VR6' },
    { label: 'GL (1.8 / 2.0)', value: 'GL' },
    { label: 'GT (2.0)', value: 'GT' },
    { label: 'CL (1.8)', value: 'CL' },
    { label: 'Highline (2.0)', value: 'Highline' },
    { label: 'Cabrio', value: 'Cabrio' },
    { label: 'Outro', value: 'Outro' }
  ];

  const handleFiles = (newFiles: File[]) => {
    const limit = isPremium ? 10 : 2;
    if (photos.length + newFiles.length > limit) {
      if (!isPremium) {
        setShowPremiumOffer(true);
      } else {
        alert(`Você atingiu o limite de ${limit} fotos.`);
      }
      const allowedCount = limit - photos.length;
      if (allowedCount > 0) {
        setPhotos([...photos, ...newFiles.slice(0, allowedCount)]);
      }
    } else {
      setPhotos([...photos, ...newFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    handleFiles(droppedFiles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      const uploadedUrls: string[] = [];

      for (const photo of photos) {
        const fileExt = photo.name.split('.').pop();
        const fileName = `${session.user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('garagem_fotos')
          .upload(fileName, photo);

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage.from('garagem_fotos').getPublicUrl(fileName);
          uploadedUrls.push(publicUrl);
        }
      }

      await supabase.from('mk3_garagem').insert({
        user_id: session.user.id,
        modelo: form.modelo,
        ano: form.ano,
        cor: form.cor,
        descricao: form.descricao,
        fotos: uploadedUrls
      });
      
      if (isPremium) {
        navigate('/minha-garagem');
      } else {
        setStep(2);
        setLoading(false);
      }
    } else {
      navigate('/login');
    }
  };

  const handleFreePlan = () => {
    navigate('/minha-garagem');
  };

  const handlePremiumPlan = () => {
    alert('Integração com Stripe será adicionada aqui! Redirecionando para a garagem por enquanto...');
    navigate('/minha-garagem');
  };

  return (
    <PageWrapper>
      <FormContainer style={step === 2 ? { maxWidth: '800px' } : {}}>
        {step === 1 ? (
          <>
            <Title>Bem-vindo à Garagem! 🚗💨</Title>
            <Subtitle>Para começar, cadastre o seu primeiro carro na sua garagem virtual.</Subtitle>
            
            <form onSubmit={handleSubmit}>
              <FormGroup style={{ position: 'relative', zIndex: 50 }}>
                <label>Versão / Modelo</label>
                <CustomSelectWrapper>
                  <CustomSelectHeader 
                    $isOpen={isSelectOpen}
                    onClick={() => setIsSelectOpen(!isSelectOpen)}
                  >
                    {modelos.find(m => m.value === form.modelo)?.label || 'Selecione...'}
                    <i className="fas fa-chevron-down"></i>
                  </CustomSelectHeader>
                  {isSelectOpen && (
                    <CustomSelectList>
                      {modelos.map(m => (
                        <CustomSelectOption 
                          key={m.value}
                          onClick={() => {
                            setForm({...form, modelo: m.value});
                            setIsSelectOpen(false);
                          }}
                        >
                          {m.label}
                        </CustomSelectOption>
                      ))}
                    </CustomSelectList>
                  )}
                </CustomSelectWrapper>
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

              <FormGroup>
                <label>Fotos do Projeto ({photos.length} de {isPremium ? 10 : 2})</label>
                <DropZone 
                  $isDragActive={isDragActive}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <i className="fas fa-camera"></i>
                  <p>Arraste fotos aqui ou clique para selecionar</p>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                    ref={fileInputRef}
                    onChange={(e) => {
                      if (e.target.files) handleFiles(Array.from(e.target.files));
                    }}
                  />
                </DropZone>
                
                {photos.length > 0 && (
                  <PhotoGrid>
                    {photos.map((p, idx) => (
                      <PhotoPreview key={idx}>
                        <img src={URL.createObjectURL(p)} alt="Preview" />
                        <button type="button" onClick={() => setPhotos(photos.filter((_, i) => i !== idx))}>
                          <i className="fas fa-times"></i>
                        </button>
                      </PhotoPreview>
                    ))}
                  </PhotoGrid>
                )}

                {showPremiumOffer && !isPremium && (
                  <PremiumBanner>
                    <div>
                      <h4>Destrave mais fotos! 🚀</h4>
                      <p>O plano Grátis permite apenas 2 fotos. Assine o Premium para exibir até 10 fotos da sua máquina.</p>
                    </div>
                    <button type="button" onClick={() => setStep(2)}>
                      Ver Planos
                    </button>
                  </PremiumBanner>
                )}
              </FormGroup>

              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando Garagem...' : 'Estacionar o Carro e Continuar'}
              </Button>
              
              <button 
                type="button" 
                onClick={() => setStep(2)} 
                style={{ width: '100%', background: 'transparent', color: '#999', border: 'none', marginTop: '1rem', cursor: 'pointer' }}
              >
                Pular por enquanto (Fazer isso depois)
              </button>
            </form>
          </>
        ) : (
          <>
            <Title>Escolha seu Plano 🏆</Title>
            <Subtitle>Você está quase lá! Como você deseja participar da comunidade?</Subtitle>
            
            <PlanGrid>
              <PlanCard>
                <h3>Entusiasta (Grátis)</h3>
                <div className="price">R$ 0 <span>/mês</span></div>
                <ul>
                  <li><i className="fas fa-check"></i> Acesso à comunidade</li>
                  <li><i className="fas fa-check"></i> 1 Carro na Garagem</li>
                  <li><i className="fas fa-check"></i> Até 2 fotos por carro</li>
                  <li><i className="fas fa-times" style={{color: '#555'}}></i> Selo Exclusivo</li>
                </ul>
                <Button onClick={handleFreePlan} style={{ background: '#333' }}>
                  Continuar Grátis
                </Button>
              </PlanCard>

              <PlanCard $isPremium>
                <PopularBadge>MAIS ESCOLHIDO</PopularBadge>
                <h3>Membro Premium</h3>
                <div className="price">R$ {premiumPrice} <span>/mês</span></div>
                <ul>
                  <li><i className="fas fa-check"></i> Acesso à comunidade</li>
                  <li><i className="fas fa-check"></i> Carros ilimitados</li>
                  <li><i className="fas fa-check"></i> Até 10 fotos por carro</li>
                  <li><i className="fas fa-check"></i> Selo Exclusivo no Perfil</li>
                  <li><i className="fas fa-check"></i> Suporte Prioritário</li>
                </ul>
                <Button onClick={handlePremiumPlan}>
                  Assinar Premium
                </Button>
              </PlanCard>
            </PlanGrid>
          </>
        )}
      </FormContainer>
    </PageWrapper>
  );
}
