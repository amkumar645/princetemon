import { LinearFilter, PerspectiveCamera, Scene, Sprite, SpriteMaterial, TextureLoader, Vector3 } from "three";
import { Scenes } from ".";
import { Brick, Coin, TitleBackground, WaterGlass } from "../images";


class Rewards extends Scene {
    constructor(location) {
        // Call parent Scene() constructor
        super();

        // Store location map called from
        this.location = location;

        // Camera
        this.camera = new PerspectiveCamera();
        // Set up camera
        this.camera.position.set(2, 0, 5);
        this.camera.lookAt(new Vector3(2, 0, 0));

        // Set background to background image
        const bgLoader = new TextureLoader();
        var bgTexture = bgLoader.load(TitleBackground);
        this.background = bgTexture;

        // Adding in tiles
        // Hashmap for tiles
        this.tileset = new Map();

        this.countX = 1;
        this.countY = 1;
        this.createTile(1, Brick, 0, 0);
        this.createTile(2, WaterGlass, 0, 0);
        this.createTile(3, Coin, 0, 0);
        // Actual tiles for level
        this.tiles = [
            [0, 0, 0]
        ];
        this.width = this.tiles.length;
        this.height = this.tiles[0].length;

        if (Scenes.successes[0] === 1) this.tiles[0][0] = 1;
        if (Scenes.successes[1] === 1) this.tiles[0][1] = 2;
        if (Scenes.successes[2] === 1) this.tiles[0][2] = 3;
        this.createScene();

        // Window resize handler for scene
        this.windowResizeHandler = () => {
            const { innerHeight, innerWidth } = window;
            Scenes.renderer.setSize(innerWidth, innerHeight);
            this.camera.aspect = innerWidth / innerHeight;
            this.camera.updateProjectionMatrix();
        };

        this.pressKey = (event) => {
            if (event.key === 'r' || event.code === 'KeyR') {
                Scenes.switchScene(this.location);
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
                const background = new Sprite(this.tileset.get(0));
                // Set positions based on tile mapping
                const xPosition = 2 * i;
                const yPosition = j;
                background.position.set(xPosition, yPosition, 0);
                this.add(background);
                sprite.position.set(xPosition, yPosition, 0.0001);
                this.add(sprite);
            }
        }
    }

    addEvents() {
        this.windowResizeHandler();
        // Window resize event
        window.addEventListener('resize', this.windowResizeHandler, false);
        // Space to switch scene
        window.addEventListener('keydown', this.pressKey, false);
    }

    removeEvents() {
        window.removeEventListener('resize', this.windowResizeHandler, false);
        window.removeEventListener('keydown', this.pressKey, false);
    }
}

export default Rewards;