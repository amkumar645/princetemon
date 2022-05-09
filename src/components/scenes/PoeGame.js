import { LinearFilter, PerspectiveCamera, Scene, Sprite, SpriteMaterial, TextureLoader, Vector3 } from "three";
import { Scenes } from ".";
import { PoeGameTiles, Rocks, TitleBackground } from "../images";
import Player from "../player/player";

class PoeGame extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // True if game started
        this.gameStarted = false;
    
        // Set background to background image
        const bgLoader = new TextureLoader();
        const bgTexture = bgLoader.load(TitleBackground);
        this.background = bgTexture;

        // Adding in tiles
        // Hashmap for tiles
        this.tileset = new Map();
        // Tileset details
        this.imageX = 256;
        this.imageY = 96;
        // Number of images per row/column
        this.countX = 16;
        this.countY = 6;
        // Bottom Tiles
        this.createTile(0, PoeGameTiles, 0, -2);
        this.createTile(1, PoeGameTiles, 1, -2);
        this.createTile(2, PoeGameTiles, 2, -2);
        // Tileset details
        this.imageX = 192;
        this.imageY = 192;
        // Number of images per row/column
        this.countX = 12;
        this.countY = 12;
        // Rock
        this.createTile(3, Rocks, 0, -11);

        // Actual tiles for level
        this.tiles = [
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2]
        ];
        this.width = this.tiles.length;
        this.height = this.tiles[0].length;

        this.createScene();


        // Create player for scene
        this.player = new Player(PoeGame);
        this.add(this.player.sprite);
        this.player.setPosition(9.5, 1, 0);

        // Camera
        this.camera = new PerspectiveCamera();
        // Set up camera
        this.camera.position.set(9.5, 4.5, 1.6);
        this.camera.lookAt(new Vector3(9.5, 4.5, 0));
        this.camera.zoom = 0.15;

        // Rocks
        this.rocks = [];
        for (let i = 0; i < 17; i++) {
            this.rocks[i] = new Sprite(this.tileset.get(3));
            // Set positions based on tile mapping
            this.rocks[i].position.set(i * 1 + 1.5, 10, 0);
            this.add(this.rocks[i]);
        }

        // Window resize handler for scene
        this.windowResizeHandler = () => {
            const { innerHeight, innerWidth } = window;
            Scenes.renderer.setSize(innerWidth, innerHeight);
            this.camera.aspect = innerWidth / innerHeight;
            this.camera.updateProjectionMatrix();
        };
        // Arrow key handler
        this.move = (event) => {
            const speed = 0.3;
            if (event.code === 'ArrowLeft') {
                // Start game on move
                if (!this.gameStarted) {
                    this.startGame();
                }
                const playerPos = this.player.sprite.position;
                // Update player position and camera if tile is walkable
                if (playerPos.x <= 1.5) {
                    this.remove(this.player.sprite);
                    this.player.setPosition(17.5, playerPos.y, playerPos.z, "left");
                    this.add(this.player.sprite);
                    return;
                }
                this.remove(this.player.sprite);
                this.player.setPosition(playerPos.x - speed, playerPos.y, playerPos.z, "left");
                this.add(this.player.sprite);
            }
            if (event.code === 'ArrowRight') {
                // Start game on move
                if (!this.gameStarted) {
                    this.startGame();
                }
                const playerPos = this.player.sprite.position;
                // Update player position and camera if tile is walkable
                if (playerPos.x >= 17.5) {
                    this.remove(this.player.sprite);
                    this.player.setPosition(1.5, playerPos.y, playerPos.z, "right");
                    this.add(this.player.sprite);
                    return;
                }
                this.remove(this.player.sprite);
                this.player.setPosition(playerPos.x + speed, playerPos.y, playerPos.z, "right");
                this.add(this.player.sprite);
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
        texture.offset.x = (1 * offsetX) / this.countX;
        texture.offset.y = (-1 *  offsetY) / this.countY;
        texture.repeat.x = (1 - eps * 3) / this.countX;
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
                const sprite = new Sprite(this.tileset.get(index));
                // Set positions based on tile mapping
                const xPosition = i;
                const yPosition = j;
                sprite.position.set(xPosition, yPosition, 0);
                this.add(sprite);
            }
        }
    }

    // Gameplay
    startGame() {
        this.gameStarted = true;
        // Number of falling rocks
        var level = 1;
        // Number of times to replay final level
        var finalCount = 0;
        var levelInterval = setInterval(function() { 
            if (level <= 16 && Scenes.scenes['poegame'].gameStarted) { 
                var randoms = [];
                while(randoms.length < level){
                    var r = Math.floor(Math.random() * 17);
                    if(randoms.indexOf(r) === -1) randoms.push(r);
                }
                for (let i = 0; i < randoms.length; i++) {
                    Scenes.scenes['poegame'].rockFall(Scenes.scenes['poegame'].rocks, randoms[i], levelInterval);
                }
                if (level !== 15) level += 2;
                else if (finalCount < 5) finalCount++;
                else level += 2;
            }
            else {   
                if (Scenes.scenes['poegame'].gameStarted) {
                    Scenes.scenes['poegame'].gameStarted = false;
                    Scenes.successes[0] = 1;
                    Scenes.switchScene('success');
                }
                clearInterval(levelInterval);
            }
        }, 4200);
    }

    rockFall(rocks, i) {
        const speed = 0.5;
        var time = 1;
        var interval = setInterval(function() { 
            if (time <= 24) { 
                rocks[i].position.y -= speed;
                time++;
                // If you get hit, exit game
                if (rocks[i].position.y <= 1.45 && rocks[i].position.y >= 0.55) {
                    if (Scenes.scenes['poegame'].player.sprite.position.x > rocks[i].position.x - 0.5 &&
                        Scenes.scenes['poegame'].player.sprite.position.x < rocks[i].position.x + 0.5) {
                        Scenes.scenes['poegame'].gameStarted = false;
                        Scenes.switchScene('gameover');
                    }
                }
            }
            else {
                rocks[i].position.y = 10; 
                clearInterval(interval);
            }
        }, 100);
    }

    resetGame() {
        this.gameStarted = false;
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

export default PoeGame;
