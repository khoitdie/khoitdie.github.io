import { Application, Container, Graphics } from './pixi.mjs';
import { keyboardGetZhuyin } from './keyboard.mjs';
import { TextInput } from './textInput.mjs';

let nowIndex = 0;
const allTextData = [];
const textArray = [];

const app = new Application();
await app.init({ background: '#272727', width: 1280, height: 720 });
app.canvas.addEventListener('contextmenu', (e) => { e.preventDefault(); });
document.body.appendChild(app.canvas);
const viewport = new Container();
app.stage.addChild(viewport);

const indexCursor = new Graphics();
indexCursor.rect(-2, -50, 4, 50);
indexCursor.fill(0xff8000);

const textInputContainer = new Container();
viewport.addChild(textInputContainer, indexCursor);

document.addEventListener('keypress', (event) => {
    keyboardGetZhuyin(event, eventGetCode)
});

document.addEventListener('keydown', (event) => {
    console.log(event.key)
    if (event.key === 'Backspace') {
        deleteTextInput();

    } else if (event.key === 'ArrowLeft') {
        if (nowIndex > 0) { nowIndex--; }

    } else if (event.key === 'ArrowRight') {
        if (nowIndex < textArray.length) { nowIndex++; }

    } else if (event.key === 'ArrowUp') {
        if (nowIndex >= 17) {nowIndex -= 17;}

    } else if (event.key === 'ArrowDown') {
        if (nowIndex + 17 < textArray.length) {nowIndex += 17;}
    }
});

function eventGetCode(arr) {
    allTextData.splice(nowIndex, 0, arr);

    let textInput = new TextInput(arr);
    textInput.showText.text = arr[1];
    textArray.splice(nowIndex, 0, textInput);

    textInput.container.eventMode = 'static';
    textInput.container.cursor = 'pointer';
    textInput.container.on('pointerdown', (e) => {
        let hitPos = e.data.getLocalPosition(textInput.container);
        nowIndex = textArray.indexOf(textInput) + (hitPos.x > 0);
    });

    nowIndex++;
    textInputContainer.addChild(textInput.container);

    renderTexts();
}

function deleteTextInput() {
    if (nowIndex > 0) {
        nowIndex--;
        allTextData.splice(nowIndex, 1);
        const removedTextInput = textArray.splice(nowIndex, 1)[0];
        textInputContainer.removeChild(removedTextInput.container);
        renderTexts();
    }
}

function renderTexts() {
    for (let i = 0; i < textArray.length; i++) {
        textArray[i].container.x = i % 17 * 74 + 48;
        textArray[i].container.y = Math.floor(i / 17) * 101 + 20;
    }
}

app.ticker.add((time) => {
    indexCursor.position.set(nowIndex % 17 * 74 + 14, Math.floor(nowIndex / 17) * 101 + 80);
    indexCursor.alpha = 0.75 + Math.sin(time.lastTime / 100) * 0.25;
});
