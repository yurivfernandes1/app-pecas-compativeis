import React from 'react';
import { View, ViewStyle } from 'react-native';
import styled from 'styled-components/native';
import { useResponsive, useResponsiveSpacing } from '../../hooks/useResponsive';

interface ResponsiveContainerProps {
    children: React.ReactNode;
    maxWidth?: {
        mobile?: number;
        tablet?: number;
        desktop?: number;
    };
    padding?: {
        mobile?: number;
        tablet?: number;
        desktop?: number;
    };
    style?: ViewStyle;
    centerContent?: boolean;
}

const Container = styled.View<{
    maxWidth: number;
    padding: number;
    centerContent: boolean;
}>`
  flex: 1;
  max-width: ${({ maxWidth }) => maxWidth}px;
  padding: ${({ padding }) => padding}px;
  ${({ centerContent }) => centerContent && `
    align-self: center;
    width: 100%;
  `}
`;

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
    children,
    maxWidth = {
        mobile: 480,
        tablet: 768,
        desktop: 1200,
    },
    padding,
    style,
    centerContent = false,
}) => {
    const { breakpoint } = useResponsive();
    const responsiveSpacing = useResponsiveSpacing();

    // Determinar largura máxima
    const currentMaxWidth = (() => {
        switch (breakpoint) {
            case 'desktop':
                return maxWidth.desktop || maxWidth.tablet || maxWidth.mobile || 1200;
            case 'tablet':
                return maxWidth.tablet || maxWidth.mobile || 768;
            default:
                return maxWidth.mobile || 480;
        }
    })();

    // Determinar padding
    const currentPadding = (() => {
        if (padding) {
            switch (breakpoint) {
                case 'desktop':
                    return padding.desktop || padding.tablet || padding.mobile || responsiveSpacing.md;
                case 'tablet':
                    return padding.tablet || padding.mobile || responsiveSpacing.md;
                default:
                    return padding.mobile || responsiveSpacing.md;
            }
        }
        return responsiveSpacing.md;
    })();

    return (
        <Container
            maxWidth={currentMaxWidth}
            padding={currentPadding}
            centerContent={centerContent}
            style={style}
        >
            {children}
        </Container>
    );
};