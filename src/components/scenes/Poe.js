import { BoxGeometry, FontLoader, LinearFilter, Mesh, MeshBasicMaterial, MeshPhongMaterial, PerspectiveCamera, Scene, Sprite, SpriteMaterial, TextGeometry, TextureLoader, Vector3 } from "three";
import { Scenes } from ".";
import { PixelFont } from "../fonts";
import { Bench, Cone, ConstructionSprite, Crane, Dirt, NewRes, Serene, Stick, Wood, Trees } from "../images";
import Player from "../player/player";
import Maps from "./Maps";
import Rewards from "./Rewards";

class Poe extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Dialogue checker
        this.dialogueHappened = false;

        // Adding in tiles
        this.tileset = new Map(); // hashmap for tiles
        // this.backgrounds = new Object(); // dictionary for backgrounds 
        this.walkable = new Set(); // set for walkable tiles
        this.sceneChangers = new Set(); // set for scene-changing tiles

        // --- Serene/outdoor tiles ---
        this.countX = 8;
        this.countY = 27;
        // Grass
        this.createTile(0, Serene, 1, -25);
        // Path
        this.createTile(1, Serene, 2, -26);
        this.createTile(2, Serene, 3, -26);
        this.createTile(3, Serene, 4, -26);
        this.createTile(4, Serene, 2, -25);
        this.createTile(5, Serene, 3, -25);
        this.createTile(6, Serene, 4, -25);
        this.createTile(7, Serene, 2, -24);
        this.createTile(8, Serene, 3, -24);
        this.createTile(9, Serene, 4, -24);
        // Advanced Path
        this.createTile(19, Serene, 2, -23)
        this.createTile(20, Serene, 2, -22)
        this.createTile(21, Serene, 3, -23)
        this.createTile(22, Serene, 3, -22)
        // Fence
        this.createTile(23, Serene, 2, -19)
        this.createTile(24, Serene, 3, -19)
        this.createTile(25, Serene, 4, -19)
        this.createTile(26, Serene, 2, -18)
        this.createTile(27, Serene, 3, -18)
        this.createTile(28, Serene, 4, -18)
        this.createTile(29, Serene, 2, -17)
        this.createTile(30, Serene, 3, -17)
        this.createTile(31, Serene, 4, -17)

        // Sign for game
        this.createTile(36, Serene, 5, -20);

        // --- Dirt tiles ---
        this.countX = 3;
        this.countY = 3;
        // Better dirt
        this.createTile(10, Dirt, 1, -2);

        // --- Crane tile set ---
        this.countX = 3;
        this.countY = 3;
        // Crane
        this.createTile(37, Crane, 0, 0);
        this.createTile(38, Crane, 1, 0);
        this.createTile(39, Crane, 2, 0);
        this.createTile(40, Crane, 0, -1);
        this.createTile(41, Crane, 1, -1);
        this.createTile(42, Crane, 2, -1);
        this.createTile(43, Crane, 0, -2);
        this.createTile(44, Crane, 1, -2);
        this.createTile(45, Crane, 2, -2);

        // --- Misc ---
        this.countX = 7;
        this.countY = 2;
        // Bench
        this.createTile(32, Bench, 1, -1);
        // Wood
        this.countX = 1;
        this.countY = 1;
        this.createTile(46, Wood, 0, 0);
        // Stick
        this.createTile(47, Stick, 0, 0);
        // Cone
        this.createTile(80, Cone, 0, 0);

        // --- New College tile set ---
        this.countX = 8;
        this.countY = 4;
        var currentIndex = 48; 
        // 48-79
        for (let i = 0; i >= -3; i--) {
            for (let j = 0; j <= 7; j++) {
                this.createTile(currentIndex, NewRes, j, i);
                currentIndex++;
            }
        }

        // --- Trees tiles ---
        // Convention: bottom to top, left to right
        this.countX = 8;
        this.countY = 16;
        // Blocks of trees (5x3)
        var currentIndex = 200;
        // Dark blue [200-214]
        for (let i = -10; i >= -12; i--) { // bottom (trunk) -> middle (leaves) -> top
            for (let j = 1; j <= 5; j++) {
                this.createTile(currentIndex, Trees, j, i);
                currentIndex++;
            }
        }

        // --- Talking sprite ---
        this.countX = 3;
        this.countY = 4;
        this.createTile(104, ConstructionSprite, 1, -3);

        // ----- Identifying walkable tiles -----
        for (let i = 0; i <= 22; i++) {
            this.walkable.add(i);
        }
        // ----- Identifying scene-changing tiles -----
        this.sceneChangers.add(4);
        this.sceneChangers.add(5);
        this.sceneChangers.add(6);

        // Actual tiles for level
        this.tiles = [
            [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  6, 26, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
            [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  6, 26, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 80, 10, 80, 10, 10],
            [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  6, 26, 10, 10, 80, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 46, 10, 10, 10],
            [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  6, 26, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 80, 10, 80, 10, 10],
            [ 0,  0, 32,  0,  0,  0,  0,  0,  0,  0,  0, 32,  0,  0,  0,  0,  0,  7,  8,  8,  8,  8,  8, 20,  5,  6, 26, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
            [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  5,  5,  5,  5,  5,  5,  6, 26, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
            [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5, 21,  2,  2,  2,  2,  2,  3, 26, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
            [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  6, 29, 24, 24, 24, 24, 24, 23, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
            [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  6, 26, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 46,104, 46, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
            [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  6, 26, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 80, 10, 10, 37, 38, 39, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
            [ 0,  0,  0,  0,  0,  0, 32,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  6, 26, 10, 10, 80, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 40, 41, 42, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
            [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  7,  8,  8,  8, 20,  5,  6, 26, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 43, 44, 45, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
            [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  5,  5,  5,  5,  6, 26, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
            [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5, 21,  2,  2,  2,  3, 26, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
            [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  6, 29, 24, 24, 24, 23, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
            [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  6, 26, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 46, 46, 46, 10, 10, 10, 10, 10, 10, 10, 10, 10, 80, 10, 10, 10, 10, 10, 10, 10, 10],
            [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  6, 26, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 37, 38, 39, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
            [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  6,  0, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 40, 41, 42, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
            [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  6, 26, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 43, 44, 45, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
            [ 0,  0,  0, 32,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  6, 26, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
            [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  6, 26, 10, 10, 10, 10, 80, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 80, 10, 80, 10, 80, 10, 80, 10, 80],
            [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  6, 26, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 80, 10, 46, 10, 47, 10, 47, 10, 46, 10],
            [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  6, 26, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 80, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 48, 49, 50, 51, 52, 53, 54, 55],
            [200,201,202,203,204,200,201,202,203,204,  0,  0,  0,  4,  5,  6, 26, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 80, 10, 56, 57, 58, 59, 60, 61, 62, 63],
            [205,206,207,208,209,205,206,207,208,209,  0, 32,  0,  4,  5,  6, 26, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 36, 10, 10, 10, 10, 10, 10, 10, 10, 10, 64, 65, 66, 67, 68, 69, 70, 71],
            [210,211,212,213,214,210,211,212,213,214,  0,  0,  0,  4,  5,  6, 26, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 80, 10, 72, 73, 74, 75, 76, 77, 78, 79],
        ];
        this.width = this.tiles.length;
        this.height = this.tiles[0].length;

        this.createScene();


        // Create player for scene
        this.player = new Player(Poe);
        this.add(this.player.sprite);
        this.player.setPosition(this.height / 2, 1, 0);
        // Camera
        this.camera = new PerspectiveCamera();
        // Set up camera
        // this.camera.position.set(this.height / 2, 9, 1.6);
        // this.camera.lookAt(new Vector3(this.height / 2, 9, 0));
        this.camera.position.set(this.height / 2, 1, 1.6);
        this.camera.lookAt(new Vector3(this.height / 2, 1, 0));
        this.camera.zoom = 0.08;

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
                if (Math.round(playerPos.y) >= this.width - 1) {
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
                    if (this.sceneChangers.has(this.tiles[Math.round(playerPos.y - speed - 0.3)][Math.round(playerPos.x)])) {
                        Scenes.switchScene('frist');
                    }
                    return;
                }
                // Update player position and camera if tile is walkable
                if (this.walkable.has(this.tiles[Math.round(playerPos.y - 0.3 - speed)][Math.round(playerPos.x)])) {
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
                // If past map don't move or switch scene
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
                if (Math.round(playerPos.x) >= this.height - 3) {
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
            // Map event
            if (event.code === 'KeyM' || event.key === 'm') {
                const map = new Maps('poe');
                Scenes.scenes['map'] = map;
                Scenes.switchScene('map');
            }
            // Zoom out
            if (event.code === 'KeyZ' || event.key === 'z') {
                this.camera.zoom = 0.03;
                this.windowResizeHandler();
            }
            // Zoom in
            if (event.code === 'KeyX' || event.key === 'x') {
                this.camera.zoom = 0.08;
                this.windowResizeHandler();
            }
            // Rewards event
            if (event.code === 'KeyR' || event.key === 'r') {
                const rewards = new Rewards('poe');
                Scenes.scenes['rewards'] = rewards;
                Scenes.switchScene('rewards');
            }
            // Action button to get to minigame
            if (event.code === 'Space') {
                // Dialogue event
                if ((this.inActionSpace(104) || this.inActionSpace(106)) && !this.dialogueHappened) {
                    this.startDialogue();
                }
                if (this.inActionSpace(36) && this.dialogueHappened) {
                    Scenes.switchScene('poegameinstructions');
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
        texture.offset.x = (1 * offsetX + 0.03) / this.countX;
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
                // Set tile and apply backgrounds
                const index = this.tiles[j][i];
                var background;
                if (index <= 35 || index >= 200) {
                    background = new Sprite(this.tileset.get(0)); // grass
                }
                else {
                    background = new Sprite(this.tileset.get(10)); // dirt
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
        // Add cube to back
        const boxGeometry = new BoxGeometry(20, 8, 0.001);
        // const boxMaterial = new MeshBasicMaterial({color: 0x9b673c});
        const boxMaterial = new MeshBasicMaterial({color: 0xffffff});
        this.camera.position.x = playerPos.x - 3.5;
        this.camera.position.y = playerPos.y + 3;

        var cube = new Mesh(boxGeometry, boxMaterial);
        cube.position.set(playerPos.x - 1.5, playerPos.y + 7, 0.001);
        this.add(cube);
        var count = 0;
        this.textMesh;
        const fontLoader = new FontLoader();
        fontLoader.load(
            PixelFont,
            function(font) {
                const geometry = new TextGeometry(
                "You:\n\nHey, do you know where I could find some brick?",
                    {
                        font: font,
                        size: 0.5,
                        height: 0
                    }
                );
                Scenes.scenes['poe'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0x000000}));
                Scenes.scenes['poe'].textMesh.position.set(playerPos.x - 10, playerPos.y + 9, 0.1);
                // Cannot use this.add since inside new function
                Scenes.scenes['poe'].add(Scenes.scenes['poe'].textMesh);
            }
        );  
        this.dialogueContinue = (event) => {
            if (event.key !== ' ') return;
            if (count >= 5) {
                this.remove(Scenes.scenes['poe'].textMesh);  
                this.remove(cube);
                window.addEventListener('keydown', this.move, false);
                window.removeEventListener('keydown', this.dialogueContinue, false); 
            }
            else if (count === 0){
                Scenes.scenes['poe'].remove(Scenes.scenes['poe'].textMesh);  
                fontLoader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry(
                        "Construction Worker:\n\nOh, you're in luck! We just got a huge shipment of\nbrick.",
                            {
                                font: font,
                                size: 0.5,
                                height: 0
                            }
                        );
                        Scenes.scenes['poe'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0x00000}));
                        Scenes.scenes['poe'].textMesh.position.set(playerPos.x - 10, playerPos.y + 9, 0.1);
                        // Cannot use this.add since inside new function
                        Scenes.scenes['poe'].add(Scenes.scenes['poe'].textMesh);
                    }
                );  
            }
            else if (count === 1){
                Scenes.scenes['poe'].remove(Scenes.scenes['poe'].textMesh);  
                fontLoader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry(
                        "You:\n\nWow, that sure is convenient and perhaps lazy\nwriting! Where can I get some?",
                            {
                                font: font,
                                size: 0.5,
                                height: 0
                            }
                        );
                        Scenes.scenes['poe'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0x00000}));
                        Scenes.scenes['poe'].textMesh.position.set(playerPos.x - 10, playerPos.y + 9, 0.1);
                        // Cannot use this.add since inside new function
                        Scenes.scenes['poe'].add(Scenes.scenes['poe'].textMesh);
                    }
                );  
            }
            else if (count === 2){
                Scenes.scenes['poe'].remove(Scenes.scenes['poe'].textMesh);  
                fontLoader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry(
                        "Construction Worker:\n\nLook up there, by the sign. We kept all our brick\nnear the extremely dangerous area where\nrocks are constantly falling in predictable\npatterns.",
                            {
                                font: font,
                                size: 0.5,
                                height: 0
                            }
                        );
                        Scenes.scenes['poe'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0x00000}));
                        Scenes.scenes['poe'].textMesh.position.set(playerPos.x - 10, playerPos.y + 9, 0.1);
                        // Cannot use this.add since inside new function
                        Scenes.scenes['poe'].add(Scenes.scenes['poe'].textMesh);
                    }
                );  
            }
            else if (count === 3){
                Scenes.scenes['poe'].remove(Scenes.scenes['poe'].textMesh);  
                fontLoader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry(
                        "You:\n\nGreat, thanks...\n\nWait, what? The extremely dangerous place where\nwhat?",
                            {
                                font: font,
                                size: 0.5,
                                height: 0
                            }
                        );
                        Scenes.scenes['poe'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0x00000}));
                        Scenes.scenes['poe'].textMesh.position.set(playerPos.x - 10, playerPos.y + 9, 0.1);
                        // Cannot use this.add since inside new function
                        Scenes.scenes['poe'].add(Scenes.scenes['poe'].textMesh);
                    }
                );  
            }
            else if (count === 4){
                Scenes.scenes['poe'].remove(Scenes.scenes['poe'].textMesh);  
                fontLoader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry(
                        "Construction Worker:\n\nAnyways, good luck!",
                            {
                                font: font,
                                size: 0.5,
                                height: 0
                            }
                        );
                        Scenes.scenes['poe'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0x00000}));
                        Scenes.scenes['poe'].textMesh.position.set(playerPos.x - 10, playerPos.y + 9, 0.1);
                        // Cannot use this.add since inside new function
                        Scenes.scenes['poe'].add(Scenes.scenes['poe'].textMesh);
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

export default Poe;
