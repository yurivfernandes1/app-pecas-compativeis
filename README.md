# Golf MK3 - Peças Compatíveis | Falando de GTI

![Golf MK3 App](https://img.shields.io/badge/Golf-MK3-red?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue?style=for-the-badge&logo=typescript)
![Status](https://img.shields.io/badge/Status-Pronto-green?style=for-the-badge)

> Aplicação web para consulta de peças compatíveis com Volkswagen Golf MK3 - Por Falando de GTI

## 📋 Visão Geral

O **Golf MK3 Peças Compatíveis** é uma aplicação web moderna e responsiva desenvolvida para resolver a dor latente dos proprietários de Golf MK3 que precisam encontrar peças compatíveis de outros veículos. Oferece uma base de dados completa e acessível através de uma interface intuitiva.

### ✨ Funcionalidades Principais

- 🔧 **Peças Compatíveis**: Base completa com centenas de peças organizadas por categoria
- ⚡ **Mapa de Fusíveis**: Diagrama interativo da caixa de fusíveis e relés
- 🎨 **Tabela de Cores**: Códigos de cores VW completos por ano e modelo
- 🔍 **Busca Avançada**: Filtros por categoria, veículo e termo de busca
- 📱 **Design Responsivo**: Otimizado para mobile, tablet e desktop
- 🚀 **Performance**: Carregamento rápido e experiência fluida
- 📊 **Analytics**: Integração com Google Analytics e Meta Pixel

## 🛠️ Tecnologias Utilizadas

### Core
- **React 18.2.0** - Biblioteca para interfaces de usuário
- **TypeScript 4.9.5** - Superset JavaScript com tipagem estática
- **React Router Dom 6.20.1** - Roteamento para SPAs
- **Styled Components 6.1.4** - CSS-in-JS para estilização

### Build & Dev Tools
- **React Scripts 5.0.1** - Conjunto de scripts para desenvolvimento
- **ESLint** - Linting para JavaScript/TypeScript
- **Prettier** - Formatação de código (configurar)

### Analytics & Marketing
- **Google Analytics 4** - Análise de tráfego e comportamento
- **Meta Pixel** - Tracking para Facebook/Instagram
- **Structured Data** - SEO otimizado

## 🚀 Como Executar

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/yurivfernandes/app-pecas-compativeis.git
cd app-pecas-compativeis
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
# Edite o arquivo .env com suas chaves de API
```

4. **Execute o projeto**
```bash
npm start
# ou
yarn start
```

O app estará disponível em [http://localhost:3000](http://localhost:3000)

### Scripts Disponíveis

```bash
# Desenvolvimento
npm start                 # Inicia o servidor de desenvolvimento
npm run build            # Build para produção
npm test                 # Executa os testes
npm run test:coverage    # Executa testes com cobertura
npm run eject            # Remove create-react-app (irreversível)
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Header.tsx
│   └── Footer.tsx
├── pages/              # Páginas da aplicação
│   ├── Home.tsx
│   ├── PecasCompativeis.tsx
│   ├── MapaFusiveis.tsx
│   ├── TabelaCores.tsx
│   └── Sobre.tsx
├── data/               # Dados em JSON
│   ├── pecas-compativeis.json
│   ├── mapa-fusiveis.json
│   └── cores-vw.json
├── styles/             # Estilos globais
│   └── GlobalStyles.ts
├── hooks/              # Custom hooks
│   └── index.ts
├── utils/              # Funções utilitárias
│   └── index.ts
├── types/              # Definições de tipos
│   ├── index.ts
│   └── window.d.ts
├── services/           # Serviços externos
├── App.tsx            # Componente principal
└── index.tsx          # Entry point
```

## 📊 Base de Dados

### Peças Compatíveis
- **500+ peças** catalogadas e verificadas
- **5 categorias** principais: Motor, Transmissão, Suspensão, Arrefecimento, Lataria
- **Informações detalhadas** de compatibilidade por veículo

### Mapa de Fusíveis
- **22 posições** de fusíveis mapeadas
- **12 relés** com funções detalhadas
- **Amperagens** e funções específicas

### Tabela de Cores
- **60+ códigos** de cores VW
- **Dados de 1994-1997** organizados por ano
- **Referências visuais** quando disponíveis

## 🎨 Design System

### Paleta de Cores
- **Primária**: `#DC2626` (Vermelho)
- **Secundária**: `#374151` (Cinza escuro)
- **Background**: `#F9FAFB` (Cinza claro)
- **Texto**: Escalas de cinza do `#111827` ao `#9CA3AF`

### Breakpoints
- **Mobile**: `< 768px`
- **Tablet**: `768px - 1024px`
- **Desktop**: `> 1024px`
- **Large Desktop**: `> 1440px`

### Componentes Base
- Container responsivo
- Cards com sombras
- Botões com variantes
- Inputs e selects estilizados
- Grid system flexível

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` baseado no `.env.example`:

```env
# Analytics
REACT_APP_GA_TRACKING_ID=G-XXXXXXXXXX
REACT_APP_META_PIXEL_ID=XXXXXXXXXX

# App Config
REACT_APP_BASE_URL=https://app.falandodegti.com.br
REACT_APP_ENV=production
```

### Configurações de Build

O projeto usa **React Scripts** com configurações padrão. Para customizações avançadas, considere ejetar ou usar CRACO.

## 📈 SEO e Performance

### Otimizações Implementadas
- **Meta tags** completas para SEO
- **Open Graph** para redes sociais
- **Structured Data** (JSON-LD)
- **Lazy loading** de componentes
- **Code splitting** automático
- **Service Worker** (PWA ready)

### Performance Metrics
- **Lighthouse Score**: 90+ (objetivo)
- **First Contentful Paint**: < 2s
- **Largest Contentful Paint**: < 3s
- **Cumulative Layout Shift**: < 0.1

## 🔐 Segurança

### Proteções Implementadas
- **Prevenção básica** de screenshots
- **Desabilitação** do menu de contexto
- **Bloqueio** de teclas de desenvolvedor
- **Watermark** de direitos autorais
- **Validação** de inputs
- **Sanitização** de dados

## 🚀 Deploy

### Produção (Recomendado)
```bash
# Build para produção
npm run build

# Servir arquivos estáticos
# Use Netlify, Vercel, ou servidor web tradicional
```

### Configurações do Servidor
- **SPA**: Configure redirects para `index.html`
- **HTTPS**: Obrigatório para PWA e analytics
- **Compressão**: Habilite gzip/brotli
- **Cache**: Configure headers apropriados

## 🧪 Testes

### Estratégia de Testes
```bash
# Testes unitários
npm test

# Cobertura de testes
npm run test:coverage

# Testes end-to-end (configurar)
npm run test:e2e
```

### Ferramentas
- **Jest** - Framework de testes
- **React Testing Library** - Testes de componentes
- **Cypress** (a configurar) - Testes E2E

## 🤝 Contribuição

### Como Contribuir

1. **Fork** o projeto
2. **Crie** uma branch (`git checkout -b feature/nova-funcionalidade`)
3. **Commit** suas alterações (`git commit -am 'Adiciona nova funcionalidade'`)
4. **Push** para a branch (`git push origin feature/nova-funcionalidade`)
5. **Abra** um Pull Request

### Padrões de Código
- **ESLint** para linting
- **Prettier** para formatação
- **Conventional Commits** para mensagens
- **TypeScript** obrigatório
- **Testes** para novas funcionalidades

## 📄 Licença

Este projeto é propriedade da **Falando de GTI** (Grupo iFernandes). Todos os direitos reservados.

## 👥 Equipe

- **Desenvolvedor**: Falando de GTI
- **Empresa**: Grupo iFernandes
- **URL**: https://app.falandodegti.com.br

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o projeto, entre em contato através dos canais oficiais da Falando de GTI.

---

**© 2025 Falando de GTI - Grupo iFernandes. Todos os direitos reservados.**
App com peças compatíveis do golf mk3
