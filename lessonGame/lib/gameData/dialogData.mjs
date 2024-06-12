import { actor } from "../actor.mjs";

//角色頭像資料
const dialogsProfile = {
    "actor": { img: "cat", name: "我是貓" },
    "spider": { img: "spider", name: "蜘蛛" },
}

//對話資料
const dialogsData = {
    "歡迎對話": [
        { profile: "actor", text: "HI!!" },
        { profile: "actor", text: ()=> `你好! 我身上有${actor.money}元` },
        { profile: "actor", text: "我是貓\n我在做換行測試" },
        [
            { text: "求上天施捨", event: "checkMoney" },
            { text: "順移地圖", nextDialogs: "順移地圖"},
            { text: "商店重新補貨", nextDialogs: "補貨", event: 'fillStore' },
            { text: "沒事！" },
        ]
    ],
    "補貨": [
        { profile: "spider", text: "我幫你補貨" },
        { profile: "spider", text: "現在商店超酷！" }
    ],
    "順移地圖": [
        { profile: "spider", text: "我沒有這種能力..." },
        { profile: "spider", text: "你想太多..." }
    ],
    "你太有錢": [
        { profile: "spider", text: "你太有錢！！", event: "shakeMap"},
        { profile: "spider", text: "所以不給你錢！！"}
    ],
    "你沒錢": [
        { profile: "spider", text: "你沒錢..." },
        { profile: "spider", text: "所以給你錢..." },
        { profile: "actor", text: "金錢+5000", event: "+5000" }
    ]
}

export { dialogsData, dialogsProfile }