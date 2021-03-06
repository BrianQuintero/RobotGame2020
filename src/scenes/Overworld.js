class Overworld extends Phaser.Scene{
    constructor(){
        super("overworldScene");
    }
    preload(){
        //images and tilemaps
        this.load.image('newTiles', './assets/Tilesheet_2.png');
        this.load.tilemapTiledJSON('finalMap', './assets/finalMap.json');
        this.load.image('player', './assets/player/playerTemp.png');
        this.load.image('crate', './assets/crate.png');
        this.load.image('batteryPickup', './assets/batteryPickup.png');
        this.load.image('batteryUI', './assets/batteryUI.png');
        this.load.image('lorePiece', './assets/lorePiece.png');
        this.load.atlas('robot', './assets/player/robot.png', './assets/player/robot.json');
        this.load.atlas('textBox', './assets/textBox.png', './assets/textBox.json');
        this.load.atlas("specialDeath", './assets/specialDeath.png', './assets/specialDeath.json');

        //sounds
        this.load.audio('noBattery', './assets/audio/OOB.wav');
        this.load.audio('bgm', './assets/audio/1.mp3');
        this.load.audio('walkSound', './assets/audio/Walk.wav');
        this.load.audio('recover', './assets/audio/Refill.wav');
        this.load.audio('collectLore', './assets/audio/Collect.wav');
        this.load.audio('endingDeath', './assets/audio/D2.wav');
    }
    create(){
        this.bgm = this.sound.add('bgm');
        this.bgm.play({
            loop: true
        });

        //creation of tilemap for game
        const map = this.make.tilemap({key: 'finalMap'});
        const tileset = map.addTilesetImage('Tilesheet_Final_1', 'newTiles');
        const groundLayer = map.createStaticLayer('Floor', tileset, 0,0);
        this.wallLayer = map.createStaticLayer('Walls', tileset, 0,0);

        //text box animation
        this.textAnimation = this.add.sprite(95, 245, 'textBox').setOrigin(0,0);
        this.textAnimation.setAlpha(0);
        this.textAnimation.setScrollFactor(0);
        this.textAnimation.setDepth(10);
        this.anims.create({
            key: 'textAnim',
            frames: this.anims.generateFrameNames('textBox', {
                prefix: 'sprite',
                end: 6
            }),
            frameRate: 15,
            repeat: 0
        });
        this.textAnimationComplete = false;

        //lore text creation
        var lore1 = "Subjects remain halfway between human and “oil monster” in a state of pain and semi-sapience before entirely losing themselves. Often they hide just out of sight and become dormant until a living creature it can hunt comes close.";
        var lore2 = "Onset of the illness comes at varying speeds and there are no symptoms before it begins. The lucky ones are placed inside cryogenic chambers to buy them more time, but it doesn’t hold it off forever.";
        var lore3 = "We’ve found that the oil-like form of people lost to the illness can occasionally keep some control and output currents with surprising precision. This unfortunately is not a cure but may provide another way of life for victims.";
        var lore4 = "Three million potential infected who have not yet turned have been collected and placed in cryogenic storage to help prevent further casualties from victims or the Oil Beasts as they’ve been called";
        var lore5 = "Our researchers are suddenly being attacked by the illness at an incredibly high rate as well as many outside we thought were immune before. We’re going to go through with the Auto-Cure Generation program so even if we all die...";
        var lore6 = "We’ve designed a sapient machine that will reboot once every decade to check the progress of the cure. It will be able to load itself into a terminal and decide whether to continue trials or... end it. It's our only hope.";
        
        //word checking array
        this.words = [lore1, lore2, lore3, lore4, lore5, lore6];
        this.i = 0;

        //physics world collision boundaries
        this.physics.world.setBounds(0,0,map.widthInPixels,map.heightInPixels);
        this.wallLayer.setCollisionByProperty({CollisionWall: true});
        this.testRectangle = this.add.rectangle(256,300,320,100, 0x000000).setAlpha(0);
        //keyboard controls
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyZ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        keyH = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        //player creation and setup
        this.spawnPoint = map.findObject("PlayerSpawn", obj => obj.name === "SpawnPoint");
        this.player = new Player(this, this.spawnPoint.x, this.spawnPoint.y, 'robot').setScale(0.89,0.89);
        this.healthbar = this.add.sprite(35, 15, 'batteryUI').setScale(1, .60);
        this.healthbar.setScrollFactor(0);
        this.healthbar.setDepth(10);
        this.healthFillNum = (this.player.currentBattery / this.player.maxBattery) *4;
        this.healthbarFill = this.add.rectangle(64,15,-this.healthFillNum, 18, 0x30DF2E);
        this.healthbarFill.setScrollFactor(0);
        this.batteriesCollected = 0;
        this.liv = true;

        //Lore piece pickup
        this.lorePiece = map.createFromObjects("lore", "lorePiece", {
            key: 'lorePiece'
        });
        this.physics.world.enable(this.lorePiece, Phaser.Physics.Arcade.DYNAMIC_BODY);

        //battery creation
        this.batteries = map.createFromObjects("batteries", "batteryPickup", {
            key: 'batteryPickup'
        });
        this.physics.world.enable(this.batteries, Phaser.Physics.Arcade.DYNAMIC_BODY);

        //collision commands
        this.physics.add.overlap(this.player, this.checkBox, this.gameOver);
        this.physics.add.overlap(this.player, this.batteries, (player, battery) => {
            this.makeText("battery");
            this.sound.play('recover');
            player.increaseMaxCharge(25);
            this.batteriesCollected++;
            battery.destroy();
        });

        //health/battery stuff
        this.healthIndicator = this.add.text(70, 10, "Player Health: " + this.player.currentBattery);
        this.healthIndicator.setScrollFactor(0);

        //header config
        let headConfig = {
            fontFamily: "Arial N"
        };

        //main text config
        let mainTextConfig = {
            fontFamily: "Arial N",
            fontSize: '11px',
            wordWrap: {width: 310}
        };
        //camera stuff
        this.playerCameraConstantX = Math.trunc(this.player.x / game.config.width);
        this.playerCameraConstantY = Math.trunc(this.player.y / game.config.height);
        this.playerCameraPositionX = this.player.x; //camera position creation
        this.playerCameraPositionY = this.player.y;
        this.cameraPosX = this.playerCameraConstantX * game.config.width;
        this.cameraPosY = this.playerCameraConstantY * game.config.height;
        this.physics.add.collider(this.player, this.wallLayer);
        this.cameras.main.setBounds(0,0,map.widthInPixels, map.heightInPixels);
        this.cameras.main.roundPixels = true;
        this.cameras.main.setScroll(this.cameraPosX, this.cameraPosY);

        //boundary crossing and creation
        this.boundaryMinX = this.playerCameraConstantX * game.config.width;
        this.boundaryMaxX = (this.playerCameraConstantX + 1) * game.config.width;
        this.boundaryMinY = this.playerCameraConstantY * game.config.height;
        this.boundaryMaxY = (this.playerCameraConstantY + 1) * game.config.height;
        this.inBounds = true;

        //header text box
        this.textBox = this.add.text(100, 250, "");
        this.textBox.setScrollFactor(0);
        this.textBox.setDepth(100);

        //finer details text
        this.mainText = this.add.text(100, 280, "", mainTextConfig);
        this.mainText.setScrollFactor(0);
        this.mainText.setDepth(100);

        this.closeTo = this.add.text(305, 330, "", mainTextConfig);
        this.closeTo.setScrollFactor(0);
        this.closeTo.setDepth(100)

        //end game area
        this.endMarker = map.findObject("endGame", obj => obj.name === "endCircle");
        this.checkBox = this.physics.add.sprite(100,100);
        this.checkBox.x = this.endMarker.x;
        this.checkBox.y = this.endMarker.y;
        this.checkBox.body.setCircle(100);
        this.endGame = false;

        this.physics.add.overlap(this.player, this.checkBox, () => {
            this.player.die();
            this.player.setVelocityX(0);
            this.player.setVelocityY(0);
        });

        this.physics.add.overlap(this.player, this.lorePiece, (player, lore) => {
            this.makeText("lore");
            this.sound.play('collectLore');
            lore.destroy();
        });
        this.makeText("tutorial");
    }
    update(){
        if(this.player.currentBattery >= 1 && this.liv){
            this.player.update();
        }
        if(Phaser.Input.Keyboard.JustDown(keySPACE)){
            this.closeText();
        }
        //death condition
        if(this.player.currentBattery < 1 && this.liv && this.player.body.touching.none){
            this.liv = false;
            this.sound.play('noBattery');
            this.player.anims.play('deathAnim', true);
            this.bgm.stop();
            this.player.on('animationcomplete', () => {
                this.clock = this.time.delayedCall(1978, () => {
                    this.player.destroy();
                    this.respawn();
                },null, this);
            });
        }
        else if(this.player.currentBattery < 1 && this.liv && !this.player.body.touching.none){
            this.liv = false;
            this.bgm.stop();
            this.player.setRotation(0);
            this.sound.play('endingDeath');
            this.player.anims.play('specialDeathAnim', true);
            this.player.once("animationcomplete", () =>{
                this.clock = this.time.delayedCall(1978, () => {
                    this.cameras.main.fadeOut();
                    this.cameras.main.once("camerafadeoutcomplete", () => {
                        this.scene.start("endingScreen");
                    })
                },null, this);
            });
        }

        //battery bar updates
        this.healthFillNum = (this.player.currentBattery / 100) * 60;
        this.healthbarFill.width = -this.healthFillNum;
        this.healthIndicator.text = Math.trunc(this.player.currentBattery) + "%";
        if(this.player.currentBattery > 16){
            this.healthbarFill.fillColor = 0x5FEB0F;
        }
        if(this.player.currentBattery < 16){
            this.healthbarFill.fillColor = 0xF50D0D;
        }

        //justcamerathings.png
        this.playerCameraPositionX = this.player.x;
        this.playerCameraPositionY = this.player.y;
        if(this.playerCameraPositionX >= this.boundaryMaxX && this.inBounds){
            this.inBounds = false;
            this.updateCamera("right");
        }
        if(this.playerCameraPositionY >= this.boundaryMaxY && this.inBounds){
            this.inBounds = false;
            this.updateCamera("down");
        }
        if(this.playerCameraPositionX < this.boundaryMinX && this.inBounds){
            this.inBounds = false;
            this.updateCamera("left");
        }
        if(this.playerCameraPositionY < this.boundaryMinY && this.inBounds){
            this.inBounds = false;
            this.updateCamera("up");
        }
    }

    //camera change algorithm
    updateCamera(direction){
        switch(direction){
            case "right":          
                this.player.x += 10;
                this.boundaryMaxX += game.config.width;
                this.boundaryMinX += game.config.width;
                this.cameraPosX += game.config.width;
                this.cameras.main.setScroll(this.cameraPosX,this.cameraPosY);
                this.inBounds = true;
                break;
            case "down":
                this.player.y += 10;
                this.boundaryMaxY += game.config.height;
                this.boundaryMinY +=  game.config.height;
                this.cameraPosY += game.config.height;
                this.cameras.main.setScroll(this.cameraPosX,this.cameraPosY);
                this.inBounds = true;
                break;
            case "left":
                this.player.x -= 10;
                this.boundaryMaxX -= game.config.width;
                this.boundaryMinX -= game.config.width;
                this.cameraPosX -= game.config.width;
                this.cameras.main.setScroll(this.cameraPosX,this.cameraPosY);
                this.inBounds = true;
                break;
            case "up":
                this.player.y -= 10;
                this.boundaryMaxY -= game.config.height;
                this.boundaryMinY -= game.config.height;
                this.cameraPosY -= game.config.height;
                this.cameras.main.setScroll(this.cameraPosX,this.cameraPosY);
                this.inBounds = true;
                break;
        }

    }
    gameOver(){

    }
    respawn(){
        //recreate player and collisions (there has to be a better way to do this)
        this.player = new Player(this, this.spawnPoint.x, this.spawnPoint.y, 'robot');
        this.physics.add.collider(this.player, this.wallLayer);
        this.physics.add.collider(this.player, this.boxes);
        this.physics.add.overlap(this.player, this.lorePiece, (player, lore) => {
            this.makeText("lore");
            this.sound.play('collectLore');
            lore.destroy();
        });
        this.physics.add.overlap(this.player, this.checkBox, () => {
            this.player.die();
            this.player.setVelocityX(0);
            this.player.setVelocityY(0);
        });
        this.physics.add.overlap(this.player, this.batteries, (player, battery) => {
            this.sound.play('recover');
            this.makeText("battery");
            player.increaseMaxCharge(25);
            this.batteriesCollected++;
            battery.destroy();
        });
        //Camera (this is overkill, I know)
        this.player.x = this.spawnPoint.x;
        this.player.y = this.spawnPoint.y;
        this.playerCameraConstantX = Math.trunc(this.player.x / game.config.width);
        this.playerCameraConstantY = Math.trunc(this.player.y / game.config.height);
        this.playerCameraPositionX = this.player.x; //camera position creation
        this.playerCameraPositionY = this.player.y;
        this.cameraPosX = this.playerCameraConstantX * game.config.width;
        this.cameraPosY = this.playerCameraConstantY * game.config.height;
        this.boundaryMinX = this.playerCameraConstantX * game.config.width;
        this.boundaryMaxX = (this.playerCameraConstantX + 1) * game.config.width;
        this.boundaryMinY = this.playerCameraConstantY * game.config.height;
        this.boundaryMaxY = (this.playerCameraConstantY + 1) * game.config.height;
        this.inBounds = true;
        this.cameras.main.setScroll(this.cameraPosX, this.cameraPosY);
        this.player.maxBattery = 25 + (25 * this.batteriesCollected);
        //reset stats
        this.player.currentBattery = this.player.maxBattery;
        this.liv = true;
        this.player.update();
        this.bgm.play({
            loop: true
        });
    }

    makeText(type){
        this.textBox.text = "";
        this.mainText.text = "";
        this.textAnimation.setAlpha(1);
        this.textAnimation.anims.play('textAnim', true);
        this.textAnimation.once("animationcomplete", () => {
            this.textAnimationComplete = true;
            this.closeTo.text = "[Press SPACE to close]";
            if(type === "battery"){
                this.textBox.text = "Battery Obtained!";
                this.mainText.text = "Your maximum battery has increased by 25!";
            }
            else if(type === "lore"){
                this.textBox.text = "Memory Entry #" + (this.i + 1) + " of 6 found";
                this.mainText.text = this.words.shift();
                this.i++;
            }
            else if(type === "tutorial"){
                this.textBox.text = "Hello World!";
                this.mainText.text = "Use the arrow keys to move around. Press Z to die immediately and respawn";
            }
        });
    }

    closeText(){
        if(this.textAnimationComplete){
            this.textAnimation.setAlpha(0);
            this.textBox.text = "";
            this.mainText.text = "";
            this.closeTo.text = "";
            this.textAnimationComplete = false;
        }
    }
}