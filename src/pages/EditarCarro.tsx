import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { supabase } from '../lib/supabase';
import { useNavigate, useParams } from 'react-router-dom';
import { colors } from '../styles/GlobalStyles';

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: #000;
`;

const FormContainer = styled.div`
  background: #111;
  padding: 3rem;
  border-radius: 12px;
  border: 1px solid #333;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
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
  
  input, select, textarea {
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

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
  width: 100%;
`;

const PhotoThumbnail = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  border-radius: 8px;
  overflow: hidden;
  background: #222;

  img {
    position: absolute;
    top: 0; left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .remove-btn {
    position: absolute;
    top: 5px;
    right: 5px;
    background: rgba(220, 38, 38, 0.9);
    color: white;
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
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

const DeleteButton = styled(OutlineButton)`
  border-color: #ef4444;
  color: #ef4444;
  &:hover:not(:disabled) {
    background: rgba(239, 68, 68, 0.1);
  }
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
  margin-bottom: 2rem;

  &:hover {
    border-color: ${colors.primary};
  }
`;

export default function EditarCarro() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  
  const [modelo, setModelo] = useState('');
  const [ano, setAno] = useState('');
  const [cor, setCor] = useState('');
  const [descricao, setDescricao] = useState('');
  
  const [fotosAtuais, setFotosAtuais] = useState<string[]>([]);
  const [novasFotos, setNovasFotos] = useState<File[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const modelos = [
    { label: 'GTI (2.0 8v/16v)', value: 'GTI' },
    { label: 'GLX (2.0 8v)', value: 'GLX' },
    { label: 'VR6 (2.8 12v)', value: 'VR6' },
    { label: 'GL (1.8 / 2.0)', value: 'GL' },
    { label: 'GT (2.0)', value: 'GT' },
    { label: 'CL (1.8)', value: 'CL' },
    { label: 'Highline (2.0)', value: 'Highline' },
    { label: 'Cabrio', value: 'Cabrio' },
    { label: 'Outro', value: 'Outro' }
  ];

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login');
      return;
    }

    const { data: profile } = await supabase.from('mk3_users').select('is_premium, premium_manual').eq('id', session.user.id).single();
    setIsPremium(profile?.is_premium || profile?.premium_manual || false);

    const { data: carro } = await supabase.from('mk3_garagem').select('*').eq('id', id).single();
    if (carro) {
      setModelo(carro.modelo);
      setAno(carro.ano || '');
      setCor(carro.cor || '');
      setDescricao(carro.descricao || '');
      setFotosAtuais(carro.fotos || []);
    } else {
      navigate('/minha-garagem');
    }
    setLoading(false);
  };

  const handleAddPhotos = (files: FileList | null) => {
    if (!files) return;
    setError('');
    
    const limit = isPremium ? 10 : 2;
    const totalCurrentPhotos = fotosAtuais.length + novasFotos.length;
    
    const validFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
    
    if (totalCurrentPhotos + validFiles.length > limit) {
      setError(`Seu plano ${isPremium ? 'Premium' : 'Free'} permite até ${limit} fotos por carro. Você já tem/selecionou ${totalCurrentPhotos}.`);
      const allowedCount = limit - totalCurrentPhotos;
      if (allowedCount > 0) {
        setNovasFotos(prev => [...prev, ...validFiles.slice(0, allowedCount)]);
      }
    } else {
      setNovasFotos(prev => [...prev, ...validFiles]);
    }
  };

  const handleRemoveFotoAtual = (index: number) => {
    setFotosAtuais(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveNovaFoto = (index: number) => {
    setNovasFotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeleteCarro = async () => {
    if (window.confirm('Tem certeza que deseja remover este carro da sua garagem?')) {
      setSaving(true);
      await supabase.from('mk3_garagem').delete().eq('id', id);
      navigate('/minha-garagem');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    let finalPhotoUrls = [...fotosAtuais];

    if (novasFotos.length > 0) {
      for (const file of novasFotos) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${session.user.id}-${Math.random()}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
          .from('garagem_fotos')
          .upload(fileName, file);

        if (!uploadError && data) {
          const { data: publicUrlData } = supabase.storage.from('garagem_fotos').getPublicUrl(fileName);
          finalPhotoUrls.push(publicUrlData.publicUrl);
        }
      }
    }

    await supabase
      .from('mk3_garagem')
      .update({
        modelo,
        ano,
        cor,
        descricao,
        fotos: finalPhotoUrls
      })
      .eq('id', id);

    navigate('/minha-garagem');
  };

  if (loading) return <PageWrapper><h2 style={{color:'white'}}>Carregando...</h2></PageWrapper>;

  return (
    <PageWrapper>
      <FormContainer>
        <h1 style={{ color: 'white', marginBottom: '2rem' }}>Editar Carro</h1>
        
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          
          <FormGroup>
            <label>Fotos ({fotosAtuais.length + novasFotos.length}/{isPremium ? 10 : 2})</label>
            
            {(fotosAtuais.length > 0 || novasFotos.length > 0) && (
              <PhotoGrid>
                {fotosAtuais.map((url, i) => (
                  <PhotoThumbnail key={url}>
                    <img src={url} alt={`Foto atual ${i}`} />
                    <button type="button" className="remove-btn" onClick={() => handleRemoveFotoAtual(i)}>
                      <i className="fas fa-times"></i>
                    </button>
                  </PhotoThumbnail>
                ))}
                {novasFotos.map((file, i) => (
                  <PhotoThumbnail key={file.name}>
                    <img src={URL.createObjectURL(file)} alt={`Nova foto ${i}`} />
                    <button type="button" className="remove-btn" onClick={() => handleRemoveNovaFoto(i)}>
                      <i className="fas fa-times"></i>
                    </button>
                  </PhotoThumbnail>
                ))}
              </PhotoGrid>
            )}

            {(fotosAtuais.length + novasFotos.length) < (isPremium ? 10 : 2) && (
              <DropZone 
                $isDragActive={isDragActive}
                onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
                onDragLeave={() => setIsDragActive(false)}
                onDrop={(e) => { e.preventDefault(); setIsDragActive(false); handleAddPhotos(e.dataTransfer.files); }}
                onClick={() => fileInputRef.current?.click()}
              >
                <i className="fas fa-cloud-upload-alt"></i>
                <p>Arraste fotos ou clique para enviar</p>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  multiple
                  accept="image/*"
                  onChange={e => handleAddPhotos(e.target.files)}
                  style={{ display: 'none' }}
                />
              </DropZone>
            )}
            
            {error && <div style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</div>}
          </FormGroup>

          <FormGroup>
            <label>Versão / Modelo</label>
            <select required value={modelo} onChange={e => setModelo(e.target.value)}>
              {modelos.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </FormGroup>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <FormGroup style={{ flex: 1 }}>
              <label>Ano</label>
              <input type="text" value={ano} onChange={e => setAno(e.target.value)} />
            </FormGroup>
            <FormGroup style={{ flex: 1 }}>
              <label>Cor</label>
              <input type="text" value={cor} onChange={e => setCor(e.target.value)} />
            </FormGroup>
          </div>

          <FormGroup>
            <label>Descrição do Projeto (Mods, Histórico)</label>
            <textarea rows={4} value={descricao} onChange={e => setDescricao(e.target.value)} />
          </FormGroup>

          <Button type="submit" disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
          <OutlineButton type="button" onClick={() => navigate('/minha-garagem')} disabled={saving}>
            Cancelar
          </OutlineButton>
          <DeleteButton type="button" onClick={handleDeleteCarro} disabled={saving}>
            Excluir Carro
          </DeleteButton>
        </form>
      </FormContainer>
    </PageWrapper>
  );
}
