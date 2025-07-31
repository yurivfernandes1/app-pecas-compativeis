import React from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';
import { Button } from './Button';

interface EmptyStateProps {
    icon?: keyof typeof Ionicons.glyphMap;
    title: string;
    description?: string;
    actionText?: string;
    onAction?: () => void;
    style?: any;
}

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${theme.spacing.xl}px;
`;

const IconContainer = styled.View`
  margin-bottom: ${theme.spacing.lg}px;
`;

const Title = styled(Text)`
  font-size: ${theme.typography.h2.fontSize}px;
  font-weight: ${theme.typography.h2.fontWeight};
  color: ${theme.colors.text};
  text-align: center;
  margin-bottom: ${theme.spacing.sm}px;
`;

const Description = styled(Text)`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${theme.colors.textSecondary};
  text-align: center;
  line-height: ${theme.typography.body.lineHeight}px;
  margin-bottom: ${theme.spacing.lg}px;
`;

const ActionContainer = styled.View`
  margin-top: ${theme.spacing.md}px;
`;

export const EmptyState: React.FC<EmptyStateProps> = ({
    icon = 'search-outline',
    title,
    description,
    actionText,
    onAction,
    style,
    ...props
}) => {
    return (
        <Container style={style} {...props}>
            <IconContainer>
                <Ionicons
                    name={icon}
                    size={64}
                    color={theme.colors.textLight}
                />
            </IconContainer>

            <Title accessible={true}>
                {title}
            </Title>

            {description && (
                <Description accessible={true}>
                    {description}
                </Description>
            )}

            {actionText && onAction && (
                <ActionContainer>
                    <Button
                        title={actionText}
                        onPress={onAction}
                        variant="outline"
                    />
                </ActionContainer>
            )}
        </Container>
    );
};