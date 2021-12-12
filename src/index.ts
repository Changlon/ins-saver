import request from 'request' 
import fs from 'fs'
import InsKeeper, { InsKeeperConfig,CookieType,InsJsonDataType, QueueType, downloadFileType } from "../typings" 
import  Event  from 'events'
import {createUrl,createTvUrl,getShortCode} from './utils/url' 
import Looper from './helper/Looper'
import  Parser  from './helper/Parser'
import { EventHandlerType, InsLinkType } from './enum/enum.handler'
import * as msg from './utils/msg' 

const { warn } = msg

class InsSaver implements InsKeeper {

    private config:InsKeeper.InsKeeperConfig 
    private loop : Looper
    private parser: Parser
    private event : Event.EventEmitter 
    private ready :boolean 
    private queue:InsKeeper.QueueType[] 
    static msg: typeof msg

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
        this.loop = new Looper(config,this.event) 
        this.parser = new Parser(this.loop) 
        this.config.cookies.length > 0 ? (this.ready = true && this.event.emit(EventHandlerType.HANDLE_QUEUE)) : void 0  
    }


    private regiteEvent(): void {  
        const this_ = this 
        this_.event.on(EventHandlerType.HANDLE_QUEUE,async ()=>{  
            while(this_.queue.length > 0) {
                const task = this_.queue.shift()
                const callback = task.callback || (async (json:InsJsonDataType)=>{})
                let json:InsJsonDataType 
                try {
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
                }catch(e) { 
                    warn(e)
                }
            } 
        })
        this_.event.on(EventHandlerType.HANDLE_OUT_COOKIE,async (cookie:CookieType)=>{await this_.config.outCookie(cookie)}) 
    }

    analysis(urlOrCode: string, type: InsLinkType, handleDataCallback?: (json: InsKeeper.InsJsonDataType) => Promise<any>): InsKeeper {
        const task:QueueType = {
            type,
            code: getShortCode(urlOrCode), 
            url: type === InsLinkType.POST ? createUrl(urlOrCode) :
                 type === InsLinkType.IG ?  createTvUrl(urlOrCode):urlOrCode ,
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
        return new Promise(r=>{ 
         
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
                if(fs.existsSync(fullpath) && fs.statSync(fullpath).size) {
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


InsSaver.msg = msg 

export = InsSaver 



 

