import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { colors, media } from '../styles/GlobalStyles';

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #050505;
  padding: 2rem 1rem;
`;

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const ProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  background: #111;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #222;
  margin-bottom: 2rem;

  ${media.tablet} {
    flex-direction: row;
  }
  flex-direction: column;
  text-align: center;
`;

const Avatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid ${colors.primary};
`;

const ProfileInfo = styled.div`
  flex: 1;
  text-align: left;
  
  h1 {
    margin: 0 0 0.5rem 0;
    color: white;
  }

  p {
    color: ${colors.gray[400]};
    margin: 0 0 1rem 0;
  }

  .premium-badge {
    display: inline-block;
    background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
    color: black;
    font-size: 0.8rem;
    font-weight: bold;
    padding: 0.2rem 0.6rem;
    border-radius: 4px;
    margin-left: 1rem;
    vertical-align: middle;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  
  button {
    padding: 0.6rem 1.2rem;
    border-radius: 6px;
    font-weight: bold;
    cursor: pointer;
    border: none;
  }
  
  .btn-primary {
    background: ${colors.primary};
    color: white;
  }
  
  .btn-secondary {
    background: transparent;
    color: white;
    border: 1px solid #444;
  }
`;

const SectionTitle = styled.h2`
  color: white;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #222;
  padding-bottom: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  button {
    background: transparent;
    border: 1px solid ${colors.primary};
    color: ${colors.primary};
    padding: 0.4rem 0.8rem;
    border-radius: 4px;
    font-size: 0.9rem;
    cursor: pointer;
    
    &:hover {
      background: rgba(220, 38, 38, 0.1);
    }
  }
`;

const CarCard = styled.div`
  background: #111;
  border-radius: 12px;
  border: 1px solid #222;
  overflow: hidden;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;

  ${media.tablet} {
    flex-direction: row;
  }
`;

const CarGallery = styled.div`
  flex: 1;
  min-height: 300px;
  background: #0a0a0a;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
  }

  .nav-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0,0,0,0.5);
    color: white;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
    z-index: 10;
    
    &:hover {
      background: ${colors.primary};
    }
  }
  
  .prev { left: 10px; }
  .next { right: 10px; }
`;

const CarInfo = styled.div`
  flex: 1;
  padding: 2rem;
  
  h3 {
    margin: 0 0 1rem 0;
    color: white;
    font-size: 1.8rem;
  }
  
  .specs {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
    
    span {
      background: #222;
      padding: 0.4rem 0.8rem;
      border-radius: 4px;
      color: ${colors.gray[300]};
      font-size: 0.9rem;
    }
  }

  p {
    color: ${colors.gray[400]};
    line-height: 1.6;
  }
`;

const ToastContainer = styled.div<{ $show: boolean }>`
  position: fixed;
  bottom: ${props => props.$show ? '30px' : '-150px'};
  left: 50%;
  transform: translateX(-50%);
  background: #111;
  border: 2px solid ${colors.primary};
  border-radius: 12px;
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 10px 40px rgba(220, 38, 38, 0.4);
  transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  z-index: 1000;
  
  i {
    font-size: 2.5rem;
    color: ${colors.primary};
    animation: bounce 2s infinite;
  }
  
  h3 {
    color: white;
    margin: 0 0 0.5rem 0;
  }
  
  p {
    color: ${colors.gray[300]};
    margin: 0;
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
    40% {transform: translateY(-15px);}
    60% {transform: translateY(-7px);}
  }
`;

export default function MinhaGaragem() {
  const [profile, setProfile] = useState<any>(null);
  const [carros, setCarros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePhotoIndexes, setActivePhotoIndexes] = useState<Record<string, number>>({});
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isSuccess = false;
    // Check for Stripe success redirect
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      isSuccess = true;
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 6000);
      // Clean up the URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    fetchGaragem(isSuccess);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchGaragem = async (isSuccessFromUrl = false) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login');
      return;
    }

    const { data: userProfile } = await supabase
      .from('mk3_users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    const { data: userCarros } = await supabase
      .from('mk3_garagem')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    // If we just returned from a successful payment, optimistically show premium
    if (isSuccessFromUrl && userProfile) {
      userProfile.is_premium = true;
    }

    setProfile(userProfile);
    setCarros(userCarros || []);
    
    const indexes: Record<string, number> = {};
    userCarros?.forEach(c => { indexes[c.id] = 0; });
    setActivePhotoIndexes(indexes);
    
    setLoading(false);
  };

  const nextPhoto = (carroId: string, max: number) => {
    setActivePhotoIndexes(prev => ({
      ...prev,
      [carroId]: prev[carroId] === max - 1 ? 0 : prev[carroId] + 1
    }));
  };

  const prevPhoto = (carroId: string, max: number) => {
    setActivePhotoIndexes(prev => ({
      ...prev,
      [carroId]: prev[carroId] === 0 ? max - 1 : prev[carroId] - 1
    }));
  };

  if (loading) return <PageWrapper><Container><h2 style={{color:'white'}}>Carregando...</h2></Container></PageWrapper>;

  const isPremium = profile?.is_premium || profile?.premium_manual;
  const canAddCar = isPremium || carros.length === 0;

  return (
    <PageWrapper>
      <Container>
        <ProfileHeader>
          <Avatar src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.nome_completo || profile?.username || 'GTI'}&background=222222&color=dc2626&size=150`} alt="Avatar" />
          <ProfileInfo>
            <h1>
              {profile?.nome_completo || profile?.username} 
              {(profile?.is_premium || profile?.premium_manual) && <span className="premium-badge">VIP</span>}
            </h1>
            <p>@{profile?.username}</p>
            <p>{profile?.bio || 'Nenhuma biografia adicionada.'}</p>
            <ButtonGroup>
              <button className="btn-primary" onClick={() => navigate('/editar-perfil')}>Editar Perfil</button>
            </ButtonGroup>
          </ProfileInfo>
        </ProfileHeader>

        <SectionTitle>
          Meus Projetos
          {canAddCar ? (
            <button onClick={() => navigate('/onboarding')}><i className="fas fa-plus"></i> Novo Carro</button>
          ) : (
            <button onClick={() => navigate('/onboarding')}>
              <i className="fas fa-lock"></i> Novo Carro (Premium)
            </button>
          )}
        </SectionTitle>

        {carros.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: '#111', borderRadius: '12px' }}>
            <h3 style={{ color: 'white' }}>Sua garagem está vazia!</h3>
            <p style={{ color: '#888', marginBottom: '1rem' }}>Adicione o seu primeiro Golf MK3 para mostrar pra galera.</p>
            <button 
              onClick={() => navigate('/onboarding')}
              style={{ background: colors.primary, color: 'white', border: 'none', padding: '0.8rem 1.5rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Adicionar Carro
            </button>
          </div>
        ) : (
          carros.map(carro => (
            <CarCard key={carro.id}>
              <CarGallery>
                {carro.fotos && carro.fotos.length > 0 ? (
                  <>
                    <img src={carro.fotos[activePhotoIndexes[carro.id]]} alt={carro.modelo} />
                    {carro.fotos.length > 1 && (
                      <>
                        <button className="nav-btn prev" onClick={() => prevPhoto(carro.id, carro.fotos.length)}>
                          <i className="fas fa-chevron-left"></i>
                        </button>
                        <button className="nav-btn next" onClick={() => nextPhoto(carro.id, carro.fotos.length)}>
                          <i className="fas fa-chevron-right"></i>
                        </button>
                        <div style={{ position: 'absolute', bottom: '10px', background: 'rgba(0,0,0,0.6)', padding: '2px 8px', borderRadius: '10px', color: 'white', fontSize: '0.8rem' }}>
                          {activePhotoIndexes[carro.id] + 1} / {carro.fotos.length}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#555', flexDirection: 'column' }}>
                    <i className="fas fa-car" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
                    <span>Sem fotos</span>
                  </div>
                )}
              </CarGallery>
              <CarInfo>
                <h3>Golf {carro.modelo}</h3>
                <div className="specs">
                  <span><i className="far fa-calendar-alt"></i> {carro.ano}</span>
                  <span><i className="fas fa-palette"></i> {carro.cor}</span>
                </div>
                <p>{carro.descricao || 'Nenhuma descrição fornecida para este projeto.'}</p>
                <button 
                  onClick={() => navigate(`/editar-carro/${carro.id}`)}
                  style={{ marginTop: '1rem', background: 'transparent', color: colors.primary, border: `1px solid ${colors.primary}`, padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
                >
                  <i className="fas fa-edit"></i> Editar Projeto
                </button>
              </CarInfo>
            </CarCard>
          ))
        )}

      </Container>
      
      <ToastContainer $show={showSuccessToast}>
        <i className="fas fa-trophy"></i>
        <div>
          <h3>Pagamento Aprovado! 🚀</h3>
          <p>Bem-vindo ao Clube VIP! Suas vantagens foram ativadas.</p>
        </div>
      </ToastContainer>
    </PageWrapper>
  );
}
