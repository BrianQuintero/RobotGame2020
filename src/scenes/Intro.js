class Intro extends Phaser.Scene{
    constructor(){
        super("introScene");
    }
    preload(){
        this.load.atlas("introCutscene", "./assets/introCutscene.png", "./assets/introCutscene.json");
    }
    create(){
        //keyboard code
        this.animComplete = false;
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        //intro animation
        this.introScreen = this.add.sprite(0,0,'introCutscene').setOrigin(0,0);
        this.anims.create({
            key: 'introAnim',
            frames: this.anims.generateFrameNames('introCutscene', {
                prefix: 'sprite',
                end: 102
            }),
            frameRate: 8,
            repeat: 0
        });
        this.introScreen.anims.play('introAnim');
        this.introScreen.on('animationcomplete', () => {
            this.animComplete = true;
        });
    }
    update(){
        if(this.animComplete){
            if(Phaser.Input.Keyboard.JustDown(keySPACE)){
                this.scene.start("loadingScene");
            }
        }
    }
}