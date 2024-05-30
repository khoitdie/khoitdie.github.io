import { Application, Sprite, Graphics, Assets, Point, Container } from './pixi.mjs';

const app = new Application();
await app.init({ background: '#81C0C0', width: 500, height: 500 });
let sinScale = 0;

const hitPos = new Point();
let movePolygon = false;

const sprite = new Sprite();
const polygonContainer = new Container();
const lineContainer = new Container();
const pointsContainer = new Container();

let anchor = new Graphics();
anchor.rect(-3, -12, 6, 24);
anchor.rect(-12, -3, 24, 6);
anchor.circle(0, 0, 5);
anchor.fill(0x000000);

anchor.rect(-1, -10, 2, 20);
anchor.rect(-10, -1, 20, 2);
anchor.circle(0, 0, 3);
anchor.fill(0xffff00);
anchor.eventMode = "none";

app.stage.addChild(sprite, polygonContainer, lineContainer, pointsContainer, anchor);

let points = [];
let polygon = new Graphics();
let origin = new Graphics();
origin.circle(0, 0, 12);
origin.fill(0xff0000, 0.2);
origin.circle(0, 0, 10);
origin.stroke({ width: 2, color: 0xff0000, alpha: 0.5 });

origin.blendMode = 1;
origin.eventMode = "dynamic";
origin.cursor = 'pointer';
origin.on('pointerdown', (e)=>{
    if (!movePolygon) {
        hitPos.x = e.global.x;
        hitPos.y = e.global.y;
        movePolygon = true
    }
});

app.stage.on('pointermove', (event)=>{
    if (movePolygon) {
        const offsetX = event.global.x - hitPos.x;
        const offsetY = event.global.y - hitPos.y;
        points.forEach(p => {
            p.x += offsetX;
            p.y += offsetY;
        });
        hitPos.x = event.data.global.x; // 更新 hitPos
        hitPos.y = event.data.global.y;
    }
});

origin.on('pointerup', ()=>{movePolygon = false;});
origin.on('pointerupoutside', ()=>{movePolygon = false;});

polygonContainer.addChild(polygon);

function addPoint(x, y, index) {
    let point = new Graphics();
    point.circle(0, 0, 5);
    point.fill(0xff0000);
    point.x = x;
    point.y = y;
    point.eventMode = "dynamic";
    point.cursor = 'pointer';
    point.on('pointerover', (event) => {
        point.scale.set(1.5);
    })
    point.on('pointerout', () => {point.scale.set(1);})
    point.on('pointerupoutside', () => {point.scale.set(1);})

    point.on('pointerdown', (event) => {
        if (event.data.button === 0) {
            addDrag(point)
        } else if (event.data.button === 2) {
            if (points.length > 4) {
                let id = points.indexOf(point);
                points.splice(id, 1);
                pointsContainer.removeChild(point);
                drawPolygon();
            }
        }
    });

    points.splice(index, 0, point)
    pointsContainer.addChild(point);
    drawPolygon();
    return point;
}

setPositions(app.screen.width / 2, app.screen.height / 2)
function setPositions(x, y)
{
    pointsContainer.children = [];

    let size = 50;
    origin.x = x
    origin.y = y
    pointsContainer.addChild(origin);

    addPoint(x - size, y - size, 0)
    addPoint(x + size, y - size, 1)
    addPoint(x + size, y + size, 2)
    addPoint(x - size, y + size, 3)
}

function drawPolygon() {
    polygon.clear();
    lineContainer.children = [];
    for (let i = 0; i < points.length; i++) {
        let point = points[i];
        let next_p = points[(i + 1) % points.length];
        let line = new Graphics();
        line.moveTo(point.x, point.y);
        line.lineTo(next_p.x, next_p.y);
        line.stroke({ width: 4, color: 0xff0000 });
        line.alpha = 0.5;
        line.eventMode = "dynamic";
        line.cursor = 'pointer';
        line.on('pointerdown', (e)=>{
            point = addPoint(e.global.x, e.global.y, i+1);
            addDrag(point);
        });

        lineContainer.addChild(line);
    }

    if (polygon) {
        app.stage.removeChild(polygon);
    }
    if (points.length >= 3) {
        polygon.poly(points.map(p => new Point(p.x, p.y)));
        polygon.fill(0xff0000, 0.5);
        polygonContainer.addChild(polygon);
    }
}

function calculatePolygonCentroid(vertices) {
    let signedArea = 0;
    let xSum = 0;
    let ySum = 0;
    let n = vertices.length;

    for (let i = 0; i < n; i++) {
        let x0 = vertices[i].x;
        let y0 = vertices[i].y;
        let x1 = vertices[(i + 1) % n].x;
        let y1 = vertices[(i + 1) % n].y;

        let a = x0 * y1 - x1 * y0;
        signedArea += a;
        xSum += (x0 + x1) * a;
        ySum += (y0 + y1) * a;
    }

    signedArea *= 0.5;
    let centroidX = xSum / (6 * signedArea);
    let centroidY = ySum / (6 * signedArea);

    return {
        x: centroidX,
        y: centroidY
    };
}

let dragTarget = null;

app.stage.eventMode = 'static';
app.stage.hitArea = app.screen;
app.stage.on('pointerup', onDragEnd);
app.stage.on('pointerupoutside', onDragEnd);

function addDrag(point)
{
    point.alpha = 0.5;
    dragTarget = point;
    app.stage.on('pointermove', onDragMove); 
}

function onDragMove(event) {
    if (dragTarget) {
        dragTarget.parent.toLocal(event.global, null, dragTarget.position);
    }
}

function onDragEnd() {
    if (dragTarget) {
        app.stage.off('pointermove', onDragMove);
        dragTarget.alpha = 1;
        dragTarget = null;
    }
}

app.canvas.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });

app.ticker.add((time) => {
    drawPolygon()
    let result = calculatePolygonCentroid(points);
    origin.x = result.x;
    origin.y = result.y;
    sinScale = Math.sin(time.lastTime / 50)
});


let buttonLoad = document.createElement('button');
buttonLoad.innerText = '讀取圖片';
buttonLoad.addEventListener('click', function () {
    let input = document.createElement('input');
    input.type = 'file';
    input.onchange = function (e) {
        let reader = new FileReader();
        reader.onload = async function (event) {
            const texture = await Assets.load(event.target.result);
            sprite.texture = texture;
            app.renderer.resize(sprite.width, sprite.height);
        };
        reader.readAsDataURL(e.target.files[0]);
    };
    input.click();
});
let divA = document.createElement('div');
let buttonConvert = document.createElement('button');
let textbox = document.createElement('textarea');
buttonConvert.innerText = '轉換';
buttonConvert.addEventListener('click', function () {
    let fixX = app.screen.width * anchorX.value;
    let fixY = app.screen.height * anchorY.value;
    console.log(`[${fixX}, ${fixY}]`)

    let tValue = "["
    for (let i = 0; i < points.length; i++) {
        let p = points[i];
        if (i > 0 && i % 5 == 0) tValue += '\n'
        tValue += `${p.x - fixX},${p.y - fixY},`
    }

    tValue = tValue.slice(0, -1);
    tValue += "]"
    tValue += `//anchor.set(${anchorX.value}, ${anchorY.value})`
    textbox.value = tValue
})
let tip = document.createElement('span');
tip.innerHTML = "＞anchor: "

let anchorX = document.createElement('input');
anchorX.type = 'number'
anchorX.step = 0.05
anchorX.style.width = '80px';
anchorX.style.textAlign = 'center';
anchorX.value = 0
anchorX.onchange = ()=>{
    anchorX.value = anchorX.value == "" ? 0 : anchorX.value;
    anchorX.value = anchorX.value < 0 ? 0 : anchorX.value;
    anchorX.value = anchorX.value > 1 ? 1 : anchorX.value;
    anchor.x = app.screen.width * anchorX.value;
}

let anchorY = document.createElement('input');
anchorY.step = 0.05
anchorY.type = 'number'
anchorY.style.width = '80px';
anchorY.style.textAlign = 'center';
anchorY.value = 0;
anchorY.onchange = ()=>{
    anchorY.value = anchorY.value == "" ? 0 : anchorY.value;
    anchorY.value = anchorY.value < 0 ? 0 : anchorY.value;
    anchorY.value = anchorY.value > 1 ? 1 : anchorY.value;
    anchor.y = app.screen.height * anchorY.value;
}

divA.appendChild(buttonLoad);
divA.appendChild(buttonConvert);
divA.appendChild(tip);
divA.appendChild(anchorX);
divA.appendChild(anchorY);

divA.appendChild(document.createElement('br'));
divA.appendChild(textbox);
document.body.appendChild(divA);
document.body.appendChild(app.canvas);