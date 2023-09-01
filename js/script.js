//carrega sons
const som_PULO = new Audio();
som_PULO.src = 'sound/pulo.wav';

const som_HIT = new Audio();
som_HIT.src = 'sound/hit.wav';

//carrega imagens
const sprites = new Image();
sprites.src = 'img/sprites.png';

let telaAtiva = {}, globais = {}, frames = 0, historicoPontuacao = [];

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const planoDeFundo = {
    spriteX: 390,
    spriteY: 0,
    largura: 275,
    altura: 204,
    x: 0,
    y: canvas.height - 204,

    desenha: function () {

        context.fillStyle = '#70c5ce';
        context.fillRect(0, 0, canvas.width, canvas.height)

        context.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            planoDeFundo.x, planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,
        );

        context.drawImage(
            sprites,
            planoDeFundo.spriteX, planoDeFundo.spriteY,
            planoDeFundo.largura, planoDeFundo.altura,
            (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
            planoDeFundo.largura, planoDeFundo.altura,
        );
    }
}

const mensagemGetReady = {
    spriteX: 134,
    spriteY: 0,
    largura: 174,
    altura: 152,
    x: (canvas.width / 2) - 172 / 2,
    y: 50,

    desenha: function () {
        context.drawImage(
            sprites,
            mensagemGetReady.spriteX, mensagemGetReady.spriteY,
            mensagemGetReady.largura, mensagemGetReady.altura,
            mensagemGetReady.x, mensagemGetReady.y,
            mensagemGetReady.largura, mensagemGetReady.altura,
        );
    }
}

const mensagemGameOver = {
    spriteX: 134,
    spriteY: 153,
    largura: 226,
    altura: 200,
    x: (canvas.width / 2) - 226 / 2,
    y: 50,

    desenha: function () {
        context.drawImage(
            sprites,
            mensagemGameOver.spriteX, mensagemGameOver.spriteY,
            mensagemGameOver.largura, mensagemGameOver.altura,
            mensagemGameOver.x, mensagemGameOver.y,
            mensagemGameOver.largura, mensagemGameOver.altura,
        );
    }
}

const Telas = {
    INICIO: {
        inicializa: function () {
            globais.flappyBird = criaFlappyBird();
            globais.chao = criaChao();
            globais.canos = criaCanos();
        },
        atualiza: function () {
            globais.chao.atualiza();
        },
        click: function () {
            mudaParaTela(Telas.JOGO);
        },
        desenha: function () {
            planoDeFundo.desenha();
            globais.chao.desenha();
            globais.flappyBird.desenha();
            mensagemGetReady.desenha();
        }
    },
    JOGO: {
        inicializa: function () {
            globais.placar = criaPlacar();
        },
        atualiza: function () {
            globais.canos.atualiza();
            globais.chao.atualiza();
            globais.flappyBird.atualiza();
            globais.placar.atualiza();
        },
        click: function () {
            globais.flappyBird.pula();
        },
        desenha: function () {
            planoDeFundo.desenha();
            globais.canos.desenha();
            globais.chao.desenha();
            globais.flappyBird.desenha();
            globais.placar.desenha();
        }
    },
    GAME_OVER: {
        inicializa: function () {
            historicoPontuacao.push(globais.placar.pontuacao);
        },
        atualiza: function () {

        },
        click: function (evento) {
            //captura o clique do mouse
            const mouseX = evento.pageX - canvas.offsetLeft;
            const mouseY = evento.pageY - canvas.offsetTop;

            //botão start tem largura = 82 e altura = 28
            //posicionamento inicial do botão na tela
            const botaoX = (canvas.width / 2) - 41;
            const botaoY = 220;

            //verifica se o clique foi dentro da area do botão start
            if (mouseX >= botaoX && mouseX <= (botaoX + 82)) {
                if (mouseY >= botaoY && mouseY <= (botaoY + 28)) {
                    mudaParaTela(Telas.INICIO);
                }
            }
        },
        desenha: function () {
            mensagemGameOver.desenha();
            globais.placar.desenha(canvas.width - 80, 148);
            globais.placar.desenhaMedalha();
            globais.placar.desenhaMelhorPotuacao();
        }
    }
}

function mudaParaTela(novaTela) {
    telaAtiva = novaTela;

    if (telaAtiva.inicializa) {
        telaAtiva.inicializa();
    }
}

function loop() {

    telaAtiva.desenha();
    telaAtiva.atualiza();

    frames++;
    requestAnimationFrame(loop);
}

window.addEventListener('click', (e) => {
    if (telaAtiva.click) {
        telaAtiva.click(e);
    }
})

mudaParaTela(Telas.INICIO);
loop(); 