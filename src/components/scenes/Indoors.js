import { BoxGeometry, FontLoader, LinearFilter, Mesh, MeshBasicMaterial, MeshPhongMaterial, PerspectiveCamera, Scene, Sprite, SpriteMaterial, TextGeometry, TextureLoader, Vector3 } from "three";
import { Scenes } from ".";
import { PixelFont } from "../fonts";
import { DirectorChair, Indoor, Nolan, Sprites, Stairs, Tripod } from "../images";
import Player from "../player/player";

class Indoors extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();
        // Dialogue checker
        this.dialogueHappened = false;

        // Adding in tiles
        // Hashmap for tiles
        this.tileset = new Map();
        // Outdoors tileset details
        this.imageX = 128;
        this.imageY = 432;
        this.countX = 8;
        this.countY = 27;
        // Blank space
        this.createTile(-1, Indoor, 7, 0);
        // Floor
        this.createTile(0, Indoor, 1, -25);
        // Horizontal
        this.createTile(1, Indoor, 4, -8);
        this.createTile(2, Indoor, 5, -8);
        this.createTile(3, Indoor, 6, -8);

        // Corners
        this.createTile(4, Indoor, 0, -6);
        this.createTile(5, Indoor, 2, -6);
        this.createTile(6, Indoor, 0, -8);
        this.createTile(7, Indoor, 2, -8);

        // Vertical 
        this.createTile(8, Indoor, 3, -6);
        this.createTile(9, Indoor, 3, -7);
        this.createTile(10, Indoor, 3, -8);

        // Table and desks
        this.createTile(12, Indoor, 6, -3);
        this.createTile(13, Indoor, 5, -3);

        this.countX = 1;
        this.countY = 1;
        // Stairs
        this.createTile(11, Stairs, 0, 0);

        // Christopher Nolan Sprite
        this.countX = 3;
        this.countY = 4;
        this.createTile(14, Nolan, 1, -3);

        // Walkable Tiles List
        this.walkable = new Set();
        this.walkable.add(0)
        this.walkable.add(11);

        // Actual tiles for level
        this.tiles = [
            [ 4, 2, 2, 2, 2, 2, 3, 0, 1, 2, 2, 2, 2, 2, 5],
            [ 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
            [ 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
            [ 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
            [ 9, 0, 0, 0, 4, 2, 3,11, 1, 2, 5, 0, 0, 0, 9],
            [ 9, 0, 0, 0, 9, 0, 0, 0, 0, 0, 9, 0, 0, 0, 9],
            [ 9, 0, 0, 0, 9, 0, 0, 0, 0, 0, 9, 0, 0, 0, 9],
            [ 9, 0, 0, 0, 9, 0, 0, 0, 0, 0, 9, 0, 0, 0, 9],
            [ 9, 0, 0, 0, 9, 0, 0,14, 0, 0, 9, 0, 0, 0, 9],
            [ 9, 0, 0, 0, 6, 2, 2, 2, 2, 2, 7, 0, 0, 0, 9],
            [ 9, 0, 0, 0, 0, 0,13,12,13, 0, 0, 0, 0, 0, 9],
            [ 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9],
            [ 9,13,12,13, 0, 0, 0, 0, 0, 0, 0,13,12,13, 9],
            [ 6, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 7],

        ];
        this.width = this.tiles.length;
        this.height = this.tiles[0].length;

        this.createScene();


        // // Create player for scene
        this.player = new Player(Indoors);
        this.add(this.player.sprite);
        this.player.setPosition(this.height / 2 - 0.5, 0, 0);

        // Camera
        this.camera = new PerspectiveCamera();
        // Set up camera
        this.camera.position.set(this.height / 2 - 0.5, 0, 1.6);
        this.camera.lookAt(new Vector3(this.height / 2 - 0.5, 0, 0));
        this.camera.zoom = 0.1;

        // Window resize handler for scene
        this.windowResizeHandler = () => {
            const { innerHeight, innerWidth } = window;
            Scenes.renderer.setSize(innerWidth, innerHeight);
            this.camera.aspect = innerWidth / innerHeight;
            this.camera.updateProjectionMatrix();
        };
        // Arrow key handler
        this.move = (event) => {
            const speed = 0.5;
            if (event.code === 'ArrowUp') {
                const playerPos = this.player.sprite.position;
                // If past map, don't move
                if (Math.round(playerPos.y) >= this.width - 1 ) {
                    return;
                }
                // Update player position and camera if tile is walkable
                if (this.walkable.has(this.tiles[Math.round(playerPos.y + 0.3 + speed)][Math.round(playerPos.x)])) {
                    this.remove(this.player.sprite);
                    this.player.setPosition(playerPos.x, playerPos.y + speed, playerPos.z, "up");
                    this.add(this.player.sprite);
                    // if (this.camera.position.y <= this.width - 10) {
                    //     this.camera.position.y += speed;
                    // }
                    if (this.camera.position.y <= this.width) {
                        this.camera.position.y += speed;
                    }
                }
            }
            if (event.code === 'ArrowDown') {
                const playerPos = this.player.sprite.position;
                // If past map, don't move
                if (Math.round(playerPos.y) <= 1) {
                    return;
                }
                // Update player position and camera if tile is walkable
                if (this.walkable.has(this.tiles[Math.round(playerPos.y - speed)][Math.round(playerPos.x)])) {
                    this.remove(this.player.sprite);
                    this.player.setPosition(playerPos.x, playerPos.y - speed, playerPos.z, "down");
                    this.add(this.player.sprite);
                    // if (this.camera.position.y >= 9 + speed) {
                    //     this.camera.position.y -= speed;
                    // }
                    if (this.camera.position.y >= 0) {
                        this.camera.position.y -= speed;
                    }
                }
            }
            if (event.code === 'ArrowLeft') {
                const playerPos = this.player.sprite.position;
                if (Math.round(playerPos.x) <= 1) {
                    return;
                }
                // Update player position and camera if tile is walkable
                if (this.walkable.has(this.tiles[Math.round(playerPos.y)][Math.round(playerPos.x - speed - 0.3)])) {
                    this.remove(this.player.sprite);
                    this.player.setPosition(playerPos.x - speed, playerPos.y, playerPos.z, "left");
                    this.add(this.player.sprite);
                    // if (this.camera.position.x >= 17) {
                    //     this.camera.position.x -= speed;
                    // }
                    if (this.camera.position.x >= 0) {
                        this.camera.position.x -= speed;
                    }
                }
            }
            if (event.code === 'ArrowRight') {
                const playerPos = this.player.sprite.position;
                if (Math.round(playerPos.x) >= this.height - 1) {
                    return;
                }
                // Update player position and camera if tile is walkable
                if (this.walkable.has(this.tiles[Math.round(playerPos.y)][Math.round(playerPos.x + 0.3 + speed)])) {
                    this.remove(this.player.sprite);
                    this.player.setPosition(playerPos.x + speed, playerPos.y, playerPos.z, "right");
                    this.add(this.player.sprite);
                    // if (this.camera.position.x <= this.height - 17) {
                    //     this.camera.position.x += speed;
                    // }
                    if (this.camera.position.x <= this.height) {
                        this.camera.position.x += speed;
                    }
                }
            }
            // Zoom out
            if (event.code === 'KeyZ' || event.key === 'z') {
                this.camera.zoom = 0.05;
                this.windowResizeHandler();
            }
            // Zoom in
            if (event.code === 'KeyX' || event.key === 'x') {
                this.camera.zoom = 0.1;
                this.windowResizeHandler();
            }
            // Dialogue event
            if (event.code === 'Space' || event.key === ' ') {
                if (this.inActionSpace(14) && !this.dialogueHappened) {
                    this.startDialogue();
                }
            }
            // Camera movement
            if (event.code === 'KeyW' || event.key === 'w') {
                if (this.camera.position.y <= this.width) {
                    this.camera.position.y += speed;
                }
            }
            if (event.code === 'KeyS' || event.key === 's') {
                if (this.camera.position.y >= 0) {
                    this.camera.position.y -= speed;
                }
            }
            if (event.code === 'KeyA' || event.key === 'a') {
                if (this.camera.position.x >= 0) {
                    this.camera.position.x -= speed;
                }
            }
            if (event.code === 'KeyD' || event.key === 'd') {
                if (this.camera.position.x <= this.height) {
                    this.camera.position.x += speed;
                }
            }
        };
    }
    // Creates texture and material from spritesheet
    createTile(index, source, offsetX, offsetY) {
        // Sample smaller square to get rid of black borders
        const eps = 0.01;

        // Load in image
        const texture = new TextureLoader().load(source);
        texture.minFilter = LinearFilter;
        // Find tile
        texture.offset.x = (1 * offsetX + 0.04) / this.countX;
        texture.offset.y = (-1 *  offsetY + 0.03) / this.countY;
        texture.repeat.x = (1 - eps * 7) / this.countX;
        texture.repeat.y = (1 - eps * 5) / this.countY;
        // texture.wrapS = texture.wrapT = RepeatWrapping;

        const material = new SpriteMaterial({map: texture});

        // Add tile to tileset
        this.tileset.set(index, material);
    }
    // Creates scene based on tiles and tile mapping
    createScene() {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                // Set tile and set grass background
                const index = this.tiles[j][i];
                if (index === -1) {
                    var background = new Sprite(this.tileset.get(-1));
                }
                else {
                    var background = new Sprite(this.tileset.get(0));
                }
                const sprite = new Sprite(this.tileset.get(index));
                // Set positions based on tile mapping
                const xPosition = i;
                const yPosition = j;
                background.position.set(xPosition, yPosition, 0);
                this.add(background);
                sprite.position.set(xPosition, yPosition, 0);
                this.add(sprite);
            }
        }
    }

    // Check if right under action space
    inActionSpace(tile) {
        const playerPos = this.player.sprite.position;
        if (this.tiles[Math.round(playerPos.y + 1)][Math.round(playerPos.x)] === tile) {
            return true;
        }
        return false;
    }

    startDialogue() {
        // Dialogue event handlers 
        const playerPos = this.player.sprite.position;
        this.camera.position.x = playerPos.x;
        this.camera.position.y = playerPos.y + 3;
        // Add cube to back
        const boxGeometry = new BoxGeometry(20, 6, 0.001);
        // const boxMaterial = new MeshBasicMaterial({color: 0x9b673c});
        const boxMaterial = new MeshBasicMaterial({color: 0xffffff});
        var cube = new Mesh(boxGeometry, boxMaterial);
        cube.position.set(playerPos.x, playerPos.y + 7, 0.001);
        this.add(cube);
        var count = 0;
        this.textMesh;
        const fontLoader = new FontLoader();
        fontLoader.load(
            PixelFont,
            function(font) {
                const geometry = new TextGeometry(
                "Christopher Nolan:\n\nI heard you fetched me the supplies I asked for.",
                    {
                        font: font,
                        size: 0.5,
                        height: 0
                    }
                );
                Scenes.scenes['indoors'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                Scenes.scenes['indoors'].textMesh.position.set(playerPos.x - 8.5, playerPos.y + 8.5, 0.1);
                // Cannot use this.add since inside new function
                Scenes.scenes['indoors'].add(Scenes.scenes['indoors'].textMesh);
            }
        );  
        this.dialogueContinue = (event) => {
            if (event.key !== ' ') return;
            if (count >= 14) {
                this.remove(Scenes.scenes['indoors'].textMesh);  
                this.remove(cube);
                window.addEventListener('keydown', this.move, false);
                window.removeEventListener('keydown', this.dialogueContinue, false); 
                Scenes.switchScene('end');
            }
            else if (count === 0){
                Scenes.scenes['indoors'].remove(Scenes.scenes['indoors'].textMesh);  
                fontLoader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry(
                        "You:\n\nI sure did! Here ya go!",
                            {
                                font: font,
                                size: 0.5,
                                height: 0
                            }
                        );
                        Scenes.scenes['indoors'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                        Scenes.scenes['indoors'].textMesh.position.set(playerPos.x - 8.5, playerPos.y + 8.5, 0.1);
                        // Cannot use this.add since inside new function
                        Scenes.scenes['indoors'].add(Scenes.scenes['indoors'].textMesh);
                    }
                );  
            }
            else if (count === 1){
                Scenes.scenes['indoors'].remove(Scenes.scenes['indoors'].textMesh);  
                fontLoader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry(
                        "Christopher Nolan:\n\nWOW! This is the perfect brick, the exact kind used\nback in World War whatever this movie is in.",
                            {
                                font: font,
                                size: 0.5,
                                height: 0
                            }
                        );
                        Scenes.scenes['indoors'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                        Scenes.scenes['indoors'].textMesh.position.set(playerPos.x - 8.5, playerPos.y + 8.5, 0.1);
                        // Cannot use this.add since inside new function
                        Scenes.scenes['indoors'].add(Scenes.scenes['indoors'].textMesh);
                    }
                );  
            }
            else if (count === 2){
                Scenes.scenes['indoors'].remove(Scenes.scenes['indoors'].textMesh);  
                fontLoader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry(
                        "Christopher Nolan:\n\nAnd this! This is the exact amount of alcohol\nI wanted in my water! None!",
                            {
                                font: font,
                                size: 0.5,
                                height: 0
                            }
                        );
                        Scenes.scenes['indoors'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                        Scenes.scenes['indoors'].textMesh.position.set(playerPos.x - 8.5, playerPos.y + 8.5, 0.1);
                        // Cannot use this.add since inside new function
                        Scenes.scenes['indoors'].add(Scenes.scenes['indoors'].textMesh);
                    }
                );  
            }
            else if (count === 3){
                Scenes.scenes['indoors'].remove(Scenes.scenes['indoors'].textMesh);  
                fontLoader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry(
                        "Christopher Nolan:\n\nAnd the coin! You can practically smell the\n1975 on the coin!",
                            {
                                font: font,
                                size: 0.5,
                                height: 0
                            }
                        );
                        Scenes.scenes['indoors'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                        Scenes.scenes['indoors'].textMesh.position.set(playerPos.x - 8.5, playerPos.y + 8.5, 0.1);
                        // Cannot use this.add since inside new function
                        Scenes.scenes['indoors'].add(Scenes.scenes['indoors'].textMesh);
                    }
                );  
            }
            else if (count === 4){
                Scenes.scenes['indoors'].remove(Scenes.scenes['indoors'].textMesh);  
                fontLoader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry(
                        "Christopher Nolan:\n\nYou must've gone through a lot to get these.\nEspecially since this weekend happened to be\nNational Piranha Water Rock Falling Dance\nCompetition Day.",
                            {
                                font: font,
                                size: 0.5,
                                height: 0
                            }
                        );
                        Scenes.scenes['indoors'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                        Scenes.scenes['indoors'].textMesh.position.set(playerPos.x - 8.5, playerPos.y + 8.5, 0.1);
                        // Cannot use this.add since inside new function
                        Scenes.scenes['indoors'].add(Scenes.scenes['indoors'].textMesh);
                    }
                );  
            }
            else if (count === 5){
                Scenes.scenes['indoors'].remove(Scenes.scenes['indoors'].textMesh);  
                fontLoader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry(
                        "Christopher Nolan:\n\nHow can I ever repay you?",
                            {
                                font: font,
                                size: 0.5,
                                height: 0
                            }
                        );
                        Scenes.scenes['indoors'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                        Scenes.scenes['indoors'].textMesh.position.set(playerPos.x - 8.5, playerPos.y + 8.5, 0.1);
                        // Cannot use this.add since inside new function
                        Scenes.scenes['indoors'].add(Scenes.scenes['indoors'].textMesh);
                    }
                );  
            }
            else if (count === 6){
                Scenes.scenes['indoors'].remove(Scenes.scenes['indoors'].textMesh);  
                fontLoader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry(
                        "You:\n\nHave you seen my signed Felix Heide poster?",
                            {
                                font: font,
                                size: 0.5,
                                height: 0
                            }
                        );
                        Scenes.scenes['indoors'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                        Scenes.scenes['indoors'].textMesh.position.set(playerPos.x - 8.5, playerPos.y + 8.5, 0.1);
                        // Cannot use this.add since inside new function
                        Scenes.scenes['indoors'].add(Scenes.scenes['indoors'].textMesh);
                    }
                );  
            }
            else if (count === 7){
                Scenes.scenes['indoors'].remove(Scenes.scenes['indoors'].textMesh);  
                fontLoader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry(
                        "Christopher Nolan:\n\nI have not, but I can do you one better. I can\nsign my own poster for you and I want you\nto play a role in this movie.",
                            {
                                font: font,
                                size: 0.5,
                                height: 0
                            }
                        );
                        Scenes.scenes['indoors'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                        Scenes.scenes['indoors'].textMesh.position.set(playerPos.x - 8.5, playerPos.y + 8.5, 0.1);
                        // Cannot use this.add since inside new function
                        Scenes.scenes['indoors'].add(Scenes.scenes['indoors'].textMesh);
                    }
                );  
            }
            else if (count === 8){
                Scenes.scenes['indoors'].remove(Scenes.scenes['indoors'].textMesh);  
                fontLoader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry(
                        "You:\n\nEh, no thanks.",
                            {
                                font: font,
                                size: 0.5,
                                height: 0
                            }
                        );
                        Scenes.scenes['indoors'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                        Scenes.scenes['indoors'].textMesh.position.set(playerPos.x - 8.5, playerPos.y + 8.5, 0.1);
                        // Cannot use this.add since inside new function
                        Scenes.scenes['indoors'].add(Scenes.scenes['indoors'].textMesh);
                    }
                );  
            }
            else if (count === 9){
                Scenes.scenes['indoors'].remove(Scenes.scenes['indoors'].textMesh);  
                fontLoader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry(
                        "Christopher Nolan:\n\nWhat do you mean no thanks?",
                            {
                                font: font,
                                size: 0.5,
                                height: 0
                            }
                        );
                        Scenes.scenes['indoors'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                        Scenes.scenes['indoors'].textMesh.position.set(playerPos.x - 8.5, playerPos.y + 8.5, 0.1);
                        // Cannot use this.add since inside new function
                        Scenes.scenes['indoors'].add(Scenes.scenes['indoors'].textMesh);
                    }
                );  
            }
            else if (count === 10){
                Scenes.scenes['indoors'].remove(Scenes.scenes['indoors'].textMesh);  
                fontLoader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry(
                        "You:\n\nYeah, I don't really feel like it.",
                            {
                                font: font,
                                size: 0.5,
                                height: 0
                            }
                        );
                        Scenes.scenes['indoors'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                        Scenes.scenes['indoors'].textMesh.position.set(playerPos.x - 8.5, playerPos.y + 8.5, 0.1);
                        // Cannot use this.add since inside new function
                        Scenes.scenes['indoors'].add(Scenes.scenes['indoors'].textMesh);
                    }
                );  
            }
            else if (count === 11){
                Scenes.scenes['indoors'].remove(Scenes.scenes['indoors'].textMesh);  
                fontLoader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry(
                        "Christopher Nolan:\n\n...",
                            {
                                font: font,
                                size: 0.5,
                                height: 0
                            }
                        );
                        Scenes.scenes['indoors'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                        Scenes.scenes['indoors'].textMesh.position.set(playerPos.x - 8.5, playerPos.y + 8.5, 0.1);
                        // Cannot use this.add since inside new function
                        Scenes.scenes['indoors'].add(Scenes.scenes['indoors'].textMesh);
                    }
                );  
            }
            else if (count === 12){
                Scenes.scenes['indoors'].remove(Scenes.scenes['indoors'].textMesh);  
                fontLoader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry(
                        "You:\n\nAnyways, good luck with your Floppenheimer movie\nor whatever.",
                            {
                                font: font,
                                size: 0.5,
                                height: 0
                            }
                        );
                        Scenes.scenes['indoors'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                        Scenes.scenes['indoors'].textMesh.position.set(playerPos.x - 8.5, playerPos.y + 8.5, 0.1);
                        // Cannot use this.add since inside new function
                        Scenes.scenes['indoors'].add(Scenes.scenes['indoors'].textMesh);
                    }
                );  
            }
            else if (count === 13){
                Scenes.scenes['indoors'].remove(Scenes.scenes['indoors'].player.sprite);
                Scenes.scenes['indoors'].remove(Scenes.scenes['indoors'].textMesh);  
                fontLoader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry(
                        "Christopher Nolan:\n\nFloppenheimer?",
                            {
                                font: font,
                                size: 0.5,
                                height: 0
                            }
                        );
                        Scenes.scenes['indoors'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                        Scenes.scenes['indoors'].textMesh.position.set(playerPos.x - 8.5, playerPos.y + 8.5, 0.1);
                        // Cannot use this.add since inside new function
                        Scenes.scenes['indoors'].add(Scenes.scenes['indoors'].textMesh);
                    }
                );  
            }
            count++;
        }
        window.removeEventListener('keydown', this.move, false);
        window.addEventListener('keydown', this.dialogueContinue, false); 
        this.dialogueHappened = true;
    }



    // Adds events specific to Frist scene
    addEvents() {
        this.windowResizeHandler();
        // Resize event
        window.addEventListener('resize', this.windowResizeHandler, false);
        // Movement with arrow key event
        window.addEventListener('keydown', this.move, false);
    }
    // Removes events specific to Frist scene
    removeEvents() {
        window.removeEventListener('resize', this.windowResizeHandler, false);
        window.removeEventListener('keydown', this.move, false);
    }
}

export default Indoors;
