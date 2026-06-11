# Prompts — Border Collie (`border_collie`)

- **Prefixo de arquivo:** `border_collie`
- **Porte:** Médio — personagem com ~70% da altura do canvas
- **Diretório de destino:** `img/breeds/`

> Nota: nos estados diferentes de `feliz`, a cláusula de expressão fixa da raça é
> removida do prompt para não conflitar com o estado emocional.

## Prompt negativo (todos os estados)

```
fundo quadriculado, fundo branco, paleta de cores, swatches, texto, marca d'água, múltiplas poses, folha de sprites, grid, sombra no chão, personagem cortado, fotorrealismo, 3D, objetos extras, coleira, brinquedo
```

## `border_collie_feliz.png`

```
Ilustração 2D de jogo casual cozy, border collie preto e branco com colar branco no pescoço, lista branca no focinho, peito e patas brancos, pelagem semi-longa, orelhas semi-eretas com pontas dobradas, cauda peluda e baixa, olhar extremamente atento e inteligente, cachorro de corpo inteiro, sentado ou em pé, rabo levantado e animado, boca aberta sorrindo, língua aparecendo, olhos brilhantes e arregalados de alegria, estilo flat com sombreamento suave em dois tons, linhas limpas de espessura consistente, cores quentes, luz superior esquerda, fundo totalmente transparente, uma única pose, sem texto, sem paleta de cores, sem fundo quadriculado, sem sombra no chão, pés alinhados à base da imagem, canvas 1024x1024
```

## `border_collie_triste.png`

```
Ilustração 2D de jogo casual cozy, border collie preto e branco com colar branco no pescoço, lista branca no focinho, peito e patas brancos, pelagem semi-longa, orelhas semi-eretas com pontas dobradas, cauda peluda e baixa, cachorro de corpo inteiro, deitado ou cabisbaixo, orelhas caídas, rabo baixo entre as patas, olhos tristes e melancólicos olhando para baixo, estilo flat com sombreamento suave em dois tons, linhas limpas de espessura consistente, cores quentes, luz superior esquerda, fundo totalmente transparente, uma única pose, sem texto, sem paleta de cores, sem fundo quadriculado, sem sombra no chão, pés alinhados à base da imagem, canvas 1024x1024
```

## `border_collie_com_fome.png`

```
Ilustração 2D de jogo casual cozy, border collie preto e branco com colar branco no pescoço, lista branca no focinho, peito e patas brancos, pelagem semi-longa, orelhas semi-eretas com pontas dobradas, cauda peluda e baixa, cachorro de corpo inteiro, olhando para cima com expectativa, lambendo o focinho com a língua, uma pata dianteira levantada em pedido, olhos suplicantes, estilo flat com sombreamento suave em dois tons, linhas limpas de espessura consistente, cores quentes, luz superior esquerda, fundo totalmente transparente, uma única pose, sem texto, sem paleta de cores, sem fundo quadriculado, sem sombra no chão, pés alinhados à base da imagem, canvas 1024x1024
```

## `border_collie_doente.png`

```
Ilustração 2D de jogo casual cozy, border collie preto e branco com colar branco no pescoço, lista branca no focinho, peito e patas brancos, pelagem semi-longa, orelhas semi-eretas com pontas dobradas, cauda peluda e baixa, cachorro de corpo inteiro, deitado com postura encolhida, olhos semicerrados e cansados, orelhas murchas, expressão abatida e febril, bochechas levemente coradas, sem objetos, estilo flat com sombreamento suave em dois tons, linhas limpas de espessura consistente, cores quentes, luz superior esquerda, fundo totalmente transparente, uma única pose, sem texto, sem paleta de cores, sem fundo quadriculado, sem sombra no chão, pés alinhados à base da imagem, canvas 1024x1024
```

## `border_collie_dormindo.png`

```
Ilustração 2D de jogo casual cozy, border collie preto e branco com colar branco no pescoço, lista branca no focinho, peito e patas brancos, pelagem semi-longa, orelhas semi-eretas com pontas dobradas, cauda peluda e baixa, cachorro de corpo inteiro, enrolado dormindo no chão, olhos completamente fechados, expressão serena e tranquila, rabo encostado no corpo, estilo flat com sombreamento suave em dois tons, linhas limpas de espessura consistente, cores quentes, luz superior esquerda, fundo totalmente transparente, uma única pose, sem texto, sem paleta de cores, sem fundo quadriculado, sem sombra no chão, pés alinhados à base da imagem, canvas 1024x1024
```

## `border_collie_neutro.png`

```
Ilustração 2D de jogo casual cozy, border collie preto e branco com colar branco no pescoço, lista branca no focinho, peito e patas brancos, pelagem semi-longa, orelhas semi-eretas com pontas dobradas, cauda peluda e baixa, cachorro de corpo inteiro, em pé sobre as quatro patas, postura relaxada, rabo em posição natural, expressão calma e atenta, boca fechada ou levemente aberta, estilo flat com sombreamento suave em dois tons, linhas limpas de espessura consistente, cores quentes, luz superior esquerda, fundo totalmente transparente, uma única pose, sem texto, sem paleta de cores, sem fundo quadriculado, sem sombra no chão, pés alinhados à base da imagem, canvas 1024x1024
```

## Checklist pós-geração desta raça

- [ ] 6 arquivos com os nomes exatos acima
- [ ] Mesmo indivíduo nos 6 estados (anatomia, paleta, acabamento)
- [ ] Escala ~70% da altura do canvas respeitada
- [ ] `python3 tools/validate_assets.py` sem falhas para esta raça
