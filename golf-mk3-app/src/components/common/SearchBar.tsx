import React from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';

interface SearchBarProps {
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    onFilter?: () => void;
    showFilter?: boolean;
    onFocus?: () => void;
    onBlur?: () => void;
    autoFocus?: boolean;
}

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.full}px;
  padding: ${theme.spacing.xs}px ${theme.spacing.md}px;
  margin: ${theme.spacing.xs}px 0;
  border: 1px solid ${theme.colors.borderLight};
`;

const SearchIcon = styled.View`
  margin-right: ${theme.spacing.sm}px;
`;

const Input = styled(TextInput)`
  flex: 1;
  font-size: ${theme.typography.body.fontSize}px;
  color: ${theme.colors.text};
  padding: ${theme.spacing.sm}px 0;
`;

const FilterButton = styled(TouchableOpacity)`
  margin-left: ${theme.spacing.sm}px;
  padding: ${theme.spacing.xs}px;
  border-radius: ${theme.borderRadius.sm}px;
`;

export const SearchBar: React.FC<SearchBarProps> = ({
    placeholder,
    value,
    onChangeText,
    onFilter,
    showFilter = true,
    onFocus,
    onBlur,
    autoFocus = false,
    ...props
}) => {
    return (
        <Container>
            <SearchIcon>
                <Ionicons
                    name="search-outline"
                    size={20}
                    color={theme.colors.textSecondary}
                />
            </SearchIcon>

            <Input
                placeholder={placeholder}
                placeholderTextColor={theme.colors.textSecondary}
                value={value}
                onChangeText={onChangeText}
                onFocus={onFocus}
                onBlur={onBlur}
                autoFocus={autoFocus}
                returnKeyType="search"
                accessible={true}
                accessibilityLabel={`Buscar ${placeholder.toLowerCase()}`}
                accessibilityHint="Digite para buscar"
                {...props}
            />

            {showFilter && onFilter && (
                <FilterButton
                    onPress={onFilter}
                    accessible={true}
                    accessibilityLabel="Filtros"
                    accessibilityHint="Toque para abrir filtros"
                    accessibilityRole="button"
                >
                    <Ionicons
                        name="filter-outline"
                        size={20}
                        color={theme.colors.textSecondary}
                    />
                </FilterButton>
            )}
        </Container>
    );
};