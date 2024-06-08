import { Application, Sprite, Graphics, Assets, Point, Container } from './pixi.mjs';

const app = new Application();
await app.init({ background: '#81C0C0', width: 512, height: 512 });

let vpScale = 100;

const hitP = new Point();
let mPoly = false;

const sprite = new Sprite();
const backCon = new Container();
const polyCon = new Container();
const lineCon = new Container();
const pointsCon = new Container();

app.stage.addChild(sprite, polyCon, lineCon, pointsCon);

backCon.eventMode = "dynamic";
backCon.hitArea = app.screen;
backCon.on('pointerdown', (e) => {
    setPositions(e.global.x, e.global.y)
});


let points = [];
let poly = new Graphics();
let origin = new Graphics();
origin.circle(0, 0, 12);
origin.fill(0xff0000, 0.2);
origin.circle(0, 0, 10);
origin.stroke({ width: 2, color: 0xff0000, alpha: 0.5 });

origin.blendMode = 1;
origin.eventMode = "dynamic";
origin.cursor = 'pointer';
origin.on('pointerdown', (e) => {
    if (!mPoly) {
        hitP.x = e.global.x;
        hitP.y = e.global.y;
        mPoly = true
    }
});

app.stage.on('pointermove', (event) => {
    if (mPoly) {
        const offsetX = event.global.x - hitP.x;
        const offsetY = event.global.y - hitP.y;
        points.forEach(p => {
            p.x += offsetX / (vpScale / 100);
            p.y += offsetY / (vpScale / 100);
        });
        hitP.x = event.data.global.x; // 更新 hitP
        hitP.y = event.data.global.y;
    }
});

origin.on('pointerup', () => { mPoly = false; });
origin.on('pointerupoutside', () => { mPoly = false; });

polyCon.addChild(poly);

function addP(x, y, index) {
    let point = new Graphics();
    point.circle(0, 0, 5);
    point.fill(0xff0000);
    point.x = x;
    point.y = y;
    point.eventMode = "dynamic";
    point.cursor = 'pointer';
    point.on('pointerover', (event) => {
        point.scale.set(1.5 / (vpScale / 100));
    })
    point.on('pointerout', () => { point.scale.set(1 / (vpScale / 100)); })
    point.on('pointerupoutside', () => { point.scale.set(1 / (vpScale / 100)); })

    point.on('pointerdown', (event) => {
        if (event.data.button === 0) {
            addDrag(point)
        } else if (event.data.button === 2) {
            if (points.length > 4) {
                let id = points.indexOf(point);
                points.splice(id, 1);
                pointsCon.removeChild(point);
                drawPolygon();
            }
        }
    });

    points.splice(index, 0, point)
    pointsCon.addChild(point);
    drawPolygon();
    return point;
}

function drawPolygon() {
    poly.clear();
    lineCon.children = [];
    for (let i = 0; i < points.length; i++) {
        let point = points[i];
        let next_p = points[(i + 1) % points.length];
        let line = new Graphics();
        line.moveTo(point.x, point.y);
        line.lineTo(next_p.x, next_p.y);
        line.stroke({ width: 4 / (vpScale / 100), color: 0xff0000 });
        line.alpha = 0.5;
        line.eventMode = "dynamic";
        line.cursor = 'pointer';
        line.on('pointerdown', (e) => {
            point = addP(e.global.x / (vpScale / 100), e.global.y / (vpScale / 100), i + 1);
            addDrag(point);
        });

        lineCon.addChild(line);
    }

    if (poly) {
        app.stage.removeChild(poly);
    }
    if (points.length >= 3) {
        poly.poly(points.map(p => new Point(p.x, p.y)));
        poly.fill(0xff0000, 0.5);
        polyCon.addChild(poly);
    }
}
setPositions(256, 256)

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

function addDrag(point) {
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
            app.renderer.resize(sprite.width * vpScale / 100, sprite.height * vpScale / 100);
            dataWH = [sprite.width, sprite.height]
        };
        reader.readAsDataURL(e.target.files[0]);
    };
    input.click();
});
let divA = document.createElement('div');
let buttonConvert = document.createElement('button');
let textbox = document.createElement('textarea');

//Button of Convert.
buttonConvert.innerText = '轉換';
buttonConvert.addEventListener('click', function () {
    let fixX = app.screen.width * anchorX.value;
    let fixY = app.screen.height * anchorY.value;
    let tValue = ""
    tValue += `.anchor.set(${anchorX.value}, ${anchorY.value})\n`
    tValue += ".hitArea = new poly([\n"
    for (let i = 0; i < points.length; i++) {
        let p = points[i];
        if (i > 0 && i % 5 == 0) tValue += '\n'
        tValue += `${parseFloat((p.x - fixX).toFixed(2))},${parseFloat((p.y - fixY).toFixed(2))}, `
    }
    tValue = tValue.slice(0, -2);
    tValue += "]);"
    textbox.value = tValue
    textbox.select();
})

function setPositions(x, y) {
    pointsCon.children = [];

    let size = 50;
    origin.x = x
    origin.y = y
    pointsCon.addChild(origin);

    addP(x - size, y - size, 0)
    addP(x + size, y - size, 1)
    addP(x + size, y + size, 2)
    addP(x - size, y + size, 3)
}

divA.appendChild(buttonLoad);
divA.appendChild(buttonConvert);
divA.appendChild(document.createElement('br'));
divA.appendChild(textbox);
document.body.appendChild(divA);
document.body.appendChild(app.canvas);