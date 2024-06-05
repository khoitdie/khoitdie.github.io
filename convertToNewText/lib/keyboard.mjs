let text = ['', '', '', ''];

function keyboardGetZhuyin(event, callback)
{
    let zhuyinData = getZhuyin(event.key);
    text[zhuyinData[0]] = zhuyinData[1];
    if (zhuyinData[1] == 'ˊ' || zhuyinData[1] == 'ˇ' || zhuyinData[1] == 'ˋ' || zhuyinData[1] == '˙' || zhuyinData[1] == ' ') {
        let firstCode = getFirstNonEmpty(text);
        let endCode = text[3];

        let showText = '';
        text.forEach(element => {
            showText += element;
        });

        //console.log(`${firstCode + endCode} ( ${showText} )`);
        callback([firstCode + endCode, showText])
        text = ['', '', '', ''];
    }
}

function getFirstNonEmpty(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] !== '') {
            return arr[i];
        }
    }
    return null;
}

function getZhuyin(key) {
    // 聲母
    if (key == '1') { return [0, 'ㄅ']; }
    if (key == 'q') { return [0, 'ㄆ']; }
    if (key == 'a') { return [0, 'ㄇ']; }
    if (key == 'z') { return [0, 'ㄈ']; }
    if (key == '2') { return [0, 'ㄉ']; }
    if (key == 'w') { return [0, 'ㄊ']; }
    if (key == 's') { return [0, 'ㄋ']; }
    if (key == 'x') { return [0, 'ㄌ']; }
    if (key == 'e') { return [0, 'ㄍ']; }
    if (key == 'd') { return [0, 'ㄎ']; }
    if (key == 'c') { return [0, 'ㄏ']; }
    if (key == 'r') { return [0, 'ㄐ']; }
    if (key == 'f') { return [0, 'ㄑ']; }
    if (key == 'v') { return [0, 'ㄒ']; }
    if (key == '5') { return [0, 'ㄓ']; }
    if (key == 't') { return [0, 'ㄔ']; }
    if (key == 'g') { return [0, 'ㄕ']; }
    if (key == 'b') { return [0, 'ㄖ']; }
    if (key == 'y') { return [0, 'ㄗ']; }
    if (key == 'h') { return [0, 'ㄘ']; }
    if (key == 'n') { return [0, 'ㄙ']; }

    // 介音
    if (key == 'u') { return [1, 'ㄧ']; }
    if (key == 'j') { return [1, 'ㄨ']; }
    if (key == 'm') { return [1, 'ㄩ']; }

    // 韻母
    if (key == '8') { return [2, 'ㄚ']; }
    if (key == 'i') { return [2, 'ㄛ']; }
    if (key == 'k') { return [2, 'ㄜ']; }
    if (key == ',') { return [2, 'ㄝ']; }
    if (key == '9') { return [2, 'ㄞ']; }
    if (key == 'o') { return [2, 'ㄟ']; }
    if (key == 'l') { return [2, 'ㄠ']; }
    if (key == '.') { return [2, 'ㄡ']; }
    if (key == '0') { return [2, 'ㄢ']; }
    if (key == 'p') { return [2, 'ㄣ']; }
    if (key == ';') { return [2, 'ㄤ']; }
    if (key == '/') { return [2, 'ㄥ']; }
    if (key == '-') { return [2, 'ㄦ']; }

    // 聲調符號
    if (key == '6') { return [3, 'ˊ']; }
    if (key == '3') { return [3, 'ˇ']; }
    if (key == '4') { return [3, 'ˋ']; }
    if (key == '7') { return [3, '˙']; }
    if (key == ' ') { return [3, ' ']; }
    return ''; // 如果按鍵不符合任何注音符號，返回空字串
}

export { keyboardGetZhuyin }

