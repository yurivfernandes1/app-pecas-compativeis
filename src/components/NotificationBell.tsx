import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { supabase } from '../lib/supabase';
import { colors } from '../styles/GlobalStyles';
import { useNavigate } from 'react-router-dom';

const BellContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-left: 0.5rem;
`;

const BellButton = styled.button`
  background: transparent;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  position: relative;
  padding: 0.5rem;
  transition: all 0.2s ease;

  &:hover {
    color: ${colors.primary};
    transform: scale(1.1);
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 0px;
  right: 0px;
  background: ${colors.primary};
  color: white;
  font-size: 0.65rem;
  font-weight: bold;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #0a0a0a;
`;

const Dropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: #111;
  border: 1px solid #333;
  border-radius: 8px;
  width: 320px;
  max-height: 400px;
  display: ${props => props.$isOpen ? 'flex' : 'none'};
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(0,0,0,0.8);
  z-index: 1001;
  overflow: hidden;
`;

const DropdownHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #333;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h4 {
    margin: 0;
    color: white;
    font-size: 1rem;
  }
  
  button {
    background: transparent;
    border: none;
    color: ${colors.primary};
    font-size: 0.8rem;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const NotificationList = styled.div`
  overflow-y: auto;
  flex: 1;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: #111;
  }
  &::-webkit-scrollbar-thumb {
    background: #333;
    border-radius: 4px;
  }
`;

const NotificationItem = styled.div<{ $unread: boolean }>`
  padding: 1rem;
  border-bottom: 1px solid #222;
  background: ${props => props.$unread ? 'rgba(220, 38, 38, 0.05)' : 'transparent'};
  display: flex;
  gap: 1rem;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }

  .content {
    flex: 1;
    font-size: 0.85rem;
    line-height: 1.4;

    strong {
      color: white;
    }
    
    p {
      margin: 0;
      color: #bbb;
    }

    .time {
      display: block;
      margin-top: 0.3rem;
      font-size: 0.75rem;
      color: #666;
    }
  }
`;

const EmptyState = styled.div`
  padding: 2rem 1rem;
  text-align: center;
  color: #666;
  font-size: 0.9rem;
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

const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    // A query requires mapping actor_id to mk3_users
    const { data } = await supabase
      .from('mk3_notifications')
      .select('*, actor:mk3_users!actor_id(username, nome_completo, avatar_url)')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (data) {
      setNotifications(data as any);
    }
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
      setNotifications(notifications.map(n => n.id === notification.id ? { ...n, read: true } : n));
    }
    setIsOpen(false);
    
    if (notification.item_type === 'car') {
      navigate(`/carro/${notification.item_id}`);
    } else {
      navigate('/feed');
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <BellContainer ref={dropdownRef}>
      <BellButton onClick={() => {
        setIsOpen(!isOpen);
        if (!isOpen) fetchNotifications();
      }}>
        <i className={unreadCount > 0 ? "fas fa-bell" : "far fa-bell"}></i>
        {unreadCount > 0 && <Badge>{unreadCount}</Badge>}
      </BellButton>

      <Dropdown $isOpen={isOpen}>
        <DropdownHeader>
          <h4>Notificações</h4>
          {unreadCount > 0 && <button onClick={markAllAsRead}>Marcar todas lidas</button>}
        </DropdownHeader>
        <NotificationList>
          {notifications.length === 0 ? (
            <EmptyState>Nenhuma notificação nova.</EmptyState>
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
                    <span className="time">{new Date(n.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                </NotificationItem>
              );
            })
          )}
        </NotificationList>
      </Dropdown>
    </BellContainer>
  );
};

export default NotificationBell;
