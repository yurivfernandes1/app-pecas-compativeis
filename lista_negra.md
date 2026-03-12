# Tarefas de Implementação

---

## Tarefa 1 — Criar a página "Lista Negra"

**Objetivo:** Criar uma página com a lista de contatos fraudadores identificados nos grupos de WhatsApp, no mesmo estilo visual do restante do app. Os usuários poderão denunciar novos contatos via Instagram/Facebook do canal @falandodegti.

---

### 1.1 — Criar o arquivo de dados JSON

**Arquivo a criar:** `src/data/lista-negra.json`

Estrutura do JSON:
```json
{
  "contatos": [
    { "numero": "+55 48 99635-3049", "descricao": "Golpe com falsa venda em grupo de WhatsApp" },
    { "numero": "+55 31 97130-5763", "descricao": "Golpe com falsa venda em grupo de WhatsApp" },
    { "numero": "+55 31 97225-2386", "descricao": "Golpe com falsa venda em grupo de WhatsApp" },
    { "numero": "+55 11 98607-4702", "descricao": "Golpe com falsa venda em grupo de WhatsApp" },
    { "numero": "+55 31 99631-4306", "descricao": "Golpe com falsa venda em grupo de WhatsApp" },
    { "numero": "+55 12 99728-6761", "descricao": "Golpe com falsa venda em grupo de WhatsApp" },
    { "numero": "+55 31 99076-1675", "descricao": "Golpe com falsa venda em grupo de WhatsApp" },
    { "numero": "+55 31 97196-5303", "descricao": "Golpe com falsa venda em grupo de WhatsApp" }
  ],
  "canaisDenuncia": {
    "instagram": "https://www.instagram.com/falandodegti",
    "facebook": "https://www.facebook.com/falandodegti"
  }
}
```

---

### 1.2 — Criar a página ListaNegra

**Arquivo a criar:** `src/pages/ListaNegra.tsx`

- Importar dados de `../data/lista-negra.json`
- Usar a mesma estrutura de estilo (`styled-components`) das outras páginas (ex.: `PecasCompativeis.tsx` e `ProdutosShopee.tsx` como referência de padrão visual)
- Usar `colors` e `media` de `../styles/GlobalStyles`
- Seções da página:
  1. **Hero section** com fundo escuro (mesmo padrão de `PecasCompativeis.tsx` linha 416), título "⚠️ Lista Negra — Fraudadores Identificados" e subtítulo explicando a proposta
  2. **Seção de alerta/aviso** com caixa de destaque em vermelho (`colors.primary = #DC2626`) explicando como funciona e como denunciar, com botões para Instagram e Facebook do @falandodegti
  3. **Tabela/lista de contatos** com os números do JSON, exibindo número e descrição. NÃO exibir os números como links clicáveis (evitar discagem acidental)
  4. **Seção de rodapé** com instrução de como denunciar um novo contato

---

### 1.3 — Registrar a rota no App.tsx

**Arquivo a modificar:** `src/App.tsx`

- Adicionar o import da nova página junto aos demais imports (linha ~16):
  ```tsx
  import ListaNegra from './pages/ListaNegra';
  ```
- Adicionar a rota dentro do bloco `<Routes>` (após a rota `/diag-sys-internal-2025`, linha ~34):
  ```tsx
  <Route path="/lista-negra" element={<ListaNegra />} />
  ```

---

### 1.4 — Adicionar link no Header

**Arquivo a modificar:** `src/components/Header.tsx`

- Localizar o array `navigation` na linha 290:
  ```tsx
  const navigation = [
    { path: '/', label: 'Início' },
    { path: '/pecas', label: 'Peças Compatíveis' },
    { path: '/fusiveis', label: 'Mapa de Fusíveis' },
    { path: '/cores', label: 'Tabela de Cores' },
    { path: '/produtos', label: 'Vendas Peças' },
    { path: '/sobre', label: 'Sobre' },
  ];
  ```
- Adicionar o item `{ path: '/lista-negra', label: '⚠️ Lista Negra' }` antes de `{ path: '/sobre', label: 'Sobre' }`.

---

### 1.5 — Adicionar seção chamativa na Home

**Arquivo a modificar:** `src/pages/Home.tsx`

- Criar um novo `styled-component` chamado `BlacklistSection` logo após a definição de `DocsSection` (linha ~174), com fundo escuro e borda/destaque em vermelho, similar ao estilo de alerta.
- No JSX da função `Home` (linha 582), **após o fechamento de `</DocsSection>`** e **antes do fechamento de `</PageWrapper>`**, adicionar a nova seção:
  ```tsx
  <BlacklistSection>
    <Container>
      <div className="blacklist-content">
        <span className="icon" aria-hidden>⚠️</span>
        <h3>Lista Negra — Fraudadores</h3>
        <p>
          Identificamos contatos que aplicaram golpes com falsas vendas nos grupos de WhatsApp. 
          Consulte a lista antes de fechar qualquer negócio.
        </p>
        <Button as={Link} to="/lista-negra" variant="primary">
          Ver Lista Negra
        </Button>
      </div>
    </Container>
  </BlacklistSection>
  ```

---

### 1.6 — Adicionar link no Footer (opcional, mas recomendado)

**Arquivo a modificar:** `src/components/Footer.tsx`

- Na coluna de **Navegação** do footer, adicionar um `<FooterLink to="/lista-negra">⚠️ Lista Negra</FooterLink>` junto dos demais links de navegação.

---

## Tarefa 2 — Foto de perfil circular na seção Hero da Home

**Objetivo:** Exibir a foto de perfil do app (mesma usada como ícone PWA) no formato circular, similar ao perfil do Instagram, dentro da seção Hero da Home.

---

### 2.1 — Imagem disponível

A imagem já existe em: `public/galeria/Perfil 1.png`
URL remota (GitHub raw): `https://raw.githubusercontent.com/yurivfernandes1/app-pecas-compativeis/refs/heads/main/Perfil1.png`

Usar a URL remota para garantir consistência com o manifest.json (que já usa essa URL).

---

### 2.2 — Modificar a seção Hero na Home.tsx

**Arquivo a modificar:** `src/pages/Home.tsx`

**Passo 1 — Criar o styled-component `ProfileImage`** (adicionar próximo dos outros styled-components no topo do arquivo, após `HeroSubtitle` na linha ~44):
```tsx
const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 3px solid ${colors.primary};
  object-fit: cover;
  margin-bottom: 1.5rem;
  box-shadow: 0 0 20px rgba(220, 38, 38, 0.4);

  ${media.tablet} {
    width: 150px;
    height: 150px;
  }
`;
```

**Passo 2 — Inserir a imagem no JSX do Hero** (linha 416–427):

Localizar o bloco do `<HeroSection>`:
```tsx
<HeroSection>
  <Container>
    <HeroTitle data-testid="hero-title">Peças Compatíveis para Golf MK3</HeroTitle>
    <HeroSubtitle>
      ...
    </HeroSubtitle>
    <Button as={Link} to="/pecas" variant="primary" data-testid="search-parts-button">
      Buscar Peças Agora
    </Button>
  </Container>
</HeroSection>
```

Adicionar o `<ProfileImage>` **antes** do `<HeroTitle>`:
```tsx
<HeroSection>
  <Container>
    <ProfileImage 
      src="https://raw.githubusercontent.com/yurivfernandes1/app-pecas-compativeis/refs/heads/main/Perfil1.png"
      alt="Falando de GTI"
    />
    <HeroTitle data-testid="hero-title">Peças Compatíveis para Golf MK3</HeroTitle>
    <HeroSubtitle>
      ...
    </HeroSubtitle>
    <Button as={Link} to="/pecas" variant="primary" data-testid="search-parts-button">
      Buscar Peças Agora
    </Button>
  </Container>
</HeroSection>
```

**Observação:** Verificar se `colors` e `media` já estão importados em `Home.tsx`. Se não, adicionar o import:
```tsx
import { colors, media } from '../styles/GlobalStyles';
```

