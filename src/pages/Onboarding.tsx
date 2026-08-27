import React, { useState, useEffect, useRef } from 'react';
import ImagePositionModal from '../components/ImagePositionModal';
import CustomSelect from '../components/CustomSelect';
import styled from 'styled-components';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { colors, media } from '../styles/GlobalStyles';
import imageCompression from 'browser-image-compression';

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
`;

const Title = styled.h1`
  color: ${colors.white};
  text-align: center;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: ${colors.gray[400]};
  text-align: center;
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  
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

const DropZone = styled.div<{ $isDragActive: boolean }>`
  border: 2px dashed ${props => props.$isDragActive ? colors.primary : '#333'};
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  background: ${props => props.$isDragActive ? 'rgba(220, 38, 38, 0.05)' : '#1a1a1a'};
  color: ${colors.gray[300]};
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 1rem;

  &:hover {
    border-color: ${colors.primary};
    background: rgba(220, 38, 38, 0.05);
  }

  i {
    font-size: 2rem;
    margin-bottom: 1rem;
    color: ${props => props.$isDragActive ? colors.primary : colors.gray[400]};
  }
`;

const PhotoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const PhotoPreview = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  button {
    position: absolute;
    top: 5px;
    right: 5px;
    background: rgba(220, 38, 38, 0.9);
    color: white;
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 0.8rem;
  }
`;

const PremiumBanner = styled.div`
  background: linear-gradient(135deg, rgba(220,38,38,0.1) 0%, rgba(0,0,0,0) 100%);
  border: 1px solid ${colors.primary};
  border-radius: 8px;
  padding: 1rem;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  div {
    flex: 1;
  }

  h4 {
    color: ${colors.primary};
    margin: 0 0 0.25rem 0;
  }

  p {
    margin: 0;
    font-size: 0.85rem;
    color: ${colors.gray[300]};
  }

  button {
    background: ${colors.primary};
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
    margin-left: 1rem;
    
    &:hover {
      background: #b91c1c;
    }
  }
`;

const CustomSelectWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const CustomSelectHeader = styled.div<{ $isOpen: boolean }>`
  width: 100%;
  padding: 0.8rem 1rem;
  background: #1a1a1a;
  border: 1px solid ${props => props.$isOpen ? colors.primary : '#333'};
  color: white;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: border-color 0.2s;

  i {
    transition: transform 0.3s ease;
    transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  }
`;

const CustomSelectList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 6px;
  margin-top: 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 100;
  padding: 0;
  list-style: none;
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
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
      background: #222;
    }

    input[type="checkbox"] {
      width: 18px;
      height: 18px;
      accent-color: ${colors.primary};
    }
  }
`;

const CustomSelectOption = styled.li`
  padding: 0.8rem 1rem;
  color: white;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(220, 38, 38, 0.1);
    color: ${colors.primary};
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

const PlanGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-top: 2rem;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const PlanCard = styled.div<{ $isPremium?: boolean }>`
  background: ${props => props.$isPremium ? 'linear-gradient(145deg, #1a1010 0%, #111 100%)' : '#111'};
  border: 2px solid ${props => props.$isPremium ? colors.primary : '#333'};
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-5px);
  }
  
  h3 {
    color: ${props => props.$isPremium ? colors.primary : 'white'};
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
  
  .price {
    font-size: 2rem;
    color: white;
    font-weight: bold;
    margin-bottom: 1.5rem;
    
    span {
      font-size: 1rem;
      color: #999;
    }
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0 0 2rem 0;
    text-align: left;
    flex: 1;
    
    li {
      margin-bottom: 0.8rem;
      color: #ccc;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      
      i {
        color: ${props => props.$isPremium ? colors.primary : '#666'};
      }
    }
  }
`;

const PopularBadge = styled.div`
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: ${colors.primary};
  color: white;
  padding: 0.2rem 1rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
  letter-spacing: 1px;
`;

export default function Onboarding() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [isPremium, setIsPremium] = useState(false);
  const [photos, setPhotos] = useState<{file: File, pos: string}[]>([]);
  const [cropModalData, setCropModalData] = useState<{index: number, url: string} | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [showPremiumOffer, setShowPremiumOffer] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);
  const [premiumPrice, setPremiumPrice] = useState('19.90');

  useEffect(() => {
    const fetchInitData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        let isUserPremium = false;
        const { data } = await supabase.from('mk3_users').select('is_premium, premium_manual').eq('id', session.user.id).single();
        if (data && (data.is_premium || data.premium_manual)) {
          isUserPremium = true;
          setIsPremium(true);
        }

        if (!isUserPremium) {
          const { count } = await supabase.from('mk3_garagem').select('*', { count: 'exact', head: true }).eq('user_id', session.user.id);
          if (count && count >= 1) {
            setStep(2);
          }
        }
      }
      
      
      const { data: tags } = await supabase.from('mk3_car_tags').select('*');
      if (tags) {
        setAvailableOpcionais(tags.filter(t => t.tipo === 'opcional').sort((a, b) => a.nome.localeCompare(b.nome)));
        setAvailablePecas(tags.filter(t => t.tipo === 'peca_rara').sort((a, b) => a.nome.localeCompare(b.nome)));
        setAvailableModMotor(tags.filter(t => t.tipo === 'mod_motor').sort((a, b) => a.nome.localeCompare(b.nome)));
        setAvailableRodas(tags.filter(t => t.tipo === 'roda').sort((a, b) => a.nome.localeCompare(b.nome)));
      }

      const { data: settings } = await supabase.from('mk3_settings').select('premium_price').limit(1).single();
      if (settings) {
        setPremiumPrice(Number(settings.premium_price).toFixed(2).replace('.', ','));
      }
    };
    fetchInitData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [form, setForm] = useState({
    modelo: 'GTI',
    ano: '1995',
    ano_modelo: '1995',
    cor: 'Vermelho Tornado',
    descricao: ''
  });
  
  
  const [origem, setOrigem] = useState('');
  const [problemas, setProblemas] = useState('');
  const [instagramUrl, setInstagramUrl] = useState('');
  
  // Tags do banco
  const [availableOpcionais, setAvailableOpcionais] = useState<any[]>([]);
  const [availablePecas, setAvailablePecas] = useState<any[]>([]);
  const [availableModMotor, setAvailableModMotor] = useState<any[]>([]);
  
  // Tags selecionadas
  const [selectedOpcionais, setSelectedOpcionais] = useState<string[]>([]);
  const [selectedPecas, setSelectedPecas] = useState<string[]>([]);
  const [selectedModMotor, setSelectedModMotor] = useState<string[]>([]);

  // Rodas
  const [availableRodas, setAvailableRodas] = useState<any[]>([]);
  const [aroRoda, setAroRoda] = useState('');
  const [modeloRoda, setModeloRoda] = useState('');
  const [customRoda, setCustomRoda] = useState('');

  // Modificações Motor e Suspensão
  const [modificacaoMotor, setModificacaoMotor] = useState(false);
  const [potenciaMotor, setPotenciaMotor] = useState('');
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

  const origens = [
    { value: 'Alemanha (Wolfsburg/Zwickau)', label: '🇩🇪 Alemanha (Wolfsburg/Zwickau)' },
    { value: 'México (Puebla)', label: '🇲🇽 México (Puebla)' },
    { value: 'África do Sul (Uitenhage)', label: '🇿🇦 África do Sul (Uitenhage)' },
    { value: 'Bélgica (Bruxelas)', label: '🇧🇪 Bélgica (Bruxelas)' },
    { value: 'Eslováquia (Bratislava)', label: '🇸🇰 Eslováquia (Bratislava)' }
  ];

  const toggleTag = (tag: string, current: string[], setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (current.includes(tag)) {
      setter(current.filter(t => t !== tag));
    } else {
      setter([...current, tag]);
    }
  };

  const [isSelectOpen, setIsSelectOpen] = useState(false);
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

  const handleFiles = (newFiles: File[]) => {
    const limit = isPremium ? 12 : 3;
    const mapped = newFiles.map(f => ({ file: f, pos: '50,50' }));
    if (photos.length + mapped.length > limit) {
      if (!isPremium) {
        setShowPremiumOffer(true);
      } else {
        alert(`Você atingiu o limite de ${limit} fotos.`);
      }
      const allowedCount = limit - photos.length;
      if (allowedCount > 0) {
        setPhotos([...photos, ...mapped.slice(0, allowedCount)]);
      }
    } else {
      setPhotos([...photos, ...mapped]);
    }
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
    const droppedFiles = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    handleFiles(droppedFiles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { session } } = await supabase.auth.getSession();
    
      if (session) {
      const uploadedUrls: string[] = [];
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      };

      for (const photo of photos) {
        try {
          const compressedFile = await imageCompression(photo.file, options);
          const fileExt = compressedFile.name.split('.').pop();
          const fileName = `${session.user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
          
          const { error: uploadError } = await supabase.storage
            .from('garagem_fotos')
            .upload(fileName, compressedFile);

          if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage.from('garagem_fotos').getPublicUrl(fileName);
            uploadedUrls.push(`${publicUrl}?pos=${photo.pos}`);
          }
        } catch (error) {
          console.error('Error compressing image:', error);
        }
      }

      const { error: insertError } = await supabase.from('mk3_garagem').insert({
        user_id: session.user.id,
        modelo: form.modelo,
        ano_fabricacao: form.ano,
        ano_modelo: form.ano_modelo,
        cor: form.cor,
        descricao: form.descricao,
        fotos: uploadedUrls,
        aro_roda: aroRoda,
        modelo_roda: modeloRoda === 'Outros' ? customRoda : modeloRoda,
        opcionais: selectedOpcionais,
        pecas_raras: selectedPecas,
        problemas_atuais: problemas,
        instagram_url: instagramUrl,
        origem: origem,
        modificacao_motor: modificacaoMotor,
        potencia_motor: potenciaMotor ? parseInt(potenciaMotor) : null,
        modificacoes_motor: selectedModMotor,
        modificacao_suspensao: modificacaoSuspensao,
        tipo_suspensao: tipoSuspensao,
        marca_suspensao: marcaSuspensao
      });

      if (insertError) {
        console.error('Erro ao salvar carro:', insertError);
        alert(`Não foi possível salvar o carro: ${insertError.message}`);
        setLoading(false);
        return;
      }
      
      if (isPremium) {
        navigate('/minha-garagem');
      } else {
        setStep(2);
        setLoading(false);
      }
    } else {
      navigate('/login');
    }
  };

  const handleFreePlan = () => {
    navigate('/minha-garagem');
  };

  const handlePremiumPlan = async () => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <FormContainer style={step === 2 ? { maxWidth: '800px' } : {}}>
        {step === 1 ? (
          <>
            <Title>Bem-vindo à Garagem! 🚗💨</Title>
            <Subtitle>Para começar, cadastre o seu primeiro carro na sua garagem virtual.</Subtitle>
            
            <form onSubmit={handleSubmit}>
              <FormGroup style={{ position: 'relative', zIndex: 50 }}>
                <label>Versão / Modelo</label>
                <CustomSelectWrapper>
                  <CustomSelectHeader 
                    $isOpen={isSelectOpen}
                    onClick={() => setIsSelectOpen(!isSelectOpen)}
                  >
                    {modelos.find(m => m.value === form.modelo)?.label || 'Selecione...'}
                    <i className="fas fa-chevron-down"></i>
                  </CustomSelectHeader>
                  {isSelectOpen && (
                    <CustomSelectList>
                      {modelos.map(m => (
                        <CustomSelectOption 
                          key={m.value}
                          onClick={() => {
                            setForm({...form, modelo: m.value});
                            setIsSelectOpen(false);
                          }}
                        >
                          {m.label}
                        </CustomSelectOption>
                      ))}
                    </CustomSelectList>
                  )}
                </CustomSelectWrapper>
              </FormGroup>

              <FormGroup style={{ position: 'relative', zIndex: 40 }}>
                <label>Origem de Fabricação</label>
                <CustomSelectWrapper>
                  <CustomSelectHeader 
                    $isOpen={isSelectOpen && form.modelo === 'FAKE'} // reusing isSelectOpen for both is buggy, let's just make it simple or use a new state
                    onClick={() => {}}
                    style={{display: 'none'}} // we'll use a standard select for simplicity in onboarding or just a native select since we don't have CustomSelect component imported properly for multiple usages
                  >
                  </CustomSelectHeader>
                  <select 
                    value={origem} 
                    onChange={e => setOrigem(e.target.value)}
                    style={{ width: '100%', padding: '0.8rem 1rem', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px', color: 'white', outline: 'none' }}
                  >
                    <option value="">Selecione a origem</option>
                    {origens.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </CustomSelectWrapper>
              </FormGroup>


              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <FormGroup style={{ flex: 1 }}>
                  <label>Ano de Fabricação</label>
                  <input type="number" value={form.ano} onChange={e => setForm({...form, ano: e.target.value})} placeholder="Ex: 1995" />
                </FormGroup>
                <FormGroup style={{ flex: 1 }}>
                  <label>Ano Modelo</label>
                  <input type="number" value={form.ano_modelo} onChange={e => setForm({...form, ano_modelo: e.target.value})} placeholder="Ex: 1996" />
                </FormGroup>
                <FormGroup style={{ flex: 1 }}>
                  <label>Cor</label>
                  <input type="text" value={form.cor} onChange={e => setForm({...form, cor: e.target.value})} placeholder="Ex: Vermelho Tornado" />
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


              <details style={{ margin: '2rem 0', width: '100%', background: '#1a1a1a', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333' }}>
                <summary style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', cursor: 'pointer', outline: 'none', fontWeight: 'bold', fontSize: '1.1rem' }}>
                  <i className="fas fa-chevron-down" style={{ fontSize: '0.9rem', color: '#888' }}></i>
                  Opcionais
                </summary>
                <div style={{ paddingTop: '1.5rem' }}>
                  {availableOpcionais.length === 0 ? <p style={{color: '#666'}}>Nenhum opcional cadastrado.</p> : (
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
                <summary style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', cursor: 'pointer', outline: 'none', fontWeight: 'bold', fontSize: '1.1rem' }}>
                  <i className="fas fa-chevron-down" style={{ fontSize: '0.9rem', color: '#888' }}></i>
                  Rodas
                </summary>
                <div style={{ paddingTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <FormGroup style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
                    <label>Tamanho do Aro</label>
                    <CustomSelect 
                      value={aroRoda} 
                      onChange={val => setAroRoda(val)}
                      placeholder="Selecione o aro"
                      options={[14, 15, 16, 17, 18, 19, 20].map(aro => ({ label: `${aro}"`, value: String(aro) }))}
                    />
                  </FormGroup>
                  <FormGroup style={{ flex: 2, minWidth: '200px', marginBottom: 0 }}>
                    <label>Modelo da Roda</label>
                    <CustomSelect 
                      value={modeloRoda} 
                      onChange={val => {
                        setModeloRoda(val);
                        if (val !== 'Outros') setCustomRoda('');
                      }}
                      placeholder="Selecione o modelo"
                      options={[
                        ...availableRodas.map(roda => ({ label: roda.nome, value: roda.nome })),
                        { label: 'Outros (Digitar)', value: 'Outros' }
                      ]}
                    />
                  </FormGroup>
                  {modeloRoda === 'Outros' && (
                    <FormGroup style={{ width: '100%', marginTop: '1rem', marginBottom: 0 }}>
                      <label>Qual é o modelo da roda?</label>
                      <input 
                        type="text" 
                        value={customRoda} 
                        onChange={e => setCustomRoda(e.target.value)} 
                        placeholder="Ex: TSW Nurburgring" 
                      />
                    </FormGroup>
                  )}
                </div>
              </details>

              <details style={{ margin: '2rem 0', width: '100%', background: '#1a1a1a', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333' }}>
                <summary style={{ color: 'white', cursor: 'pointer', outline: 'none', fontWeight: 'bold', fontSize: '1.1rem' }}>
                  Peças Raras / Acessórios
                </summary>
                <div style={{ paddingTop: '1.5rem' }}>
                  {availablePecas.length === 0 ? <p style={{color: '#666'}}>Nenhuma peça rara cadastrada.</p> : (
                    <CheckboxGrid>
                      {availablePecas.map(peca => (
                        <label key={peca.id}>
                          <input 
                            type="checkbox" 
                            checked={selectedPecas.includes(peca.nome)}
                            onChange={() => toggleTag(peca.nome, selectedPecas, setSelectedPecas)}
                          />
                          {peca.nome}
                        </label>
                      ))}
                    </CheckboxGrid>
                  )}
                </div>
              </details>

              <details style={{ margin: '2rem 0', width: '100%', background: '#1a1a1a', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333' }}>
                <summary style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', outline: 'none', fontWeight: 'bold', fontSize: '1.1rem', color: 'white' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="fas fa-chevron-down" style={{ fontSize: '0.9rem', color: '#888' }}></i>
                    Modificações de Motor
                  </span>
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
                    <FormGroup>
                      <label>Potência Estimada (cv)</label>
                      <input 
                        type="number" 
                        value={potenciaMotor} 
                        onChange={e => setPotenciaMotor(e.target.value)} 
                        placeholder="Ex: 350" 
                        style={{ maxWidth: '200px' }}
                      />
                    </FormGroup>
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
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <i className="fas fa-chevron-down" style={{ fontSize: '0.9rem', color: '#888' }}></i>
                    Modificações de Suspensão
                  </span>
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


              <FormGroup>
                <label>Conte-nos um pouco sobre o seu projeto (Opcional)</label>
                <textarea 
                  rows={4}
                  value={form.descricao} 
                  onChange={e => setForm({...form, descricao: e.target.value})}
                  placeholder="Minha história com esse carro..."
                />
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

              <FormGroup>
                <label>Fotos do Projeto ({photos.length} de {isPremium ? 12 : 3})</label>
                <div style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1rem' }}>A primeira foto será a capa. Formatos: JPG, PNG. Max 5MB cada.</div>
                <DropZone 
                  $isDragActive={isDragActive}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <i className="fas fa-camera"></i>
                  <p>Arraste fotos aqui ou clique para selecionar</p>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                    ref={fileInputRef}
                    onChange={(e) => {
                      if (e.target.files) handleFiles(Array.from(e.target.files));
                    }}
                  />
                </DropZone>
                
                {photos.length > 0 && (
                  <PhotoGrid>
                    {photos.map((p, idx) => {
                      const url = URL.createObjectURL(p.file);
                      return (
                      <PhotoPreview key={idx}>
                        <img src={url} alt="Preview" style={{ objectPosition: p.pos.replace(',', '% ') + '%' }} />
                        <div style={{ position: 'absolute', top: 5, left: 5, display: 'flex', gap: '5px' }}>
                          <button type="button" onClick={() => {
                            setPhotos(prev => {
                              const newArr = [...prev];
                              const el = newArr.splice(idx, 1)[0];
                              newArr.unshift(el);
                              return newArr;
                            });
                          }} style={{ background: idx === 0 ? colors.primary : 'rgba(0,0,0,0.7)', border: 'none', color: 'white', padding: '5px', borderRadius: '4px', cursor: 'pointer', zIndex: 10 }}>
                            {idx === 0 ? '⭐ Capa' : 'Definir Capa'}
                          </button>
                          <button type="button" onClick={() => setCropModalData({ index: idx, url })} style={{ background: 'rgba(0,0,0,0.7)', border: 'none', color: 'white', padding: '5px', borderRadius: '4px', cursor: 'pointer', zIndex: 10 }}>
                            <i className="fas fa-crop-alt"></i> Ajustar
                          </button>
                        </div>
                        <button type="button" onClick={() => setPhotos(photos.filter((_, i) => i !== idx))}>
                          <i className="fas fa-times"></i>
                        </button>
                      </PhotoPreview>
                    )})}
                  </PhotoGrid>
                )}

                {showPremiumOffer && !isPremium && (
                  <PremiumBanner>
                    <div className="icon"><i className="fas fa-crown"></i></div>
                    <div className="content">
                      <h4>Limite de Fotos Atingido</h4>
                      <p>O plano Grátis permite apenas 3 fotos. Assine o Premium para exibir até 12 fotos da sua máquina.</p>
                    </div>
                    <button type="button" onClick={() => setStep(2)}>
                      Ver Planos
                    </button>
                  </PremiumBanner>
                )}
              </FormGroup>

              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando Garagem...' : 'Estacionar o Carro e Continuar'}
              </Button>
              
              <button 
                type="button" 
                onClick={() => setStep(2)} 
                style={{ width: '100%', background: 'transparent', color: '#999', border: 'none', marginTop: '1rem', cursor: 'pointer' }}
              >
                Pular por enquanto (Fazer isso depois)
              </button>
            </form>
          </>
        ) : (
          <>
            <Title>Escolha seu Plano 🏆</Title>
            <Subtitle>Você está quase lá! Como você deseja participar da comunidade?</Subtitle>
            
            <PlanGrid>
              <PlanCard>
                <h3>Entusiasta (Grátis)</h3>
                <div className="price">R$ 0 <span>/mês</span></div>
                <ul className="features">
                  <li><i className="fas fa-check"></i> Acesso à comunidade</li>
                  <li><i className="fas fa-check"></i> 1 Carro na Garagem</li>
                  <li><i className="fas fa-check"></i> Até 3 fotos por carro</li>
                  <li className="disabled"><i className="fas fa-times"></i> Selo Exclusivo</li>
                </ul>
                <Button onClick={handleFreePlan} style={{ background: '#333' }}>
                  Continuar Grátis
                </Button>
              </PlanCard>

              <PlanCard $isPremium>
                <PopularBadge>MAIS ESCOLHIDO</PopularBadge>
                <h3>Membro Premium</h3>
                <div className="price">R$ {premiumPrice} <span>/mês</span></div>
                <ul className="features">
                  <li><i className="fas fa-check"></i> Acesso à comunidade</li>
                  <li><i className="fas fa-check"></i> Carros ilimitados</li>
                  <li><i className="fas fa-check"></i> Até 12 fotos por carro</li>
                  <li><i className="fas fa-check"></i> Venda seus carros (Anúncios)</li>
                  <li><i className="fas fa-check"></i> Selo Exclusivo no Perfil</li>
                  <li><i className="fas fa-check"></i> Suporte Prioritário</li>
                </ul>
                <Button onClick={handlePremiumPlan}>
                  Assinar Premium
                </Button>
              </PlanCard>
            </PlanGrid>
          </>
        )}
      </FormContainer>
      {cropModalData && (
        <ImagePositionModal
          imageUrl={cropModalData.url}
          onCancel={() => setCropModalData(null)}
          onConfirm={(pos) => {
            const newPhotos = [...photos];
            newPhotos[cropModalData.index].pos = pos;
            setPhotos(newPhotos);
            setCropModalData(null);
          }}
        />
      )}
    </PageWrapper>
  );
}
