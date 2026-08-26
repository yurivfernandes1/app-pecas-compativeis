import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { supabase } from '../lib/supabase';
import { colors, media } from '../styles/GlobalStyles';
import { Link, useNavigate } from 'react-router-dom';
import CustomSelect from '../components/CustomSelect';
import CommunityLayout from '../components/CommunityLayout';

interface Carro {
  id: string;
  modelo: string;
  ano_fabricacao?: string;
  ano?: string;
  ano_modelo?: string;
  cor: string;
  origem?: string;
  fotos: string[];
  likesCount?: number;
  owner?: {
    username: string;
    nome_completo: string;
    avatar_url: string;
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
`;

const SelectWrapper = styled.div`
  min-width: 160px;
`;

const SortBadge = styled.button<{ $active?: boolean }>`
  background: ${p => p.$active ? 'rgba(220,38,38,0.15)' : 'transparent'};
  border: 1px solid ${p => p.$active ? colors.primary : '#333'};
  color: ${p => p.$active ? colors.primary : '#aaa'};
  padding: 0.5rem 1rem;
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
  background: #111;
  border: 1px solid #222;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    border-color: ${colors.primary};
    box-shadow: 0 8px 24px rgba(220, 38, 38, 0.15);
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
  padding: 1rem;
`;

const CardTitle = styled.div`
  font-weight: bold;
  color: white;
  font-size: 1rem;
  margin-bottom: 0.3rem;
`;

const CardMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.8rem;

  span {
    background: #1a1a1a;
    color: #aaa;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    font-size: 0.78rem;
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }
`;

const OwnerRow = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  border-top: 1px solid #222;
  padding-top: 0.8rem;
  margin-top: 0.5rem;

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
  const [sortBy, setSortBy] = useState<'likes' | 'newest'>('likes');

  const navigate = useNavigate();

  useEffect(() => {
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
      .select('id, modelo, ano_fabricacao, ano_modelo, cor, origem, fotos, user_id, created_at', { count: 'exact' })
      .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);

    if (filterModelo) query = query.eq('modelo', filterModelo);
    if (filterOrigem) query = query.eq('origem', filterOrigem);
    if (sortBy === 'newest') query = (query as any).order('created_at', { ascending: false });

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
        .select('id, username, nome_completo, avatar_url')
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

        <SortBadge $active={sortBy === 'likes'} onClick={() => setSortBy('likes')}>
          <i className="fas fa-fire" style={{ marginRight: '0.4rem' }} />
          Mais curtidos
        </SortBadge>
        <SortBadge $active={sortBy === 'newest'} onClick={() => setSortBy('newest')}>
          <i className="fas fa-clock" style={{ marginRight: '0.4rem' }} />
          Mais recentes
        </SortBadge>
      </FiltersBar>

      {loading ? (
        <Grid>
          {[...Array(6)].map((_, i) => (
            <Card key={i} style={{ opacity: 0.4, cursor: 'default' }}>
              <CardImage><NoPhoto><i className="fas fa-car" /><span>Carregando...</span></NoPhoto></CardImage>
              <CardBody>
                <CardTitle>—</CardTitle>
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
                    ? <img src={carro.fotos[0]} alt={`Golf ${carro.modelo}`} />
                    : <NoPhoto><i className="fas fa-camera" /><span>Sem foto</span></NoPhoto>
                  }
                  <LikesBadge>
                    <i className="fas fa-heart" />
                    {carro.likesCount || 0}
                  </LikesBadge>
                </CardImage>

                <CardBody>
                  <CardTitle>Golf {carro.modelo}</CardTitle>
                  <CardMeta>
                    <span>
                      <i className="far fa-calendar-alt" />
                      {carro.ano_fabricacao || carro.ano || '—'}{carro.ano_modelo ? `/${carro.ano_modelo}` : ''}
                    </span>
                    <span>
                      <i className="fas fa-palette" />
                      {carro.cor}
                    </span>
                    {carro.origem && (
                      <span>
                        <i className="fas fa-globe" />
                        {carro.origem.split(' ')[0]}
                      </span>
                    )}
                  </CardMeta>

                  {carro.owner && (
                    <OwnerRow
                      to={`/u/${carro.owner.username}`}
                      onClick={e => e.stopPropagation()}
                    >
                      <img
                        src={carro.owner.avatar_url || `https://ui-avatars.com/api/?name=${carro.owner.username}&background=222222&color=dc2626`}
                        alt={carro.owner.username}
                      />
                      <span>por <strong>@{carro.owner.username}</strong></span>
                    </OwnerRow>
                  )}
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
      </InnerWrapper>
    </CommunityLayout>
  );
}
