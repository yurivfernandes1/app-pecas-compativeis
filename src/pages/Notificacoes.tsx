import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { supabase } from '../lib/supabase';
import { colors, media } from '../styles/GlobalStyles';
import { useNavigate } from 'react-router-dom';
import CommunityLayout from '../components/CommunityLayout';

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  h1 {
    color: white;
    margin: 0;
    font-size: 2rem;
  }
  
  button {
    background: transparent;
    border: 1px solid ${colors.primary};
    color: ${colors.primary};
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      background: rgba(220, 38, 38, 0.1);
    }
  }

  ${media.mobile} {
    h1 { font-size: 1.5rem; }
  }
`;

const NotificationList = styled.div`
  background: #111;
  border: 1px solid #222;
  border-radius: 12px;
  overflow: hidden;
`;

const NotificationItem = styled.div<{ $unread: boolean }>`
  padding: 1.5rem;
  border-bottom: 1px solid #222;
  background: ${props => props.$unread ? 'rgba(220, 38, 38, 0.05)' : 'transparent'};
  display: flex;
  gap: 1.5rem;
  cursor: pointer;
  transition: background 0.2s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
  }

  .content {
    flex: 1;
    font-size: 1rem;
    line-height: 1.5;

    strong {
      color: white;
    }
    
    p {
      margin: 0;
      color: #ccc;
    }

    .time {
      display: block;
      margin-top: 0.4rem;
      font-size: 0.85rem;
      color: #777;
    }
  }
`;

const EmptyState = styled.div`
  padding: 4rem 2rem;
  text-align: center;
  color: #666;
  font-size: 1.1rem;

  i {
    font-size: 3rem;
    color: #333;
    margin-bottom: 1rem;
    display: block;
  }
`;

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'reply';
  item_type: 'post' | 'car' | 'comment';
  item_id: string;
  read: boolean;
  created_at: string;
  actor: {
    username: string;
    nome_completo: string;
    avatar_url: string;
  };
}

const Notificacoes: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login');
      return;
    }

    const { data } = await supabase
      .from('mk3_notifications')
      .select('*, actor:mk3_users!actor_id(username, nome_completo, avatar_url)')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(50);

    if (data) {
      setNotifications(data as any);
    }
    setLoading(false);
  };

  const markAllAsRead = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;
    
    await supabase.from('mk3_notifications').update({ read: true }).eq('user_id', session.user.id).eq('read', false);
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      await supabase.from('mk3_notifications').update({ read: true }).eq('id', notification.id);
    }
    
    if (notification.item_type === 'car') {
      navigate(`/carro/${notification.item_id}`);
    } else {
      navigate('/feed');
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <CommunityLayout>
      <PageHeader>
        <h1>Notificações</h1>
        {unreadCount > 0 && <button onClick={markAllAsRead}>Marcar todas lidas</button>}
      </PageHeader>
      
      {loading ? (
        <div style={{ color: 'white', textAlign: 'center', padding: '3rem' }}>Carregando...</div>
      ) : (
        <NotificationList>
          {notifications.length === 0 ? (
            <EmptyState>
              <i className="far fa-bell-slash"></i>
              Nenhuma notificação por enquanto.
            </EmptyState>
          ) : (
            notifications.map(n => {
              const actorName = n.actor.nome_completo || `@${n.actor.username}`;
              const actionText = n.type === 'like' ? 'curtiu seu' 
                               : n.type === 'comment' ? 'comentou no seu'
                               : 'respondeu ao seu';
              const targetText = n.item_type === 'car' ? 'projeto'
                               : n.item_type === 'post' ? 'post'
                               : 'comentário';
                               
              return (
                <NotificationItem key={n.id} $unread={!n.read} onClick={() => handleNotificationClick(n)}>
                  <img src={n.actor.avatar_url || `https://ui-avatars.com/api/?name=${n.actor.username}&background=222222&color=dc2626`} alt={actorName} />
                  <div className="content">
                    <p>
                      <strong>{actorName}</strong> {actionText} {targetText}.
                    </p>
                    <span className="time">{new Date(n.created_at).toLocaleDateString('pt-BR')} as {new Date(n.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  {!n.read && <div style={{ width: 10, height: 10, borderRadius: '50%', background: colors.primary, marginTop: '0.4rem' }} />}
                </NotificationItem>
              );
            })
          )}
        </NotificationList>
      )}
    </CommunityLayout>
  );
};

export default Notificacoes;
