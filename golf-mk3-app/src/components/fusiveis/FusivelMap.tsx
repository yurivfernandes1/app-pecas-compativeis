import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Modal } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';
import { Fusivel, MapaFusivel } from '../../types/data';

interface FusivelMapProps {
    fusiveis: Fusivel[];
    onFusivelPress: (fusivel: Fusivel) => void;
    mapType: 'caixa_principal' | 'caixa_reles';
    mapData?: MapaFusivel;
}

const Container = styled.View`
  background-color: ${theme.colors.surface};
  border-radius: ${theme.borderRadius.md}px;
  padding: ${theme.spacing.lg}px;
  margin-bottom: ${theme.spacing.lg}px;
`;

const MapContainer = styled.View`
  position: relative;
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius.md}px;
  border: 2px solid ${theme.colors.border};
  overflow: hidden;
`;

const MapPlaceholder = styled.View<{ width: number; height: number }>`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  justify-content: center;
  align-items: center;
  background-color: ${theme.colors.surface};
`;

const PlaceholderContent = styled.View`
  align-items: center;
`;

const PlaceholderText = styled(Text)`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${theme.colors.textSecondary};
  text-align: center;
  margin-top: ${theme.spacing.sm}px;
`;

const FusivelPoint = styled(TouchableOpacity) <{
    x: number;
    y: number;
    tipo: string;
}>`
  position: absolute;
  left: ${({ x }) => x - 12}px;
  top: ${({ y }) => y - 12}px;
  width: 24px;
  height: 24px;
  border-radius: 12px;
  background-color: ${({ tipo }) => tipo === 'fusivel' ? theme.colors.primary : theme.colors.info};
  border: 2px solid ${theme.colors.background};
  justify-content: center;
  align-items: center;
  shadow-color: ${theme.colors.text};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.2;
  shadow-radius: 4px;
  elevation: 4;
`;

const PointLabel = styled(Text)`
  color: ${theme.colors.background};
  font-size: 10px;
  font-weight: bold;
`;

const LegendContainer = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin-top: ${theme.spacing.md}px;
  padding-top: ${theme.spacing.md}px;
  border-top-width: 1px;
  border-top-color: ${theme.colors.border};
`;

const LegendItem = styled.View`
  flex-direction: row;
  align-items: center;
`;

const LegendDot = styled.View<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: ${({ color }) => color};
  margin-right: ${theme.spacing.sm}px;
`;

const LegendText = styled(Text)`
  font-size: ${theme.typography.small.fontSize}px;
  color: ${theme.colors.text};
`;

const DetailModal = styled(Modal)``;

const ModalBackdrop = styled.View`
  flex: 1;
  background-color: ${theme.colors.backdrop};
  justify-content: center;
  align-items: center;
  padding: ${theme.spacing.lg}px;
`;

const ModalContent = styled.View`
  background-color: ${theme.colors.background};
  border-radius: ${theme.borderRadius.lg}px;
  padding: ${theme.spacing.lg}px;
  width: 100%;
  max-width: 320px;
  shadow-color: ${theme.colors.text};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 8px;
  elevation: 8;
`;

const ModalHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing.lg}px;
`;

const ModalTitle = styled(Text)`
  font-size: ${theme.typography.h2.fontSize}px;
  font-weight: ${theme.typography.h2.fontWeight};
  color: ${theme.colors.text};
`;

const CloseButton = styled(TouchableOpacity)`
  padding: ${theme.spacing.sm}px;
  border-radius: ${theme.borderRadius.full}px;
`;

const DetailRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.md}px;
`;

const DetailLabel = styled(Text)`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${theme.colors.textSecondary};
`;

const DetailValue = styled(Text)`
  font-size: ${theme.typography.body.fontSize}px;
  font-weight: 600;
  color: ${theme.colors.text};
`;

const FunctionText = styled(Text)`
  font-size: ${theme.typography.body.fontSize}px;
  color: ${theme.colors.text};
  line-height: ${theme.typography.body.lineHeight}px;
  text-align: center;
  margin-top: ${theme.spacing.sm}px;
`;

const TypeBadge = styled.View<{ tipo: string }>`
  background-color: ${({ tipo }) => tipo === 'fusivel' ? theme.colors.primary : theme.colors.info};
  border-radius: ${theme.borderRadius.sm}px;
  padding: ${theme.spacing.xs}px ${theme.spacing.sm}px;
`;

const TypeText = styled(Text)`
  color: ${theme.colors.background};
  font-size: ${theme.typography.small.fontSize}px;
  font-weight: 600;
  text-transform: capitalize;
`;

const { width: screenWidth } = Dimensions.get('window');

export const FusivelMap: React.FC<FusivelMapProps> = ({
    fusiveis,
    onFusivelPress,
    mapType,
    mapData,
}) => {
    const [selectedFusivel, setSelectedFusivel] = useState<Fusivel | null>(null);
    const [showModal, setShowModal] = useState(false);

    // Calcular dimensões do mapa baseado na tela
    const mapWidth = screenWidth - (theme.spacing.md * 4); // Padding do container + card
    const mapHeight = Math.min(mapWidth * 0.75, 250); // Proporção 4:3, máximo 250px

    // Filtrar fusíveis para o tipo de mapa atual
    const mapFusiveis = fusiveis.filter(fusivel => fusivel.localizacao === mapType);

    const handleFusivelPress = (fusivel: Fusivel) => {
        setSelectedFusivel(fusivel);
        setShowModal(true);
        onFusivelPress(fusivel);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedFusivel(null);
    };

    const renderFusivelPoints = () => {
        return mapFusiveis.map((fusivel) => {
            if (!fusivel.coordenadas) return null;

            // Escalar coordenadas para o tamanho do mapa
            const scaleX = mapWidth / (mapData?.dimensoes.width || 800);
            const scaleY = mapHeight / (mapData?.dimensoes.height || 600);

            const x = fusivel.coordenadas.x * scaleX;
            const y = fusivel.coordenadas.y * scaleY;

            return (
                <FusivelPoint
                    key={`${fusivel.localizacao}-${fusivel.posicao}`}
                    x={x}
                    y={y}
                    tipo={fusivel.tipo}
                    onPress={() => handleFusivelPress(fusivel)}
                    accessible={true}
                    accessibilityLabel={`${fusivel.posicao} - ${fusivel.funcao}`}
                    accessibilityRole="button"
                >
                    <PointLabel>
                        {fusivel.posicao.replace(/[FR]/g, '')}
                    </PointLabel>
                </FusivelPoint>
            );
        });
    };

    return (
        <Container>
            <MapContainer>
                <MapPlaceholder width={mapWidth} height={mapHeight}>
                    <PlaceholderContent>
                        <Ionicons
                            name="map-outline"
                            size={48}
                            color={theme.colors.textLight}
                        />
                        <PlaceholderText>
                            Diagrama {mapType === 'caixa_principal' ? 'da Caixa Principal' : 'da Caixa de Relés'}
                        </PlaceholderText>
                    </PlaceholderContent>

                    {/* Renderizar pontos dos fusíveis */}
                    {renderFusivelPoints()}
                </MapPlaceholder>
            </MapContainer>

            <LegendContainer>
                <LegendItem>
                    <LegendDot color={theme.colors.primary} />
                    <LegendText>Fusíveis</LegendText>
                </LegendItem>

                <LegendItem>
                    <LegendDot color={theme.colors.info} />
                    <LegendText>Relés</LegendText>
                </LegendItem>

                <LegendItem>
                    <Ionicons
                        name="hand-left-outline"
                        size={16}
                        color={theme.colors.textSecondary}
                    />
                    <LegendText style={{ marginLeft: theme.spacing.xs }}>
                        Toque para detalhes
                    </LegendText>
                </LegendItem>
            </LegendContainer>

            {/* Modal de detalhes */}
            <DetailModal
                visible={showModal}
                transparent
                animationType="fade"
                onRequestClose={closeModal}
            >
                <ModalBackdrop>
                    <ModalContent>
                        <ModalHeader>
                            <ModalTitle>
                                {selectedFusivel?.posicao}
                            </ModalTitle>
                            <CloseButton
                                onPress={closeModal}
                                accessible={true}
                                accessibilityLabel="Fechar detalhes"
                                accessibilityRole="button"
                            >
                                <Ionicons
                                    name="close"
                                    size={24}
                                    color={theme.colors.textSecondary}
                                />
                            </CloseButton>
                        </ModalHeader>

                        {selectedFusivel && (
                            <>
                                <DetailRow>
                                    <DetailLabel>Tipo:</DetailLabel>
                                    <TypeBadge tipo={selectedFusivel.tipo}>
                                        <TypeText>{selectedFusivel.tipo}</TypeText>
                                    </TypeBadge>
                                </DetailRow>

                                <DetailRow>
                                    <DetailLabel>Amperagem:</DetailLabel>
                                    <DetailValue>{selectedFusivel.amperagem}</DetailValue>
                                </DetailRow>

                                <DetailRow>
                                    <DetailLabel>Localização:</DetailLabel>
                                    <DetailValue>
                                        {selectedFusivel.localizacao === 'caixa_principal'
                                            ? 'Caixa Principal'
                                            : 'Caixa de Relés'
                                        }
                                    </DetailValue>
                                </DetailRow>

                                <FunctionText>
                                    {selectedFusivel.funcao}
                                </FunctionText>
                            </>
                        )}
                    </ModalContent>
                </ModalBackdrop>
            </DetailModal>
        </Container>
    );
};