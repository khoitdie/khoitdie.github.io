import { Container, Graphics, Text, TextStyle } from "./pixi.mjs";

const fstyle = new TextStyle({
    fontFamily: 'Microsoft JhengHei',
    fontSize: 14,
    fill: 0xE0E0E0,
});

class TextInput {
    constructor(key) {
        this.container = new Container();
        this.background = new Graphics();
        this.background.roundRect(-37, -15, 74, 30+70, 2);
        this.background.fill(0x000000, 0.01);

        this.background.roundRect(-35, -15, 70, 30, 2);
        this.background.fill(0x000000, 0.2);

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