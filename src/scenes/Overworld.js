class Overworld extends Phaser.Scene{
    constructor(){
        super("overworldScene");
    }
    preload(){
        //this.load.image("testTiles", './assets/testTile.png');
        this.load.image('newTiles', './assets/Tilesheet_2.png');
        //this.load.tilemapTiledJSON('testMap', './assets/testMap.json');
        this.load.tilemapTiledJSON('testMap', './assets/tilesheetTestMap.json');
        this.load.image('player', './assets/player/playerTemp.png');
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
        //player spawn
        const spawnPoint = map.findObject("SpawnPoint", obj => obj.name === "PlayerSpawn");
        //player creation and setup
        this.player = new Player(this, spawnPoint.x, spawnPoint.y, 'player');
        //box creation
        /*this.boxes = this.physics.add.group({

        });*/
        this.boxes = map.createFromObjects("Pushable", "Block", 3);
        //console.log(this.boxes);
        this.physics.world.enable(this.boxes,Phaser.Physics.Arcade.DYNAMIC_BODY);
        this.boxes.map((box) => {
            box.body.setAllowDrag(true);
            box.body.setDrag(10000, 10000);
        });
        //this.boxGroup = this.add.group(this.boxes);
        this.physics.add.collider(this.player, this.boxes);
        this.physics.add.collider(this.boxes, wallLayer);
        this.physics.add.collider(this.boxes, this.boxes);
        //this.boxes.add.setAllowDrag(true);
        //this.boxes.physics.setAllowDrag(true);
        //this.boxes.body.setDrag(99,0);
        //health/battery stuff
        this.healthIndicator = this.add.text("Player Health: " + this.player.currentBattery);
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
        this.healthIndicator.text = "Player Health: " + Math.trunc(this.player.currentBattery);
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
    findBlock(){
        console.log(this.box);
    }

}