import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../styles/theme';
import { SearchBar, LoadingSpinner, FilterModal } from '../../components/common';
import { CoresGrid } from '../../components/cores';
import { CoresScreenNavigationProp } from '../../types/navigation';
import { CorVW } from '../../types/data';
import { useCoresSearch } from '../../hooks/useSearch';
import DataService from '../../services/DataService';

interface CoresScreenProps {
    navigation: CoresScreenNavigationProp;
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

const FiltersSection = styled.View`
  margin-bottom: ${theme.spacing.md}px;
`;

const FilterScroll = styled(ScrollView)`
  flex-grow: 0;
`;

const FilterChip = styled.TouchableOpacity<{ active: boolean }>`
  background-color: ${({ active }) => active ? theme.colors.primary : theme.colors.surface};
  border-radius: ${theme.borderRadius.full}px;
  padding: ${theme.spacing.sm}px ${theme.spacing.md}px;
  margin-right: ${theme.spacing.sm}px;
  border: 1px solid ${({ active }) => active ? theme.colors.primary : theme.colors.border};
  min-height: 36px;
  justify-content: center;
`;

const FilterText = styled(Text) <{ active: boolean }>`
  color: ${({ active }) => active ? theme.colors.background : theme.colors.text};
  font-size: ${theme.typography.small.fontSize}px;
  font-weight: 500;
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

const CoresScreen: React.FC<CoresScreenProps> = ({ navigation }) => {
    const [cores, setCores] = useState<CorVW[]>([]);
    const [anos, setAnos] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showFilterModal, setShowFilterModal] = useState(false);

    const tipos = [
        { id: 'solida', label: 'Sólida', value: 'solida' },
        { id: 'metalica', label: 'Metálica', value: 'metalica' },
        { id: 'perolizada', label: 'Perolizada', value: 'perolizada' }
    ];

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
        hasActiveFilters
    } = useCoresSearch(cores);

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
            const data = await dataService.loadCoresData();

            setCores(data.cores);
            setAnos(data.anos);
        } catch (error) {
            console.error('Erro ao carregar cores:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleYearPress = (year: string) => {
        const currentFilters = { ...filters };
        if (currentFilters.ano === year) {
            delete currentFilters.ano;
        } else {
            currentFilters.ano = year;
        }
        updateFilters(currentFilters);
    };

    const handleTypePress = (type: string) => {
        const currentFilters = { ...filters };
        if (currentFilters.tipo === type) {
            delete currentFilters.tipo;
        } else {
            currentFilters.tipo = type;
        }
        updateFilters(currentFilters);
    };

    const handleCorPress = (cor: CorVW) => {
        // TODO: Navegar para tela de detalhes ou modal
        console.log('Cor selecionada:', cor.codigo, cor.nome);
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
            id: 'ano',
            title: 'Ano',
            options: anos.map(ano => ({
                id: ano,
                label: ano,
                value: ano
            })),
            selectedValue: filters.ano
        },
        {
            id: 'tipo',
            title: 'Tipo de Tinta',
            options: tipos,
            selectedValue: filters.tipo
        }
    ];

    if (loading) {
        return (
            <Container>
                <LoadingSpinner message="Carregando cores..." />
            </Container>
        );
    }

    return (
        <Container>
            <Content>
                <SearchSection>
                    <SearchBar
                        placeholder="Buscar por código ou nome..."
                        value={query}
                        onChangeText={updateQuery}
                        onFilter={handleFilterPress}
                        showFilter={true}
                    />
                </SearchSection>

                <FiltersSection>
                    <FilterScroll
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingRight: theme.spacing.md,
                            paddingLeft: theme.spacing.xs
                        }}
                    >
                        {/* Filtros de Ano */}
                        {anos.slice(0, 4).map((ano) => (
                            <FilterChip
                                key={`ano-${ano}`}
                                active={filters.ano === ano}
                                onPress={() => handleYearPress(ano)}
                                accessible={true}
                                accessibilityLabel={`Filtrar por ano ${ano}`}
                                accessibilityRole="button"
                            >
                                <FilterText active={filters.ano === ano}>
                                    {ano}
                                </FilterText>
                            </FilterChip>
                        ))}

                        {/* Filtros de Tipo */}
                        {tipos.map((tipo) => (
                            <FilterChip
                                key={`tipo-${tipo.id}`}
                                active={filters.tipo === tipo.value}
                                onPress={() => handleTypePress(tipo.value)}
                                accessible={true}
                                accessibilityLabel={`Filtrar por ${tipo.label}`}
                                accessibilityRole="button"
                            >
                                <FilterText active={filters.tipo === tipo.value}>
                                    {tipo.label}
                                </FilterText>
                            </FilterChip>
                        ))}
                    </FilterScroll>
                </FiltersSection>

                <ResultsHeader>
                    <ResultsCount>
                        {totalResults} cor{totalResults !== 1 ? 'es' : ''} encontrada{totalResults !== 1 ? 's' : ''}
                    </ResultsCount>
                </ResultsHeader>

                <CoresGrid
                    cores={results}
                    onCorPress={handleCorPress}
                    onRefresh={handleRefresh}
                    refreshing={refreshing}
                    emptyMessage="Nenhuma cor encontrada"
                    emptyDescription="Tente ajustar sua busca ou filtros para encontrar cores."
                    onEmptyAction={hasActiveFilters ? handleClearFilters : undefined}
                    emptyActionText="Limpar Filtros"
                />

                <FilterModal
                    visible={showFilterModal}
                    onClose={() => setShowFilterModal(false)}
                    onApply={handleApplyFilters}
                    onClear={handleClearFilters}
                    sections={filterSections}
                    title="Filtrar Cores"
                />
            </Content>
        </Container>
    );
};

export default CoresScreen;