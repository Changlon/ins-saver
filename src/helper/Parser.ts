
// import { InsLinkType } from 'enum';
import { Parser as ParserInterface } from 'parser' 
import { InsLinkType } from '../enum/enum.handler';
import { InsJsonDataType } from '../../typings'
import Looper from './Looper';

class Parser implements ParserInterface { 

    private loop : Looper 

    constructor(loop:Looper) { 
        this.loop = loop
    }


    parse(url: string, type: InsLinkType): Promise<InsJsonDataType> {
        throw new Error('Method not implemented.');
    }
    parsePost(url: string): Promise<InsJsonDataType> {
        throw new Error('Method not implemented.');
    }
    parseIg(url: string): Promise<InsJsonDataType> {
        throw new Error('Method not implemented.');
    } 

     /**
     * TODO : 链接parser后面可能有主页的，等等
     * @param json 
     */
     private linkJsonParser(json:{[k:string|number|symbol]:any}): InsJsonDataType{  
         return 
     }
    
}



export = Parser