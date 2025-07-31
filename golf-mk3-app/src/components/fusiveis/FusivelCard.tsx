import React from 'react';
import { Text, View } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';
import { Card } from '../common';
import { Fusivel } from '../../types/data';

interface FusivelCardProps {
    fusivel: Fusivel;
    onPress?: (fusivel: Fusivel) => void;
    showLocation?: boolean;
}

const CardContent = styled.View`
  flex: 1;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.sm}px;
`;

const LeftSection = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

const PositionBadge = styled.View<{ tipo: string }>`
  background-color: ${({ tipo }) => tipo === 'fusivel' ? theme.colors.primary : theme.colors.info};
  border-radius: ${theme.borderRadius.sm}px;
  padding: ${theme.spacing.xs}px ${theme.spacing.sm}px;
  margin-right: ${theme.spacing.md}px;
  min-width: 40px;
  align-items: center;
`;

const PositionText = styled(Text)`
  color: ${theme.colors.background};
  font-size: ${theme.typography.body.fontSize}px;
  font-weight: 700;
`;

const AmperagemContainer = styled.View`
  flex: 1;
`;

const AmperagemText = styled(Text)`
  font-size: ${theme.typography.h3.fontSize}px;
  font-weight: ${theme.typography.h3.fontWeight};
  color: ${theme.colors.text};
`;

const AmperagemLabel = styled(Text)`
  font-size: ${theme.typography.small.fontSize}px;
  color: ${theme.colors.textSecondary};
  margin-top: ${theme.spacing.xs}px;
`;

const TypeIcon = styled.View`
  align-items: center;
  justify-content: center;
`;

const FuncaoContainer = styled.View`
  margin-bottom: ${theme.spacing.sm}px;
`;

const FuncaoText = styled(Text)`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${theme.colors.text};
  line-height: ${theme.typography.body.lineHeight}px;
`;

const LocationContainer = styled.View`
  flex-direction: row;
  align-items: center;
  padding-top: ${theme.spacing.sm}px;
  border-top-width: 1px;
  border-top-color: ${theme.colors.borderLight};
`;

const LocationText = styled(Text)`
  font-size: ${theme.typography.small.fontSize}px;
  color: ${theme.colors.textSecondary};
  margin-left: ${theme.spacing.sm}px;
`;

const StatusIndicator = styled.View<{ hasCoordinates: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${({ hasCoordinates }) =>
        hasCoordinates ? theme.colors.success : theme.colors.warning
    };
  margin-left: ${theme.spacing.sm}px;
`;

export const FusivelCard: React.FC<FusivelCardProps> = ({
    fusivel,
    onPress,
    showLocation = true,
}) => {
    const getTypeIcon = (tipo: string) => {
        return tipo === 'fusivel' ? 'flash-outline' : 'settings-outline';
    };

    const getLocationLabel = (localizacao: string) => {
        return localizacao === 'caixa_principal' ? 'Caixa Principal' : 'Caixa de Relés';
    };

    const handlePress = () => {
        if (onPress) {
            onPress(fusivel);
        }
    };

    return (
        <Card
            onPress={onPress ? handlePress : undefined}
            shadow="sm"
            style={{ marginBottom: theme.spacing.sm }}
        >
            <CardContent>
                <Header>
                    <LeftSection>
                        <PositionBadge tipo={fusivel.tipo}>
                            <PositionText>{fusivel.posicao}</PositionText>
                        </PositionBadge>

                        <AmperagemContainer>
                            <AmperagemText>{fusivel.amperagem}</AmperagemText>
                            <AmperagemLabel>Amperagem</AmperagemLabel>
                        </AmperagemContainer>
                    </LeftSection>

                    <TypeIcon>
                        <Ionicons
                            name={getTypeIcon(fusivel.tipo) as keyof typeof Ionicons.glyphMap}
                            size={24}
                            color={fusivel.tipo === 'fusivel' ? theme.colors.primary : theme.colors.info}
                        />
                    </TypeIcon>
                </Header>

                <FuncaoContainer>
                    <FuncaoText>{fusivel.funcao}</FuncaoText>
                </FuncaoContainer>

                {showLocation && (
                    <LocationContainer>
                        <Ionicons
                            name="location-outline"
                            size={16}
                            color={theme.colors.textSecondary}
                        />
                        <LocationText>
                            {getLocationLabel(fusivel.localizacao)}
                        </LocationText>

                        <StatusIndicator
                            hasCoordinates={!!fusivel.coordenadas}
                            accessible={true}
                            accessibilityLabel={
                                fusivel.coordenadas
                                    ? "Localização disponível no mapa"
                                    : "Localização não mapeada"
                            }
                        />
                    </LocationContainer>
                )}
            </CardContent>
        </Card>
    );
};