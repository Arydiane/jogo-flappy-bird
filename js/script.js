const som_PULO = new Audio();
som_PULO.src = 'sound/pulo.wav';

const som_HIT = new Audio();
som_HIT.src = 'sound/hit.wav';

const sprites = new Image();
sprites.src = 'img/sprites.png';

let telaAtiva = {}, globais = {}, frames = 0;

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

function criaChao() {
    const chao = {
        spriteX: 0,
        spriteY: 610,
        largura: 224,
        altura: 112,
        x: 0,
        y: canvas.height - 112,

        atualiza: function () {
            const movimentoDoChao = 1;
            const repeteEm = chao.largura / 2;

            if (chao.x <= -repeteEm) {
                return chao.x = 0;
            }

            chao.x = chao.x - movimentoDoChao;
        },
        desenha: function () {

            context.drawImage(
                sprites,
                chao.spriteX, chao.spriteY,
                chao.largura, chao.altura,
                chao.x, chao.y,
                chao.largura, chao.altura,
            );

            context.drawImage(
                sprites,
                chao.spriteX, chao.spriteY,
                chao.largura, chao.altura,
                (chao.x + chao.largura), chao.y,
                chao.largura, chao.altura,
            );
        }
    }
    return chao;
}

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

function criaCanos() {
    const canos = {
        largura: 52,
        altura: 400,
        chao: {
            spriteX: 0,
            spriteY: 169
        },
        ceu: {
            spriteX: 52,
            spriteY: 169,
        },
        pares: [],

        desenha: function () {
            canos.pares.forEach(function (par) {
                const yRandom = par.y;
                const espacamentoEntreCanos = 90;

                const canoCeuX = par.x;
                const canoCeuY = yRandom;
                //Cano do céu
                context.drawImage(
                    sprites,
                    canos.ceu.spriteX, canos.ceu.spriteY,
                    canos.largura, canos.altura,
                    canoCeuX, canoCeuY,
                    canos.largura, canos.altura,
                );

                const canoChaoX = par.x;
                const canoChaoY = canos.altura + espacamentoEntreCanos + yRandom;
                //Cano do chão
                context.drawImage(
                    sprites,
                    canos.chao.spriteX, canos.chao.spriteY,
                    canos.largura, canos.altura,
                    canoChaoX, canoChaoY,
                    canos.largura, canos.altura,
                );

                par.canoCeu = {
                    x: canoCeuX,
                    y: canos.altura + canoCeuY
                }

                par.canoChao = {
                    x: canoChaoX,
                    y: canoChaoY
                }
            })
        },

        atualiza: function () {
            const passou100Frames = frames % 100 === 0;

            //criar novos pares de canos a cada 100 frames
            if (passou100Frames) {
                canos.pares.push({
                    x: canvas.width,
                    y: -150 * (Math.random() + 1),
                })
            }

            //movimenta pares de canos na tela
            canos.pares.forEach(function (par) {
                par.x = par.x - 2;

                if (canos.temColisaoComFlappyBird(par)) {
                    som_HIT.play();
                    mudaParaTela(Telas.GAME_OVER);
                }

                //verifica se o cano saiu da tela e retira do array
                if ((par.x + canos.largura) <= 0) {
                    canos.pares.shift();
                }
            })
        },

        temColisaoComFlappyBird: function (par) {
            const cabecaDoFlappy = globais.flappyBird.y;
            const peDoFlappy = globais.flappyBird.y + globais.flappyBird.altura;
            const corpoDoFlappy = globais.flappyBird.x;

            if ((globais.flappyBird.x + globais.flappyBird.largura) >= par.x) {
                //se passarinho invadiu a area dos canos
                if (cabecaDoFlappy <= par.canoCeu.y) {
                    if (corpoDoFlappy <= par.canoCeu.x + this.largura) {
                        return true;
                    }
                }

                if (peDoFlappy >= par.canoChao.y) {
                    if (corpoDoFlappy <= par.canoChao.x + this.largura) {
                        return true;
                    }
                }
            }

            return false;
        }
    }

    return canos;
}

function criaPlacar() {
    const placar = {
        pontuacao: 0,
        medalha: {
            largura: 44,
            altura: 44,
            ouro: {
                x: 0,
                y: 124,
            },
            prata: {
                x: 0,
                y: 79,
            },
            bronze: {
                x: 48,
                y: 124,
            }
        },
        atualiza: function () {
            const intervaloDeFrames = 20;
            const passouOIntervalo = frames % intervaloDeFrames === 0;

            if (passouOIntervalo) {
                placar.pontuacao++
            }

        },
        desenha: function (x = canvas.width - 10, y = 35) {
            context.fillStyle = 'white';
            context.textAlign = 'right';
            context.font = '35px "VT323"';
            context.fillText(`${placar.pontuacao}`, x, y);

        },
        desenhaMedalha: function () {
            let medalhaConquistada;

            //verifica a medalha conquistada
            if (placar.pontuacao <= 5) {
                medalhaConquistada = this.medalha.bronze;
            } else if (placar.pontuacao < 20) {
                medalhaConquistada = this.medalha.prata
            } else {
                medalhaConquistada = this.medalha.ouro;
            }

            //desenha medalha conquistada na tela
            context.drawImage(
                sprites,
                medalhaConquistada.x, medalhaConquistada.y,
                this.medalha.largura, this.medalha.altura,
                72, 135, //posição na tela game over
                this.medalha.largura, this.medalha.altura,
            )
        }, 
     
    }

    return placar;
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
        }
    }
}

function fazColisao(flappyBird, chao) {
    const flappyBirdY = flappyBird.y + flappyBird.altura;
    const chaoY = chao.y;

    if (flappyBirdY >= chaoY) {
        return true;
    }

    return false;
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