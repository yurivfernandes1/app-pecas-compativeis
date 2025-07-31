import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useResponsive, useResponsiveSpacing, useResponsiveTypography } from './src/hooks/useResponsive';
import ErrorBoundary from './src/components/common/ErrorBoundary';

const Tab = createBottomTabNavigator();

const HomeScreen = ({ navigation }: any) => {
  const { breakpoint, screenData } = useResponsive();
  const spacing = useResponsiveSpacing();
  const typography = useResponsiveTypography();

  // Calcular colunas para features baseado no breakpoint
  const featuresColumns = breakpoint === 'desktop' ? 3 : breakpoint === 'tablet' ? 2 : 1;
  const cardWidth = featuresColumns > 1 ? (screenData.width - spacing.lg * 3) / featuresColumns : screenData.width - spacing.lg * 2;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <View style={{
        padding: spacing.lg,
        maxWidth: breakpoint === 'desktop' ? 1200 : breakpoint === 'tablet' ? 800 : 480,
        alignSelf: 'center',
        width: '100%'
      }}>
        {/* Header */}
        <View style={{ marginBottom: spacing.xl, alignItems: 'center' }}>
          <Text style={{
            fontSize: typography.h1.fontSize,
            lineHeight: typography.h1.lineHeight,
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: spacing.sm,
            textAlign: 'center'
          }}>
            Bem-vindo!
          </Text>
          <Text style={{
            fontSize: typography.body.fontSize,
            lineHeight: typography.body.lineHeight,
            color: '#6B7280',
            textAlign: 'center',
            maxWidth: breakpoint === 'mobile' ? '100%' : '80%'
          }}>
            Seu guia completo para peças compatíveis, cores e fusíveis do Volkswagen Golf MK3.{'\n'}
            Desenvolvido por Falando de GTI.
          </Text>
        </View>

        {/* Features */}
        <Text style={{
          fontSize: typography.h2.fontSize,
          lineHeight: typography.h2.lineHeight,
          fontWeight: 'bold',
          color: '#111827',
          marginBottom: spacing.lg
        }}>
          Funcionalidades
        </Text>

        <View style={{
          flexDirection: featuresColumns > 1 ? 'row' : 'column',
          flexWrap: 'wrap',
          justifyContent: 'space-between'
        }}>
          {[
            {
              icon: 'car-outline',
              title: 'Peças Compatíveis',
              description: 'Encontre peças de outros veículos compatíveis com seu Golf MK3.',
              tab: 'Pecas'
            },
            {
              icon: 'color-palette-outline',
              title: 'Tabela de Cores VW',
              description: 'Consulte códigos oficiais das cores Volkswagen.',
              tab: 'Cores'
            },
            {
              icon: 'flash-outline',
              title: 'Mapa de Fusíveis',
              description: 'Diagrama interativo das caixas de fusíveis e relés.',
              tab: 'Fusiveis'
            }
          ].map((feature, index) => (
            <TouchableOpacity
              key={index}
              style={{
                backgroundColor: '#ffffff',
                padding: spacing.md,
                marginBottom: spacing.md,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#E5E7EB',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1,
                width: featuresColumns > 1 ? cardWidth : '100%',
              }}
              onPress={() => navigation.navigate(feature.tab)}
            >
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: spacing.sm
              }}>
                <Ionicons
                  name={feature.icon as any}
                  size={breakpoint === 'mobile' ? 24 : 28}
                  color="#DC2626"
                  style={{ marginRight: spacing.md }}
                />
                <Text style={{
                  fontSize: typography.h3.fontSize,
                  lineHeight: typography.h3.lineHeight,
                  fontWeight: '600',
                  color: '#111827',
                  flex: 1
                }}>
                  {feature.title}
                </Text>
              </View>

              <Text style={{
                fontSize: typography.small.fontSize,
                lineHeight: typography.small.lineHeight,
                color: '#6B7280',
                marginLeft: breakpoint === 'mobile' ? 36 : 40
              }}>
                {feature.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Copyright */}
        <View style={{
          marginTop: spacing.xl,
          padding: spacing.lg,
          backgroundColor: '#F9FAFB',
          borderRadius: 8,
          alignItems: 'center'
        }}>
          <Text style={{
            fontSize: typography.caption.fontSize,
            lineHeight: typography.caption.lineHeight,
            color: '#6B7280',
            textAlign: 'center'
          }}>
            © 2024 Falando de GTI. Todos os direitos reservados.{'\n'}
            Conteúdo protegido por direitos autorais.{'\n'}
            app.falandodegti.com.br
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const PlaceholderScreen = ({ title, icon }: { title: string; icon: string }) => {
  const { breakpoint } = useResponsive();
  const spacing = useResponsiveSpacing();
  const typography = useResponsiveTypography();

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
      padding: spacing.lg
    }}>
      <Ionicons
        name={icon as any}
        size={breakpoint === 'mobile' ? 64 : 80}
        color="#DC2626"
        style={{ marginBottom: spacing.lg }}
      />
      <Text style={{
        fontSize: typography.h2.fontSize,
        lineHeight: typography.h2.lineHeight,
        color: '#333',
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: spacing.sm
      }}>
        {title}
      </Text>
      <Text style={{
        fontSize: typography.body.fontSize,
        lineHeight: typography.body.lineHeight,
        color: '#666',
        textAlign: 'center',
        maxWidth: breakpoint === 'mobile' ? '90%' : '70%'
      }}>
        Esta seção será implementada em breve com todas as funcionalidades planejadas.
      </Text>
    </View>
  );
};

export default function App() {
  const { breakpoint } = useResponsive();
  const spacing = useResponsiveSpacing();

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName: any;

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
              tabBarActiveTintColor: '#DC2626',
              tabBarInactiveTintColor: '#6B7280',
              tabBarStyle: {
                backgroundColor: '#ffffff',
                borderTopColor: '#E5E7EB',
                borderTopWidth: 1,
                paddingBottom: breakpoint === 'mobile' ? 8 : 12,
                paddingTop: breakpoint === 'mobile' ? 8 : 12,
                height: breakpoint === 'mobile' ? 60 : 70,
              },
              tabBarLabelStyle: {
                fontSize: breakpoint === 'mobile' ? 12 : 14,
                fontWeight: '500',
              },
              headerStyle: {
                backgroundColor: '#ffffff',
                borderBottomColor: '#E5E7EB',
                borderBottomWidth: 1,
              },
              headerTitleStyle: {
                fontSize: breakpoint === 'mobile' ? 18 : 20,
                fontWeight: '600',
                color: '#111827',
              },
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
              children={() => <PlaceholderScreen title="Peças Compatíveis" icon="car-outline" />}
              options={{
                title: 'Peças',
                headerTitle: 'Peças Compatíveis'
              }}
            />
            <Tab.Screen
              name="Cores"
              children={() => <PlaceholderScreen title="Tabela de Cores VW" icon="color-palette-outline" />}
              options={{
                title: 'Cores',
                headerTitle: 'Tabela de Cores VW'
              }}
            />
            <Tab.Screen
              name="Fusiveis"
              children={() => <PlaceholderScreen title="Mapa de Fusíveis" icon="flash-outline" />}
              options={{
                title: 'Fusíveis',
                headerTitle: 'Mapa de Fusíveis'
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}