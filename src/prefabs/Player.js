class Player extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, x, y, texture, frame){
        super(scene,x,y,texture,frame);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setSize(29,29);
        this.maxBattery = 25;
        this.currentBattery = this.maxBattery;
        this.alive = true;
        this.drainRate = .008;

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

        //special death animation
        this.scene.anims.create({
            key: 'specialDeathAnim',
            frames: this.scene.anims.generateFrameNames('specialDeath', {
                prefix: 'sprite',
                start: 1,
                end: 24,
            }),
            frameRate: 8,
            repeat: 0
        });
    }

    update(){
        //key down
        if(this.currentBattery > 1 && this.alive){
            if(keyLEFT.isDown){
                this.setVelocityX(-100);
                this.currentBattery -= this.drainRate;
                this.setRotation(Math.PI/2);
                this.anims.play('movingAnim', true);
                this.scene.sound.play('walkSound', {
                    volume: .1
                });
            }
            else if(keyRIGHT.isDown){
                this.setVelocityX(100);
                this.currentBattery -= this.drainRate;
                this.setRotation(-Math.PI/2);
                this.anims.play('movingAnim', true);
                this.scene.sound.play('walkSound', {
                    volume: .1
                });
            }
            else if(keyUP.isDown){
                this.setVelocityY(-100);
                this.currentBattery -= this.drainRate;
                this.setRotation(Math.PI);
                this.anims.play('movingAnim', true);
                this.scene.sound.play('walkSound', {
                    volume: .1
                });
            }
            else if(keyDOWN.isDown){
                this.setVelocityY(100);
                this.currentBattery -= this.drainRate;
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

        }
        if(this.currentBattery < 1){
            this.alive = false;
            this.stopPlayer();
        }
        if(Phaser.Input.Keyboard.JustDown(keyZ)){
            this.die();
            this.stopPlayer();
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
        this.currentBattery = this.maxBattery;
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