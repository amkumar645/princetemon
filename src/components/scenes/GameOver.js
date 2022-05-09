import { Color, FontLoader, Mesh, MeshPhongMaterial, PerspectiveCamera, Scene, TextGeometry, Vector3 } from "three";
import { Scenes } from ".";
import { PixelFont } from "../fonts";

class GameOver extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Camera
        this.camera = new PerspectiveCamera();
        // Set up camera
        this.camera.position.set(0, 0, 2.5);
        this.camera.lookAt(new Vector3(0, 0, 0));

        // Set background to a nice color
        this.background = new Color(0xed2939);

        // Title Text Box
        const fontLoader = new FontLoader();
        fontLoader.load(
            PixelFont,
            function(font) {
                const geometry = new TextGeometry(
                "GAME OVER",
                    {
                        font: font,
                        size: 0.3,
                        height: 0
                    }
                );
                const textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                textMesh.position.set(-1.2, 0, 0.1);
                // Cannot use this.add since inside new function
                Scenes.scenes['gameover'].add(textMesh);
            }
        );
        fontLoader.load(
            PixelFont,
            function(font) {
                const geometry = new TextGeometry(
                "Press space to respawn",
                    {
                        font: font,
                        size: 0.05,
                        height: 0
                    }
                );
                const textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                textMesh.position.set(-0.37, -0.25, 0.1);
                // Cannot use this.add since inside new function
                Scenes.scenes['gameover'].add(textMesh);
            }
        );

        // Window resize handler for scene
        this.windowResizeHandler = () => {
            const { innerHeight, innerWidth } = window;
            Scenes.renderer.setSize(innerWidth, innerHeight);
            this.camera.aspect = innerWidth / innerHeight;
            this.camera.updateProjectionMatrix();
        };

        this.pressSpaceBar = (event) => {
            if (event.key === ' ' || event.code === 'Space') {
                Scenes.switchScene('poe');
            }
        };
    }


    addEvents() {
        this.windowResizeHandler();
        // Window resize event
        window.addEventListener('resize', this.windowResizeHandler, false);
        // Space to switch scene
        window.addEventListener('keydown', this.pressSpaceBar, false);
    }

    removeEvents() {
        window.removeEventListener('resize', this.windowResizeHandler, false);
        window.removeEventListener('keydown', this.pressSpaceBar, false);
    }
}

export default GameOver;