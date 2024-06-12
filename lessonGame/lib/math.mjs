class MersenneTwister {
    constructor(seed) {
        this.mt = new Array(624);
        this.index = 0;
        this.mt[0] = seed >>> 0;
        for (let i = 1; i < 624; i++) {
            let s = this.mt[i - 1] ^ (this.mt[i - 1] >>> 30);
            this.mt[i] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253) + i;
            this.mt[i] >>>= 0; // 确保是无符号整数
        }
    }

    generate() {
        if (this.index === 0) {
            this.twist();
        }
        let y = this.mt[this.index];
        y ^= y >>> 11;
        y ^= (y << 7) & 0x9d2c5680;
        y ^= (y << 15) & 0xefc60000;
        y ^= y >>> 18;

        this.index = (this.index + 1) % 624;
        return (y >>> 0) / 4294967295; // 确保 y 是无符号的，然后规范化到 [0, 1]
    }

    twist() {
        for (let i = 0; i < 624; i++) {
            let y = (this.mt[i] & 0x80000000) + (this.mt[(i + 1) % 624] & 0x7fffffff);
            this.mt[i] = this.mt[(i + 397) % 624] ^ (y >>> 1);
            if (y % 2 !== 0) {
                this.mt[i] ^= 0x9908b0df;
            }
            this.mt[i] >>>= 0; // 确保结果无符号
        }
    }
}

const MathM = {};
MathM.random = new MersenneTwister(854);
MathM.rangeInt = function (start, end) {
    return Math.floor(Math.random() * (end - start + 1)) + start;
}

export {MathM};


//測試種子碼亂數
const counto = new Array(11).fill(0);
const countn = new Array(11).fill(0);
for (let i = 0; i < 100000; i++) {
    let num = Math.random();
    let index = Math.floor(num * 10);
    counto[index]++;

    let numb = MathM.random.generate();
    let indexb = Math.floor(numb * 10);
    countn[indexb]++;
}
console.log(`old:${counto}`);
console.log(`new:${countn}`);
