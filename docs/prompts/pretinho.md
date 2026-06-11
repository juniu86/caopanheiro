# Prompts — Pretinho (`pretinho`)

- **Prefixo de arquivo:** `pretinho`
- **Porte:** Vira-lata (médio) — personagem com ~70% da altura do canvas
- **Diretório de destino:** `img/breeds/`

> Nota: nos estados diferentes de `feliz`, a cláusula de expressão fixa da raça é
> removida do prompt para não conflitar com o estado emocional.

## Prompt negativo (todos os estados)

```
fundo quadriculado, fundo branco, paleta de cores, swatches, texto, marca d'água, múltiplas poses, folha de sprites, grid, sombra no chão, personagem cortado, fotorrealismo, 3D, objetos extras, coleira, brinquedo
```

## `pretinho_feliz.png`

```
Ilustração 2D de jogo casual cozy, vira-lata brasileiro de pelagem curta totalmente preta com pequena mancha branca no peito, orelhas semi-eretas, porte médio magro, focinho médio, olhos castanhos expressivos e brilhantes, cauda animada para cima, expressão fiel e companheira, cachorro de corpo inteiro, sentado ou em pé, rabo levantado e animado, boca aberta sorrindo, língua aparecendo, olhos brilhantes e arregalados de alegria, estilo flat com sombreamento suave em dois tons, linhas limpas de espessura consistente, cores quentes, luz superior esquerda, fundo totalmente transparente, uma única pose, sem texto, sem paleta de cores, sem fundo quadriculado, sem sombra no chão, pés alinhados à base da imagem, canvas 1024x1024
```

## `pretinho_triste.png`

```
Ilustração 2D de jogo casual cozy, vira-lata brasileiro de pelagem curta totalmente preta com pequena mancha branca no peito, orelhas semi-eretas, porte médio magro, focinho médio, olhos castanhos expressivos e brilhantes, cauda animada para cima, cachorro de corpo inteiro, deitado ou cabisbaixo, orelhas caídas, rabo baixo entre as patas, olhos tristes e melancólicos olhando para baixo, estilo flat com sombreamento suave em dois tons, linhas limpas de espessura consistente, cores quentes, luz superior esquerda, fundo totalmente transparente, uma única pose, sem texto, sem paleta de cores, sem fundo quadriculado, sem sombra no chão, pés alinhados à base da imagem, canvas 1024x1024
```

## `pretinho_com_fome.png`

```
Ilustração 2D de jogo casual cozy, vira-lata brasileiro de pelagem curta totalmente preta com pequena mancha branca no peito, orelhas semi-eretas, porte médio magro, focinho médio, olhos castanhos expressivos e brilhantes, cauda animada para cima, cachorro de corpo inteiro, olhando para cima com expectativa, lambendo o focinho com a língua, uma pata dianteira levantada em pedido, olhos suplicantes, estilo flat com sombreamento suave em dois tons, linhas limpas de espessura consistente, cores quentes, luz superior esquerda, fundo totalmente transparente, uma única pose, sem texto, sem paleta de cores, sem fundo quadriculado, sem sombra no chão, pés alinhados à base da imagem, canvas 1024x1024
```

## `pretinho_doente.png`

```
Ilustração 2D de jogo casual cozy, vira-lata brasileiro de pelagem curta totalmente preta com pequena mancha branca no peito, orelhas semi-eretas, porte médio magro, focinho médio, olhos castanhos expressivos e brilhantes, cauda animada para cima, cachorro de corpo inteiro, deitado com postura encolhida, olhos semicerrados e cansados, orelhas murchas, expressão abatida e febril, bochechas levemente coradas, sem objetos, estilo flat com sombreamento suave em dois tons, linhas limpas de espessura consistente, cores quentes, luz superior esquerda, fundo totalmente transparente, uma única pose, sem texto, sem paleta de cores, sem fundo quadriculado, sem sombra no chão, pés alinhados à base da imagem, canvas 1024x1024
```

## `pretinho_dormindo.png`

```
Ilustração 2D de jogo casual cozy, vira-lata brasileiro de pelagem curta totalmente preta com pequena mancha branca no peito, orelhas semi-eretas, porte médio magro, focinho médio, olhos castanhos expressivos e brilhantes, cauda animada para cima, cachorro de corpo inteiro, enrolado dormindo no chão, olhos completamente fechados, expressão serena e tranquila, rabo encostado no corpo, estilo flat com sombreamento suave em dois tons, linhas limpas de espessura consistente, cores quentes, luz superior esquerda, fundo totalmente transparente, uma única pose, sem texto, sem paleta de cores, sem fundo quadriculado, sem sombra no chão, pés alinhados à base da imagem, canvas 1024x1024
```

## `pretinho_neutro.png`

```
Ilustração 2D de jogo casual cozy, vira-lata brasileiro de pelagem curta totalmente preta com pequena mancha branca no peito, orelhas semi-eretas, porte médio magro, focinho médio, olhos castanhos expressivos e brilhantes, cauda animada para cima, cachorro de corpo inteiro, em pé sobre as quatro patas, postura relaxada, rabo em posição natural, expressão calma e atenta, boca fechada ou levemente aberta, estilo flat com sombreamento suave em dois tons, linhas limpas de espessura consistente, cores quentes, luz superior esquerda, fundo totalmente transparente, uma única pose, sem texto, sem paleta de cores, sem fundo quadriculado, sem sombra no chão, pés alinhados à base da imagem, canvas 1024x1024
```

## Checklist pós-geração desta raça

- [ ] 6 arquivos com os nomes exatos acima
- [ ] Mesmo indivíduo nos 6 estados (anatomia, paleta, acabamento)
- [ ] Escala ~70% da altura do canvas respeitada
- [ ] `python3 tools/validate_assets.py` sem falhas para esta raça
