import { Container, Graphics, Sprite, Texture } from "../pixi.mjs"
import { cursor, setInteractive } from '../mouse.mjs';
import { actor } from '../actor.mjs';
import { MathM } from '../math.mjs';
import { audio, global } from "../global.mjs";
import { Vector2 } from "../vector.mjs";

class GameMap {
    constructor(id) {
        this.container = new Container();
        this.background = new Graphics();
        this.container.addChild(this.background);
        this.spawnCoins = [];
        this.init()
    }

    init() {
        this.background.rect(0, 0, 5000, 5000);
        this.background.fill(0x5CADAD);
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
                cursor.location.zIndex = hitPosY;
                cursor.location.tScale = 1;
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
        for (let i = 0; i < 5000; i++) {
            let dollar = new Sprite(Texture.from('dollar'));
            dollar.x = MathM.rangeInt(50, 5000 - 50);
            dollar.y = MathM.rangeInt(50, 5000 - 50);
            dollar.targetX = dollar.x;
            dollar.targetY = dollar.y;

            dollar.anchor.set(0.5, 1);
            dollar.scale.set(0.1);
            this.spawnCoins[i] = dollar;
            this.container.addChild(dollar);
            /*
            setInteractive(dollar, [0.1, 0.105], (e) => {
                if (!global.interactable) return;
                if (e.data.button != 0) return;
                actor.money += MathM.rangeInt(5, 100);
                this.container.removeChild(dollar)
            })*/
        }
    }

    update(time) {
        this.spawnCoins = this.spawnCoins.filter(coins => {
            let distance = new Vector2(actor.position.x - coins.x, actor.position.y - coins.y).length();
            if (distance < 20) {
                this.container.removeChild(coins);
                actor.money += MathM.rangeInt(20, 20);
                audio.coins[audio.index % audio.coins.length].play()
                audio.index++;
                return false; // 不將此coin包含在新陣列中
            } else {
                if(distance < 250) {
                    coins.targetX = actor.position.x;
                    coins.targetY = actor.position.y;
                }
                coins.zIndex = coins.y;
                let moveSpeed = Math.max(15 / distance, 0.1);
                coins.x = global.animateToTarget(coins.x, coins.targetX, moveSpeed);
                coins.y = global.animateToTarget(coins.y, coins.targetY, moveSpeed);
                return true; // 將此coin包含在新陣列中
            }
        });
        
        //地圖跟著角色移動
        this.container.x = -actor.position.x + 1920 / 2;
        this.container.y = -actor.position.y + 1080 / 2;
        //this.container.x = Math.max(Math.min(-actor.position.x + 640, 0), -5000 + 1280);
        //this.container.y = Math.max(Math.min(-actor.position.y + 360, 0), -5000 + 720);
        this.container.sortDirty = true;
    }
}

export { GameMap }