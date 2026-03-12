import React, { useState, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { Container, colors, media } from '../styles/GlobalStyles';
import listaNegra from '../data/lista-negra.json';

const ITEMS_PER_PAGE = 10;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const PageContainer = styled.div`
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  min-height: 100vh;
  padding-bottom: 4rem;
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, #1a0000 0%, #2d0000 100%);
  color: ${colors.white};
  padding: 4rem 0;
  margin-bottom: 3rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  border-bottom: 2px solid ${colors.primary};

  ${media.mobile} {
    padding: 2rem 0 1.5rem;
    margin-bottom: 2rem;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(220,38,38,0.15)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
    opacity: 0.5;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  animation: ${fadeIn} 1s ease-out;

  h1 {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    text-shadow: 0 4px 20px rgba(220, 38, 38, 0.5);

    ${media.mobile} {
      font-size: 1.8rem;
      margin-bottom: 0.5rem;
    }
  }

  p {
    font-size: 1.1rem;
    opacity: 0.85;
    max-width: 680px;
    margin: 0 auto;
    line-height: 1.6;

    ${media.mobile} {
      font-size: 0.95rem;
      padding: 0 1rem;
    }
  }
`;

const AlertBox = styled.div`
  background: rgba(220, 38, 38, 0.08);
  border: 1px solid ${colors.primary};
  border-left: 4px solid ${colors.primary};
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 3rem;
  animation: ${fadeIn} 0.8s ease-out 0.2s both;

  ${media.mobile} {
    padding: 1.25rem;
    margin-bottom: 2rem;
  }

  h2 {
    color: ${colors.primary};
    font-size: 1.4rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    ${media.mobile} {
      font-size: 1.2rem;
    }
  }

  p {
    color: ${colors.gray[300]};
    line-height: 1.7;
    margin-bottom: 1.25rem;
    font-size: 0.95rem;
  }
`;

const AlertButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  ${media.mobile} {
    flex-direction: column;
  }
`;

const SocialButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 2px solid transparent;

  &.instagram {
    background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045);
    color: ${colors.white};

    &:hover {
      opacity: 0.85;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(253, 29, 29, 0.35);
    }
  }

  &.facebook {
    background: #1877f2;
    color: ${colors.white};

    &:hover {
      background: #166fe5;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(24, 119, 242, 0.35);
    }
  }
`;

const ContactsSection = styled.section`
  animation: ${fadeIn} 0.8s ease-out 0.4s both;

  h2 {
    color: ${colors.white};
    font-size: 1.6rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    ${media.mobile} {
      font-size: 1.3rem;
    }
  }
`;

const ContactsTable = styled.div`
  background: #111;
  border: 1px solid ${colors.gray[800]};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
`;

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  background: rgba(220, 38, 38, 0.15);
  border-bottom: 1px solid ${colors.primary};
  padding: 1rem 1.5rem;

  ${media.mobile} {
    display: none;
  }

  span {
    color: ${colors.primary};
    font-weight: 700;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.75px;
  }
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid ${colors.gray[800]};
  transition: background 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: rgba(220, 38, 38, 0.05);
  }

  ${media.mobile} {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    gap: 0.2rem;
    border-left: 3px solid ${colors.primary};
  }
`;

const PhoneNumber = styled.span`
  color: ${colors.gray[200]};
  font-family: monospace;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  user-select: text;

  ${media.mobile} {
    font-size: 1rem;
    color: ${colors.white};
  }
`;

const Description = styled.span`
  color: ${colors.gray[400]};
  font-size: 0.9rem;

  ${media.mobile} {
    font-size: 0.85rem;
  }
`;

const ReportSection = styled.div`
  margin-top: 3rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid ${colors.gray[800]};
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  animation: ${fadeIn} 0.8s ease-out 0.6s both;

  ${media.mobile} {
    padding: 1.25rem;
    margin-top: 2rem;
  }

  .icon {
    font-size: 2.5rem;
    display: block;
    margin-bottom: 0.75rem;
  }

  h3 {
    color: ${colors.white};
    font-size: 1.3rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
  }

  p {
    color: ${colors.gray[400]};
    font-size: 0.95rem;
    line-height: 1.6;
    max-width: 600px;
    margin: 0 auto 1.5rem;
  }
`;

const SearchWrapper = styled.div`
  margin-bottom: 1.5rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.85rem 1.25rem;
  border: 2px solid ${colors.gray[700]};
  border-radius: 10px;
  font-size: 1rem;
  background: ${colors.gray[800]};
  color: ${colors.white};
  box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  -webkit-appearance: none;
  appearance: none;

  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.15);
  }

  &::placeholder {
    color: ${colors.gray[500]};
  }
`;

const TableInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;

  span {
    color: ${colors.gray[400]};
    font-size: 0.9rem;
  }

  strong {
    color: ${colors.primary};
  }
`;

const NoResults = styled.div`
  padding: 2.5rem;
  text-align: center;
  color: ${colors.gray[500]};
  font-size: 0.95rem;
`;

const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
`;

const PageButton = styled.button<{ $active?: boolean }>`
  min-width: 2.2rem;
  height: 2.2rem;
  padding: 0 0.6rem;
  border-radius: 8px;
  border: 2px solid ${props => props.$active ? colors.primary : colors.gray[700]};
  background: ${props => props.$active ? colors.primary : 'transparent'};
  color: ${props => props.$active ? colors.white : colors.gray[300]};
  font-size: 0.9rem;
  font-weight: ${props => props.$active ? '700' : '400'};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    border-color: ${colors.primary};
    color: ${colors.white};
    background: ${props => props.$active ? colors.primary : 'rgba(220,38,38,0.15)'};
  }

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

const ListaNegra: React.FC = () => {
  const { contatos, canaisDenuncia } = listaNegra;
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return contatos;
    return contatos.filter(c =>
      c.numero.toLowerCase().includes(q) ||
      c.descricao.toLowerCase().includes(q)
    );
  }, [searchQuery, contatos]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const pageNumbers = useMemo(() => {
    const pages: (number | '...')[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  }, [totalPages, currentPage]);

  return (
    <PageContainer>
      <HeroSection>
        <Container>
          <HeroContent>
            <h1>⚠️ Lista Negra — Fraudadores Identificados</h1>
            <p>
              Contatos denunciados por aplicar golpes com falsa venda de peças 
              nos grupos de WhatsApp da comunidade Golf MK3. Consulte antes de fechar 
              qualquer negócio online.
            </p>
          </HeroContent>
        </Container>
      </HeroSection>

      <Container>
        <AlertBox>
          <h2>🚨 Como funciona esta lista?</h2>
          <p>
            Esta lista reúne números de telefone denunciados pela própria comunidade como 
            fraudadores identificados em grupos de WhatsApp. Os golpes geralmente envolvem 
            falsa venda de peças automotivas, cobrança de valores sem entrega do produto 
            ou entrega de itens diferentes do combinado.
          </p>
          <p>
            Identifique um novo fraudador? Denuncie pelo Instagram ou Facebook do canal 
            <strong style={{ color: colors.primary }}> @falandodegti</strong> com prints e evidências.
          </p>
          <AlertButtons>
            <SocialButton
              href={canaisDenuncia.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="instagram"
            >
              <i className="fab fa-instagram" /> Denunciar no Instagram
            </SocialButton>
            <SocialButton
              href={canaisDenuncia.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="facebook"
            >
              <i className="fab fa-facebook" /> Denunciar no Facebook
            </SocialButton>
          </AlertButtons>
        </AlertBox>

        <ContactsSection>
          <h2>📋 Contatos Registrados ({contatos.length})</h2>

          <SearchWrapper>
            <SearchInput
              type="search"
              placeholder="🔍 Pesquisar por número ou descrição..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </SearchWrapper>

          <TableInfo>
            <span>
              {searchQuery
                ? <><strong>{filtered.length}</strong> resultado{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''} de <strong>{contatos.length}</strong> registros</>
                : <><strong>{contatos.length}</strong> registro{contatos.length !== 1 ? 's' : ''} no total</>
              }
            </span>
            {totalPages > 1 && (
              <span>Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong></span>
            )}
          </TableInfo>

          <ContactsTable>
            <TableHeader>
              <span>Número</span>
              <span>Descrição</span>
            </TableHeader>
            {paginated.length === 0 ? (
              <NoResults>Nenhum resultado encontrado para "{searchQuery}"</NoResults>
            ) : (
              paginated.map((contato, index) => (
                <TableRow key={index}>
                  <PhoneNumber>{contato.numero}</PhoneNumber>
                  <Description>{contato.descricao}</Description>
                </TableRow>
              ))
            )}
          </ContactsTable>

          {totalPages > 1 && (
            <PaginationWrapper>
              <PageButton
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                ‹
              </PageButton>
              {pageNumbers.map((page, i) =>
                page === '...' ? (
                  <span key={`ellipsis-${i}`} style={{ color: colors.gray[500], padding: '0 0.25rem' }}>…</span>
                ) : (
                  <PageButton
                    key={page}
                    $active={page === currentPage}
                    onClick={() => setCurrentPage(page as number)}
                  >
                    {page}
                  </PageButton>
                )
              )}
              <PageButton
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                ›
              </PageButton>
            </PaginationWrapper>
          )}
        </ContactsSection>

        <ReportSection>
          <span className="icon">📢</span>
          <h3>Conhece um fraudador não listado?</h3>
          <p>
            Ajude a comunidade! Entre em contato com o canal <strong>@falandodegti</strong> pelo 
            Instagram ou Facebook enviando prints e evidências do golpe. Após verificação, 
            o número será adicionado a esta lista.
          </p>
          <AlertButtons style={{ justifyContent: 'center' }}>
            <SocialButton
              href={canaisDenuncia.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="instagram"
            >
              <i className="fab fa-instagram" /> Instagram
            </SocialButton>
            <SocialButton
              href={canaisDenuncia.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="facebook"
            >
              <i className="fab fa-facebook" /> Facebook
            </SocialButton>
          </AlertButtons>
        </ReportSection>
      </Container>
    </PageContainer>
  );
};

export default ListaNegra;
