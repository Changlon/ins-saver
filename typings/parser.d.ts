import exp from "constants"
import { InsLinkType } from "enum"
import { InsJsonDataType } from "."
import {Loop} from "./loop" 


export class Parser  { 
    

    private loop : Loop 
    
    constructor(loop:Loop)   

    parse(url:string,type:InsLinkType):Promise<InsJsonDataType> 
    
    parsePost(url:string):Promise<InsJsonDataType> 

    parseIg(url:string):Promise<InsJsonDataType> 

    
    /**
     * TODO : 链接parser后面可能有主页的，等等
     * @param json 
     */
    private linkJsonParser(json:{[k:string|number|symbol]:any}) :InsJsonDataType  
    
    
}






