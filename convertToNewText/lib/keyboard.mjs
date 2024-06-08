let text = ['', '', '', ''];

function keyboardGetZhuyin(event, callback) {
    let zhuyinData = getZhuyin(event.code);
    text[zhuyinData[0]] = zhuyinData[1];
    if (zhuyinData[1] == 'ˊ' || zhuyinData[1] == 'ˇ' || zhuyinData[1] == 'ˋ' || zhuyinData[1] == '˙' || zhuyinData[1] == ' ') {
        let firstCode = getFirstNonEmpty(text);
        let endCode = text[3] == 'ˊ' ? 1 : text[3] == 'ˇ' ? 2 : text[3] == 'ˋ' ? 3 : 0;

        let showText = '';
        text.forEach(element => {
            showText += element;
        });

        callback([[toNumber(firstCode), endCode], showText])
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

function toNumber(phonetic) {
    const phoneticToNumberMap = {
        'ㄅ': 0, 'ㄆ': 1, 'ㄇ': 2, 'ㄈ': 3, 'ㄉ': 4, 'ㄊ': 5, 'ㄋ': 6, 'ㄌ': 7,
        'ㄍ': 8, 'ㄎ': 9, 'ㄏ': 10, 'ㄐ': 11, 'ㄑ': 12, 'ㄒ': 13, 'ㄓ': 14, 'ㄔ': 15,
        'ㄕ': 16, 'ㄖ': 17, 'ㄗ': 18, 'ㄘ': 19, 'ㄙ': 20, 'ㄧ': 21, 'ㄨ': 22, 'ㄩ': 23,
        'ㄚ': 24, 'ㄛ': 25, 'ㄜ': 26, 'ㄝ': 27, 'ㄞ': 28, 'ㄟ': 29, 'ㄠ': 30, 'ㄡ': 31,
        'ㄢ': 32, 'ㄣ': 33, 'ㄤ': 34, 'ㄥ': 35, 'ㄦ': 36
    };
    return phoneticToNumberMap[phonetic];
}

function codeToText(code) {
    const phoneticCharacters = [
        ['ㄅ', '鼻', '比', '必'],
        ['ㄆ', '皮', '痞', '屁'],
        ['ㄇ', '迷', '米', '密'],
        ['ㄈ', '肥', '匪', '廢'],
        ['ㄉ', '迪', '底', '地'],
        ['ㄊ', '題', '體', '替'],
        ['ㄋ', '尼', '你', '逆'],
        ['ㄌ', '離', '李', '力'],
        ['ㄍ', '格', '葛', '各'],
        ['ㄎ', '咳', '可', '克'],
        ['ㄏ', '侯', '吼', '後'],
        ['ㄐ', '及', '幾', '季'],
        ['ㄑ', '其', '起', '氣'],
        ['ㄒ', '息', '洗', '系'],
        ['ㄓ', '質', '紙', '製'],
        ['ㄔ', '持', '尺', '赤'],
        ['ㄕ', '石', '史', '是'],
        ['ㄖ', '如', '乳', '入'],
        ['ㄗ', '族', '祖', '駔'],
        ['ㄘ', '詞', '此', '次'],
        ['ㄙ', '俗', '死', '四'],
        ['ㄧ', '怡', '以', '亦'],
        ['ㄨ', '吳', '武', '物'],
        ['ㄩ', '於', '與', '玉'],
        ['ㄚ'],
        ['ㄛ'],
        ['ㄜ'],
        ['ㄝ'],
        ['ㄞ'],
        ['ㄟ'],
        ['ㄠ'],
        ['ㄡ'],
        ['ㄢ'],
        ['ㄣ'],
        ['ㄤ'],
        ['ㄥ'],
        ['ㄦ']
    ];

    let typeCode = phoneticCharacters[code[0]];
    if (typeCode != undefined) {
        return typeCode[code[1] % typeCode.length];

    }
    return ''
}

function getZhuyin(keyCode) {
    // 聲母
    if (keyCode == 'Digit1') { return [0, 'ㄅ']; }
    if (keyCode == 'KeyQ') { return [0, 'ㄆ']; }
    if (keyCode == 'KeyA') { return [0, 'ㄇ']; }
    if (keyCode == 'KeyZ') { return [0, 'ㄈ']; }
    if (keyCode == 'Digit2') { return [0, 'ㄉ']; }
    if (keyCode == 'KeyW') { return [0, 'ㄊ']; }
    if (keyCode == 'KeyS') { return [0, 'ㄋ']; }
    if (keyCode == 'KeyX') { return [0, 'ㄌ']; }
    if (keyCode == 'KeyE') { return [0, 'ㄍ']; }
    if (keyCode == 'KeyD') { return [0, 'ㄎ']; }
    if (keyCode == 'KeyC') { return [0, 'ㄏ']; }
    if (keyCode == 'KeyR') { return [0, 'ㄐ']; }
    if (keyCode == 'KeyF') { return [0, 'ㄑ']; }
    if (keyCode == 'KeyV') { return [0, 'ㄒ']; }
    if (keyCode == 'Digit5') { return [0, 'ㄓ']; }
    if (keyCode == 'KeyT') { return [0, 'ㄔ']; }
    if (keyCode == 'KeyG') { return [0, 'ㄕ']; }
    if (keyCode == 'KeyB') { return [0, 'ㄖ']; }
    if (keyCode == 'KeyY') { return [0, 'ㄗ']; }
    if (keyCode == 'KeyH') { return [0, 'ㄘ']; }
    if (keyCode == 'KeyN') { return [0, 'ㄙ']; }

    // 介音
    if (keyCode == 'KeyU') { return [1, 'ㄧ']; }
    if (keyCode == 'KeyJ') { return [1, 'ㄨ']; }
    if (keyCode == 'KeyM') { return [1, 'ㄩ']; }

    // 韻母
    if (keyCode == 'Digit8') { return [2, 'ㄚ']; }
    if (keyCode == 'KeyI') { return [2, 'ㄛ']; }
    if (keyCode == 'KeyK') { return [2, 'ㄜ']; }
    if (keyCode == 'Comma') { return [2, 'ㄝ']; }
    if (keyCode == 'Digit9') { return [2, 'ㄞ']; }
    if (keyCode == 'KeyO') { return [2, 'ㄟ']; }
    if (keyCode == 'KeyL') { return [2, 'ㄠ']; }
    if (keyCode == 'Period') { return [2, 'ㄡ']; }
    if (keyCode == 'Digit0') { return [2, 'ㄢ']; }
    if (keyCode == 'KeyP') { return [2, 'ㄣ']; }
    if (keyCode == 'Semicolon') { return [2, 'ㄤ']; }
    if (keyCode == 'Slash') { return [2, 'ㄥ']; }
    if (keyCode == 'Minus') { return [2, 'ㄦ']; }

    // 聲調符號
    if (keyCode == 'Digit6') { return [3, 'ˊ']; }
    if (keyCode == 'Digit3') { return [3, 'ˇ']; }
    if (keyCode == 'Digit4') { return [3, 'ˋ']; }
    if (keyCode == 'Digit7') { return [3, '˙']; }
    if (keyCode == 'Space') { return [3, ' ']; }
    return ''; // 如果按鍵不符合任何注音符號，返回空字串
}

export { keyboardGetZhuyin, codeToText }

