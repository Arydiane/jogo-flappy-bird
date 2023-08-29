const sprites = new Image();
sprites.src = 'img/sprites.png';

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


function loop() {

    planoDeFundo.desenha(); 

    requestAnimationFrame(loop);
}

loop(); 