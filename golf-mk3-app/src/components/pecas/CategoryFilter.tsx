import React from 'react';
import { ScrollView, Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';

interface Category {
    id: string;
    nome: string;
    icone: string;
    cor: string;
}

interface CategoryFilterProps {
    categories: Category[];
    selectedCategory: string | null;
    onCategoryPress: (categoryId: string | null) => void;
    showAll?: boolean;
}

const Container = styled.View`
  margin-bottom: ${theme.spacing.md}px;
`;

const FilterScroll = styled(ScrollView)`
  flex-grow: 0;
`;

const FilterChip = styled(TouchableOpacity) <{
    active: boolean;
    categoryColor?: string;
}>`
  flex-direction: row;
  align-items: center;
  background-color: ${({ active, categoryColor }) =>
        active ? (categoryColor || theme.colors.primary) : theme.colors.surface
    };
  border-radius: ${theme.borderRadius.full}px;
  padding: ${theme.spacing.sm}px ${theme.spacing.md}px;
  margin-right: ${theme.spacing.sm}px;
  border: 1px solid ${({ active, categoryColor }) =>
        active ? (categoryColor || theme.colors.primary) : theme.colors.border
    };
  min-height: 36px;
`;

const IconContainer = styled.View<{ hasText: boolean }>`
  ${({ hasText }) => hasText && `margin-right: ${theme.spacing.xs}px;`}
`;

const FilterText = styled(Text) <{ active: boolean }>`
  color: ${({ active }) => active ? theme.colors.background : theme.colors.text};
  font-size: ${theme.typography.small.fontSize}px;
  font-weight: 500;
`;

const AllChip = styled(TouchableOpacity) <{ active: boolean }>`
  flex-direction: row;
  align-items: center;
  background-color: ${({ active }) => active ? theme.colors.text : theme.colors.surface};
  border-radius: ${theme.borderRadius.full}px;
  padding: ${theme.spacing.sm}px ${theme.spacing.md}px;
  margin-right: ${theme.spacing.sm}px;
  border: 1px solid ${({ active }) => active ? theme.colors.text : theme.colors.border};
  min-height: 36px;
`;

const AllText = styled(Text) <{ active: boolean }>`
  color: ${({ active }) => active ? theme.colors.background : theme.colors.text};
  font-size: ${theme.typography.small.fontSize}px;
  font-weight: 500;
`;

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
    categories,
    selectedCategory,
    onCategoryPress,
    showAll = true,
}) => {
    const getIconName = (iconName: string): keyof typeof Ionicons.glyphMap => {
        // Mapear nomes de ícones para ícones válidos do Ionicons
        const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
            'engine-outline': 'car-outline',
            'car-brake-alert': 'warning-outline',
            'car-side': 'car-outline',
            'flash-outline': 'flash-outline',
            'car-outline': 'car-outline',
            'cog-outline': 'settings-outline',
        };

        return iconMap[iconName] || 'help-outline';
    };

    return (
        <Container>
            <FilterScroll
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                    paddingRight: theme.spacing.md,
                    paddingLeft: theme.spacing.xs
                }}
            >
                {showAll && (
                    <AllChip
                        active={selectedCategory === null}
                        onPress={() => onCategoryPress(null)}
                        accessible={true}
                        accessibilityLabel="Todas as categorias"
                        accessibilityRole="button"
                    >
                        <IconContainer hasText={true}>
                            <Ionicons
                                name="apps-outline"
                                size={16}
                                color={selectedCategory === null ? theme.colors.background : theme.colors.text}
                            />
                        </IconContainer>
                        <AllText active={selectedCategory === null}>
                            Todas
                        </AllText>
                    </AllChip>
                )}

                {categories.map((category) => {
                    const isActive = selectedCategory === category.id;
                    const iconName = getIconName(category.icone);

                    return (
                        <FilterChip
                            key={category.id}
                            active={isActive}
                            categoryColor={category.cor}
                            onPress={() => onCategoryPress(category.id)}
                            accessible={true}
                            accessibilityLabel={`Filtrar por ${category.nome}`}
                            accessibilityRole="button"
                            accessibilityState={{ selected: isActive }}
                        >
                            <IconContainer hasText={true}>
                                <Ionicons
                                    name={iconName}
                                    size={16}
                                    color={isActive ? theme.colors.background : theme.colors.text}
                                />
                            </IconContainer>
                            <FilterText active={isActive}>
                                {category.nome}
                            </FilterText>
                        </FilterChip>
                    );
                })}
            </FilterScroll>
        </Container>
    );
};