import { TextStyle } from "./pixi.mjs";
const global = {};
const audio = {}

export { global, audio };

global.pause = false;
global.interactable = true;
global.shake = 0;
global.time;

audio.coins = [];
for (let i = 0; i < 20; i++) {
    let coin = new Audio('sound/Coin.mp3');
    coin.playbackRate = Math.random() * 0.5 + 0.5;
    coin.volume = Math.random() * 0.4 + 0.5;
    audio.coins.push(coin);
}
audio.index = 0;

global.animateToTarget = function (current, target, speed = 0.1) {
    let gap = target - current;
    let gapLength = Math.abs(gap);
    let step = Math.max(Math.ceil(gapLength * speed * global.time.deltaTime), 1);
    if (gapLength < 1) {
        current = target;
    } else {
        current += gap > 0 ? step : -step;
    }
    return current;
}

global.styleA = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 25,
    fontWeight: 'bold',
    fill: 0xFFFFFF,
    stroke: { color: '#3C3C3C', width: 5, join: 'round' },
    wordWrap: true,
});

global.styleMessage = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 30,
    fontWeight: 'bold',
    lineHeight: 50,
    letterSpacing: 2,
    fill: 0xFFFFFF,
    stroke: { color: '#3C3C3C', width: 5, join: 'round' },
    wordWrap: true,
    wordWrapWidth: 1000,
});

global.styleNumber = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 22,
    fontWeight: 'bold',
    fill: 0xFFFFFF,
    stroke: { color: '#000000', width: 4, join: 'round' },
    wordWrap: true,
});

global.styleGold = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 22,
    fontWeight: 'bold',
    fill: 0xFF8000,
    stroke: { color: '#000000', width: 4, join: 'round' },
    wordWrap: true,
});

global.styleMoney = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 35,
    fontWeight: 'bold',
    fill: 0xFF8000,
    stroke: { color: '#000000', width: 6, join: 'round' },
    wordWrap: true,
});

global.styleSize = function (size) {
    return new TextStyle({
        fontFamily: 'Arial',
        fontSize: size,
        fontWeight: 'bold',
        fill: 0xFFFFFF,
        stroke: { color: '#3C3C3C', width: 5, join: 'round' },
        wordWrap: true,
        wordWrapWidth: 1000,
    })
}

