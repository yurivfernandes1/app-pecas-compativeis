import React from 'react';
import { Modal, Text, TouchableOpacity, ScrollView } from 'react-native';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';
import { Button } from './Button';

interface FilterOption {
    id: string;
    label: string;
    value: any;
}

interface FilterSection {
    id: string;
    title: string;
    options: FilterOption[];
    selectedValue?: any;
    multiSelect?: boolean;
}

interface FilterModalProps {
    visible: boolean;
    onClose: () => void;
    onApply: (filters: Record<string, any>) => void;
    onClear: () => void;
    sections: FilterSection[];
    title?: string;
}

const ModalContainer = styled(Modal)``;

const Backdrop = styled.View`
  flex: 1;
  background-color: ${theme.colors.backdrop};
  justify-content: flex-end;
`;

const Content = styled(SafeAreaView)`
  background-color: ${theme.colors.background};
  border-top-left-radius: ${theme.borderRadius.xl}px;
  border-top-right-radius: ${theme.borderRadius.xl}px;
  max-height: 80%;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${theme.spacing.lg}px;
  border-bottom-width: 1px;
  border-bottom-color: ${theme.colors.border};
`;

const Title = styled(Text)`
  font-size: ${theme.typography.h2.fontSize}px;
  font-weight: ${theme.typography.h2.fontWeight};
  color: ${theme.colors.text};
`;

const CloseButton = styled(TouchableOpacity)`
  padding: ${theme.spacing.sm}px;
  border-radius: ${theme.borderRadius.full}px;
`;

const ScrollContent = styled(ScrollView)`
  flex: 1;
  padding: ${theme.spacing.lg}px;
`;

const Section = styled.View`
  margin-bottom: ${theme.spacing.xl}px;
`;

const SectionTitle = styled(Text)`
  font-size: ${theme.typography.h3.fontSize}px;
  font-weight: ${theme.typography.h3.fontWeight};
  color: ${theme.colors.text};
  margin-bottom: ${theme.spacing.md}px;
`;

const OptionsList = styled.View`
  gap: ${theme.spacing.sm}px;
`;

const OptionItem = styled(TouchableOpacity) <{ selected: boolean }>`
  flex-direction: row;
  align-items: center;
  padding: ${theme.spacing.md}px;
  background-color: ${({ selected }) => selected ? theme.colors.surface : 'transparent'};
  border-radius: ${theme.borderRadius.md}px;
  border: 1px solid ${({ selected }) => selected ? theme.colors.primary : theme.colors.border};
`;

const OptionText = styled(Text) <{ selected: boolean }>`
  flex: 1;
  font-size: ${theme.typography.body.fontSize}px;
  color: ${({ selected }) => selected ? theme.colors.primary : theme.colors.text};
  font-weight: ${({ selected }) => selected ? '600' : '400'};
  margin-left: ${theme.spacing.sm}px;
`;

const CheckIcon = styled.View<{ selected: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 10px;
  border: 2px solid ${({ selected }) => selected ? theme.colors.primary : theme.colors.border};
  background-color: ${({ selected }) => selected ? theme.colors.primary : 'transparent'};
  align-items: center;
  justify-content: center;
`;

const Footer = styled.View`
  flex-direction: row;
  padding: ${theme.spacing.lg}px;
  border-top-width: 1px;
  border-top-color: ${theme.colors.border};
  gap: ${theme.spacing.md}px;
`;

export const FilterModal: React.FC<FilterModalProps> = ({
    visible,
    onClose,
    onApply,
    onClear,
    sections,
    title = "Filtros",
}) => {
    const [selectedFilters, setSelectedFilters] = React.useState<Record<string, any>>({});

    React.useEffect(() => {
        // Inicializar filtros selecionados
        const initialFilters: Record<string, any> = {};
        sections.forEach(section => {
            if (section.selectedValue !== undefined) {
                initialFilters[section.id] = section.selectedValue;
            }
        });
        setSelectedFilters(initialFilters);
    }, [sections, visible]);

    const handleOptionPress = (sectionId: string, option: FilterOption, multiSelect: boolean = false) => {
        setSelectedFilters(prev => {
            const newFilters = { ...prev };

            if (multiSelect) {
                // Multi-select logic
                const currentValues = newFilters[sectionId] || [];
                const isSelected = currentValues.includes(option.value);

                if (isSelected) {
                    newFilters[sectionId] = currentValues.filter((v: any) => v !== option.value);
                } else {
                    newFilters[sectionId] = [...currentValues, option.value];
                }

                // Remove empty arrays
                if (newFilters[sectionId].length === 0) {
                    delete newFilters[sectionId];
                }
            } else {
                // Single select logic
                if (newFilters[sectionId] === option.value) {
                    delete newFilters[sectionId];
                } else {
                    newFilters[sectionId] = option.value;
                }
            }

            return newFilters;
        });
    };

    const isOptionSelected = (sectionId: string, option: FilterOption, multiSelect: boolean = false): boolean => {
        const sectionValue = selectedFilters[sectionId];

        if (multiSelect) {
            return Array.isArray(sectionValue) && sectionValue.includes(option.value);
        } else {
            return sectionValue === option.value;
        }
    };

    const handleApply = () => {
        onApply(selectedFilters);
        onClose();
    };

    const handleClear = () => {
        setSelectedFilters({});
        onClear();
    };

    const hasActiveFilters = Object.keys(selectedFilters).length > 0;

    return (
        <ModalContainer
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <Backdrop>
                <TouchableOpacity
                    style={{ flex: 1 }}
                    activeOpacity={1}
                    onPress={onClose}
                />

                <Content>
                    <Header>
                        <Title>{title}</Title>
                        <CloseButton
                            onPress={onClose}
                            accessible={true}
                            accessibilityLabel="Fechar filtros"
                            accessibilityRole="button"
                        >
                            <Ionicons
                                name="close"
                                size={24}
                                color={theme.colors.textSecondary}
                            />
                        </CloseButton>
                    </Header>

                    <ScrollContent showsVerticalScrollIndicator={false}>
                        {sections.map((section) => (
                            <Section key={section.id}>
                                <SectionTitle>{section.title}</SectionTitle>

                                <OptionsList>
                                    {section.options.map((option) => {
                                        const selected = isOptionSelected(section.id, option, section.multiSelect);

                                        return (
                                            <OptionItem
                                                key={option.id}
                                                selected={selected}
                                                onPress={() => handleOptionPress(section.id, option, section.multiSelect)}
                                                accessible={true}
                                                accessibilityLabel={option.label}
                                                accessibilityRole="button"
                                                accessibilityState={{ selected }}
                                            >
                                                <CheckIcon selected={selected}>
                                                    {selected && (
                                                        <Ionicons
                                                            name="checkmark"
                                                            size={12}
                                                            color={theme.colors.background}
                                                        />
                                                    )}
                                                </CheckIcon>

                                                <OptionText selected={selected}>
                                                    {option.label}
                                                </OptionText>
                                            </OptionItem>
                                        );
                                    })}
                                </OptionsList>
                            </Section>
                        ))}
                    </ScrollContent>

                    <Footer>
                        <Button
                            title="Limpar"
                            onPress={handleClear}
                            variant="ghost"
                            style={{ flex: 1 }}
                            disabled={!hasActiveFilters}
                        />

                        <Button
                            title="Aplicar"
                            onPress={handleApply}
                            variant="primary"
                            style={{ flex: 1 }}
                        />
                    </Footer>
                </Content>
            </Backdrop>
        </ModalContainer>
    );
};