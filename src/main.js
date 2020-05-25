let config = {
    type: Phaser.CANVAS,
    width: 256,
    height: 176,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: {
                x:0,
                y: 0
            }
        }
    },
    scene: [Overworld]
}
let game = new Phaser.Game(config);
let keyRIGHT, keyLEFT, keyUP, keyDOWN, keyW, keyA, keyD, keyS;