import { actor } from "../actor.mjs";
import { messagewindow } from "../windows.mjs";
import { dialogsData } from "./dialogData.mjs";
import { global } from "../global.mjs";
import { gameMapManager } from "../maps/gamemapManager.mjs";
import { shop } from "../shop.mjs";

const diolagsEvent = {};
diolagsEvent['checkMoney'] = () => {
    if (actor.money > 10000) {
        messagewindow.addText(dialogsData['你太有錢'])
    } else {
        messagewindow.addText(dialogsData['你沒錢'])
    }
}

diolagsEvent['+5000'] = () => { actor.money += 5000; }
diolagsEvent['shakeMap'] = () => { global.shake = 60; }
diolagsEvent['changeMap'] = () => { gameMapManager.changeMap(1, 640, 360) }
diolagsEvent['fillStore'] = () => {shop.resetItems();}

export { diolagsEvent }