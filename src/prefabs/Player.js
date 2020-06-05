class Player extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, texture, frame){
        super(scene,x,y,texture,frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.maxBattery = 25;
        this.currentBattery = this.maxBattery;
        this.alive = true;
        //idle animation
        this.scene.anims.create({
            key: 'idleAnim',
            frames: this.scene.anims.generateFrameNames('robot', {
                prefix: 'sprite',
                start: 1,
                end: 8,
                //suffix: '.png'
            }),
            frameRate: 8,
            repeat: -1
        });
        //moving animation
        this.scene.anims.create({
            key: 'movingAnim',
            frames: this.scene.anims.generateFrameNames('robot', {
                prefix: 'sprite',
                start: 9,
                end: 19,
                //suffix: '.png'
            }),
            frameRate: 8,
            repeat: -1
        });
        //death animation
        this.scene.anims.create({
            key: 'deathAnim',
            frames: this.scene.anims.generateFrameNames('robot', {
                prefix: 'sprite',
                start: 20,
                end: 26,
                //suffix: '.png'
            }),
            frameRate: 8,
            repeat: 0
        });
        this.anims.play('idleAnim');
        this.notKeyZ = true;
    }
    update(){
        //key down
        if(this.currentBattery > 1 && this.alive){
            if(keyLEFT.isDown){
                this.setVelocityX(-100);
                this.currentBattery -= .05;
                this.setRotation(Math.PI/2);
                this.anims.play('movingAnim', true);
                this.scene.sound.play('walkSound', {
                    volume: .1
                });
            }
            else if(keyRIGHT.isDown){
                this.setVelocityX(100);
                this.currentBattery -= .05;
                this.setRotation(-Math.PI/2);
                this.anims.play('movingAnim', true);
                this.scene.sound.play('walkSound', {
                    volume: .1
                });
            }
            else if(keyUP.isDown){
                this.setVelocityY(-100);
                this.currentBattery -= .05;
                this.setRotation(Math.PI);
                this.anims.play('movingAnim', true);
                this.scene.sound.play('walkSound', {
                    volume: .1
                });
            }
            else if(keyDOWN.isDown){
                this.setVelocityY(100);
                this.currentBattery -= .05;
                this.setRotation(0);
                this.anims.play('movingAnim', true);
                this.scene.sound.play('walkSound', {
                    volume: .1
                });
            }
            //key up
            if(keyLEFT.isUp && keyRIGHT.isUp && keyUP.isUp && keyDOWN.isUp){
                this.stopPlayer();
            }
            if(keyS.isDown){
                this.recoverCharge(1);
            }

        }
        if(this.currentBattery < 1){
            this.alive = false;
            this.stopPlayer();
        }
        if(keyA.isDown){
            this.anims.play('deathAnim', true);
        }
        if(keyW.isDown){
            this.die();
            this.stopPlayer();
        }
        if(Phaser.Input.Keyboard.JustDown(keyZ)){
            //this.input.disabled = true;
            console.log("Z button pressed");
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
    die(){
        this.currentBattery = 0;
    }
    stopPlayer(){
        this.setVelocityX(0);
        this.setVelocityY(0);
        this.currentBattery -= 0;
        this.anims.play('idleAnim', true);
    }
}