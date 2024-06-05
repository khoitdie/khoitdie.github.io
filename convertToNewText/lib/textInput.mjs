import { Container, Graphics, Text, TextStyle } from "./pixi.mjs";

const fstyle = new TextStyle({
    fontFamily: 'Microsoft JhengHei',
    fontSize: 14,
    fill: 0xffffff,
});

class TextInput {
    constructor(key) {
        this.container = new Container();
        this.background = new Graphics();
        this.background.roundRect(-35, -15, 70, 30, 2);
        this.background.fill(0x4F4F4F);

        this.background.roundRect(-35, 15, 70, 70, 2);
        this.background.fill(0x000000);

        this.showText = new Text();
        this.showText.anchor.set(0, 0.5);
        this.showText.x = -25;
        this.showText.style = fstyle;

        this.container.addChild(this.background, this.showText);

        this.keyid = key;
    }
}

export { TextInput }