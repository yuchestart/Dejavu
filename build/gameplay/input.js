export class Input {
    constructor() {
        this.KeyDown = {};
        this.Mouse = {
            position: { x: -1, y: -1 },
            Button1Down: false,
            Button2Down: false,
            Button3Down: false
        };
        this.container = document;
        this.container.addEventListener("keydown", (e) => this.keyboardEventListener(e));
        this.container.addEventListener("keyup", (e) => this.keyboardEventListener(e));
        this.container.addEventListener("mousedown", (e) => this.mouseEventListener(e));
        this.container.addEventListener("mouseup", (e) => this.mouseEventListener(e));
        this.container.addEventListener("mousemove", (e) => this.mouseEventListener(e));
    }
    keyboardEventListener(e) {
        switch (e.type) {
            case "keydown": {
                this.KeyDown[e.code] = true;
                break;
            }
            case "keyup": {
                this.KeyDown[e.code] = false;
                break;
            }
        }
    }
    mouseEventListener(e) {
        switch (e.type) {
            case "mousemove": {
                this.Mouse.position = {
                    x: e.offsetX,
                    y: e.offsetY
                };
                break;
            }
            case "mousedown": {
                switch (e.button) {
                    case 0: {
                        this.Mouse.Button1Down = true;
                        break;
                    }
                    case 1: {
                        this.Mouse.Button2Down = true;
                        break;
                    }
                    case 2: {
                        this.Mouse.Button3Down = true;
                        break;
                    }
                }
                break;
            }
            case "mousedown": {
                switch (e.button) {
                    case 0: {
                        this.Mouse.Button1Down = false;
                        break;
                    }
                    case 1: {
                        this.Mouse.Button2Down = false;
                        break;
                    }
                    case 2: {
                        this.Mouse.Button3Down = false;
                        break;
                    }
                }
                break;
            }
        }
    }
}
export function initEvents(id) {
}
