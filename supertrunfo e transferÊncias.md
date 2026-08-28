# Plano de Implementação: Super Trunfo & Histórico de Donos (Final)

## ⚠️ User Review Required

> [!IMPORTANT]
> **Aprovação do Plano Final:** Por favor, verifique os ajustes no visual das cartas e as categorias de pontuação. Estando 100% de acordo, aprova aí pra eu começar a codar!

## ❓ Open Questions

Tudo 100% alinhado!

## 💡 Proposed Changes

### 1. Banco de Dados (Supabase)

#### [NEW] Tabela `mk3_car_ownership`
Criar tabela para histórico:
- `id` (uuid)
- `car_id` (uuid - ref para mk3_garagem)
- `from_user_id` (uuid - dono antigo)
- `to_user_id` (uuid - dono novo)
- `transferred_at` (timestamp - data da transferência)

#### [MODIFY] Tabela `mk3_car_tags` e `mk3_garagem`
- Adicionar `pontuacao INTEGER DEFAULT 0` em `mk3_car_tags`.
- Adicionar `pontuacao_total INTEGER DEFAULT 0` em `mk3_garagem`.
- **Script Retroativo:** Fornecerei um script SQL que calculará as pontuações e atualizará os dados da galera que já montou a garagem antes dessa atualização.

### 2. Frontend - Transferência de Propriedade

#### [MODIFY] `src/pages/EditarCarro.tsx` e `src/pages/CarroDetails.tsx`
- **Botão "Transferir Projeto"**: Modal solicitando o e-mail do novo dono para realizar a transferência de `user_id`.
- **Histórico**: A tela do carro (`CarroDetails.tsx`) passa a listar a linhagem de donos, desde o mais antigo até o atual.

### 3. Frontend - Super Trunfo & Feed

#### [MODIFY] `src/pages/admin/AdminTags.tsx`
- Habilitar edição de pontos por item.

#### [MODIFY] `src/pages/Onboarding.tsx` e `src/pages/EditarCarro.tsx`
- Ao salvar as edições, o app soma todos os pontos das tags do carro e salva em `pontuacao_total`.

#### [MODIFY] `src/pages/Feed.tsx` (Cards de Super Trunfo)
- Redesenhar os cards na Galeria para simular cartas reais de "Super Trunfo".
- Exibir a **pontuação discriminada por cada categoria** e também a **soma final**. Exemplo:
  - 🏎️ Motor: 40 pts
  - 🛠️ Suspensão: 20 pts
  - ✨ Peças Raras: 150 pts
  - 🛞 Rodas: 30 pts
  - ➕ Opcionais: 10 pts
  - **🏆 TOTAL: 250 PTS**

### 4. Frontend - Exportação para Instagram

#### [NEW] Recurso de Exportar Carta (`html2canvas`)
- Instalar a lib `html2canvas`.
- Ao final do cadastro/edição, oferecer gerar a versão para **Stories (9:16)** e **Feed (4:5)**.
- **Design de Autenticidade:** O card exportado terá a estética fiel de uma carta de Super Trunfo (bordas marcadas, divisões por blocos de status, nome do carro no topo, e a **logo do app "Peças Compatíveis" como parte integral do layout** — seja no cabeçalho ou no rodapé do frame da carta). O design fará com que qualquer tentativa de corte na logo também corte os pontos do carro, desestimulando a remoção da nossa marca.

## 🧪 Verification Plan

### Testes Manuais
- [ ] Rodar o script SQL retroativo e conferir soma de pontos.
- [ ] Testar a interface de pontos no painel administrativo de Tags.
- [ ] Transferir o carro de conta.
- [ ] Validar a somatória de cada categoria (Motor, Suspensão, etc) sendo exibida e somando com o Total no Feed.
- [ ] Exportar o card em 9:16 e 4:5 pelo celular e confirmar se o layout encaixa e se a logo está presente no design da carta.
