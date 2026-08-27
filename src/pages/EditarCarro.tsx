import React, { useState, useEffect, useRef } from 'react';
import ImagePositionModal from '../components/ImagePositionModal';
import { getObjectPosition } from '../utils/imagePos';
import styled from 'styled-components';
import { supabase } from '../lib/supabase';
import { useNavigate, useParams } from 'react-router-dom';
import imageCompression from 'browser-image-compression';
import { colors, media } from '../styles/GlobalStyles';
import CustomSelect from '../components/CustomSelect';

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
  max-width: 800px;
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

const CheckboxGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.8rem;
  
  ${media.tablet} {
    grid-template-columns: 1fr 1fr;
  }

  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0;
    cursor: pointer;
    font-size: 0.9rem;
    color: #ccc;
    background: #1a1a1a;
    padding: 0.8rem;
    border-radius: 6px;
    border: 1px solid #333;
    transition: all 0.2s;

    &:hover {
      border-color: #555;
    }

    input[type="checkbox"] {
      width: auto;
      margin: 0;
      accent-color: ${colors.primary};
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

const VendaBox = styled.div`
  background: rgba(255, 215, 0, 0.05);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  width: 100%;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;

    h3 {
      color: #FFD700;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  }

  .toggle-switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 26px;

    input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #333;
      transition: .4s;
      border-radius: 34px;

      &:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
      }
    }

    input:checked + .slider {
      background-color: ${colors.primary};
    }

    input:checked + .slider:before {
      transform: translateX(24px);
    }

    input:disabled + .slider {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
`;

const AlertBox = styled.div`
  background: rgba(220, 38, 38, 0.1);
  border-left: 4px solid ${colors.primary};
  padding: 1rem;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #ddd;

  strong {
    color: white;
  }
`;

const formatCurrency = (value: string | number) => {
  if (!value) return '';
  const numbers = String(value).replace(/\D/g, '');
  if (!numbers) return '';
  const amount = Number(numbers) / 100;
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount);
};

const parseCurrency = (val: string) => {
  if (!val) return null;
  const numbers = val.replace(/\D/g, '');
  return numbers ? Number(numbers) / 100 : null;
};

export default function EditarCarro() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  
  const [modelo, setModelo] = useState('');
  const [ano, setAno] = useState('');
  const [anoModelo, setAnoModelo] = useState('');
  const [cor, setCor] = useState('');
  const [origem, setOrigem] = useState('');
  const [descricao, setDescricao] = useState('');
  const [problemas, setProblemas] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  
  const [vendaAtivo, setVendaAtivo] = useState(false);
  const [vendaPreco, setVendaPreco] = useState('');

  const [fotosAtuais, setFotosAtuais] = useState<string[]>([]);
  const [novasFotos, setNovasFotos] = useState<{file: File, pos: string}[]>([]);
  const [cropModalData, setCropModalData] = useState<{isAtuais: boolean, index: number, url: string} | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState('');

  // Tags do banco
  const [availableOpcionais, setAvailableOpcionais] = useState<any[]>([]);
  const [availablePecas, setAvailablePecas] = useState<any[]>([]);
  const [availableModMotor, setAvailableModMotor] = useState<any[]>([]);
  
  // Tags selecionadas
  const [selectedOpcionais, setSelectedOpcionais] = useState<string[]>([]);
  const [selectedPecas, setSelectedPecas] = useState<string[]>([]);
  const [selectedModMotor, setSelectedModMotor] = useState<string[]>([]);

  // Modificações Motor e Suspensão
  const [modificacaoMotor, setModificacaoMotor] = useState(false);
  const [modificacaoSuspensao, setModificacaoSuspensao] = useState(false);
  const [tipoSuspensao, setTipoSuspensao] = useState('');
  const [marcaSuspensao, setMarcaSuspensao] = useState('');

  const tiposSuspensao = [
    'mola esportiva', 'mola cortada', 'suspensão fixa preparada', 
    'suspensão a rosca', 'suspensão coilover', 'suspensão a ar'
  ];
  
  const marcasSuspensao = [
    'Tebao', 'castor', 'macaulay', 'sector', 'nasa', 'As suspensões', 
    'Impacto suspensões', 'Surface', 'Redcoil', 'eibach', 'H&R', 'HKI', 'outros'
  ];

  const fileInputRef = useRef<HTMLInputElement>(null);

  const modelos = [
    { label: 'GTI (2.0 8v/16v)', value: 'GTI' },
    { label: 'GLX (2.0 8v)', value: 'GLX' },
    { label: 'VR6 (2.8 12v)', value: 'VR6' },
    { label: 'GL (1.8 / 2.0)', value: 'GL' },
    { label: 'GT (2.0)', value: 'GT' },
    { label: 'CL (1.8)', value: 'CL' },
    { label: 'Highline (2.0)', value: 'Highline' },
    { label: 'TDi (Diesel)', value: 'TDi' },
    { label: 'Cabrio', value: 'Cabrio' },
    { label: 'Outro', value: 'Outro' }
  ];

  const origens = [
    { value: 'Alemanha (Wolfsburg/Zwickau)', label: '🇩🇪 Alemanha (Wolfsburg/Zwickau)' },
    { value: 'México (Puebla)', label: '🇲🇽 México (Puebla)' },
    { value: 'África do Sul (Uitenhage)', label: '🇿🇦 África do Sul (Uitenhage)' },
    { value: 'Bélgica (Bruxelas)', label: '🇧🇪 Bélgica (Bruxelas)' },
    { value: 'Eslováquia (Bratislava)', label: '🇸🇰 Eslováquia (Bratislava)' }
  ];

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login');
      return;
    }

    // Buscar perfil do usuário
    const { data: profile } = await supabase.from('mk3_users').select('is_premium, premium_manual').eq('id', session.user.id).single();
    setIsPremium(profile?.is_premium || profile?.premium_manual || false);

    // Buscar Tags do sistema
    const { data: tags } = await supabase.from('mk3_car_tags').select('*');
    if (tags) {
      setAvailableOpcionais(tags.filter(t => t.tipo === 'opcional'));
      setAvailablePecas(tags.filter(t => t.tipo === 'peca_rara'));
      setAvailableModMotor(tags.filter(t => t.tipo === 'mod_motor'));
    }

    // Buscar carro
    const { data: carro } = await supabase.from('mk3_garagem').select('*').eq('id', id).single();
    if (carro) {
      setModelo(carro.modelo || 'GTI');
      setAno(carro.ano_fabricacao || carro.ano || '');
      setAnoModelo(carro.ano_modelo || '');
      setCor(carro.cor || '');
      setOrigem(carro.origem || '');
      setDescricao(carro.descricao || '');
      setProblemas(carro.problemas_atuais || '');
      setInstagramUrl(carro.instagram_url || '');
      setVendaAtivo(carro.venda_ativo || false);
      setVendaPreco(carro.venda_preco ? formatCurrency(carro.venda_preco * 100) : '');
      setFotosAtuais(carro.fotos || []);
      setSelectedOpcionais(carro.opcionais || []);
      setSelectedPecas(carro.pecas_raras || []);
      setModificacaoMotor(carro.modificacao_motor || false);
      setSelectedModMotor(carro.modificacoes_motor || []);
      setModificacaoSuspensao(carro.modificacao_suspensao || false);
      setTipoSuspensao(carro.tipo_suspensao || '');
      setMarcaSuspensao(carro.marca_suspensao || '');
    } else {
      navigate('/minha-garagem');
    }
    setLoading(false);
  };

  const handleAddPhotos = (files: FileList | null) => {
    if (!files) return;
    setError('');
    
    const limit = isPremium ? 12 : 3;
    const totalCurrentPhotos = fotosAtuais.length + novasFotos.length;
    
    const validFiles = Array.from(files).filter(file => file.type.startsWith('image/')).map(f => ({ file: f, pos: '50,50' }));
    
    if (totalCurrentPhotos >= limit) {
      setError(`Seu plano ${isPremium ? 'Premium' : 'Free'} permite até ${limit} fotos por carro. Você já tem/selecionou ${totalCurrentPhotos}.`);
    } else {
      const allowedCount = limit - totalCurrentPhotos;
      setNovasFotos(prev => [...prev, ...validFiles.slice(0, allowedCount)]);
    }
  };

  const handleDeleteCarro = async () => {
    if (window.confirm('Tem certeza que deseja remover este carro da sua garagem?')) {
      setSaving(true);
      await supabase.from('mk3_garagem').delete().eq('id', id);
      navigate('/minha-garagem');
    }
  };

  const toggleTag = (tag: string, list: string[], setList: (arr: string[]) => void) => {
    if (list.includes(tag)) {
      setList(list.filter(t => t !== tag));
    } else {
      setList([...list, tag]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    let finalPhotoUrls = [...fotosAtuais];

    if (novasFotos.length > 0) {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      };

      for (const photo of novasFotos) {
        try {
          const compressedFile = await imageCompression(photo.file, options);
          const fileExt = compressedFile.name.split('.').pop();
          const fileName = `${session.user.id}-${Math.random()}.${fileExt}`;
          const { error: uploadError, data } = await supabase.storage
            .from('garagem_fotos')
            .upload(fileName, compressedFile);

          if (!uploadError && data) {
            const { data: publicUrlData } = supabase.storage.from('garagem_fotos').getPublicUrl(fileName);
            finalPhotoUrls.push(`${publicUrlData.publicUrl}?pos=${photo.pos}`);
          }
        } catch (error) {
          console.error('Error compressing image:', error);
        }
      }
    }

    const carroUpdate = {
        modelo,
        ano_fabricacao: ano,
        ano_modelo: anoModelo,
        cor,
        origem,
        descricao,
        problemas_atuais: problemas,
        instagram_url: instagramUrl,
        opcionais: selectedOpcionais,
        pecas_raras: selectedPecas,
        venda_ativo: vendaAtivo,
        venda_preco: vendaPreco ? parseCurrency(vendaPreco) : null,
        fotos: finalPhotoUrls,
        modificacao_motor: modificacaoMotor,
        modificacoes_motor: selectedModMotor,
        modificacao_suspensao: modificacaoSuspensao,
        tipo_suspensao: tipoSuspensao,
        marca_suspensao: marcaSuspensao
    };

    const { error: updateError } = await supabase
      .from('mk3_garagem')
      .update(carroUpdate)
      .eq('id', id);

    if (updateError) {
      console.error('Erro ao atualizar carro:', updateError);
      alert(`Não foi possível salvar o carro: ${updateError.message}`);
      setSaving(false);
      return;
    }

    navigate('/minha-garagem');
  };

  const handlePremiumPlan = async () => {
    setSaving(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session');
      if (error) {
        throw error;
      }
      if (data && data.success === false) {
        throw new Error(data.error);
      }
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Falha ao gerar o link de pagamento.');
      }
    } catch (err: any) {
      console.error(err);
      alert('Erro ao redirecionar para o pagamento: ' + err.message);
      setSaving(false);
    }
  };

  if (loading) return <PageWrapper><h2 style={{color:'white'}}>Carregando...</h2></PageWrapper>;

  return (
    <PageWrapper>
      <FormContainer>
        <h1 style={{ color: 'white', marginBottom: '2rem' }}>Editar Carro</h1>
        
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          
          {/* FOTOS */}
          <FormGroup>
            <label>Fotos ({fotosAtuais.length + novasFotos.length}/{isPremium ? 12 : 3})</label>
            
            {(fotosAtuais.length > 0 || novasFotos.length > 0) && (
              <PhotoGrid>
                {fotosAtuais.map((url, i) => (
                  <PhotoThumbnail key={url}>
                    <img src={url} alt={`Foto atual ${i}`} style={{ objectPosition: getObjectPosition(url) }} />
                    <div style={{ position: 'absolute', top: 5, left: 5, display: 'flex', gap: '5px' }}>
                      <button type="button" onClick={() => setCropModalData({ isAtuais: true, index: i, url })} style={{ background: 'rgba(0,0,0,0.7)', border: 'none', color: 'white', padding: '5px', borderRadius: '4px', cursor: 'pointer', zIndex: 10 }}>
                        <i className="fas fa-crop-alt"></i> Ajustar
                      </button>
                    </div>
                    <button type="button" className="remove-btn" onClick={() => setFotosAtuais(prev => prev.filter((_, idx) => idx !== i))}>
                      <i className="fas fa-times"></i>
                    </button>
                  </PhotoThumbnail>
                ))}
                {novasFotos.map((photo, i) => {
                  const url = URL.createObjectURL(photo.file);
                  return (
                  <PhotoThumbnail key={photo.file.name + i}>
                    <img src={url} alt={`Nova foto ${i}`} style={{ objectPosition: photo.pos.replace(',', '% ') + '%' }} />
                    <div style={{ position: 'absolute', top: 5, left: 5, display: 'flex', gap: '5px' }}>
                      <button type="button" onClick={() => setCropModalData({ isAtuais: false, index: i, url })} style={{ background: 'rgba(0,0,0,0.7)', border: 'none', color: 'white', padding: '5px', borderRadius: '4px', cursor: 'pointer', zIndex: 10 }}>
                        <i className="fas fa-crop-alt"></i> Ajustar
                      </button>
                    </div>
                    <button type="button" className="remove-btn" onClick={() => setNovasFotos(prev => prev.filter((_, idx) => idx !== i))}>
                      <i className="fas fa-times"></i>
                    </button>
                  </PhotoThumbnail>
                )})}
              </PhotoGrid>
            )}

            {(fotosAtuais.length + novasFotos.length) < (isPremium ? 12 : 3) && (
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

          {/* DADOS BÁSICOS */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <FormGroup style={{ flex: '1 1 200px' }}>
              <label>Versão / Modelo</label>
              <CustomSelect 
                options={modelos}
                value={modelo}
                onChange={(val) => setModelo(val)}
                placeholder="Selecione o modelo"
              />
            </FormGroup>

            <FormGroup style={{ flex: '1 1 200px' }}>
              <label>Origem de Fabricação</label>
              <CustomSelect 
                options={origens}
                value={origem}
                onChange={(val) => setOrigem(val)}
                placeholder="Selecione a origem"
              />
            </FormGroup>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <FormGroup style={{ flex: '1 1 100px' }}>
              <label>Ano de Fabricação</label>
              <input type="number" required value={ano} onChange={e => setAno(e.target.value)} placeholder="Ex: 1995" />
            </FormGroup>

            <FormGroup style={{ flex: '1 1 100px' }}>
              <label>Ano Modelo</label>
              <input type="number" value={anoModelo} onChange={e => setAnoModelo(e.target.value)} placeholder="Ex: 1996" />
            </FormGroup>

            <FormGroup style={{ flex: '1 1 150px' }}>
              <label>Cor Predominante</label>
              <input type="text" required value={cor} onChange={e => setCor(e.target.value)} placeholder="Ex: Vermelho Tornado" />
            </FormGroup>
          </div>

          <FormGroup>
            <label>Link do Instagram do Projeto (Opcional)</label>
            <input 
              type="url" 
              value={instagramUrl} 
              onChange={e => setInstagramUrl(e.target.value)} 
              placeholder="Ex: https://instagram.com/meugolfgti" 
            />
          </FormGroup>

          <FormGroup>
            <label>Descrição do Projeto (Histórico, Curiosidades)</label>
            <textarea rows={3} value={descricao} onChange={e => setDescricao(e.target.value)} />
          </FormGroup>

          <FormGroup>
            <label>Precisa de Ajuda? (Descreva os problemas atuais do carro para a comunidade)</label>
            <textarea 
              rows={3} 
              value={problemas} 
              onChange={e => setProblemas(e.target.value)} 
              placeholder="Ex: Carro morrendo na lenta, marcha lenta oscilando..."
            />
          </FormGroup>

          {/* OPCIONAIS E PEÇAS RARAS */}
          <details style={{ margin: '2rem 0', width: '100%', background: '#1a1a1a', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333' }}>
            <summary style={{ color: 'white', cursor: 'pointer', outline: 'none', fontWeight: 'bold', fontSize: '1.1rem' }}>
              Opcionais
            </summary>
            <div style={{ paddingTop: '1.5rem' }}>
              {availableOpcionais.length === 0 ? <p style={{color: '#666'}}>Nenhum opcional cadastrado no banco de dados.</p> : (
                <CheckboxGrid>
                  {availableOpcionais.map(op => (
                    <label key={op.id}>
                      <input 
                        type="checkbox" 
                        checked={selectedOpcionais.includes(op.nome)}
                        onChange={() => toggleTag(op.nome, selectedOpcionais, setSelectedOpcionais)}
                      />
                      {op.nome}
                    </label>
                  ))}
                </CheckboxGrid>
              )}
            </div>
          </details>

          <details style={{ margin: '2rem 0', width: '100%', background: '#1a1a1a', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333' }}>
            <summary style={{ color: 'white', cursor: 'pointer', outline: 'none', fontWeight: 'bold', fontSize: '1.1rem' }}>
              Peças Raras
            </summary>
            <div style={{ paddingTop: '1.5rem' }}>
              {availablePecas.length === 0 ? <p style={{color: '#666'}}>Nenhuma peça rara cadastrada no banco de dados.</p> : (
                <CheckboxGrid>
                  {availablePecas.map(pr => (
                    <label key={pr.id}>
                      <input 
                        type="checkbox" 
                        checked={selectedPecas.includes(pr.nome)}
                        onChange={() => toggleTag(pr.nome, selectedPecas, setSelectedPecas)}
                      />
                      {pr.nome}
                    </label>
                  ))}
                </CheckboxGrid>
              )}
            </div>
          </details>

          <details style={{ margin: '2rem 0', width: '100%', background: '#1a1a1a', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333' }}>
            <summary style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', outline: 'none', fontWeight: 'bold', fontSize: '1.1rem', color: 'white' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Modificações de Motor</span>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#ccc', fontWeight: 'normal', fontSize: '0.9rem' }} onClick={e => e.stopPropagation()}>
                  <input 
                    type="checkbox" 
                    checked={modificacaoMotor} 
                    onChange={e => setModificacaoMotor(e.target.checked)} 
                    style={{ width: '18px', height: '18px', accentColor: colors.primary }}
                  />
                  Sim
                </label>
              </div>
            </summary>
            
            {modificacaoMotor && (
              <div style={{ marginTop: '1.5rem', animation: 'fadeIn 0.3s ease' }}>
                {availableModMotor.length === 0 ? <p style={{color: '#666'}}>Nenhuma modificação cadastrada.</p> : (
                  <CheckboxGrid>
                    {availableModMotor.map(mod => (
                      <label key={mod.id}>
                        <input 
                          type="checkbox" 
                          checked={selectedModMotor.includes(mod.nome)}
                          onChange={() => toggleTag(mod.nome, selectedModMotor, setSelectedModMotor)}
                        />
                        {mod.nome}
                      </label>
                    ))}
                  </CheckboxGrid>
                )}
              </div>
            )}
          </details>

          <details style={{ margin: '2rem 0', width: '100%', background: '#1a1a1a', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333' }}>
            <summary style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', outline: 'none', fontWeight: 'bold', fontSize: '1.1rem', color: 'white' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Modificações de Suspensão</span>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: '#ccc', fontWeight: 'normal', fontSize: '0.9rem' }} onClick={e => e.stopPropagation()}>
                  <input 
                    type="checkbox" 
                    checked={modificacaoSuspensao} 
                    onChange={e => setModificacaoSuspensao(e.target.checked)} 
                    style={{ width: '18px', height: '18px', accentColor: colors.primary }}
                  />
                  Sim
                </label>
              </div>
            </summary>
            
            {modificacaoSuspensao && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem', animation: 'fadeIn 0.3s ease' }}>
                <FormGroup style={{ marginBottom: 0 }}>
                  <label>Tipo de Suspensão</label>
                  <CustomSelect 
                    options={tiposSuspensao.map(t => ({ label: t, value: t }))}
                    value={tipoSuspensao}
                    onChange={(val) => setTipoSuspensao(val)}
                    placeholder="Selecione o tipo"
                  />
                </FormGroup>

                <FormGroup style={{ marginBottom: 0 }}>
                  <label>Marca</label>
                  <CustomSelect 
                    options={marcasSuspensao.map(m => ({ label: m, value: m }))}
                    value={marcaSuspensao}
                    onChange={(val) => setMarcaSuspensao(val)}
                    placeholder="Selecione a marca"
                  />
                </FormGroup>
              </div>
            )}
          </details>

          {/* MÓDULO DE VENDA (PREMIUM) */}
          <VendaBox>
            <div className="header">
              <h3><i className="fas fa-money-bill-wave"></i> Vender este carro</h3>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={vendaAtivo} 
                  onChange={(e) => {
                    if (!isPremium) {
                      alert('A venda de carros é um recurso exclusivo para membros Premium!');
                      return;
                    }
                    setVendaAtivo(e.target.checked);
                  }}
                  disabled={!isPremium && !vendaAtivo}
                />
                <span className="slider"></span>
              </label>
            </div>
            
            {!isPremium && !vendaAtivo && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start' }}>
                <p style={{ color: '#888', fontSize: '0.9rem', margin: 0 }}>Recurso exclusivo Premium. Assine para anunciar na comunidade.</p>
                <Button type="button" onClick={handlePremiumPlan} disabled={saving} style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  <i className="fas fa-crown" style={{ marginRight: '0.5rem' }}></i> Assinar Premium
                </Button>
              </div>
            )}

            {vendaAtivo && (
              <>
                <FormGroup style={{ marginTop: '1rem', marginBottom: 0 }}>
                  <label>Valor de Venda</label>
                  <input 
                    type="text" 
                    placeholder="Ex: R$ 45.000,00" 
                    value={vendaPreco} 
                    onChange={e => setVendaPreco(formatCurrency(e.target.value))} 
                    required={vendaAtivo}
                  />
                </FormGroup>
                
                <AlertBox>
                  <i className="fas fa-exclamation-triangle" style={{marginRight: '0.5rem'}}></i>
                  <strong>Atenção:</strong> Ao ativar a venda, os membros da comunidade poderão ver o seu <strong>telefone (WhatsApp)</strong>, sua <strong>Cidade e Estado</strong> que estão configurados no seu perfil público!
                </AlertBox>
              </>
            )}
          </VendaBox>

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
      {cropModalData && (
        <ImagePositionModal
          imageUrl={cropModalData.url}
          onCancel={() => setCropModalData(null)}
          onConfirm={(pos) => {
            if (cropModalData.isAtuais) {
              const newAtuais = [...fotosAtuais];
              const baseUrl = newAtuais[cropModalData.index].split('?')[0];
              newAtuais[cropModalData.index] = baseUrl + '?pos=' + pos;
              setFotosAtuais(newAtuais);
            } else {
              const newPhotos = [...novasFotos];
              newPhotos[cropModalData.index].pos = pos;
              setNovasFotos(newPhotos);
            }
            setCropModalData(null);
          }}
        />
      )}
    </PageWrapper>
  );
}
