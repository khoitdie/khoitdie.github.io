import { Container, Sprite, Texture, Text, TextStyle, Rectangle, Graphics } from "./pixi.mjs";
import { cursor, setInteractive } from "./mouse.mjs";
import { global } from "./global.mjs";
import { dialogsData, dialogsProfile } from "./gameData/dialogData.mjs";
import { diolagsEvent } from "./gameData/eventData.mjs";

class MessageWindow {
    constructor() {
        this.count = 0;

        this.showText = "";
        this.showIndex = 0;

        this.container = new Container();
        this.container.x = 680 - 150
        this.container.y = 1080 - 5
        this.container.tScale = 0;
        this.container.scale.set(0);

        this.interval = undefined;

        this.diolags = [];
        this.chatting = false;

        this.waiting = false;
        this.isOption = false;

    }

    async init() {
        this.messageTXT = new Text({ resolution: 2 })
        this.messageTXT.x = -500 + 80;
        this.messageTXT.y = -200 + 60;
        this.messageTXT.style = global.styleMessage;

        this.windowIMG = new Graphics();
        this.windowIMG.roundRect(1000 / -2, -170, 1000, 170, 20);
        this.windowIMG.fill(0xFF8000);
        this.windowIMG.roundRect(1000 / -2, -170 - 5, 1000, 170, 20);
        this.windowIMG.fill(0xFCFCFC);
        this.windowIMG.roundRect(1000 / -2 + 5, -170 - 5 + 5, 1000 - 10, 170 - 10, 20);
        this.windowIMG.fill(0x101010);

        //Name
        this.windowIMG.roundRect(-450, -150 - 70, 250, 70, 20);
        this.windowIMG.fill(0xFCFCFC);
        this.windowIMG.roundRect(-450, -150 - 70, 250, 70 - 5, 20);
        this.windowIMG.fill(0xFF8000);

        this.windowIMG.eventMode = 'static';
        this.windowIMG.cursor = 'pointer';
        this.windowIMG.hitArea = new Rectangle(-4000, -4000, 8000, 8000);
        this.windowIMG
            .on('pointerdown', () => {
                this.nextText();
            })

            .on('pointermove', (e) => {
                cursor.container.x = e.global.x;
                cursor.container.y = e.global.y;
            });

        //角色名稱
        this.profileText = new Text({ resolution: 2 });
        this.profileText.anchor.set(0.5)
        this.profileText.x = -330;
        this.profileText.y = -185;
        this.profileText.style = global.styleA;

        //角色頭像
        this.profileIMG = new Sprite();
        this.profileIMG.anchor.set(0.5, 1);
        this.profileIMG.scale.set(0.5);
        this.profileIMG.x = -300;
        this.profileIMG.y = -150;

        this.optionWindow = new OptionsWindow();

        this.container.addChild(
            this.profileIMG,
            this.windowIMG,
            this.messageTXT,
            this.profileText,
            this.optionWindow.container
        );
    }
    nextText() {
        if (this.chatting && !this.waiting && !this.isOption) {
            this.chatting = false;
            if (this.diolags.length <= 0) {
                this.container.tScale = 0;
            }
        }
    }

    addText(inputText) {
        if (Array.isArray(inputText)) {
            inputText.forEach(t => {
                this.diolags.push(t);
            });
        } else {
            this.diolags.push(inputText);
        }
    }

    renderText(text, wait) {
        clearInterval(this.interval)

        this.showIndex = 0;
        this.showText = text;
        this.messageTXT.text = "";
        this.chatting = true;
        this.waiting = wait;

        this.interval = setInterval(() => {
            this.messageTXT.text += this.showText[this.showIndex];
            this.showIndex++;

            if (this.showIndex >= this.showText.length) {
                clearInterval(this.interval);
                this.waiting = false;
            }
        }, 50)
    }

    update(time) {
        let nsA = this.container.scale.x + (this.container.tScale - this.container.scale.x) / 2;
        this.container.scale.set(nsA);

        if (this.diolags.length > 0 && !this.chatting) {
            this.container.tScale = 1;
            let textData = this.diolags.shift(); //去除陣列第一元素，且回傳被去除的元素。

            if (Array.isArray(textData)) {
                this.isOption = true;
                this.optionWindow.setOptions(textData);
                //當他是陣列時，顯示選項。

            } else {
                let showText = textData.text
                showText = typeof showText == 'function' ? showText() : showText;
                if (textData.event != undefined) { diolagsEvent[textData.event](); } //增加對話事件

                this.profileText.text = dialogsProfile[textData.profile].name;
                this.profileIMG.texture = Texture.from(dialogsProfile[textData.profile].img);
                let iswait = showText.includes("(wait)");
                showText = showText.replace("(wait)", "")
                this.renderText(showText, iswait);
            }
        }
    }
}

const messagewindow = new MessageWindow();

class OptionsWindow {
    constructor() {
        this.container = new Container();
        this.container.x = 300;
    }

    setOptions(array) {
        let num = array.length;
        this.container.y = -90 * Math.ceil(num / 2) - 140;

        for (let i = 0; i < num; i++) {
            let optionsContainer = new Container();
            let ny = Math.floor(i / 2) * 90
            optionsContainer.x = i % 2 * 320 - 270;
            optionsContainer.y = ny;

            let optionBG = new Graphics();
            optionBG.roundRect(-150, -35, 300, 70, 20);
            optionBG.fill(0xFF8000);
            optionBG.roundRect(-150, -35 - 5, 300, 70, 20);
            optionBG.fill(0x101010);
            optionBG.stroke({ width: 3, color: 0xffffff });
            optionBG.roundRect(-140, -35 - 5, 280, 35, 20);
            optionBG.fill({ color: 0xffffff, alpha: 0.2 });

            let optionText = new Text({ resolution: 2 });
            optionText.anchor.set(0.5);
            optionText.text = array[i].text;
            optionText.y = -5;
            optionText.style = global.styleSize(25)

            optionsContainer.addChild(
                optionBG,
                optionText
            );

            this.container.addChild(optionsContainer)

            optionsContainer.eventMode = 'static';
            optionsContainer
                .on('pointerdown', () => { optionText.tint = 0xFF8000; this.hanldeOption(array[i]) })
                .on('pointerup', () => { optionsContainer.y = ny })
                .on('pointerupoutside', () => { optionsContainer.y = ny })
                .on('pointerover', () => { optionsContainer.y = ny - 3 })
                .on('pointerout', () => { optionsContainer.y = ny })
                .on('pointermove', (e) => {
                    cursor.container.x = e.global.x;
                    cursor.container.y = e.global.y;
                });
        }
    }

    hanldeOption(option) {
        //延遲一下選項消失
        this.container.children.forEach(optionsContainer => {
            optionsContainer.eventMode = 'passive'
        });

        setTimeout(() => {
            console.log(option.text);
            messagewindow.isOption = false;
            messagewindow.chatting = true;

            if (option.nextDialogs != undefined) {
                messagewindow.addText(dialogsData[option.nextDialogs])
            }

            if (option.event != undefined) {
                let func = diolagsEvent[option.event];
                func();
            }

            messagewindow.nextText();
            this.container.removeChildren();
        }, 500);
    }

}

export { messagewindow }