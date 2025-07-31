import React from 'react';
import { TouchableOpacity, ViewStyle } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../../styles/theme';

interface CardProps {
    children: React.ReactNode;
    onPress?: () => void;
    style?: ViewStyle;
    padding?: keyof typeof theme.spacing;
    margin?: keyof typeof theme.spacing;
    shadow?: keyof typeof theme.shadows;
    borderRadius?: keyof typeof theme.borderRadius;
    backgroundColor?: string;
}

const StyledCard = styled.View<{
    padding: keyof typeof theme.spacing;
    margin: keyof typeof theme.spacing;
    shadow: keyof typeof theme.shadows;
    borderRadius: keyof typeof theme.borderRadius;
    backgroundColor: string;
}>`
  background-color: ${({ backgroundColor }) => backgroundColor};
  border-radius: ${({ borderRadius }) => theme.borderRadius[borderRadius]}px;
  padding: ${({ padding }) => theme.spacing[padding]}px;
  margin: ${({ margin }) => theme.spacing[margin]}px;
  
  ${({ shadow }) => {
        const shadowStyle = theme.shadows[shadow];
        return `
      shadow-color: ${shadowStyle.shadowColor};
      shadow-offset: ${shadowStyle.shadowOffset.width}px ${shadowStyle.shadowOffset.height}px;
      shadow-opacity: ${shadowStyle.shadowOpacity};
      shadow-radius: ${shadowStyle.shadowRadius}px;
      elevation: ${shadowStyle.elevation};
    `;
    }}
`;

const TouchableCard = styled(TouchableOpacity) <{
    padding: keyof typeof theme.spacing;
    margin: keyof typeof theme.spacing;
    shadow: keyof typeof theme.shadows;
    borderRadius: keyof typeof theme.borderRadius;
    backgroundColor: string;
}>`
  background-color: ${({ backgroundColor }) => backgroundColor};
  border-radius: ${({ borderRadius }) => theme.borderRadius[borderRadius]}px;
  padding: ${({ padding }) => theme.spacing[padding]}px;
  margin: ${({ margin }) => theme.spacing[margin]}px;
  
  ${({ shadow }) => {
        const shadowStyle = theme.shadows[shadow];
        return `
      shadow-color: ${shadowStyle.shadowColor};
      shadow-offset: ${shadowStyle.shadowOffset.width}px ${shadowStyle.shadowOffset.height}px;
      shadow-opacity: ${shadowStyle.shadowOpacity};
      shadow-radius: ${shadowStyle.shadowRadius}px;
      elevation: ${shadowStyle.elevation};
    `;
    }}
`;

export const Card: React.FC<CardProps> = ({
    children,
    onPress,
    style,
    padding = 'md',
    margin = 'xs',
    shadow = 'sm',
    borderRadius = 'md',
    backgroundColor = theme.colors.background,
    ...props
}) => {
    const cardProps = {
        padding,
        margin,
        shadow,
        borderRadius,
        backgroundColor,
        style,
        ...props
    };

    if (onPress) {
        return (
            <TouchableCard
                {...cardProps}
                onPress={onPress}
                activeOpacity={0.7}
                accessible={true}
                accessibilityRole="button"
            >
                {children}
            </TouchableCard>
        );
    }

    return (
        <StyledCard {...cardProps}>
            {children}
        </StyledCard>
    );
};