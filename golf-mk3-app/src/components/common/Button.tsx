import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../../styles/theme';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
    loading?: boolean;
    icon?: React.ReactNode;
    fullWidth?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
}

const StyledButton = styled(TouchableOpacity) <{
    variant: string;
    size: string;
    fullWidth: boolean;
    disabled: boolean;
}>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: ${theme.borderRadius.md}px;
  
  ${({ variant }) => {
        switch (variant) {
            case 'primary':
                return `
          background-color: ${theme.colors.primary};
          border: 1px solid ${theme.colors.primary};
        `;
            case 'secondary':
                return `
          background-color: ${theme.colors.secondary};
          border: 1px solid ${theme.colors.secondary};
        `;
            case 'outline':
                return `
          background-color: transparent;
          border: 1px solid ${theme.colors.primary};
        `;
            case 'ghost':
                return `
          background-color: transparent;
          border: 1px solid transparent;
        `;
            default:
                return `
          background-color: ${theme.colors.primary};
          border: 1px solid ${theme.colors.primary};
        `;
        }
    }}
  
  ${({ size }) => {
        switch (size) {
            case 'small':
                return `
          padding: ${theme.spacing.xs}px ${theme.spacing.sm}px;
          min-height: 32px;
        `;
            case 'medium':
                return `
          padding: ${theme.spacing.sm}px ${theme.spacing.md}px;
          min-height: 44px;
        `;
            case 'large':
                return `
          padding: ${theme.spacing.md}px ${theme.spacing.lg}px;
          min-height: 52px;
        `;
            default:
                return `
          padding: ${theme.spacing.sm}px ${theme.spacing.md}px;
          min-height: 44px;
        `;
        }
    }}
  
  ${({ fullWidth }) => fullWidth && 'width: 100%;'}
  
  ${({ disabled }) => disabled && `
    opacity: 0.5;
  `}
`;

const ButtonText = styled(Text) <{
    variant: string;
    size: string;
}>`
  font-weight: 600;
  text-align: center;
  
  ${({ variant }) => {
        switch (variant) {
            case 'primary':
            case 'secondary':
                return `color: ${theme.colors.background};`;
            case 'outline':
                return `color: ${theme.colors.primary};`;
            case 'ghost':
                return `color: ${theme.colors.text};`;
            default:
                return `color: ${theme.colors.background};`;
        }
    }}
  
  ${({ size }) => {
        switch (size) {
            case 'small':
                return `font-size: ${theme.typography.small.fontSize}px;`;
            case 'medium':
                return `font-size: ${theme.typography.body.fontSize}px;`;
            case 'large':
                return `font-size: ${theme.typography.h3.fontSize}px;`;
            default:
                return `font-size: ${theme.typography.body.fontSize}px;`;
        }
    }}
`;

const IconContainer = styled.View<{ hasText: boolean }>`
  ${({ hasText }) => hasText && `margin-right: ${theme.spacing.xs}px;`}
`;

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    icon,
    fullWidth = false,
    style,
    textStyle,
    ...props
}) => {
    const handlePress = () => {
        if (!disabled && !loading) {
            onPress();
        }
    };

    return (
        <StyledButton
            variant={variant}
            size={size}
            fullWidth={fullWidth}
            disabled={disabled || loading}
            onPress={handlePress}
            style={style}
            activeOpacity={0.7}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={title}
            {...props}
        >
            {loading ? (
                <ActivityIndicator
                    size="small"
                    color={variant === 'outline' || variant === 'ghost' ? theme.colors.primary : theme.colors.background}
                />
            ) : (
                <>
                    {icon && (
                        <IconContainer hasText={!!title}>
                            {icon}
                        </IconContainer>
                    )}
                    {title && (
                        <ButtonText variant={variant} size={size} style={textStyle}>
                            {title}
                        </ButtonText>
                    )}
                </>
            )}
        </StyledButton>
    );
};