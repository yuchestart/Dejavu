import { Sprite , Mesh, MeshPhongMaterial, MeshBasicMaterial, TextureLoader, SRGBColorSpace, Texture, SpriteMaterial } from "three";
import { deg2rad } from "../utilities/utilities.js";
import { Player } from "./player.js";
import { Level } from "./world.js";

export abstract class Entity{
    public object: Sprite | Mesh;

    private texturePath: string;
    private objectProperties:{texture:Texture|null,geometry?:any} = {
        texture:null,
        geometry:null
    };
    private position: {x:number,y:number,rotation:number} = {x:0,y:0,rotation:0}
    private material: MeshPhongMaterial | MeshBasicMaterial | SpriteMaterial | null = null;
    private objectType: string;
    

    //#region Initialization

    public initializeObject(type:string = "billboard"): void{
        this.objectType = type;
        
        if(type === "billboard"){
            this.object = new Sprite();
        } else if(type === "mesh"){
            this.object = new Mesh();
        } else {
            throw new TypeError("Invalid object type");
        }
    }

    public async initializeTexture(texturePath: string): Promise<void>{
        const loader = new TextureLoader();
        const texture:Texture = await loader.loadAsync(texturePath);
        texture.colorSpace = SRGBColorSpace;
    }

    public initializeMaterial(materialType: string = "basic"): void{
        if(this.objectType === "billboard"){
            this.material = new SpriteMaterial({
                map: this.objectProperties.texture
            });

            return;
        }
        if(materialType === "basic"){
            this.material = new MeshBasicMaterial({
                map: this.objectProperties.texture
            });
        } else if(materialType === "phong"){
            this.material = new MeshPhongMaterial({
                map: this.objectProperties.texture
            });
        } else {
            throw new TypeError("Invalid material type");
        }
    }

    //#endregion

    public prepareObjectForRendering():void{
        if(this.objectType === "billboard"){
            this.object.material = this.material;
        } else if(this.objectType === "mesh"){
            this.object.material = this.material;
        } else {
            throw new TypeError("Invalid object type");
        }
    }

    public abstract behavior(...args):void

    private updatePosition(x: number, y: number,rot?: number): void{
        this.position.x = x;
        this.position.y = y;
        this.object.position.x = this.position.x;
        this.object.position.z = this.position.y;
        this.position.rotation = rot;
        this.object.rotation.y = deg2rad(this.position.rotation);
    }
    
    private updateRotation(rot?: number): void{
        this.position.rotation = rot;
        this.object.rotation.y = deg2rad(rot);
    }
}

export class PlaceholderEntity extends Entity{
    constructor(){
        super();
        this.initializeObject("billboard");
        this.initializeTexture("./assets/img/placeholdermonster.png")
    }
    public behavior(): void{

    }
}