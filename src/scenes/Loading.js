class Loading extends Phaser.Scene{
    constructor(){
        super("loadingScene");
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

        //sounds
        this.load.audio('noBattery', './assets/audio/OOB.wav');
        this.load.audio('bgm', './assets/audio/1.mp3');
        this.load.audio('walkSound', './assets/audio/Walk.wav');
        this.load.audio('recover', './assets/audio/Refill.wav');
    }
    create(){
        this.add.text(120,120, "Loading...");
        console.log("Loading...");
        this.scene.start("overworldScene");
    }
}