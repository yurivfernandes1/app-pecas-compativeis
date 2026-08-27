import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { supabase } from '../lib/supabase';
import { colors, media } from '../styles/GlobalStyles';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { getObjectPosition } from '../utils/imagePos';

import CommunityLayout from '../components/CommunityLayout';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const BackButton = styled.button`
  background: transparent;
  border: none;
  color: ${colors.primary};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  cursor: pointer;
  margin-bottom: 2rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const CarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;

  h1 {
    color: white;
    margin: 0 0 0.5rem 0;
    font-size: 2.5rem;
  }

  .owner-link {
    color: ${colors.gray[400]};
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    img {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
    }

    &:hover {
      color: white;
    }
  }
`;

const GalleryGrid = styled.div<{ $count: number }>`
  display: grid;
  grid-template-columns: ${props => props.$count === 1 ? '1fr' : '2fr 1fr'};
  grid-template-rows: ${props => props.$count > 2 ? '1fr 1fr' : '1fr'};
  gap: 1rem;
  height: 500px;
  margin-bottom: 2rem;

  & > div:first-child {
    grid-row: 1 / -1;
  }

  @media (min-width: 481px) {
    & > div:nth-child(n+4) {
      display: none;
    }
  }

  ${media.mobile} {
    display: flex;
    flex-direction: row;
    height: 300px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 0;
    margin-bottom: 1rem;
    
    & > div {
      flex: 0 0 100%;
      scroll-snap-align: center;
    }

    & > div:nth-child(n+4) {
      display: block;
    }

    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

const PhotoItem = styled.div`
  background: #111;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const DotsContainer = styled.div`
  display: none;
  
  ${media.mobile} {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 2rem;
  }
`;

const Dot = styled.div<{ $active: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${p => p.$active ? colors.primary : '#333'};
  transition: all 0.3s;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;

  ${media.mobile} {
    grid-template-columns: 1fr;
  }
`;

const InfoSection = styled.div`
  background: #111;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #222;
`;

const SpecsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const SpecItem = styled.div`
  background: #1a1a1a;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #333;
  
  .label {
    color: ${colors.gray[500]};
    font-size: 0.8rem;
    margin-bottom: 0.3rem;
  }
  .value {
    color: white;
    font-weight: bold;
    font-size: 1.1rem;
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
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.9rem;
`;

const SectionTitle = styled.h3`
  color: white;
  margin: 0 0 1rem 0;
  border-bottom: 1px solid #333;
  padding-bottom: 0.5rem;
`;

const ProblemasBox = styled.div`
  background: rgba(255, 165, 0, 0.1);
  border-left: 4px solid orange;
  padding: 1.5rem;
  margin-top: 2rem;
  border-radius: 0 8px 8px 0;

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
    line-height: 1.6;
  }
`;

const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ActionsBox = styled.div`
  background: #111;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #222;
  display: flex;
  gap: 1rem;
  justify-content: center;
`;

const ActionButton = styled.button<{ $active?: boolean }>`
  background: ${props => props.$active ? 'rgba(220, 38, 38, 0.1)' : '#1a1a1a'};
  border: 1px solid ${props => props.$active ? colors.primary : '#333'};
  color: ${props => props.$active ? colors.primary : 'white'};
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: bold;
  transition: all 0.2s;
  flex: 1;
  justify-content: center;

  &:hover {
    background: ${props => props.$active ? 'rgba(220, 38, 38, 0.2)' : '#222'};
    border-color: ${props => props.$active ? colors.primary : '#555'};
  }
`;

const SaleBox = styled.div`
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(0,0,0,0) 100%);
  border: 1px solid ${colors.primary};
  border-radius: 12px;
  padding: 2rem;
  text-align: center;

  h4 {
    color: ${colors.primary};
    margin: 0 0 1rem 0;
    font-size: 1.2rem;
  }

  .price {
    font-size: 2.5rem;
    color: white;
    font-weight: bold;
    margin-bottom: 1.5rem;
  }

  a {
    display: inline-block;
    background: #25D366;
    color: white;
    text-decoration: none;
    padding: 1rem 2rem;
    border-radius: 8px;
    font-weight: bold;
    font-size: 1.1rem;
    width: 100%;
    
    &:hover {
      background: #20bd5a;
    }
  }
`;

const CommentsSection = styled.div`
  margin-top: 3rem;
  background: #111;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #222;
`;

const CommentInputBox = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 1rem;
  margin-bottom: 2rem;
  
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-bottom: 4px;
  }

  .input-area {
    flex: 1;
    display: flex;
    align-items: flex-end;
    gap: 0.5rem;
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 24px;
    padding: 0.5rem 0.5rem 0.5rem 1rem;
    transition: all 0.2s;
    
    &:focus-within {
      border-color: ${colors.primary};
      background: #222;
    }
    
    textarea {
      flex: 1;
      background: transparent;
      border: none;
      color: white;
      padding: 0.3rem 0;
      resize: none;
      outline: none;
      line-height: 1.5;
      font-family: inherit;
      font-size: 1rem;
      min-height: 24px;
      max-height: 100px;
    }

    button {
      background: ${colors.primary};
      color: white;
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      flex-shrink: 0;
      transition: all 0.2s;

      &:disabled {
        background: #333;
        color: #666;
        cursor: not-allowed;
      }
      
      &:hover:not(:disabled) {
        background: #b91c1c;
      }
    }
  }
`;

const CommentItem = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  
  .comment-content {
    background: #1a1a1a;
    padding: 1rem;
    border-radius: 8px;
    flex: 1;

    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      
      strong { color: white; }
      span { color: #666; font-size: 0.8rem; }
    }
    
    p {
      color: #ddd;
      margin: 0;
      line-height: 1.5;
    }
  }
`;

export default function CarroDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [carro, setCarro] = useState<any>(null);
  const [owner, setOwner] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [currentUserProfile, setCurrentUserProfile] = useState<any>(null);

  const [likes, setLikes] = useState<number>(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [postingComment, setPostingComment] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const scrollLeft = el.scrollLeft;
    const itemWidth = el.clientWidth;
    const newIndex = Math.round(scrollLeft / itemWidth);
    if (newIndex !== activePhotoIndex) {
      setActivePhotoIndex(newIndex);
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) {
        supabase.from('mk3_users').select('*').eq('id', data.session.user.id).single().then(({ data: profileData }) => {
          if (profileData) setCurrentUserProfile(profileData);
        });
      }
    });
    fetchCarDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchCarDetails = async () => {
    setLoading(true);
    const { data: carData } = await supabase.from('mk3_garagem').select('*').eq('id', id).single();
    if (!carData) {
      navigate('/feed');
      return;
    }
    setCarro(carData);

    const { data: userData } = await supabase.from('mk3_users').select('*').eq('id', carData.user_id).single();
    if (userData) setOwner(userData);

    await fetchLikesAndComments();
    setLoading(false);
  };

  const fetchLikesAndComments = async () => {
    // Likes
    const { data: likesData } = await supabase.from('mk3_likes').select('user_id').eq('item_type', 'car').eq('item_id', id);
    if (likesData) {
      setLikes(likesData.length);
      const { data: { session: curSession } } = await supabase.auth.getSession();
      if (curSession) {
        setHasLiked(likesData.some(l => l.user_id === curSession.user.id));
      }
    }

    // Comments
    const { data: commentsData } = await supabase
      .from('mk3_comments')
      .select('*, user:mk3_users(username, nome_completo, avatar_url)')
      .eq('item_type', 'car')
      .eq('item_id', id)
      .order('created_at', { ascending: true });
    
    if (commentsData) setComments(commentsData);
  };

  const toggleLike = async () => {
    if (!session) {
      alert("Faça login para curtir!");
      return;
    }

    if (hasLiked) {
      setHasLiked(false);
      setLikes(prev => prev - 1);
      await supabase.from('mk3_likes').delete().eq('user_id', session.user.id).eq('item_type', 'car').eq('item_id', id);
    } else {
      setHasLiked(true);
      setLikes(prev => prev + 1);
      await supabase.from('mk3_likes').insert({ user_id: session.user.id, item_type: 'car', item_id: id });
      
      if (owner && session.user.id !== owner.id) {
        await supabase.from('mk3_notifications').insert({
          user_id: owner.id,
          actor_id: session.user.id,
          type: 'like',
          item_type: 'car',
          item_id: id
        });
      }
    }
  };

  const handleComment = async () => {
    if (!session || !newComment.trim()) return;
    setPostingComment(true);

    const { error } = await supabase.from('mk3_comments').insert({
      user_id: session.user.id,
      item_type: 'car',
      item_id: id,
      content: newComment.trim()
    });

    if (error) {
      alert("Erro ao enviar: " + error.message);
      console.error(error);
    } else {
      setNewComment('');
      
      if (owner && session.user.id !== owner.id) {
        await supabase.from('mk3_notifications').insert({
          user_id: owner.id,
          actor_id: session.user.id,
          type: 'comment',
          item_type: 'car',
          item_id: id
        });
      }
      
      await fetchLikesAndComments();
    }
    setPostingComment(false);
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: `Projeto Golf ${carro.modelo}`, url });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copiado!');
    }
  };

  if (loading) return <CommunityLayout><Container><h2 style={{color: 'white'}}>Carregando...</h2></Container></CommunityLayout>;
  if (!carro) return null;

  const fotos = carro.fotos || [];

  return (
    <CommunityLayout>
      <Container>
        <BackButton onClick={() => navigate(-1)}>
          <i className="fas fa-arrow-left"></i> Voltar
        </BackButton>

        <CarHeader>
          <div>
            <h1>Golf {carro.modelo}</h1>
            <Link to={`/u/${owner?.username}`} className="owner-link">
              <img src={owner?.avatar_url || `https://ui-avatars.com/api/?name=${owner?.username}&background=222222&color=dc2626`} alt="Dono" />
              <span>Por <strong>{owner?.nome_completo || `@${owner?.username}`}</strong></span>
            </Link>
          </div>
        </CarHeader>

        <div>
          <GalleryGrid $count={fotos.length} onScroll={handleScroll}>
            {fotos.map((url: string, idx: number) => (
              <PhotoItem key={idx} onClick={() => setLightboxIndex(idx)}>
                <img src={url} alt={`Foto ${idx+1}`} style={{ objectPosition: getObjectPosition(url) }} />
              </PhotoItem>
            ))}
          </GalleryGrid>
          
          {fotos.length > 1 && (
            <DotsContainer>
              {fotos.map((_: string, idx: number) => (
                <Dot key={idx} $active={idx === activePhotoIndex} />
              ))}
            </DotsContainer>
          )}
        </div>

        <ContentGrid>
          <InfoSection>
            <SectionTitle>Especificações do Projeto</SectionTitle>
            <SpecsGrid>
              <SpecItem>
                <div className="label">Ano Fabricação</div>
                <div className="value">{carro.ano_fabricacao || '-'}</div>
              </SpecItem>
              <SpecItem>
                <div className="label">Ano Modelo</div>
                <div className="value">{carro.ano_modelo || '-'}</div>
              </SpecItem>
              <SpecItem>
                <div className="label">Cor</div>
                <div className="value">{carro.cor || '-'}</div>
              </SpecItem>
              <SpecItem>
                <div className="label">Origem</div>
                <div className="value">{carro.origem || 'Desconhecida'}</div>
              </SpecItem>
            </SpecsGrid>

            {carro.descricao && (
              <>
                <SectionTitle>Sobre o Projeto</SectionTitle>
                <p style={{ color: '#ccc', lineHeight: 1.6, marginBottom: '2rem' }}>{carro.descricao}</p>
              </>
            )}

            {(carro.opcionais?.length > 0 || carro.pecas_raras?.length > 0) && (
              <>
                <SectionTitle>Equipamentos</SectionTitle>
                <TagsContainer>
                  {carro.pecas_raras?.map((p: string) => <Tag key={p} $type="peca"><i className="fas fa-gem"></i> {p}</Tag>)}
                  {carro.opcionais?.map((o: string) => <Tag key={o}>{o}</Tag>)}
                </TagsContainer>
              </>
            )}

            {(carro.modificacao_motor || carro.modificacao_suspensao) && (
              <div style={{ marginTop: '2rem' }}>
                <SectionTitle>Modificações</SectionTitle>
                
                {carro.modificacao_motor && carro.modificacoes_motor?.length > 0 && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ color: '#ccc', margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}><i className="fas fa-cogs"></i> Motor</h4>
                    <TagsContainer style={{ marginTop: 0 }}>
                      {carro.modificacoes_motor.map((m: string) => <Tag key={m} style={{ background: 'rgba(220, 38, 38, 0.1)', color: colors.primary, borderColor: 'rgba(220, 38, 38, 0.3)' }}>{m}</Tag>)}
                    </TagsContainer>
                  </div>
                )}

                {carro.modificacao_suspensao && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ color: '#ccc', margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}><i className="fas fa-tools"></i> Suspensão</h4>
                    <TagsContainer style={{ marginTop: 0 }}>
                      {carro.tipo_suspensao && <Tag style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderColor: 'rgba(59, 130, 246, 0.3)' }}>{carro.tipo_suspensao}</Tag>}
                      {carro.marca_suspensao && <Tag style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', borderColor: 'rgba(59, 130, 246, 0.3)' }}>{carro.marca_suspensao}</Tag>}
                    </TagsContainer>
                  </div>
                )}
              </div>
            )}

            {carro.problemas_atuais && (
              <ProblemasBox>
                <h4><i className="fas fa-wrench"></i> Precisa de Ajuda</h4>
                <p>{carro.problemas_atuais}</p>
              </ProblemasBox>
            )}
          </InfoSection>

          <Sidebar>
            <ActionsBox>
              <ActionButton $active={hasLiked} onClick={toggleLike}>
                <i className={hasLiked ? "fas fa-heart" : "far fa-heart"}></i> {likes}
              </ActionButton>
              <ActionButton onClick={handleShare}>
                <i className="fas fa-share-alt"></i> Compartilhar
              </ActionButton>
            </ActionsBox>

            {carro.instagram_url && (
              <a 
                href={carro.instagram_url} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                  color: 'white',
                  textDecoration: 'none',
                  padding: '1rem',
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  fontSize: '1.1rem'
                }}
              >
                <i className="fab fa-instagram" style={{ fontSize: '1.5rem' }}></i> Siga este projeto
              </a>
            )}

            {carro.venda_ativo && (
              <SaleBox>
                <h4>À VENDA</h4>
                <div className="price">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(carro.venda_preco || 0)}
                </div>
                {owner?.cidade && owner?.estado && (
                  <p style={{ color: '#888', marginBottom: '1rem' }}><i className="fas fa-map-marker-alt"></i> {owner.cidade} - {owner.estado}</p>
                )}
                {owner?.telefone && (
                  <a href={`https://wa.me/${owner.telefone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                    <i className="fab fa-whatsapp"></i> Falar com dono
                  </a>
                )}
              </SaleBox>
            )}
          </Sidebar>
        </ContentGrid>

        <CommentsSection>
          <SectionTitle>Comentários ({comments.length})</SectionTitle>
          
          <CommentInputBox>
            <img src={currentUserProfile?.avatar_url || `https://ui-avatars.com/api/?name=${session?.user?.email || 'User'}&background=222222&color=dc2626`} alt="Você" />
            <div className="input-area">
              <textarea 
                rows={1} 
                placeholder="Deixe um comentário sobre este projeto..."
                value={newComment}
                onChange={e => {
                  setNewComment(e.target.value);
                  e.target.style.height = 'auto';
                  e.target.style.height = (e.target.scrollHeight) + 'px';
                }}
              />
              <button onClick={handleComment} disabled={!newComment.trim() || postingComment} title="Enviar">
                {postingComment ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
              </button>
            </div>
          </CommentInputBox>

          {comments.map(c => (
            <CommentItem key={c.id}>
              <Link to={`/u/${c.user?.username}`}>
                <img src={c.user?.avatar_url || `https://ui-avatars.com/api/?name=${c.user?.username}&background=222222&color=dc2626`} alt={c.user?.username} />
              </Link>
              <div className="comment-content">
                <div className="header">
                  <strong><Link to={`/u/${c.user?.username}`} style={{color:'white', textDecoration:'none'}}>{c.user?.nome_completo || c.user?.username}</Link></strong>
                  <span>{new Date(c.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
                <p>{c.content}</p>
              </div>
            </CommentItem>
          ))}
        </CommentsSection>

        <Lightbox
          open={lightboxIndex >= 0}
          close={() => setLightboxIndex(-1)}
          index={lightboxIndex}
          slides={fotos.map((url: string) => ({ src: url }))}
        />
      </Container>
    </CommunityLayout>
  );
}
