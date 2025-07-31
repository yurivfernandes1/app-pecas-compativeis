import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../styles/theme';
import { LoadingSpinner } from '../../components/common';
import { FusivelMap, FusiveisList } from '../../components/fusiveis';
import { FusiveisScreenNavigationProp } from '../../types/navigation';
import { Fusivel, MapaFusivel } from '../../types/data';
import { useFusiveisSearch } from '../../hooks/useSearch';
import DataService from '../../services/DataService';

interface FusiveisScreenProps {
    navigation: FusiveisScreenNavigationProp;
}

const Container = styled(SafeAreaView)`
  flex: 1;
  background-color: ${theme.colors.background};
`;

const Content = styled.View`
  flex: 1;
  padding: ${theme.spacing.md}px;
`;

const TabsSection = styled.View`
  flex-direction: row;
  margin-bottom: ${theme.spacing.lg}px;
  background-color: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.md}px;
  padding: ${theme.spacing.xs}px;
`;

const Tab = styled(TouchableOpacity) <{ active: boolean }>`
  flex: 1;
  padding: ${theme.spacing.sm}px ${theme.spacing.md}px;
  border-radius: ${theme.borderRadius.sm}px;
  background-color: ${({ active }) => active ? theme.colors.background : 'transparent'};
  align-items: center;
`;

const TabText = styled(Text) <{ active: boolean }>`
  font-size: ${theme.typography.body.fontSize}px;
  font-weight: ${({ active }) => active ? '600' : '400'};
  color: ${({ active }) => active ? theme.colors.text : theme.colors.textSecondary};
`;

const ListHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.md}px;
`;

const ListTitle = styled(Text)`
  font-size: ${theme.typography.h3.fontSize}px;
  font-weight: ${theme.typography.h3.fontWeight};
  color: ${theme.colors.text};
`;

const CountText = styled(Text)`
  font-size: ${theme.typography.small.fontSize}px;
  color: ${theme.colors.textSecondary};
`;

const FusiveisScreen: React.FC<FusiveisScreenProps> = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState<'caixa_principal' | 'caixa_reles'>('caixa_principal');
    const [fusiveis, setFusiveis] = useState<Fusivel[]>([]);
    const [mapas, setMapas] = useState<MapaFusivel[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Usar hook de busca para fusíveis
    const {
        results: filteredFusiveis,
        totalResults,
        updateFilters
    } = useFusiveisSearch(fusiveis, '', { localizacao: activeTab });

    useEffect(() => {
        loadData();
    }, []);

    // Atualizar filtros quando tab muda
    useEffect(() => {
        updateFilters({ localizacao: activeTab });
    }, [activeTab, updateFilters]);

    const loadData = async (isRefresh = false) => {
        try {
            if (!isRefresh) {
                setLoading(true);
            } else {
                setRefreshing(true);
            }

            const dataService = DataService.getInstance();
            const data = await dataService.loadFusiveisData();

            setFusiveis(data.fusiveis);
            setMapas(data.mapas);
        } catch (error) {
            console.error('Erro ao carregar fusíveis:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleTabPress = (tab: 'caixa_principal' | 'caixa_reles') => {
        setActiveTab(tab);
    };

    const handleFusivelPress = (fusivel: Fusivel) => {
        console.log('Fusível selecionado:', fusivel.posicao, fusivel.funcao);
    };

    const handleRefresh = () => {
        loadData(true);
    };

    // Obter dados do mapa atual
    const currentMapData = mapas.find(mapa => mapa.tipo === activeTab);

    // Obter título da seção atual
    const getSectionTitle = () => {
        const fusiveisCount = filteredFusiveis.filter(f => f.tipo === 'fusivel').length;
        const relesCount = filteredFusiveis.filter(f => f.tipo === 'rele').length;

        if (activeTab === 'caixa_principal') {
            return `Fusíveis (${fusiveisCount})`;
        } else {
            return `Relés (${relesCount})`;
        }
    };

    if (loading) {
        return (
            <Container>
                <LoadingSpinner message="Carregando fusíveis..." />
            </Container>
        );
    }

    return (
        <Container>
            <Content>
                <TabsSection>
                    <Tab
                        active={activeTab === 'caixa_principal'}
                        onPress={() => handleTabPress('caixa_principal')}
                        accessible={true}
                        accessibilityLabel="Caixa Principal"
                        accessibilityRole="tab"
                        accessibilityState={{ selected: activeTab === 'caixa_principal' }}
                    >
                        <TabText active={activeTab === 'caixa_principal'}>
                            Caixa Principal
                        </TabText>
                    </Tab>

                    <Tab
                        active={activeTab === 'caixa_reles'}
                        onPress={() => handleTabPress('caixa_reles')}
                        accessible={true}
                        accessibilityLabel="Caixa de Relés"
                        accessibilityRole="tab"
                        accessibilityState={{ selected: activeTab === 'caixa_reles' }}
                    >
                        <TabText active={activeTab === 'caixa_reles'}>
                            Caixa de Relés
                        </TabText>
                    </Tab>
                </TabsSection>

                <FusivelMap
                    fusiveis={filteredFusiveis}
                    onFusivelPress={handleFusivelPress}
                    mapType={activeTab}
                    mapData={currentMapData}
                />

                <ListHeader>
                    <ListTitle>
                        {getSectionTitle()}
                    </ListTitle>
                    <CountText>
                        {totalResults} item{totalResults !== 1 ? 's' : ''}
                    </CountText>
                </ListHeader>

                <FusiveisList
                    fusiveis={filteredFusiveis}
                    onFusivelPress={handleFusivelPress}
                    onRefresh={handleRefresh}
                    refreshing={refreshing}
                    emptyMessage="Nenhum item encontrado"
                    emptyDescription={`Não há ${activeTab === 'caixa_principal' ? 'fusíveis' : 'relés'} cadastrados para esta seção.`}
                    showLocation={false} // Não mostrar localização pois já estamos filtrando por ela
                />
            </Content>
        </Container>
    );
};

export default FusiveisScreen;