import React, { useState } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';
import { Card, ShareButton } from '../common';
import { CorVW } from '../../types/data';

interface CorCardProps {
    cor: CorVW;
    onPress: (cor: CorVW) => void;
    size?: 'small' | 'medium' | 'large';
}

const CardContent = styled.View`
  flex: 1;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: ${theme.spacing.sm}px;
`;

const PreviewContainer = styled.View<{ size: string }>`
  ${({ size }) => {
        switch (size) {
            case 'small':
                return `
          width: 32px;
          height: 32px;
        `;
            case 'large':
                return `
          width: 56px;
          height: 56px;
        `;
            default:
                return `
          width: 44px;
          height: 44px;
        `;
        }
    }}
  border-radius: ${theme.borderRadius.sm}px;
  margin-right: ${theme.spacing.md}px;
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const CorImage = styled(Image) <{ size: string }>`
  ${({ size }) => {
        switch (size) {
            case 'small':
                return `
          width: 30px;
          height: 30px;
        `;
            case 'large':
                return `
          width: 54px;
          height: 54px;
        `;
            default:
                return `
          width: 42px;
          height: 42px;
        `;
        }
    }}
  border-radius: ${theme.borderRadius.sm}px;
`;

const NoImageContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const NoImageText = styled(Text) <{ size: string }>`
  font-size: ${({ size }) => size === 'small' ? '8px' : '10px'};
  color: ${theme.colors.textSecondary};
  text-align: center;
  line-height: ${({ size }) => size === 'small' ? '10px' : '12px'};
`;

const InfoContainer = styled.View`
  flex: 1;
`;

const CodeContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.xs}px;
`;

const CorCode = styled(Text) <{ size: string }>`
  font-size: ${({ size }) => {
        switch (size) {
            case 'small':
                return theme.typography.body.fontSize;
            case 'large':
                return theme.typography.h2.fontSize;
            default:
                return theme.typography.h3.fontSize;
        }
    }}px;
  font-weight: ${theme.typography.h3.fontWeight};
  color: ${theme.colors.text};
`;

const CopyButton = styled(TouchableOpacity)`
  padding: ${theme.spacing.xs}px;
  border-radius: ${theme.borderRadius.sm}px;
  background-color: ${theme.colors.surface};
`;

const CorName = styled(Text) <{ size: string }>`
  font-size: ${({ size }) => {
        switch (size) {
            case 'small':
                return theme.typography.small.fontSize;
            case 'large':
                return theme.typography.body.fontSize;
            default:
                return theme.typography.body.fontSize;
        }
    }}px;
  color: ${theme.colors.textSecondary};
  margin-bottom: ${theme.spacing.xs}px;
  line-height: ${({ size }) => {
        switch (size) {
            case 'small':
                return theme.typography.small.lineHeight;
            case 'large':
                return theme.typography.body.lineHeight;
            default:
                return theme.typography.body.lineHeight;
        }
    }}px;
`;

const DetailsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const DetailItem = styled.View`
  flex-direction: row;
  align-items: center;
`;

const DetailText = styled(Text) <{ size: string }>`
  font-size: ${({ size }) => size === 'small' ? theme.typography.caption.fontSize : theme.typography.small.fontSize}px;
  color: ${theme.colors.textSecondary};
  margin-left: ${theme.spacing.xs}px;
`;

const TypeBadge = styled.View<{ tipo: string }>`
  background-color: ${({ tipo }) => {
        switch (tipo) {
            case 'metalica':
                return theme.colors.info;
            case 'perolizada':
                return theme.colors.warning;
            default:
                return theme.colors.textSecondary;
        }
    }};
  border-radius: ${theme.borderRadius.sm}px;
  padding: ${theme.spacing.xs}px ${theme.spacing.sm}px;
`;

const TypeText = styled(Text) <{ size: string }>`
  color: ${theme.colors.background};
  font-size: ${({ size }) => size === 'small' ? theme.typography.caption.fontSize : theme.typography.small.fontSize}px;
  font-weight: 600;
  text-transform: capitalize;
`;

const StatusIndicator = styled.View<{ disponivel: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${({ disponivel }) => disponivel ? theme.colors.success : theme.colors.error};
  margin-left: ${theme.spacing.xs}px;
`;

const ActionsContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: ${theme.spacing.sm}px;
  padding-top: ${theme.spacing.sm}px;
  border-top-width: 1px;
  border-top-color: ${theme.colors.borderLight};
`;

const ShareContainer = styled.View`
  margin-left: auto;
`;

export const CorCard: React.FC<CorCardProps> = ({
    cor,
    onPress,
    size = 'medium',
}) => {
    const [imageError, setImageError] = useState(false);

    const handleCopyCode = (event: any) => {
        event.stopPropagation();
        // TODO: Implementar cópia para clipboard
        console.log('Código copiado:', cor.codigo);
    };

    const getTypeIcon = (tipo: string) => {
        switch (tipo) {
            case 'metalica':
                return 'diamond-outline';
            case 'perolizada':
                return 'sparkles-outline';
            default:
                return 'ellipse-outline';
        }
    };

    return (
        <Card
            onPress={() => onPress(cor)}
            shadow="md"
            style={{
                marginBottom: theme.spacing.md,
                minHeight: size === 'large' ? 120 : size === 'small' ? 80 : 100
            }}
        >
            <CardContent>
                <Header>
                    <PreviewContainer size={size}>
                        {cor.imagem_url && !imageError ? (
                            <CorImage
                                source={{ uri: cor.imagem_url }}
                                size={size}
                                resizeMode="cover"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <NoImageContainer>
                                <Ionicons
                                    name="color-palette-outline"
                                    size={size === 'small' ? 16 : size === 'large' ? 24 : 20}
                                    color={theme.colors.textLight}
                                />
                                <NoImageText size={size}>
                                    Sem{'\n'}imagem
                                </NoImageText>
                            </NoImageContainer>
                        )}
                    </PreviewContainer>

                    <InfoContainer>
                        <CodeContainer>
                            <CorCode size={size}>{cor.codigo}</CorCode>
                            <CopyButton
                                onPress={handleCopyCode}
                                accessible={true}
                                accessibilityLabel={`Copiar código ${cor.codigo}`}
                                accessibilityRole="button"
                            >
                                <Ionicons
                                    name="copy-outline"
                                    size={16}
                                    color={theme.colors.textSecondary}
                                />
                            </CopyButton>
                        </CodeContainer>

                        <CorName size={size} numberOfLines={2}>
                            {cor.nome}
                        </CorName>
                    </InfoContainer>
                </Header>

                <DetailsContainer>
                    <DetailItem>
                        <Ionicons
                            name="calendar-outline"
                            size={14}
                            color={theme.colors.textSecondary}
                        />
                        <DetailText size={size}>{cor.ano}</DetailText>
                    </DetailItem>

                    <DetailItem>
                        <TypeBadge tipo={cor.tipo}>
                            <TypeText size={size}>{cor.tipo}</TypeText>
                        </TypeBadge>
                    </DetailItem>

                    <DetailItem>
                        <Ionicons
                            name={getTypeIcon(cor.tipo) as keyof typeof Ionicons.glyphMap}
                            size={14}
                            color={theme.colors.textSecondary}
                        />
                        <StatusIndicator disponivel={cor.disponivel} />
                    </DetailItem>
                </DetailsContainer>

                <ActionsContainer>
                    <View />
                    <ShareContainer>
                        <ShareButton
                            type="cor"
                            data={cor}
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