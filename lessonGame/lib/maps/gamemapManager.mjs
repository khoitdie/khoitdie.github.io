import { Container } from "../pixi.mjs";
import { actor } from "../actor.mjs";
import { GameMap } from "./gamemap.mjs";
import { GameMapShop } from "./gamemap_shop.mjs";

class GameMapManager {
    constructor() {
        this.container = new Container();
        this.nowMapID = 0;
        this.maps = [];
    }

    init()
    {
        actor.init();
        this.maps[0] = new GameMap(0);
        this.maps[1] = new GameMapShop(1);

        this.changeMap(0, 1920 / 2, 1080 / 2); //切換到初始場景
    }

    changeMap(id, x, y)
    {
        this.container.removeChildren();
        this.nowMapID = id;

        this.container.addChild(this.maps[this.nowMapID].container)
        this.maps[this.nowMapID].setActor();
        actor.setOringinPos(x, y)
    }

    update(time) {
        this.maps[this.nowMapID].update(time);
        actor.update(time);
    }
}

const gameMapManager = new GameMapManager();

export { gameMapManager }