import request from 'request' 
import fs from 'fs'
import InsKeeper, { InsKeeperConfig,CookieType,InsJsonDataType, QueueType, downloadFileType } from "../typings" 
import  Event  from 'events'
import {createUrl,createTvUrl,getShortCode} from './utils/url' 
import Looper from './helper/Looper'
import  Parser  from './helper/Parser'
import { EventHandlerType, InsLinkType } from './enum/enum.handler'
import * as msg from './utils/msg' 

const { warn ,log } = msg

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
        this.event = new Event.EventEmitter() 
        this.queue = []        
        this.regiteEvent() 
        this.config = config  
        config.cookies = config.cookies || (await config.getCookie())
        this.loop = new Looper(this.config,this.event) 
        this.parser = new Parser(this.loop) 
        this.config.cookies.length > 0 ? (this.ready = true , this.event.emit(EventHandlerType.HANDLE_QUEUE)) : warn("getCookie 获取到0个cookie, 请编写能正确返回cookie的异步函数！") 
    }


    private regiteEvent(): void {  
        const this_ = this 
        this_.event.on(EventHandlerType.HANDLE_QUEUE,async ()=>{   
            while(this_.queue.length > 0 && this_.ready) {

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
        this_.event.on(EventHandlerType.HANDLE_OUT_COOKIE,async (cookie:CookieType)=>{this_.config.outCookie(cookie)}) 
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
                    statusCode: -1 ,
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
            
            let isExpiredUrl : boolean = false 
            
            request({
                url,
                proxy: this_.config.proxy, 
            },(err,res,body)=>{
                if(err) return r({
                    status:"error",
                    statusCode:res.statusCode,
                    createtime: new Date(),
                    error:new Error(err)     
                })

                //CHECK IF URL signature expired
                if(res.statusCode === 403 && body === "URL signature expired") { 
                    isExpiredUrl = true 
                    r({
                        status:"error",
                        statusCode:403,
                        createtime: new Date(),
                        error:new Error(body)     
                    })
                }
            })
            .pipe(fs.createWriteStream(fullpath))
            .on('close', () => {
                if(!isExpiredUrl && fs.existsSync(fullpath) && fs.statSync(fullpath).size > 21 ) {
                        const resolved:downloadFileType = {
                                            status:"ok",
                                            statusCode : 200,
                                            createtime:new Date(),
                                            filename:`${filename}${afterfix}`,
                                            filepath:this_.config.downloadPath,
                                            fullpath,
                                            size:fs.statSync(fullpath).size 
                                        } 
                        r(resolved)  
                        log(resolved,"InsSaver Download Sucess!","yellow")
                }
            })
            .on('err',err=>{ 
                const erred : downloadFileType = {
                    status:"error",
                    statusCode : -1 ,
                    createtime: new Date(),
                    error:new Error(err)     
                }
                r(erred)
                warn(`insSaver downloadFile failed! errInfo : ${erred}`)
            })
        })
    }
} 


InsSaver.msg = msg 

export = InsSaver 



 

