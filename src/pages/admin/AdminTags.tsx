import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { supabase } from '../../lib/supabase';
import { colors } from '../../styles/GlobalStyles';
import AdminTabs from '../../components/AdminTabs';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;

  @media (max-width: 768px) {
    padding: 1rem 0.75rem;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Title = styled.h2`
  color: ${colors.white};
  margin: 0;
  font-size: 1.5rem;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

const QuickActions = styled.div`
  display: flex;
  gap: 0.5rem;

  button {
    background: #222;
    color: #bbb;
    border: 1px solid #333;
    padding: 0.45rem 0.85rem;
    border-radius: 6px;
    font-size: 0.85rem;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s;

    &:hover {
      background: #2a2a2a;
      color: white;
      border-color: #444;
    }
  }
`;

const AccordionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
`;

const SectionAccordion = styled.div<{ $isOpen: boolean }>`
  background: #161616;
  border: 1px solid ${props => props.$isOpen ? '#3e3e3e' : '#262626'};
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  ${props => props.$isOpen ? 'box-shadow: 0 4px 20px rgba(0,0,0,0.35);' : ''}

  &:hover {
    border-color: ${props => props.$isOpen ? '#4e4e4e' : '#333'};
  }
`;

const AccordionHeader = styled.div<{ $isOpen: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.25rem;
  cursor: pointer;
  background: ${props => props.$isOpen ? '#1d1d1d' : '#181818'};
  user-select: none;
  gap: 0.75rem;
  transition: background 0.2s ease;

  @media (max-width: 768px) {
    padding: 0.85rem 1rem;
  }

  &:hover {
    background: #222;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;

    h3 {
      margin: 0;
      color: white;
      font-size: 1.05rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;

      i {
        color: ${colors.primary};
        font-size: 1rem;
      }
    }

    .badge-count {
      background: #262626;
      color: #aaa;
      padding: 0.2rem 0.55rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      border: 1px solid #333;
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #888;
    font-size: 0.85rem;
    
    i.chevron {
      transition: transform 0.25s ease;
      transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
      color: #aaa;
      font-size: 0.9rem;
    }
  }
`;

const AccordionContent = styled.div`
  padding: 1.25rem;
  background: #141414;
  border-top: 1px solid #222;

  @media (max-width: 768px) {
    padding: 1rem 0.75rem;
  }
`;

const FormRow = styled.form`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;

  input.name-input {
    flex: 1;
    min-width: 150px;
    padding: 0.65rem 0.9rem;
    border-radius: 8px;
    border: 1px solid #383838;
    background: #202020;
    color: white;
    font-size: 0.9rem;

    &:focus {
      outline: none;
      border-color: ${colors.primary};
      background: #242424;
    }
  }

  input.pts-input {
    width: 85px;
    padding: 0.65rem 0.5rem;
    border-radius: 8px;
    border: 1px solid #383838;
    background: #202020;
    color: white;
    text-align: center;
    font-size: 0.9rem;

    &:focus {
      outline: none;
      border-color: ${colors.primary};
      background: #242424;
    }
  }

  button.add-btn {
    background: ${colors.primary};
    color: white;
    border: none;
    padding: 0.65rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.4rem;
    font-size: 0.9rem;

    &:hover {
      background: #b91c1c;
    }
  }
`;

const TagGrid = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 0.6rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #1c1c1c;
    padding: 0.65rem 0.9rem;
    border-radius: 8px;
    color: #e0e0e0;
    border: 1px solid #282828;
    transition: background 0.15s ease, border-color 0.15s ease;

    &:hover {
      background: #232323;
      border-color: #383838;
    }

    .tag-title {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.9rem;
      word-break: break-word;
      flex: 1;
      padding-right: 0.5rem;
    }

    .tag-actions {
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .pts-badge {
      color: #f87171;
      background: rgba(220, 38, 38, 0.15);
      border: 1px solid rgba(220, 38, 38, 0.35);
      padding: 0.2rem 0.5rem;
      border-radius: 6px;
      font-size: 0.8rem;
      font-weight: bold;
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.15s;

      &:hover {
        background: rgba(220, 38, 38, 0.3);
        border-color: rgba(220, 38, 38, 0.6);
        color: white;
      }
    }

    .edit-btn {
      background: transparent;
      color: #777;
      border: none;
      cursor: pointer;
      padding: 0.35rem 0.45rem;
      border-radius: 6px;
      font-size: 0.85rem;
      transition: all 0.15s;

      &:hover {
        color: #3b82f6;
        background: rgba(59, 130, 246, 0.12);
      }
    }

    .delete-btn {
      background: transparent;
      color: #666;
      border: none;
      cursor: pointer;
      padding: 0.35rem 0.45rem;
      border-radius: 6px;
      font-size: 0.9rem;
      transition: all 0.15s;

      &:hover {
        color: #ef4444;
        background: rgba(239, 68, 68, 0.1);
      }
    }
  }
`;

export default function AdminTags() {
  const [opcionais, setOpcionais] = useState<any[]>([]);
  const [pecasRaras, setPecasRaras] = useState<any[]>([]);
  const [modMotor, setModMotor] = useState<any[]>([]);
  const [rodas, setRodas] = useState<any[]>([]);
  const [tiposSuspensao, setTiposSuspensao] = useState<any[]>([]);
  const [marcasSuspensao, setMarcasSuspensao] = useState<any[]>([]);
  const [faixasTala, setFaixasTala] = useState<any[]>([]);

  // Accordion state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    opcional: false,
    peca_rara: false,
    mod_motor: false,
    roda: false,
    faixa_tala: false,
    tipo_suspensao: false,
    marca_suspensao: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const expandAll = () => {
    setOpenSections({
      opcional: true,
      peca_rara: true,
      mod_motor: true,
      roda: true,
      faixa_tala: true,
      tipo_suspensao: true,
      marca_suspensao: true,
    });
  };

  const collapseAll = () => {
    setOpenSections({
      opcional: false,
      peca_rara: false,
      mod_motor: false,
      roda: false,
      faixa_tala: false,
      tipo_suspensao: false,
      marca_suspensao: false,
    });
  };

  const [newOpcional, setNewOpcional] = useState('');
  const [newPeca, setNewPeca] = useState('');
  const [newModMotor, setNewModMotor] = useState('');
  const [newRoda, setNewRoda] = useState('');
  const [newTipoSuspensao, setNewTipoSuspensao] = useState('');
  const [newMarcaSuspensao, setNewMarcaSuspensao] = useState('');
  
  const formatPts = (val: any): string => {
    if (val === undefined || val === null || val === '') return '0,00';
    const num = Number(val);
    if (isNaN(num)) return '0,00';
    return num.toFixed(2).replace('.', ',');
  };

  const [ptsOpcional, setPtsOpcional] = useState('10,00');
  const [ptsPeca, setPtsPeca] = useState('50,00');
  const [ptsModMotor, setPtsModMotor] = useState('30,00');
  const [ptsRoda, setPtsRoda] = useState('20,00');
  const [ptsTipoSuspensao, setPtsTipoSuspensao] = useState('20,00');
  const [ptsMarcaSuspensao, setPtsMarcaSuspensao] = useState('15,00');
  
  const [editingTag, setEditingTag] = useState<{ id: string, name: string, pts: string, tipo?: string } | null>(null);

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdmin();
    fetchTags();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/admin/login');
      return;
    }
    const { data: user } = await supabase.from('mk3_users').select('is_admin').eq('id', session.user.id).single();
    if (!user || !user.is_admin) {
      navigate('/');
    }
  };

  const fetchTags = async () => {
    setLoading(true);
    const { data } = await supabase.from('mk3_car_tags').select('*').order('nome', { ascending: true });
    if (data) {
      setOpcionais(data.filter(t => t.tipo === 'opcional'));
      setPecasRaras(data.filter(t => t.tipo === 'peca_rara'));
      setModMotor(data.filter(t => t.tipo === 'mod_motor'));
      setRodas(data.filter(t => t.tipo === 'roda'));
      setTiposSuspensao(data.filter(t => t.tipo === 'tipo_suspensao'));
      setMarcasSuspensao(data.filter(t => t.tipo === 'marca_suspensao'));
      setFaixasTala(data.filter(t => t.tipo === 'faixa_tala'));
    }
    setLoading(false);
  };

  const handleAdd = async (e: React.FormEvent, tipo: string, value: string, pontuacao: string, setter: (s: string) => void) => {
    e.preventDefault();
    if (!value.trim()) return;

    const raw = String(pontuacao).replace(',', '.').trim();
    const num = parseFloat(raw);
    if (isNaN(num)) {
      alert('Digite uma pontuação válida (ex: 10,00 ou 15,50).');
      return;
    }

    const parsedPts = Math.round(num * 100) / 100;

    const { error } = await supabase.from('mk3_car_tags').insert({ tipo, nome: value.trim(), pontuacao: parsedPts });
    if (error) {
      alert(`Aviso: ${error.message}`);
      return;
    }
    setter('');
    fetchTags();
  };

  const handleEditTag = (id: string, name: string, currentPoints: any, tipo?: string) => {
    const num = Number(currentPoints);
    const formatted = isNaN(num) ? '0,00' : num.toFixed(2).replace('.', ',');
    setEditingTag({ id, name, pts: formatted, tipo });
  };

  const saveEditedTag = async () => {
    if (editingTag) {
      if (!editingTag.name.trim()) {
        alert('O nome do item não pode ficar vazio.');
        return;
      }

      const raw = String(editingTag.pts).replace(',', '.').trim();
      const num = parseFloat(raw);
      if (isNaN(num)) {
        alert('Digite uma pontuação válida (ex: 10,00 ou 15,50).');
        return;
      }

      const parsedPts = Math.round(num * 100) / 100;

      const { error } = await supabase.from('mk3_car_tags').update({
        nome: editingTag.name.trim(),
        pontuacao: parsedPts
      }).eq('id', editingTag.id);

      if (error) {
        alert(`Erro ao salvar: ${error.message}`);
        return;
      }
      
      fetchTags();
      setEditingTag(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este item? Ele deixará de aparecer para novos carros.')) {
      await supabase.from('mk3_car_tags').delete().eq('id', id);
      fetchTags();
    }
  };

  return (
    <Container>
      <Header>
        <Title>Tags e Pontuações do Super Trunfo</Title>
        <QuickActions>
          <button type="button" onClick={expandAll}>
            <i className="fas fa-chevron-down" style={{ marginRight: '4px' }}></i> Expandir Todos
          </button>
          <button type="button" onClick={collapseAll}>
            <i className="fas fa-chevron-up" style={{ marginRight: '4px' }}></i> Recolher Todos
          </button>
        </QuickActions>
      </Header>
      <AdminTabs />
        
      {loading ? (
        <p style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>Carregando tags...</p>
      ) : (
        <AccordionList>
          {/* 1. OPCIONAIS */}
          <SectionAccordion $isOpen={openSections.opcional}>
            <AccordionHeader $isOpen={openSections.opcional} onClick={() => toggleSection('opcional')}>
              <div className="header-left">
                <h3><i className="fas fa-list-ul"></i> Opcionais</h3>
                <span className="badge-count">{opcionais.length} itens</span>
              </div>
              <div className="header-right">
                <i className="fas fa-chevron-down chevron"></i>
              </div>
            </AccordionHeader>
            {openSections.opcional && (
              <AccordionContent>
                <FormRow onSubmit={(e) => handleAdd(e, 'opcional', newOpcional, ptsOpcional, setNewOpcional)}>
                  <input 
                    className="name-input"
                    type="text" 
                    placeholder="Novo Opcional (Ex: Teto Solar)" 
                    value={newOpcional}
                    onChange={e => setNewOpcional(e.target.value)}
                  />
                  <input 
                    className="pts-input"
                    type="text" 
                    inputMode="decimal"
                    placeholder="0,00"
                    value={ptsOpcional}
                    onChange={e => setPtsOpcional(e.target.value)}
                    title="Pontuação"
                  />
                  <button className="add-btn" type="submit"><i className="fas fa-plus"></i> Adicionar</button>
                </FormRow>

                <TagGrid>
                  {opcionais.map(tag => (
                    <li key={tag.id}>
                      <span className="tag-title" style={{ cursor: 'pointer' }} onClick={() => handleEditTag(tag.id, tag.nome, tag.pontuacao, 'opcional')}>
                        {tag.nome}
                      </span>
                      <div className="tag-actions">
                        <span className="pts-badge" onClick={() => handleEditTag(tag.id, tag.nome, tag.pontuacao, 'opcional')}>
                          {formatPts(tag.pontuacao)} pts <i className="fas fa-pen" style={{ fontSize: '0.65rem' }}></i>
                        </span>
                        <button className="edit-btn" onClick={() => handleEditTag(tag.id, tag.nome, tag.pontuacao, 'opcional')} title="Editar nome e pontos">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="delete-btn" onClick={() => handleDelete(tag.id)} title="Remover">
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </li>
                  ))}
                </TagGrid>
              </AccordionContent>
            )}
          </SectionAccordion>

          {/* 2. PEÇAS RARAS */}
          <SectionAccordion $isOpen={openSections.peca_rara}>
            <AccordionHeader $isOpen={openSections.peca_rara} onClick={() => toggleSection('peca_rara')}>
              <div className="header-left">
                <h3><i className="fas fa-gem"></i> Peças Raras</h3>
                <span className="badge-count">{pecasRaras.length} itens</span>
              </div>
              <div className="header-right">
                <i className="fas fa-chevron-down chevron"></i>
              </div>
            </AccordionHeader>
            {openSections.peca_rara && (
              <AccordionContent>
                <FormRow onSubmit={(e) => handleAdd(e, 'peca_rara', newPeca, ptsPeca, setNewPeca)}>
                  <input 
                    className="name-input"
                    type="text" 
                    placeholder="Nova Peça Rara (Ex: Farol Hella Dual)" 
                    value={newPeca}
                    onChange={e => setNewPeca(e.target.value)}
                  />
                  <input 
                    className="pts-input"
                    type="text" 
                    inputMode="decimal"
                    placeholder="0,00"
                    value={ptsPeca}
                    onChange={e => setPtsPeca(e.target.value)}
                    title="Pontuação"
                  />
                  <button className="add-btn" type="submit"><i className="fas fa-plus"></i> Adicionar</button>
                </FormRow>

                <TagGrid>
                  {pecasRaras.map(tag => (
                    <li key={tag.id}>
                      <span className="tag-title" style={{ cursor: 'pointer' }} onClick={() => handleEditTag(tag.id, tag.nome, tag.pontuacao, 'peca_rara')}>
                        {tag.nome}
                      </span>
                      <div className="tag-actions">
                        <span className="pts-badge" onClick={() => handleEditTag(tag.id, tag.nome, tag.pontuacao, 'peca_rara')}>
                          {formatPts(tag.pontuacao)} pts <i className="fas fa-pen" style={{ fontSize: '0.65rem' }}></i>
                        </span>
                        <button className="edit-btn" onClick={() => handleEditTag(tag.id, tag.nome, tag.pontuacao, 'peca_rara')} title="Editar nome e pontos">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="delete-btn" onClick={() => handleDelete(tag.id)} title="Remover">
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </li>
                  ))}
                </TagGrid>
              </AccordionContent>
            )}
          </SectionAccordion>

          {/* 3. MOTOR */}
          <SectionAccordion $isOpen={openSections.mod_motor}>
            <AccordionHeader $isOpen={openSections.mod_motor} onClick={() => toggleSection('mod_motor')}>
              <div className="header-left">
                <h3><i className="fas fa-cogs"></i> Modificações de Motor</h3>
                <span className="badge-count">{modMotor.length} itens</span>
              </div>
              <div className="header-right">
                <i className="fas fa-chevron-down chevron"></i>
              </div>
            </AccordionHeader>
            {openSections.mod_motor && (
              <AccordionContent>
                <FormRow onSubmit={(e) => handleAdd(e, 'mod_motor', newModMotor, ptsModMotor, setNewModMotor)}>
                  <input 
                    className="name-input"
                    type="text" 
                    placeholder="Nova Modificação (Ex: Turbo, Aspirado)" 
                    value={newModMotor}
                    onChange={e => setNewModMotor(e.target.value)}
                  />
                  <input 
                    className="pts-input"
                    type="text" 
                    inputMode="decimal"
                    placeholder="0,00"
                    value={ptsModMotor}
                    onChange={e => setPtsModMotor(e.target.value)}
                    title="Pontuação"
                  />
                  <button className="add-btn" type="submit"><i className="fas fa-plus"></i> Adicionar</button>
                </FormRow>

                <TagGrid>
                  {modMotor.map(tag => (
                    <li key={tag.id}>
                      <span className="tag-title" style={{ cursor: 'pointer' }} onClick={() => handleEditTag(tag.id, tag.nome, tag.pontuacao, 'mod_motor')}>
                        {tag.nome}
                      </span>
                      <div className="tag-actions">
                        <span className="pts-badge" onClick={() => handleEditTag(tag.id, tag.nome, tag.pontuacao, 'mod_motor')}>
                          {formatPts(tag.pontuacao)} pts <i className="fas fa-pen" style={{ fontSize: '0.65rem' }}></i>
                        </span>
                        <button className="edit-btn" onClick={() => handleEditTag(tag.id, tag.nome, tag.pontuacao, 'mod_motor')} title="Editar nome e pontos">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="delete-btn" onClick={() => handleDelete(tag.id)} title="Remover">
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </li>
                  ))}
                </TagGrid>
              </AccordionContent>
            )}
          </SectionAccordion>

          {/* 4. RODAS - MODELOS */}
          <SectionAccordion $isOpen={openSections.roda}>
            <AccordionHeader $isOpen={openSections.roda} onClick={() => toggleSection('roda')}>
              <div className="header-left">
                <h3><i className="fas fa-circle-notch"></i> Modelos de Rodas</h3>
                <span className="badge-count">{rodas.length} itens</span>
              </div>
              <div className="header-right">
                <i className="fas fa-chevron-down chevron"></i>
              </div>
            </AccordionHeader>
            {openSections.roda && (
              <AccordionContent>
                <FormRow onSubmit={(e) => handleAdd(e, 'roda', newRoda, ptsRoda, setNewRoda)}>
                  <input 
                    className="name-input"
                    type="text" 
                    placeholder="Novo Modelo (Ex: BBS RS, Borbet)" 
                    value={newRoda}
                    onChange={e => setNewRoda(e.target.value)}
                  />
                  <input 
                    className="pts-input"
                    type="text" 
                    inputMode="decimal"
                    placeholder="0,00"
                    value={ptsRoda}
                    onChange={e => setPtsRoda(e.target.value)}
                    title="Pontuação"
                  />
                  <button className="add-btn" type="submit"><i className="fas fa-plus"></i> Adicionar</button>
                </FormRow>

                <TagGrid>
                  {rodas.map(tag => (
                    <li key={tag.id}>
                      <span className="tag-title" style={{ cursor: 'pointer' }} onClick={() => handleEditTag(tag.id, tag.nome, tag.pontuacao, 'roda')}>
                        {tag.nome}
                      </span>
                      <div className="tag-actions">
                        <span className="pts-badge" onClick={() => handleEditTag(tag.id, tag.nome, tag.pontuacao, 'roda')}>
                          {formatPts(tag.pontuacao)} pts <i className="fas fa-pen" style={{ fontSize: '0.65rem' }}></i>
                        </span>
                        <button className="edit-btn" onClick={() => handleEditTag(tag.id, tag.nome, tag.pontuacao, 'roda')} title="Editar nome e pontos">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="delete-btn" onClick={() => handleDelete(tag.id)} title="Remover">
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </li>
                  ))}
                </TagGrid>
              </AccordionContent>
            )}
          </SectionAccordion>

          {/* 5. RODAS - TALAS (-40 a +80) */}
          <SectionAccordion $isOpen={openSections.faixa_tala}>
            <AccordionHeader $isOpen={openSections.faixa_tala} onClick={() => toggleSection('faixa_tala')}>
              <div className="header-left">
                <h3><i className="fas fa-ruler-horizontal"></i> Pontuação por Tala das Rodas (-40 a +80)</h3>
                <span className="badge-count">{faixasTala.length} faixas</span>
              </div>
              <div className="header-right">
                <i className="fas fa-chevron-down chevron"></i>
              </div>
            </AccordionHeader>
            {openSections.faixa_tala && (
              <AccordionContent>
                <p style={{ color: '#888', fontSize: '0.85rem', margin: '0 0 1rem 0' }}>
                  Faixas de 10 em 10. Toque no item ou botão para alterar o nome da faixa ou a pontuação.
                </p>

                <TagGrid>
                  {faixasTala.map(tag => (
                    <li key={tag.id}>
                      <span className="tag-title" style={{ cursor: 'pointer' }} onClick={() => handleEditTag(tag.id, tag.nome, tag.pontuacao, 'faixa_tala')}>
                        Tala <strong>{tag.nome}</strong>
                      </span>
                      <div className="tag-actions">
                        <span className="pts-badge" onClick={() => handleEditTag(tag.id, tag.nome, tag.pontuacao, 'faixa_tala')}>
                          {formatPts(tag.pontuacao)} pts <i className="fas fa-pen" style={{ fontSize: '0.65rem' }}></i>
                        </span>
                        <button className="edit-btn" onClick={() => handleEditTag(tag.id, tag.nome, tag.pontuacao, 'faixa_tala')} title="Editar nome e pontos">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="delete-btn" onClick={() => handleDelete(tag.id)} title="Remover">
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </li>
                  ))}
                </TagGrid>
              </AccordionContent>
            )}
          </SectionAccordion>

          {/* 6. SUSPENSÃO - TIPOS */}
          <SectionAccordion $isOpen={openSections.tipo_suspensao}>
            <AccordionHeader $isOpen={openSections.tipo_suspensao} onClick={() => toggleSection('tipo_suspensao')}>
              <div className="header-left">
                <h3><i className="fas fa-wrench"></i> Suspensão (Tipos)</h3>
                <span className="badge-count">{tiposSuspensao.length} itens</span>
              </div>
              <div className="header-right">
                <i className="fas fa-chevron-down chevron"></i>
              </div>
            </AccordionHeader>
            {openSections.tipo_suspensao && (
              <AccordionContent>
                <FormRow onSubmit={(e) => handleAdd(e, 'tipo_suspensao', newTipoSuspensao, ptsTipoSuspensao, setNewTipoSuspensao)}>
                  <input 
                    className="name-input"
                    type="text" 
                    placeholder="Novo Tipo (Ex: suspensão a ar)" 
                    value={newTipoSuspensao}
                    onChange={e => setNewTipoSuspensao(e.target.value)}
                  />
                  <input 
                    className="pts-input"
                    type="text" 
                    inputMode="decimal"
                    placeholder="0,00"
                    value={ptsTipoSuspensao}
                    onChange={e => setPtsTipoSuspensao(e.target.value)}
                    title="Pontuação"
                  />
                  <button className="add-btn" type="submit"><i className="fas fa-plus"></i> Adicionar</button>
                </FormRow>

                <TagGrid>
                  {tiposSuspensao.map(tag => (
                    <li key={tag.id}>
                      <span className="tag-title" style={{ cursor: 'pointer' }} onClick={() => handleEditTag(tag.id, tag.nome, tag.pontuacao, 'tipo_suspensao')}>
                        {tag.nome}
                      </span>
                      <div className="tag-actions">
                        <span className="pts-badge" onClick={() => handleEditTag(tag.id, tag.nome, tag.pontuacao, 'tipo_suspensao')}>
                          {formatPts(tag.pontuacao)} pts <i className="fas fa-pen" style={{ fontSize: '0.65rem' }}></i>
                        </span>
                        <button className="edit-btn" onClick={() => handleEditTag(tag.id, tag.nome, tag.pontuacao, 'tipo_suspensao')} title="Editar nome e pontos">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="delete-btn" onClick={() => handleDelete(tag.id)} title="Remover">
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </li>
                  ))}
                </TagGrid>
              </AccordionContent>
            )}
          </SectionAccordion>

          {/* 7. SUSPENSÃO - MARCAS */}
          <SectionAccordion $isOpen={openSections.marca_suspensao}>
            <AccordionHeader $isOpen={openSections.marca_suspensao} onClick={() => toggleSection('marca_suspensao')}>
              <div className="header-left">
                <h3><i className="fas fa-tags"></i> Suspensão (Marcas)</h3>
                <span className="badge-count">{marcasSuspensao.length} itens</span>
              </div>
              <div className="header-right">
                <i className="fas fa-chevron-down chevron"></i>
              </div>
            </AccordionHeader>
            {openSections.marca_suspensao && (
              <AccordionContent>
                <FormRow onSubmit={(e) => handleAdd(e, 'marca_suspensao', newMarcaSuspensao, ptsMarcaSuspensao, setNewMarcaSuspensao)}>
                  <input 
                    className="name-input"
                    type="text" 
                    placeholder="Nova Marca (Ex: Castor, Tebão, HKI)" 
                    value={newMarcaSuspensao}
                    onChange={e => setNewMarcaSuspensao(e.target.value)}
                  />
                  <input 
                    className="pts-input"
                    type="text" 
                    inputMode="decimal"
                    placeholder="0,00"
                    value={ptsMarcaSuspensao}
                    onChange={e => setPtsMarcaSuspensao(e.target.value)}
                    title="Pontuação"
                  />
                  <button className="add-btn" type="submit"><i className="fas fa-plus"></i> Adicionar</button>
                </FormRow>

                <TagGrid>
                  {marcasSuspensao.map(tag => (
                    <li key={tag.id}>
                      <span className="tag-title" style={{ cursor: 'pointer' }} onClick={() => handleEditTag(tag.id, tag.nome, tag.pontuacao, 'marca_suspensao')}>
                        {tag.nome}
                      </span>
                      <div className="tag-actions">
                        <span className="pts-badge" onClick={() => handleEditTag(tag.id, tag.nome, tag.pontuacao, 'marca_suspensao')}>
                          {formatPts(tag.pontuacao)} pts <i className="fas fa-pen" style={{ fontSize: '0.65rem' }}></i>
                        </span>
                        <button className="edit-btn" onClick={() => handleEditTag(tag.id, tag.nome, tag.pontuacao, 'marca_suspensao')} title="Editar nome e pontos">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="delete-btn" onClick={() => handleDelete(tag.id)} title="Remover">
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </li>
                  ))}
                </TagGrid>
              </AccordionContent>
            )}
          </SectionAccordion>
        </AccordionList>
      )}

      {editingTag && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: '#1c1c1c', padding: '1.75rem', borderRadius: '14px', border: '1px solid #383838', width: '100%', maxWidth: '440px', boxShadow: '0 10px 30px rgba(0,0,0,0.7)' }}>
            <h3 style={{ color: 'white', marginTop: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className="fas fa-edit" style={{ color: colors.primary }}></i> Editar Item
            </h3>
            
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>Nome do Item</label>
              <input 
                type="text" 
                value={editingTag.name} 
                onChange={e => setEditingTag({ ...editingTag, name: e.target.value })}
                style={{ width: '100%', padding: '0.75rem 1rem', background: '#252525', border: '1px solid #444', color: 'white', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box' }}
                autoFocus
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: '0.85rem', marginBottom: '0.4rem', fontWeight: 600 }}>Pontos no Super Trunfo (ex: 10,00 ou 12,50)</label>
              <input 
                type="text" 
                inputMode="decimal"
                value={editingTag.pts} 
                onChange={e => setEditingTag({ ...editingTag, pts: e.target.value })}
                placeholder="0,00"
                style={{ width: '100%', padding: '0.75rem 1rem', background: '#252525', border: '1px solid #444', color: 'white', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setEditingTag(null)} style={{ flex: 1, padding: '0.75rem', background: '#2e2e2e', color: '#ccc', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                Cancelar
              </button>
              <button onClick={saveEditedTag} style={{ flex: 1, padding: '0.75rem', background: colors.primary, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

    </Container>
  );
}
