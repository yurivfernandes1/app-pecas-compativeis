import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import { theme } from '../../styles/theme';
import { MainTabParamList } from '../../types/navigation';

// Import screens
import HomeScreen from '../../screens/Home/HomeScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

// Componente temporário para telas em desenvolvimento
const TempScreen = ({ title }: { title: string }) => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <Text style={{ fontSize: 18, color: '#333' }}>{title}</Text>
        <Text style={{ fontSize: 14, color: '#666', marginTop: 10 }}>Em desenvolvimento...</Text>
    </View>
);

export const TabNavigator: React.FC = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap;

                    switch (route.name) {
                        case 'Home':
                            iconName = focused ? 'home' : 'home-outline';
                            break;
                        case 'Pecas':
                            iconName = focused ? 'car' : 'car-outline';
                            break;
                        case 'Cores':
                            iconName = focused ? 'color-palette' : 'color-palette-outline';
                            break;
                        case 'Fusiveis':
                            iconName = focused ? 'flash' : 'flash-outline';
                            break;
                        default:
                            iconName = 'help-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: theme.colors.textSecondary,
                tabBarStyle: {
                    backgroundColor: theme.colors.background,
                    borderTopColor: theme.colors.border,
                    borderTopWidth: 1,
                    paddingBottom: 8,
                    paddingTop: 8,
                    height: 60,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                },
                headerStyle: {
                    backgroundColor: theme.colors.background,
                    borderBottomColor: theme.colors.border,
                    borderBottomWidth: 1,
                },
                headerTitleStyle: {
                    fontSize: 20,
                    fontWeight: '600',
                    color: theme.colors.text,
                },
                headerTintColor: theme.colors.text,
            })}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    title: 'Início',
                    headerTitle: 'Golf MK3 - Peças Compatíveis'
                }}
            />
            <Tab.Screen
                name="Pecas"
                children={() => <TempScreen title="Peças Compatíveis" />}
                options={{
                    title: 'Peças',
                    headerTitle: 'Peças Compatíveis'
                }}
            />
            <Tab.Screen
                name="Cores"
                children={() => <TempScreen title="Tabela de Cores VW" />}
                options={{
                    title: 'Cores',
                    headerTitle: 'Tabela de Cores VW'
                }}
            />
            <Tab.Screen
                name="Fusiveis"
                children={() => <TempScreen title="Mapa de Fusíveis" />}
                options={{
                    title: 'Fusíveis',
                    headerTitle: 'Mapa de Fusíveis'
                }}
            />
        </Tab.Navigator>
    );
};