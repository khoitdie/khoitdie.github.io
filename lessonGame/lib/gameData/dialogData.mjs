import { actor } from "../actor.mjs";

//角色頭像資料
const dialogsProfile = {
    "actor": { img: "cat", name: "我是貓" },
    "actor_smile": { img: "cat", name: "我是貓(笑)" },
    "actor_angry": { img: "cat", name: "我是貓(生氣)" }
}

//對話資料
const dialogsData = {
    "歡迎對話": [
        { profile: "actor", text: "HI!!" },
        { profile: "actor_smile", text: ()=> `你好! 我有${actor.money}塊:))))` },
        { profile: "actor_angry", text: "我很生氣\n我在做測試ㄎㄎ" },
        [
            { text: "施捨我一下", event: "checkMoney" },
            { text: "切換地圖", nextDialogs: "選項2", event: "+1000" },
            { text: "第3選項" },
            { text: "第4選項" },
        ]
    ],
    "選項1": [
        { profile: "actor", text: "你選了選項1" },
        { profile: "actor", text: "HAHAHAHA" },
        [
            { text: "第1-1選項", nextDialogs: "選項1" },
            { text: "第1-2選項", nextDialogs: "選項2" },
            { text: "第1-3選項" },
            { text: "第1-4選項" }
        ]
    ],
    "選項2": [
        { profile: "actor", text: "你選了選項2" },
        { profile: "actor", text: "222222222" }
    ],
    "你太有錢": [
        { profile: "actor", text: "你太有錢", event: "shakeMap"},
        { profile: "actor", text: "所以不給你錢"}
    ],
    "你沒錢": [
        { profile: "actor", text: "你沒錢" },
        { profile: "actor", text: "所以給你錢" },
        { profile: "actor", text: "金錢+500", event: "+500" }
    ]
}

export { dialogsData, dialogsProfile }