import { EventHandlerType, InsLinkType } from "enum"
import InsKeeper, { InsKeeperConfig,CookieType,InsJsonDataType, QueueType, downloadFileType } from "../typings" 
import  Event  from 'events'
import {Loop} from "loop"
import {Parser} from "parser"
import request from 'request' 
import fs from 'fs'


class InsSaver implements InsKeeper {
    
    private config:InsKeeper.InsKeeperConfig 
    private loop : Loop
    private parser: Parser
    private event : Event.EventEmitter 
    private ready :boolean 
    private queue:InsKeeper.QueueType[] 


    constructor(config:InsKeeperConfig) {  
        this.init(config)
    }

    async init(config: InsKeeper.InsKeeperConfig): Promise<any> {   
        this.ready = false 
        config.switchCookieInterval = config.switchCookieInterval || (1000*60*10) 
        config.useCookieMaxNum = config.useCookieMaxNum || 24 
        config.outCookie = config.outCookie || (async cookie => {}) 
        config.cookies = config.cookies || (await config.getCookie())
        this.config = config  
        this.event = new Event.EventEmitter() 
        this.queue = []         
        this.regiteEvent() 
         //TODO 完成Loop ,Parser类
        // this.loop = {} 
        // this.parser = {} 
        this.config.cookies.length > 0 ? (this.ready = true && this.event.emit(EventHandlerType.HANDLE_QUEUE)) : void 0  
        
    }

  
    private regiteEvent(): void {  

        const this_ = this 

        this_.event.on(EventHandlerType.HANDLE_QUEUE,async ()=>{  
            while(this_.queue.length > 0) {
                const task = this_.queue.shift()
                const callback = task.callback || (async (json:InsJsonDataType)=>{})
                let json:InsJsonDataType 
                switch (task.type) { 
                    case InsLinkType.POST: 
                        json = await this_.parser.parsePost(task.url)  
                        break 
                    case InsLinkType.IG: 
                        json = await this_.parser.parseIg(task.url) 
                        break
                     default:
                         break   
                }
                callback(json)  
            } 
            
        })
        
        this_.event.on(EventHandlerType.HANDLE_OUT_COOKIE,async (cookie:CookieType)=>{await this_.config.outCookie(cookie)}) 
        
    }



    analysis(urlOrCode: string, type: InsLinkType, handleDataCallback?: (json: InsKeeper.InsJsonDataType) => Promise<any>): InsKeeper {
        const task:QueueType = {
            type,
            code: getCode(urlOrCode), 
            url: type === InsLinkType.POST ? createPost(urlOrCode) :
                 type === InsLinkType.IG ?  createIg(urlOrCode):urlOrCode ,
            callback: handleDataCallback
                
        }
        this.queue.push(task) 
        return this.ready ?  (this.event.emit(EventHandlerType.HANDLE_QUEUE) && this) : this  
    }

    analysisPost(urlOrCode: string, handleDataCallback: (json: InsKeeper.InsJsonDataType) => Promise<any>): InsKeeper {
       return this.analysis(urlOrCode,InsLinkType.POST,handleDataCallback) 
    }
    
    analysisIg(urlOrCode: string, handleDataCallback: (json: InsKeeper.InsJsonDataType) => Promise<any>): InsKeeper {
        return this.analysis(urlOrCode,InsLinkType.IG,handleDataCallback) 
    }

    download(url: string, filename?: string): Promise<InsKeeper.downloadFileType> {
        
        const this_ = this 
        
        return new Promise((r,j)=>{ 
         
            if(!url) {
                let r_:downloadFileType = {
                    status: "error",
                    createtime: new Date(),
                    error : new Error(`url : ${url} is required!`) ,
                    
                } 
                return r(r_)
            }
            const afterfix = /.jpg/g.test(url) ? '.jpg' : 
                            /.mp4/g.test(url) ? '.mp4' : '' 

            filename = filename || new Date().getTime().toString()
            const fullpath = `${this_.config.downloadPath}${filename}${afterfix}`   
            
            if(!fs.existsSync(this_.config.downloadPath)) fs.mkdirSync(this_.config.downloadPath) 
            
            request({
                url,
                proxy: this_.config.proxy, 
            })
            .pipe(fs.createWriteStream(fullpath))
            .on('close', () => {
                if(fs.existsSync(fullpath)) {
                    r( {
                        status:"ok",
                        createtime:new Date(),
                        filename:`${filename}${afterfix}`,
                        filepath:this_.config.downloadPath,
                        fullpath,
                        size:fs.statSync(fullpath).size 
                    } as downloadFileType)
                }else{
                    r( {
                        status:"error",
                        createtime:new Date(),
                        error : new Error(`文件下载失败!`)
                    } as downloadFileType)
                }
            })
            .on('err',err=>{ 
                r({ 
                    status:"error",
                    createtime: new Date(),
                    error:new Error(err)     
                } as downloadFileType)
            })
        })
    }
    
} 

let config:InsKeeperConfig = {
    getCookie: function (): Promise<CookieType[]> {
        throw new Error("Function not implemented.")
    },
    downloadPath: ""
} 


export = InsSaver


