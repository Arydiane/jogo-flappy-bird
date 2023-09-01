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