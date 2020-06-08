class TextBoxes extends Phaser.Scene{
    constructor(){
        super("titleScreen");
    }
    preload(){
        this.load.audio('wait', './assets/audio/Waiting.wav');
        this.load.atlas("title", './assets/titleScreen.png', './assets/titleScreen.json');
    }
    create(){
        this.titleMusic = this.sound.add('wait');
        this.titleMusic.play({
            loop: true
        });
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
        keyX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    }
    update(){
        if(keyX.isDown){
            this.titleMusic.stop();
            this.scene.start("introScene");
        }
    }
}