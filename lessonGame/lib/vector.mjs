class Vector2 {
    constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        const len = this.length();
        if (len === 0) {
            return new Vector2(0, 0); // 防止除以零的情況
        }
        return new Vector2(this.x / len, this.y / len);
    }
}

export { Vector2 }