import { InsLinkType } from "../src/enum/enum.handler"
import { InsJsonDataType } from "."
import {Loop} from "./loop" 


export class Parser  { 
    
    constructor(loop:Loop)   

    parse(url:string,type:InsLinkType):Promise<InsJsonDataType> 
    
    parsePost(url:string):Promise<InsJsonDataType> 

    parseIg(url:string):Promise<InsJsonDataType> 
 
}






