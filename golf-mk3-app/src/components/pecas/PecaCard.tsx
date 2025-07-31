import React from 'react';
import { Text, View } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';
import { Card, ShareButton } from '../common';
import { Peca } from '../../types/data';

interface PecaCardProps {
  peca: Peca;
  onPress: (peca: Peca) => void;
  showCategory?: boolean;
  categories?: any[];
}

const CardContent = styled.View`
  flex: 1;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.sm}px;
`;

const TitleSection = styled.View`
  flex: 1;
  margin-right: ${theme.spacing.sm}px;
`;

const Title = styled(Text)`
  font-size: ${theme.typography.h3.fontSize}px;
  font-weight: ${theme.typography.h3.fontWeight};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.xs}px;
`;

const CategoryBadge = styled.View<{ categoryColor: string }>`
  background-color: ${({ categoryColor }) => categoryColor};
  border-radius: ${theme.borderRadius.sm}px;
  padding: ${theme.spacing.xs}px ${theme.spacing.sm}px;
  align-self: flex-start;
`;

const CategoryText = styled(Text)`
  color: ${theme.colors.background};
  font-size: ${theme.typography.caption.fontSize}px;
  font-weight: 600;
  text-transform: uppercase;
`;

const ModelSection = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${theme.spacing.sm}px;
`;

const ModelLabel = styled(Text)`
  font-size: ${theme.typography.small.fontSize}px;
  color: ${theme.colors.textSecondary};
  margin-right: ${theme.spacing.xs}px;
`;

const ModelChip = styled.View`
  background-color: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.sm}px;
  padding: ${theme.spacing.xs}px ${theme.spacing.sm}px;
  margin-right: ${theme.spacing.xs}px;
`;

const ModelText = styled(Text)`
  font-size: ${theme.typography.caption.fontSize}px;
  color: ${theme.colors.text};
  font-weight: 500;
`;

const CompatibilitySection = styled.View`
  margin-bottom: ${theme.spacing.sm}px;
`;

const CompatibilityTitle = styled(Text)`
  font-size: ${theme.typography.small.fontSize}px;
  color: ${theme.colors.textSecondary};
  margin-bottom: ${theme.spacing.xs}px;
`;

const CompatibilityItem = styled.View`
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: ${theme.spacing.xs}px;
`;

const BulletPoint = styled.View`
  width: 4px;
  height: 4px;
  border-radius: 2px;
  background-color: ${theme.colors.primary};
  margin-top: 8px;
  margin-right: ${theme.spacing.sm}px;
`;

const CompatibilityText = styled(Text)`
  flex: 1;
  font-size: ${theme.typography.body.fontSize}px;
  color: ${theme.colors.text};
  line-height: ${theme.typography.body.lineHeight}px;
`;

const ObservationText = styled(Text)`
  font-size: ${theme.typography.small.fontSize}px;
  color: ${theme.colors.textSecondary};
  font-style: italic;
  margin-top: ${theme.spacing.xs}px;
`;

const PriceSection = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-top: ${theme.spacing.sm}px;
  border-top-width: 1px;
  border-top-color: ${theme.colors.borderLight};
`;

const PriceItem = styled.View`
  flex: 1;
`;

const PriceLabel = styled(Text)`
  font-size: ${theme.typography.caption.fontSize}px;
  color: ${theme.colors.textSecondary};
  margin-bottom: ${theme.spacing.xs}px;
`;

const PriceValue = styled(Text) <{ isCompatible?: boolean }>`
  font-size: ${theme.typography.body.fontSize}px;
  font-weight: 600;
  color: ${({ isCompatible }) => isCompatible ? theme.colors.success : theme.colors.text};
`;

const SavingsIndicator = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: ${theme.spacing.xs}px;
`;

const SavingsText = styled(Text)`
  font-size: ${theme.typography.small.fontSize}px;
  color: ${theme.colors.success};
  font-weight: 600;
  margin-left: ${theme.spacing.xs}px;
`;

const ActionsContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  margin-top: ${theme.spacing.sm}px;
  padding-top: ${theme.spacing.sm}px;
  border-top-width: 1px;
  border-top-color: ${theme.colors.borderLight};
`;

const ShareContainer = styled.View`
  margin-left: ${theme.spacing.sm}px;
`;

export const PecaCard: React.FC<PecaCardProps> = ({
  peca,
  onPress,
  showCategory = true,
  categories = [],
}) => {
  const category = categories.find(cat => cat.id === peca.categoria);
  const categoryColor = category?.cor || theme.colors.textSecondary;

  const calculateSavings = () => {
    if (!peca.preco_original || !peca.preco_compativel) return null;

    const original = parseFloat(peca.preco_original.replace(/[R$\s,]/g, '').replace(',', '.'));
    const compatible = parseFloat(peca.preco_compativel.replace(/[R$\s,]/g, '').replace(',', '.'));

    if (isNaN(original) || isNaN(compatible)) return null;

    const savings = original - compatible;
    const percentage = ((savings / original) * 100).toFixed(0);

    return { savings, percentage };
  };

  const savings = calculateSavings();

  return (
    <Card
      onPress={() => onPress(peca)}
      shadow="md"
      style={{ marginBottom: theme.spacing.md }}
    >
      <CardContent>
        <Header>
          <TitleSection>
            <Title>{peca.nome}</Title>
            {showCategory && category && (
              <CategoryBadge categoryColor={categoryColor}>
                <CategoryText>{category.nome}</CategoryText>
              </CategoryBadge>
            )}
          </TitleSection>
        </Header>

        <ModelSection>
          <ModelLabel>Modelos:</ModelLabel>
          {peca.modelo_golf.map((modelo, index) => (
            <ModelChip key={index}>
              <ModelText>{modelo}</ModelText>
            </ModelChip>
          ))}
        </ModelSection>

        <CompatibilitySection>
          <CompatibilityTitle>Compatível com:</CompatibilityTitle>
          {peca.compativel_com.slice(0, 2).map((comp, index) => (
            <CompatibilityItem key={index}>
              <BulletPoint />
              <View style={{ flex: 1 }}>
                <CompatibilityText>
                  {comp.veiculo} {comp.modelo}
                </CompatibilityText>
                {comp.observacoes && (
                  <ObservationText>{comp.observacoes}</ObservationText>
                )}
              </View>
            </CompatibilityItem>
          ))}
          {peca.compativel_com.length > 2 && (
            <CompatibilityItem>
              <BulletPoint />
              <CompatibilityText>
                +{peca.compativel_com.length - 2} outras opções
              </CompatibilityText>
            </CompatibilityItem>
          )}
        </CompatibilitySection>

        {peca.preco_original && peca.preco_compativel && (
          <PriceSection>
            <PriceItem>
              <PriceLabel>Original</PriceLabel>
              <PriceValue>{peca.preco_original}</PriceValue>
            </PriceItem>

            <PriceItem>
              <PriceLabel>Compatível</PriceLabel>
              <PriceValue isCompatible>{peca.preco_compativel}</PriceValue>
              {savings && (
                <SavingsIndicator>
                  <Ionicons
                    name="trending-down"
                    size={14}
                    color={theme.colors.success}
                  />
                  <SavingsText>-{savings.percentage}%</SavingsText>
                </SavingsIndicator>
              )}
            </PriceItem>
          </PriceSection>
        )}

        <ActionsContainer>
          <ShareContainer>
            <ShareButton
              type="peca"
              data={peca}
              variant="icon"
              size="small"
              showPlatformOptions={true}
            />
          </ShareContainer>
        </ActionsContainer>
      </CardContent>
    </Card>
  );
};