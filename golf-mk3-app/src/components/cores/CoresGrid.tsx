import React, { useMemo } from 'react';
import { FlatList, Dimensions, ListRenderItem } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../../styles/theme';
import { EmptyState } from '../common';
import { CorCard } from './CorCard';
import { CorVW } from '../../types/data';

interface CoresGridProps {
    cores: CorVW[];
    onCorPress: (cor: CorVW) => void;
    loading?: boolean;
    onRefresh?: () => void;
    refreshing?: boolean;
    emptyMessage?: string;
    emptyDescription?: string;
    onEmptyAction?: () => void;
    emptyActionText?: string;
    numColumns?: number;
}

const Container = styled.View`
  flex: 1;
`;

const GridContainer = styled.View`
  flex: 1;
`;

const { width } = Dimensions.get('window');

export const CoresGrid: React.FC<CoresGridProps> = ({
    cores,
    onCorPress,
    loading = false,
    onRefresh,
    refreshing = false,
    emptyMessage = "Nenhuma cor encontrada",
    emptyDescription = "Tente ajustar sua busca ou filtros para encontrar cores.",
    onEmptyAction,
    emptyActionText = "Limpar Filtros",
    numColumns,
}) => {
    // Calcular número de colunas baseado na largura da tela
    const calculatedColumns = useMemo(() => {
        if (numColumns) return numColumns;

        const screenWidth = width - (theme.spacing.md * 2); // Padding das laterais
        const cardMinWidth = 280; // Largura mínima do card
        const spacing = theme.spacing.md; // Espaçamento entre cards

        const possibleColumns = Math.floor((screenWidth + spacing) / (cardMinWidth + spacing));
        return Math.max(1, Math.min(possibleColumns, 2)); // Máximo 2 colunas
    }, [numColumns, width]);

    // Memoizar o renderItem para melhor performance
    const renderItem: ListRenderItem<CorVW> = useMemo(
        () => ({ item, index }) => {
            const isLastInRow = calculatedColumns > 1 && (index + 1) % calculatedColumns === 0;
            const isLastItem = index === cores.length - 1;

            return (
                <CorCard
                    cor={item}
                    onPress={onCorPress}
                    size="medium"
                />
            );
        },
        [onCorPress, calculatedColumns, cores.length]
    );

    // Memoizar o keyExtractor
    const keyExtractor = useMemo(
        () => (item: CorVW) => item.codigo,
        []
    );

    // Função para obter o layout do item (otimização)
    const getItemLayout = useMemo(
        () => (data: any, index: number) => {
            const itemHeight = 120; // Altura estimada do card
            const row = Math.floor(index / calculatedColumns);
            return {
                length: itemHeight,
                offset: itemHeight * row,
                index,
            };
        },
        [calculatedColumns]
    );

    if (cores.length === 0 && !loading) {
        return (
            <Container>
                <EmptyState
                    icon="color-palette-outline"
                    title={emptyMessage}
                    description={emptyDescription}
                    actionText={onEmptyAction ? emptyActionText : undefined}
                    onAction={onEmptyAction}
                />
            </Container>
        );
    }

    return (
        <Container>
            <GridContainer>
                <FlatList
                    data={cores}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    numColumns={calculatedColumns}
                    key={calculatedColumns} // Força re-render quando colunas mudam
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: theme.spacing.xl,
                        flexGrow: 1,
                    }}
                    columnWrapperStyle={
                        calculatedColumns > 1
                            ? {
                                justifyContent: 'space-between',
                                paddingHorizontal: theme.spacing.xs
                            }
                            : undefined
                    }
                    // Performance optimizations
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={calculatedColumns * 3}
                    windowSize={10}
                    initialNumToRender={calculatedColumns * 2}
                    getItemLayout={getItemLayout}
                    // Pull to refresh
                    onRefresh={onRefresh}
                    refreshing={refreshing}
                    // Accessibility
                    accessible={true}
                    accessibilityLabel="Grade de cores VW"
                    accessibilityHint="Role para ver mais cores"
                />
            </GridContainer>
        </Container>
    );
};