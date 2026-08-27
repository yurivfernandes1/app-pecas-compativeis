import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { colors } from '../styles/GlobalStyles';
import imageCompression from 'browser-image-compression';

import CommunityLayout from '../components/CommunityLayout';

const FormContainer = styled.div`
  background: #111;
  padding: 3rem;
  border-radius: 12px;
  border: 1px solid #333;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AvatarPreview = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 2px solid ${colors.primary};
  object-fit: cover;
  background: #222;
  box-shadow: 0 0 15px rgba(220, 38, 38, 0.4);
`;

const DropZone = styled.div<{ $isDragActive: boolean }>`
  width: 100%;
  border: 2px dashed ${props => props.$isDragActive ? colors.primary : '#333'};
  background: ${props => props.$isDragActive ? 'rgba(220, 38, 38, 0.05)' : '#1a1a1a'};
  border-radius: 12px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;

  &:hover {
    border-color: ${colors.primary};
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  width: 100%;
  
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

const OutlineButton = styled(Button)`
  background: transparent;
  border: 1px solid #555;
  color: white;
  margin-top: 0.5rem;

  &:hover:not(:disabled) {
    background: #333;
  }
`;

export default function EditarPerfil() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [bio, setBio] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login');
      return;
    }

    const { data } = await supabase
      .from('mk3_users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (data) {
      setNome(data.nome_completo || '');
      setBio(data.bio || '');
      setCidade(data.cidade || '');
      setEstado(data.estado || '');
      setAvatarPreview(data.avatar_url || '');
    }
    setLoading(false);
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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    let avatar_url = avatarPreview;

    if (avatarFile) {
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 500,
        useWebWorker: true,
      };
      
      try {
        const compressedFile = await imageCompression(avatarFile, options);
        const fileExt = compressedFile.name.split('.').pop();
        const fileName = `${session.user.id}-${Math.random()}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
          .from('avatars')
          .upload(fileName, compressedFile);
        
        if (!uploadError && data) {
          const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
          avatar_url = publicUrlData.publicUrl;
        }
      } catch (error) {
        console.error('Error compressing image:', error);
      }
    }

    await supabase
      .from('mk3_users')
      .update({
        nome_completo: nome,
        bio: bio,
        cidade: cidade,
        estado: estado,
        avatar_url: avatar_url
      })
      .eq('id', session.user.id);

    navigate('/minha-garagem');
  };

  if (loading) return <CommunityLayout><h2 style={{color:'white'}}>Carregando...</h2></CommunityLayout>;

  return (
    <CommunityLayout>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <FormContainer>
        <h1 style={{ color: 'white', marginBottom: '2rem' }}>Editar Perfil</h1>
        
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          
          <FormGroup>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
              <DropZone 
                $isDragActive={isDragActive}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {avatarPreview ? (
                  <AvatarPreview src={avatarPreview} alt="Preview do Perfil" />
                ) : (
                  <i className="fas fa-cloud-upload-alt"></i>
                )}
                <p style={{ marginTop: avatarPreview ? '1rem' : '0' }}>
                  {avatarPreview ? 'Clique para trocar de foto' : 'Clique para adicionar foto'}
                </p>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*"
                  onChange={e => {
                    if (e.target.files && e.target.files.length > 0) {
                      const file = e.target.files[0];
                      if (file.type.startsWith('image/')) {
                        setAvatarFile(file);
                        setAvatarPreview(URL.createObjectURL(file));
                      }
                    }
                  }}
                  style={{ display: 'none' }}
                />
              </DropZone>
            </div>
          </FormGroup>

          <FormGroup>
            <label>Nome Completo</label>
            <input 
              type="text" 
              required 
              value={nome}
              onChange={e => setNome(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <label>Biografia curta</label>
            <textarea 
              rows={3}
              value={bio}
              onChange={e => setBio(e.target.value)}
            />
          </FormGroup>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <FormGroup style={{ flex: 1 }}>
              <label>Cidade</label>
              <input 
                type="text" 
                value={cidade}
                onChange={e => setCidade(e.target.value)}
              />
            </FormGroup>
            <FormGroup style={{ flex: 0.5 }}>
              <label>Estado</label>
              <input 
                type="text" 
                value={estado}
                onChange={e => setEstado(e.target.value)}
                maxLength={2}
              />
            </FormGroup>
          </div>

          <Button type="submit" disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
          <OutlineButton type="button" onClick={() => navigate('/minha-garagem')}>
            Cancelar
          </OutlineButton>
        </form>
      </FormContainer>
      </div>
    </CommunityLayout>
  );
}
