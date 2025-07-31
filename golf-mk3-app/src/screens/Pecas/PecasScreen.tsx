import React, { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../styles/theme';
import { SearchBar, LoadingSpinner, FilterModal } from '../../components/common';
import { PecasList, CategoryFilter } from '../../components/pecas';
import { PecasScreenNavigationProp } from '../../types/navigation';
import { Peca } from '../../types/data';
import { usePecasSearch } from '../../hooks/useSearch';
import DataService from '../../services/DataService';

interface PecasScreenProps {
    navigation: PecasScreenNavigationProp;
}

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Content = styled.View`
  flex: 1;
  padding: ${theme.spacing.md}px;
`;

const SearchSection = styled.View`
  margin-bottom: ${theme.spacing.md}px;
`;

const ResultsHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.md}px;
`;

const ResultsCount = styled(Text)`
  font-size: ${theme.typography.small.fontSize}px;
  color: ${theme.colors.textSecondary};
`;

const PecasScreen: React.FC<PecasScreenProps> = ({ navigation }) => {
    const [pecas, setPecas] = useState<Peca[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);

    // Usar hook de busca
    const {
        query,
        filters,
        results,
        totalResults,
        suggestions,
        updateQuery,
        updateFilters,
        clearSearch,
        applyFilter,
        removeFilter,
        hasActiveFilters
    } = usePecasSearch(pecas);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async (isRefresh = false) => {
        try {
            if (!isRefresh) {
                setLoading(true);
            } else {
                setRefreshing(true);
            }

            const dataService = DataService.getInstance();
            const data = await dataService.loadPecasData();

            setPecas(data.pecas);
            setCategories(data.categorias);
        } catch (error) {
            console.error('Erro ao carregar peças:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleCategoryPress = (categoryId: string | null) => {
        if (categoryId) {
            applyFilter('categoria', categoryId);
        } else {
            removeFilter('categoria');
        }
    };

    const handlePecaPress = (peca: Peca) => {
        // TODO: Navegar para tela de detalhes
        console.log('Peça selecionada:', peca.nome);
    };

    const handleRefresh = () => {
        loadData(true);
    };

    const handleClearFilters = () => {
        clearSearch();
    };

    const handleFilterPress = () => {
        setShowFilterModal(true);
    };

    const handleApplyFilters = (newFilters: Record<string, any>) => {
        updateFilters(newFilters);
    };

    // Preparar seções do modal de filtros
    const filterSections = [
        {
            id: 'categoria',
            title: 'Categoria',
            options: categories.map(cat => ({
                id: cat.id,
                label: cat.nome,
                value: cat.id
            })),
            selectedValue: filters.categoria
        },
        {
            id: 'modelo_golf',
            title: 'Modelo Golf',
            options: [
                { id: 'gti', label: 'GTI', value: 'GTI' },
                { id: 'gl', label: 'GL', value: 'GL' },
                { id: 'glx', label: 'GLX', value: 'GLX' }
            ],
            selectedValue: filters.modelo_golf
        }
    ];

    if (loading) {
        return (
            <Container>
                <LoadingSpinner message="Carregando peças..." />
            </Container>
        );
    }

    return (
        <Container>
            <Content>
                <SearchSection>
                    <SearchBar
                        placeholder="Buscar peças..."
                        value={query}
                        onChangeText={updateQuery}
                        onFilter={handleFilterPress}
                        showFilter={true}
                    />
                </SearchSection>

                <CategoryFilter
                    categories={categories}
                    selectedCategory={filters.categoria || null}
                    onCategoryPress={handleCategoryPress}
                    showAll={true}
                />

                <ResultsHeader>
                    <ResultsCount>
                        {totalResults} peça{totalResults !== 1 ? 's' : ''} encontrada{totalResults !== 1 ? 's' : ''}
                    </ResultsCount>
                </ResultsHeader>

                <PecasList
                    pecas={results}
                    categories={categories}
                    onPecaPress={handlePecaPress}
                    onRefresh={handleRefresh}
                    refreshing={refreshing}
                    emptyMessage="Nenhuma peça encontrada"
                    emptyDescription="Tente ajustar sua busca ou filtros para encontrar peças compatíveis."
                    onEmptyAction={hasActiveFilters ? handleClearFilters : undefined}
                    emptyActionText="Limpar Filtros"
                />

                <FilterModal
                    visible={showFilterModal}
                    onClose={() => setShowFilterModal(false)}
                    onApply={handleApplyFilters}
                    onClear={handleClearFilters}
                    sections={filterSections}
                    title="Filtrar Peças"
                />
            </Content>
        </Container>
    );
};

export default PecasScreen;