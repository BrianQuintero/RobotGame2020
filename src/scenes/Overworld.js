class Overworld extends Phaser.Scene{
    constructor(){
        super("overworldScene");
    }
    preload(){
        //images and tilemaps
        this.load.image('newTiles', './assets/Tilesheet_2.png');
        this.load.tilemapTiledJSON('testMap', './assets/tilesheetTestMap.json');
        this.load.image('player', './assets/player/playerTemp.png');
        this.load.image('crate', './assets/crate.png');
        this.load.image('batteryPickup', './assets/batteryPickup.png');
        this.load.image('batteryUI', './assets/batteryUI.png');
        this.load.atlas('robot', './assets/player/robot.png', './assets/player/robot.json');
        this.load.atlas('textBox', './assets/textBox.png', './assets/textBox.json');

        //sounds
        this.load.audio('noBattery', './assets/audio/OOB.wav');
        this.load.audio('bgm', './assets/audio/1.mp3');
        this.load.audio('walkSound', './assets/audio/Walk.wav');
        this.load.audio('recover', './assets/audio/Refill.wav');
    }
    create(){
        this.bgm = this.sound.add('bgm');
        this.bgm.play({
            loop: true
        });

        //creation of tilemap for game
        const map = this.make.tilemap({key: 'testMap'});
        const tileset = map.addTilesetImage('Tilesheet_2', 'newTiles');
        const groundLayer = map.createStaticLayer('Ground', tileset, 0,0);
        this.wallLayer = map.createStaticLayer('Walls', tileset, 0,0);
        const decoLayer = map.createStaticLayer('Decorations', tileset,0,0);
        let boxLayer = map.getObjectLayer('Pushable', tileset, 0, 0);

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

        //word checking array
        this.words = ["One", "Two", "Three"];
        this.i = 0;

        this.checkBox = this.physics.add.sprite(100,100);
        this.checkBox.body.setCircle(5);
        this.front = false;
        //physics world collision boundaries
        this.physics.world.setBounds(0,0,map.widthInPixels,map.heightInPixels);
        this.wallLayer.setCollisionByProperty({collisionWall: true});
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
        this.spawnPoint = map.findObject("SpawnPoint", obj => obj.name === "PlayerSpawn");
        this.player = new Player(this, this.spawnPoint.x, this.spawnPoint.y, 'robot');
        this.healthbar = this.add.sprite(35, 15, 'batteryUI').setScale(1, .60);
        this.healthbar.setScrollFactor(0);
        this.healthbar.setDepth(10);
        this.healthFillNum = (this.player.currentBattery / this.player.maxBattery) *4;
        this.healthbarFill = this.add.rectangle(64,15,-this.healthFillNum, 18, 0x30DF2E);
        this.healthbarFill.setScrollFactor(0);
        this.batteriesCollected = 0;
        this.liv = true;

        //button creation
        this.buttons = map.createFromObjects("Buttons", "TestButton");
        this.physics.world.enable(this.buttons, Phaser.Physics.Arcade.DYNAMIC_BODY);
        this.buttons.map((button) => {
            button.body.setSize(5,5);
        });
        //end game terminal
        this.endButton = map.createFromTiles(25);
        this.physics.world.enable(this.endButton, Phaser.Physics.Arcade.DYNAMIC_BODY);
        /*this.endButton.map((endGame) => {
            endGame.body.setImmovable(true);
        });*/

        //box creation
        this.boxes = map.createFromObjects("Pushable", "Block", {
            key: "crate"
        });
        this.physics.world.enable(this.boxes,Phaser.Physics.Arcade.DYNAMIC_BODY);
        this.boxes.map((box) => {
            box.body.setAllowDrag(true);
            box.body.setDrag(10000, 10000);
        });

        //battery creation
        this.batteries = map.createFromObjects("Batteries", "batteryPickup", {
            key: 'batteryPickup'
        });
        this.physics.world.enable(this.batteries, Phaser.Physics.Arcade.DYNAMIC_BODY);

        //collision commands
        this.physics.add.collider(this.boxes, this.endButton, this.testFunction);
        this.physics.add.overlap(this.boxes, this.buttons, this.buttonPush);
        this.physics.add.collider(this.player, this.boxes);
        this.physics.add.collider(this.boxes, this.wallLayer, this.testFunction);
        this.physics.add.collider(this.boxes, this.boxes);
        this.physics.add.overlap(this.boxes, this.checkBox, this.testFunction);
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
        //The "box" part of the text box
        this.testRectangle.setScrollFactor(0);
        this.testRectangle.setDepth(10);
        //physics debug
        /*const debugGraphics = this.add.graphics().setAlpha(0.75);
        this.wallLayer.renderDebug(debugGraphics, {tileColor: null, // Color of non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
        });*/
    }
    update(){
        //console.log(this.front.body.touching);
        this.checkBox.x = this.player.x + 10;
        this.checkBox.y = this.player.y - 10;
        if(this.player.currentBattery >= 1 && this.liv){
            this.player.update();
        }
        if(Phaser.Input.Keyboard.JustDown(keyH)){
            this.makeText();
        }
        if(Phaser.Input.Keyboard.JustDown(keySPACE)){
            this.closeText();
        }
        //death condition
        if(this.player.currentBattery < 1 && this.liv){
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
    testFunction(){
        this.front = true;
        console.log("Test complete");
    }
    buttonPush(){
        console.log("button pushed");
    }
    respawn(){
        //recreate player and collisions (there has to be a better way to do this)
        this.player = new Player(this, this.spawnPoint.x, this.spawnPoint.y, 'robot');
        this.physics.add.collider(this.player, this.wallLayer);
        this.physics.add.collider(this.player, this.boxes);
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
            if(type === "battery"){
                this.textBox.text = "Battery Obtained!";
                this.mainText.text = "Your maximum battery has increased by 25!";
            }
            else{
                this.textBox.text = this.words.shift();
                this.mainText.text = "";
                //this.i++;
            }
        });
    }

    closeText(){
        if(this.textAnimationComplete){
            this.textAnimation.setAlpha(0);
            this.textBox.text = "";
            this.mainText.text = "";
            this.textAnimationComplete = false;
        }
    }
}