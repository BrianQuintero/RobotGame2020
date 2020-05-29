class Overworld extends Phaser.Scene{
    constructor(){
        super("overworldScene");
    }
    preload(){
        this.load.image('newTiles', './assets/Tilesheet_2.png');
        this.load.tilemapTiledJSON('testMap', './assets/tilesheetTestMap.json');
        this.load.image('player', './assets/player/playerTemp.png');
        this.load.image('crate', './assets/crate.png');
        this.load.image('batteryPickup', './assets/batteryPickup.png');
        this.load.image('batteryUI', './assets/batteryUI.png');
    }
    create(){
        //creation of tilemap for game
        const map = this.make.tilemap({key: 'testMap'});
        const tileset = map.addTilesetImage('Tilesheet_2', 'newTiles');
        const groundLayer = map.createStaticLayer('Ground', tileset, 0,0);
        const wallLayer = map.createStaticLayer('Walls', tileset, 0,0);
        const decoLayer = map.createStaticLayer('Decorations', tileset,0,0);
        let boxLayer = map.getObjectLayer('Pushable', tileset, 0, 0);
        //physics world collision boundaries
        this.physics.world.setBounds(0,0,map.widthInPixels,map.heightInPixels);
        wallLayer.setCollisionByProperty({collisionWall: true});
        this.cameras.main.setPosition(0,0);

        //keyboard controls
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

        //boundary crossing and creation
        this.boundaryMinX = 0;
        this.boundaryMaxX = game.config.width;
        this.boundaryMinY = 0;
        this.boundaryMaxY = game.config.height;
        this.inBounds = true;

        //player creation and setup
        const spawnPoint = map.findObject("SpawnPoint", obj => obj.name === "PlayerSpawn");
        this.player = new Player(this, spawnPoint.x, spawnPoint.y, 'player');
        this.healthbar = this.add.sprite(35, 15, 'batteryUI').setScale(1, .60);
        this.healthbar.setScrollFactor(0);
        this.healthbar.setDepth(10);
        this.healthFillNum = (this.player.currentBattery / this.player.maxBattery) *4;
        this.healthbarFill = this.add.rectangle(64,15,-this.healthFillNum, 18, 0x30DF2E);
        this.healthbarFill.setScrollFactor(0);
        //button creation
        this.buttons = map.createFromObjects("Buttons", "TestButton");
        this.physics.world.enable(this.buttons, Phaser.Physics.Arcade.DYNAMIC_BODY);
        this.buttons.map((button) => {
            button.body.setSize(5,5);
        });

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
        this.physics.add.overlap(this.boxes, this.buttons, this.buttonPush);
        this.physics.add.collider(this.player, this.boxes);
        this.physics.add.collider(this.boxes, wallLayer);
        this.physics.add.collider(this.boxes, this.boxes);
        this.physics.add.overlap(this.player, this.batteries, (player, battery) => {
            player.increaseMaxCharge(25);
            battery.destroy();
        });

        //health/battery stuff
        this.healthIndicator = this.add.text(70, 10, "Player Health: " + this.player.currentBattery);
        this.healthIndicator.setScrollFactor(0);

        //camera stuff
        this.playerCameraPositionX = this.player.x; //camera position creation
        this.playerCameraPositionY = this.player.y;
        this.cameraPosX = 0;
        this.cameraPosY = 0;
        this.physics.add.collider(this.player, wallLayer);
        this.cameras.main.setBounds(0,0,map.widthInPixels, map.heightInPixels);
        this.cameras.main.roundPixels = true;
    }
    update(){
        //camera stuff (I can probably shorten this some other time)
        if(this.player.currentBattery < 1){
            this.scene.restart();
        }
        this.healthFillNum = (this.player.currentBattery / 100) * 60;
        this.healthbarFill.width = -this.healthFillNum;
        this.healthIndicator.text = Math.trunc(this.player.currentBattery) + "%";
        if(this.player.currentBattery > 16){
            this.healthbarFill.fillColor = 0x5FEB0F;
        }
        if(this.player.currentBattery < 16){
            this.healthbarFill.fillColor = 0xF50D0D;
        }
        this.playerCameraPositionX = this.player.x;
        this.playerCameraPositionY = this.player.y;
        this.player.update();
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
    buttonPush(){
        console.log("button pushed");
    }
    /*pickUpBattery(player, battery){
        this.player.increaseMaxCharge(25);
        this.player.recoverCharge(25);
        console.log("battery collision");
    }*/

}