import { BoxGeometry, FontLoader, Mesh, MeshBasicMaterial, MeshPhongMaterial, PerspectiveCamera, Scene, TextGeometry, TextureLoader, Vector3 } from "three";
import { Scenes } from ".";
import { PixelFont } from "../fonts";
import { TitleBackground, TitleScreen, WoodBlock } from "../images";

class Title extends Scene {
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
        // const bgTexture = bgLoader.load(TitleBackground);
        const bgTexture = bgLoader.load(TitleScreen);
        this.background = bgTexture;


        // Title Text Box
        const fontLoader = new FontLoader();
        
        fontLoader.load(
            PixelFont,
            function(font) {
                const geometry = new TextGeometry(
                "Press space to begin!",
                    {
                        font: font,
                        size: 0.05,
                        height: 0
                    }
                );
                const textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                textMesh.position.set(-0.37, -1, 0.1);
                // Cannot use this.add since inside new function
                Scenes.scenes['title'].add(textMesh);
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
                Scenes.switchScene('instructions');
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

export default Title;
