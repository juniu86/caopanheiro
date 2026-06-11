# Ativação dos Assets Finais — FINAL_PNG_BREEDS

Procedimento oficial para ativar os PNGs finais dos cães depois que TODOS os assets de uma raça forem aprovados no QA técnico e no QA visual.

## Pré-requisitos (gate go/no-go)

1. Os 6 arquivos da raça existem em `img/breeds/` com os nomes exatos (ver `docs/ASSET_BATCH_PLAN.md`).
2. `python3 tools/validate_assets.py {prefixo}` retorna **GO** para a raça (zero falhas).
3. QA visual da raça classificado como **Aprovada** (os 6 estados lado a lado: mesmo indivíduo, mesma escala, mesma luz, mesma baseline).
4. Estado `neutro` presente — é exigido pela spec e **não existe** nos assets antigos.

## O que alterar (única mudança de código permitida)

**Arquivo:** `js/ui/dog-renderer.js`
**Linha:** ~173 (objeto `FINAL_PNG_BREEDS`)

Antes:
```js
var FINAL_PNG_BREEDS = {};  // Add breed IDs here as final PNGs arrive
```

Depois (exemplo ativando caramelo e pug):
```js
var FINAL_PNG_BREEDS = { caramelo: true, pug: true };
```

- A chave é o **`breed_id` do jogo** (ex.: `poodle`, `maltes`, `husky`), NÃO o prefixo de arquivo (`poodle_toy`, `maltês`, `husky_siberiano`). O mapeamento id→arquivo já é feito por `BREED_TO_PNG` no mesmo arquivo.
- Ativação pode ser **incremental por raça** — raças não listadas continuam no SVG.
- O fallback SVG permanece automático via `onerror` mesmo para raças ativadas.

## Motivo

O caminho PNG em `renderDogSprite` e `renderBreedPreview` só é usado quando `FINAL_PNG_BREEDS[breedId]` é truthy. Isso impede que assets brutos/inválidos voltem a aparecer no jogo.

## Como reverter

Remover a entrada da raça do objeto (ou esvaziar para `{}`). Nenhuma outra mudança é necessária — o SVG volta a ser o caminho primário imediatamente.

## O que NUNCA alterar nesta ativação

- UI, layout, CSS, lógica de jogo, balanceamento, progressão.
- `BREED_TO_PNG` (nomenclatura é contrato com os arquivos).
- O pipeline de QA (`tools/validate_assets.py`).
