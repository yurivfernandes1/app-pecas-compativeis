import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { supabase } from '../lib/supabase';
import { colors } from '../styles/GlobalStyles';
import { Link, useNavigate } from 'react-router-dom';
import { getObjectPosition } from '../utils/imagePos';
import CommunityLayout from '../components/CommunityLayout';
import { calculateSuperTrunfoPoints, formatPoints } from '../utils/superTrunfo';

interface FeedItem {
  id: string;
  type: 'post' | 'car';
  created_at: string;
  user: {
    id: string;
    username: string;
    nome_completo: string;
    avatar_url: string;
    telefone?: string;
    cidade?: string;
    estado?: string;
  };
  texto?: string;
  carro?: {
    id: string;
    modelo: string;
    ano?: string;
    ano_fabricacao?: string;
    ano_modelo?: string;
    cor: string;
    fotos: string[];
    origem?: string;
    opcionais?: string[];
    pecas_raras?: string[];
    problemas_atuais?: string;
    venda_ativo?: boolean;
    venda_preco?: number;
    aro_roda?: string;
    modelo_roda?: string;
    tala_roda?: number;
    placa_preta?: boolean;
    modificacoes_motor?: string[];
    tipo_suspensao?: string;
    pontuacao_total?: number;
  };
  likesCount?: number;
  hasLiked?: boolean;
  commentsCount?: number;
}

const FeedContainer = styled.div`
  width: 100%;
  max-width: 800px;

  @media (max-width: 900px) {
    padding-bottom: 5rem; /* espaço para a barra mobile */
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const Title = styled.h1`
  color: ${colors.white};
  font-size: 2rem;
  
  span {
    color: ${colors.primary};
  }
`;

const SearchBar = styled.input`
  width: 100%;
  padding: 0.8rem 1.2rem;
  border-radius: 8px;
  background: #111;
  border: 1px solid #333;
  color: white;
  font-size: 1rem;
  margin-bottom: 2rem;

  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }
  
  &::placeholder {
    color: #666;
  }
`;

const CreatePostBox = styled.div`
  background: #111;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const TextArea = styled.textarea`
  width: 100%;
  background: #1a1a1a;
  border: 1px solid #333;
  color: white;
  padding: 1rem;
  border-radius: 8px;
  resize: none;
  font-family: inherit;
  margin-bottom: 1rem;

  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }
`;

const PostButton = styled.button`
  background: ${colors.primary};
  color: white;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #b91c1c;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PostCard = styled.div`
  background: #111;
  border: 1px solid #333;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const PostHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

const UserGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const Avatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${colors.gray[600]};
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;

  .name {
    color: ${colors.white};
    font-weight: bold;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }

  .username {
    color: ${colors.gray[400]};
    font-size: 0.9rem;
  }
`;

const DateText = styled.span`
  color: ${colors.gray[500]};
  font-size: 0.8rem;
`;

const PostContent = styled.div`
  color: ${colors.gray[100]};
  line-height: 1.5;
  margin-bottom: 1rem;
`;

const SystemMessage = styled.p`
  color: ${colors.primary};
  font-weight: bold;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CarGallery = styled.div`
  width: 100%;
  height: 450px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
  position: relative;
  background: #0a0a0a;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    height: 300px;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CarClickableArea = styled.div`
  cursor: pointer;
  transition: opacity 0.2s ease;
  &:hover {
    opacity: 0.9;
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

const PostFooter = styled.div`
  display: flex;
  gap: 1rem;
  border-top: 1px solid #222;
  padding-top: 1rem;
`;

const ActionButton = styled.button<{ $active?: boolean }>`
  background: transparent;
  border: none;
  color: ${props => props.$active ? colors.primary : colors.gray[400]};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    color: ${props => props.$active ? '#b91c1c' : colors.white};
  }

  i {
    font-size: 1.1rem;
  }
`;

export default function Feed() {
  const [feed, setFeed] = useState<FeedItem[]>([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [tags, setTags] = useState<any[]>([]);
  const PAGE_SIZE = 10;
  
  const navigate = useNavigate();

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
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });
    fetchTags();
    fetchFeed(0);
  }, []);

  const fetchTags = async () => {
    const { data } = await supabase.from('mk3_car_tags').select('*');
    if (data) setTags(data);
  };

  useEffect(() => {
    if (page > 0) fetchFeed(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchFeed = async (pageNumber: number) => {
    if (pageNumber === 0) setLoading(true);
    const start = pageNumber * PAGE_SIZE;
    const end = start + PAGE_SIZE - 1;
    
    const { data: viewData, error } = await supabase
      .from('mk3_feed')
      .select('*')
      .order('created_at', { ascending: false })
      .range(start, end);

    if (error || !viewData || viewData.length === 0) {
      setHasMore(false);
      if (pageNumber === 0) setLoading(false);
      return;
    }

    const userIds = Array.from(new Set(viewData.map(d => d.user_id)));
    const { data: usersData } = await supabase
      .from('mk3_users')
      .select('id, username, nome_completo, avatar_url, cidade, estado, telefone')
      .in('id', userIds);

    const originalIds = viewData.map(d => d.original_id);
    const { data: batchLikes } = await supabase.from('mk3_likes').select('*').in('item_id', originalIds);
    const { data: batchComments } = await supabase.from('mk3_comments').select('id, item_type, item_id').in('item_id', originalIds);

    const currentUser = (await supabase.auth.getSession()).data.session?.user;

    const newFeedItems: FeedItem[] = viewData.map(d => {
      const user = usersData?.find(u => u.id === d.user_id) || { id: '', username: 'unknown', nome_completo: 'Desconhecido', avatar_url: '', telefone: '', cidade: '', estado: '' };
      const itemLikes = batchLikes?.filter(l => l.item_type === d.type && l.item_id === d.original_id) || [];
      const itemComments = batchComments?.filter(c => c.item_type === d.type && c.item_id === d.original_id) || [];
      
      return {
        id: d.id,
        type: d.type as 'post' | 'car',
        created_at: d.created_at,
        user: user,
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
      // Optimistic update
      setFeed(feed.map(f => f.id === item.id ? { ...f, hasLiked: false, likesCount: (f.likesCount || 1) - 1 } : f));
      const { error } = await supabase.from('mk3_likes').delete().eq('user_id', session.user.id).eq('item_type', item.type).eq('item_id', realItemId);
      if (error) {
        alert("Erro ao remover curtida: " + error.message);
        console.error(error);
        // Revert optimistic
        setFeed(feed.map(f => f.id === item.id ? { ...f, hasLiked: true, likesCount: (f.likesCount || 0) + 1 } : f));
      }
    } else {
      setFeed(feed.map(f => f.id === item.id ? { ...f, hasLiked: true, likesCount: (f.likesCount || 0) + 1 } : f));
      const { error } = await supabase.from('mk3_likes').insert({ user_id: session.user.id, item_type: item.type, item_id: realItemId });
      if (error) {
        alert("Erro ao salvar curtida: " + error.message);
        console.error(error);
        // Revert optimistic
        setFeed(feed.map(f => f.id === item.id ? { ...f, hasLiked: false, likesCount: (f.likesCount || 1) - 1 } : f));
      } else if (session.user.id !== item.user.id) {
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
      // For now, post comments might need a separate modal, or we just alert
      alert('Comentários em posts chegarão em breve!');
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.trim() || !session) return;
    setPosting(true);

    const { error } = await supabase
      .from('mk3_posts')
      .insert({
        user_id: session.user.id,
        texto: newPost,
      });

    if (error) {
      console.error('Error creating post:', error);
      alert('Erro ao publicar: ' + error.message);
    } else {
      setNewPost('');
      fetchFeed(0);
    }
    setPosting(false);
  };

  const handleShare = async (username: string) => {
    const url = `${window.location.origin}/u/${username}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Perfil de @${username} na Comunidade MK3`,
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

  const filteredFeed = useMemo(() => {
    if (!searchQuery.trim()) return feed;
    if (searchQuery === 'type:car') return feed.filter(item => item.type === 'car');
    if (searchQuery === 'type:post') return feed.filter(item => item.type === 'post');
    const q = searchQuery.toLowerCase();
    return feed.filter(item => {
      const matchUser = item.user.username.toLowerCase().includes(q) || item.user.nome_completo?.toLowerCase().includes(q);
      const matchText = item.type === 'post' && item.texto?.toLowerCase().includes(q);
      const matchCar = item.type === 'car' && (
        item.carro?.modelo.toLowerCase().includes(q) ||
        item.carro?.cor.toLowerCase().includes(q) ||
        (item.carro?.ano_fabricacao || item.carro?.ano || '').includes(q)
      );
      return matchUser || matchText || matchCar;
    });
  }, [searchQuery, feed]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <CommunityLayout>
      <FeedContainer>
      <Header>
        <Title>Comunidade <span>MK3</span></Title>
      </Header>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        <button 
          onClick={() => setSearchQuery('')}
          style={{ background: !searchQuery ? 'rgba(220, 38, 38, 0.2)' : '#111', border: `1px solid ${!searchQuery ? colors.primary : '#333'}`, color: !searchQuery ? colors.primary : 'white', padding: '0.5rem 1rem', borderRadius: '20px', cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          <i className="fas fa-layer-group"></i> Todos
        </button>
        <button 
          onClick={() => setSearchQuery('type:car')}
          style={{ background: searchQuery === 'type:car' ? 'rgba(220, 38, 38, 0.2)' : '#111', border: `1px solid ${searchQuery === 'type:car' ? colors.primary : '#333'}`, color: searchQuery === 'type:car' ? colors.primary : 'white', padding: '0.5rem 1rem', borderRadius: '20px', cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          <i className="fas fa-car"></i> Apenas Projetos
        </button>
        <button 
          onClick={() => setSearchQuery('type:post')}
          style={{ background: searchQuery === 'type:post' ? 'rgba(220, 38, 38, 0.2)' : '#111', border: `1px solid ${searchQuery === 'type:post' ? colors.primary : '#333'}`, color: searchQuery === 'type:post' ? colors.primary : 'white', padding: '0.5rem 1rem', borderRadius: '20px', cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          <i className="fas fa-comment"></i> Postagens
        </button>
      </div>
      
      <SearchBar 
        placeholder="🔍 Pesquisar por usuários, carros (ex: GTI, Azul) ou postagens..."
        value={searchQuery.startsWith('type:') ? '' : searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {session && (
        <CreatePostBox>
          <TextArea 
            rows={3} 
            placeholder="O que há de novo no seu projeto MK3?" 
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <PostButton onClick={handleCreatePost} disabled={posting || !newPost.trim()}>
              {posting ? 'Publicando...' : 'Publicar'}
            </PostButton>
          </div>
        </CreatePostBox>
      )}

      {loading ? (
        <p style={{ textAlign: 'center', color: '#999' }}>Carregando a garagem da galera...</p>
      ) : filteredFeed.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999' }}>Nenhum resultado encontrado.</p>
      ) : (
        <>
        {filteredFeed.map((item, index) => (
          <PostCard key={item.id} ref={index === filteredFeed.length - 1 ? lastElementRef : null}>
            <PostHeader>
              <UserGroup>
                <Avatar 
                  src={item.user?.avatar_url || 'https://raw.githubusercontent.com/yurivfernandes1/app-pecas-compativeis/refs/heads/main/Perfil1.png'} 
                  alt={item.user?.username} 
                />
                <UserInfo>
                  <Link to={`/u/${item.user?.username}`} className="name">
                    {item.user?.nome_completo || item.user?.username}
                  </Link>
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
                        <img 
                          src={item.carro.fotos[0]} 
                          alt={`Golf ${item.carro.modelo}`} 
                          loading="lazy"
                          style={{ objectPosition: getObjectPosition(item.carro.fotos[0]) }} 
                        />
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

                    {(() => {
                      const pts = calculateSuperTrunfoPoints(item.carro, tags);
                      const pVersao = pts.versao;
                      const pPlacaPreta = pts.placa_preta;
                      const pMotor = pts.motor;
                      const pSuspensao = pts.suspensao;
                      const pPecas = pts.pecas;
                      const pOpcionais = pts.opcionais;
                      const pRodas = pts.rodas;
                      const total = pts.total;
                      
                      if (total > 0 || (item.carro?.pontuacao_total && item.carro.pontuacao_total > 0)) {
                        return (
                          <div style={{ background: 'linear-gradient(145deg, #1f1f1f, #111)', borderRadius: '12px', padding: '1rem', border: '1px solid #333', marginTop: '1rem' }}>
                            <div style={{ textAlign: 'center', marginBottom: '0.8rem' }}>
                              <h4 style={{ color: colors.primary, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem', margin: 0 }}>Super Trunfo</h4>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.9rem', color: '#ccc' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem', background: '#222', borderRadius: '4px' }}>
                                <span>🏷️ Versão</span> <strong>{formatPoints(pVersao)} pts</strong>
                              </div>
                              {pPlacaPreta > 0 && (
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem', background: '#222', borderRadius: '4px', color: '#fef08a' }}>
                                  <span>⬛ Placa Preta</span> <strong>{formatPoints(pPlacaPreta)} pts</strong>
                                </div>
                              )}
                              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem', background: '#222', borderRadius: '4px' }}>
                                <span>🏎️ Motor</span> <strong>{formatPoints(pMotor)} pts</strong>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem', background: '#222', borderRadius: '4px' }}>
                                <span>🛠️ Suspensão</span> <strong>{formatPoints(pSuspensao)} pts</strong>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem', background: '#222', borderRadius: '4px' }}>
                                <span>✨ Peças Raras</span> <strong>{formatPoints(pPecas)} pts</strong>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem', background: '#222', borderRadius: '4px' }}>
                                <span>🛞 Rodas</span> <strong>{formatPoints(pRodas)} pts</strong>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.3rem', background: '#222', borderRadius: '4px', gridColumn: pPlacaPreta > 0 ? 'auto' : '1 / -1' }}>
                                <span>➕ Opcionais</span> <strong>{formatPoints(pOpcionais)} pts</strong>
                              </div>
                            </div>
                            <div style={{ marginTop: '0.8rem', padding: '0.8rem', background: 'rgba(220, 38, 38, 0.1)', border: `1px solid ${colors.primary}`, borderRadius: '6px', textAlign: 'center' }}>
                              <strong style={{ fontSize: '1.2rem', color: 'white' }}>🏆 TOTAL: {formatPoints(item.carro?.pontuacao_total || total)} PTS</strong>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}

                    {item.carro?.problemas_atuais && (
                      <ProblemasBox>
                        <h4><i className="fas fa-wrench"></i> Precisa de Ajuda</h4>
                        <p>{item.carro.problemas_atuais}</p>
                      </ProblemasBox>
                    )}

                    {item.carro?.venda_ativo && (
                      <SaleBadge>
                        <h4><i className="fas fa-tags"></i> À Venda</h4>
                        <div className="price">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.carro.venda_preco || 0)}
                        </div>
                        <div className="contact">
                          {item.user?.cidade && item.user?.estado && (
                            <span><i className="fas fa-map-marker-alt"></i> {item.user.cidade} - {item.user.estado}</span>
                          )}
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
              <ActionButton onClick={() => handleShare(item.user.username)} style={{ marginLeft: 'auto' }}>
                <i className="fas fa-share-alt"></i>
              </ActionButton>
              </PostFooter>
            </PostCard>
          ))}
          {loading && page > 0 && (
            <p style={{ textAlign: 'center', color: '#999', margin: '2rem 0' }}>Carregando mais...</p>
          )}
          {!hasMore && feed.length > 0 && (
            <p style={{ textAlign: 'center', color: '#666', margin: '2rem 0' }}>Você chegou ao fim da garagem!</p>
          )}
        </>
      )}
    </FeedContainer>
    </CommunityLayout>
  );
}
