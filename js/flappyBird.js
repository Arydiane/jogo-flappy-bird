function criaFlappyBird() {
    const flappyBird = {
        spriteX: 0,
        spriteY: 0,
        largura: 33,
        altura: 24,
        x: 10,
        y: 50,
        velocidade: 0,
        gravidade: 0.10,
        pulo: 3,
        movimentos: [
            { spriteX: 0, spriteY: 0, }, //asa para cima
            { spriteX: 0, spriteY: 26, }, //asa no meio
            { spriteX: 0, spriteY: 52, }, //asa para baixo
        ],
        frameAtual: 0,

        atualizarOFrameAtual: function () {
            const intervaloDeFrames = 10;
            const passouOIntervalo = frames % intervaloDeFrames === 0;

            if (passouOIntervalo) {
                const baseDoIncremento = 1;
                const incremento = baseDoIncremento + flappyBird.frameAtual;
                const baseRepeticao = flappyBird.movimentos.length;
                flappyBird.frameAtual = incremento % baseRepeticao;
            }
        },

        atualiza: function () {
            if (fazColisao(flappyBird, globais.chao)) {
                som_HIT.play();
                mudaParaTela(Telas.GAME_OVER);
                return;
            }

            flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
            flappyBird.y = flappyBird.y + flappyBird.velocidade;
        },
        desenha: function () {
            flappyBird.atualizarOFrameAtual();

            const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual];
            context.drawImage(
                sprites,
                spriteX, spriteY,
                flappyBird.largura, flappyBird.altura,
                flappyBird.x, flappyBird.y,
                flappyBird.largura, flappyBird.altura,
            );
        },
        pula: function () {
            flappyBird.velocidade = -flappyBird.pulo;
            som_PULO.play();
        }
    }

    return flappyBird;
}

function fazColisao(flappyBird, chao) {
    const flappyBirdY = flappyBird.y + flappyBird.altura;
    const chaoY = chao.y;

    if (flappyBirdY >= chaoY) {
        return true;
    }

    return false;
}
