import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { supabase } from '../lib/supabase';
import { colors } from '../styles/GlobalStyles';
import { Link, useNavigate } from 'react-router-dom';
import { getObjectPosition } from '../utils/imagePos';
import CustomSelect from '../components/CustomSelect';
import CommunityLayout from '../components/CommunityLayout';
import SuperTrunfoCard, { exportSuperTrunfoCard } from '../components/SuperTrunfoCard';
import { calculateSuperTrunfoPoints, formatPoints } from '../utils/superTrunfo';

interface Carro {
  id: string;
  modelo: string;
  ano_fabricacao?: string;
  ano?: string;
  ano_modelo?: string;
  cor: string;
  origem?: string;
  fotos: string[];
  opcionais?: string[];
  pecas_raras?: string[];
  modificacoes_motor?: string[];
  tipo_suspensao?: string;
  marca_suspensao?: string;
  aro_roda?: string;
  tala_roda?: number;
  modelo_roda?: string;
  likesCount?: number;
  pontuacao_total?: number;
  potencia_motor?: number | string;
  placa_preta?: boolean;
  owner?: {
    username: string;
    nome_completo: string;
    avatar_url: string;
    is_premium?: boolean;
    premium_manual?: boolean;
    is_admin?: boolean;
  };
}

// ─── Styled Components ───────────────────────────────────────────────

const InnerWrapper = styled.div`
  width: 100%;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;

  h1 {
    color: white;
    font-size: 2rem;
    margin: 0 0 0.5rem 0;
    span { color: ${colors.primary}; }
  }
  p {
    color: #888;
    margin: 0;
  }
`;

const FiltersBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  margin-bottom: 2rem;
  background: #111;
  border: 1px solid #222;
  border-radius: 12px;
  padding: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  min-width: 200px;
  background: #1a1a1a;
  border: 1px solid #333;
  color: white;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  font-size: 0.95rem;

  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }
  &::placeholder {
    color: #555;
  }

  @media (max-width: 768px) {
    width: 100%;
    min-width: unset;
  }
`;

const SelectWrapper = styled.div`
  min-width: 160px;
  flex: 1;

  @media (max-width: 768px) {
    width: 100%;
    min-width: unset;
  }
`;

const SortBadge = styled.button<{ $active?: boolean }>`
  background: ${p => p.$active ? 'rgba(220,38,38,0.15)' : 'transparent'};
  border: 1px solid ${p => p.$active ? colors.primary : '#333'};
  color: ${p => p.$active ? colors.primary : '#aaa'};
  padding: 0.6rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.85rem;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover {
    border-color: ${colors.primary};
    color: ${colors.primary};
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
`;

const Card = styled.div`
  background: linear-gradient(145deg, #2a2a2a, #111);
  border: 4px solid ${colors.primary};
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  height: 100%;

  &:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 8px 24px rgba(220, 38, 38, 0.4);
  }
`;

const CardImage = styled.div`
  width: 100%;
  height: 180px;
  background: #0a0a0a;
  overflow: hidden;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }

  ${Card}:hover & img {
    transform: scale(1.05);
  }
`;

const NoPhoto = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #444;
  gap: 0.5rem;

  i { font-size: 2rem; }
  span { font-size: 0.8rem; }
`;

const LikesBadge = styled.div`
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0,0,0,0.7);
  color: white;
  border-radius: 20px;
  padding: 0.25rem 0.6rem;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;

  i { color: ${colors.primary}; }
`;

const CardBody = styled.div`
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  flex: 1;

  h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.4rem;
    color: white;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 1px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .tags {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    margin-bottom: 0.8rem;

    span {
      color: #aaa;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  }
`;

const OwnerRow = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  border-top: 1px solid #222;
  padding-top: 0.5rem;

  img {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid #444;
  }

  span {
    font-size: 0.82rem;
    color: #888;

    strong {
      color: #ccc;
    }
  }

  &:hover span strong {
    color: ${colors.primary};
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 3rem;

  button {
    background: #111;
    border: 1px solid #333;
    color: white;
    padding: 0.6rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;

    &:hover:not(:disabled) {
      border-color: ${colors.primary};
      color: ${colors.primary};
    }
    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
  }

  span {
    color: #888;
    font-size: 0.9rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  color: #555;
  padding: 4rem 1rem;
  grid-column: 1 / -1;

  i { font-size: 3rem; margin-bottom: 1rem; }
  p { margin-top: 0.5rem; }
`;

const ExportModal = styled.div`
  position: fixed;
  inset: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.78);
`;

const ExportPanel = styled.div`
  width: min(100%, 420px);
  background: #171717;
  border: 1px solid #444;
  border-radius: 12px;
  padding: 1.5rem;
  color: white;
  text-align: center;

  h2 { margin: 0 0 0.5rem; }
  p { color: #aaa; margin: 0 0 1.25rem; }
`;

const ExportActions = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;

  button {
    background: ${colors.primary};
    border: 0;
    border-radius: 6px;
    color: white;
    cursor: pointer;
    font-weight: bold;
    padding: 0.75rem 1rem;
  }

  button:last-child { background: #333; }
`;

const ExportButton = styled.button`
  background: #222;
  border: 1px solid #444;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  margin-top: 0.5rem;
  padding: 0.55rem 0.8rem;
  width: 100%;
`;

const ScorePreview = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.35rem;
  margin: 0.75rem 0;

  div {
    display: flex;
    justify-content: space-between;
    gap: 0.35rem;
    background: #222;
    border-left: 3px solid ${colors.primary};
    border-radius: 4px;
    color: #aaa;
    font-size: 0.75rem;
    padding: 0.4rem;
  }

  strong { color: white; }
  .total { grid-column: 1 / -1; background: ${colors.primary}; color: white; font-weight: bold; }
`;

const PAGE_SIZE = 12;

const modelos = [
  { value: '', label: 'Todos os modelos' },
  { value: 'GTI', label: 'GTI (2.0 8v/16v)' },
  { value: 'GLX', label: 'GLX (2.0 8v)' },
  { value: 'VR6', label: 'VR6 (2.8 12v)' },
  { value: 'GL', label: 'GL (1.8 / 2.0)' },
  { value: 'GT', label: 'GT (2.0)' },
  { value: 'CL', label: 'CL (1.8)' },
  { value: 'Highline', label: 'Highline (2.0)' },
  { value: 'TDi', label: 'TDi (Diesel)' },
  { value: 'Cabrio', label: 'Cabrio' },
  { value: 'Outro', label: 'Outro' },
];

const origens = [
  { value: '', label: 'Todas as origens' },
  { value: 'Alemanha (Wolfsburg/Zwickau)', label: '🇩🇪 Alemanha' },
  { value: 'México (Puebla)', label: '🇲🇽 México' },
  { value: 'África do Sul (Uitenhage)', label: '🇿🇦 África do Sul' },
  { value: 'Bélgica (Bruxelas)', label: '🇧🇪 Bélgica' },
  { value: 'Eslováquia (Bratislava)', label: '🇸🇰 Eslováquia' },
];

export default function GaleriaProjetos() {
  const [carros, setCarros] = useState<Carro[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);

  // Filters
  const [search, setSearch] = useState('');
  const [filterModelo, setFilterModelo] = useState('');
  const [filterOrigem, setFilterOrigem] = useState('');
  const [filterAno, setFilterAno] = useState('');
  const [sortBy, setSortBy] = useState<'likes' | 'newest' | 'points'>('newest');
  const [tags, setTags] = useState<any[]>([]);
  const [exportCarro, setExportCarro] = useState<Carro | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    supabase.from('mk3_car_tags').select('nome, tipo, pontuacao').then(({ data }) => {
      if (data) setTags(data);
    });
    setPage(0);
  }, [search, filterModelo, filterOrigem, filterAno, sortBy]);

  useEffect(() => {
    fetchCarros();
    // eslint-disable-next-line
  }, [page, sortBy, filterModelo, filterOrigem]);

  const fetchCarros = async () => {
    setLoading(true);

    let query = supabase
      .from('mk3_garagem')
      .select('id, modelo, ano_fabricacao, ano_modelo, cor, origem, fotos, user_id, created_at, pontuacao_total, opcionais, pecas_raras, modificacoes_motor, tipo_suspensao, marca_suspensao, aro_roda, tala_roda, modelo_roda, potencia_motor', { count: 'exact' })
      .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);

    if (filterModelo) query = query.eq('modelo', filterModelo);
    if (filterOrigem) query = query.eq('origem', filterOrigem);
    if (sortBy === 'newest') query = (query as any).order('created_at', { ascending: false });
    if (sortBy === 'points') query = (query as any).order('pontuacao_total', { ascending: false });

    const { data, count, error } = await query;

    if (error) {
      console.error('Erro ao buscar carros:', error);
      setLoading(false);
      return;
    }

    const carrosData = data || [];

    // Buscar usuários separadamente (sem FK configurada no Supabase)
    const userIds = Array.from(new Set(carrosData.map((c: any) => c.user_id))) as string[];
    let usersMap: Record<string, any> = {};
    if (userIds.length > 0) {
      const { data: usersData } = await supabase
        .from('mk3_users')
        .select('id, username, nome_completo, avatar_url, is_premium, premium_manual, is_admin')
        .in('id', userIds as string[]);
      (usersData || []).forEach((u: any) => { usersMap[u.id] = u; });
    }

    // Buscar likes para cada carro
    const ids = carrosData.map((c: any) => c.id);
    let likesMap: Record<string, number> = {};
    if (ids.length > 0) {
      const { data: likesData } = await supabase
        .from('mk3_likes')
        .select('item_id')
        .eq('item_type', 'car')
        .in('item_id', ids);
      (likesData || []).forEach((l: any) => {
        likesMap[l.item_id] = (likesMap[l.item_id] || 0) + 1;
      });
    }

    let enriched = carrosData.map((c: any) => ({
      ...c,
      owner: usersMap[c.user_id] || null,
      likesCount: likesMap[c.id] || 0,
    }));

    if (sortBy === 'likes') {
      enriched = enriched.sort((a: any, b: any) => b.likesCount - a.likesCount);
    }

    setCarros(enriched as Carro[]);
    setTotal(count || 0);
    setLoading(false);
  };

  // Client-side search + ano filter (applied after server query)
  const filtered = useMemo(() => {
    let list = [...carros];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.modelo.toLowerCase().includes(q) ||
        c.cor.toLowerCase().includes(q) ||
        c.owner?.username.toLowerCase().includes(q) ||
        c.owner?.nome_completo?.toLowerCase().includes(q) ||
        (c.ano_fabricacao || c.ano || '').includes(q)
      );
    }
    if (filterAno) {
      list = list.filter(c =>
        (c.ano_fabricacao || c.ano || '').startsWith(filterAno) ||
        (c.ano_modelo || '').startsWith(filterAno)
      );
    }
    return list;
  }, [carros, search, filterAno]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <CommunityLayout>
      <InnerWrapper>
      <PageHeader>
        <h1>Galeria de <span>Projetos</span></h1>
        <p>Explore os Golf MK3 mais incríveis da comunidade</p>
      </PageHeader>

      <FiltersBar>
        <SearchInput
          placeholder="🔍 Buscar por modelo, cor, dono..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <SelectWrapper>
          <CustomSelect
            options={modelos}
            value={filterModelo}
            onChange={setFilterModelo}
            placeholder="Versão/Modelo"
          />
        </SelectWrapper>

        <SelectWrapper>
          <CustomSelect
            options={origens}
            value={filterOrigem}
            onChange={setFilterOrigem}
            placeholder="Origem"
          />
        </SelectWrapper>

        <SearchInput
          placeholder="Ano (ex: 1995)"
          value={filterAno}
          onChange={e => setFilterAno(e.target.value)}
          style={{ maxWidth: '140px', minWidth: '100px' }}
        />

        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
          <SortBadge $active={sortBy === 'likes'} onClick={() => setSortBy('likes')}>
            <i className="fas fa-fire" style={{ marginRight: '0.4rem' }} />
            Mais curtidos
          </SortBadge>
          <SortBadge $active={sortBy === 'newest'} onClick={() => setSortBy('newest')}>
            <i className="fas fa-clock" style={{ marginRight: '0.4rem' }} />
            Mais recentes
          </SortBadge>
          <SortBadge $active={sortBy === 'points'} onClick={() => setSortBy('points')}>
            <i className="fas fa-trophy" style={{ marginRight: '0.4rem' }} />
            Mais pontos
          </SortBadge>
        </div>
      </FiltersBar>

      {loading ? (
        <Grid>
          {[...Array(6)].map((_, i) => (
            <Card key={i} style={{ opacity: 0.4, cursor: 'default' }}>
              <CardImage><NoPhoto><i className="fas fa-car" /><span>Carregando...</span></NoPhoto></CardImage>
              <CardBody>
                <h3>—</h3>
              </CardBody>
            </Card>
          ))}
        </Grid>
      ) : (
        <>
          <Grid>
            {filtered.length === 0 ? (
              <EmptyState>
                <i className="fas fa-car-crash" />
                <p>Nenhum projeto encontrado com esses filtros.</p>
              </EmptyState>
            ) : filtered.map(carro => (
              <Card key={carro.id} onClick={() => navigate(`/carro/${carro.id}`)}>
                <CardImage>
                  {carro.fotos && carro.fotos.length > 0
                    ? <img src={carro.fotos[0]} alt={`Golf ${carro.modelo}`} style={{ objectPosition: getObjectPosition(carro.fotos[0]) }} />
                    : <img src="https://raw.githubusercontent.com/yurivfernandes1/app-pecas-compativeis/refs/heads/main/logoMK3.png" alt="Sem foto" />
                  }
                  <LikesBadge>
                    <i className="fas fa-heart" />
                    {carro.likesCount || 0}
                  </LikesBadge>
                </CardImage>

                <CardBody>
                      <h3>
                        <span>GOLF {carro.modelo.toUpperCase() === 'GTI' ? <strong style={{ color: '#dc2626' }}>GTI</strong> : carro.modelo}</span>
                      </h3>
                      <div className="tags">
                        <span>
                          <i className="far fa-calendar-alt" /> {carro.ano_fabricacao || carro.ano}{carro.ano_modelo ? `/${carro.ano_modelo}` : ''}
                        </span>
                        <span>
                          <i className="fas fa-palette" /> {carro.cor}
                        </span>
                        {carro.origem && (
                          <span>
                            <i className="fas fa-globe" /> {carro.origem}
                          </span>
                        )}
                      </div>

                  <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {(() => {
                      const points = calculateSuperTrunfoPoints(carro, tags);
                      return (
                        <ScorePreview aria-label={`Pontuação Super Trunfo: ${formatPoints(points.total)} pontos`}>
                          <div>🏷️ Versão <strong>{formatPoints(points.versao)}</strong></div>
                          {points.placa_preta > 0 && (
                            <div style={{ color: '#fef08a' }}>⬛ Placa Preta <strong>{formatPoints(points.placa_preta)}</strong></div>
                          )}
                          <div>🏎️ Motor <strong>{formatPoints(points.motor)}</strong></div>
                          <div>🛠️ Suspensão <strong>{formatPoints(points.suspensao)}</strong></div>
                          <div>✨ Peças <strong>{formatPoints(points.pecas)}</strong></div>
                          <div>🛞 Rodas <strong>{formatPoints(points.rodas)}</strong></div>
                          <div>➕ Opcionais <strong>{formatPoints(points.opcionais)}</strong></div>
                          <div className="total">🏆 TOTAL <strong>{formatPoints(points.total)} PTS</strong></div>
                        </ScorePreview>
                      );
                    })()}
                    {carro.owner && (
                      <OwnerRow
                        to={`/u/${carro.owner.username}`}
                        onClick={e => e.stopPropagation()}
                      >
                        <img
                          src={carro.owner.avatar_url || `https://ui-avatars.com/api/?name=${carro.owner.username}&background=222222&color=dc2626`}
                          alt={carro.owner.username}
                        />
                        <span>
                          por <strong>@{carro.owner.username}</strong>
                          {carro.owner.is_admin ? (
                            <span style={{
                              marginLeft: '6px',
                              background: 'linear-gradient(135deg, #1f2937, #111827)',
                              color: '#60a5fa',
                              border: '1px solid #3b82f6',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '0.65rem',
                              fontWeight: 'bold',
                              letterSpacing: '0.5px'
                            }}>
                              ADM
                            </span>
                          ) : (carro.owner.is_premium || carro.owner.premium_manual) && (
                            <span style={{
                              marginLeft: '6px',
                              background: 'linear-gradient(135deg, #FFD700, #FDB931)',
                              color: 'black',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              fontSize: '0.65rem',
                              fontWeight: 'bold',
                              letterSpacing: '0.5px'
                            }}>
                              VIP
                            </span>
                          )}
                        </span>
                      </OwnerRow>
                    )}

                    <ExportButton
                      type="button"
                      onClick={event => {
                        event.stopPropagation();
                        setExportCarro(carro);
                      }}
                    >
                      <i className="fas fa-download" /> Exportar carta
                    </ExportButton>
                  </div>
                </CardBody>
              </Card>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Pagination>
              <button onClick={() => setPage(p => p - 1)} disabled={page === 0}>
                ← Anterior
              </button>
              <span>Página {page + 1} de {totalPages}</span>
              <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages - 1}>
                Próxima →
              </button>
            </Pagination>
          )}
        </>
      )}
      {exportCarro && (
        <ExportModal onClick={() => setExportCarro(null)}>
          <ExportPanel onClick={event => event.stopPropagation()}>
            <h2>Exportar carta</h2>
            <p>Escolha o formato para baixar a carta de {exportCarro.modelo}.</p>
            <ExportActions>
              <button type="button" onClick={() => exportSuperTrunfoCard(`gallery-${exportCarro.id}-169`, exportCarro.modelo, exportCarro.owner?.username)}>
                <i className="fab fa-instagram" /> Stories 9:16
              </button>
              <button type="button" onClick={() => exportSuperTrunfoCard(`gallery-${exportCarro.id}-45`, exportCarro.modelo, exportCarro.owner?.username)}>
                <i className="fab fa-instagram" /> Feed 4:5
              </button>
            </ExportActions>
            <button type="button" onClick={() => setExportCarro(null)} style={{ marginTop: '1rem', background: 'transparent', border: 0, color: '#999', cursor: 'pointer' }}>
              Cancelar
            </button>
            <SuperTrunfoCard id={`gallery-${exportCarro.id}-169`} carName={exportCarro.modelo} ownerUsername={exportCarro.owner?.username} photoUrl={exportCarro.fotos?.[0] || ''} ratio="9:16" points={calculateSuperTrunfoPoints(exportCarro, tags)} hp={exportCarro.potencia_motor} placaPreta={exportCarro.placa_preta} />
            <SuperTrunfoCard id={`gallery-${exportCarro.id}-45`} carName={exportCarro.modelo} ownerUsername={exportCarro.owner?.username} photoUrl={exportCarro.fotos?.[0] || ''} ratio="4:5" points={calculateSuperTrunfoPoints(exportCarro, tags)} hp={exportCarro.potencia_motor} placaPreta={exportCarro.placa_preta} />
          </ExportPanel>
        </ExportModal>
      )}
      </InnerWrapper>
    </CommunityLayout>
  );
}
