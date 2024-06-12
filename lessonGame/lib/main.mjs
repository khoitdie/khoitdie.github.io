import { Application, Texture, Sprite, Container, SCALE_MODES } from './pixi.mjs'
import { messagewindow } from './windows.mjs';
import { shop } from './shop.mjs';
import { AssetsLoader } from './assets.mjs';
import { cursor } from './mouse.mjs';
import { global } from './global.mjs';
import { gameMapManager } from './maps/gamemapManager.mjs';
import { inventory } from './inventory.mjs';

//初始化APP
const app = new Application();
await app.init({ width: 1920, height: 1080, background: '#E0E0E0', autoDensity: true})
app.renderer.resolution = window.devicePixelRatio;
app.renderer.events.resolution = window.devicePixelRatio;

document.body.appendChild(app.canvas);
app.canvas.addEventListener('contextmenu', (e) => {e.preventDefault();});

//隱藏滑鼠
app.renderer.events.cursorStyles.default = 'none';
app.renderer.events.cursorStyles.pointer = 'none';
app.canvas.addEventListener("wheel", (event) => {
    clearTimeout(cursor.timer);

    cursor.wheel = event.deltaY;
    cursor.timer =  setTimeout(() => {
        cursor.wheel = 0;
    }, 100);
});

//資產讀取
let assetsLoader = new AssetsLoader();
await assetsLoader.loadAllTexture();
console.log("Start Main")

//建立UI、Map Container
const viewport = new Container();
const hitContainer = new Container();
const uiContainer = new Container();
const mapContainer = new Container();
viewport.addChild(hitContainer, mapContainer, uiContainer);
app.stage.addChild(viewport);

hitContainer.eventMode = 'static';
hitContainer.hitArea = app.screen;
hitContainer.on('pointermove', (e)=>{
    cursor.container.x = e.global.x;
    cursor.container.y = e.global.y;
});

//初始化cursor、主角資訊、GameMap
cursor.init();
gameMapManager.init();
inventory.init();
shop.init();
messagewindow.init();
app.stage.addChild(cursor.container);
mapContainer.addChild(gameMapManager.container);



uiContainer.addChild(
    messagewindow.container,
    shop.container,
    inventory.container
);

//每影格更新APP
app.ticker.add((time) => {
    try {
        global.time = time;
        messagewindow.update(time);
        shop.update(time);
        inventory.update(time);
        gameMapManager.update(time);
        cursor.update(time);
        viewportUpdate(time);
    } catch (error) {
        console.log(error)
    }
});

function getRandomNumber(start, end) {
    return Math.floor(Math.random() * (end - start + 1)) + start;
}

function mapRange(value, inMin, inMax, outMin, outMax) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

function viewportUpdate(time)
{
    if (global.shake > 0) {
        let newNum = mapRange(global.shake, 0, 1000, 0, 20);
        viewport.x = getRandomNumber(-100, 100) / 10 * newNum;
        global.shake--;
    }else{
        viewport.x = 0;
        viewport.y = 0;
    }
}

window.addEventListener("resize", onWindowsResize);

let viewportSacle = 1;
function onWindowsResize()
{
    let scaleW = window.innerWidth / 1920;
    let scaleH = window.innerHeight / 1080;

    viewportSacle = Math.min(scaleW, scaleH);
    app.renderer.resize(1920 * viewportSacle, 1080 * viewportSacle);
    viewport.scale.set(viewportSacle);
    console.log(app.renderer.resolution)
}

onWindowsResize();

export {app}