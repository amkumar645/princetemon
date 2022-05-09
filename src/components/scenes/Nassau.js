import { BoxGeometry, FontLoader, LinearFilter, Mesh, MeshBasicMaterial, MeshPhongMaterial, PerspectiveCamera, Scene, Sprite, SpriteMaterial, TextGeometry, TextureLoader, Vector3 } from "three";
import { Scenes } from ".";
import { PixelFont } from "../fonts";
import { Dogs, NassauImg, Serene, Sprites, Stroller } from "../images";
import Player from "../player/player";
import Maps from "./Maps";
import Rewards from "./Rewards";

class Nassau extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        this.dialogueHappened = false;

        // Adding in tiles
        // Hashmap for tiles
        this.tileset = new Map();
        // Outdoors tileset details
        this.imageX = 128;
        this.imageY = 432;
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

        // Tree
        this.createTile(10, Serene, 0, -21);
        this.createTile(11, Serene, 1, -21);
        this.createTile(12, Serene, 0, -20);
        this.createTile(13, Serene, 1, -20);
        this.createTile(14, Serene, 0, -19);
        this.createTile(15, Serene, 1, -19);

        // Nassau Hall
        // 23 - 88
        this.countX = 11;
        this.countY = 6;
        var currentIndex = 23;
        for (let i = 0; i >= -5; i--) {
            for (let j = 0; j <= 10; j++) {
                this.createTile(currentIndex, NassauImg, j, i);
                currentIndex++;
            }
        }

        // Dogs
        // 89 - 94
        this.countX = 3;
        this.countY = 2;
        for (let i = 0; i >= -1; i--) {
            for (let j = 0; j <= 2; j++) {
                this.createTile(currentIndex, Dogs, j, i);
                currentIndex++;
            }
        }

        // Baby
        this.countX = 1;
        this.countY = 1;
        this.createTile(95, Stroller, 0, 0);

        // Sprites
        this.countX = 15;
        this.countY = 8;
        // Red hair
        this.createTile(96, Sprites, 1, -3);
        // Yellow hair
        this.createTile(97, Sprites, 7, -3);
        // Green hair
        this.createTile(98, Sprites, 10, -3);
        // White hair girl
        this.createTile(99, Sprites, 13, -3);
        // White hair boy
        this.createTile(100, Sprites, 10, -7);
        // Pink hair
        this.createTile(101, Sprites, 7, -7);

        // Walkable Tiles List
        this.walkable = new Set();
        for (let i = 0; i <= 9; i++) {
            this.walkable.add(i);
        }
        for (let i = 19; i <= 22; i++) {
            this.walkable.add(i);
        }

        // Scene changing tiles list
        this.sceneChangers = new Set();
        this.sceneChangers.add(2);
        this.sceneChangers.add(4);
        this.sceneChangers.add(5);
        this.sceneChangers.add(6);
        this.sceneChangers.add(8);

        this.tiles = [            
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
            [  0, 14, 15,  4,  5,  6, 14, 15, 14, 15, 14, 15, 14, 15, 14, 15,  4,  5,  6, 14, 15, 14, 15, 14, 15, 14, 15, 14, 15,  4,  5,  6, 14, 15,  0],
            [  0, 12, 13,  4,  5,  6, 12, 13, 12, 13, 12, 13, 12, 13, 12, 13,  4,  5,  6, 12, 13, 12, 13, 12, 13, 12, 13, 12, 13,  4,  5,  6, 12, 13,  0],
            [  0, 10, 11,  4,  5,  6, 10, 11, 10, 11, 10, 11, 10, 11, 10, 11,  4,  5,  6, 10, 11, 10, 11, 10, 11, 10, 11, 10, 11,  4,  5,  6, 10, 11,  0],
            [  0, 14, 15,  4,  5,  6,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  6,  0,  0,  0,  0, 14, 15,  0,  0,  0,  0,  4,  5,  6, 14, 15,  0],
            [  0, 12, 13,  4,  5,  6,  0,  0,  0,  0,  0,  0,  0,  0, 14, 15,  4,  5,  6,  0,  0,  0,  0, 12, 13,  0,  0,  0,  0,  4,  5,  6, 12, 13,  0],
            [  0, 10, 11,  4,  5,  6,  0, 14, 15,  0,  0,  0,  0,  0, 12, 13,  4,  5,  6,  0,  0,  0,  0, 10, 11,  0,  0,  0,  0,  4,  5,  6, 10, 11,  0],
            [  0, 14, 15,  4,  5,  6,  0, 12, 13,  0,  0,  0,  0,  0, 10, 11,  4,  5,  6,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  6, 14, 15,  0],
            [  0, 12, 13,  4,  5,  6,  0, 10, 11,  0,  0,  0,  0,  0,  0,  0,  4,  5,  6,  0,  0,  0,  0, 90,101, 94,  0,  0,  0,  4,  5,  6, 12, 13,  0],
            [  0, 10, 11,  4,  5,  6,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  6,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  6, 10, 11,  0],
            [  0, 14, 15,  4,  5,  6,  0,  0,  0,  0,  0,  0,  0, 14, 15,  0,  4,  5,  6, 14, 15,  0,  0,  0,  0,  0,  0, 14, 15,  4,  5,  6, 14, 15,  0],
            [  0, 12, 13,  4,  5,  6,  0,  0,  0,  0, 91,  0,  0, 12, 13,  0,  4,  5,  6, 12, 13,  0,  0,  0,  0,  0,  0, 12, 13,  4,  5,  6, 12, 13,  0],
            [  0, 10, 11,  4,  5,  6,  0,  0,  0,  0, 96,  0,  0, 10, 11,  0,  4,  5,  6, 10, 11,  0,  0,  0,  0,  0,  0, 10, 11,  4,  5,  6, 10, 11,  0],
            [  0, 14, 15,  4,  5, 22,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8, 20,  5, 22,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8, 20,  5,  6, 14, 15,  0],
            [  0, 12, 13,  4,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  6, 12, 13,  0],
            [  0, 10, 11,  4,  5, 21,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2, 19,  5, 21,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2, 19,  5,  6, 10, 11,  0],
            [  0, 14, 15,  4,  5,  6,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  6, 14, 15,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  6, 14, 15,  0],
            [  0, 12, 13,  4,  5,  6,  0,  0,  0,  0,  0,  0,  0, 14, 15,  0,  4,  5,  6, 12, 13,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  6, 12, 13,  0],
            [  0, 10, 11,  4,  5,  6,  0,  0,  0, 14, 15,  0,  0, 12, 13,  0,  4,  5,  6, 10, 11,  0,  0,  0,  0,  0, 14, 15,  0,  4,  5,  6, 10, 11,  0],
            [  0, 14, 15,  4,  5,  6,  0,  0,  0, 12, 13,  0,  0, 10, 11,  0,  4,  5,  6,  0,  0,  0,  0, 92, 93,  0, 12, 13,  0,  4,  5,  6, 14, 15,  0],
            [  0, 12, 13,  4,  5,  6, 14, 15,  0, 10, 11, 95,  0,  0,  0,  0,  4,  5,  6,  0,  0, 14, 15, 97, 98,  0, 10, 11,  0,  4,  5,  6, 12, 13,  0],
            [  0, 10, 11,  4,  5,  6, 12, 13,  0,  0,  0, 99,100,  0,  0,  0,  4,  5,  6,  0,  0, 12, 13,  0,  0,  0,  0,  0,  0,  4,  5,  6, 10, 11,  0],
            [  0, 14, 15,  4,  5,  6, 10, 11,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  6,  0,  0, 10, 11,  0,  0,  0,  0,  0,  0,  4,  5,  6, 14, 15,  0],
            [  0, 12, 13,  4,  5, 22,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8, 20,  5, 22,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8, 20,  5,  6, 12, 13,  0],
            [  0, 10, 11,  4,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  6, 10, 11,  0],
            [  0, 14, 15,  4,  5, 21,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2, 19,  5,  6, 14, 15,  0],
            [  0, 12, 13,  4,  5,  6,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  6, 12, 13,  0],
            [  0, 10, 11,  4,  5,  6, 14, 15, 14, 15, 14, 15, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 14, 15, 14, 15, 14, 15,  4,  5,  6, 10, 11,  0],
            [  0, 14, 15,  4,  5,  6, 12, 13, 12, 13, 12, 13, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 12, 13, 12, 13, 12, 13,  4,  5,  6, 14, 15,  0],
            [  0, 12, 13,  4,  5,  6, 10, 11, 10, 11, 10, 11, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 10, 11, 10, 11, 10, 11,  4,  5,  6, 12, 13,  0],
            [  0, 10, 11,  4,  5,  6, 14, 15, 14, 15, 14, 15, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 14, 15, 14, 15, 14, 15,  4,  5,  6, 10, 11,  0],
            [  0, 14, 15,  4,  5,  6, 12, 13, 12, 13, 12, 13, 12, 13, 69, 70, 71, 72, 73, 74, 75, 12, 13, 12, 13, 12, 13, 12, 13,  4,  5,  6, 14, 15,  0],
            [  0, 12, 13,  4,  5,  6, 10, 11, 10, 11, 10, 11, 10, 11, 80, 81, 82, 83, 84, 85, 86, 10, 11, 10, 11, 10, 11, 10, 11,  4,  5,  6, 12, 13,  0],
            [  0, 10, 11,  4,  5,  6, 14, 15, 14, 15, 14, 15, 14, 15, 14, 15, 14, 15, 14, 15, 14, 15, 14, 15, 14, 15, 14, 15, 14,  4,  5,  6, 10, 11,  0],

        ];
        this.width = this.tiles.length;
        this.height = this.tiles[0].length;

        this.createScene();


        // Create player for scene
        this.player = new Player(Nassau);
        this.add(this.player.sprite);
        this.player.setPosition(this.height - 5, this.width - 2, 0);

        // Camera
        this.camera = new PerspectiveCamera();
        // Set up camera
        // this.camera.position.set(this.height/2, this.width - 9, 1.6);
        // this.camera.lookAt(new Vector3(this.height/2, this.width - 9, 0));
        this.camera.position.set(this.height - 5, this.width - 2, 1.6);
        this.camera.lookAt(new Vector3(this.height - 5, this.width - 2, 0));
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
                if (Math.round(playerPos.y) >= this.width - 2) {
                    if (this.sceneChangers.has(this.tiles[Math.round(playerPos.y + 0.3 + speed)][Math.round(playerPos.x)])) {
                        Scenes.switchScene('frist');
                    }
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
                if (Math.round(playerPos.y) <= 0.8) {
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
            // Dialogue event
            if (event.code === 'Space' || event.key === ' ') {
                if (this.inActionSpace(101) && !this.dialogueHappened) {
                    this.startDialogue();
                }
            }
            // Map event
            if (event.code === 'KeyM' || event.key === 'm') {
                const map = new Maps('nassau');
                console.log(map);
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
                const rewards = new Rewards('nassau');
                Scenes.scenes['rewards'] = rewards;
                Scenes.switchScene('rewards');
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
        texture.offset.x = (1 * offsetX + 0.025) / this.countX;
        texture.offset.y = (-1 *  offsetY + 0.03) / this.countY;
        texture.repeat.x = (1 - eps * 9) / this.countX;
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
                if (index <= 101) {
                    if (index === 56 || index === 65) {
                        var background = new Sprite(this.tileset.get(14));
                        var backbackground = new Sprite(this.tileset.get(0));
                        backbackground.position.set(i, j, -0.00000001);
                        this.add(backbackground)

                    }
                    else if (index === 57 || index === 66) {
                        var background = new Sprite(this.tileset.get(15));
                        var backbackground = new Sprite(this.tileset.get(0));
                        backbackground.position.set(i, j, -0.000000001);
                        this.add(backbackground)

                    }
                    else {
                        var background = new Sprite(this.tileset.get(0));
                    }
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
        this.camera.position.y = playerPos.y + 7;
        // Add cube to back
        const boxGeometry = new BoxGeometry(20, 8, 0.001);
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
                "You:\n\nHey, I like your dogs.",
                    {
                        font: font,
                        size: 0.5,
                        height: 0
                    }
                );
                Scenes.scenes['nassau'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                Scenes.scenes['nassau'].textMesh.position.set(playerPos.x - 8.5, playerPos.y + 9, 0.1);
                // Cannot use this.add since inside new function
                Scenes.scenes['nassau'].add(Scenes.scenes['nassau'].textMesh);
            }
        );  
        this.dialogueContinue = (event) => {
            if (event.key !== ' ') return;
            if (count >= 7) {
                this.remove(Scenes.scenes['nassau'].textMesh);  
                this.remove(cube);
                window.addEventListener('keydown', this.move, false);
                window.removeEventListener('keydown', this.dialogueContinue, false); 
            }
            else if (count === 0){
                Scenes.scenes['nassau'].remove(Scenes.scenes['nassau'].textMesh);  
                fontLoader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry(
                        "Dog Lady:\n\nThanks, I made them myself.",
                            {
                                font: font,
                                size: 0.5,
                                height: 0
                            }
                        );
                        Scenes.scenes['nassau'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                        Scenes.scenes['nassau'].textMesh.position.set(playerPos.x - 8.5, playerPos.y + 9, 0.1);
                        // Cannot use this.add since inside new function
                        Scenes.scenes['nassau'].add(Scenes.scenes['nassau'].textMesh);
                    }
                );  
            }
            else if (count === 1){
                Scenes.scenes['nassau'].remove(Scenes.scenes['nassau'].textMesh);  
                fontLoader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry(
                        "You:\n\nHave you seen any of the three items I'm\nlooking for?",
                            {
                                font: font,
                                size: 0.5,
                                height: 0
                            }
                        );
                        Scenes.scenes['nassau'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                        Scenes.scenes['nassau'].textMesh.position.set(playerPos.x - 8.5, playerPos.y + 9, 0.1);
                        // Cannot use this.add since inside new function
                        Scenes.scenes['nassau'].add(Scenes.scenes['nassau'].textMesh);
                    }
                );  
            }
            else if (count === 2){
                Scenes.scenes['nassau'].remove(Scenes.scenes['nassau'].textMesh);  
                fontLoader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry(
                        "Dog Lady:\n\nWhat items are they?",
                            {
                                font: font,
                                size: 0.5,
                                height: 0
                            }
                        );
                        Scenes.scenes['nassau'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                        Scenes.scenes['nassau'].textMesh.position.set(playerPos.x - 8.5, playerPos.y + 9, 0.1);
                        // Cannot use this.add since inside new function
                        Scenes.scenes['nassau'].add(Scenes.scenes['nassau'].textMesh);
                    }
                );  
            }
            else if (count === 3){
                Scenes.scenes['nassau'].remove(Scenes.scenes['nassau'].textMesh);  
                fontLoader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry(
                        "You:\n\n(too lazy to type them all out again but the\npoint is you say them and she hears them)",
                            {
                                font: font,
                                size: 0.5,
                                height: 0
                            }
                        );
                        Scenes.scenes['nassau'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                        Scenes.scenes['nassau'].textMesh.position.set(playerPos.x - 8.5, playerPos.y + 9, 0.1);
                        // Cannot use this.add since inside new function
                        Scenes.scenes['nassau'].add(Scenes.scenes['nassau'].textMesh);
                    }
                );  
            }
            else if (count === 4){
                Scenes.scenes['nassau'].remove(Scenes.scenes['nassau'].textMesh);  
                fontLoader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry(
                        "Dog Lady:\n\nHmmm, I don't think any of those\nare near Nassau.",
                            {
                                font: font,
                                size: 0.5,
                                height: 0
                            }
                        );
                        Scenes.scenes['nassau'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                        Scenes.scenes['nassau'].textMesh.position.set(playerPos.x - 8.5, playerPos.y + 9, 0.1);
                        // Cannot use this.add since inside new function
                        Scenes.scenes['nassau'].add(Scenes.scenes['nassau'].textMesh);
                    }
                );  
            }
            else if (count === 5){
                Scenes.scenes['nassau'].remove(Scenes.scenes['nassau'].textMesh);  
                fontLoader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry(
                        "You:\n\nAw, man.",
                            {
                                font: font,
                                size: 0.5,
                                height: 0
                            }
                        );
                        Scenes.scenes['nassau'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                        Scenes.scenes['nassau'].textMesh.position.set(playerPos.x - 8.5, playerPos.y + 9, 0.1);
                        // Cannot use this.add since inside new function
                        Scenes.scenes['nassau'].add(Scenes.scenes['nassau'].textMesh);
                    }
                );  
            }
            else if (count === 6){
                Scenes.scenes['nassau'].remove(Scenes.scenes['nassau'].textMesh);  
                fontLoader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry(
                        "Dog Lady:\n\nSorry! If you ever want to come back and\npet the dogs, I'll be standing here all year.\n\nAnyways, good luck!",
                            {
                                font: font,
                                size: 0.5,
                                height: 0
                            }
                        );
                        Scenes.scenes['nassau'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                        Scenes.scenes['nassau'].textMesh.position.set(playerPos.x - 8.5, playerPos.y + 9, 0.1);
                        // Cannot use this.add since inside new function
                        Scenes.scenes['nassau'].add(Scenes.scenes['nassau'].textMesh);
                    }
                );  
            }
            count++;
        }
        window.removeEventListener('keydown', this.move, false);
        window.addEventListener('keydown', this.dialogueContinue, false); 
        this.dialogueHappened = true;
        // Allow user to switch maps once dialogue completed
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

export default Nassau;