# Pack de Prompts para Geração de Assets — Meu Cãopanheiro

Especificação oficial do pipeline de assets dos cachorros do jogo **Meu Cãopanheiro**.
Cada uma das **31 raças** precisa de **6 estados emocionais**, cada um como sprite individual com fundo transparente — total de **186 arquivos PNG**.

> Fontes de verdade no código:
> - Lista de raças: `js/data/breeds.js` (`Game.BreedsData`)
> - Mapeamento raça → arquivo PNG: `js/ui/dog-renderer.js` (objeto `BREED_TO_PNG`)
> - Caminho de carregamento em runtime: `img/breeds/{prefixo_png}_{estado}.png`

---

## 1. Especificação técnica global

| Item | Especificação |
|---|---|
| Resolução do source | **1024 × 1024 px** (o jogo redimensiona via CSS) |
| Fundo | **100% transparente** — PNG-24 com canal alpha (ou WebP com alpha) |
| Conteúdo | **UM** cachorro por arquivo, **UMA** pose por arquivo |
| Enquadramento | Corpo inteiro, pés/patas alinhados à base da imagem com margem inferior de **~8%** do canvas; margem lateral mínima de **10%** de cada lado; personagem **nunca** cortado pelas bordas |
| Estilo | Ilustração 2D *cozy* de jogo casual; linhas suaves de **espessura consistente**; sombreamento simples em **2 tons** (cel-shading suave); cores quentes e acolhedoras |
| Iluminação | Luz vinda do **canto superior esquerdo** |
| Sombra no chão | **PROIBIDA** — a sombra projetada é aplicada pelo jogo via CSS |
| Formato de entrega | PNG-24 com alpha, sem metadados desnecessários, otimizado (ex.: `oxipng`/`pngquant`) |

### Proibições absolutas (asset reprovado se contiver qualquer um)

- Fundo quadriculado (padrão xadrez "de transparência" desenhado na imagem);
- Paletas de cor, swatches ou amostras dentro da imagem;
- Texto, letras, números, assinaturas ou marcas d'água;
- Múltiplas variações/poses no mesmo canvas (folha de sprites, grid de opções);
- Personagem cortado pelas bordas do canvas;
- Sombra projetada no chão;
- Objetos/acessórios não pedidos (coleiras, brinquedos, termômetros, tigelas etc.) — os acessórios são itens separados do jogo.

### Escala relativa por porte

A altura do cachorro (do pé ao topo da cabeça/orelhas) em relação à altura do canvas:

| Porte | Altura do personagem no canvas |
|---|---|
| Pequeno (`small`) | ~**60%** |
| Médio (`medium`) | ~**70%** |
| Grande (`large`) | ~**80%** |
| Gigante (`giant`) | ~**90%** |
| Vira-lata (`viralata`) | ~**70%** (renderizado pelo jogo como porte médio) |

Isso garante que a diferença de porte entre raças seja percebida no jogo sem ajuste manual de CSS por raça.

### Nomenclatura de arquivo

```
img/breeds/{prefixo_png}_{estado}.png
```

- `{estado}` ∈ `feliz | triste | com_fome | doente | dormindo | neutro`
- `{prefixo_png}` é **exatamente** o valor do mapeamento `BREED_TO_PNG` em `js/ui/dog-renderer.js`. **Atenção:** nem sempre é igual ao `breed_id` do jogo, e dois prefixos contêm acento (`maltês`, `bulldog_francês`):

| `breed_id` (jogo) | `prefixo_png` (arquivo) |
|---|---|
| `poodle` | `poodle_toy` |
| `maltes` | `maltês` |
| `cocker` | `cocker_spaniel` |
| `bulldog_frances` | `bulldog_francês` |
| `golden` | `golden_retriever` |
| `husky` | `husky_siberiano` |
| (demais raças) | igual ao `breed_id` |

Exemplos válidos: `caramelo_feliz.png`, `husky_siberiano_dormindo.png`, `poodle_toy_neutro.png`, `maltês_triste.png`.

---

## 2. Template de prompt base

Use este bloco como prefixo de **todos** os prompts, substituindo `[RAÇA]` (coluna "Características para o prompt" da tabela da seção 4) e `[DESCRIÇÃO DO ESTADO]` (seção 3):

```
Ilustração 2D de jogo casual cozy, [RAÇA], cachorro de corpo inteiro,
[DESCRIÇÃO DO ESTADO], estilo flat com sombreamento suave em dois tons,
linhas limpas de espessura consistente, cores quentes, luz superior esquerda,
fundo totalmente transparente, uma única pose, sem texto, sem paleta de cores,
sem fundo quadriculado, sem sombra no chão, pés alinhados à base da imagem,
canvas 1024x1024
```

Prompt negativo recomendado (para geradores que suportam negative prompt):

```
fundo quadriculado, fundo branco, paleta de cores, swatches, texto, marca d'água,
múltiplas poses, folha de sprites, grid, sombra no chão, personagem cortado,
fotorrealismo, 3D, objetos extras, coleira, brinquedo
```

---

## 3. Definição dos 6 estados

| Estado | Sufixo de arquivo | Descrição de pose/expressão (usar como `[DESCRIÇÃO DO ESTADO]`) |
|---|---|---|
| Feliz | `_feliz` | sentado ou em pé, rabo levantado e animado, boca aberta sorrindo, língua aparecendo, olhos brilhantes e arregalados de alegria |
| Triste | `_triste` | deitado ou cabisbaixo, orelhas caídas, rabo baixo entre as patas, olhos tristes e melancólicos olhando para baixo |
| Com fome | `_com_fome` | olhando para cima com expectativa, lambendo o focinho com a língua, uma pata dianteira levantada em pedido, olhos suplicantes |
| Doente | `_doente` | deitado com postura encolhida, olhos semicerrados e cansados, orelhas murchas, expressão abatida e febril, bochechas levemente coradas — **SEM objetos** (sem termômetro, sem bolsa de gelo, sem remédio: a doença é transmitida só pela expressão e postura) |
| Dormindo | `_dormindo` | enrolado dormindo no chão, olhos completamente fechados, expressão serena e tranquila, rabo encostado no corpo — sem "Zzz" desenhado (o jogo adiciona o Zzz via CSS) |
| Neutro | `_neutro` | em pé sobre as quatro patas, postura relaxada, rabo em posição natural, expressão calma e atenta, boca fechada ou levemente aberta |

---

## 4. Tabela por raça (31 raças)

A coluna **Características para o prompt** substitui `[RAÇA]` no template e **DEVE** aparecer integralmente no prompt — é o que diferencia visualmente cada raça.

### Porte pequeno

| `breed_id` | `prefixo_png` | Nome | Porte | Características para o prompt |
|---|---|---|---|---|
| `poodle` | `poodle_toy` | Poodle Toy | Pequeno | poodle toy de pelagem branca encaracolada e fofa, tosa arredondada com topete volumoso, orelhas caídas e felpudas, focinho fino e delicado, cauda pequena com pompom, expressão elegante |
| `shih_tzu` | `shih_tzu` | Shih Tzu | Pequeno | shih tzu de pelagem longa e sedosa branca com marcações marrom-douradas, orelhas caídas cobertas de pelo longo, focinho curto e achatado, cauda em pluma enrolada sobre o dorso, expressão doce |
| `yorkshire` | `yorkshire` | Yorkshire | Pequeno | yorkshire terrier de pelagem longa e lisa azul-acinzentada com dourado na cabeça e no peito, orelhas pequenas eretas e pontudas, focinho curto, cauda curta erguida, expressão corajosa |
| `chihuahua` | `chihuahua` | Chihuahua | Pequeno | chihuahua de pelagem curta bege-clara, cabeça arredondada em formato de maçã, olhos grandes e saltados, orelhas enormes eretas e pontudas, focinho minúsculo, cauda fina curvada, corpo miúdo |
| `pinscher` | `pinscher` | Pinscher | Pequeno | pinscher miniatura de pelagem curta preta com marcações marrom-ferrugem nas patas, peito e focinho, orelhas eretas e pontudas, focinho fino e alongado, corpo esguio e compacto, postura alerta |
| `lhasa_apso` | `lhasa_apso` | Lhasa Apso | Pequeno | lhasa apso de pelagem muito longa e lisa caindo até o chão, em tons de dourado e branco, pelo cobrindo parcialmente os olhos, orelhas caídas embutidas no pelo, cauda em pluma sobre o dorso |
| `maltes` | `maltês` | Maltês | Pequeno | maltês de pelagem longa, lisa e completamente branca como seda, orelhas caídas cobertas de pelo, focinho pequeno com nariz preto destacado, olhos redondos escuros, cauda em pluma, expressão doce |
| `pug` | `pug` | Pug | Pequeno | pug de pelagem curta cor de camurça (abricó) com focinho e orelhas pretos, focinho achatado e enrugado, rugas marcadas na testa, olhos grandes redondos e saltados, orelhas pequenas caídas em botão, cauda enrolada em rosquinha, corpo atarracado |

### Porte médio

| `breed_id` | `prefixo_png` | Nome | Porte | Características para o prompt |
|---|---|---|---|---|
| `beagle` | `beagle` | Beagle | Médio | beagle tricolor com sela preta no dorso, laterais marrom-caramelo e patas, peito e ponta da cauda brancos, orelhas longas largas e caídas, focinho quadrado, cauda erguida com ponta branca, expressão curiosa de farejador |
| `cocker` | `cocker_spaniel` | Cocker Spaniel | Médio | cocker spaniel de pelagem dourada e ondulada, orelhas muito longas caídas e franjadas, focinho quadrado com nariz grande, olhos amendoados e dóceis, franjas de pelo nas patas e barriga |
| `border_collie` | `border_collie` | Border Collie | Médio | border collie preto e branco com colar branco no pescoço, lista branca no focinho, peito e patas brancos, pelagem semi-longa, orelhas semi-eretas com pontas dobradas, cauda peluda e baixa, olhar extremamente atento e inteligente |
| `bulldog_frances` | `bulldog_francês` | Bulldog Francês | Médio | bulldog francês de pelagem curta tigrada ou creme, orelhas grandes eretas e arredondadas em formato de morcego, focinho achatado e enrugado, corpo compacto e musculoso, cauda curtinha, expressão simpática de palhaço |
| `bull_terrier` | `bull_terrier` | Bull Terrier | Médio | bull terrier branco com cabeça oval alongada em formato de ovo, perfil curvo sem stop, olhos pequenos triangulares, orelhas eretas e pontudas, corpo musculoso, cauda fina, eventual mancha de cor ao redor de um olho |
| `basenji` | `basenji` | Basenji | Médio | basenji de pelagem curta vermelho-acobreada com peito, patas e ponta da cauda brancos, orelhas eretas e pontudas, testa com pequenas rugas, focinho fino, cauda firmemente enrolada sobre o dorso, porte elegante e atlético |
| `schnauzer` | `schnauzer` | Schnauzer | Médio | schnauzer de pelagem dura cinza sal-e-pimenta, barba e bigode longos característicos no focinho, sobrancelhas espessas e marcadas, orelhas semi-eretas dobradas, corpo quadrado e robusto, expressão esperta |
| `corgi` | `corgi` | Corgi | Médio | welsh corgi de pelagem caramelo-alaranjada com peito, focinho e patas brancos, orelhas grandes eretas e arredondadas, corpo comprido e baixo com pernas bem curtas, traseiro arredondado e fofo, expressão sorridente |

### Porte grande

| `breed_id` | `prefixo_png` | Nome | Porte | Características para o prompt |
|---|---|---|---|---|
| `golden` | `golden_retriever` | Golden Retriever | Grande | golden retriever de pelagem longa e ondulada dourada, orelhas médias caídas, focinho largo e amigável, cauda longa e peluda em pluma, peito forte com franjas de pelo, expressão bondosa e sorridente |
| `labrador` | `labrador` | Labrador | Grande | labrador retriever de pelagem curta e densa amarelo-clara, cabeça larga, orelhas caídas médias, focinho largo, cauda grossa de lontra, corpo atlético e robusto, expressão alegre e leal |
| `husky` | `husky_siberiano` | Husky Siberiano | Grande | husky siberiano de pelagem espessa cinza e branca, máscara facial branca característica, olhos azuis claros, orelhas triangulares eretas e felpudas, cauda peluda em foice, aparência de lobo amigável |
| `pastor_alemao` | `pastor_alemao` | Pastor Alemão | Grande | pastor alemão de pelagem preta e marrom-castanha com sela preta no dorso e máscara preta no focinho, orelhas grandes eretas e pontudas, focinho longo, dorso levemente inclinado, cauda peluda e baixa, postura nobre e atenta |
| `dalmata` | `dalmata` | Dálmata | Grande | dálmata de pelagem curta branca coberta de manchas pretas redondas bem distribuídas, orelhas caídas manchadas, corpo esguio e atlético, cauda longa com manchas, focinho alongado, porte elegante |
| `boxer` | `boxer` | Boxer | Grande | boxer de pelagem curta dourado-fulva com máscara preta no focinho e peito branco, focinho curto e quadrado com mandíbula projetada, orelhas caídas dobradas para frente, corpo musculoso e quadrado, expressão brincalhona |
| `pitbull` | `pitbull` | Pitbull | Grande | pitbull de pelagem curta cinza-azulada com peito branco, cabeça larga com bochechas marcadas, sorriso largo característico, orelhas semi-caídas em rosa, corpo musculoso e compacto, cauda fina, expressão carinhosa |
| `akita` | `akita` | Akita | Grande | akita inu de pelagem espessa creme-alaranjada com branco no focinho, peito e patas, cabeça larga em formato de urso, orelhas pequenas triangulares eretas e inclinadas para frente, cauda grande enrolada sobre o dorso, postura nobre e digna |

### Porte gigante

| `breed_id` | `prefixo_png` | Nome | Porte | Características para o prompt |
|---|---|---|---|---|
| `sao_bernardo` | `sao_bernardo` | São Bernardo | Gigante | são bernardo gigante de pelagem longa branca com grandes placas marrom-avermelhadas, máscara escura ao redor dos olhos, cabeça enorme, orelhas caídas, bochechas pendentes, cauda longa e peluda, expressão gentil de gigante bondoso |
| `dogue_alemao` | `dogue_alemao` | Dogue Alemão | Gigante | dogue alemão enorme de pelagem curta cinza-azulada, corpo altíssimo e esguio com pernas muito longas, cabeça retangular grande, orelhas caídas dobradas, focinho profundo, cauda longa e fina, porte imponente mas expressão desajeitada |
| `rottweiler` | `rottweiler` | Rottweiler | Gigante | rottweiler de pelagem curta preta com marcações marrom-ferrugem bem definidas no focinho, peito, sobrancelhas e patas, cabeça larga e forte, orelhas triangulares caídas, corpo robusto e musculoso, expressão de guardião fiel |
| `mastiff` | `mastiff` | Mastiff | Gigante | mastiff inglês gigante de pelagem curta cor de damasco com máscara preta no focinho e orelhas escuras, corpo extremamente largo e pesado, pele solta com dobras no pescoço e rosto, bochechas pendentes, expressão sonolenta e preguiçosa |
| `terra_nova` | `terra_nova` | Terra Nova | Gigante | terra-nova gigante de pelagem longa, densa e completamente preta, cabeça grande e larga, orelhas pequenas caídas, focinho quadrado, corpo maciço de nadador com patas grandes, cauda grossa e peluda, expressão doce de babá |

### Vira-latas

| `breed_id` | `prefixo_png` | Nome | Porte | Características para o prompt |
|---|---|---|---|---|
| `caramelo` | `caramelo` | Caramelo | Vira-lata (médio) | vira-lata caramelo brasileiro de pelagem curta caramelo uniforme, orelhas semi-eretas com pontas dobradas, porte médio magro e atlético, focinho médio com nariz preto, cauda curvada para cima, expressão simpática e sorridente de cachorro de rua amado |
| `pretinho` | `pretinho` | Pretinho | Vira-lata (médio) | vira-lata brasileiro de pelagem curta totalmente preta com pequena mancha branca no peito, orelhas semi-eretas, porte médio magro, focinho médio, olhos castanhos expressivos e brilhantes, cauda animada para cima, expressão fiel e companheira |

---

## 5. Exemplos de prompts completos prontos

### 5.1 `caramelo_feliz.png`

```
Ilustração 2D de jogo casual cozy, vira-lata caramelo brasileiro de pelagem curta
caramelo uniforme, orelhas semi-eretas com pontas dobradas, porte médio magro e
atlético, focinho médio com nariz preto, cauda curvada para cima, expressão
simpática e sorridente de cachorro de rua amado, cachorro de corpo inteiro,
sentado ou em pé, rabo levantado e animado, boca aberta sorrindo, língua
aparecendo, olhos brilhantes e arregalados de alegria, estilo flat com
sombreamento suave em dois tons, linhas limpas de espessura consistente, cores
quentes, luz superior esquerda, fundo totalmente transparente, uma única pose,
sem texto, sem paleta de cores, sem fundo quadriculado, sem sombra no chão,
pés alinhados à base da imagem, canvas 1024x1024
```

Escala: vira-lata → personagem com ~70% da altura do canvas.

### 5.2 `husky_siberiano_dormindo.png`

```
Ilustração 2D de jogo casual cozy, husky siberiano de pelagem espessa cinza e
branca, máscara facial branca característica, olhos azuis claros, orelhas
triangulares eretas e felpudas, cauda peluda em foice, aparência de lobo
amigável, cachorro de corpo inteiro, enrolado dormindo no chão, olhos
completamente fechados, expressão serena e tranquila, rabo encostado no corpo,
estilo flat com sombreamento suave em dois tons, linhas limpas de espessura
consistente, cores quentes, luz superior esquerda, fundo totalmente
transparente, uma única pose, sem texto, sem paleta de cores, sem fundo
quadriculado, sem sombra no chão, pés alinhados à base da imagem,
canvas 1024x1024
```

Escala: porte grande → personagem com ~80% da altura do canvas. (Obs.: dormindo, os olhos azuis ficam fechados — manter o restante das marcações da raça reconhecível. Não desenhar "Zzz": o jogo adiciona via CSS.)

### 5.3 `pug_com_fome.png`

```
Ilustração 2D de jogo casual cozy, pug de pelagem curta cor de camurça (abricó)
com focinho e orelhas pretos, focinho achatado e enrugado, rugas marcadas na
testa, olhos grandes redondos e saltados, orelhas pequenas caídas em botão,
cauda enrolada em rosquinha, corpo atarracado, cachorro de corpo inteiro,
olhando para cima com expectativa, lambendo o focinho com a língua, uma pata
dianteira levantada em pedido, olhos suplicantes, estilo flat com sombreamento
suave em dois tons, linhas limpas de espessura consistente, cores quentes,
luz superior esquerda, fundo totalmente transparente, uma única pose, sem texto,
sem paleta de cores, sem fundo quadriculado, sem sombra no chão, pés alinhados
à base da imagem, canvas 1024x1024
```

Escala: porte pequeno → personagem com ~60% da altura do canvas.

---

## 6. Checklist de QA do asset

Verificar **cada item** antes de aceitar o arquivo em `img/breeds/`:

1. **Transparência real** — o fundo tem canal alpha de verdade (abrir sobre fundo colorido no editor); não há fundo branco, quadriculado desenhado ou halo opaco ao redor do personagem.
2. **Pose única** — há exatamente UM cachorro e UMA pose no canvas; nenhuma variação, grid ou folha de sprites.
3. **Sem texto nem paleta** — nenhuma letra, número, assinatura, marca d'água, swatch ou paleta de cores na imagem.
4. **Enquadramento correto** — corpo inteiro visível, nada cortado pelas bordas; patas alinhadas à base com ~8% de margem inferior e ≥10% de margem lateral.
5. **Escala do porte respeitada** — altura do personagem condiz com o porte (pequeno ~60%, médio/vira-lata ~70%, grande ~80%, gigante ~90% da altura do canvas).
6. **Sem sombra no chão** — nenhuma sombra projetada sob o personagem (o jogo aplica via CSS).
7. **Estilo consistente** — cel-shading suave em 2 tons, linhas de espessura consistente, luz vinda do canto superior esquerdo, paleta quente compatível com os assets já existentes.
8. **Raça reconhecível** — as características distintivas da tabela da seção 4 (cor da pelagem, orelhas, focinho, cauda, marcações) estão presentes e corretas.
9. **Estado emocional legível** — a pose/expressão corresponde à definição da seção 3 e é compreensível mesmo em tamanho pequeno (~96 px); sem objetos extras (termômetro, tigela, brinquedo, "Zzz").
10. **Arquivo técnico correto** — 1024×1024 px, PNG-24 com alpha, nome exatamente `{prefixo_png}_{estado}.png` conforme `BREED_TO_PNG` (atenção aos acentos em `maltês` e `bulldog_francês`), e a imagem carrega no jogo sem acionar o fallback SVG.
