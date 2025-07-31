import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';
import { Button } from './Button';
import { Watermark } from './Watermark';
import ProtectionService from '../../services/ProtectionService';

interface ProtectionOverlayProps {
    children: React.ReactNode;
    enableScreenshotProtection?: boolean;
    enableRecordingProtection?: boolean;
    enableWatermark?: boolean;
    watermarkPosition?: 'center' | 'bottom' | 'top' | 'top-right' | 'bottom-left';
    onViolationDetected?: (type: 'screenshot' | 'recording') => void;
}

const Container = styled.View`
  flex: 1;
  position: relative;
`;

const ProtectionScreen = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${theme.colors.background};
  justify-content: center;
  align-items: center;
  z-index: 2000;
  padding: ${theme.spacing.xl}px;
`;

const ProtectionIcon = styled.View`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: ${theme.colors.error};
  justify-content: center;
  align-items: center;
  margin-bottom: ${theme.spacing.lg}px;
`;

const ProtectionTitle = styled(Text)`
  font-size: ${theme.typography.h1.fontSize}px;
  font-weight: ${theme.typography.h1.fontWeight};
  color: ${theme.colors.text};
  text-align: center;
  margin-bottom: ${theme.spacing.md}px;
`;

const ProtectionMessage = styled(Text)`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${theme.colors.textSecondary};
  text-align: center;
  line-height: ${theme.typography.body.lineHeight}px;
  margin-bottom: ${theme.spacing.xl}px;
`;

const ProtectionActions = styled.View`
  width: 100%;
  gap: ${theme.spacing.md}px;
`;

const CopyrightToastContainer = styled.View<{ visible: boolean }>`
  position: absolute;
  bottom: 100px;
  left: ${theme.spacing.md}px;
  right: ${theme.spacing.md}px;
  background-color: ${theme.colors.text};
  border-radius: ${theme.borderRadius.md}px;
  padding: ${theme.spacing.md}px;
  opacity: ${({ visible }) => visible ? 0.9 : 0};
  z-index: 1500;
`;

const ToastText = styled(Text)`
  color: ${theme.colors.background};
  font-size: ${theme.typography.small.fontSize}px;
  text-align: center;
  font-weight: 500;
`;

export const ProtectionOverlay: React.FC<ProtectionOverlayProps> = ({
    children,
    enableScreenshotProtection = true,
    enableRecordingProtection = true,
    enableWatermark = true,
    watermarkPosition = 'center',
    onViolationDetected,
}) => {
    const [showProtectionScreen, setShowProtectionScreen] = useState(false);
    const [protectionReason, setProtectionReason] = useState<'screenshot' | 'recording' | null>(null);
    const [showCopyrightToast, setShowCopyrightToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const protectionService = ProtectionService.getInstance();

    useEffect(() => {
        let screenshotListener: any;
        let recordingCheckInterval: NodeJS.Timeout;

        // Configurar detecção de screenshot
        if (enableScreenshotProtection) {
            // TODO: Implementar listener real quando bibliotecas estiverem funcionando
            // screenshotListener = addScreenshotListener(() => {
            //   handleViolationDetected('screenshot');
            // });
        }

        // Configurar detecção de gravação
        if (enableRecordingProtection) {
            recordingCheckInterval = setInterval(() => {
                // TODO: Implementar detecção real de gravação
                // if (isScreenRecording()) {
                //   handleViolationDetected('recording');
                // }
            }, 1000);
        }

        // Configurar toast de copyright periódico
        const copyrightToastInterval = setInterval(() => {
            if (protectionService.shouldShowCopyrightToast()) {
                showCopyrightToastMessage();
            }
        }, 300000); // 5 minutos

        return () => {
            screenshotListener?.remove?.();
            if (recordingCheckInterval) {
                clearInterval(recordingCheckInterval);
            }
            if (copyrightToastInterval) {
                clearInterval(copyrightToastInterval);
            }
        };
    }, [enableScreenshotProtection, enableRecordingProtection]);

    const handleViolationDetected = (type: 'screenshot' | 'recording') => {
        setProtectionReason(type);
        setShowProtectionScreen(true);

        // Notificar serviço de proteção
        if (type === 'screenshot') {
            protectionService.handleScreenshotDetected();
        } else {
            protectionService.handleScreenRecordingDetected();
        }

        // Callback externo
        onViolationDetected?.(type);
    };

    const showCopyrightToastMessage = () => {
        const message = protectionService.generateCopyrightToastMessage();
        setToastMessage(message);
        setShowCopyrightToast(true);

        // Auto-hide após 3 segundos
        setTimeout(() => {
            setShowCopyrightToast(false);
        }, 3000);
    };

    const handleDismissProtection = () => {
        setShowProtectionScreen(false);
        setProtectionReason(null);
    };

    const handleShareApp = async () => {
        // TODO: Implementar compartilhamento via ProtectionService
        setShowProtectionScreen(false);
        setProtectionReason(null);
    };

    const getProtectionContent = () => {
        switch (protectionReason) {
            case 'screenshot':
                return {
                    icon: 'camera-outline',
                    title: 'Screenshot Detectado',
                    message: 'Este conteúdo é protegido por direitos autorais.\n\nPara compartilhar informações, use o botão de compartilhamento oficial do app.',
                };
            case 'recording':
                return {
                    icon: 'videocam-outline',
                    title: 'Gravação Detectada',
                    message: 'A gravação de tela não é permitida.\n\nO conteúdo é protegido por direitos autorais da Falando de GTI.',
                };
            default:
                return {
                    icon: 'shield-outline',
                    title: 'Conteúdo Protegido',
                    message: 'Este conteúdo é protegido por direitos autorais.',
                };
        }
    };

    const protectionContent = getProtectionContent();

    return (
        <Container>
            {children}

            {/* Watermark */}
            {enableWatermark && (
                <Watermark
                    position={watermarkPosition}
                    opacity={0.1}
                    animated={false}
                    visible={true}
                />
            )}

            {/* Toast de Copyright */}
            <CopyrightToastContainer visible={showCopyrightToast}>
                <ToastText>{toastMessage}</ToastText>
            </CopyrightToastContainer>

            {/* Tela de Proteção */}
            <Modal
                visible={showProtectionScreen}
                transparent={false}
                animationType="fade"
                onRequestClose={handleDismissProtection}
            >
                <ProtectionScreen>
                    <ProtectionIcon>
                        <Ionicons
                            name={protectionContent.icon as keyof typeof Ionicons.glyphMap}
                            size={40}
                            color={theme.colors.background}
                        />
                    </ProtectionIcon>

                    <ProtectionTitle>
                        {protectionContent.title}
                    </ProtectionTitle>

                    <ProtectionMessage>
                        {protectionContent.message}
                    </ProtectionMessage>

                    <ProtectionActions>
                        <Button
                            title="Compartilhar App"
                            onPress={handleShareApp}
                            variant="primary"
                            fullWidth
                            icon={
                                <Ionicons
                                    name="share-outline"
                                    size={16}
                                    color={theme.colors.background}
                                />
                            }
                        />

                        <Button
                            title="Entendi"
                            onPress={handleDismissProtection}
                            variant="outline"
                            fullWidth
                        />
                    </ProtectionActions>
                </ProtectionScreen>
            </Modal>
        </Container>
    );
};