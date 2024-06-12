import { actor } from "./actor.mjs";
import { Container, Sprite, Texture } from "./pixi.mjs";
import { Vector2 } from "./vector.mjs";

class Cursor {
    constructor() {
        this.container = new Container();
        this.wheel = 0;
        this.timer;
    }

    init() {
        this.sprite = new Sprite(Texture.from('mouse'));
        this.sprite.anchor.set(0.15, 0);

        this.location = new Sprite(Texture.from('place'));
        this.location.anchor.set(0.5, 0.75);
        this.location.tScale = 0;
        this.container.addChild(this.sprite);
    }

    update(time) {
        let vCursor_Actor = new Vector2(this.location.x - actor.position.x, this.location.y - actor.position.y);
        let nScale = Math.sin(time.lastTime / 100) * 0.1;
        this.sprite.scale.set(1 + nScale)
        this.location.scale.set((1 + nScale) * 0.1 * (vCursor_Actor.length() > 0.1))
    }
}

function setInteractive(sprite, size, func) {
    sprite.eventMode = 'static';
    sprite
        .on('pointerdown', func)
        .on('pointerup', () => { sprite.scale.set(size[1]) })
        .on('pointerupoutside', () => { sprite.scale.set(size[0]) })
        .on('pointerover', () => { sprite.scale.set(size[1]) })
        .on('pointerout', () => { sprite.scale.set(size[0]) })
        .on('pointermove', (e) => {
            cursor.container.x = e.global.x;
            cursor.container.y = e.global.y;
        });
}
const cursor = new Cursor();

export { cursor, setInteractive }