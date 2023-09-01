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
