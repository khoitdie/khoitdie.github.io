import { Container, Graphics, Text, TextStyle } from "./pixi.mjs";

const fstyle = new TextStyle({
    fontFamily: 'Microsoft JhengHei',
    fontSize: 14,
    fill: 0xE0E0E0,
});

const bstyle = new TextStyle({
    fontFamily: 'YurenMystery',
    fontSize: 45,
    fill: 0xffffff,
});


class TextInput {
    constructor(key) {
        this.container = new Container();
        this.background = new Graphics();
        this.background.roundRect(-37, -15, 74, 30 + 70, 2);
        this.background.fill({ color: 0x000000, alpha: 0.01 });

        this.background.roundRect(-35, -15, 70, 30, 2);
        this.background.fill({ color: 0x000000, alpha: 0.2 });

        this.background.roundRect(-35, 15, 70, 70, 2);
        this.background.fill(0x000000);

        this.showText = new Text();
        this.showText.anchor.set(0, 0.5);
        this.showText.x = -25;
        this.showText.style = fstyle;

        this.textShow = new Text();
        this.textShow.anchor.set(0.5);
        this.textShow.y = 45;
        this.textShow.style = bstyle;

        this.container.addChild(this.background, this.showText, this.textShow);

        this.keyid = key;
    }
}

export { TextInput }