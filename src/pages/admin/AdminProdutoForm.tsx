import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { supabase } from '../../lib/supabase';
import { useNavigate, useParams } from 'react-router-dom';
import { colors } from '../../styles/GlobalStyles';
import { hexToBase64 } from '../../utils/hexToBase64';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  color: ${colors.white};
`;

const BackButton = styled.button`
  background: transparent;
  color: ${colors.white};
  border: 1px solid ${colors.gray[600]};
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const Form = styled.form`
  background: #111;
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #333;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
    color: ${colors.gray[300]};
    font-weight: 500;
  }
  
  input, textarea {
    width: 100%;
    padding: 0.8rem 1rem;
    background: #1a1a1a;
    border: 1px solid #333;
    color: white;
    border-radius: 6px;
    transition: all 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: ${colors.primary};
      box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.2);
    }
  }

  select {
    width: 100%;
    padding: 0.8rem 1rem;
    background: #1a1a1a;
    border: 1px solid #333;
    color: white;
    border-radius: 6px;
    transition: all 0.2s ease;
    
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    background-size: 1rem;
    padding-right: 3rem;
    cursor: pointer;
    
    &:focus {
      outline: none;
      border-color: ${colors.primary};
      box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.2);
    }
    
    option {
      background: #1a1a1a;
      color: white;
      padding: 0.5rem;
    }
  }
`;

const ImageGallery = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
`;

const ImagePreview = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #333;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: ${colors.primary};
  }
`;

const UploadZone = styled.div`
  width: 100%;
  border: 2px dashed #444;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  color: ${colors.gray[400]};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${colors.primary};
    color: ${colors.primary};
    background: rgba(220, 38, 38, 0.05);
  }
`;

const SubmitButton = styled.button`
  background: ${colors.primary};
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  width: 100%;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: #b91c1c;
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const DeleteButton = styled.button`
  background: transparent;
  color: #f87171;
  border: 1px solid #f87171;
  padding: 1rem 2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  width: 100%;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: rgba(248, 113, 113, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default function AdminProdutoForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id);
  const [oldBlobPreview, setOldBlobPreview] = useState<string | null>(null);
  
  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    url: '',
    categoria_id: '',
    is_active: true,
    imagens: [] as string[]
  });

  const [categorias, setCategorias] = useState<any[]>([]);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) navigate('/admin/login');
    };
    checkSession();
    fetchCategorias();

    if (id) {
      loadProduct();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchCategorias = async () => {
    const { data } = await supabase.from('pecas_categorias').select('*').eq('is_active', true).order('nome');
    if (data) setCategorias(data);
  };

  const loadProduct = async () => {
    const { data } = await supabase.from('pecas_produtos').select('*').eq('id', id).single();
    if (data) {
      setForm({
        nome: data.nome,
        descricao: data.descricao || '',
        url: data.url || '',
        categoria_id: data.categoria_id || '',
        is_active: data.is_active,
        imagens: data.imagens || []
      });
      
      if (data.imagem_blob && (!data.imagens || data.imagens.length === 0)) {
        setOldBlobPreview(`data:${data.imagem_mime || 'image/png'};base64,${hexToBase64(data.imagem_blob)}`);
      }
    }
    setInitialLoading(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    
    setFilesToUpload([...filesToUpload, ...files]);
    
    const newPreviews = files.map(f => URL.createObjectURL(f));
    setPreviewUrls([...previewUrls, ...newPreviews]);
  };

  const removeExistingImage = (index: number) => {
    const newImagens = [...form.imagens];
    newImagens.splice(index, 1);
    setForm({ ...form, imagens: newImagens });
  };

  const removeNewImage = (index: number) => {
    const newFiles = [...filesToUpload];
    const newPreviews = [...previewUrls];
    
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setFilesToUpload(newFiles);
    setPreviewUrls(newPreviews);
  };

  const removeOldBlob = () => {
    setOldBlobPreview(null);
    // In backend we just leave it, or we could explicitly null it, but for now ignoring it is fine since `imagens` array takes precedence.
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const uploadedUrls: string[] = [];

      // Upload new files
      for (const file of filesToUpload) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `produtos/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('pecas-imagens')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('pecas-imagens')
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      const finalImagens = [...form.imagens, ...uploadedUrls];

      const payload = {
        nome: form.nome,
        descricao: form.descricao,
        url: form.url,
        categoria_id: form.categoria_id || null,
        is_active: form.is_active,
        imagens: finalImagens
      };

      if (id) {
        // Se deletou a blob antiga na UI, limpamos do banco pra economizar espaço
        const updatePayload: any = { ...payload };
        if (!oldBlobPreview) {
          updatePayload.imagem_blob = null;
          updatePayload.imagem_mime = null;
        }
        await supabase.from('pecas_produtos').update(updatePayload).eq('id', id);
      } else {
        await supabase.from('pecas_produtos').insert(payload);
      }

      navigate('/admin/produtos');
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar produto');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    const confirm = window.confirm('Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.');
    if (!confirm) return;

    setLoading(true);
    try {
      await supabase.from('pecas_produtos').delete().eq('id', id);
      navigate('/admin/produtos');
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir produto');
      setLoading(false);
    }
  };

  if (initialLoading) return <Container><p style={{color: 'white'}}>Carregando...</p></Container>;

  return (
    <Container>
      <Header>
        <Title>{id ? 'Editar Produto' : 'Novo Produto'}</Title>
        <BackButton type="button" onClick={() => navigate('/admin/produtos')}>Voltar</BackButton>
      </Header>

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <label>Nome do Produto</label>
          <input 
            required 
            value={form.nome} 
            onChange={e => setForm({...form, nome: e.target.value})} 
          />
        </FormGroup>

        <FormGroup>
          <label>Categoria</label>
          <select 
            value={form.categoria_id} 
            onChange={e => setForm({...form, categoria_id: e.target.value})}
          >
            <option value="">Selecione uma categoria...</option>
            {categorias.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nome}</option>
            ))}
          </select>
        </FormGroup>

        <FormGroup>
          <label>Descrição</label>
          <textarea 
            rows={4} 
            value={form.descricao} 
            onChange={e => setForm({...form, descricao: e.target.value})} 
          />
        </FormGroup>

        <FormGroup>
          <label>Link de Afiliado (Shopee/AliExpress)</label>
          <input 
            required 
            type="url"
            value={form.url} 
            onChange={e => setForm({...form, url: e.target.value})} 
          />
        </FormGroup>

        <FormGroup>
          <label>Galeria de Imagens</label>
          
          <UploadZone onClick={() => fileInputRef.current?.click()}>
            <i className="fas fa-cloud-upload-alt" style={{ fontSize: '2rem', marginBottom: '1rem' }}></i>
            <p>Clique para selecionar várias imagens</p>
          </UploadZone>
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            onChange={handleFileSelect} 
          />

          <ImageGallery>
            {/* Imagem Legacy (Hex) */}
            {oldBlobPreview && (
              <ImagePreview>
                <img src={oldBlobPreview} alt="Legacy" />
                <RemoveButton type="button" onClick={removeOldBlob} title="Remover imagem antiga">
                  <i className="fas fa-times"></i>
                </RemoveButton>
              </ImagePreview>
            )}

            {/* Imagens do Storage já salvas */}
            {form.imagens.map((url, i) => (
              <ImagePreview key={url}>
                <img src={url} alt={`Saved ${i}`} />
                <RemoveButton type="button" onClick={() => removeExistingImage(i)}>
                  <i className="fas fa-times"></i>
                </RemoveButton>
              </ImagePreview>
            ))}

            {/* Imagens Novas (Preview Local) */}
            {previewUrls.map((url, i) => (
              <ImagePreview key={`new-${i}`}>
                <img src={url} alt={`New ${i}`} />
                <div style={{ position: 'absolute', bottom: 0, background: 'rgba(0,0,0,0.5)', width: '100%', textAlign: 'center', fontSize: '0.7rem' }}>Novo</div>
                <RemoveButton type="button" onClick={() => removeNewImage(i)}>
                  <i className="fas fa-times"></i>
                </RemoveButton>
              </ImagePreview>
            ))}
          </ImageGallery>
        </FormGroup>

        <FormGroup style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '2rem' }}>
          <input 
            type="checkbox" 
            style={{ width: 'auto' }} 
            checked={form.is_active} 
            onChange={e => setForm({...form, is_active: e.target.checked})} 
          />
          <label style={{ margin: 0 }}>Produto Ativo (Aparecer no site público)</label>
        </FormGroup>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          {id && (
            <DeleteButton type="button" disabled={loading} onClick={handleDelete}>
              Excluir Produto
            </DeleteButton>
          )}
          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Produto'}
          </SubmitButton>
        </div>
      </Form>
    </Container>
  );
}
