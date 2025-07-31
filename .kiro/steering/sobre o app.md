# App "Peças Compatíveis para Golf MK3"

## Visão Geral do Projeto
Desenvolvimento de aplicativo mobile/web para consulta de peças compatíveis com Volkswagen Golf MK3, recriando e modernizando uma solução que existia anteriormente no mercado.

**Desenvolvedor:** Falando de GTI (Empresa do Grupo iFernandes)  
**URL:** https://app.falandodegti.com.br  
**Modelo de Negócio:** Aplicativo gratuito (free)

## Objetivo Principal
Resolver a dor latente dos proprietários de Golf MK3 que precisam encontrar peças compatíveis de outros veículos, oferecendo uma base de dados completa e acessível através de uma interface moderna e intuitiva.

## Especificações Técnicas

### Arquitetura
- **Frontend Only:** React Native para Web, iOS e Android
- **Sem Backend:** Aplicação 100% client-side
- **Armazenamento:** Dados em JSON integrados ao frontend
- **Responsividade:** Design mobile-first com compatibilidade desktop

### Fonte de Dados
- **Dados Históricos:** Extração de informações dos prints do app antigo (pasta `prints_app_antigo`)
- **Relação de Peças:** Análise da relação de peças compatíveis em formato texto (pasta `prints_app_antigo`)
- **Tabela de Cores:** Códigos de cores VW com referências visuais (pasta `cores`)
- **Mapas de Fusíveis:** Diagramas de caixas de fusíveis e relés (pasta `fusiveis`)
- **Documentação Técnica:** Análise e inclusão de dados de PDF com códigos de peças
- **Estrutura:** Criação de arquivos JSON como "banco de dados" local

### Design System
- **Paleta de Cores:** Cinza escuro, vermelho e branco
- **Estilo:** Visual minimalista e moderno
- **UX/UI:** Foco em usabilidade e experiência do usuário

## Funcionalidades Principais

### Core Features
- Consulta de peças compatíveis por categoria
- Busca por código de peça
- Filtros avançados de compatibilidade
- **Tabela de Cores VW:** Seção dedicada com códigos e referências visuais das cores
- **Mapas de Fusíveis:** Seção com diagramas interativos das caixas de fusíveis e relés
- Interface intuitiva para navegação

### Elementos Virais e Retenção
- **Proteção de Conteúdo:** Sistema anti-screenshot com watermark de direitos autorais
- **Compartilhamento Viral:** Incentivo ao compartilhamento do link oficial
- **On-boarding Emocional:** Experiência inicial focada em demonstrar valor
- **Social Proof:** Elementos que demonstram confiabilidade da base de dados

### Analytics e Marketing
- **Google Analytics:** Implementação completa para análise de uso
- **Meta Pixel:** Integração para campanhas de marketing digital
- **Conversion Tracking:** Monitoramento de engajamento e retenção
- **SEO Optimization:** Otimização para mecanismos de busca

## Diretrizes de Desenvolvimento

### Padrões iFernandes
- Componentização máxima para reutilização de código
- Estrutura organizada: páginas, componentes, estilos, serviços
- Testes obrigatórios em todas as funcionalidades
- Documentação técnica completa
- Performance otimizada e código eficiente

### Qualidade e Testes
- Testes unitários em todos os componentes
- Testes de usabilidade em diferentes dispositivos
- Validação de funcionalidades antes de cada entrega
- Logs de execução e monitoramento de performance

### Segurança e Compliance
- Proteção contra screenshots não autorizados
- Aviso de direitos autorais integrado
- Configurações sensíveis em arquivos de ambiente
- Conformidade com diretrizes de propriedade intelectual

## Entregáveis
1. **Aplicativo React Native** (Web, iOS, Android)
2. **Base de Dados JSON** com peças compatíveis
3. **Seção de Tabela de Cores** com códigos VW e referências visuais
4. **Seção de Mapas de Fusíveis** com diagramas interativos
5. **Documentação Técnica** completa
6. **Sistema de Analytics** implementado
7. **Testes e Validações** executados
8. **Deploy em Produção** na URL especificada

## Cronograma de Desenvolvimento
Desenvolvimento seguindo metodologia ágil com entregas incrementais, priorizando funcionalidades core e posteriormente elementos de engajamento e retenção.

