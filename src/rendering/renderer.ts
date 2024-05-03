import { Enemy } from "../gameplay/fighting.js";
import { Player } from "../gameplay/player.js";
import { Level } from "../gameplay/world.js";


export class Renderer{
    private canvas: HTMLCanvasElement;
    private gl: WebGLRenderingContext;
    private drawQueue: any[];


    constructor(canvas: HTMLCanvasElement){
        this.gl = canvas.getContext("webgl");
        this.canvas = canvas;
    }

    public updateCanvasSize(): void{
        let width: number = this.canvas.clientWidth;
        let height: number = this.canvas.clientHeight;
        this.canvas.width = width;
        this.canvas.height = height;
        this.gl.viewport(0,0,width,height);
    }

    public addObject(
        vertices: number[],
        indices: number[],
        shaders:{fragment:string,vertex:string},
        viewmatrix: number[] = [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
        otherattributes?): void{
        let vertexShader:WebGLShader = this.createShader(this.gl.VERTEX_SHADER,shaders.vertex);
        let fragmentShader:WebGLShader = this.createShader(this.gl.FRAGMENT_SHADER,shaders.fragment);
        
    }

    public drawFrame(): void{
        for(let i:number; i<this.drawQueue.length; i++){
            this.drawQueue[i].draw();
        }
    }

    private createShader(type: number,source: string): WebGLShader{
        let shader = this.gl.createShader(type);
        this.gl.shaderSource(shader,source);
        this.gl.compileShader(shader);
        let success = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
        if(success){
            return shader;
        }
        console.error(this.gl.getShaderInfoLog(shader));
        this.gl.deleteShader(shader);
    }

    private createProgram(){
        
    }
}