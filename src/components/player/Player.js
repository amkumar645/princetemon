import { Group, LinearFilter, Sprite, SpriteMaterial, TextureLoader } from "three";
import { SpritePton } from "../images";

class Player extends Group {
    constructor(parent) {
        super();
        this.scene = parent;
        // Sprite details
        this.imageX = 240;
        this.imageY = 128;
        // Number of images per row/column
        this.countX = 15;
        this.countY = 8;

        // Number of images per row/column
        this.countX = 3;
        this.countY = 4;

        this.spritesheet = new Map();
        // Standing up
        this.createTile(0, SpritePton, 1, 0);
        // Walking up 1
        this.createTile(1, SpritePton, 0, 0);
        // Walking up 2
        this.createTile(2, SpritePton, 2, 0);
        // Standing right
        this.createTile(3, SpritePton, 1, -1);
        // Walking right 1
        this.createTile(4, SpritePton, 0, -1);
        // Walking right 2
        this.createTile(5, SpritePton, 2, -1);
        // Standing left
        this.createTile(6, SpritePton, 1, -2);
        // Walking left 1
        this.createTile(7, SpritePton, 0, -2);
        // Walking left 2
        this.createTile(8, SpritePton, 2, -2);
        // Standing down
        this.createTile(9, SpritePton, 1, -3);
        // Walking down 1
        this.createTile(10, SpritePton, 0, -3);
        // Walking down 2
        this.createTile(11, SpritePton, 2, -3);

        this.sprites = new Map();
        for (let i = 0; i < this.spritesheet.size; i++) {
            this.sprites.set(i, new Sprite(this.spritesheet.get(i)));
        }
        this.sprite = this.sprites.get(0);
        // Loop for walking animation
        this.currentLoopIndex = 0;
    }

    setPosition(x, y, z, direction) {
        // Walking animation cycle
        const cycleLoop = [0, 1, 0, 2];
        if (direction === "left") {
            const start = 6;
            this.sprite = this.sprites.get(start + cycleLoop[this.currentLoopIndex]);
            this.updateLoop();
        }
        else if (direction === "right") {
            const start = 3;
            this.sprite = this.sprites.get(start + cycleLoop[this.currentLoopIndex]);
            this.updateLoop();
        }
        else if (direction === "up") {
            const start = 0;
            this.sprite = this.sprites.get(start + cycleLoop[this.currentLoopIndex]);
            this.updateLoop();

        }
        else if (direction === "down") {
            const start = 9;
            this.sprite = this.sprites.get(start + cycleLoop[this.currentLoopIndex]);
            this.updateLoop();

        }
        this.sprite.position.set(x, y, z);
    }

    createTile(index, source, offsetX, offsetY) {
        // Sample smaller square to get rid of black borders
        const eps = 0;

        // Load in image
        const texture = new TextureLoader().load(source);
        texture.minFilter = LinearFilter;
        // Find tile
        texture.offset.x = (1 * offsetX - eps) / this.countX;
        texture.offset.y = (-1 *  offsetY + eps) / this.countY;
        texture.repeat.x = 1 / this.countX;
        texture.repeat.y = (1 - 0.03) / this.countY;
        // texture.wrapS = texture.wrapT = RepeatWrapping;

        const material = new SpriteMaterial({map: texture});

        // Add tile to tileset
        this.spritesheet.set(index, material);
    }

    // Updates animation step
    updateLoop() {
        this.currentLoopIndex = (this.currentLoopIndex + 1) % 4;
    }

}

export default Player;
