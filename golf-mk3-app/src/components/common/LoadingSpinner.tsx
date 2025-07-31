import React from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../../styles/theme';

interface LoadingSpinnerProps {
    size?: 'small' | 'large';
    color?: string;
    message?: string;
    fullScreen?: boolean;
}

const Container = styled.View<{ fullScreen: boolean }>`
  ${({ fullScreen }) => fullScreen ? `
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${theme.colors.backdrop};
    z-index: 1000;
  ` : ''}
  
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${theme.spacing.lg}px;
`;

const LoadingText = styled(Text)`
  margin-top: ${theme.spacing.md}px;
  font-size: ${theme.typography.body.fontSize}px;
  color: ${theme.colors.textSecondary};
  text-align: center;
`;

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    size = 'large',
    color = theme.colors.primary,
    message,
    fullScreen = false,
    ...props
}) => {
    return (
        <Container fullScreen={fullScreen}>
            <ActivityIndicator
                size={size}
                color={color}
                accessible={true}
                accessibilityLabel="Carregando"
                {...props}
            />
            {message && (
                <LoadingText accessible={true}>
                    {message}
                </LoadingText>
            )}
        </Container>
    );
};