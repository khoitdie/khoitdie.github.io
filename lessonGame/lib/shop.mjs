import { Container, Graphics, Text, Sprite, TextStyle, Texture, Rectangle } from "./pixi.mjs";
import { setInteractive } from './mouse.mjs';
import { actor } from './actor.mjs';
import { cursor } from "./mouse.mjs";
import { messagewindow } from "./windows.mjs";
import { global } from "./global.mjs";
import { inventory } from "./inventory.mjs";
import { itemList } from "./gameData/itemsData.mjs";

const shopItems = [
    { id: 0, num: 10 },
    { id: 0, num: 8 },
    { id: 1, num: 7 },
    { id: 3, num: 10 },
    { id: 2, num: 5 },
    { id: 4, num: 2 },
    { id: 5, num: 1 },
    { id: 0, num: 10 },
    { id: 0, num: 8 },
    { id: 1, num: 7 },
    { id: 3, num: 10 },
    { id: 2, num: 5 },
    { id: 4, num: 2 },
    { id: 5, num: 1 },
]

const shopMaxNum = 8;
class Shop {
    constructor() {
        this.items = [];//商店內物品
        this.targetMoney = 0;
        this.scrollY = 0;

        this.container = new Container();//整體Container: Shop + Icon
        this.shopContainer = new Container();//Shop Container
        this.innerContainer = new Container();//處理內部卷軸區域
        this.itemsContainer = new Container();//放所有items

        this.shopContainer.scale.set(0);
        this.container.addChild(this.shopContainer);

        this.background = new Graphics();
        this.background.eventMode = 'static';
        this.background.hitArea = new Rectangle(-4000, -4000, 8000, 8000);

        this.mask = new Graphics();

        this.background.on('pointermove', (e) => {
            cursor.container.x = e.global.x;
            cursor.container.y = e.global.y;
        });

        this.background.on('pointerdown', (e) => {
            messagewindow.nextText();
            if (e.data.button == 2) {
                this.shopContainer.scale.set(0);
            }
        });

        this.init();
    }

    init() {
        this.sizeWH = { x: (640 + 10), y: (80 * shopMaxNum + 10) }
        this.shopContainer.x = 1920 - this.sizeWH.x - 5;
        this.shopContainer.y = 5;

        //繪製背景及欄位
        this.background.roundRect(0, 0 + 5, this.sizeWH.x, this.sizeWH.y + 100, 15);
        this.background.fill(0xFF8000);
        this.background.roundRect(0, 0, this.sizeWH.x, this.sizeWH.y + 100, 15);
        this.background.fill(0x101010);

        //繪製內部區域
        this.background.roundRect(5, 100, this.sizeWH.x - 10, this.sizeWH.y - 10, 10);
        this.background.fill(0x5B5B5B);

        this.mask.roundRect(0, 0, this.sizeWH.x, this.sizeWH.y - 10, 0);
        this.mask.fill(0x5B5B5B);

        this.innerContainer.y = 100;
        this.innerContainer.mask = this.mask;

        this.titleIcon = new Sprite(Texture.from('shopping-cart'));
        this.titleIcon.anchor.set(0.5);
        this.titleIcon.scale.set(0.1);
        this.titleIcon.x = 45;
        this.titleIcon.y = 50;

        this.moreUp = new Graphics();
        this.moreUp.roundRect(-60, 0 + 4, 120, 20, 5);
        this.moreUp.fill(0x101010);
        this.moreUp.roundRect(-60, 0, 120, 20, 5);
        this.moreUp.fill(0x3C3C3C);
        this.moreUp.poly([-10, 15, 0, 5, 10, 15]);
        this.moreUp.fill(0xFF8000);
        this.moreUp.x = this.sizeWH.x / 2;
        this.moreUp.y = 100 - 20;

        this.moreDown = new Graphics();
        this.moreDown.roundRect(-60, -20 + 4, 120, 20, 5);
        this.moreDown.fill(0x101010);
        this.moreDown.roundRect(-60, -20, 120, 20, 5);
        this.moreDown.fill(0x3C3C3C);
        this.moreDown.poly([-10, -15, 0, -5, 10, -15]);
        this.moreDown.fill(0xFF8000);
        this.moreDown.x = this.sizeWH.x / 2;
        this.moreDown.y = this.sizeWH.y + 100 + 5;

        //繪製金錢資訊
        this.shopInfo = new Text({ resolution: 2 })
        this.shopInfo.x = 80;
        this.shopInfo.y = 22;
        this.shopInfo.style = global.styleSize(40);
        this.shopInfo.text = '雜貨店'

        this.shopContainer.addChild(
            this.background,
            this.titleIcon,
            this.shopInfo,
            this.innerContainer,
            this.moreUp,
            this.moreDown,
        );

        this.innerContainer.addChild(this.mask, this.itemsContainer);
        this.resetItems();
        this.setShopIcon();
    }

    //設置商店按鈕
    setShopIcon() {
        this.shopIconCon = new Container();
        this.shopBG = new Graphics();
        this.shopBG.circle(0, 0 + 5, 30);
        this.shopBG.fill(0xFF8000);
        this.shopBG.circle(0, 0, 30);
        this.shopBG.fill(0x101010);

        this.shopIcon = new Sprite(Texture.from('shopping-cart'));
        this.shopIcon.anchor.set(0.5);
        this.shopIcon.scale.set(0.08);

        this.shopIconCon.addChild(this.shopBG, this.shopIcon);
        this.shopIconCon.position.set(1920 - 350, 860);
        this.container.addChild(this.shopIconCon);

        this.shopIconCon.eventMode = 'static';
        this.shopIconCon
            .on('pointermove', (e) => {
                cursor.container.x = e.global.x;
                cursor.container.y = e.global.y;
            })
            .on('pointerdown', (e) => {
                this.shopContainer.scale.set(this.shopContainer.scale.x == 0);
                this.refreshAllItems();
            })
            .on('pointerup', () => {
                this.shopIconCon.scale.set(1);
                this.shopIcon.tint = 0xff8000;
            })
            .on('pointerupoutside', () => {
                this.shopIconCon.scale.set(1);
                this.shopIcon.tint = 0xffffff;
            })
            .on('pointerover', () => {
                this.shopIconCon.scale.set(1.05)
                this.shopIcon.tint = 0xff8000;
            })
            .on('pointerout', () => {
                this.shopIconCon.scale.set(1);
                this.shopIcon.tint = 0xffffff;
            })
    }

    //繪製全部物品資訊
    refreshAllItems() {
        //將捲動值重置
        this.scrollY = 5;
        this.itemsContainer.y = 5;

        this.itemsContainer.removeChildren();
        this.items = [];

        for (let i = 0; i < shopItems.length; i++) {
            this.items[i] = new Container();
            this.items[i].x = 0;
            this.items[i].y = i * 80;
            this.itemsContainer.addChild(this.items[i]);
            this.refreshItem(i)
        }
    }

    //繪製物品資訊
    refreshItem(i) {
        this.items[i].removeChildren();

        let id = shopItems[i].id;
        let item = itemList[id];

        let itemBG = new Graphics();
        itemBG.roundRect(15, 0 + 5, this.sizeWH.x - 30, 70, 10);
        itemBG.fill(0x4F4F4F);
        itemBG.roundRect(15, 0, this.sizeWH.x - 30, 70, 10);
        itemBG.fill(shopItems[i].num > 0 ? 0xFFFFFF : 0x8E8E8E);
        itemBG.tint = 0xBEBEBE

        let sprite = new Sprite(Texture.from(item.img));
        sprite.anchor.set(0.5);
        sprite.scale.set(0.1);
        sprite.x = 100;
        sprite.y = 35;

        let name = new Text({ resolution: 2 });
        name.anchor.set(0, 0.5)
        name.x = 160;
        name.y = 35;
        name.style = global.styleA;
        name.text = item.name;

        let buyButton = new Graphics();
        buyButton.roundRect(-60, -25 + 5, 120, 50, 20);
        buyButton.fill(0x4F4F4F);
        buyButton.roundRect(-60, -25, 120, 50, 20);
        buyButton.fill(shopItems[i].num > 0 ? 0xFF8000 : 0x7B7B7B);
        buyButton.x = 450;
        buyButton.y = 35;

        let price = new Text({ resolution: 2 });
        price.anchor.set(0.5)
        price.x = 450;
        price.y = 35;
        price.style = global.styleA;
        price.text = `$ ${item.price}`;

        let stock = new Text({ resolution: 2 });
        stock.anchor.set(0, 0.5)
        stock.x = 550;
        stock.y = 35;
        stock.style = global.styleA;
        stock.text = `：${shopItems[i].num}`;

        if (shopItems[i].num > 0) setInteractive(buyButton, [1, 1.05], (e) => { if (e.data.button != 0) return; this.buyItem(i) })

        itemBG.eventMode = shopItems[i].num > 0 ? 'static' : 'passive'; //物品數量為0時，取消互動事件
        itemBG
            .on('pointerdown', () => { messagewindow.nextText(); })
            .on('pointerover', () => { itemBG.tint = 0xE0E0E0 })
            .on('pointerout', () => { itemBG.tint = 0xBEBEBE })
            .on('pointermove', (e) => {
                cursor.container.x = e.global.x;
                cursor.container.y = e.global.y;
            });

        this.items[i].addChild(itemBG, sprite, name, buyButton, price, stock);
    }

    resetItems() {

    }

    //處理購買物品
    buyItem(i) {
        let itemInfo = itemList[shopItems[i].id];//用ID從資料庫抓取物品資料

        //如果錢不夠
        if (actor.money < itemInfo.price) {
            messagewindow.nextText();
            messagewindow.addText({ profile: "actor", text: "錢不夠喔" })
            return;
        }

        //判斷角色能否得到物品
        let result = actor.getItem(itemInfo.id, 1);
        if (result > 0) {
            let txt = `背包滿了，還有 ${result} 個${itemList[itemInfo.id].name}放不下`
            messagewindow.addText({ profile: "actor", text: txt })
        } else {
            actor.money -= itemInfo.price;
            shopItems[i].num -= 1;
            this.refreshItem(i);
        }

        inventory.refreshItems(); //更新角色背包
    }

    handleScroll(time) {
        let maxHeight = (this.items.length - shopMaxNum) * 80

        this.scrollY += 20 * cursor.wheel / -100;
        this.scrollY = Math.max(this.scrollY, -maxHeight);
        this.scrollY = Math.min(this.scrollY, 5);

        this.itemsContainer.y = global.animateToTarget(this.itemsContainer.y, this.scrollY, 0.25);
        this.moreUp.visible = this.itemsContainer.y < 5;
        this.moreDown.visible = this.itemsContainer.y > -maxHeight;
    }

    update(time) {
        this.targetMoney = global.animateToTarget(this.targetMoney, actor.money)
        this.handleScroll(time);
    }
}

export { Shop }