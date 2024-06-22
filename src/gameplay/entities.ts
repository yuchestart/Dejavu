import { Sprite , Mesh, MeshPhongMaterial, MeshBasicMaterial, TextureLoader, SRGBColorSpace, Texture, SpriteMaterial } from "three";
import { $ } from "../utilities/utilities.js";
import { Player } from "./player.js";
import { Level } from "./world.js";

export enum EnemyTypes{
    ScreamingChaser="screamingchaser",
    NeckSnapper="necksnapper",
    ShallNotPass="shallnotpass",
    StairChaser="stairchaser",
    ShadowyPianoMan="shadowypianoman",
}

export class Entity{
    private texturePath: string;
    private objectProperties:{texture:Texture|null,geometry?:any} = {
        texture:null,
        geometry:null
    };
    private material: MeshPhongMaterial | MeshBasicMaterial | SpriteMaterial | null = null;
    private objectType: string;
    public object: Sprite | Mesh;

    //#region Initialization

    public initializeObject(type:string = "billboard"): void{
        this.objectType = type;
        
        if(type == "billboard"){
            this.object = new Sprite();
        } else if(type == "mesh"){
            this.object = new Mesh();
        } else {
            throw new TypeError("Invalid mesh type");
        }
    }

    public async initializeTexture(texturePath: string): Promise<void>{
        const loader = new TextureLoader();
        const texture:Texture = await loader.loadAsync(texturePath);
        texture.colorSpace = SRGBColorSpace;
    }

    public initializeMaterial(materialType: string = "basic"): void{
        if(this.objectType == "billboard"){
            this.material = new SpriteMaterial({
                map: this.objectProperties.texture
            });

            return;
        }
        if(materialType == "basic"){
            this.material = new MeshBasicMaterial({
                map: this.objectProperties.texture
            });
        } else if(materialType == "phong"){
            this.material = new MeshPhongMaterial({
                map: this.objectProperties.texture
            });
        } else {
            throw new TypeError("Invalid material type");
        }
    }

    //#endregion

    public prepareObjectForRendering():void{
        this.object.material = this.material;
        this.object.
    }


}

export async function loadMonsters(): Promise<void>{

}