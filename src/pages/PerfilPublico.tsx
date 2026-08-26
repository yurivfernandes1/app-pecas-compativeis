import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { supabase } from '../lib/supabase';
import { colors, media } from '../styles/GlobalStyles';
import { useParams, useNavigate } from 'react-router-dom';

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
  position: relative;

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

const ShareButton = styled.button`
  background: transparent;
  border: 1px solid ${colors.gray[700]};
  color: ${colors.white};
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  transition: all 0.2s;

  &:hover {
    background: #222;
    border-color: ${colors.primary};
  }
`;

const SectionTitle = styled.h2`
  color: white;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #222;
  padding-bottom: 0.5rem;
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

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Tag = styled.span<{ $type?: 'opcional' | 'peca' }>`
  background: ${props => props.$type === 'peca' ? 'rgba(255, 215, 0, 0.1)' : '#222'};
  color: ${props => props.$type === 'peca' ? '#FFD700' : '#ccc'};
  border: 1px solid ${props => props.$type === 'peca' ? 'rgba(255, 215, 0, 0.3)' : '#333'};
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
`;

const SaleBadge = styled.div`
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(0,0,0,0) 100%);
  border: 1px solid ${colors.primary};
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1.5rem;

  h4 {
    color: ${colors.primary};
    margin: 0 0 0.5rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .price {
    font-size: 1.5rem;
    color: white;
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .contact {
    display: flex;
    gap: 1rem;
    color: #ccc;
    font-size: 0.9rem;
    
    a {
      color: #25D366;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

const ProblemasBox = styled.div`
  background: rgba(255, 165, 0, 0.1);
  border-left: 4px solid orange;
  padding: 1rem;
  margin-top: 1.5rem;

  h4 {
    color: orange;
    margin: 0 0 0.5rem 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  p {
    color: #ddd;
    margin: 0;
    font-size: 0.9rem;
  }
`;

export default function PerfilPublico() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [carros, setCarros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const fetchProfile = async () => {
    if (!username) return;
    setLoading(true);

    const { data: userProfile, error: profileError } = await supabase
      .from('mk3_users')
      .select('*')
      .eq('username', username)
      .single();

    if (profileError || !userProfile) {
      setLoading(false);
      return;
    }

    setProfile(userProfile);

    const { data: userCarros } = await supabase
      .from('mk3_garagem')
      .select('*')
      .eq('user_id', userProfile.id)
      .order('created_at', { ascending: false });

    setCarros(userCarros || []);
    setLoading(false);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Perfil de @${profile.username} na Comunidade MK3`,
          url: url
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Link do perfil copiado para compartilhar!');
    }
  };

  if (loading) {
    return <PageWrapper><Container><h2 style={{color:'white'}}>Carregando perfil...</h2></Container></PageWrapper>;
  }

  if (!profile) {
    return (
      <PageWrapper>
        <Container style={{ textAlign: 'center', paddingTop: '4rem' }}>
          <i className="fas fa-user-slash" style={{ fontSize: '4rem', color: '#555', marginBottom: '1rem' }}></i>
          <h2 style={{color:'white'}}>Usuário não encontrado</h2>
          <button onClick={() => navigate('/feed')} style={{ marginTop: '1rem', padding: '0.8rem 1.5rem', background: colors.primary, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            Voltar para Comunidade
          </button>
        </Container>
      </PageWrapper>
    );
  }

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
          </ProfileInfo>
          <ShareButton onClick={handleShare}>
            <i className="fas fa-share-alt"></i> Compartilhar
          </ShareButton>
        </ProfileHeader>

        <SectionTitle>
          Garagem de @{profile.username}
        </SectionTitle>

        {carros.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: '#111', borderRadius: '12px' }}>
            <h3 style={{ color: '#888' }}>Esta garagem está vazia!</h3>
          </div>
        ) : (
          carros.map(carro => (
            <CarCard key={carro.id}>
              <CarGallery>
                {carro.fotos && carro.fotos.length > 0 ? (
                  <img src={carro.fotos[0]} alt={carro.modelo} />
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
                  {carro.origem && <span><i className="fas fa-globe"></i> {carro.origem}</span>}
                </div>
                <p>{carro.descricao || 'Nenhuma descrição fornecida.'}</p>

                {(carro.opcionais?.length > 0 || carro.pecas_raras?.length > 0) && (
                  <TagsContainer>
                    {carro.pecas_raras?.map((p: string) => <Tag key={p} $type="peca"><i className="fas fa-gem"></i> {p}</Tag>)}
                    {carro.opcionais?.map((o: string) => <Tag key={o}>{o}</Tag>)}
                  </TagsContainer>
                )}

                {carro.problemas_atuais && (
                  <ProblemasBox>
                    <h4><i className="fas fa-wrench"></i> Precisa de Ajuda</h4>
                    <p>{carro.problemas_atuais}</p>
                  </ProblemasBox>
                )}

                {carro.venda_ativo && (
                  <SaleBadge>
                    <h4><i className="fas fa-tags"></i> À Venda</h4>
                    <div className="price">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(carro.venda_preco || 0)}
                    </div>
                    <div className="contact">
                      {profile.cidade && profile.estado && (
                        <span><i className="fas fa-map-marker-alt"></i> {profile.cidade} - {profile.estado}</span>
                      )}
                      {profile.telefone && (
                        <a href={`https://wa.me/${profile.telefone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                          <i className="fab fa-whatsapp"></i> Falar com dono
                        </a>
                      )}
                    </div>
                  </SaleBadge>
                )}

                <button 
                  onClick={() => navigate(`/carro/${carro.id}`)}
                  style={{
                    marginTop: '1.5rem',
                    background: 'transparent',
                    border: '1px solid #333',
                    color: 'white',
                    padding: '0.8rem 1.5rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    width: '100%',
                    fontWeight: 'bold',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.borderColor = colors.primary}
                  onMouseOut={(e) => e.currentTarget.style.borderColor = '#333'}
                >
                  <i className="fas fa-search"></i> Ver Projeto Completo
                </button>
              </CarInfo>
            </CarCard>
          ))
        )}
      </Container>
    </PageWrapper>
  );
}
