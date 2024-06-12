import { Container, Graphics, Text, Sprite, Texture } from "./pixi.mjs";
import { setInteractive } from './mouse.mjs';
import { actor } from './actor.mjs';
import { cursor } from "./mouse.mjs";
import { global } from "./global.mjs";
import { itemList, itemsEvent } from "./gameData/itemsData.mjs";

class Inventory {
    constructor() {
        this.container = new Container();
        this.itemsContainer = new Container();
        this.items = [];

        this.background = new Graphics();
        this.background.eventMode = 'static';
        this.background.on('pointermove', (e) => {
            cursor.container.x = e.global.x;
            cursor.container.y = e.global.y;
        });

        this.targetMoney = 0;

        this.sizeWH = { x: (80 * 8 + 10), y: (80 * 2 + 10) }
        this.container.x = 1920 - this.sizeWH.x - 5;
        this.container.y = 1080 - this.sizeWH.y - 10;
    }

    init() {
        //繪製背景及欄位
        this.background.roundRect(0, 0 + 5, this.sizeWH.x, this.sizeWH.y, 15);
        this.background.fill(0xFF8000);
        this.background.roundRect(0, 0, this.sizeWH.x, this.sizeWH.y, 15);
        this.background.fill(0x101010);

        this.background.roundRect(this.sizeWH.x - 300, -70 + 5, 300, 60, 15);
        this.background.fill(0xFF8000);
        this.background.roundRect(this.sizeWH.x - 300, -70, 300, 60, 15);
        this.background.fill(0x101010);
        this.background.roundRect(this.sizeWH.x - 300 + 5, -70 + 5, 300 - 10, 60 - 10, 15);
        this.background.fill(0xFCFCFC);

        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 2; y++) {
                this.background.roundRect(x * 80 + 5 + 2, y * 80 + 5 + 2, 76, 76, 10);
                this.background.fill(0xD0D0D0);
            }
        }
        this.itemsContainer.x = 5;
        this.itemsContainer.y = 5;

        //繪製金錢資訊
        this.coinSprite = new Sprite(Texture.from('dollar'))
        this.coinSprite.anchor.set(0.5);
        this.coinSprite.scale.set(0.08);
        this.coinSprite.x = 600;
        this.coinSprite.y = -40;

        this.moneyInfo = new Text({ resolution: 2 })
        this.moneyInfo.x = 570;
        this.moneyInfo.y = -40;
        this.moneyInfo.anchor.set(1, 0.5);
        this.moneyInfo.style = global.styleMoney;

        this.container.addChild(
            this.background,
            this.moneyInfo,
            this.coinSprite,
            this.itemsContainer
        );
    }

    refreshItems() {
        this.itemsContainer.removeChildren();
        for (let i = 0; i < actor.items.length; i++) {
            let id = actor.items[i].id;
            let num = actor.items[i].num;
            let item = itemList[id];
            //console.log(item.name);

            let newX = i % 8;
            let newY = Math.floor(i / 8);

            let itemCon = new Container();
            let sprite = new Sprite(Texture.from(item.img));
            sprite.anchor.set(0.5);
            sprite.scale.set(0.10);

            let numText = new Text({ resolution: 2 });
            numText.anchor.set(1, 0)
            numText.x = 30;
            numText.y = 10;
            numText.style = global.styleNumber;
            numText.text = num;

            setInteractive(itemCon, [1, 1.1], () => { this.useItemOnSlot(i) })

            itemCon.x = newX * 80 + 40;
            itemCon.y = newY * 80 + 40;

            itemCon.addChild(sprite, numText);
            this.itemsContainer.addChild(itemCon);
        }
    }

    useItemOnSlot(slot) {
        let id = actor.items[slot].id;
        let item = itemList[id];

        let func = itemsEvent[item.event];
        if (func) { func(); }

        actor.items[slot].num -= 1;
        if (actor.items[slot].num == 0) {
            actor.items.splice(slot, 1);
        }
        this.refreshItems();
    }

    update(time) {
        this.targetMoney = global.animateToTarget(this.targetMoney, actor.money);
        this.moneyInfo.text = Math.floor(this.targetMoney);
    }
}

const inventory = new Inventory();

export { inventory }