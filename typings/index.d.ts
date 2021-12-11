

import  Event from 'events'
import { type } from 'os'

 
//请求链接的类型
declare enum InsLinkType { 
    POST = "post",
    IG = "ig" 
}
    



declare class InsKeeper {  


    private config:InsKeeper.InsKeeperConfig 
    private loop : {}
    private parser: {} 
    private event : Event.EventEmitter 
    private ready :boolean 
    private queue:InsKeeper.QueueType[] 

    
    constructor(config:InsKeeper.InsKeeperConfig )  

    init(config:InsKeeper.InsKeeperConfig ):Promise<any> 

    regiteEvent():void  

    analysis(urlOrCode:string,handleDataCallback:(json:InsKeeper.InsJsonDataType)=>Promise<any>,type:InsLinkType): InsKeeper   
    
    analysisPost(urlOrCode:string,handleDataCallback:(json:InsKeeper.InsJsonDataType)=>Promise<any>): InsKeeper

    analysisIg(urlOrCode:string,handleDataCallback:(json:InsKeeper.InsJsonDataType)=>Promise<any>): InsKeeper  

    download(url:string,filename?:string):Promise<InsKeeper.downloadFileType>  
    
}


declare namespace InsKeeper { 
    
    type InsKeeperConfig = {  
    
        getCookie: ()=> Promise<CookieType[]> ,
        downloadPath:string,  
        outCookie?: ()=> Promise<CookieType> | CookieType ,
        proxy?:string,   
        switchCookieInterval?:number 
        useCookieMaxNum?:number,
        
    }

    type CookieType = {
        cookie:string,
        username?:string,
        id?:number,
        [k:string]:any
    } | string  
    
    
    type QueueType = {
        type:InsLinkType,
        code:string,
        url:string,
        callback:(json:InsKeeper.InsJsonDataType)=>Promise<any>
    }



    //返回ins json数据的类型
      type InsJsonDataType = {  
        id:number,
        shortcode:string,
        caption:string, //帖子描述
        owner:{ 
            id:number,
            profile_pic_url:string, //用户头像url
            username:string,
            full_name:string,
        },
        is_multiple:boolean,
        list: {
            id:string,
            shortcode:string,
            display_url:string,
            url:string,
            is_video:boolean,
            type:string
        }[]
        
    }
    
    
    //下载文件返回的类型
     type downloadFileType = { 
        status: "ok" | "error", 
        createtime:Date 
        error?:Error,
        type ? : "video" | "image",  
        filename?:string,
        filepath?:string,
        fullpath?:string,
        size?:number,
    }
    
   


    
 

}



export = InsKeeper 













