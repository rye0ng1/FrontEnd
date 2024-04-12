import { IPosition } from "@constants/position";
import { TScenes } from "@constants/scenes";
import { Scene } from "phaser";

class BaseScene extends Scene {
    key: TScenes;
    layers!: Phaser.Tilemaps.TilemapLayer[];
    prevSceneKey?: TScenes;
    nextSceneKey?: TScenes;
    transition!: boolean;
    keyboard!: {
        cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys | undefined;
        isUp: boolean | undefined;
        isDown: boolean | undefined;
        isLeft: boolean | undefined;
        isRight: boolean | undefined;
    };
    withTSAnimation?: boolean;
    map!: Phaser.Tilemaps.Tilemap;
    tileset!: Phaser.Tilemaps.Tileset;
    // tilesetAnimation!: TilesetAnimation;

    constructor(key: TScenes) {
        super({ key });
        this.key = key;
    }

    init(position: IPosition) {
        this.scene.setVisible(false, this.key);
        // this.player = new Player(this, this.key, position);
        this.layers = [];
        this.prevSceneKey = this.key;
        this.transition = true;
        this.input.keyboard!.removeAllListeners();
    }

    initKeyboard() {
        const cursorKeys = this.input.keyboard?.createCursorKeys();

        this.keyboard = {
            cursorKeys,
            isUp: cursorKeys?.up?.isDown,
            isDown: cursorKeys?.down?.isDown,
            isLeft: cursorKeys?.left?.isDown,
            isRight: cursorKeys?.right?.isDown,
        };
    }

    create(tilemap: string, tileset: string, withTSAnimation: boolean) {
        this.withTSAnimation = withTSAnimation;
        this.map = this.add.tilemap(tilemap);
        this.tileset = this.map.addTilesetImage(tileset)!;

        this.layers = this.map.layers.map((layer) => {
            return this.map.createLayer(layer.name, this.tileset, 0, 0)!;
        });

        // this.player.create();

        this.cameras.main.setBackgroundColor("#222");
        // this.cameras.main.on('camerafadeincomplete', () => {
        //     this.transition = false;

        //     this.input.keyboard.on('keyup', (event: { keyCode: number }) => {
        //       if (event.keyCode >= 37 && event.keyCode <= 40) {
        //         this.player.stop();
        //       }
        //     });

        //     this.registerCollision();
        //   });

        this.initKeyboard();
        this.cameras.main.on(
            "camerafadeoutcomplete",
            this.changeScene.bind(this)
        );
    }

    changeScene() {
        // if (this.withTSAnimation) this.tilesetAnimation.destroy();

        // this.player.socket.disconnect();
        this.scene.start(this.nextSceneKey, this.prevSceneKey as Object);
    }

    registerCollision() {
        throw new Error("registerCollision() not implemented");
    }
}