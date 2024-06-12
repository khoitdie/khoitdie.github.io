import { actor } from "../actor.mjs";
import { messagewindow } from "../windows.mjs";
import { dialogsData } from "./dialogData.mjs";
import { global } from "../global.mjs";
import { gameMapManager } from "../maps/gamemapManager.mjs";

const diolagsEvent = {};
diolagsEvent['checkMoney'] = () => {
    if (actor.money > 1000) {
        messagewindow.addText(dialogsData['你太有錢'])
    } else {
        messagewindow.addText(dialogsData['你沒錢'])
    }
}

diolagsEvent['+500'] = () => { actor.money += 500; }
diolagsEvent['shakeMap'] = () => { global.shake = 60; }

diolagsEvent['+1000'] = () => { gameMapManager.changeMap(1, 640, 360) }

export { diolagsEvent }