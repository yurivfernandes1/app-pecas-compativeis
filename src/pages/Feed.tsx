import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { supabase } from '../lib/supabase';
import { colors } from '../styles/GlobalStyles';
import { Link, useNavigate } from 'react-router-dom';
import { getObjectPosition } from '../utils/imagePos';
import CommunityLayout from '../components/CommunityLayout';

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
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });
    fetchFeed();
  }, []);

  const fetchFeed = async () => {
    setLoading(true);
    
    const { data: postsData } = await supabase
      .from('mk3_posts')
      .select('*, user:mk3_users(id, username, nome_completo, avatar_url)');

    const { data: carsData } = await supabase
      .from('mk3_garagem')
      .select('*');

    // Fetch users for mapping cars because foreign key is missing
    const { data: usersData } = await supabase
      .from('mk3_users')
      .select('id, username, nome_completo, avatar_url');

    let combinedFeed: FeedItem[] = [];

    if (postsData) {
      const formattedPosts: FeedItem[] = postsData.map(p => ({
        id: `post-${p.id}`,
        type: 'post',
        created_at: p.created_at,
        user: p.user || { username: 'unknown', nome_completo: 'Desconhecido', avatar_url: '', telefone: '', cidade: '', estado: '' },
        texto: p.texto || p.content
      }));
      combinedFeed = [...combinedFeed, ...formattedPosts];
    }

    if (carsData && usersData) {
      const formattedCars: FeedItem[] = carsData.map(c => {
        const carUser = usersData.find(u => u.id === c.user_id) || { id: '', username: 'unknown', nome_completo: 'Desconhecido', avatar_url: '', telefone: '', cidade: '', estado: '' };
        return {
          id: `car-${c.id}`,
          type: 'car',
          created_at: c.created_at,
          user: carUser,
          carro: {
            id: c.id,
            modelo: c.modelo,
            ano: c.ano_fabricacao,
            ano_fabricacao: c.ano_fabricacao,
            ano_modelo: c.ano_modelo,
            cor: c.cor,
            fotos: c.fotos || [],
            origem: c.origem,
            opcionais: c.opcionais,
            pecas_raras: c.pecas_raras,
            problemas_atuais: c.problemas_atuais,
            venda_ativo: c.venda_ativo,
            venda_preco: c.venda_preco
          }
        };
      });
      combinedFeed = [...combinedFeed, ...formattedCars];
    }

    // Fetch all likes and comments to map them
    const { data: allLikes } = await supabase.from('mk3_likes').select('*');
    const { data: allComments } = await supabase.from('mk3_comments').select('id, item_type, item_id');

    const currentUser = (await supabase.auth.getSession()).data.session?.user;

    combinedFeed = combinedFeed.map(item => {
      const itemLikes = allLikes?.filter(l => l.item_type === item.type && l.item_id === (item.type === 'car' ? item.carro?.id : item.id.replace('post-', ''))) || [];
      const itemComments = allComments?.filter(c => c.item_type === item.type && c.item_id === (item.type === 'car' ? item.carro?.id : item.id.replace('post-', ''))) || [];
      return {
        ...item,
        likesCount: itemLikes.length,
        hasLiked: currentUser ? itemLikes.some(l => l.user_id === currentUser.id) : false,
        commentsCount: itemComments.length
      };
    });

    combinedFeed.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    setFeed(combinedFeed);
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
      fetchFeed();
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
        <Link 
          to="/minha-garagem" 
          style={{
            background: colors.primary,
            color: 'white',
            textDecoration: 'none',
            padding: '0.6rem 1rem',
            borderRadius: '6px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <i className="fas fa-car"></i> Minha Garagem
        </Link>
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
        filteredFeed.map((item) => (
          <PostCard key={item.id}>
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
                    </CarSpecs>

                    {((item.carro?.opcionais && item.carro.opcionais.length > 0) || (item.carro?.pecas_raras && item.carro.pecas_raras.length > 0)) && (
                      <TagsContainer>
                        {item.carro?.pecas_raras?.map((p: string) => <Tag key={p} $type="peca"><i className="fas fa-gem"></i> {p}</Tag>)}
                        {item.carro?.opcionais?.map((o: string) => <Tag key={o}>{o}</Tag>)}
                      </TagsContainer>
                    )}

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
        ))
      )}
    </FeedContainer>
    </CommunityLayout>
  );
}
