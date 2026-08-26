import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { supabase } from '../lib/supabase';
import { colors, media } from '../styles/GlobalStyles';
import { Link } from 'react-router-dom';

const FeedContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 80vh;

  ${media.mobile} {
    padding: 1rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: ${colors.white};
  font-size: 2rem;
  
  span {
    color: ${colors.primary};
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
  gap: 1rem;
  margin-bottom: 1rem;
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

const PostContent = styled.p`
  color: ${colors.gray[100]};
  line-height: 1.5;
  margin-bottom: 1rem;
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
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    // Para puxar as informações do usuário criador do post, fazemos um join
    const { data, error } = await supabase
      .from('mk3_posts')
      .select(`
        *,
        user:mk3_users(
          username,
          nome_completo,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPosts(data);
    }
    setLoading(false);
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
      fetchPosts(); // Recarrega os posts
    }
    setPosting(false);
  };

  return (
    <FeedContainer>
      <Header>
        <Title>Sua <span>Garagem</span></Title>
      </Header>

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
      ) : posts.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#999' }}>Nenhuma postagem ainda. Seja o primeiro a publicar!</p>
      ) : (
        posts.map((post) => (
          <PostCard key={post.id}>
            <PostHeader>
              <Avatar 
                src={post.user?.avatar_url || 'https://raw.githubusercontent.com/yurivfernandes1/app-pecas-compativeis/refs/heads/main/Perfil1.png'} 
                alt={post.user?.username} 
              />
              <UserInfo>
                <Link to={`/u/${post.user?.username}`} className="name">
                  {post.user?.nome_completo || post.user?.username}
                </Link>
                <span className="username">@{post.user?.username}</span>
              </UserInfo>
            </PostHeader>
            <PostContent>
              {post.texto || post.content}
            </PostContent>
            <PostFooter>
              <ActionButton>
                <i className="far fa-heart"></i> Curtir
              </ActionButton>
              <ActionButton>
                <i className="far fa-comment"></i> Comentar
              </ActionButton>
            </PostFooter>
          </PostCard>
        ))
      )}
    </FeedContainer>
  );
}
