import { Vector2 } from "./vector.mjs";
import { Container, Polygon, Sprite, Texture } from "./pixi.mjs";
import { setInteractive } from "./mouse.mjs";
import { messagewindow } from "./windows.mjs";
import { dialogsData } from "./gameData/dialogData.mjs";

class Actor {
    constructor() {
        this.name = "我是主角";

        //腳色資料
        this.money = 1000;
        this.items = [];

        this.position = new Vector2();
        this.targetPos = new Vector2();//角色目標位置
        this.moveSpeed = 15;

        //圖形資料
        this.container = new Container();
        this.container.z = 0;
    }

    init() {
        this.sprite = new Sprite(Texture.from('cat'));
        this.sprite.scale.set(0.2);
        this.sprite.anchor.set(0.4, 0.95)
        this.sprite.hitArea = new Polygon([
            -28.3, -424.4, 35.45, -424.4, 74.2, -476.9, 96.7, -410.65, 132.95, -331.9,
            117.2, -274.4, 89.2, -252.4, 134.2, -79.4, 182.2, -116.4, 203.2, -212.4,
            168.2, -302.4, 174.2, -330.4, 201.2, -346.4, 236.2, -313.4, 256.2, -216.4,
            230.2, -108.4, 170.2, -47.4, 124.2, -14.4, 57.2, 4.6, 47.2, 20.6,
            27.2, 6.6, -29.8, 4.6, -46.8, 24.6, -60.8, 2.6, -91.8, 1.6,
            -127.8, -46.4, -125.8, -140.4, -86.8, -258.4, -129.8, -313.4, -92.05, -409.4,
            -75.8, -478.15]);
        this.container.addChild(this.sprite);
    }

    //角色預設位置
    setOringinPos(x, y) {
        this.position.x = x;
        this.position.y = y;
        this.targetPos.x = x;
        this.targetPos.y = y;
    }

    //得到物品
    getItem(id, num = 1) {
        //依數量執行多次
        for (let n = 0; n < num; n++) {
            //得到單個物品
            let find = false;
            for (let i = 0; i < this.items.length; i++) {
                if (this.items[i].id == id && this.items[i].num < 10) {
                    this.items[i].num += 1;
                    find = true;
                }
            }
            if (!find) {
                if (this.items.length >= 16) {
                    //差幾個沒被放進去
                    return num - n;
                } else {
                    this.items.push({ id: id, num: 1 });
                }
            }
        }

        //0個沒被放進去 = 全放進去
        return 0;
    }

    move() {
        this.container.x = this.position.x;
        this.container.y = this.position.y;

        //目標座標與實際座標X與Y的間隙值。
        let gap_x = this.targetPos.x - this.position.x;
        let gap_y = this.targetPos.y - this.position.y;

        //目標座標與實際座標的差距
        let moveDir = new Vector2(gap_x, gap_y);

        //目標座標與實際座標差距的規一化(長度為1)
        let moveDir_N = moveDir.normalize();

        //在角色moveSpeed 跟 目標座標與實際座標的差距 間取最小值。
        let newSpeed = Math.min(moveDir.length(), this.moveSpeed)

        //將實際座標加上這個值。
        this.position.x += moveDir_N.x * newSpeed;
        this.position.y += moveDir_N.y * newSpeed;
        this.container.zIndex = this.position.y;
    }

    update(time) {
        this.move();
    }
}

const actor = new Actor();
setInteractive(actor.container, [1, 1.05], () => {
    messagewindow.addText(dialogsData['歡迎對話']);
});

export { actor }