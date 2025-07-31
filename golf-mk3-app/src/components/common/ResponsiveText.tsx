import React from 'react';
import { Text, TextStyle } from 'react-native';
import styled from 'styled-components/native';
import { useResponsiveTypography } from '../../hooks/useResponsive';

interface ResponsiveTextProps {
    children: React.ReactNode;
    variant?: 'h1' | 'h2' | 'h3' | 'body' | 'small' | 'caption';
    color?: string;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    fontWeight?: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
    style?: TextStyle;
    numberOfLines?: number;
    onPress?: () => void;
    accessible?: boolean;
    accessibilityLabel?: string;
}

const StyledText = styled(Text) <{
    fontSize: number;
    lineHeight: number;
    color?: string;
    textAlign?: string;
    fontWeight?: string;
}>`
  font-size: ${({ fontSize }) => fontSize}px;
  line-height: ${({ lineHeight }) => lineHeight}px;
  color: ${({ color }) => color || '#111827'};
  text-align: ${({ textAlign }) => textAlign || 'left'};
  font-weight: ${({ fontWeight }) => fontWeight || 'normal'};
`;

export const ResponsiveText: React.FC<ResponsiveTextProps> = ({
    children,
    variant = 'body',
    color,
    textAlign,
    fontWeight,
    style,
    numberOfLines,
    onPress,
    accessible = true,
    accessibilityLabel,
    ...props
}) => {
    const typography = useResponsiveTypography();
    const typeStyle = typography[variant];

    return (
        <StyledText
            fontSize={typeStyle.fontSize}
            lineHeight={typeStyle.lineHeight}
            color={color}
            textAlign={textAlign}
            fontWeight={fontWeight}
            style={style}
            numberOfLines={numberOfLines}
            onPress={onPress}
            accessible={accessible}
            accessibilityLabel={accessibilityLabel}
            {...props}
        >
            {children}
        </StyledText>
    );
};