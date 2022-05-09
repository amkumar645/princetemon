import { BoxGeometry, FontLoader, LinearFilter, Mesh, MeshBasicMaterial, MeshPhongMaterial, PerspectiveCamera, Scene, Sprite, SpriteMaterial, TextGeometry, TextureLoader, Vector3 } from "three";
import { Scenes } from ".";
import { PixelFont } from "../fonts";
import { FristBig, Serene, Outside, Trees, Street, 
         Sprites } from "../images";
import Player from "../player/player";
import Maps from "./Maps";
import Rewards from "./Rewards";
import PrincetemonScene from "./PrincetemonScene"; // TODO

class Frist extends Scene {
    constructor() {
        // Call parent Scene() constructor
        super();

        // Dialogue checker
        this.dialogueHappened = false;

        // Adding in tiles
        this.tileset = new Map(); // hashmap for tiles
        // this.backgrounds = new Object(); // dictionary for backgrounds 
        this.walkable = new Set(); // set for walkable tiles
        this.sceneChangers = new Set(); // set for scene-changing tiles

        // --- Serene/outdoor tiles ---
        this.countX = 8;
        this.countY = 27;
        // Grass
        this.createTile(0, Serene, 1, -25);
        // Path
        this.createTile(1, Serene, 2, -26); // row
        this.createTile(2, Serene, 3, -26);
        this.createTile(3, Serene, 4, -26);
        this.createTile(4, Serene, 2, -25); // row
        this.createTile(5, Serene, 3, -25);
        this.createTile(6, Serene, 4, -25);
        this.createTile(7, Serene, 2, -24); // row
        this.createTile(8, Serene, 3, -24);
        this.createTile(9, Serene, 4, -24);
        // Path corners
        this.createTile(10, Serene, 3, -22); // bottom <> right
        this.createTile(11, Serene, 3, -23); // top <> right
        this.createTile(12, Serene, 2, -22); // bottom <> left
        this.createTile(13, Serene, 2, -23); // top <> left

        // // Tree
        // this.createTile(10, Serene, 0, -21);
        // this.createTile(11, Serene, 1, -21);
        // this.createTile(12, Serene, 0, -20);
        // this.createTile(13, Serene, 1, -20);
        // this.createTile(14, Serene, 0, -19);
        // this.createTile(15, Serene, 1, -19);

        // --- Frist tile set ---
        this.countX = 11;
        this.countY = 8;
        var currentIndex = 16;
        // 16 - 103
        for (let i = 0; i >= -7; i--) {
            for (let j = 0; j <= 10; j++) {
                this.createTile(currentIndex, FristBig, j, i);
                currentIndex++;
            }
        }

        // --- Outside tiles ---
        this.countX = 8; // right is 7
        this.countY = 13; // top is -12

        // Flowers
        this.createTile(106, Outside, 1, -12); // pink flower
        this.createTile(107, Outside, 2, -12); // blue flower
        this.createTile(108, Outside, 3, -12); // yellow flower
        this.createTile(109, Outside, 4, -12); // white flower 
        this.createTile(110, Outside, 6, -12); // bush
        this.createTile(111, Outside, 2, -11); // one flower
        this.createTile(112, Outside, 2, -10); // four flowers
        this.createTile(113, Outside, 4, -11); // rock + grass

        // Fence
        this.createTile(114, Outside, 4, -9); // fence top corner
        this.createTile(115, Outside, 5, -9); // fence top
        this.createTile(116, Outside, 4, -8); // fence side

        // Row of flowers
        this.createTile(117, Outside, 6, -4); // fence side
        this.createTile(118, Outside, 7, -4); // fence side

        // --- Street tiles ---
        this.countX = 29;
        this.countY = 29;
        // Bench facing left
        this.createTile(120, Street, 24, -22);
        this.createTile(121, Street, 24, -23);
        // Bench facing right
        this.createTile(122, Street, 23, -22);
        this.createTile(123, Street, 23, -23);
        // Bench aerial
        this.createTile(124, Street, 21, -22);
        this.createTile(125, Street, 22, -22);

        // --- Trees tiles ---
        // Convention: bottom to top, left to right
        this.countX = 8;
        this.countY = 16;

        // Trees (2x3)
        // Light green [144-149] - main tree 
        var currentIndex = 144; // let
        for (let i = -8; i >= -10; i--) { // bottom (trunk) -> middle (leaves) -> top
            for (let j = 6; j <= 7; j++) {
                this.createTile(currentIndex, Trees, j, i);
                currentIndex++;
            }
        }
        // Dark green [150-155]
        for (let i = -2; i >= -4; i--) { // bottom (trunk) -> middle (leaves) -> top
            for (let j = 6; j <= 7; j++) {
                this.createTile(currentIndex, Trees, j, i);
                currentIndex++;
            }
        }
        // Dark blue [156-161]
        for (let i = -5; i >= -7; i--) { // bottom (trunk) -> middle (leaves) -> top
            for (let j = 6; j <= 7; j++) {
                this.createTile(currentIndex, Trees, j, i);
                currentIndex++;
            }
        }
        // Dark blue w/ more shadows [162-168]
        for (let i = -11; i >= -13; i--) { // bottom (trunk) -> middle (leaves) -> top
            for (let j = 6; j <= 7; j++) {
                this.createTile(currentIndex, Trees, j, i);
                currentIndex++;
            }
        }
        // Short green (2x2)
        this.createTile(169, Trees, 6, -14); 
        this.createTile(170, Trees, 7, -14); 
        this.createTile(171, Trees, 6, -15); 
        this.createTile(172, Trees, 7, -15); 
                
        // Blocks of trees (5x3)
        var currentIndex = 200;
        // Dark blue [200-214]
        for (let i = -10; i >= -12; i--) { // bottom (trunk) -> middle (leaves) -> top
            for (let j = 1; j <= 5; j++) {
                this.createTile(currentIndex, Trees, j, i);
                currentIndex++;
            }
        }
        // Dark blue w/ more shadows [215-229]
        for (let i = -4; i >= -6; i--) { // bottom (trunk) -> middle (leaves) -> top
            for (let j = 1; j <= 5; j++) {
                this.createTile(currentIndex, Trees, j, i);
                currentIndex++;
            }
        }
        // Dark green [230-244]
        for (let i = -7; i >= -9; i--) { // bottom (trunk) -> middle (leaves) -> top
            for (let j = 1; j <= 5; j++) {
                this.createTile(currentIndex, Trees, j, i);
                currentIndex++;
            }
        }
        // Light green [245-259]
        for (let i = -1; i >= -3; i--) { // bottom (trunk) -> middle (leaves) -> top
            for (let j = 1; j <= 5; j++) {
                this.createTile(currentIndex, Trees, j, i);
                currentIndex++;
            }
        }

        // --- Talking sprite ---
        this.countX = 15;
        this.countY = 8;
        this.createTile(104, Sprites, 1, -7);

        // ----- Identifying walkable tiles -----
        for (let i = 0; i <= 13; i++) { // path
            this.walkable.add(i);
        }
        // Frist entrance
        this.walkable.add(21);
        this.walkable.add(22);

        // Actual tiles for level
        // this.tiles = [
        //     [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 14, 15,  4,  5,  6, 14, 15,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        //     [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 12, 13,  4,  5,  6, 12, 13,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        //     [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 10, 11,  4,  5,  6, 10, 11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        //     [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 14, 15,  4,  5,  6, 14, 15,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        //     [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 12, 13,  4,  5,  6, 12, 13,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        //     [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 10, 11,  4,  5,  6, 10, 11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        //     [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  6,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        //     [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  6,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        //     [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 14, 15,  0,  0,  0,  0,  4,  5,  6,104,  0,  0,  0, 14, 15,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        //     [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 12, 13, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 12, 13,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],  
        //     [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 10, 11, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 10, 11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],  
        //     [ 8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8],
        //     [ 5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5],
        //     [ 2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2],
        //     [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 14, 15, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 14, 15,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        //     [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 12, 13, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 12, 13,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        //     [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0, 10, 11, 93, 94, 95, 96, 97, 98, 99,100,101,102,103, 10, 11,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        //     [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  6,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        //     [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  6,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        //     [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  6,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        //     [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  6,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        //     [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  6,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        //     [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  6,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        //     [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  6,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        //     [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  6,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        //     [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  6,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        //     [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  4,  5,  6,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        // ];
        this.tiles = [
            [144,145,245,246,247,248,249,  0,  0,  0,  0,  0,  0,  0,  0,144,145,  4,  5,  6,144,145,  0,  0,  0,  0,  0,  0,  0,  0,112,215,216,217,218,219],
            [146,147,250,251,252,253,254,  0,  0,122,  0,  0,  0,  0,  0,146,147,  4,  5,  6,146,147,  0,  0,  0,  0,  0,  0,  0,  0,  0,220,221,222,223,224],
            [148,149,255,256,257,258,259,  0,  0,123,  0,  0,  0,  0,  0,148,149,  4,  5,  6,148,149,  0,  0,  0,  0,  0,  0,  0,  0,111,225,226,227,228,229],
            [144,145,230,231,232,233,234,  0,  0,  0,  0,  0,  0,  0,  0,144,145,  4,  5,  6,144,145,  0,  0,  0,  0,  0,  0,  0,  0,111,215,216,217,218,219],
            [146,147,235,236,237,238,239,  0,  0,122,  0,  0,  0,  0,  0,146,147,  4,  5,  6,146,147,  0,  0,  0,  0,  0,  0,  0,  0,  0,220,221,222,223,224],
            [148,149,240,241,242,243,244,  0,  0,123,  0,  0,  0,  0,  0,148,149,  4,  5,  6,148,149,  0,  0,  0,  0,  0,  0,  0,  0,  0,225,226,227,228,229],
            [169,170,230,231,232,233,234,  0,  7,  8,  8,  8,  8,  8,  8,  8,  8, 12,  5,  6,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,112,  0,112,112,  0,  0],
            [171,172,235,236,237,238,239,  0,  4,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  6,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,111,  0,111,112,  0],
            [169,170,240,241,242,243,244,  0,  4,  5, 11,  2,  2,  2,  2,  2,  2, 13,  5,  6,104,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,112,112,  0,  0,111],
            [171,172,169,170,169,170,  0,  0,  4,  5,  6,169,170, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26,169,170,169,170,  0,  0,111,  0,111,112,  0,112],  
            [117,118,171,172,171,172,  0,  0,  4,  5,  6,171,172, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,171,172,171,172,  0,  0,106,107,106,107,106,107],  
            [ 8,  8,   8,  8,  8,  8,  8,  8, 12,  5, 10,  8,  8, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8],
            [ 5,  5,   5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5],
            [ 2,  2,   2, 13,  5, 11,  2,  2,  2,  2,  2,  2,  2, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70,  2,  2,  13, 5, 11,  2,  2,  2,  2,  2,  2,  2],
            [117,118,110, 4,  5,  6,245,246,247,248,249,150,151, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81,144,145,  4,  5,  6, 108,109,108,109,108,109,108],   // flowers
            [150,151,110, 4,  5,  6,250,251,252,253,254,152,153, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92,146,147,  4,  5,  6, 230,231,232,233,234,108,109],   // tree row
            [152,153,110, 4,  5,  6,255,256,257,258,259,154,155, 93, 94, 95, 96, 97, 98, 99,100,101,102,103,148,149,  4,  5,  6, 235,236,237,238,239,169,170],   // short tree row
            [154,155,110, 4,  5,  6,245,246,247,248,249,150,151,116,  5,  5,  5,  5,  5,  5,  5,  5,  5,116,150,151,  4,  5,  6, 240,241,242,243,244,171,172],
            [156,157,110, 4,  5,  6,250,251,252,253,254,152,153,114,115,115,115,115,115,115,115,115,115,114,152,153,  4,  5,  6, 156,157,200,201,202,203,204],   // tree row
            [158,159,110, 4,  5,  6,255,256,257,258,259,154,155,  0,124,125,  0,  0,  0,  0,  0,124,125,  0,154,155,  4,  5,  6, 158,159,205,206,207,208,209],
            [160,161,110, 4,  5,  6,169,170,169,170,169,170,113,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,169,170,  4,  5,  6, 160,161,210,211,212,213,214],
            [162,163,110, 4,  5,  6,171,172,171,172,171,172,113,  0,  0,110,  0,  0,110,  0,  0,110,  0,  0,171,172,  4,  5,  6, 162,163,215,216,217,218,219],   // tree row
            [164,165,110, 4,  5, 10,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  8,  12, 5,  6, 164,165,220,221,222,223,224],
            [166,167,110, 4,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  5,  6, 166,167,225,226,227,228,229],
            [162,163,110, 1,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2, 13,  5, 11,  2,  2,  2,  2,  2,  2,  2,  2,  3, 162,163,215,216,217,218,219],   // tree row
            [164,165,110,169,170,169,170,169,170,169,170,169,170,169,170,169,170, 4,  5,  6,110,169,170,169,170,169,170,169,170, 164,165,220,221,222,223,224],
            [166,167,110,171,172,171,172,171,172,171,172,171,172,171,172,171,172, 4,  5,  6,110,171,172,171,172,171,172,171,172, 166,167,225,226,227,228,229],

        ];        
        this.width = this.tiles.length;
        this.height = this.tiles[0].length;

        this.createScene();


        // Create player for scene
        this.player = new Player(Frist);
        this.add(this.player.sprite);
        this.player.setPosition(this.height / 2, 1, 0);

        // Camera
        this.camera = new PerspectiveCamera();
        // Set up camera
        // this.camera.position.set(this.height / 2, 9, 1.6);
        // this.camera.lookAt(new Vector3(this.height / 2, 9, 0));
        this.camera.position.set(this.height / 2, 1, 1.6);
        this.camera.lookAt(new Vector3(this.height / 2, 1, 0));
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
                if (Math.round(playerPos.y) >= this.width - 1 ) {
                    if (this.sceneChangers.has(this.tiles[Math.round(playerPos.y + 0.3 + speed)][Math.round(playerPos.x)])) {
                        Scenes.switchScene('poe');
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
                if (Math.round(playerPos.y) <= 1) {
                    if (this.sceneChangers.has(this.tiles[Math.round(playerPos.y - speed)][Math.round(playerPos.x)])) {
                        Scenes.switchScene('nassau');
                    }
                    return;
                }
                // Update player position and camera if tile is walkable
                if (this.walkable.has(this.tiles[Math.round(playerPos.y - speed)][Math.round(playerPos.x)])) {
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
                    if (this.sceneChangers.has(this.tiles[Math.round(playerPos.y)][Math.round(playerPos.x - 0.3 + speed)])) {
                        Scenes.switchScene('prospect');
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
                if (Math.round(playerPos.x) >= this.height - 1) {
                    if (this.sceneChangers.has(this.tiles[Math.round(playerPos.y)][Math.round(playerPos.x + 0.3 + speed)])) {
                        Scenes.switchScene('garden');
                    }
                    return;
                }
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
                const map = new Maps('frist');
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
                const rewards = new Rewards('frist');
                Scenes.scenes['rewards'] = rewards;
                Scenes.switchScene('rewards');
            }
            // Dialogue event
            if (event.code === 'Space' || event.key === ' ') {
                if (this.inActionSpace(104) && !this.dialogueHappened) {
                    this.startDialogue();
                }
                if ((this.inActionSpace(32) || this.inActionSpace(31) || this.inActionSpace(33)) && Scenes.gameComplete()) {
                    Scenes.switchScene('indoors');
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
        texture.offset.x = (1 * offsetX + 0.03) / this.countX;
        texture.offset.y = (-1 *  offsetY + 0.03) / this.countY;
        texture.repeat.x = (1 - eps * 7) / this.countX;
        texture.repeat.y = (1 - eps * 7) / this.countY;
        // texture.wrapS = texture.wrapT = RepeatWrapping;

        const material = new SpriteMaterial({map: texture});

        // Add tile to tileset
        this.tileset.set(index, material);
    }
    // // Creates scene based on tiles and tile mapping
    createScene() {
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                // Set tile and set grass background
                const index = this.tiles[j][i];
                let background = new Sprite(this.tileset.get(0));

                // // Apply backgrounds
                // if (index in this.backgrounds) { // check for key 
                //     background = new Sprite(this.tileset.get(this.backgrounds[index]));
                // }

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
        cube.position.set(playerPos.x, playerPos.y + 10, 0.001);
        this.add(cube);
        var count = 0;
        this.textMesh;
        const fontLoader = new FontLoader();
        fontLoader.load(
            PixelFont,
            function(font) {
                const geometry = new TextGeometry(
                "You:\n\nHey, I need to get into Frist. What's going on?",
                    {
                        font: font,
                        size: 0.5,
                        height: 0
                    }
                );
                Scenes.scenes['frist'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                Scenes.scenes['frist'].textMesh.position.set(playerPos.x - 8.5, playerPos.y + 12, 0.1);
                // Cannot use this.add since inside new function
                Scenes.scenes['frist'].add(Scenes.scenes['frist'].textMesh);
            }
        );  
        this.dialogueContinue = (event) => {
            if (event.key !== ' ') return;
            if (count >= 7) {
                this.remove(Scenes.scenes['frist'].textMesh);  
                this.remove(cube);
                window.addEventListener('keydown', this.move, false);
                window.removeEventListener('keydown', this.dialogueContinue, false); 
            }
            else if (count === 0){
                Scenes.scenes['frist'].remove(Scenes.scenes['frist'].textMesh);  
                fontLoader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry(
                        "Random Dude With Blue Hair:\n\nCHRISTOPHER NOLAN IS FILMING IN FRIST\nTODAY!!",
                            {
                                font: font,
                                size: 0.5,
                                height: 0
                            }
                        );
                        Scenes.scenes['frist'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                        Scenes.scenes['frist'].textMesh.position.set(playerPos.x - 8.5, playerPos.y + 12, 0.1);
                        // Cannot use this.add since inside new function
                        Scenes.scenes['frist'].add(Scenes.scenes['frist'].textMesh);
                    }
                );  
            }
            else if (count === 1){
                Scenes.scenes['frist'].remove(Scenes.scenes['frist'].textMesh);  
                fontLoader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry(
                        "You:\n\nToday?!? I left my signed picture of Felix\nHeide in there! How do I get in?",
                            {
                                font: font,
                                size: 0.5,
                                height: 0
                            }
                        );
                        Scenes.scenes['frist'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                        Scenes.scenes['frist'].textMesh.position.set(playerPos.x - 8.5, playerPos.y + 12, 0.1);
                        // Cannot use this.add since inside new function
                        Scenes.scenes['frist'].add(Scenes.scenes['frist'].textMesh);
                    }
                );  
            }
            else if (count === 2){
                Scenes.scenes['frist'].remove(Scenes.scenes['frist'].textMesh);  
                fontLoader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry(
                        "Still Has Blue Hair:\n\nWell, Christopher Nolan said he needed some\nmaterials, so maybe if you got those you could get\nin.",
                            {
                                font: font,
                                size: 0.5,
                                height: 0
                            }
                        );
                        Scenes.scenes['frist'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                        Scenes.scenes['frist'].textMesh.position.set(playerPos.x - 8.5, playerPos.y + 12, 0.1);
                        // Cannot use this.add since inside new function
                        Scenes.scenes['frist'].add(Scenes.scenes['frist'].textMesh);
                    }
                );  
            }
            else if (count === 3){
                Scenes.scenes['frist'].remove(Scenes.scenes['frist'].textMesh);  
                fontLoader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry(
                        "You:\n\nWhat materials?",
                            {
                                font: font,
                                size: 0.5,
                                height: 0
                            }
                        );
                        Scenes.scenes['frist'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                        Scenes.scenes['frist'].textMesh.position.set(playerPos.x - 8.5, playerPos.y + 12, 0.1);
                        // Cannot use this.add since inside new function
                        Scenes.scenes['frist'].add(Scenes.scenes['frist'].textMesh);
                    }
                );  
            }
            else if (count === 4){
                Scenes.scenes['frist'].remove(Scenes.scenes['frist'].textMesh);  
                fontLoader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry(
                        "Blue Hair Man:\n\nHe said he needed a brick, a non-alcoholic water,\nand a wet 1975 gold-plated coin uncirculated\nwithout mint marking.",
                            {
                                font: font,
                                size: 0.5,
                                height: 0
                            }
                        );
                        Scenes.scenes['frist'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                        Scenes.scenes['frist'].textMesh.position.set(playerPos.x - 8.5, playerPos.y + 12, 0.1);
                        // Cannot use this.add since inside new function
                        Scenes.scenes['frist'].add(Scenes.scenes['frist'].textMesh);
                    }
                );  
            }
            else if (count === 5){
                Scenes.scenes['frist'].remove(Scenes.scenes['frist'].textMesh);  
                fontLoader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry(
                        "You:\n\nUmmmm, what movie is this for exactly?",
                            {
                                font: font,
                                size: 0.5,
                                height: 0
                            }
                        );
                        Scenes.scenes['frist'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                        Scenes.scenes['frist'].textMesh.position.set(playerPos.x - 8.5, playerPos.y + 12, 0.1);
                        // Cannot use this.add since inside new function
                        Scenes.scenes['frist'].add(Scenes.scenes['frist'].textMesh);
                    }
                );  
            }
            else if (count === 6){
                Scenes.scenes['frist'].remove(Scenes.scenes['frist'].textMesh);  
                fontLoader.load(
                    PixelFont,
                    function(font) {
                        const geometry = new TextGeometry(
                        "Blue Hair Man:\n\nI think it's called Floppenheimer?\nAnyways, good luck!",
                            {
                                font: font,
                                size: 0.5,
                                height: 0
                            }
                        );
                        Scenes.scenes['frist'].textMesh = new Mesh(geometry, new MeshPhongMaterial({color: 0xffffff}));
                        Scenes.scenes['frist'].textMesh.position.set(playerPos.x - 8.5, playerPos.y + 12, 0.1);
                        // Cannot use this.add since inside new function
                        Scenes.scenes['frist'].add(Scenes.scenes['frist'].textMesh);
                    }
                );  
            }
            count++;
        }
        window.removeEventListener('keydown', this.move, false);
        window.addEventListener('keydown', this.dialogueContinue, false); 
        this.dialogueHappened = true;
        // Allow user to switch maps once dialogue completed
        this.sceneChangers.add(2);
        this.sceneChangers.add(4);
        this.sceneChangers.add(5);
        this.sceneChangers.add(6);
        this.sceneChangers.add(8);
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

export default Frist;
