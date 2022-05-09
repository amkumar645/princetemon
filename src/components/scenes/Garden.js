import { BoxGeometry, FontLoader, LinearFilter, Mesh, MeshBasicMaterial, MeshPhongMaterial, PerspectiveCamera, Scene, Sprite, SpriteMaterial, TextGeometry, TextureLoader, Vector3 } from "three";
import { Scenes } from ".";
import { PixelFont } from "../fonts";
import { Flowers, Fountain, ProspectHouse, Serene, Sprites } from "../images";
import Player from "../player/player";
import Maps from "./Maps";
import Rewards from "./Rewards";

import { AudioListener, Audio, AudioLoader } from 'three';
import { GardenAmbientAudio } from "../audio";

class Garden extends Scene {
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

        var currentIndex = 23;

        // Fountain
        this.countX = 5;
        this.countY = 5;
        for (let i = 0; i >= -4; i--) {
            for (let j = 0; j <= 4; j++) {
                this.createTile(currentIndex, Fountain, j, i);
                currentIndex++;
            }
        }

        // Flowers
        this.countX = 8;
        this.countY = 16;

        currentIndex = 48;
        // Bush flowers
        // 48 - 53
        for (let i = 2; i <= 7; i++) {
            this.createTile(currentIndex, Flowers, i, -14);
            currentIndex++;
        }
        // 54 - 59
        for (let i = 2; i <= 7; i++) {
            this.createTile(currentIndex, Flowers, i, -4);
            currentIndex++;
        }
        // Non-bush flowers
        // 60 - 65
        for (let i = 0; i <= 5; i++) {
            this.createTile(currentIndex, Flowers, i, -13);
            currentIndex++;
        }
        // 66 - 72
        for (let i = 0; i <= 6; i++) {
            this.createTile(currentIndex, Flowers, i, -11);
            currentIndex++;
        }
        // 73 - 79
        for (let i = 0; i <= 6; i++) {
            this.createTile(currentIndex, Flowers, i, -10);
            currentIndex++;
        }

        // Walkable Tiles List
        this.walkable = new Set();
        for (let i = 0; i <= 9; i++) {
            this.walkable.add(i);
        }
        for (let i = 19; i <= 22; i++) {
            this.walkable.add(i);
        }

        // Talking sprite
        // Number of images per row/column
        this.countX = 15;
        this.countY = 8;
        this.createTile(104, Sprites, 13, -5);

        // Prospect House
        this.currentIndex = 105;
        this.countX = 9;
        this.countY = 6;
        // 105 - 158
        for (let i = 0; i >= -5; i--) {
            for (let j = 0; j <= 8; j++) {
                this.createTile(this.currentIndex, ProspectHouse, j, i);
                this.currentIndex++;
            }
        }

        // Scene changing tiles list
        this.sceneChangers = new Set();
        this.sceneChangers.add(2);
        this.sceneChangers.add(4);
        this.sceneChangers.add(5);
        this.sceneChangers.add(6);
        this.sceneChangers.add(8);

        this.tiles = [   
            [ 14, 15, 14, 15, 14, 15,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 14, 15, 14, 15],
            [ 12, 13, 12, 13, 12, 13,  7,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  9, 12, 13, 12, 13],
            [ 10, 11, 10, 11, 10, 11,  4,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  6, 10, 11, 10, 11],
            [ 14, 15, 14, 15, 14, 15,  4,  5, 21,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2, 19,  5,  6, 14, 15, 14, 15],
            [ 12, 13, 12, 13, 12, 13,  4,  5,  6,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  6, 12, 13, 12, 13],
            [ 10, 11, 10, 11, 10, 11,  4,  5,  6,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  6, 10, 11, 10, 11],
            [ 14, 15, 14, 15, 14, 15,  4,  5,  6,  0,  0,  0, 61, 62, 63, 64, 65, 60, 61, 62, 63, 64, 65, 60, 61, 62, 63, 64, 65, 60, 61,  0,  0,  0,  0,  0,  4,  5,  6, 14, 15, 14, 15],
            [ 12, 13, 12, 13, 12, 13,  4,  5,  6,  0,  0,  0, 60,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 62,  0,  0,  0,  0,  0,  4,  5,  6, 12, 13, 12, 13],
            [ 10, 11, 10, 11, 10, 11,  4,  5,  6,  0,  0,  0, 65,  0, 50, 51, 52, 53, 48, 49, 50, 51, 52, 53, 48, 49, 50, 51, 52,  0, 63,  0,  0,  0,  0,  0,  4,  5,  6, 10, 11, 10, 11],
            [ 14, 15, 14, 15, 14, 15,  4,  5,  6,  0,  0,  0, 64,  0, 49,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 53,  0, 64,  0,  0,  0,  0,  0,  4,  5,  6, 14, 15, 14, 15],
            [ 12, 13, 12, 13, 12, 13,  4,  5,  6,  0,  0,  0, 63,  0, 48,  0,  0,  0,  0, 23, 24, 25, 26, 27,  0,  0,  0,  0, 48,  0, 65,  0,  0,  0,  0,  0,  4,  5,  6, 12, 13, 12, 13],
            [ 10, 11, 10, 11, 10, 11,  4,  5,  6,  0,  0,  0, 62,  0, 53,  0,  0,  0,104, 28, 29, 30, 31, 32,  0,  0,  0,  0, 49,  0, 60,  0,  0,  0,  0,  0,  4,  5,  6, 10, 11, 10, 11],
            [ 14, 15, 14, 15, 14, 15,  4,  5,  6,  0,  0,  0, 61,  0, 52,  0,  0,  0,  0, 33, 34, 35, 36, 37,  0,  0,  0,  0, 50,  0, 61,  0,  0,  0,  0,  0,  4,  5,  6, 14, 15, 14, 15],
            [ 12, 13, 12, 13, 12, 13,  4,  5,  6,  0,  0,  0, 60,  0, 51,  0,  0,  0,  0, 38, 39, 40, 41, 42,  0,  0,  0,  0, 51,  0, 62,  0,  0,  0,  0,  0,  4,  5,  6, 12, 13, 12, 13],
            [ 10, 11, 10, 11, 10, 11,  4,  5,  6,  0,  0,  0, 65,  0, 50,  0,  0,  0,  0, 43, 44, 45, 46, 47,  0,  0,  0,  0, 52,  0, 63,  0,  0,  0,  0,  0,  4,  5,  6, 10, 11, 10, 11],
            [ 14, 15, 14, 15, 14, 15,  4,  5,  6,  0,  0,  0, 64,  0, 49,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 48,  0, 64,  0,  0,  0,  0,  0,  4,  5,  6, 14, 15, 14, 15],
            [ 12, 13, 12, 13, 12, 13,  4,  5,  6,  0,  0,  0, 63,  0, 48, 49, 50, 51, 52, 53,  0,  0,  0, 48, 49, 50, 51, 52, 53,  0, 65,  0,  0,  0,  0,  0,  4,  5,  6, 12, 13, 12, 13],
            [ 10, 11, 10, 11, 10, 11,  4,  5,  6,  0,  0,  0, 62,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 60,  0,  0,  0,  0,  0,  4,  5,  6, 10, 11, 10, 11],
            [ 14, 15, 14, 15, 14, 15,  4,  5,  6,  0,  0,  0, 61, 60, 65, 64, 63, 62, 61, 60,  0,  0,  0, 62, 61, 60, 65, 64, 63, 62, 61,  0,  0,  0,  0,  0,  4,  5,  6, 14, 15, 14, 15],
            [ 12, 13, 12, 13, 12, 13,  4,  5,  6,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  6, 12, 13, 12, 13],
            [ 10, 11, 10, 11, 10, 11,  4,  5,  6,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  6, 10, 11, 10, 11],
            [ 14, 15, 14, 15, 14, 15,  4,  5,  6, 60, 61, 62, 63, 64, 65, 60, 61, 62, 63, 64,  7,  8,  9, 60, 61, 62, 63, 64, 65, 60, 61, 62, 63, 64, 65, 60,  4,  5,  6, 14, 15, 14, 15],
            [ 12, 13, 12, 13, 12, 13,  4,  5,  6, 48, 49, 50, 51, 52, 53, 48, 49, 50, 51, 52,  4,  5,  6, 52, 51, 50, 49, 48, 53, 52, 51, 50, 49, 48, 53, 52,  4,  5,  6, 12, 13, 12, 13],
            [ 10, 11, 10, 11, 10, 11,  4,  5,  6, 66, 67, 68, 69, 70, 71, 72, 66, 67, 68, 69,  4,  5,  6, 66, 67, 68, 69, 70, 71, 72, 66, 67, 68, 69, 70, 71,  4,  5,  6, 10, 11, 10, 11],
            [ 14, 15, 14, 15, 14, 15,  4,  5,  6, 48, 49, 50, 51, 52, 53, 48, 49, 50, 51, 52,  4,  5,  6, 52, 51, 50, 49, 48, 53, 52, 51, 50, 49, 48, 53, 52,  4,  5,  6, 14, 15, 14, 15],
            [ 12, 13, 12, 13, 12, 13,  4,  5,  6, 73, 74, 75, 76, 77, 78, 79, 73, 74, 75, 76,  4,  5,  6, 73, 74, 75, 76, 77, 78, 79, 73, 74, 75, 76, 77, 78,  4,  5,  6, 12, 13, 12, 13],
            [ 10, 11, 10, 11, 10, 11,  4,  5,  6, 66, 67, 68, 69, 70, 71, 72, 66, 67, 68, 69,  4,  5,  6, 66, 67, 68, 69, 70, 71, 72, 66, 67, 68, 69, 70, 71,  4,  5,  6, 10, 11, 10, 11],
            [ 14, 15, 14, 15, 14, 15,  4,  5,  6, 60, 61, 62, 63, 64, 65, 60, 61, 62, 63, 64,  4,  5,  6, 60, 61, 62, 63, 64, 65, 60, 61, 62, 63, 64, 65, 60,  4,  5,  6, 14, 15, 14, 15],
            [ 12, 13, 12, 13, 12, 13,  4,  5,  6, 54, 55, 56, 57, 58, 59, 54, 55, 56, 57, 58,  4,  5,  6, 54, 55, 56, 57, 58, 59, 54, 55, 56, 57, 58, 54, 55,  4,  5,  6, 12, 13, 12, 13],
            [ 10, 11, 10, 11, 10, 11,  4,  5,  6, 48, 49, 50, 51, 52, 53, 48, 49, 50, 51, 52,  4,  5,  6, 52, 51, 50, 49, 48, 53, 52, 51, 50, 49, 48, 53, 52,  4,  5,  6, 10, 11, 10, 11],
            [  8,  8,  8,  8,  8,  8, 20,  5, 22,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8, 20,  5, 22,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8, 20,  5,  6, 14, 15, 14, 15],
            [  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  6, 12, 13, 12, 13],
            [  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  3, 10, 11, 10, 11],
            [ 14, 15, 14, 15, 14, 15, 14, 15, 14, 15, 14, 15, 14, 15, 14, 15,  0,105,106,107,108,109,110,111,112,113,  0, 14, 15, 14, 15, 14, 15, 14, 15, 14, 15, 14, 15, 14, 15, 14, 15],
            [ 12, 13, 12, 13, 12, 13, 12, 13, 12, 13, 12, 13, 12, 13, 12, 13,  0,114,115,116,117,118,119,120,121,122,  0, 12, 13, 12, 13, 12, 13, 12, 13, 12, 13, 12, 13, 12, 13, 12, 13],
            [ 10, 11, 10, 11, 10, 11, 10, 11, 10, 11, 10, 11, 10, 11, 10, 11,  0,123,124,125,126,127,128,129,130,131,  0, 10, 11, 10, 11, 10, 11, 10, 11, 10, 11, 10, 11, 10, 11, 10, 11],
            [ 14, 15, 14, 15, 14, 15, 14, 15, 14, 15, 14, 15, 14, 15, 14, 15,  0,132,133,134,135,136,137,138,139,140,  0, 14, 15, 14, 15, 14, 15, 14, 15, 14, 15, 14, 15, 14, 15, 14, 15],
            [ 12, 13, 12, 13, 12, 13, 12, 13, 12, 13, 12, 13, 12, 13, 12, 13,  0,141,142,143,144,145,146,147,148,149,  0, 12, 13, 12, 13, 12, 13, 12, 13, 12, 13, 12, 13, 12, 13, 12, 13],
            [ 10, 11, 10, 11, 10, 11, 10, 11, 10, 11, 10, 11, 10, 11, 10, 11,  0,150,151,152,153,154,155,156,157,158,  0, 10, 11, 10, 11, 10, 11, 10, 11, 10, 11, 10, 11, 10, 11, 10, 11],
        ];
        this.width = this.tiles.length;
        this.height = this.tiles[0].length;

        this.createScene();


        // Create player for scene
        this.player = new Player(Garden);
        this.add(this.player.sprite);
        this.player.setPosition(1, this.width - 8, 0);

        // Camera
        this.camera = new PerspectiveCamera();
        // Set up camera
        // this.camera.position.set(16, this.width - 11, 1.6);
        // this.camera.lookAt(new Vector3(16, this.width - 11, 0));
        this.camera.position.set(1, this.width - 8, 1.6);
        this.camera.lookAt(new Vector3(1, this.width - 8, 0));
        this.camera.zoom = 0.08;

        // // Add audio to scene
        // this.listener = new AudioListener();
        // this.camera.add(this.listener);
        // // create a global audio source
        // const audio = new Audio(this.listener);
        // // load a sound and set it as the Audio object's buffer
        // const audioLoader = new AudioLoader();
        // audioLoader.load(GardenAmbientAudio, function (buffer) {
        //     audio.setBuffer(buffer);
        //     audio.setLoop(true);
        //     audio.setVolume(0.5);
        //     audio.play();
        // });
        // this.audio = audio;
        // // if (!this.audio.isPlaying) this.audio.play();

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
                    if (this.sceneChangers.has(this.tiles[Math.round(playerPos.y)][Math.round(playerPos.x - speed - 0.3)])) {
                        Scenes.switchScene('frist');
                    }
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
            // Map event
            if (event.code === 'KeyM' || event.key === 'm') {
                const map = new Maps('garden');
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
                const rewards = new Rewards('garden');
                Scenes.scenes['rewards'] = rewards;
                Scenes.switchScene('rewards');
            }
            // Game + dialogue event
            if (event.code === 'Space' || event.key === ' ') {
                if (this.inActionSpace(104) && !this.dialogueHappened) {
                    this.startDialogue();
                }
                if (this.dialogueHappened) {
                    for (let i = 23; i <= 47; i++) {
                        if (this.inActionSpace(i)) {
                            Scenes.switchScene('gardengameinstructions')
                        }
                    }
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
                var background = new Sprite(this.tileset.get(0));

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
        if (this.tiles[Math.round(playerPos.y + 1)][Math.round(playerPos.x)] === tile
        || this.tiles[Math.round(playerPos.y - 1)][Math.round(playerPos.x)] === tile
        || this.tiles[Math.round(playerPos.y)][Math.round(playerPos.x + 1)] === tile
        || this.tiles[Math.round(playerPos.y)][Math.round(playerPos.x - 1)] === tile) {
            return true;
        }
        return false;
    }

    startDialogue() {
        // Dialogue event handlers 
        const playerPos = this.player.sprite.position;
        // Add cube to back
        const boxGeometry = new BoxGeometry(16, 8, 0.001);
        // const boxMaterial = new MeshBasicMaterial({color: 0x9b673c});
        const boxMaterial = new MeshBasicMaterial({color: 0xffffff});
        this.camera.position.x = playerPos.x;
        this.camera.position.y = playerPos.y + 5;

        var cube = new Mesh(boxGeometry, boxMaterial);
        cube.position.set(playerPos.x, playerPos.y + 6, 0.001);
        this.add(cube);
        var count = 0;
        this.textMesh;
        const fontLoader = new FontLoader();
        fontLoader.load(
            PixelFont,
            function(font) {
                const geometry = new TextGeometry(
                "You:\n\nHey, what are you doing?",
                    {
                        font: font,
                        size: 0.5,
                        height: 0
                    }
                );
                Scenes.scenes['garden'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0x000000}));
                Scenes.scenes['garden'].textMesh.position.set(playerPos.x - 6.5, playerPos.y + 8, 0.1);
                // Cannot use this.add since inside new function
                Scenes.scenes['garden'].add(Scenes.scenes['garden'].textMesh);
            }
        );  
        this.dialogueContinue = (event) => {
            if (event.key !== ' ') return;
            if (count >= 6) {
                this.remove(Scenes.scenes['garden'].textMesh);  
                this.remove(cube);
                window.addEventListener('keydown', this.move, false);
                window.removeEventListener('keydown', this.dialogueContinue, false); 
                this.dialogueHappened = true;
            }
            else if (count === 0){
                Scenes.scenes['garden'].remove(Scenes.scenes['garden'].textMesh);  
                fontLoader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry(
                        "Fountain Girl:\n\nI just made a wish with my 1975\ngold-plated coin uncirculated without\nmint marking and I'm waiting for my\nwish to come true.",
                            {
                                font: font,
                                size: 0.5,
                                height: 0
                            }
                        );
                        Scenes.scenes['garden'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0x00000}));
                        Scenes.scenes['garden'].textMesh.position.set(playerPos.x - 6.5, playerPos.y + 8, 0.1);
                        // Cannot use this.add since inside new function
                        Scenes.scenes['garden'].add(Scenes.scenes['garden'].textMesh);
                    }
                );  
            }
            else if (count === 1){
                Scenes.scenes['garden'].remove(Scenes.scenes['garden'].textMesh);  
                fontLoader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry(
                        "You:\n\nWow, what are the odds of that?\n\nWould you mind if I jumped in\nand grabbed that?",
                            {
                                font: font,
                                size: 0.5,
                                height: 0
                            }
                        );
                        Scenes.scenes['garden'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0x00000}));
                        Scenes.scenes['garden'].textMesh.position.set(playerPos.x - 6.5, playerPos.y + 8, 0.1);
                        // Cannot use this.add since inside new function
                        Scenes.scenes['garden'].add(Scenes.scenes['garden'].textMesh);
                    }
                );  
            }
            else if (count === 2){
                Scenes.scenes['garden'].remove(Scenes.scenes['garden'].textMesh);  
                fontLoader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry(
                        "Fountain Girl:\n\nNo problem! It was my wish to see\nsomeone swim with the piranhas\nthey added this morning anyways.",
                            {
                                font: font,
                                size: 0.5,
                                height: 0
                            }
                        );
                        Scenes.scenes['garden'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0x00000}));
                        Scenes.scenes['garden'].textMesh.position.set(playerPos.x - 6.5, playerPos.y + 8, 0.1);
                        // Cannot use this.add since inside new function
                        Scenes.scenes['garden'].add(Scenes.scenes['garden'].textMesh);
                    }
                );  
            }
            else if (count === 3){
                Scenes.scenes['garden'].remove(Scenes.scenes['garden'].textMesh);  
                fontLoader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry(
                        "You:\n\nSweet!",
                            {
                                font: font,
                                size: 0.5,
                                height: 0
                            }
                        );
                        Scenes.scenes['garden'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0x00000}));
                        Scenes.scenes['garden'].textMesh.position.set(playerPos.x - 6.5, playerPos.y + 8, 0.1);
                        // Cannot use this.add since inside new function
                        Scenes.scenes['garden'].add(Scenes.scenes['garden'].textMesh);
                    }
                );  
            }
            else if (count === 4){
                Scenes.scenes['garden'].remove(Scenes.scenes['garden'].textMesh);  
                fontLoader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry(
                        "You:\n\nWait, what did you just say about\npiranhas?",
                            {
                                font: font,
                                size: 0.5,
                                height: 0
                            }
                        );
                        Scenes.scenes['garden'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0x00000}));
                        Scenes.scenes['garden'].textMesh.position.set(playerPos.x - 6.5, playerPos.y + 8, 0.1);
                        // Cannot use this.add since inside new function
                        Scenes.scenes['garden'].add(Scenes.scenes['garden'].textMesh);
                    }
                );  
            }
            else if (count === 5){
                Scenes.scenes['garden'].remove(Scenes.scenes['garden'].textMesh);  
                fontLoader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry(
                        "Fountain Girl:\n\nAnyways, good luck!",
                            {
                                font: font,
                                size: 0.5,
                                height: 0
                            }
                        );
                        Scenes.scenes['garden'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0x00000}));
                        Scenes.scenes['garden'].textMesh.position.set(playerPos.x - 6.5, playerPos.y + 8, 0.1);
                        // Cannot use this.add since inside new function
                        Scenes.scenes['garden'].add(Scenes.scenes['garden'].textMesh);
                    }
                );  
            }
            count++;
        }
        window.removeEventListener('keydown', this.move, false);
        window.addEventListener('keydown', this.dialogueContinue, false); 
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

export default Garden;