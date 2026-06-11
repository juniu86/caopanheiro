# Prompts — Akita (`akita`)

- **Prefixo de arquivo:** `akita`
- **Porte:** Grande — personagem com ~80% da altura do canvas
- **Diretório de destino:** `img/breeds/`

> Nota: nos estados diferentes de `feliz`, a cláusula de expressão fixa da raça é
> removida do prompt para não conflitar com o estado emocional.

## Prompt negativo (todos os estados)

```
fundo quadriculado, fundo branco, paleta de cores, swatches, texto, marca d'água, múltiplas poses, folha de sprites, grid, sombra no chão, personagem cortado, fotorrealismo, 3D, objetos extras, coleira, brinquedo
```

## `akita_feliz.png`

```
Ilustração 2D de jogo casual cozy, akita inu de pelagem espessa creme-alaranjada com branco no focinho, peito e patas, cabeça larga em formato de urso, orelhas pequenas triangulares eretas e inclinadas para frente, cauda grande enrolada sobre o dorso, postura nobre e digna, cachorro de corpo inteiro, sentado ou em pé, rabo levantado e animado, boca aberta sorrindo, língua aparecendo, olhos brilhantes e arregalados de alegria, estilo flat com sombreamento suave em dois tons, linhas limpas de espessura consistente, cores quentes, luz superior esquerda, fundo totalmente transparente, uma única pose, sem texto, sem paleta de cores, sem fundo quadriculado, sem sombra no chão, pés alinhados à base da imagem, canvas 1024x1024
```

## `akita_triste.png`

```
Ilustração 2D de jogo casual cozy, akita inu de pelagem espessa creme-alaranjada com branco no focinho, peito e patas, cabeça larga em formato de urso, orelhas pequenas triangulares eretas e inclinadas para frente, cauda grande enrolada sobre o dorso, postura nobre e digna, cachorro de corpo inteiro, deitado ou cabisbaixo, orelhas caídas, rabo baixo entre as patas, olhos tristes e melancólicos olhando para baixo, estilo flat com sombreamento suave em dois tons, linhas limpas de espessura consistente, cores quentes, luz superior esquerda, fundo totalmente transparente, uma única pose, sem texto, sem paleta de cores, sem fundo quadriculado, sem sombra no chão, pés alinhados à base da imagem, canvas 1024x1024
```

## `akita_com_fome.png`

```
Ilustração 2D de jogo casual cozy, akita inu de pelagem espessa creme-alaranjada com branco no focinho, peito e patas, cabeça larga em formato de urso, orelhas pequenas triangulares eretas e inclinadas para frente, cauda grande enrolada sobre o dorso, postura nobre e digna, cachorro de corpo inteiro, olhando para cima com expectativa, lambendo o focinho com a língua, uma pata dianteira levantada em pedido, olhos suplicantes, estilo flat com sombreamento suave em dois tons, linhas limpas de espessura consistente, cores quentes, luz superior esquerda, fundo totalmente transparente, uma única pose, sem texto, sem paleta de cores, sem fundo quadriculado, sem sombra no chão, pés alinhados à base da imagem, canvas 1024x1024
```

## `akita_doente.png`

```
Ilustração 2D de jogo casual cozy, akita inu de pelagem espessa creme-alaranjada com branco no focinho, peito e patas, cabeça larga em formato de urso, orelhas pequenas triangulares eretas e inclinadas para frente, cauda grande enrolada sobre o dorso, postura nobre e digna, cachorro de corpo inteiro, deitado com postura encolhida, olhos semicerrados e cansados, orelhas murchas, expressão abatida e febril, bochechas levemente coradas, sem objetos, estilo flat com sombreamento suave em dois tons, linhas limpas de espessura consistente, cores quentes, luz superior esquerda, fundo totalmente transparente, uma única pose, sem texto, sem paleta de cores, sem fundo quadriculado, sem sombra no chão, pés alinhados à base da imagem, canvas 1024x1024
```

## `akita_dormindo.png`

```
Ilustração 2D de jogo casual cozy, akita inu de pelagem espessa creme-alaranjada com branco no focinho, peito e patas, cabeça larga em formato de urso, orelhas pequenas triangulares eretas e inclinadas para frente, cauda grande enrolada sobre o dorso, postura nobre e digna, cachorro de corpo inteiro, enrolado dormindo no chão, olhos completamente fechados, expressão serena e tranquila, rabo encostado no corpo, estilo flat com sombreamento suave em dois tons, linhas limpas de espessura consistente, cores quentes, luz superior esquerda, fundo totalmente transparente, uma única pose, sem texto, sem paleta de cores, sem fundo quadriculado, sem sombra no chão, pés alinhados à base da imagem, canvas 1024x1024
```

## `akita_neutro.png`

```
Ilustração 2D de jogo casual cozy, akita inu de pelagem espessa creme-alaranjada com branco no focinho, peito e patas, cabeça larga em formato de urso, orelhas pequenas triangulares eretas e inclinadas para frente, cauda grande enrolada sobre o dorso, postura nobre e digna, cachorro de corpo inteiro, em pé sobre as quatro patas, postura relaxada, rabo em posição natural, expressão calma e atenta, boca fechada ou levemente aberta, estilo flat com sombreamento suave em dois tons, linhas limpas de espessura consistente, cores quentes, luz superior esquerda, fundo totalmente transparente, uma única pose, sem texto, sem paleta de cores, sem fundo quadriculado, sem sombra no chão, pés alinhados à base da imagem, canvas 1024x1024
```

## Checklist pós-geração desta raça

- [ ] 6 arquivos com os nomes exatos acima
- [ ] Mesmo indivíduo nos 6 estados (anatomia, paleta, acabamento)
- [ ] Escala ~80% da altura do canvas respeitada
- [ ] `python3 tools/validate_assets.py` sem falhas para esta raça
