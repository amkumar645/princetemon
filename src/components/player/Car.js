import { Group, LinearFilter, Sprite, SpriteMaterial, TextureLoader } from "three";
import { Vehicles } from "../images";

class Car extends Group {
    constructor(parent) {
        super();
        this.scene = parent;

        this.spritesheet = new Map();

        // Cars
        this.backgrounds = new Object(); // {} 
        // 22 x 19
        this.countX = 22;
        this.countY = 19;
        this.createTile(100, Vehicles, 0, -17);
        this.createTile(101, Vehicles, 0, -18);
        this.createTile(102, Vehicles, 1, -17);
        this.createTile(103, Vehicles, 1, -18);
        this.createTile(104, Vehicles, 2, -17);
        this.createTile(105, Vehicles, 2, -18);
        // Car body on top of road background
        for (let i = 100; i <= 105; i++) {
            this.backgrounds[i] = 35;
        }
        this.backgrounds[101] = this.backgrounds[103] = this.backgrounds[105] = 32;

        this.sprites = new Map();
        for (let i = 0; i < this.spritesheet.size; i++) {
            this.sprites.set(i, new Sprite(this.spritesheet.get(i)));
        }
        this.sprite = this.sprites.get(0);
        // Loop for moving animation
        this.currentLoopIndex = 0;
    }

    getSprite() {
        return this.sprite;
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

export default Car;