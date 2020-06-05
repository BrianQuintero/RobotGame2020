class TextBoxes extends Phaser.Scene{
    constructor(){
        super("pauseScreen");
    }
    init(player){
        player = this.player;
    }
    preload(){

    }
    create(){
        var words = ["One", "Two", "Three"];
        var i = 4;
        console.log(words.length);
        if(i < words.length){
            this.add.text(100, 100, words[i]);
            i++;
        }
        else{
            this.add.text(100, 100, words[words.length - 1]);
        }
        
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }
    update(){
        if(keySPACE.isDown){
            //console.log(this.player);
            this.scene.resume("overworldScene");
            //this.player.stopPlayer();
            this.scene.stop();
        }
    }
}