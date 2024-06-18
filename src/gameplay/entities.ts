import { Sprite , Mesh } from "three";
import { $ } from "../utilities/utilities.js";
import { Player } from "./player.js";
import { Level } from "./world.js";

export enum EnemyTypes{
    ScreamingChaser,
    NeckSnapper,
    ShallNotPass,
    StairChaser,
    ShadowyPianoMan,
}

export class Entity{
    private texturePath: string;
    public object: Sprite | Mesh;





    public initializeObject():void{
        
        this.object = new Sprite();
    }


}