import { FrontSide, LinearFilter, Mesh, MeshBasicMaterial, PerspectiveCamera, PlaneGeometry, RGBFormat, Scene, Sprite, SpriteMaterial, TextureLoader, Vector3, VideoTexture } from "three";
import { Scenes } from ".";
import { Arrows, Disco, FilledArrrows } from "../images";
import DancingSprite from "../player/DancingSprite";

class ProspectGame extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // True if game started
        this.gameStarted = false;
    
        // Set background to background image
        const bgLoader = new TextureLoader();
        const bgTexture = bgLoader.load(Disco);
        this.background = bgTexture;

        // Adding in tiles
        // Hashmap for tiles
        this.tileset = new Map();
        // Number of images per row/column
        this.countX = 1;
        this.countY = 4;
        // Arrows at bottom
        // Left
        this.createTile(0, Arrows, 0, -3);
        // Right
        this.createTile(1, Arrows, 0, -2);
        // Up
        this.createTile(2, Arrows, 0, -1);
        // Down
        this.createTile(3, Arrows, 0, 0);
        // Falling arrows
        // Left
        this.createTile(4, FilledArrrows, 0, -3);
        // Right
        this.createTile(5, FilledArrrows, 0, -2);
        // Up
        this.createTile(6, FilledArrrows, 0, -1);
        // Down
        this.createTile(7, FilledArrrows, 0, 0);
        // Arrow objects at 3, 7, 11, 15
        this.arrows = [];
        this.speeds = [];
        for (let i = 4; i <= 7; i++) {
            this.arrows[i - 4] = new Sprite(this.tileset.get(i));
            this.arrows[i] = new Sprite(this.tileset.get(i));
            // Set positions based on tile mapping
            this.arrows[i - 4].position.set(i * 4 - 13, 10, 0.00001);
            this.arrows[i].position.set(i * 4 - 13, 10, 0.00001);
            this.add(this.arrows[i - 4]);
            this.add(this.arrows[i]);
            this.speeds[i - 4] = 0;
            this.speeds[i] = 0;
        }

        // Actual tiles for level
        this.tiles = [
            [-1, -1, -1, 0, -1, -1, -1, 1, -1, -1, -1, 2, -1, -1, -1, 3, -1, -1, -1, -1]
        ];
        this.width = this.tiles.length;
        this.height = this.tiles[0].length;

        // Time for falling arrows
        this.startTime = 0;

        this.createScene();

        // Dancing sprite
        this.dancer = new DancingSprite(ProspectGame);
        this.add(this.dancer.sprite);
        this.dancer.sprite.scale.set(5, 5, 1);
        this.dancer.sprite.position.set(9.5, 4.5, -0.1);

        // Camera
        this.camera = new PerspectiveCamera();
        // Set up camera
        this.camera.position.set(9.5, 4.5, 1.6);
        this.camera.lookAt(new Vector3(9.5, 4.5, 0));
        this.camera.zoom = 0.15;

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
            if (event.code === 'Space') {
                // Start game on space
                if (!this.gameStarted) {
                    this.startGame();
                }
            }
            if (event.code === 'ArrowLeft') {
                // Check for either arrow of direction
                if (this.arrows[0].position.y <= 1) {
                    this.arrows[0].position.y = 10;
                    this.speeds[0] = 0;
                }
                else if (this.arrows[4].position.y <= 1) {
                    this.arrows[4].position.y = 10;
                    this.speeds[4] = 0;
                }
            }
            if (event.code === 'ArrowRight') {
                // Check for either arrow of direction
                if (this.arrows[1].position.y <= 1) {
                    this.arrows[1].position.y = 10;
                    this.speeds[1] = 0;
                }
                else if (this.arrows[5].position.y <= 1) {
                    this.arrows[5].position.y = 10;
                    this.speeds[5] = 0;
                }
            }
            if (event.code === 'ArrowUp') {
                // Check for either arrow of direction
                if (this.arrows[2].position.y <= 1) {
                    this.arrows[2].position.y = 10;
                    this.speeds[2] = 0;
                }
                else if (this.arrows[6].position.y <= 1) {
                    this.arrows[6].position.y = 10;
                    this.speeds[6] = 0;
                }
            }
            if (event.code === 'ArrowDown') {
                // Check for either arrow of direction
                if (this.arrows[3].position.y <= 1) {
                    this.arrows[3].position.y = 10;
                    this.speeds[3] = 0;
                }
                else if (this.arrows[7].position.y <= 1) {
                    this.arrows[7].position.y = 10;
                    this.speeds[7] = 0;
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
                const background = new Sprite(this.tileset.get(-1));
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

    // Gameplay
    startGame() {
        this.gameStarted = true;
        var currentSpeed = 0.05;
        var time = 0;
        var timeInBetween = 150;
        var timeLoop = setInterval(function() { 
            if (Scenes.scenes['prospectgame'].gameStarted && time < 2500) { 
                // Animation for dancing sprite in background
                if (time % 10 === 0) {
                    Scenes.scenes['prospectgame'].remove(Scenes.scenes['prospectgame'].dancer.sprite);
                    Scenes.scenes['prospectgame'].dancer.animate();
                    Scenes.scenes['prospectgame'].add(Scenes.scenes['prospectgame'].dancer.sprite);
                    Scenes.scenes['prospectgame'].dancer.sprite.scale.set(5, 5, 1);
                    Scenes.scenes['prospectgame'].dancer.sprite.position.set(9.5, 4.5, -0.1);
                }
                // Arrow speeds
                if (time % timeInBetween === 0) {
                    var random = Math.floor(Math.random() * 8);
                    if (Scenes.scenes['prospectgame'].speeds[random] === 0) {
                        Scenes.scenes['prospectgame'].speeds[random] = currentSpeed;
                        if (currentSpeed <= 0.12) {
                            currentSpeed += 0.002;
                        }
                    }
                    if (timeInBetween >= 20) {
                        timeInBetween -= 10;
                    }
                }
                Scenes.scenes['prospectgame'].arrowFall();
                time++;
            }
            else {   
                if (Scenes.scenes['prospectgame'].gameStarted) {
                    Scenes.scenes['prospectgame'].gameStarted = false;
                    Scenes.successes[1] = 1;
                    Scenes.scenes['prospectgame'].resetGame();
                    Scenes.switchScene('successprospect');
                }
                clearInterval(timeLoop);
            }
        }, 20);
    }
    // Decrease arrow positions by corresponding speed
    arrowFall() {
        for (let i = 0; i < 8; i++) {
            if (this.arrows[i].position.y <= -0.8) {
                this.resetGame();
                Scenes.switchScene('gameoverprospect');
            }
            this.arrows[i].position.y -= this.speeds[i];
        } 
    }

    resetGame() {
        for (let i = 0; i < 8; i++) {
            this.arrows[i].position.y = 10;
            this.speeds[i] = 0;
        } 
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

export default ProspectGame;
