import React, { useState, useEffect, useRef, useMemo } from 'react';
import ImagePositionModal from '../components/ImagePositionModal';
import { getObjectPosition } from '../utils/imagePos';
import styled from 'styled-components';
import { supabase } from '../lib/supabase';
import { useNavigate, useParams } from 'react-router-dom';
import imageCompression from 'browser-image-compression';
import { colors, media } from '../styles/GlobalStyles';
import CustomSelect from '../components/CustomSelect';
import SuperTrunfoCard, { exportSuperTrunfoCard } from '../components/SuperTrunfoCard';
import { calculateSuperTrunfoPoints } from '../utils/superTrunfo';

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

const ExportModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 1rem;
`;

const ExportModalContent = styled.div`
  background: #1a1a1a;
  border-radius: 12px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  text-align: center;
  border: 1px solid #333;
  color: white;
  
  h2 { margin-bottom: 1rem; color: ${colors.primary}; }
  p { margin-bottom: 2rem; color: #ccc; }
  
  .btn-group {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
  }
`;

const ExportButton = styled.button`
  background: #222;
  border: 1px solid #444;
  color: white;
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;
  
  &:hover {
    background: #333;
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

const PhotoThumbnail = styled.div<{ $isCapa?: boolean }>`
  position: relative;
  width: 100%;
  padding-bottom: ${props => props.$isCapa ? '56.25%' : '100%'};
  grid-column: ${props => props.$isCapa ? '1 / -1' : 'auto'};
  border-radius: 8px;
  overflow: hidden;
  background: #222;
  border: ${props => props.$isCapa ? `2px solid ${colors.primary}` : 'none'};

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
  const [showExportModal, setShowExportModal] = useState(false);
  const [transferUsername, setTransferUsername] = useState('');
  const [transferLoading, setTransferLoading] = useState(false);
  const [calculatedPoints, setCalculatedPoints] = useState({ motor: 0, suspensao: 0, pecas: 0, opcionais: 0, rodas: 0, total: 0 });
  const [isPremium, setIsPremium] = useState(false);
  const [currentUsername, setCurrentUsername] = useState('');
  
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

  // Rodas
  const [availableRodas, setAvailableRodas] = useState<any[]>([]);
  const [aroRoda, setAroRoda] = useState('');
  const [modeloRoda, setModeloRoda] = useState('');
  const [customRoda, setCustomRoda] = useState('');
  const [talaRoda, setTalaRoda] = useState('');

  // Modificações Motor e Suspensão
  const [allTags, setAllTags] = useState<any[]>([]);
  const [availableTiposSuspensao, setAvailableTiposSuspensao] = useState<any[]>([]);
  const [availableMarcasSuspensao, setAvailableMarcasSuspensao] = useState<any[]>([]);
  const [modificacaoMotor, setModificacaoMotor] = useState(false);
  const [potenciaMotor, setPotenciaMotor] = useState('');
  const [modificacaoSuspensao, setModificacaoSuspensao] = useState(false);
  const [tipoSuspensao, setTipoSuspensao] = useState('');
  const [marcaSuspensao, setMarcaSuspensao] = useState('');
  const [placaPreta, setPlacaPreta] = useState(false);
  const [availableVersoes, setAvailableVersoes] = useState<any[]>([]);

  const tiposSuspensao = availableTiposSuspensao.map(t => t.nome);
  const marcasSuspensao = availableMarcasSuspensao.map(t => t.nome);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultModelos = [
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

  const modelos = useMemo(() => {
    if (!availableVersoes || availableVersoes.length === 0) {
      return defaultModelos;
    }
    const list = availableVersoes.map(v => {
      const match = defaultModelos.find(m => m.value.toLowerCase() === v.nome.toLowerCase());
      return {
        label: match ? match.label : v.nome,
        value: v.nome
      };
    });
    if (modelo && !list.some(m => m.value.toLowerCase() === modelo.toLowerCase())) {
      list.push({ label: modelo, value: modelo });
    }
    return list;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [availableVersoes, modelo]);

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
    const { data: profile } = await supabase.from('mk3_users').select('username, is_premium, premium_manual').eq('id', session.user.id).single();
    setIsPremium(profile?.is_premium || profile?.premium_manual || false);
    if (profile?.username) setCurrentUsername(profile.username);

    // Buscar Tags do sistema
    const { data: tags } = await supabase.from('mk3_car_tags').select('*');
    if (tags) {
      setAllTags(tags);
      setAvailableOpcionais(tags.filter(t => t.tipo === 'opcional'));
      setAvailablePecas(tags.filter(t => t.tipo === 'peca_rara'));
      setAvailableModMotor(tags.filter(t => t.tipo === 'mod_motor'));
      setAvailableRodas(tags.filter(t => t.tipo === 'roda'));
      setAvailableTiposSuspensao(tags.filter(t => t.tipo === 'tipo_suspensao').sort((a, b) => a.nome.localeCompare(b.nome)));
      setAvailableMarcasSuspensao(tags.filter(t => t.tipo === 'marca_suspensao').sort((a, b) => a.nome.localeCompare(b.nome)));
      setAvailableVersoes(tags.filter(t => t.tipo === 'versao_carro'));
    }

    // Buscar carro
    const { data: carro } = await supabase.from('mk3_garagem').select('*').eq('id', id).single();
    if (carro) {
      setModelo(carro.modelo || 'GTI');
      setPlacaPreta(carro.placa_preta || false);
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
      
      setAroRoda(carro.aro_roda || '');
      setTalaRoda(carro.tala_roda !== undefined && carro.tala_roda !== null ? carro.tala_roda.toString() : '');
      
      if (carro.modelo_roda) {
        const isCustom = !tags?.find(t => t.tipo === 'roda' && t.nome === carro.modelo_roda);
        if (isCustom) {
          setModeloRoda('Outros');
          setCustomRoda(carro.modelo_roda);
        } else {
          setModeloRoda(carro.modelo_roda);
        }
      }

      setSelectedOpcionais(carro.opcionais || []);
      setSelectedPecas(carro.pecas_raras || []);
      
      setModificacaoMotor(carro.modificacao_motor || false);
      setPotenciaMotor(carro.potencia_motor ? carro.potencia_motor.toString() : '');
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

  const handleTransfer = async () => {
    if (!transferUsername) return alert('Digite o username do novo dono.');
    
    setTransferLoading(true);
    
    // Buscar id do novo dono
    const { data: newOwner } = await supabase.from('mk3_users').select('id').eq('username', transferUsername).single();
    if (!newOwner) {
      setTransferLoading(false);
      return alert('Usuário não encontrado. Verifique se o username está correto (sem @).');
    }
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || newOwner.id === session.user.id) {
      setTransferLoading(false);
      return alert('Você não pode transferir para si mesmo!');
    }
    
    if (!window.confirm('Tem certeza? Essa ação não pode ser desfeita e o projeto sumirá da sua garagem!')) {
      setTransferLoading(false);
      return;
    }
    
    // Atualizar garagem
    const { error: carError } = await supabase.from('mk3_garagem').update({ user_id: newOwner.id }).eq('id', id);
    if (carError) {
      setTransferLoading(false);
      return alert('Erro ao transferir: ' + carError.message);
    }
    
    // Registrar historico
    await supabase.from('mk3_car_ownership').insert({
      car_id: id,
      from_user_id: session.user.id,
      to_user_id: newOwner.id
    });
    
    alert('Projeto transferido com sucesso para @' + transferUsername + '!');
    navigate('/minha-garagem');
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

    const carroUpdate: any = {
        modelo,
        ano_fabricacao: ano,
        ano_modelo: anoModelo || ano,
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
        aro_roda: aroRoda,
        tala_roda: talaRoda !== '' ? parseInt(talaRoda) : null,
        modelo_roda: modeloRoda === 'Outros' ? customRoda : modeloRoda,
        modificacao_motor: modificacaoMotor,
        potencia_motor: potenciaMotor ? parseInt(potenciaMotor) : null,
        modificacoes_motor: selectedModMotor,
        modificacao_suspensao: modificacaoSuspensao,
        tipo_suspensao: tipoSuspensao,
        marca_suspensao: marcaSuspensao,
        placa_preta: placaPreta
    };

    // Calcular pontuação total via função padrão do Super Trunfo
    const points = calculateSuperTrunfoPoints(carroUpdate, allTags);
    carroUpdate.pontuacao_total = points.total;

    let { error: updateError } = await supabase
      .from('mk3_garagem')
      .update(carroUpdate)
      .eq('id', id);

    // Se o banco ainda não tiver a coluna tala_roda, tenta salvar sem ela
    if (updateError && updateError.message && updateError.message.includes('tala_roda')) {
      const { tala_roda, ...carroUpdateSemTala } = carroUpdate;
      const retry = await supabase.from('mk3_garagem').update(carroUpdateSemTala).eq('id', id);
      updateError = retry.error;
    }

    // Se o banco ainda não tiver a coluna placa_preta, tenta salvar sem ela
    if (updateError && updateError.message && updateError.message.includes('placa_preta')) {
      const { placa_preta, ...carroUpdateSemPlaca } = carroUpdate;
      const retry = await supabase.from('mk3_garagem').update(carroUpdateSemPlaca).eq('id', id);
      updateError = retry.error;
    }

    if (updateError) {
      console.error('Erro ao atualizar carro:', updateError);
      alert(`Não foi possível salvar o carro: ${updateError.message}`);
      setSaving(false);
      return;
    }

    setCalculatedPoints(points);
    setSaving(false);
    setShowExportModal(true);
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
                  <PhotoThumbnail key={url} $isCapa={i === 0}>
                    <img src={url} alt={`Foto atual ${i}`} style={{ objectPosition: getObjectPosition(url) }} />
                    <div style={{ position: 'absolute', top: 5, left: 5, display: 'flex', gap: '5px' }}>
                      <button type="button" onClick={() => {
                        setFotosAtuais(prev => {
                          const newArr = [...prev];
                          const el = newArr.splice(i, 1)[0];
                          newArr.unshift(el);
                          return newArr;
                        });
                      }} style={{ background: i === 0 ? colors.primary : 'rgba(0,0,0,0.7)', border: 'none', color: 'white', padding: '5px', borderRadius: '4px', cursor: 'pointer', zIndex: 10 }}>
                        {i === 0 ? '⭐ Capa' : 'Definir Capa'}
                      </button>
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
                  <PhotoThumbnail key={photo.file.name + i} $isCapa={fotosAtuais.length === 0 && i === 0}>
                    <img src={url} alt={`Nova foto ${i}`} style={{ objectPosition: photo.pos.replace(',', '% ') + '%' }} />
                    <div style={{ position: 'absolute', top: 5, left: 5, display: 'flex', gap: '5px' }}>
                      <button type="button" onClick={() => {
                        setNovasFotos(prev => {
                          const newArr = [...prev];
                          const el = newArr.splice(i, 1)[0];
                          newArr.unshift(el);
                          return newArr;
                        });
                      }} style={{ background: (fotosAtuais.length === 0 && i === 0) ? colors.primary : 'rgba(0,0,0,0.7)', border: 'none', color: 'white', padding: '5px', borderRadius: '4px', cursor: 'pointer', zIndex: 10 }}>
                        {(fotosAtuais.length === 0 && i === 0) ? '⭐ Capa' : 'Definir Capa'}
                      </button>
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

          {/* FLAG PLACA PRETA */}
          <div 
            onClick={() => setPlacaPreta(!placaPreta)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '1rem 1.25rem',
              background: placaPreta ? 'linear-gradient(135deg, #18181b, #09090b)' : '#18181b',
              border: placaPreta ? '1.5px solid #d4af37' : '1px solid #27272a',
              borderRadius: '12px',
              cursor: 'pointer',
              marginBottom: '1.5rem',
              transition: 'all 0.2s ease',
              boxShadow: placaPreta ? '0 4px 20px rgba(212, 175, 55, 0.15)' : 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                background: '#000',
                color: '#fff',
                border: '1px solid #444',
                padding: '4px 10px',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontWeight: 900,
                fontSize: '0.95rem',
                letterSpacing: '1px',
                boxShadow: 'inset 0 0 5px rgba(255,255,255,0.1)'
              }}>
                ⬛ BRASIL
              </div>
              <div>
                <strong style={{ color: placaPreta ? '#fef08a' : '#fff', fontSize: '1rem', display: 'block' }}>
                  Placa Preta / Certificado de Coleção
                </strong>
                <span style={{ color: '#a1a1aa', fontSize: '0.8rem' }}>
                  Veículo com certificado de originalidade (+50 pts no Super Trunfo)
                </span>
              </div>
            </div>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              border: placaPreta ? '2px solid #d4af37' : '2px solid #52525b',
              background: placaPreta ? '#d4af37' : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000',
              fontWeight: 900,
              fontSize: '0.8rem'
            }}>
              {placaPreta && <i className="fas fa-check" />}
            </div>
          </div>

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
            <textarea rows={6} value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Minha história com esse carro..." />
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
              <FormGroup style={{ flex: 1, minWidth: '160px', marginBottom: 0 }}>
                <label>Tala (-40 a +80)</label>
                <input 
                  type="number" 
                  min="-40" 
                  max="80" 
                  value={talaRoda} 
                  onChange={e => setTalaRoda(e.target.value)} 
                  placeholder="Ex: 35" 
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

          {/* OPCIONAIS E PEÇAS RARAS */}
          <details style={{ margin: '2rem 0', width: '100%', background: '#1a1a1a', padding: '1.5rem', borderRadius: '12px', border: '1px solid #333' }}>
            <summary style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', cursor: 'pointer', outline: 'none', fontWeight: 'bold', fontSize: '1.1rem' }}>
              <i className="fas fa-chevron-down" style={{ fontSize: '0.9rem', color: '#888' }}></i>
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
            <summary style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'white', cursor: 'pointer', outline: 'none', fontWeight: 'bold', fontSize: '1.1rem' }}>
              <i className="fas fa-chevron-down" style={{ fontSize: '0.9rem', color: '#888' }}></i>
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

          <VendaBox style={{ borderLeft: '4px solid #ef4444' }}>
            <div className="header">
              <h3><i className="fas fa-exchange-alt"></i> Transferir Projeto</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-start', marginTop: '1rem' }}>
               <p style={{ color: '#ccc', fontSize: '0.9rem' }}>Vendeu o carro? Transfira o projeto para o novo dono. O projeto sairá da sua garagem e o histórico de donos ficará gravado no carro.</p>
               <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                 <input 
                   type="text" 
                   placeholder="Username do novo dono (sem @)" 
                   value={transferUsername} 
                   onChange={(e) => setTransferUsername(e.target.value)} 
                   style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid #444', background: '#222', color: 'white' }} 
                 />
                 <OutlineButton type="button" style={{ width: 'auto' }} onClick={handleTransfer} disabled={transferLoading}>
                   {transferLoading ? 'Transferindo...' : 'Transferir'}
                 </OutlineButton>
               </div>
            </div>
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
      
      {showExportModal && (
        <ExportModal>
          <ExportModalContent>
            <h2>🎉 Projeto Atualizado!</h2>
            <p>Seu Golf acabou de ganhar pontos. Compartilhe sua carta do Super Trunfo no Instagram e desafie a galera!</p>
            <div className="btn-group">
              <ExportButton type="button" onClick={() => exportSuperTrunfoCard('super-trunfo-169', modelo, currentUsername)}>
                <i className="fab fa-instagram" /> Formato Stories (9:16)
              </ExportButton>
              <ExportButton type="button" onClick={() => exportSuperTrunfoCard('super-trunfo-45', modelo, currentUsername)}>
                <i className="fab fa-instagram"></i> Baixar para Feed (4:5)
              </ExportButton>
            </div>
            <button 
              type="button"
              onClick={() => navigate('/minha-garagem')}
              style={{ background: 'transparent', color: '#888', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Voltar para minha garagem
            </button>
          </ExportModalContent>
          <SuperTrunfoCard id="super-trunfo-169" carName={modelo} ownerUsername={currentUsername} photoUrl={fotosAtuais[0] || (novasFotos[0]?.file ? `${URL.createObjectURL(novasFotos[0].file)}${novasFotos[0].pos ? `?pos=${novasFotos[0].pos}` : ''}` : '')} ratio="9:16" points={calculatedPoints} hp={potenciaMotor} placaPreta={placaPreta} />
          <SuperTrunfoCard id="super-trunfo-45" carName={modelo} ownerUsername={currentUsername} photoUrl={fotosAtuais[0] || (novasFotos[0]?.file ? `${URL.createObjectURL(novasFotos[0].file)}${novasFotos[0].pos ? `?pos=${novasFotos[0].pos}` : ''}` : '')} ratio="4:5" points={calculatedPoints} hp={potenciaMotor} placaPreta={placaPreta} />
        </ExportModal>
      )}
    </PageWrapper>
  );
}
