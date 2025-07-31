import React from 'react';
import { FlatList, View, ListRenderItem } from 'react-native';
import { useResponsiveColumns, useCardWidth, usePerformanceSettings } from '../../hooks/useResponsive';

interface ResponsiveGridProps<T> {
    data: T[];
    renderItem: ListRenderItem<T>;
    keyExtractor: (item: T, index: number) => string;
    columns?: {
        mobile?: number;
        tablet?: number;
        desktop?: number;
    };
    spacing?: number;
    onRefresh?: () => void;
    refreshing?: boolean;
    onEndReached?: () => void;
    onEndReachedThreshold?: number;
    ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null;
    ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
    ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;
    contentContainerStyle?: any;
    showsVerticalScrollIndicator?: boolean;
}

export const ResponsiveGrid = <T,>({
    data,
    renderItem,
    keyExtractor,
    columns = {
        mobile: 1,
        tablet: 2,
        desktop: 3,
    },
    spacing = 16,
    onRefresh,
    refreshing = false,
    onEndReached,
    onEndReachedThreshold = 0.1,
    ListEmptyComponent,
    ListHeaderComponent,
    ListFooterComponent,
    contentContainerStyle,
    showsVerticalScrollIndicator = false,
    ...props
}: ResponsiveGridProps<T>) => {
    const numColumns = useResponsiveColumns(
        columns.mobile,
        columns.tablet,
        columns.desktop
    );

    const cardWidth = useCardWidth(numColumns, spacing);
    const performanceSettings = usePerformanceSettings();

    // Wrapper para renderItem que adiciona largura responsiva
    const responsiveRenderItem: ListRenderItem<T> = ({ item, index }) => {
        const isLastInRow = numColumns > 1 && (index + 1) % numColumns === 0;
        const isLastItem = index === data.length - 1;

        return (
            <View
                style={{
                    width: numColumns > 1 ? cardWidth : '100%',
                    marginRight: !isLastInRow && numColumns > 1 ? spacing : 0,
                    marginBottom: !isLastItem ? spacing : 0,
                }}
            >
                {renderItem({ item, index, separators: {} as any })}
            </View>
        );
    };

    // Função para obter layout do item (otimização)
    const getItemLayout = (data: any, index: number) => {
        const itemHeight = 200; // Altura estimada do item
        const row = Math.floor(index / numColumns);
        return {
            length: itemHeight,
            offset: itemHeight * row,
            index,
        };
    };

    return (
        <FlatList
            data={data}
            renderItem={responsiveRenderItem}
            keyExtractor={keyExtractor}
            numColumns={numColumns}
            key={numColumns} // Força re-render quando colunas mudam
            columnWrapperStyle={
                numColumns > 1
                    ? {
                        justifyContent: 'flex-start',
                        paddingHorizontal: spacing / 2
                    }
                    : undefined
            }
            contentContainerStyle={[
                {
                    padding: spacing,
                    flexGrow: 1,
                },
                contentContainerStyle,
            ]}
            showsVerticalScrollIndicator={showsVerticalScrollIndicator}

            // Performance optimizations
            removeClippedSubviews={performanceSettings.removeClippedSubviews}
            maxToRenderPerBatch={performanceSettings.batchSize}
            windowSize={performanceSettings.windowSize}
            initialNumToRender={performanceSettings.batchSize}
            getItemLayout={getItemLayout}

            // Pull to refresh
            onRefresh={onRefresh}
            refreshing={refreshing}

            // Infinite scroll
            onEndReached={onEndReached}
            onEndReachedThreshold={onEndReachedThreshold}

            // Components
            ListEmptyComponent={ListEmptyComponent}
            ListHeaderComponent={ListHeaderComponent}
            ListFooterComponent={ListFooterComponent}

            {...props}
        />
    );
};