import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Container, colors, media } from '../styles/GlobalStyles';
import { supabase } from '../lib/supabase';
import { hexToBase64 } from '../utils/hexToBase64';

const PageWrapper = styled.div`
  background: ${colors.background};
  min-height: 100vh;
  padding: 2rem 0;
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  
  h1 {
    color: ${colors.white};
    font-size: 2.5rem;
    margin-bottom: 1rem;
    
    ${media.mobile} {
      font-size: 1.8rem;
    }
  }
  
  p {
    color: ${colors.gray[300]};
    font-size: 1.1rem;
    
    ${media.mobile} {
      font-size: 1rem;
    }
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  
  ${media.mobile} {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
`;

const ProductCard = styled.a`
  background: ${colors.surface};
  border: 1px solid ${colors.gray[800]};
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(220, 38, 38, 0.3);
    border-color: ${colors.primary};
  }
`;

const ProductImage = styled.div`
  width: 100%;
  height: 280px;
  background: ${colors.gray[900]};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProductInfo = styled.div`
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  
  h3 {
    color: ${colors.white};
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }
  
  p {
    color: ${colors.gray[400]};
    font-size: 0.95rem;
    line-height: 1.5;
    margin-bottom: 1rem;
    flex: 1;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const ProductButton = styled.div`
  background: ${colors.primary};
  color: ${colors.white};
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  text-align: center;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${colors.red[600]};
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
  }
`;

const LoadingText = styled.div`
  color: white;
  text-align: center;
  font-size: 1.2rem;
  margin-top: 2rem;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 3rem;
`;

const PageButton = styled.button`
  background: ${colors.surface};
  color: ${colors.white};
  border: 1px solid ${colors.gray[700]};
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:not(:disabled):hover {
    background: ${colors.primary};
    border-color: ${colors.primary};
  }
`;

const CategoryList = styled.div`
  display: flex;
  gap: 0.8rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 2rem;
`;

const CategoryPill = styled.button<{ $active?: boolean }>`
  background: ${props => props.$active ? colors.primary : colors.surface};
  color: ${props => props.$active ? colors.white : colors.gray[300]};
  border: 1px solid ${props => props.$active ? colors.primary : colors.gray[700]};
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.$active ? colors.primary : 'rgba(255,255,255,0.1)'};
    border-color: ${props => props.$active ? colors.primary : colors.gray[500]};
  }
`;

const ProdutosShopee: React.FC = () => {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    async function fetchCategorias() {
      const { data } = await supabase.from('pecas_categorias').select('*').eq('is_active', true).order('nome');
      if (data) setCategorias(data);
    }
    fetchCategorias();
  }, []);

  useEffect(() => {
    async function fetchProdutos() {
      setLoading(true);
      const from = (page - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      let query = supabase
        .from('pecas_produtos')
        .select(`*, pecas_categorias(nome)`, { count: 'exact' })
        .eq('is_active', true);
        
      if (selectedCategoria) {
        query = query.eq('categoria_id', selectedCategoria);
      }

      const { data, count, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (!error && data) {
        setProdutos(data);
      }
      if (count) {
        setTotalPages(Math.ceil(count / ITEMS_PER_PAGE));
      }
      setLoading(false);
    }
    fetchProdutos();
  }, [page, selectedCategoria]);

  const handleCategorySelect = (id: string | null) => {
    setSelectedCategoria(id);
    setPage(1);
  };

  return (
    <PageWrapper>
      <Container>
        <PageHeader>
          <h1>🛒 Produtos Recomendados para Você e Seu Carro</h1>
          <p>Encontre peças e acessórios de qualidade</p>
        </PageHeader>
        
        <CategoryList>
          <CategoryPill 
            $active={selectedCategoria === null} 
            onClick={() => handleCategorySelect(null)}
          >
            Todas as Peças
          </CategoryPill>
          {categorias.map(cat => (
            <CategoryPill 
              key={cat.id} 
              $active={selectedCategoria === cat.id} 
              onClick={() => handleCategorySelect(cat.id)}
            >
              {cat.nome}
            </CategoryPill>
          ))}
        </CategoryList>
        
        {loading ? (
          <LoadingText>Carregando produtos...</LoadingText>
        ) : (
          <ProductsGrid>
            {produtos.map((produto, index) => (
              <ProductCard key={index} className="product-card">
                <a href={produto.url} target="_blank" rel="noopener noreferrer" style={{textDecoration: 'none'}}>
                  <ProductImage>
                    {produto.imagens && produto.imagens.length > 0 ? (
                      <img src={produto.imagens[0]} alt={produto.nome} loading="lazy" />
                    ) : produto.imagem_blob ? (
                      <img 
                        src={`data:${produto.imagem_mime || 'image/png'};base64,${hexToBase64(produto.imagem_blob)}`} 
                        alt={produto.nome} 
                        loading="lazy"
                      />
                    ) : (
                      <div className="placeholder">Sem foto</div>
                    )}

                  </ProductImage>
                  <ProductInfo>
                    <div style={{ fontSize: '0.8rem', color: colors.primary, marginBottom: '0.3rem', fontWeight: 600 }}>
                      {produto.pecas_categorias?.nome || 'Geral'}
                    </div>
                    <h3>{produto.nome}</h3>
                    <p>{produto.descricao}</p>
                    <ProductButton>Ver na Shopee</ProductButton>
                  </ProductInfo>
                </a>
              </ProductCard>
            ))}
          </ProductsGrid>
        )}
        
        {!loading && totalPages > 1 && (
          <PaginationContainer>
            <PageButton 
              disabled={page === 1} 
              onClick={() => {
                setPage(p => Math.max(1, p - 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Anterior
            </PageButton>
            <span style={{ color: 'white', fontWeight: 600 }}>Página {page} de {totalPages}</span>
            <PageButton 
              disabled={page === totalPages} 
              onClick={() => {
                setPage(p => Math.min(totalPages, p + 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Próxima
            </PageButton>
          </PaginationContainer>
        )}
      </Container>
    </PageWrapper>
  );
};

export default ProdutosShopee;
