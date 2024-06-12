import { Assets } from './pixi.mjs'

const resource = [
    'cat', 'dollar', 'message',
    'shopping-cart', 'verified', 'tree',
    'mouse', 'mouse-pointer', 'place',
];
const resourceJPG = []
const itemResourece = ['carrot', 'chili-pepper', 'grape', 'corn', 'apple']

class AssetsLoader {
    constructor() {

        this.loadDone = false;
    }

    async loadAllTexture() {
        return new Promise((resolve, reject) => {
            let loadArray = [];

            resource.forEach(element => {
                Assets.add({ alias: element, src: `img/${element}.png` });
                loadArray.push(element);
            });

            resourceJPG.forEach(element => {
                Assets.add({ alias: element, src: `img/${element}.jpg` });
                loadArray.push(element);
            });

            itemResourece.forEach(element => {
                Assets.add({ alias: element, src: `img/${element}.png` });
                loadArray.push(element);
            });
            
            const texturesPromise = Assets.load(loadArray, this.showProgress);
            texturesPromise.then((textures) => {
                this.loadDone = true;
                console.log("Load Finished.")
                resolve(true)
            });

            texturesPromise.onerror = reject;
        })
    }

    showProgress(progress) {
        console.log(progress)
    }
}

export { AssetsLoader }