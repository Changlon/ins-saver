
import  Event from 'events'
import { InsKeeperConfig } from '.' 

 export class Loop {

    private config :InsKeeperConfig 
    private event :Event.EventEmitter 
    private looper:NodeJS.Timeout
    private useNumMap:Map<string|number,number> //记录cookie使用数量
    
    constructor(config:InsKeeperConfig,event:Event.EventEmitter)  

    startLoop ():void 

    checkCookie(isBad:boolean):void 
    
    getJsonData(url:string):Promise<string>   
    

}





