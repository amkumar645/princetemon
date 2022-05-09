import { Group, LinearFilter, Sprite, SpriteMaterial, TextureLoader } from "three";
import { DancingSpriteSheet } from "../images";

class DancingSprite extends Group {
    constructor(parent) {
        super();
        this.scene = parent;
        // Number of images per row/column
        this.countX = 3;
        this.countY = 4;
        let currentIndex = 0;
        this.spritesheet = new Map();
        // 0 - 10
        for (let i = -3; i <= 0; i++) {
            for (let j = 0; j <= 2; j++) {
                this.createTile(currentIndex, DancingSpriteSheet, j, i);
                currentIndex++;
            }
        }

        this.sprites = new Map();
        for (let i = 0; i < this.spritesheet.size; i++) {
            this.sprites.set(i, new Sprite(this.spritesheet.get(i)));
        }
        this.sprite = this.sprites.get(0);
        // Loop for walking animation
        this.currentLoopIndex = 0;
    }

    animate() {
        // Moves to current frame
        this.sprite = this.sprites.get(this.currentLoopIndex);
        // Updates frame to next
        this.currentLoopIndex = (this.currentLoopIndex + 1) % 11;
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
}

export default DancingSprite;
