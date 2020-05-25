class Overworld extends Phaser.Scene{
    constructor(){
        super("overworldScene");
    }
    preload(){
        this.load.image("testTiles", './assets/testTile.png');
        this.load.tilemapTiledJSON('testMap', './assets/testMap.json');
        this.load.image('player', './assets/player/playerTemp.png');
    }
    create(){
        //creation of tilemap for game
        const map = this.make.tilemap({key: 'testMap'});
        const tileset = map.addTilesetImage('testTile', 'testTiles');
        const mainLayer = map.createStaticLayer('Tile Layer 1', tileset, 0,0);
        //physics world collision boundaries
        this.physics.world.setBounds(0,0,map.widthInPixels,map.heightInPixels);
        mainLayer.setCollisionByProperty({collide: true});
        this.cameras.main.setPosition(0,0);
        //keyboard controls
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        //boundary crossing and creation
        this.boundaryMinX = 0;
        this.boundaryMaxX = 256;
        this.boundaryMinY = 0;
        this.boundaryMaxY = 176
        this.inBounds = true;
        //const camera = this.cameras.main;
        //player spawn
        const spawnPoint = map.findObject("Player", obj => obj.name === "PlayerSpawn");
        this.player = new Player(this, spawnPoint.x, spawnPoint.y, 'player');
        this.playerCameraPositionX = this.player.x;
        this.playerCameraPositionY = this.player.y;
        this.cameraPosX = 0;
        this.cameraPosY = 0;
        this.physics.add.collider(this.player, mainLayer);
        //camera hitbox creation
        this.cameraBound = this.add.rectangle(this, 0,0,256,716, 0x95b64f, 50);
        //camera setup
        this.cameras.main.setBounds(0,0,map.widthInPixels, map.heightInPixels);
        //this.cameras.main.startFollow(this.player);
        this.cameras.main.roundPixels = true;
        this.add.rectangle(0,0,256,176,0xFFFFFF, 0.05).setOrigin(0,0);
    }
    update(){
        //camera stuff (I can probably shorten this some other time)
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
                this.boundaryMaxX += 256;
                this.boundaryMinX += 256;
                this.cameraPosX += 256;
                this.cameras.main.setScroll(this.cameraPosX,this.cameraPosY);
                this.inBounds = true;
                break;
            case "down":
                this.player.y += 10;
                this.boundaryMaxY += 176;
                this.boundaryMinY +=  176;
                this.cameraPosY += 176;
                this.cameras.main.setScroll(this.cameraPosX,this.cameraPosY);
                this.inBounds = true;
                break;
            case "left":
                this.player.x -= 10;
                this.boundaryMaxX -= 256;
                this.boundaryMinX -= 256;
                this.cameraPosX -= 256;
                this.cameras.main.setScroll(this.cameraPosX,this.cameraPosY);
                this.inBounds = true;
                break;
            case "up":
                this.player.y -= 10;
                this.boundaryMaxY -= 176;
                this.boundaryMinY -= 176;
                this.cameraPosY -= 176;
                this.cameras.main.setScroll(this.cameraPosX,this.cameraPosY);
                this.inBounds = true;
                break;
        }

    }
}