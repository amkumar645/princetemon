import { LinearFilter, PerspectiveCamera, Scene, Sprite, SpriteMaterial, TextureLoader, Vector3 } from "three";
import { Scenes } from ".";
import { Coin, Pirahna, WaterBackground } from "../images";
import Player from "../player/player";

class GardenGame extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // True if game started
        this.gameStarted = false;
    
        // Set background to background image
        const bgLoader = new TextureLoader();
        const bgTexture = bgLoader.load(WaterBackground);
        this.background = bgTexture;

        // Adding in tiles
        // Hashmap for tiles
        this.tileset = new Map();
        // Number of images per row/column
        this.countX = 1;
        this.countY = 1;
        // Pirahna at bottom
        this.createTile(0, Pirahna, 0, 0);
        this.piranhas = [];
        this.speeds = [];
        for (let i = -4; i <= 4; i++) {
            this.piranhas[i + 4] = new Sprite(this.tileset.get(0));
            // Set positions based on tile mapping
            this.piranhas[i + 4].position.set(10, i, 0);
            this.speeds[i + 4] = 0;
            this.add(this.piranhas[i + 4]);
        }

        // Coin
        this.createTile(1, Coin, 0, 0);
        this.coin = new Sprite(this.tileset.get(1));
        this.coin.position.set(10, Math.floor(Math.random() * 9) - 4, 0);
        this.coinSpeed = 0;
        this.add(this.coin);

        // Create player for scene
        this.player = new Player(GardenGame);
        this.player.setPosition(-8, 0, 0, "right");
        this.add(this.player.sprite);

        // Camera
        this.camera = new PerspectiveCamera();
        // Set up camera
        this.camera.position.set(0, 0, 1.6);
        this.camera.lookAt(new Vector3(0, 0, 0));
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
            const speed = 1;
            if (event.code === 'Space') {
                // Start game on space
                if (!this.gameStarted) {
                    this.startGame();
                }
            }
            if (event.code === 'ArrowUp') {
                const playerPos = this.player.sprite.position;
                if (playerPos.y >= 4) {
                    return;
                }
                this.remove(this.player.sprite);
                this.player.setPosition(playerPos.x, playerPos.y + speed, playerPos.z);
                this.add(this.player.sprite);
            }
            if (event.code === 'ArrowDown') {
                const playerPos = this.player.sprite.position;
                if (playerPos.y <= -4) {
                    return;
                }
                this.remove(this.player.sprite);
                this.player.setPosition(playerPos.x, playerPos.y - speed, playerPos.z);
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

    // Gameplay
    startGame() {
        this.gameStarted = true;
        var currentSpeed = 0.06;
        var time = 0;
        var timeInBetween = 150;
        var timeLoop = setInterval(function() { 
            if (Scenes.scenes['gardengame'].gameStarted && time < 10000) { 
                if (time % timeInBetween == 0) {
                    var random = Math.floor(Math.random() * 9);
                    if (Scenes.scenes['gardengame'].speeds[random] === 0) {
                        Scenes.scenes['gardengame'].speeds[random] = currentSpeed;
                        if (currentSpeed <= 0.25) {
                            currentSpeed += 0.005;
                        }
                    }
                    if (timeInBetween >= 20) {
                        timeInBetween -= 10;
                    }
                }
                if (time % 1000 == 0 && time >= 4000) {
                    Scenes.scenes['gardengame'].coinSpeed = 0.1;
                }
                Scenes.scenes['gardengame'].piranhaMove();
                time++;
            }
            else {   
                if (Scenes.scenes['gardengame'].gameStarted) {
                    this.resetGame();
                    Scenes.switchScene('gameovergarden');
                }
                clearInterval(timeLoop);
            }
        }, 20);
    }
    resetGame() {
        this.gameStarted = false;
        this.coin.position.x = 10;
        this.coinSpeed = 0;
        for (let i = 0; i <= 8; i++) {
            this.piranhas[i].position.x = 10;
            this.speeds[i] = 0;
        }
    }

    piranhaMove() {
        this.coin.position.x -= this.coinSpeed;
        if (this.coin.position.x <= -8.8) {
            this.coin.position.x = 10;
            this.coinSpeed = 0;
        }
        else if (this.coin.position.x <= -7.5) {
            const playerPos = this.player.sprite.position;
            if (playerPos.y >= this.coin.position.y - 0.5 && 
                playerPos.y <= this.coin.position.y + 0.5) {
                    this.resetGame();
                    Scenes.successes[2] = 1;
                    Scenes.switchScene('successgarden');
            }
        }
        for (let i = 0; i <= 8; i++) {
            this.piranhas[i].position.x -= this.speeds[i];
            if (this.piranhas[i].position.x <= -8.8) {
                this.piranhas[i].position.x = 10;
                this.speeds[i] = 0;
            }
            else if (this.piranhas[i].position.x <= -7.5) {
                const playerPos = this.player.sprite.position;
                if (playerPos.y >= this.piranhas[i].position.y - 0.5 && 
                    playerPos.y <= this.piranhas[i].position.y + 0.5) {
                        this.resetGame();
                        Scenes.switchScene('gameovergarden');
                }
            }
        } 
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

export default GardenGame;
