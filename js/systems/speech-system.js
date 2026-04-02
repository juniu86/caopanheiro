var Game = Game || {};

Game.SpeechSystem = (function () {
  var currentBubble = null;
  var bubbleTimer = null;
  var AUTO_INTERVAL = 15000; // auto-speech every 15 seconds
  var autoTimer = null;

  // Phrases by mood (generic + breed personality adds flavor)
  var PHRASES = {
    feliz: [
      'Au au! Tô feliz!',
      'Amo você! \u2764',
      '*abanando o rabo*',
      'Vamos brincar?',
      'Que dia lindo!',
      'Melhor dono do mundo!',
      '*lambe sua mão*',
      'Tô tão bem cuidado!',
      'Oba oba oba!',
      '*pula de alegria*'
    ],
    triste: [
      'Hmm... tô tristinho.',
      '*olhar pidão*',
      'Brinca comigo?',
      'Tô entediado...',
      'Preciso de carinho.',
      '*choraminga baixinho*',
      'Não me esquece...',
      'Faz tempo que não passeamos.'
    ],
    dormindo: [
      '*ronc ronc*',
      'Zzz... biscoito...',
      '*patinha mexendo*',
      'Zzz... bolinha...',
      '*suspiro dormindo*',
      'Zzz...'
    ],
    com_fome: [
      'FOME! Cadê a ração?!',
      '*olha pra tigela vazia*',
      'Barriga roncando!',
      'Um petisco? Por favor?',
      '*lambe os beiços*',
      'Tô com fominha...',
      'Minha tigela tá vazia!',
      '*cheira a cozinha*'
    ],
    doente: [
      '*snif snif*',
      'Não tô me sentindo bem...',
      'Au... preciso do vet.',
      '*deita e olha triste*',
      'Tô dodói...',
      'Me leva no veterinário?',
      '*treme de frio*'
    ]
  };

  // Breed-specific phrases (personality flavor)
  var BREED_PHRASES = {
    caramelo: ['Sou raça? Sou CARAMELO!', 'Sobrevivi na rua, agora sou rei!', '*olhar pidão nivel 1000*'],
    pretinho: ['Sou lindo e invisível de noite!', '*esconde atrás do sofá*', 'Fiel até o fim!'],
    pug: ['*ronca acordado*', 'Tô cansado de existir.', '*respira forte*', 'Sofá > tudo'],
    husky: ['AUUUUUUU!', '*drama intenso*', 'NÃO QUERO BANHO!', 'Tá calor demais!'],
    golden: ['EU AMO TODO MUNDO!', '*traz chinelo*', 'Melhor dia da minha vida! (de novo)', '*sorriso golden*'],
    labrador: ['COMIDA? CADÊ?', '*mergulha na tigela*', 'Eu como TUDO.', 'Tem mais ração?'],
    corgi: ['*bumbum balançando*', 'Sou baixinho mas sou corajoso!', 'Minhas perninhas!'],
    pinscher: ['LATE LATE LATE!', 'SAI DAQUI INTRUSO!', '*treme de raiva*', 'SOU GRANDE POR DENTRO!'],
    chihuahua: ['*tremendo*', 'EU SOU O CHEFE AQUI!', 'Colo! Agora!', '*late agudo*'],
    border_collie: ['Organizei seus brinquedos.', 'Preciso de MAIS exercício!', 'Já aprendi tudo, e agora?'],
    dalmata: ['*corre em círculos*', 'Sou manchado e orgulhoso!', 'Vamos correr!'],
    bulldog_frances: ['*senta como humano*', 'Elegância é meu nome.', '*bufa*', 'Chic demais.'],
    schnauzer: ['*ajeitando bigode*', 'Muito distinto!', '*pose de bigode*'],
    boxer: ['*boxeia o ar*', 'SOU FORTE!', '*pula no sofá*', 'Vamos lutar de brincadeira!'],
    akita: ['*reverência*', '...', '*olha dignamente*', 'Sou nobre.'],
    sao_bernardo: ['*baba no chão*', '*abraço de urso*', 'Tô grandão mas sou bebê.'],
    rottweiler: ['*olhar intimidador*', 'Guardo a casa!', '*mas na verdade quer carinho*'],
    beagle: ['QUE CHEIRO É ESSE?!', '*fareja tudo*', 'ENCONTREI PETISCO!', '*segue o nariz*'],
    shih_tzu: ['*rola no tapete*', 'Sou uma princesa.', 'Escova meu pelo?'],
    yorkshire: ['*late como um grande*', 'NINGUÉM MEXE COMIGO!', 'Sou pequeno mas valente!'],
    poodle: ['*dança em duas patas*', 'Sou chique!', 'Inteligente? Eu? Obvio.'],
    pastor_alemao: ['Serviço cumprido!', '*guarda a porta*', 'Disciplina!', 'Sempre alerta!'],
    pitbull: ['*sorriso largo*', 'ADOTE NÃO COMPRE!', 'Sou forte e carinhoso!', '*lambida molhada*'],
    mastiff: ['*deita e não levanta*', 'Tô muito confortável.', 'Zzz... ah... oi.', '*boceja enorme*'],
    terra_nova: ['*nada na tigela de água*', 'Sou um salva-vidas!', '*babá dos pequenos*']
  };

  // Reaction phrases for actions
  var ACTION_REACTIONS = {
    feed: ['Nhom nhom! Delícia!', 'ERA HORA!', '*devora tudo*', 'Mais? \uD83E\uDD7A', 'Que gostoso!'],
    play: ['BOLA BOLA BOLA!', 'Eba! De novo!', '*pega e não devolve*', 'Vamos!', 'Eu pego!'],
    bathe: ['NÃO O BANHO!', '*sacode tudo*', 'Tá frio!', 'Pelo menos tô cheiroso...', '*shake shake*'],
    sleep: ['Boa noite... \uD83D\uDCA4', '*boceja grande*', 'Até amanhã...', '*fecha os olhinhos*'],
    carinho: ['Aaah que gostoso!', '*fecha os olhos*', 'Mais cafuné!', 'Ronron... ops, sou cachorro.', '\u2764\u2764\u2764'],
    walk: ['PASSEIO! PASSEIO!', '*puxa a coleira*', 'PRA RUA!', '*fareja tudo no caminho*', 'Melhor coisa!'],
    teach: ['Senta? Assim?', '*tenta de novo*', 'Tô quase!', 'Acho que entendi!', 'Olha o que eu sei!'],
    vet: ['Não gosto do vet...', '*treme*', 'Vai doer?', 'Pelo menos vou melhorar.', '*olha assustado*'],
    petisco: ['PETISCO! OMG!', '*baba*', 'PRO MELHOR CACHORRO!', 'Eu mereço!', '*olhar hipnotizado*'],
    wake: ['*espreguiça*', 'Bom dia!', '*boceja e estica*', 'Já acordei!']
  };

  function init() {
    Game.EventBus.on('action:performed', onAction);
    startAutoSpeech();
  }

  function startAutoSpeech() {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = setInterval(function () {
      if (!Game.State || Game.State.dogs.length === 0) return;
      if (Game.ScreenManager.getCurrent() !== 'screen-home') return;
      showAutoSpeech();
    }, AUTO_INTERVAL);
  }

  function showAutoSpeech() {
    var dog = Game.UI.getSelectedDog ? Game.UI.getSelectedDog() : null;
    if (!dog) return;

    var mood = Game.DogRenderer.getDogMood(dog);
    var phrases = PHRASES[mood] || PHRASES.feliz;

    // 30% chance to use breed-specific phrase
    var breedPhrases = BREED_PHRASES[dog.breedId];
    if (breedPhrases && Math.random() < 0.3) {
      phrases = breedPhrases;
    }

    var phrase = phrases[Math.floor(Math.random() * phrases.length)];
    showBubble(phrase);
  }

  function onAction(data) {
    if (!data.actionId) return;
    var reactions = ACTION_REACTIONS[data.actionId];
    if (!reactions) return;

    var phrase = reactions[Math.floor(Math.random() * reactions.length)];
    showBubble(phrase);
  }

  function showBubble(text) {
    var container = document.getElementById('speech-bubble');
    if (!container) return;

    container.textContent = text;
    container.classList.add('speech-bubble--visible');

    if (bubbleTimer) clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(function () {
      container.classList.remove('speech-bubble--visible');
      bubbleTimer = null;
    }, 3500);
  }

  function destroy() {
    if (autoTimer) clearInterval(autoTimer);
    if (bubbleTimer) clearTimeout(bubbleTimer);
  }

  return { init: init, showBubble: showBubble, destroy: destroy };
})();
