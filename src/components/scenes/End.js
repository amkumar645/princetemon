import { BoxGeometry, FontLoader, Mesh, MeshBasicMaterial, MeshPhongMaterial, PerspectiveCamera, Scene, TextGeometry, TextureLoader, Vector3 } from "three";
import { Scenes } from ".";
import { PixelFont } from "../fonts";
import { EndBackground, WoodBlock } from "../images";

class End extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Camera
        this.camera = new PerspectiveCamera();
        // Set up camera
        this.camera.position.set(0, 0, 2.5);
        this.camera.lookAt(new Vector3(0, 0, 0));

        // Set background to background image
        const bgLoader = new TextureLoader();
        const bgTexture = bgLoader.load(EndBackground);
        this.background = bgTexture;

        // Add cube to back
        const boxGeometry = new BoxGeometry(2.5, 1.5, 0.001);
        const boxTexture = new TextureLoader().load(WoodBlock);
        const boxMaterial = new MeshBasicMaterial({map: boxTexture});
        const cube = new Mesh(boxGeometry, boxMaterial);
        cube.position.set(0, 0, 0);
        this.add(cube);

        // Title Text Box
        const fontLoader = new FontLoader();
        fontLoader.load(
            PixelFont,
            function(font) {
                const geometry = new TextGeometry(
                "Thanks for playing!",
                    {
                        font: font,
                        size: 0.12,
                        height: 0
                    }
                );
                const textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                textMesh.position.set(-0.8, 0, 0.1);
                // Cannot use this.add since inside new function
                Scenes.scenes['end'].add(textMesh);
            }
        );
        fontLoader.load(
            PixelFont,
            function(font) {
                const geometry = new TextGeometry(
                "Created by: Arnav Kumar, Stephanie Yen, and Kirsten Pardo",
                    {
                        font: font,
                        size: 0.05,
                        height: 0
                    }
                );
                const textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                textMesh.position.set(-1, -0.37, 0.1);
                // Cannot use this.add since inside new function
                Scenes.scenes['end'].add(textMesh);
            }
        );

        // Window resize handler for scene
        this.windowResizeHandler = () => {
            const { innerHeight, innerWidth } = window;
            Scenes.renderer.setSize(innerWidth, innerHeight);
            this.camera.aspect = innerWidth / innerHeight;
            this.camera.updateProjectionMatrix();
        };
    }


    addEvents() {
        this.windowResizeHandler();
        // Window resize event
        window.addEventListener('resize', this.windowResizeHandler, false);
    }

    removeEvents() {
        window.removeEventListener('resize', this.windowResizeHandler, false);
    }
}

export default End;
