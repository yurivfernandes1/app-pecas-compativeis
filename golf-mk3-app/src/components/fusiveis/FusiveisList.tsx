import React, { useMemo } from 'react';
import { FlatList, ListRenderItem } from 'react-native';
import styled from 'styled-components/native';
import { theme } from '../../styles/theme';
import { EmptyState } from '../common';
import { FusivelCard } from './FusivelCard';
import { Fusivel } from '../../types/data';

interface FusiveisListProps {
    fusiveis: Fusivel[];
    onFusivelPress?: (fusivel: Fusivel) => void;
    loading?: boolean;
    onRefresh?: () => void;
    refreshing?: boolean;
    emptyMessage?: string;
    emptyDescription?: string;
    onEmptyAction?: () => void;
    emptyActionText?: string;
    showLocation?: boolean;
}

const Container = styled.View`
  flex: 1;
`;

const ListContainer = styled.View`
  flex: 1;
`;

export const FusiveisList: React.FC<FusiveisListProps> = ({
    fusiveis,
    onFusivelPress,
    loading = false,
    onRefresh,
    refreshing = false,
    emptyMessage = "Nenhum fusível encontrado",
    emptyDescription = "Não há fusíveis cadastrados para esta seção.",
    onEmptyAction,
    emptyActionText = "Tentar Novamente",
    showLocation = true,
}) => {
    // Memoizar o renderItem para melhor performance
    const renderItem: ListRenderItem<Fusivel> = useMemo(
        () => ({ item }) => (
            <FusivelCard
                fusivel={item}
                onPress={onFusivelPress}
                showLocation={showLocation}
            />
        ),
        [onFusivelPress, showLocation]
    );

    // Memoizar o keyExtractor
    const keyExtractor = useMemo(
        () => (item: Fusivel) => `${item.localizacao}-${item.posicao}`,
        []
    );

    // Função para obter o layout do item (otimização)
    const getItemLayout = useMemo(
        () => (data: any, index: number) => ({
            length: 100, // Altura estimada do card
            offset: 100 * index,
            index,
        }),
        []
    );

    if (fusiveis.length === 0 && !loading) {
        return (
            <Container>
                <EmptyState
                    icon="flash-outline"
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
                    data={fusiveis}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingBottom: theme.spacing.xl,
                        flexGrow: 1,
                    }}
                    // Performance optimizations
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={8}
                    windowSize={10}
                    initialNumToRender={6}
                    getItemLayout={getItemLayout}
                    // Pull to refresh
                    onRefresh={onRefresh}
                    refreshing={refreshing}
                    // Accessibility
                    accessible={true}
                    accessibilityLabel="Lista de fusíveis"
                    accessibilityHint="Role para ver mais fusíveis"
                />
            </ListContainer>
        </Container>
    );
};