class Epilogue extends Phaser.Scene{
    constructor(){
        super("endingScreen");
    }
    preload(){
        this.load.atlas("epilogue", './assets/epilogue.png', './assets/epilogue.json');
    }
    create(){
        this.epilogueScreen = this.add.sprite(0,0,'epilogue').setOrigin(0,0);
        this.anims.create({
            key: 'epilogueAnim',
            frames: this.anims.generateFrameNames('epilogue', {
                prefix: 'sprite',
                end: 200
            }),
            frameRate: 8,
            repeat: 0
        });
        this.epilogueScreen.anims.play('epilogueAnim');
    }
    update(){
        
    }
}