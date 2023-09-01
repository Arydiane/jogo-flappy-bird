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
                placar.pontuacao++;
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
                medalhaConquistada = this.medalha.prata;
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
        desenhaMelhorPotuacao: function () {
            const melhor = melhorPontuacao(historicoPontuacao);
            
            //desenha melhor pontuação usada na tela game over
            context.fillStyle = 'white';
            context.textAlign = 'right';
            context.font = '35px "VT323"';
            context.fillText(`${melhor}`, canvas.width - 80, 190);
        }
    }

    return placar;
}

function melhorPontuacao(historicoPontos) {
    return historicoPontos.reduce((max, cur) => Math.max(max, cur), -Infinity);
}