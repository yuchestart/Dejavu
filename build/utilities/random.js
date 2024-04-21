export class RNG {
    constructor(seed) {
        this.w = 32;
        this.n = 624;
        this.m = 397;
        this.a = 0x9908B0DF;
        this.u = 11;
        this.d = 0xFFFFFFFF;
        this.s = 7;
        this.b = 0x9D2C5680;
        this.t = 15;
        this.c = 0xEFC60000;
        this.l = 18;
        this.f = 1812433253;
        this.MT = [];
        this.index = this.n + 1;
        this.lower_mask = 0x7FFFFFFF;
        this.upper_mask = 0x80000000;
        this.MT = [];
        for (let i = 0; i < this.n; i++)
            this.MT.push(0);
        this.seed(seed);
    }
    seed(seed) {
        this.MT[0] = seed;
        for (let i = 1; i < this.n; i++) {
            const temp = this.f * (this.MT[i - 1] ^ (this.MT[i - 1] >> (this.w - 2))) + i;
            this.MT[i] = temp & 0xFFFFFFFF;
        }
    }
    random() {
        return this.extract_number() / 2147483648;
    }
    extract_number() {
        if (this.index >= this.n) {
            this.twist();
            this.index = 0;
        }
        let y = this.MT[this.index];
        y = y ^ ((y >> this.u) & this.d);
        y = y ^ ((y << this.s) & this.b);
        y = y ^ ((y << this.t) & this.c);
        y = y ^ (y >> this.l);
        this.index++;
        return y & 0xffffffff;
    }
    twist() {
        for (let i = 0; i < this.n; i++) {
            const x = (this.MT[i] & this.upper_mask) + (this.MT[(i + 1) % this.n] & this.lower_mask);
            let xA = x >> 1;
            if ((x % 2) != 0)
                xA = xA ^ this.a;
            this.MT[i] = this.MT[(i + this.m) % this.n] ^ xA;
        }
    }
}
