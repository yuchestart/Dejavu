var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Sprite, Mesh, MeshPhongMaterial, MeshBasicMaterial, TextureLoader, SRGBColorSpace, SpriteMaterial } from "three";
import { deg2rad } from "../utilities/utilities.js";
export class Entity {
    constructor() {
        this.objectProperties = {
            texture: null,
            geometry: null
        };
        this.position = { x: 0, y: 0, rotation: 0 };
        this.material = null;
    }
    initializeObject(type = "billboard") {
        this.objectType = type;
        if (type === "billboard") {
            this.object = new Sprite();
        }
        else if (type === "mesh") {
            this.object = new Mesh();
        }
        else {
            throw new TypeError("Invalid object type");
        }
    }
    initializeTexture(texturePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const loader = new TextureLoader();
            const texture = yield loader.loadAsync(texturePath);
            texture.colorSpace = SRGBColorSpace;
            this.objectProperties.texture = texture;
        });
    }
    initializeMaterial(materialType = "basic") {
        if (this.objectType === "billboard") {
            this.material = new SpriteMaterial({
                map: this.objectProperties.texture
            });
            return;
        }
        if (materialType === "basic") {
            this.material = new MeshBasicMaterial({
                map: this.objectProperties.texture
            });
        }
        else if (materialType === "phong") {
            this.material = new MeshPhongMaterial({
                map: this.objectProperties.texture
            });
        }
        else {
            throw new TypeError("Invalid material type");
        }
    }
    prepareObjectForRendering() {
        if (this.objectType === "billboard") {
            this.object.material = this.material;
        }
        else if (this.objectType === "mesh") {
            this.object.material = this.material;
        }
        else {
            throw new TypeError("Invalid object type");
        }
    }
    updatePosition(x, y, rot) {
        this.position.x = x;
        this.position.y = y;
        this.object.position.x = this.position.x;
        this.object.position.z = this.position.y;
        this.position.rotation = rot;
        this.object.rotation.y = deg2rad(this.position.rotation);
    }
    updateRotation(rot) {
        this.position.rotation = rot;
        this.object.rotation.y = deg2rad(rot);
    }
}
export class PlaceholderEntity extends Entity {
    constructor() {
        super();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.initializeObject("billboard");
            yield this.initializeTexture("./assets/img/placeholdermonster.png");
            this.initializeMaterial();
            this.material.needsUpdate = true;
            this.prepareObjectForRendering();
            this.updatePosition(5, 5, 0);
        });
    }
    behavior() {
    }
}
