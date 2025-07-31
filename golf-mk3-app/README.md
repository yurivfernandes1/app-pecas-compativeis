# Golf MK3 - Peças Compatíveis

Aplicativo para consulta de peças compatíveis, códigos de cores VW e mapas de fusíveis do Volkswagen Golf MK3.

## 🚀 Funcionalidades

- **Peças Compatíveis**: Consulte peças de outros veículos compatíveis com Golf MK3
- **Tabela de Cores VW**: Códigos oficiais das cores Volkswagen com referências visuais
- **Mapa de Fusíveis**: Diagramas interativos das caixas de fusíveis e relés
- **Busca Avançada**: Sistema de busca com filtros e sugestões
- **Responsivo**: Interface adaptada para mobile, tablet e desktop
- **Proteção de Conteúdo**: Sistema anti-screenshot com watermark

## 🛠️ Tecnologias

- **React Native**: Framework multiplataforma
- **Expo**: Plataforma de desenvolvimento
- **TypeScript**: Tipagem estática
- **React Navigation**: Navegação entre telas
- **Jest**: Framework de testes
- **GitHub Actions**: CI/CD

## 📱 Plataformas Suportadas

- **Web**: https://app.falandodegti.com.br
- **iOS**: App Store (em breve)
- **Android**: Google Play Store (em breve)

## 🏗️ Desenvolvimento

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Expo CLI
- EAS CLI (para builds)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/falandodegti/golf-mk3-app.git
cd golf-mk3-app

# Instale as dependências
npm install --legacy-peer-deps

# Inicie o servidor de desenvolvimento
npm start
```

### Scripts Disponíveis

```bash
# Desenvolvimento
npm start              # Inicia o servidor Expo
npm run android        # Abre no Android
npm run ios           # Abre no iOS
npm run web           # Abre no navegador

# Testes
npm test              # Executa testes
npm run test:watch    # Testes em modo watch
npm run test:coverage # Testes com coverage

# Build e Deploy
npm run build:web           # Build para web
npm run build:mobile        # Build mobile (preview)
npm run build:mobile:prod   # Build mobile (produção)
npm run deploy              # Deploy completo
npm run deploy:prod         # Deploy produção
```

## 🧪 Testes

O projeto inclui testes unitários e de integração:

```bash
# Executar todos os testes
npm test

# Testes com coverage
npm run test:coverage

# Testes em modo watch
npm run test:watch
```

## 🚀 Deploy

### Web

O deploy web é automatizado via GitHub Actions:

```bash
# Build manual
npm run build:web

# Deploy manual
npm run deploy:web
```

### Mobile

Para builds mobile, use o EAS:

```bash
# Preview build
npm run build:mobile:preview

# Production build
npm run build:mobile:prod

# Deploy completo
npm run deploy:prod
```

## 📊 Estrutura do Projeto

```
src/
├── components/         # Componentes reutilizáveis
│   ├── common/        # Componentes genéricos
│   ├── cores/         # Componentes de cores
│   ├── fusiveis/      # Componentes de fusíveis
│   ├── navigation/    # Navegação
│   └── pecas/         # Componentes de peças
├── data/              # Dados JSON
├── hooks/             # Custom hooks
├── screens/           # Telas da aplicação
├── services/          # Serviços e APIs
├── styles/            # Estilos globais
├── types/             # Tipos TypeScript
└── utils/             # Utilitários
```

## 🔒 Segurança

- Sistema anti-screenshot
- Watermark dinâmico
- Proteção de conteúdo
- Logs de segurança
- Compliance com direitos autorais

## 📈 Analytics

- Google Analytics 4
- Meta Pixel (Facebook/Instagram)
- Tracking de eventos
- Métricas de performance
- Monitoramento de erros

## 🎨 Design System

- Paleta de cores: Vermelho (#DC2626), Cinza (#374151), Branco
- Tipografia: Inter font family
- Componentes responsivos
- Acessibilidade WCAG 2.1

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é propriedade da **Falando de GTI**. Todos os direitos reservados.

## 📞 Contato

- **Website**: https://app.falandodegti.com.br
- **Email**: contato@falandodegti.com.br
- **Desenvolvido por**: Falando de GTI (Grupo iFernandes)

## 🔄 Versionamento

Usamos [SemVer](http://semver.org/) para versionamento. Para as versões disponíveis, veja as [tags neste repositório](https://github.com/falandodegti/golf-mk3-app/tags).

## 📝 Changelog

### v1.0.0 (2024-07-31)
- ✨ Lançamento inicial
- 🔍 Sistema de busca de peças compatíveis
- 🎨 Tabela de cores VW
- ⚡ Mapa interativo de fusíveis
- 📱 Interface responsiva
- 🔒 Sistema de proteção de conteúdo
- 📊 Analytics integrado
- 🧪 Testes automatizados
- 🚀 CI/CD configurado