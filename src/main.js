//The Right Way
//Art & Map Design: Jeven Zarate-McCoy
//Music and Sound Design: Giovanni Lua-Trejo
//Programming: Brian Quintero

let config = {
    type: Phaser.CANVAS,
    width: 512,
    height: 352,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: {
                x:0,
                y: 0
            }
        }
    },
    scene: [Intro, Loading, Overworld, TextBoxes]
}
let game = new Phaser.Game(config);
let keyRIGHT, keyLEFT, keyUP, keyDOWN, keyW, keyA, keyD, keyS, keySPACE, keyZ, keyH;
