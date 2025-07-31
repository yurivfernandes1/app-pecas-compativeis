import React, { useEffect, useState } from 'react';
import { Text, Animated } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../../styles/theme';
import ProtectionService from '../../services/ProtectionService';

interface WatermarkProps {
    text?: string;
    opacity?: number;
    position?: 'center' | 'bottom' | 'top' | 'top-right' | 'bottom-left';
    rotation?: number;
    animated?: boolean;
    visible?: boolean;
}

const WatermarkContainer = styled(Animated.View) <{
    position: string;
}>`
  position: absolute;
  width: 100%;
  height: 100%;
  justify-content: ${({ position }) => {
        switch (position) {
            case 'top':
            case 'top-right':
                return 'flex-start';
            case 'bottom':
            case 'bottom-left':
                return 'flex-end';
            default:
                return 'center';
        }
    }};
  align-items: ${({ position }) => {
        switch (position) {
            case 'top-right':
                return 'flex-end';
            case 'bottom-left':
                return 'flex-start';
            default:
                return 'center';
        }
    }};
  pointer-events: none;
  z-index: 1000;
  ${({ position }) => {
        switch (position) {
            case 'top':
                return 'padding-top: 60px;';
            case 'bottom':
                return 'padding-bottom: 60px;';
            case 'top-right':
                return 'padding-top: 60px; padding-right: 20px;';
            case 'bottom-left':
                return 'padding-bottom: 60px; padding-left: 20px;';
            default:
                return '';
        }
    }}
`;

const WatermarkText = styled(Text) <{
    opacity: number;
    rotation: number;
}>`
  font-size: 14px;
  color: ${theme.colors.text};
  font-weight: 600;
  text-align: center;
  opacity: ${({ opacity }) => opacity};
  transform: rotate(${({ rotation }) => rotation}deg);
  text-shadow: 0px 0px 4px rgba(255, 255, 255, 0.8);
`;

const MultiLineText = styled(Text) <{
    opacity: number;
    rotation: number;
}>`
  font-size: 12px;
  color: ${theme.colors.textSecondary};
  font-weight: 500;
  text-align: center;
  opacity: ${({ opacity }) => opacity};
  transform: rotate(${({ rotation }) => rotation}deg);
  line-height: 16px;
  text-shadow: 0px 0px 4px rgba(255, 255, 255, 0.8);
`;

export const Watermark: React.FC<WatermarkProps> = ({
    text,
    opacity = 0.15,
    position = 'center',
    rotation = -45,
    animated = false,
    visible = true,
}) => {
    const [watermarkText, setWatermarkText] = useState('');
    const [animatedOpacity] = useState(new Animated.Value(opacity));

    const protectionService = ProtectionService.getInstance();

    useEffect(() => {
        // Gerar texto do watermark
        const generatedText = text || protectionService.generateWatermarkText();
        setWatermarkText(generatedText);
    }, [text]);

    useEffect(() => {
        if (animated && visible) {
            // Animação sutil de fade in/out
            const animation = Animated.loop(
                Animated.sequence([
                    Animated.timing(animatedOpacity, {
                        toValue: opacity * 1.5,
                        duration: 3000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(animatedOpacity, {
                        toValue: opacity * 0.5,
                        duration: 3000,
                        useNativeDriver: true,
                    }),
                ])
            );

            animation.start();

            return () => animation.stop();
        } else {
            animatedOpacity.setValue(visible ? opacity : 0);
        }
    }, [animated, visible, opacity]);

    if (!visible || !watermarkText) {
        return null;
    }

    const isMultiLine = watermarkText.includes('\n') || watermarkText.length > 50;

    return (
        <WatermarkContainer
            position={position}
            style={{
                opacity: animated ? animatedOpacity : opacity,
            }}
        >
            {isMultiLine ? (
                <MultiLineText
                    opacity={1}
                    rotation={rotation}
                    accessible={false}
                    importantForAccessibility="no"
                >
                    {watermarkText}
                </MultiLineText>
            ) : (
                <WatermarkText
                    opacity={1}
                    rotation={rotation}
                    accessible={false}
                    importantForAccessibility="no"
                >
                    {watermarkText}
                </WatermarkText>
            )}
        </WatermarkContainer>
    );
};