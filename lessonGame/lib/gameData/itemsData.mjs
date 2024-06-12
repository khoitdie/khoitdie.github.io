import { actor } from "../actor.mjs";

const itemList = [

    { name: "蘋果", img: "apple", price: 20, event: 'money+50' },
    { name: "辣椒", img: "chili-pepper", price: 100 },
    { name: "紅蘿蔔", img: "carrot", price: 50 },
    { name: "葡萄", img: "grape", price: 35 },
    { name: "玉米", img: "corn", price: 10 },

    { name: "刨冰", img: "brain", price: 5000 },
    { name: "果汁", img: "drink", price: 5000 },
    { name: "冰沙", img: "smoothie", price: 5000 },
]

for (let i = 0; i < itemList.length; i++) {
    itemList[i].id = i;
}

const itemsEvent = {};
itemsEvent['money+50'] = () => { actor.money += 50 }

console.log(itemList);

export { itemList, itemsEvent }