import { BoxGeometry, FontLoader, Mesh, MeshBasicMaterial, MeshPhongMaterial, PerspectiveCamera, Scene, TextGeometry, TextureLoader, Vector3 } from "three";
import { Scenes } from ".";
import { PixelFont } from "../fonts";
import { TitleBackground, WoodBlock } from "../images";

class Instructions extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Camera
        this.camera = new PerspectiveCamera();
        // Set up camera
        this.camera.position.set(0, 0, 10);
        this.camera.lookAt(new Vector3(0, 0, 0));

        // Set background to a nice color
        // this.background = new Color(0x7ec0ee);

        // Set background to background image
        const bgLoader = new TextureLoader();
        const bgTexture = bgLoader.load(TitleBackground);
        this.background = bgTexture;

        // Add cube to back
        const boxGeometry = new BoxGeometry(10, 8, 0.001);
        const boxTexture = new TextureLoader().load(WoodBlock);
        const boxMaterial = new MeshBasicMaterial({map: boxTexture});
        // const boxMaterial = new MeshBasicMaterial({color: 0x9b673c});
        const cube = new Mesh(boxGeometry, boxMaterial);
        cube.position.set(0, 0, 0);
        this.add(cube);

        // Title Text Box
        const fontLoader = new FontLoader();
        fontLoader.load(
            PixelFont,
            function(font) {
                const geometry = new TextGeometry(
                "Instructions",
                    {
                        font: font,
                        size: 0.6,
                        height: 0
                    }
                );
                const textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                textMesh.position.set(-3, 2.8, 0.1);
                // Cannot use this.add since inside new function
                Scenes.scenes['instructions'].add(textMesh);
            }
        );
        fontLoader.load(
            PixelFont,
            function(font) {
                const geometry = new TextGeometry(
                "- Use the arrow keys to move",
                    {
                        font: font,
                        size: 0.3,
                        height: 0
                    }
                );
                const textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                textMesh.position.set(-4.5, 2, 0.1);
                // Cannot use this.add since inside new function
                Scenes.scenes['instructions'].add(textMesh);
            }
        );
        fontLoader.load(
            PixelFont,
            function(font) {
                const geometry = new TextGeometry(
                "- Use WASD to adjust the camera",
                    {
                        font: font,
                        size: 0.3,
                        height: 0
                    }
                );
                const textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                textMesh.position.set(-4.5, 1.2, 0.1);
                // Cannot use this.add since inside new function
                Scenes.scenes['instructions'].add(textMesh);
            }
        );
        fontLoader.load(
            PixelFont,
            function(font) {
                const geometry = new TextGeometry(
                "- Press m to check the map",
                    {
                        font: font,
                        size: 0.3,
                        height: 0
                    }
                );
                const textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                textMesh.position.set(-4.5, 0.4, 0.1);
                // Cannot use this.add since inside new function
                Scenes.scenes['instructions'].add(textMesh);
            }
        );
        fontLoader.load(
            PixelFont,
            function(font) {
                const geometry = new TextGeometry(
                "- Press r to check your rewards progress",
                    {
                        font: font,
                        size: 0.3,
                        height: 0
                    }
                );
                const textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                textMesh.position.set(-4.5, -0.4, 0.1);
                // Cannot use this.add since inside new function
                Scenes.scenes['instructions'].add(textMesh);
            }
        );
        fontLoader.load(
            PixelFont,
            function(font) {
                const geometry = new TextGeometry(
                "- Press space to talk to NPCs or to interact\n  with special objects",
                    {
                        font: font,
                        size: 0.3,
                        height: 0
                    }
                );
                const textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                textMesh.position.set(-4.5, -1.2, 0.1);
                // Cannot use this.add since inside new function
                Scenes.scenes['instructions'].add(textMesh);
            }
        );
        fontLoader.load(
            PixelFont,
            function(font) {
                const geometry = new TextGeometry(
                "- Press z to zoom out and x to zoom back in",
                    {
                        font: font,
                        size: 0.3,
                        height: 0
                    }
                );
                const textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                textMesh.position.set(-4.5, -2.4, 0.1);
                // Cannot use this.add since inside new function
                Scenes.scenes['instructions'].add(textMesh);
            }
        );
        fontLoader.load(
            PixelFont,
            function(font) {
                const geometry = new TextGeometry(
                "Press space to begin!",
                    {
                        font: font,
                        size: 0.3,
                        height: 0
                    }
                );
                const textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                textMesh.position.set(-2.3, -3.7, 0.1);
                // Cannot use this.add since inside new function
                Scenes.scenes['instructions'].add(textMesh);
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
                Scenes.switchScene('frist');
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

export default Instructions;
