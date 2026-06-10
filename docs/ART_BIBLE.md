# Meu Cãopanheiro — Art Bible (v1)

## 1. Posicionamento visual

**Direção:** cozy 2D pet-care sim brasileiro, com foco em adoção, afeto, rotina e evolução da casa.

O jogo deve parecer: aconchegante, comercial, polido, familiar, levemente artesanal, adequado para crianças e adultos. Mais premium do que protótipo.

Referências funcionais (atmosfera, nunca cópia estética): Tamagotchi, Nintendogs, Animal Crossing, Stardew Valley, Cozy Grove, Spiritfarer.

## 2. Paleta de cores

Definida em `css/variables.css`. Quente, dessaturada, sem cinza puro.

| Token | Hex | Uso |
|---|---|---|
| `--bg-main` | `#FFF4E6` | Creme de fundo de todas as telas |
| `--color-primary` | `#C87941` | Caramelo principal — CTAs, marca, destaque |
| `--color-primary-dark` | `#A65F2E` | Hover/pressed do primário |
| `--color-accent` | `#F4A261` | Laranja suave — acentos, gradientes |
| `--color-secondary` | `#2A6F73` | Azul-petróleo — ações secundárias |
| `--color-success` | `#8AB17D` | Verde sálvia — sucesso, higiene |
| `--color-danger` | `#C75146` | Vermelho terroso — alertas |
| `--text-primary` | `#3A2A1F` | Marrom texto |
| `--bg-card` | `#FFFDF8` | Branco card |
| sombras | `rgba(78, 45, 20, …)` | Sempre marrom quente, nunca preto puro |

Stats mantêm cor funcional, dessaturada: fome `#D9705F`, felicidade `#E9C46A`, energia `#7FA9C4`, higiene `#8AB17D`, saúde `#C87941`, aprendizado `#9B8EC4`.

**Regra:** nenhuma cor saturada de UI genérica (laranja neon, verde lima, azul elétrico). Tudo passa pelo filtro "isso parece uma casa aconchegante?".

## 3. Tipografia

- **Display (títulos, logo, botões, números do HUD):** Fredoka, fallback Baloo 2 → Nunito Sans → Segoe UI.
- **UI e corpo:** Nunito Sans, fallback Segoe UI → system.
- Carregadas via Google Fonts com `display=swap`; o jogo nunca depende delas para funcionar.
- Token: `--font-display` e `--font-family`.

## 4. Linguagem de ícones

- Biblioteca própria em `js/ui/icons.js` (`Game.Icons`).
- SVG inline, viewBox 24×24, `currentColor`, formas preenchidas e arredondadas.
- Emojis **não** são arte principal: ficam apenas como fallback (HTML estático antes do JS) ou detalhe textual secundário (descrições, toasts).
- Mapa fixo: ações (`bowl`, `ball`, `drop`, `moon`, `sun`, `heart`, `pawprints`, `star`, `cross`, `bone`, `broom`) e navegação (`home`, `paw`, `cart`, `backpack`, `trophy`).
- A pata é a marca do jogo: aparece na moeda (PataCoins), no abrigo e na identidade.

## 5. Botões

- Display font, radius `--radius-md`/`--radius-lg`.
- Relevo cozy: `border-bottom: 3px` escurecido + sombra quente + inset highlight.
- Estados: default, hover (eleva 1px), active (afunda + comprime), disabled (opacidade 0.5, sem sombra).
- CTA primário sempre caramelo; secundário azul-petróleo; nunca dois CTAs primários lado a lado.

## 6. Cards

- Fundo `--bg-card`, borda `--border-card` (marrom 12%), sombra `--shadow-sm`.
- Hover: eleva 2-3px, sombra média, borda caramelo 35%.
- Espaçamento interno `--space-md`; nunca conteúdo encostado na borda.

## 7. Cachorros (sprites)

- Pipeline oficial em `docs/ASSET_PROMPTS.md` (1024×1024, alpha real, uma pose por arquivo, alinhamento pela base, escala por porte).
- Exibição: limpeza de fundo via canvas (`removeWhiteBackground` em `dog-renderer.js`) enquanto os assets finais não chegam.
- Sombra de contato: elipse via CSS (`.dog-in-room::after`) — o asset nunca traz sombra embutida.
- Escala em jogo por porte: small 100px, medium 130px, large 160px, giant 180px (reduzidos por crowd-scaling com 3-4 cães).
- Fallback: SVG procedural (`Game.SvgDogs`) para qualquer asset ausente.

## 8. Casa

- Cena em camadas (z 0–10): sky → wall → floor → decor estático → weather → móveis → cães → partículas → foreground → HUD contextual.
- Decoração cumulativa por tier de moradia (janela, planta, lampião, tapete, quadro com retrato do cão, relógio funcional, lareira, prateleira de troféus).
- Reage a hora do dia (céu, lâmpadas, tinta ambiente) e clima (sol, chuva, neve, nublado).
- Vinheta quente + rodapé de parede para aconchego.
- **O cachorro é sempre o foco:** decoração nunca disputa atenção nem intercepta cliques (`pointer-events: none`).

## 9. Loja, inventário e conquistas

- Itens em cards horizontais com ícone, nome, descrição e preço em destaque caramelo.
- Conquistas bloqueadas: dessaturadas (`grayscale` + opacidade), desbloqueadas com ícone vivo e recompensa em destaque.
- Desktop: listas com largura máxima de leitura (760px), nunca esticadas na tela inteira.

## 10. Animações

- Micro-interações: 120–300ms, ease.
- Ambientes (cortina, folhas, chama, fumaça, nuvens): 2–60s, sutis, máx. ~12 simultâneas.
- Partículas de ação: burst curto com auto-limpeza (`animationend`).
- `prefers-reduced-motion`: desliga tudo que é decorativo; mantém chama e ponteiros do relógio (funcionais).

## 11. Responsividade

- **Mobile/PWA:** referência 390×844, navegação inferior sticky, cena vertical, alvos de toque ≥ 40px.
- **Desktop/Web:** ≥1024px vira layout de duas colunas — cena da casa grande à esquerda, painel de status/ações/missões à direita, container 1040px com moldura. Nunca "celular esticado".
- Breakpoints compactos para telas baixas (≤667px e ≤568px) já existentes.

## 12. Regras de consistência

1. Toda cor nova entra primeiro em `variables.css`, nunca hardcoded.
2. Todo ícone novo entra em `icons.js`, no mesmo estilo (filled, arredondado, 24×24).
3. Sombras sempre quentes (`rgba(78,45,20,…)`).
4. Títulos sempre em `--font-display`.
5. Emojis nunca como elemento principal de UI.
6. Assets de cão seguem `ASSET_PROMPTS.md` sem exceção.
7. Decoração de casa nunca rouba o foco do cachorro.
8. Qualquer animação nova respeita `prefers-reduced-motion`.
