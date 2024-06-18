import { Point } from "../init.js";
import { $ } from  "../utilities/utilities.js"

export class Input{

    public container: /*HTMLCanvasElement*/ Document;
    public KeyDown:{[id: string]:boolean} = {};
    public Mouse:{
        position:Point,
        Button1Down:boolean,
        Button2Down:boolean,
        Button3Down:boolean
    } = {
        position:{x:-1,y:-1},
        Button1Down:false,
        Button2Down:false,
        Button3Down:false
    };

    constructor(){
        this.container = document;
        this.container.addEventListener("keydown",(e)=>this.keyboardEventListener(e));
        this.container.addEventListener("keyup",(e)=>this.keyboardEventListener(e));
        this.container.addEventListener("mousedown",(e)=>this.mouseEventListener(e));
        this.container.addEventListener("mouseup",(e)=>this.mouseEventListener(e));
        this.container.addEventListener("mousemove",(e)=>this.mouseEventListener(e));
        
    }

    private keyboardEventListener(e:KeyboardEvent){
        switch(e.type){
            case "keydown":{
                this.KeyDown[e.code] = true;
                break;
            }
            case "keyup":{
                this.KeyDown[e.code] = false;
                break;
            }
        }
    }

    private mouseEventListener(e:MouseEvent){
        switch(e.type){
            case "mousemove":{
                this.Mouse.position = {
                    x:e.offsetX,
                    y:e.offsetY
                };
                
                break;
            }
            case "mousedown":{
                switch(e.button){
                    case 0:{
                        this.Mouse.Button1Down = true;
                        break;
                    }
                    case 1:{
                        this.Mouse.Button2Down = true;
                        break;
                    }
                    case 2:{
                        this.Mouse.Button3Down = true;
                        break;
                    }
                }
                break;
            }
            case "mousedown":{
                switch(e.button){
                    case 0:{
                        this.Mouse.Button1Down = false;
                        break;
                    }
                    case 1:{
                        this.Mouse.Button2Down = false;
                        break;
                    }
                    case 2:{
                        this.Mouse.Button3Down = false;
                        break;
                    }
                }
                break;
            }
        }
        
    }



}

export function initEvents(id: string){
    
}