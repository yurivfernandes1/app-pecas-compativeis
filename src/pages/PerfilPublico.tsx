import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { supabase } from '../lib/supabase';
import { colors } from '../styles/GlobalStyles';
import { useParams, useNavigate } from 'react-router-dom';
import CommunityLayout from '../components/CommunityLayout';
import { getObjectPosition } from '../utils/imagePos';

// --- STYLES ---

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: #111;
  padding: 3rem 2rem;
  border-radius: 12px;
  border: 1px solid #222;
  margin-bottom: 2rem;
`;

const AvatarLarge = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid ${colors.primary};
  margin-bottom: 1.5rem;
`;

const Name = styled.h1`
  margin: 0 0 0.5rem 0;
  color: white;
  font-size: 1.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const Username = styled.p`
  color: ${colors.primary};
  margin: 0 0 1rem 0;
  font-weight: bold;
`;

const Bio = styled.p`
  color: ${colors.gray[400]};
  max-width: 500px;
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
`;

const PremiumBadge = styled.span`
  background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
  color: black;
  font-size: 0.8rem;
  font-weight: bold;
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
`;

// --- FEED STYLES (Reused from Feed.tsx) ---

const PostCard = styled.div`
  background: #111;
  border-radius: 12px;
  border: 1px solid #222;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const PostHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const UserGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const AvatarSmall = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #333;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;

  .name {
    color: white;
    font-weight: bold;
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }

  .username {
    color: #888;
    font-size: 0.9rem;
  }
`;

const DateText = styled.span`
  color: #666;
  font-size: 0.85rem;
`;

const PostContent = styled.div`
  color: #ddd;
  line-height: 1.6;
  margin-bottom: 1rem;
  
  p { margin: 0; }
`;

const SystemMessage = styled.div`
  color: ${colors.primary};
  font-size: 0.9rem;
  margin-bottom: 1rem;
  font-weight: bold;
`;

const CarClickableArea = styled.div`
  cursor: pointer;
  transition: opacity 0.2s ease;
  &:hover { opacity: 0.9; }
`;

const CarGallery = styled.div`
  width: 100%;
  height: 450px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
  background: #0a0a0a;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) { height: 300px; }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CarSpecs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-bottom: 1rem;
  
  span {
    background: #222;
    padding: 0.4rem 0.8rem;
    border-radius: 4px;
    color: ${colors.gray[300]};
    font-size: 0.9rem;
  }
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
  }
`;

const PostFooter = styled.div`
  display: flex;
  gap: 1rem;
  border-top: 1px solid #222;
  padding-top: 1rem;
`;

const ActionButton = styled.button<{ $active?: boolean }>`
  background: transparent;
  border: none;
  color: ${props => props.$active ? colors.primary : '#888'};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  transition: color 0.2s;
  
  &:hover {
    color: ${props => props.$active ? colors.primary : 'white'};
  }
`;

type FeedItem = {
  id: string;
  type: 'post' | 'car';
  created_at: string;
  user: any;
  texto?: string;
  carro?: any;
  likesCount?: number;
  hasLiked?: boolean;
  commentsCount?: number;
};

// --- COMPONENT ---

export default function PerfilPublico() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 10;

  const observer = useRef<IntersectionObserver>();
  const lastElementRef = useCallback((node: any) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  useEffect(() => {
    if (profile) {
      fetchFeed(page);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, profile]);

  const fetchProfile = async () => {
    setLoading(true);
    setPage(0);
    setHasMore(true);

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
  };

  const fetchFeed = async (pageNumber: number) => {
    if (!profile) return;
    if (pageNumber === 0) setLoading(true);

    const start = pageNumber * PAGE_SIZE;
    const end = start + PAGE_SIZE - 1;

    const { data: viewData, error } = await supabase
      .from('mk3_feed')
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })
      .range(start, end);

    if (error || !viewData || viewData.length === 0) {
      setHasMore(false);
      if (pageNumber === 0) setLoading(false);
      return;
    }

    const originalIds = viewData.map(d => d.original_id);
    const { data: batchLikes } = await supabase.from('mk3_likes').select('*').in('item_id', originalIds);
    const { data: batchComments } = await supabase.from('mk3_comments').select('id, item_type, item_id').in('item_id', originalIds);

    const currentUser = (await supabase.auth.getSession()).data.session?.user;

    const newFeedItems: FeedItem[] = viewData.map(d => {
      const itemLikes = batchLikes?.filter(l => l.item_type === d.type && l.item_id === d.original_id) || [];
      const itemComments = batchComments?.filter(c => c.item_type === d.type && c.item_id === d.original_id) || [];
      
      return {
        id: d.id,
        type: d.type as 'post' | 'car',
        created_at: d.created_at,
        user: profile,
        texto: d.texto,
        carro: d.car_data,
        likesCount: itemLikes.length,
        hasLiked: currentUser ? itemLikes.some(l => l.user_id === currentUser.id) : false,
        commentsCount: itemComments.length
      };
    });

    setFeed(prev => pageNumber === 0 ? newFeedItems : [...prev, ...newFeedItems]);
    if (viewData.length < PAGE_SIZE) setHasMore(false);
    setLoading(false);
  };

  const toggleLike = async (item: FeedItem) => {
    if (!session) {
      alert('Faça login para curtir!');
      return;
    }
    
    const realItemId = item.type === 'car' ? item.carro?.id : item.id.replace('post-', '');
    if (!realItemId) return;

    if (item.hasLiked) {
      setFeed(feed.map(f => f.id === item.id ? { ...f, hasLiked: false, likesCount: (f.likesCount || 1) - 1 } : f));
      await supabase.from('mk3_likes').delete().eq('user_id', session.user.id).eq('item_type', item.type).eq('item_id', realItemId);
    } else {
      setFeed(feed.map(f => f.id === item.id ? { ...f, hasLiked: true, likesCount: (f.likesCount || 0) + 1 } : f));
      const { error } = await supabase.from('mk3_likes').insert({ user_id: session.user.id, item_type: item.type, item_id: realItemId });
      
      if (!error && session.user.id !== item.user.id) {
        await supabase.from('mk3_notifications').insert({
          user_id: item.user.id,
          actor_id: session.user.id,
          type: 'like',
          item_type: item.type,
          item_id: realItemId
        });
      }
    }
  };

  const handleCommentClick = (item: FeedItem) => {
    if (item.type === 'car' && item.carro?.id) {
      navigate(`/carro/${item.carro.id}`);
    } else {
      alert('Comentários em posts chegarão em breve!');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return <CommunityLayout><Container><h2 style={{color:'white'}}>Carregando perfil...</h2></Container></CommunityLayout>;
  if (!profile) {
    return (
      <CommunityLayout>
        <Container style={{ textAlign: 'center', paddingTop: '4rem' }}>
          <i className="fas fa-user-slash" style={{ fontSize: '4rem', color: '#555', marginBottom: '1rem' }}></i>
          <h2 style={{color:'white'}}>Usuário não encontrado</h2>
          <button onClick={() => navigate('/feed')} style={{ marginTop: '1rem', padding: '0.8rem 1.5rem', background: colors.primary, color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            Voltar para Comunidade
          </button>
        </Container>
      </CommunityLayout>
    );
  }

  return (
    <CommunityLayout>
      <Container>
        <ProfileHeader>
          <AvatarLarge src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.nome_completo || profile?.username || 'User'}&background=222222&color=dc2626&size=150`} alt="Avatar" />
          <Name>
            {profile?.nome_completo || profile?.username} 
            {(profile?.is_premium || profile?.premium_manual) && <PremiumBadge>VIP</PremiumBadge>}
          </Name>
          <Username>@{profile?.username}</Username>
          <Bio>{profile?.bio || 'Nenhuma biografia adicionada.'}</Bio>
        </ProfileHeader>

        <h2 style={{ color: 'white', borderBottom: '1px solid #333', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
          Linha do Tempo
        </h2>

        {feed.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: '#111', borderRadius: '12px' }}>
            <i className="fas fa-ghost" style={{ fontSize: '3rem', color: '#333', marginBottom: '1rem' }}></i>
            <h3 style={{ color: '#888' }}>Este usuário ainda não publicou nada!</h3>
          </div>
        ) : (
          <>
          {feed.map((item, index) => (
            <PostCard key={item.id} ref={index === feed.length - 1 ? lastElementRef : null}>
              <PostHeader>
                <UserGroup>
                  <AvatarSmall src={item.user?.avatar_url || `https://ui-avatars.com/api/?name=${item.user?.username}&background=222222&color=dc2626`} />
                  <UserInfo>
                    <span className="name">{item.user?.nome_completo || item.user?.username}</span>
                    <span className="username">@{item.user?.username}</span>
                  </UserInfo>
                </UserGroup>
                <DateText>{formatDate(item.created_at)}</DateText>
              </PostHeader>

              <PostContent>
                {item.type === 'car' && (
                  <>
                    <SystemMessage>
                      <i className="fas fa-car-side"></i> {item.user.nome_completo || `@${item.user.username}`} adicionou um novo projeto!
                    </SystemMessage>
                    <CarClickableArea onClick={() => navigate(`/carro/${item.carro?.id}`)}>
                      {item.carro?.fotos && item.carro.fotos.length > 0 ? (
                        <CarGallery>
                          <img src={item.carro.fotos[0]} alt={`Golf ${item.carro.modelo}`} loading="lazy" style={{ objectPosition: getObjectPosition(item.carro.fotos[0]) }} />
                        </CarGallery>
                      ) : (
                        <CarGallery>
                          <div style={{ color: '#555', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                            <i className="fas fa-camera" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
                            <span>Sem foto</span>
                          </div>
                        </CarGallery>
                      )}
                      
                      <CarSpecs>
                        <span><i className="fas fa-car"></i> Golf {item.carro?.modelo}</span>
                        <span><i className="far fa-calendar-alt"></i> {item.carro?.ano_fabricacao || item.carro?.ano}{item.carro?.ano_modelo ? `/${item.carro.ano_modelo}` : ''}</span>
                        <span><i className="fas fa-palette"></i> {item.carro?.cor}</span>
                        {item.carro?.origem && <span><i className="fas fa-globe"></i> {item.carro.origem}</span>}
                        {(item.carro?.aro_roda || item.carro?.modelo_roda) && (
                          <span>
                            <i className="fas fa-circle-notch"></i> {item.carro.aro_roda ? `Aro ${item.carro.aro_roda}` : ''}
                            {item.carro.aro_roda && item.carro.modelo_roda ? ' - ' : ''}
                            {item.carro.modelo_roda || ''}
                          </span>
                        )}
                      </CarSpecs>

                      {item.carro?.venda_ativo && (
                        <SaleBadge>
                          <h4><i className="fas fa-tags"></i> À Venda</h4>
                          <div className="price">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.carro.venda_preco || 0)}
                          </div>
                        </SaleBadge>
                      )}
                    </CarClickableArea>
                  </>
                )}

                {item.type === 'post' && (
                  <p>{item.texto}</p>
                )}
              </PostContent>

              <PostFooter>
                <ActionButton $active={item.hasLiked} onClick={() => toggleLike(item)}>
                  <i className={item.hasLiked ? "fas fa-heart" : "far fa-heart"}></i> {item.likesCount || 0}
                </ActionButton>
                <ActionButton onClick={() => handleCommentClick(item)}>
                  <i className="far fa-comment"></i> {item.commentsCount || 0}
                </ActionButton>
              </PostFooter>
            </PostCard>
          ))}
          {loading && page > 0 && (
            <p style={{ textAlign: 'center', color: '#999', margin: '2rem 0' }}>Carregando mais...</p>
          )}
          {!hasMore && feed.length > 0 && (
            <p style={{ textAlign: 'center', color: '#666', margin: '2rem 0' }}>Fim da linha do tempo deste usuário.</p>
          )}
          </>
        )}
      </Container>
    </CommunityLayout>
  );
}
