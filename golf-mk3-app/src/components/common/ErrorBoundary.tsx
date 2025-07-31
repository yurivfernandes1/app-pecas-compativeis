import React, { Component, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AnalyticsService } from '../../services/AnalyticsService';
import { ErrorService } from '../../services/ErrorService';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: any) => void;
    resetOnPropsChange?: boolean;
    resetKeys?: Array<string | number>;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: any;
    errorId: string;
}

export class ErrorBoundary extends Component<Props, State> {
    private resetTimeoutId: number | null = null;

    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            errorId: '',
        };
    }

    static getDerivedStateFromError(error: Error): Partial<State> {
        // Atualiza o state para mostrar a UI de erro
        return {
            hasError: true,
            error,
            errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        };
    }

    componentDidCatch(error: Error, errorInfo: any) {
        // Log do erro
        console.error('ErrorBoundary caught an error:', error, errorInfo);

        // Atualizar state com informações do erro
        this.setState({
            error,
            errorInfo,
        });

        // Callback personalizado
        this.props.onError?.(error, errorInfo);

        // Enviar erro para analytics e serviços
        this.logError(error, errorInfo);
    }

    componentDidUpdate(prevProps: Props) {
        const { resetOnPropsChange, resetKeys } = this.props;
        const { hasError } = this.state;

        // Reset automático quando props mudam
        if (hasError && resetOnPropsChange) {
            if (resetKeys) {
                const hasResetKeyChanged = resetKeys.some(
                    (key, index) => prevProps.resetKeys?.[index] !== key
                );
                if (hasResetKeyChanged) {
                    this.resetErrorBoundary();
                }
            }
        }
    }

    private logError = async (error: Error, errorInfo: any) => {
        try {
            // Log para analytics
            AnalyticsService.trackError(error.name, error.message, {
                stack: error.stack,
                componentStack: errorInfo.componentStack,
                errorId: this.state.errorId,
            });

            // Log para serviço de erro
            await ErrorService.logError({
                type: 'component_error',
                message: error.message,
                stack: error.stack,
                componentStack: errorInfo.componentStack,
                errorId: this.state.errorId,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
            });
        } catch (logError) {
            console.error('Failed to log error:', logError);
        }
    };

    private resetErrorBoundary = () => {
        if (this.resetTimeoutId) {
            clearTimeout(this.resetTimeoutId);
        }

        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
            errorId: '',
        });
    };

    private handleRetry = () => {
        // Track retry attempt
        AnalyticsService.trackEvent('error_boundary_retry', {
            errorId: this.state.errorId,
            errorType: this.state.error?.name || 'unknown',
        });

        this.resetErrorBoundary();
    };

    private handleReload = () => {
        // Track reload attempt
        AnalyticsService.trackEvent('error_boundary_reload', {
            errorId: this.state.errorId,
            errorType: this.state.error?.name || 'unknown',
        });

        // Reload the app
        if (typeof window !== 'undefined') {
            window.location.reload();
        }
    };

    private renderErrorUI = () => {
        const { fallback } = this.props;
        const { error, errorId } = this.state;

        // Se há um fallback customizado, usar ele
        if (fallback) {
            return fallback;
        }

        // UI padrão de erro
        return (
            <View style={styles.container}>
                <View style={styles.content}>
                    {/* Ícone de erro */}
                    <View style={styles.iconContainer}>
                        <Ionicons name="warning-outline" size={64} color="#EF4444" />
                    </View>

                    {/* Título */}
                    <Text style={styles.title}>Ops! Algo deu errado</Text>

                    {/* Descrição */}
                    <Text style={styles.description}>
                        Encontramos um problema inesperado. Não se preocupe, você pode tentar novamente.
                    </Text>

                    {/* Detalhes do erro (apenas em desenvolvimento) */}
                    {__DEV__ && error && (
                        <View style={styles.errorDetails}>
                            <Text style={styles.errorTitle}>Detalhes do erro:</Text>
                            <Text style={styles.errorMessage}>{error.message}</Text>
                            <Text style={styles.errorId}>ID: {errorId}</Text>
                        </View>
                    )}

                    {/* Botões de ação */}
                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={[styles.button, styles.primaryButton]}
                            onPress={this.handleRetry}
                            accessibilityLabel="Tentar novamente"
                            accessibilityRole="button"
                        >
                            <Ionicons name="refresh" size={20} color="#FFFFFF" />
                            <Text style={styles.primaryButtonText}>Tentar Novamente</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.secondaryButton]}
                            onPress={this.handleReload}
                            accessibilityLabel="Recarregar aplicativo"
                            accessibilityRole="button"
                        >
                            <Ionicons name="reload" size={20} color="#6B7280" />
                            <Text style={styles.secondaryButtonText}>Recarregar App</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Informações de suporte */}
                    <View style={styles.support}>
                        <Text style={styles.supportText}>
                            Se o problema persistir, entre em contato:
                        </Text>
                        <Text style={styles.supportContact}>
                            app.falandodegti.com.br
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    render() {
        if (this.state.hasError) {
            return this.renderErrorUI();
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    content: {
        alignItems: 'center',
        maxWidth: 400,
        width: '100%',
    },
    iconContainer: {
        marginBottom: 24,
        padding: 20,
        borderRadius: 50,
        backgroundColor: '#FEF2F2',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 12,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 32,
    },
    errorDetails: {
        backgroundColor: '#FEF2F2',
        padding: 16,
        borderRadius: 8,
        marginBottom: 24,
        width: '100%',
    },
    errorTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#DC2626',
        marginBottom: 8,
    },
    errorMessage: {
        fontSize: 12,
        color: '#7F1D1D',
        fontFamily: 'monospace',
        marginBottom: 4,
    },
    errorId: {
        fontSize: 10,
        color: '#991B1B',
        fontFamily: 'monospace',
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

// Hook para usar Error Boundary programaticamente
export const useErrorHandler = () => {
    const handleError = (error: Error, errorInfo?: any) => {
        // Log do erro
        console.error('Manual error handling:', error);

        // Enviar para analytics
        AnalyticsService.trackError(error.name, error.message, {
            stack: error.stack,
            manual: true,
            ...errorInfo,
        });

        // Enviar para serviço de erro
        ErrorService.logError({
            type: 'manual_error',
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
            manual: true,
            ...errorInfo,
        });
    };

    return { handleError };
};

export default ErrorBoundary;