import { Container, Graphics, Sprite, Texture } from "../pixi.mjs"
import { cursor, setInteractive } from '../mouse.mjs';
import { actor } from '../actor.mjs';
import { MathM } from '../math.mjs';
import { global } from "../global.mjs";

class GameMapShop {
    constructor(id) {
        this.container = new Container();
        this.background = new Graphics();
        this.container.addChild(this.background);
        this.init();
    }

    init() {
        this.background.rect(0, 0, 5000, 5000);
        this.background.fill(0x95CACA);
        this.spawnTree();
        this.spawnItem();
    }

    setActor() {
        setInteractive(this.background, [1, 1],
            (e) => {
                if (!global.interactable) return;
                if (e.data.button != 2) return;
                let backgroundPos = e.data.getLocalPosition(this.background);
                let hitPosX = Math.max(Math.min(backgroundPos.x, 5000 - 50), 50);
                let hitPosY = Math.max(Math.min(backgroundPos.y, 5000 - 50), 50);
                cursor.location.x = hitPosX;
                cursor.location.y = hitPosY;
                cursor.location.tScale = 1;
                cursor.location.zIndex = hitPosY;
                actor.targetPos.x = hitPosX;
                actor.targetPos.y = hitPosY;
            }
        )
        this.container.addChild(actor.container, cursor.location);
    }

    spawnTree() {
        for (let i = 0; i < 500; i++) {
            let tree = new Sprite(Texture.from('tree'));
            tree.x = MathM.rangeInt(50, 5000 - 50);
            tree.y = MathM.rangeInt(50, 5000 - 50);
            tree.zIndex = tree.y;
            tree.anchor.set(0.5, 1);
            tree.scale.set(0.25);
            this.container.addChild(tree);
        }
    }

    spawnItem() {
        for (let i = 0; i < 500; i++) {
            let dollar = new Sprite(Texture.from('dollar'));
            dollar.x = MathM.rangeInt(50, 5000 - 50);
            dollar.y = MathM.rangeInt(50, 5000 - 50);
            dollar.zIndex = dollar.y;
            dollar.anchor.set(0.5, 1);
            dollar.scale.set(0.1);
            this.container.addChild(dollar);
            setInteractive(dollar, [0.1, 0.105], (e) => {
                if (!global.interactable) return;
                if (e.data.button != 0) return;
                this.container.removeChild(dollar)
            })
        }
    }

    update(time) {
        //地圖跟著角色移動
        this.container.x = -actor.position.x + 1920 / 2;
        this.container.y = -actor.position.y + 1080 / 2;
        this.container.sortDirty = true;
    }
}

export { GameMapShop }