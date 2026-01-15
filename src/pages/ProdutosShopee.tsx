import React from 'react';
import styled from 'styled-components';
import { Container, Title, colors, media } from '../styles/GlobalStyles';
import produtosData from '../data/produtos-shopee.json';

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

const ProdutosShopee: React.FC = () => {
  return (
    <PageWrapper>
      <Container>
        <PageHeader>
          <h1>🛒 Produtos para Golf MK3</h1>
          <p>Encontre peças e acessórios de qualidade para o seu Golf MK3</p>
        </PageHeader>
        
        <ProductsGrid>
          {produtosData.map((produto) => (
            <ProductCard
              key={produto.id}
              href={produto.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ProductImage>
                <img src={produto.imagem} alt={produto.nome} />
              </ProductImage>
              <ProductInfo>
                <h3>{produto.nome}</h3>
                <p>{produto.descricao}</p>
                <ProductButton>Ver na Shopee</ProductButton>
              </ProductInfo>
            </ProductCard>
          ))}
        </ProductsGrid>
      </Container>
    </PageWrapper>
  );
};

export default ProdutosShopee;
