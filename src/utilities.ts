export function $(toquery: string, parent?: HTMLElement):{
    id?:HTMLElement|null,
    class:HTMLCollection,
    tag:HTMLCollection,
    querySelector:NodeList
}{
    return parent?{
        class:parent.getElementsByClassName(toquery),
        tag:parent.getElementsByClassName(toquery),
        querySelector:parent.querySelectorAll(toquery)
    }:{
        id:document.getElementById(toquery),
        class:document.getElementsByClassName(toquery),
        tag:document.getElementsByClassName(toquery),
        querySelector:document.querySelectorAll(toquery)
    }
}
export class RNG{
    private w:number = 32;
    private n:number = 624;
    private m:number = 397;
    private a:number = 0x9908B0DF;
    private u:number = 11;
    private d:number = 0xFFFFFFFF;
    private s:number = 7;
    private b:number = 0x9D2C5680;
    private t:number = 15;
    private c:number = 0xEFC60000;
    private l:number = 18;
    private f:number = 1812433253;
    private MT:Array<number> = [];
    private index = this.n+1;
    private lower_mask = 0x7FFFFFFF;
    private upper_mask = 0x80000000;

    constructor(seed: number){
        this.MT = [];
        for(let i=0; i<this.n; i++) this.MT.push(0);
        this.seed(seed);
    }

    public seed(seed: number): void{
        this.MT[0] = seed;
        for(let i=1; i<this.n; i++){
            const temp: number = this.f * (this.MT[i-1] ^ (this.MT[i-1] >> (this.w-2))) + i;
            this.MT[i] = temp & 0xFFFFFFFF;
        }
    }

    public random(): number{
        return this.extract_number() / 2147483648;
    }

    private extract_number(): number{
        if(this.index >= this.n){
            this.twist();
            this.index = 0;
        }

        let y:number = this.MT[this.index];
        y = y ^ ((y >> this.u) & this.d);
        y = y ^ ((y << this.s) & this.b);
        y = y ^ ((y << this.t) & this.c);
        y = y ^ (y >> this.l);

        this.index++;

        return y & 0xffffffff;
    }

    private twist(): void{
        for(let i=0; i<this.n; i++){
            const x:number = (this.MT[i] & this.upper_mask) + (this.MT[(i+1) % this.n] & this.lower_mask);
            let xA:number = x >> 1;
            if((x % 2) != 0)
                xA = xA ^ this.a;
            this.MT[i] = this.MT[(i + this.m) % this.n] ^ xA;
        }
    }
}

export const DX = [0,0,-1,1];
export const DY = [-1,1,0,0];