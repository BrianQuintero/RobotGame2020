class Player extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, texture, frame){
        super(scene,x,y,texture,frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }
    update(){
        //key down
        if(keyLEFT.isDown){
            this.setVelocityX(-100);
        }
        else if(keyRIGHT.isDown){
            this.setVelocityX(100);
        }
        else if(keyUP.isDown){
            this.setVelocityY(-100);
        }
        else if(keyDOWN.isDown){
            this.setVelocityY(100);
        }
        //key up
        if(keyLEFT.isUp && keyRIGHT.isUp && keyUP.isUp && keyDOWN.isUp){
            this.setVelocityX(0);
            this.setVelocityY(0);
        }
    }
}