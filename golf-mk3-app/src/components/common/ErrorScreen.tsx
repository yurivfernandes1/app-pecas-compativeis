import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useResponsive } from '../../hooks/useResponsive';

export interface ErrorScreenProps {
    title?: string;
    message?: string;
    errorType?: 'network' | 'data' | 'notFound' | 'permission' | 'generic';
    onRetry?: () => void;
    onGoBack?: () => void;
    onGoHome?: () => void;
    showDetails?: boolean;
    errorDetails?: string;
    retryLabel?: string;
    showSupport?: boolean;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({
    title,
    message,
    errorType = 'generic',
    onRetry,
    onGoBack,
    onGoHome,
    showDetails = false,
    errorDetails,
    retryLabel = 'Tentar Novamente',
    showSupport = true,
}) => {
    const { isMobile, getStyle } = useResponsive();

    // Configurações baseadas no tipo de erro
    const getErrorConfig = () => {
        switch (errorType) {
            case 'network':
                return {
                    icon: 'wifi-outline',
                    iconColor: '#F59E0B',
                    iconBg: '#FEF3C7',
                    defaultTitle: 'Sem Conexão',
                    defaultMessage: 'Verifique sua conexão com a internet e tente novamente.',
                };
            case 'data':
                return {
                    icon: 'document-outline',
                    iconColor: '#EF4444',
                    iconBg: '#FEE2E2',
                    defaultTitle: 'Erro nos Dados',
                    defaultMessage: 'Não foi possível carregar as informações. Tente novamente.',
                };
            case 'notFound':
                return {
                    icon: 'search-outline',
                    iconColor: '#6B7280',
                    iconBg: '#F3F4F6',
                    defaultTitle: 'Não Encontrado',
                    defaultMessage: 'O conteúdo que você procura não foi encontrado.',
                };
            case 'permission':
                return {
                    icon: 'lock-closed-outline',
                    iconColor: '#DC2626',
                    iconBg: '#FEE2E2',
                    defaultTitle: 'Acesso Negado',
                    defaultMessage: 'Você não tem permissão para acessar este conteúdo.',
                };
            default:
                return {
                    icon: 'warning-outline',
                    iconColor: '#EF4444',
                    iconBg: '#FEE2E2',
                    defaultTitle: 'Algo deu errado',
                    defaultMessage: 'Ocorreu um erro inesperado. Tente novamente.',
                };
        }
    };

    const config = getErrorConfig();
    const displayTitle = title || config.defaultTitle;
    const displayMessage = message || config.defaultMessage;

    const containerStyle = getStyle({
        mobile: styles.mobileContainer,
        tablet: styles.tabletContainer,
        desktop: styles.desktopContainer,
    });

    const contentStyle = getStyle({
        mobile: styles.mobileContent,
        tablet: styles.tabletContent,
        desktop: styles.desktopContent,
    });

    return (
        <ScrollView style={styles.container} contentContainerStyle={containerStyle}>
            <View style={[styles.content, contentStyle]}>
                {/* Ícone */}
                <View style={[styles.iconContainer, { backgroundColor: config.iconBg }]}>
                    <Ionicons
                        name={config.icon as any}
                        size={isMobile ? 48 : 64}
                        color={config.iconColor}
                    />
                </View>

                {/* Título */}
                <Text style={[styles.title, { fontSize: isMobile ? 20 : 24 }]}>
                    {displayTitle}
                </Text>

                {/* Mensagem */}
                <Text style={[styles.message, { fontSize: isMobile ? 14 : 16 }]}>
                    {displayMessage}
                </Text>

                {/* Detalhes do erro (apenas em desenvolvimento) */}
                {showDetails && errorDetails && __DEV__ && (
                    <View style={styles.errorDetails}>
                        <Text style={styles.errorDetailsTitle}>Detalhes técnicos:</Text>
                        <ScrollView style={styles.errorDetailsScroll} nestedScrollEnabled>
                            <Text style={styles.errorDetailsText}>{errorDetails}</Text>
                        </ScrollView>
                    </View>
                )}

                {/* Botões de ação */}
                <View style={styles.actions}>
                    {onRetry && (
                        <TouchableOpacity
                            style={[styles.button, styles.primaryButton]}
                            onPress={onRetry}
                            accessibilityLabel={retryLabel}
                            accessibilityRole="button"
                        >
                            <Ionicons name="refresh" size={20} color="#FFFFFF" />
                            <Text style={styles.primaryButtonText}>{retryLabel}</Text>
                        </TouchableOpacity>
                    )}

                    {onGoBack && (
                        <TouchableOpacity
                            style={[styles.button, styles.secondaryButton]}
                            onPress={onGoBack}
                            accessibilityLabel="Voltar"
                            accessibilityRole="button"
                        >
                            <Ionicons name="arrow-back" size={20} color="#6B7280" />
                            <Text style={styles.secondaryButtonText}>Voltar</Text>
                        </TouchableOpacity>
                    )}

                    {onGoHome && (
                        <TouchableOpacity
                            style={[styles.button, styles.secondaryButton]}
                            onPress={onGoHome}
                            accessibilityLabel="Ir para início"
                            accessibilityRole="button"
                        >
                            <Ionicons name="home" size={20} color="#6B7280" />
                            <Text style={styles.secondaryButtonText}>Início</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Informações de suporte */}
                {showSupport && (
                    <View style={styles.support}>
                        <Text style={styles.supportText}>
                            Precisa de ajuda?
                        </Text>
                        <Text style={styles.supportContact}>
                            app.falandodegti.com.br
                        </Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    mobileContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    tabletContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 40,
    },
    desktopContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 60,
    },
    content: {
        alignItems: 'center',
        width: '100%',
    },
    mobileContent: {
        maxWidth: '100%',
    },
    tabletContent: {
        maxWidth: 500,
        alignSelf: 'center',
    },
    desktopContent: {
        maxWidth: 600,
        alignSelf: 'center',
    },
    iconContainer: {
        padding: 20,
        borderRadius: 50,
        marginBottom: 24,
    },
    title: {
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 12,
        textAlign: 'center',
    },
    message: {
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
    errorDetails: {
        backgroundColor: '#FEF2F2',
        borderRadius: 8,
        padding: 16,
        marginBottom: 24,
        width: '100%',
        maxHeight: 200,
    },
    errorDetailsTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#DC2626',
        marginBottom: 8,
    },
    errorDetailsScroll: {
        maxHeight: 120,
    },
    errorDetailsText: {
        fontSize: 12,
        color: '#7F1D1D',
        fontFamily: 'monospace',
        lineHeight: 16,
    },
    actions: {
        width: '100%',
        gap: 12,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        gap: 8,
        minHeight: 48,
    },
    primaryButton: {
        backgroundColor: '#DC2626',
    },
    secondaryButton: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButtonText: {
        color: '#6B7280',
        fontSize: 16,
        fontWeight: '500',
    },
    support: {
        marginTop: 32,
        alignItems: 'center',
    },
    supportText: {
        fontSize: 14,
        color: '#9CA3AF',
        textAlign: 'center',
        marginBottom: 4,
    },
    supportContact: {
        fontSize: 14,
        color: '#DC2626',
        fontWeight: '500',
    },
});

export default ErrorScreen;