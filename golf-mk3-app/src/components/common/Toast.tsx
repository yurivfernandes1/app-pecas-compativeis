import React, { useEffect, useRef } from 'react';
import { Animated, Text } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../../styles/theme';

interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'warning' | 'info';
    visible: boolean;
    duration?: number;
    onHide: () => void;
    position?: 'top' | 'bottom';
}

const Container = styled(Animated.View) <{
    type: string;
    position: string;
}>`
  position: absolute;
  left: ${theme.spacing.md}px;
  right: ${theme.spacing.md}px;
  ${({ position }) => position === 'top' ? 'top: 60px;' : 'bottom: 100px;'}
  
  background-color: ${({ type }) => {
        switch (type) {
            case 'success': return theme.colors.success;
            case 'error': return theme.colors.error;
            case 'warning': return theme.colors.warning;
            case 'info': return theme.colors.info;
            default: return theme.colors.text;
        }
    }};
  
  border-radius: ${theme.borderRadius.md}px;
  padding: ${theme.spacing.md}px;
  z-index: 1000;
  
  ${theme.shadows.md}
`;

const ToastText = styled(Text)`
  color: ${theme.colors.background};
  font-size: ${theme.typography.body.fontSize}px;
  font-weight: 500;
  text-align: center;
`;

export const Toast: React.FC<ToastProps> = ({
    message,
    type = 'info',
    visible,
    duration = 3000,
    onHide,
    position = 'bottom',
    ...props
}) => {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(position === 'top' ? -50 : 50)).current;

    useEffect(() => {
        if (visible) {
            // Mostrar toast
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();

            // Auto hide após duration
            const timer = setTimeout(() => {
                hideToast();
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [visible]);

    const hideToast = () => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: position === 'top' ? -50 : 50,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onHide();
        });
    };

    if (!visible) return null;

    return (
        <Container
            type={type}
            position={position}
            style={{
                opacity,
                transform: [{ translateY }],
            }}
            accessible={true}
            accessibilityLabel={message}
            accessibilityRole="alert"
            {...props}
        >
            <ToastText>{message}</ToastText>
        </Container>
    );
};