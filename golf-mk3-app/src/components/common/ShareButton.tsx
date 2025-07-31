import React, { useState } from 'react';
import { TouchableOpacity, Text, Modal, View, Alert } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';
import { Button } from './Button';
import ShareService from '../../services/ShareService';
import { Peca, CorVW, Fusivel } from '../../types/data';

interface ShareButtonProps {
    type: 'peca' | 'cor' | 'fusivel' | 'app';
    data?: Peca | CorVW | Fusivel;
    customMessage?: string;
    variant?: 'icon' | 'button' | 'text';
    size?: 'small' | 'medium' | 'large';
    showPlatformOptions?: boolean;
    onShareComplete?: (success: boolean, platform?: string) => void;
}

const IconButton = styled(TouchableOpacity) <{ size: string }>`
  padding: ${({ size }) => {
        switch (size) {
            case 'small': return theme.spacing.xs;
            case 'large': return theme.spacing.md;
            default: return theme.spacing.sm;
        }
    }}px;
  border-radius: ${theme.borderRadius.full}px;
  background-color: ${theme.colors.surface};
  align-items: center;
  justify-content: center;
`;

const TextButton = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  padding: ${theme.spacing.sm}px;
`;

const ShareText = styled(Text)`
  color: ${theme.colors.primary};
  font-size: ${theme.typography.body.fontSize}px;
  font-weight: 500;
  margin-left: ${theme.spacing.xs}px;
`;

const ModalContainer = styled(Modal)``;

const ModalBackdrop = styled.View`
  flex: 1;
  background-color: ${theme.colors.backdrop};
  justify-content: flex-end;
`;

const ModalContent = styled.View`
  background-color: ${theme.colors.background};
  border-top-left-radius: ${theme.borderRadius.xl}px;
  border-top-right-radius: ${theme.borderRadius.xl}px;
  padding: ${theme.spacing.lg}px;
  max-height: 60%;
`;

const ModalHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.lg}px;
  padding-bottom: ${theme.spacing.md}px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.border};
`;

const ModalTitle = styled(Text)`
  font-size: ${theme.typography.h2.fontSize}px;
  font-weight: ${theme.typography.h2.fontWeight};
  color: ${theme.colors.text};
`;

const CloseButton = styled(TouchableOpacity)`
  padding: ${theme.spacing.sm}px;
  border-radius: ${theme.borderRadius.full}px;
`;

const PlatformGrid = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.lg}px;
`;

const PlatformButton = styled(TouchableOpacity)`
  width: 48%;
  flex-direction: row;
  align-items: center;
  padding: ${theme.spacing.md}px;
  margin-bottom: ${theme.spacing.sm}px;
  background-color: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.md}px;
  border: 1px solid ${theme.colors.border};
`;

const PlatformIcon = styled.View`
  width: 32px;
  height: 32px;
  border-radius: 16px;
  background-color: ${theme.colors.background};
  align-items: center;
  justify-content: center;
  margin-right: ${theme.spacing.sm}px;
`;

const PlatformName = styled(Text)`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${theme.colors.text};
  font-weight: 500;
`;

const GeneralShareSection = styled.View`
  border-top-width: 1px;
  border-top-color: ${theme.colors.border};
  padding-top: ${theme.spacing.lg}px;
`;

export const ShareButton: React.FC<ShareButtonProps> = ({
    type,
    data,
    customMessage,
    variant = 'icon',
    size = 'medium',
    showPlatformOptions = false,
    onShareComplete,
}) => {
    const [showModal, setShowModal] = useState(false);
    const [availablePlatforms, setAvailablePlatforms] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const shareService = ShareService.getInstance();

    const platforms = [
        { id: 'whatsapp', name: 'WhatsApp', icon: 'logo-whatsapp', color: '#25D366' },
        { id: 'telegram', name: 'Telegram', icon: 'paper-plane', color: '#0088CC' },
        { id: 'instagram', name: 'Instagram', icon: 'logo-instagram', color: '#E4405F' },
        { id: 'facebook', name: 'Facebook', icon: 'logo-facebook', color: '#1877F2' },
    ];

    const getIconName = () => {
        switch (type) {
            case 'peca': return 'car-outline';
            case 'cor': return 'color-palette-outline';
            case 'fusivel': return 'flash-outline';
            default: return 'share-outline';
        }
    };

    const getIconSize = () => {
        switch (size) {
            case 'small': return 16;
            case 'large': return 28;
            default: return 20;
        }
    };

    const handlePress = async () => {
        if (showPlatformOptions) {
            // Carregar plataformas disponíveis
            setLoading(true);
            const platforms = await shareService.getAvailablePlatforms();
            setAvailablePlatforms(platforms);
            setLoading(false);
            setShowModal(true);
        } else {
            // Compartilhamento direto
            await handleDirectShare();
        }
    };

    const handleDirectShare = async () => {
        try {
            setLoading(true);
            let success = false;

            switch (type) {
                case 'peca':
                    success = await shareService.sharePeca(data as Peca, customMessage);
                    break;
                case 'cor':
                    success = await shareService.shareCor(data as CorVW, customMessage);
                    break;
                case 'fusivel':
                    success = await shareService.shareFusivel(data as Fusivel, customMessage);
                    break;
                case 'app':
                    success = await shareService.shareApp(customMessage);
                    break;
            }

            if (success) {
                Alert.alert('Sucesso!', 'Conteúdo compartilhado com sucesso!');
            }

            onShareComplete?.(success);
        } catch (error) {
            console.error('Erro ao compartilhar:', error);
            Alert.alert('Erro', 'Não foi possível compartilhar o conteúdo.');
            onShareComplete?.(false);
        } finally {
            setLoading(false);
        }
    };

    const handlePlatformShare = async (platform: string) => {
        try {
            setLoading(true);
            setShowModal(false);

            const success = await shareService.shareToSpecificPlatform(platform as any, {
                type,
                data,
                customMessage
            });

            if (success) {
                Alert.alert('Sucesso!', `Compartilhado no ${platform} com sucesso!`);
            }

            onShareComplete?.(success, platform);
        } catch (error) {
            console.error(`Erro ao compartilhar no ${platform}:`, error);
            Alert.alert('Erro', `Não foi possível compartilhar no ${platform}.`);
            onShareComplete?.(false, platform);
        } finally {
            setLoading(false);
        }
    };

    const handleGeneralShare = async () => {
        setShowModal(false);
        await handleDirectShare();
    };

    const renderButton = () => {
        switch (variant) {
            case 'button':
                return (
                    <Button
                        title="Compartilhar"
                        onPress={handlePress}
                        variant="outline"
                        size={size}
                        loading={loading}
                        icon={
                            <Ionicons
                                name="share-outline"
                                size={16}
                                color={theme.colors.primary}
                            />
                        }
                    />
                );

            case 'text':
                return (
                    <TextButton
                        onPress={handlePress}
                        disabled={loading}
                        accessible={true}
                        accessibilityLabel="Compartilhar"
                        accessibilityRole="button"
                    >
                        <Ionicons
                            name="share-outline"
                            size={16}
                            color={theme.colors.primary}
                        />
                        <ShareText>Compartilhar</ShareText>
                    </TextButton>
                );

            default:
                return (
                    <IconButton
                        size={size}
                        onPress={handlePress}
                        disabled={loading}
                        accessible={true}
                        accessibilityLabel="Compartilhar"
                        accessibilityRole="button"
                    >
                        <Ionicons
                            name={getIconName() as keyof typeof Ionicons.glyphMap}
                            size={getIconSize()}
                            color={theme.colors.textSecondary}
                        />
                    </IconButton>
                );
        }
    };

    return (
        <>
            {renderButton()}

            <ModalContainer
                visible={showModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowModal(false)}
            >
                <ModalBackdrop>
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        activeOpacity={1}
                        onPress={() => setShowModal(false)}
                    />

                    <ModalContent>
                        <ModalHeader>
                            <ModalTitle>Compartilhar</ModalTitle>
                            <CloseButton
                                onPress={() => setShowModal(false)}
                                accessible={true}
                                accessibilityLabel="Fechar"
                                accessibilityRole="button"
                            >
                                <Ionicons
                                    name="close"
                                    size={24}
                                    color={theme.colors.textSecondary}
                                />
                            </CloseButton>
                        </ModalHeader>

                        <PlatformGrid>
                            {platforms
                                .filter(platform => availablePlatforms.includes(platform.id))
                                .map((platform) => (
                                    <PlatformButton
                                        key={platform.id}
                                        onPress={() => handlePlatformShare(platform.id)}
                                        accessible={true}
                                        accessibilityLabel={`Compartilhar no ${platform.name}`}
                                        accessibilityRole="button"
                                    >
                                        <PlatformIcon>
                                            <Ionicons
                                                name={platform.icon as keyof typeof Ionicons.glyphMap}
                                                size={20}
                                                color={platform.color}
                                            />
                                        </PlatformIcon>
                                        <PlatformName>{platform.name}</PlatformName>
                                    </PlatformButton>
                                ))}
                        </PlatformGrid>

                        <GeneralShareSection>
                            <Button
                                title="Mais opções"
                                onPress={handleGeneralShare}
                                variant="outline"
                                fullWidth
                                icon={
                                    <Ionicons
                                        name="share-outline"
                                        size={16}
                                        color={theme.colors.primary}
                                    />
                                }
                            />
                        </GeneralShareSection>
                    </ModalContent>
                </ModalBackdrop>
            </ModalContainer>
        </>
    );
};