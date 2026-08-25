import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { colors } from '../../styles/GlobalStyles';
import { hexToBase64 } from '../../utils/hexToBase64';

const Container = styled.div`
  max-width: 1200px;
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

const Button = styled.button`
  background: ${colors.primary};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  
  &:hover {
    background: #b91c1c;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const NavLink = styled.button<{ $active?: boolean }>`
  background: ${props => props.$active ? colors.primary : 'transparent'};
  color: ${colors.white};
  border: 1px solid ${colors.primary};
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background: rgba(220, 38, 38, 0.2);
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const ProductCard = styled.div`
  background: #111;
  border: 1px solid #333;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ProductImage = styled.div`
  height: 200px;
  background: #222;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ProductContent = styled.div`
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  
  h3 {
    color: white;
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #999;
    font-size: 0.9rem;
    flex: 1;
    margin-bottom: 1rem;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const PageButton = styled.button`
  background: #222;
  color: white;
  border: 1px solid #444;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:not(:disabled):hover {
    background: #333;
  }
`;



export default function AdminProdutos() {
  const [produtos, setProdutos] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ITEMS_PER_PAGE = 12;
  
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin/login');
      }
    };
    checkSession();
  }, [navigate]);

  useEffect(() => {
    fetchProdutos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchProdutos = async () => {
    const from = (page - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    const { data, count } = await supabase
      .from('pecas_produtos')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (data) setProdutos(data);
    if (count) setTotalPages(Math.ceil(count / ITEMS_PER_PAGE));
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm('Tem certeza que deseja excluir este produto?');
    if (!confirm) return;

    try {
      await supabase.from('pecas_produtos').delete().eq('id', id);
      fetchProdutos();
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir produto');
    }
  };

  const goToNew = () => navigate('/admin/produtos/novo');
  const goToEdit = (id: string) => navigate(`/admin/produtos/${id}`);

  return (
    <Container>
      <Header>
        <Title>Painel Administrativo - Produtos</Title>
      </Header>

      <NavLinks>
        <NavLink $active>Produtos (Shopee)</NavLink>
        <NavLink onClick={() => navigate('/admin/categorias')}>Categorias</NavLink>
        <NavLink onClick={() => navigate('/admin/usuarios')}>Usuários</NavLink>
        <NavLink onClick={() => navigate('/admin/lista-negra')}>Lista Negra</NavLink>
      </NavLinks>

      <Button style={{ marginBottom: '1.5rem' }} onClick={goToNew}>+ Novo Produto</Button>

      <ProductsGrid>
        {produtos.map(p => {
          const imgSrc = p.imagens && p.imagens.length > 0 
            ? p.imagens[0] 
            : p.imagem_blob 
              ? `data:${p.imagem_mime || 'image/png'};base64,${hexToBase64(p.imagem_blob)}`
              : 'https://via.placeholder.com/400?text=Sem+Foto';

          return (
            <ProductCard key={p.id} style={{ opacity: p.is_active ? 1 : 0.5 }}>
              <ProductImage>
                <img src={imgSrc} alt={p.nome} />
              </ProductImage>
              <ProductContent>
                <h3>{p.nome}</h3>
                <p>{p.descricao}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: p.is_active ? '#4ade80' : '#f87171' }}>
                    {p.is_active ? 'Ativo' : 'Inativo'}
                  </span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Button onClick={() => handleDelete(p.id)} style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', background: 'transparent', border: '1px solid #f87171', color: '#f87171' }} title="Excluir">
                      <i className="fas fa-trash"></i>
                    </Button>
                    <Button onClick={() => goToEdit(p.id)} style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem' }}>Editar</Button>
                  </div>
                </div>
              </ProductContent>
            </ProductCard>
          );
        })}
      </ProductsGrid>

      {totalPages > 1 && (
        <PaginationContainer>
          <PageButton 
            disabled={page === 1} 
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            Anterior
          </PageButton>
          <span style={{ color: 'white' }}>Página {page} de {totalPages}</span>
          <PageButton 
            disabled={page === totalPages} 
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          >
            Próxima
          </PageButton>
        </PaginationContainer>
      )}
    </Container>
  );
}
