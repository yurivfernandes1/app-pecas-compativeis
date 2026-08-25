import React from 'react';
import styled from 'styled-components';
import { colors } from '../styles/GlobalStyles';

const PageWrapper = styled.div`
  min-height: 80vh;
  padding: 4rem 2rem;
  background: ${colors.background};
  color: ${colors.white};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${colors.primary};
  margin-bottom: 1rem;
`;

const Subtitle = styled.p`
  color: ${colors.gray[300]};
  font-size: 1.2rem;
  text-align: center;
  max-width: 600px;
`;

export default function Feed() {
  return (
    <PageWrapper>
      <Title>Sua Garagem / Comunidade</Title>
      <Subtitle>
        Em breve! Aqui você verá as atualizações da sua garagem, os projetos que você segue e as novidades da comunidade MK3.
      </Subtitle>
    </PageWrapper>
  );
}
