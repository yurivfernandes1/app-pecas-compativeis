import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView style={{ flex: 1, padding: 16 }}>
        <View style={{ marginBottom: 32 }}>
          <Text style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: '#111',
            textAlign: 'center',
            marginBottom: 8
          }}>
            Bem-vindo!
          </Text>
          <Text style={{
            fontSize: 16,
            color: '#666',
            textAlign: 'center',
            lineHeight: 24
          }}>
            Seu guia completo para peças compatíveis, cores e fusíveis do Volkswagen Golf MK3.
            Desenvolvido por Falando de GTI.
          </Text>
        </View>

        <View style={{ marginBottom: 32 }}>
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: '#111',
            marginBottom: 24
          }}>
            Funcionalidades
          </Text>

          {[
            {
              icon: 'car-outline',
              title: 'Peças Compatíveis',
              description: 'Encontre peças de outros veículos compatíveis com seu Golf MK3. Base completa com preços e observações.',
              action: () => navigation.navigate('Pecas')
            },
            {
              icon: 'color-palette-outline',
              title: 'Tabela de Cores VW',
              description: 'Consulte códigos oficiais das cores Volkswagen com referências visuais para identificação.',
              action: () => navigation.navigate('Cores')
            },
            {
              icon: 'flash-outline',
              title: 'Mapa de Fusíveis',
              description: 'Diagrama interativo das caixas de fusíveis e relés com localização e especificações.',
              action: () => navigation.navigate('Fusiveis')
            }
          ].map((feature, index) => (
            <View key={index} style={{
              backgroundColor: '#fff',
              padding: 16,
              marginBottom: 16,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#e5e7eb',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
            }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 8
              }}>
                <View style={{ marginRight: 16 }}>
                  <Ionicons
                    name={feature.icon as any}
                    size={24}
                    color="#DC2626"
                  />
                </View>
                <Text style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: '#111',
                  flex: 1
                }}>
                  {feature.title}
                </Text>
              </View>

              <Text style={{
                fontSize: 16,
                color: '#666',
                lineHeight: 24,
                marginBottom: 16
              }}>
                {feature.description}
              </Text>

              <View style={{
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderColor: '#DC2626',
                borderRadius: 8,
                paddingVertical: 8,
                paddingHorizontal: 16,
                alignSelf: 'flex-start'
              }}>
                <Text style={{
                  color: '#DC2626',
                  fontSize: 14,
                  fontWeight: '500'
                }}>
                  Ver {feature.title.split(' ')[0]}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{
          marginTop: 32,
          padding: 24,
          backgroundColor: '#f9fafb',
          borderRadius: 8
        }}>
          <Text style={{
            fontSize: 12,
            color: '#666',
            textAlign: 'center',
            lineHeight: 20
          }}>
            © 2024 Falando de GTI. Todos os direitos reservados.{'\n'}
            Conteúdo protegido por direitos autorais.{'\n'}
            app.falandodegti.com.br
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;