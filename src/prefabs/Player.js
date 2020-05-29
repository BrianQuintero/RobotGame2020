class Player extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, texture, frame){
        super(scene,x,y,texture,frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.maxBattery = 25;
        this.currentBattery = this.maxBattery;
    }
    update(){
        //key down
        if(keyLEFT.isDown){
            this.setVelocityX(-100);
            this.currentBattery -= .01;
        }
        else if(keyRIGHT.isDown){
            this.setVelocityX(100);
            this.currentBattery -= .01;
        }
        else if(keyUP.isDown){
            this.setVelocityY(-100);
            this.currentBattery -= .01;
        }
        else if(keyDOWN.isDown){
            this.setVelocityY(100);
            this.currentBattery -= .01;
        }
        //key up
        if(keyLEFT.isUp && keyRIGHT.isUp && keyUP.isUp && keyDOWN.isUp){
            this.setVelocityX(0);
            this.setVelocityY(0);
            this.currentBattery -= 0;
        }
        if(keyS.isDown){
            this.recoverCharge(1);
        }
    }
    recoverCharge(number){
        if(this.currentBattery + number > this.maxBattery){
            this.currentBattery = this.maxBattery;
        }
        else{
            this.currentBattery += number;
        }
    }
    increaseMaxCharge(number){
        this.maxBattery += number;
    }
}