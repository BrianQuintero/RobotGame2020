class TextBoxes extends Phaser.Scene{
    constructor(){
        super("titleScreen");
    }
    preload(){
        this.load.atlas("title", './assets/titleScreen.png', './assets/titleScreen.json');
    }
    create(){
        this.introScreen = this.add.sprite(0,0,"title").setOrigin(0,0);
        this.anims.create({
            key: 'titleAnim',
            frames: this.anims.generateFrameNames('title', {
                prefix: 'sprite',
                end: 6
            }),
            frameRate: 8,
            repeat: -1
        });
        this.introScreen.anims.play('titleAnim');
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }
    update(){
        if(keySPACE.isDown){
            this.scene.start("introScene");
        }
    }
}