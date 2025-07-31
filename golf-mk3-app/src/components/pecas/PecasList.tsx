import React, { useMemo } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../../styles/theme';
import { EmptyState } from '../common';
import { PecaCard } from './PecaCard';
import { Peca } from '../../types/data';

interface PecasListProps {
    pecas: Peca[];
    categories: any[];
    onPecaPress: (peca: Peca) => void;
    loading?: boolean;
    onRefresh?: () => void;
    refreshing?: boolean;
    emptyMessage?: string;
    emptyDescription?: string;
    onEmptyAction?: () => void;
    emptyActionText?: string;
}

const Container = styled.View`
  flex: 1;
`;

const ListContainer = styled.View`
  flex: 1;
`;

export const PecasList: React.FC<PecasListProps> = ({
    pecas,
    categories,
    onPecaPress,
    loading = false,
    onRefresh,
    refreshing = false,
    emptyMessage = "Nenhuma peça encontrada",
    emptyDescription = "Tente ajustar sua busca ou filtros para encontrar peças compatíveis.",
    onEmptyAction,
    emptyActionText = "Limpar Filtros",
}) => {
    // Memoizar o renderItem para melhor performance
    const renderItem: ListRenderItem<Peca> = useMemo(
        () => ({ item }) => (
            <PecaCard
                peca={item}
                onPress={onPecaPress}
                categories={categories}
                showCategory={true}
            />
        ),
        [onPecaPress, categories]
    );

    // Memoizar o keyExtractor
    const keyExtractor = useMemo(
        () => (item: Peca) => item.id,
        []
    );

    // Função para obter o layout do item (otimização)
    const getItemLayout = useMemo(
        () => (data: any, index: number) => ({
            length: 200, // Altura estimada do card
            offset: 200 * index,
            index,
        }),
        []
    );

    if (pecas.length === 0 && !loading) {
        return (
            <Container>
                <EmptyState
                    icon="search-outline"
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
            <ListContainer>
                <FlatList
                    data={pecas}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: theme.spacing.xl,
                        flexGrow: 1,
                    }}
                    // Performance optimizations
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={10}
                    windowSize={10}
                    initialNumToRender={5}
                    getItemLayout={getItemLayout}
                    // Pull to refresh
                    onRefresh={onRefresh}
                    refreshing={refreshing}
                    // Accessibility
                    accessible={true}
                    accessibilityLabel="Lista de peças compatíveis"
                    accessibilityHint="Role para ver mais peças"
                />
            </ListContainer>
        </Container>
    );
};