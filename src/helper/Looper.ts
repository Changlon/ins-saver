import { Loop } from "loop"
import { CookieType, InsKeeperConfig } from "../../typings"
import Event from 'events' 
import useragentFromSeed from 'useragent-from-seed' 
import request from 'request'
import { EventHandlerType } from "../enum/enum.handler"
import {info,log,warn} from "../utils/msg" 

class Looper implements Loop {

    private config :InsKeeperConfig 
    private event :Event.EventEmitter 
    private looper:NodeJS.Timeout
    private useNumMap:Map<string|number,number> //记录cookie使用数量
    private currentCookieIndex = 0 
    
    constructor(config:InsKeeperConfig,event:Event.EventEmitter) { 
        this.config = config
        this.event = event  
        this.useNumMap = new Map() 
        this.startLoop() 
    }
    
    checkCookie(isBad: boolean): void {  
        const cookie = this.config.cookies[this.currentCookieIndex]  
        if(cookie) {
            const key = typeof cookie === "string" ? cookie : (cookie.username || cookie.cookie ) 
            if(!isBad) { 
                let usedNum = this.useNumMap.get(key)  
                usedNum === undefined ? this.useNumMap.set(key,0) : 
                (
                    ++usedNum, 
                    usedNum <= this.config.useCookieMaxNum ?  this.useNumMap.set(key,usedNum)  : 
                    this.useNumMap.set(key,0),
                    this.toggle()
                )
            }else{
                const abnormal =  (this.config.cookies.splice(this.currentCookieIndex,1))[0] 
                this.useNumMap.set(key,null) 
                this.currentCookieIndex-- 
                abnormal ?  this.event.emit(EventHandlerType.HANDLE_OUT_COOKIE,abnormal) && this.toggle() :  this.toggle()
            }
            
        }else{ 
            this.toggle()
        }
        
    }

    async getJsonData(url: string): Promise<string> {   
        const this_ = this
        const {userAgent,usedNum,cookie,key} = this.getHeaders()  
        const option = { 
            username:key, 
            url,
            method:'GET',
            proxy: this_.config.proxy,
            headers: {
                "User-Agent": userAgent,
                "Cookie":cookie
            }
        }
        
        log({
            ...option,
            usedNum,
            runningNum:this_.config.cookies.length,
            // runningCookies: JSON.stringify(this_.config.cookies) 
        },"InsSaver Request Log!")
       
        return new Promise((r,j)=>{ 
            request(option,(err,res,body)=>{  
                if( !err && body ) {   
                    this_.checkCookie(false)
                    switch (res.statusCode) { 
                        case 200:  
                            if((body as string).startsWith("<!DOCTYPE html>")) {
                                j({
                                    status:200,
                                    error: new Error(`cookie无效！`)
                                })
                            }else{
                                r(body)
                            }
                            break

                        case 404: 

                            j({
                                status:404,
                                error: new Error(`未获取到资源 404!`)
                            })
                            break
                    }

                }else if(err) {
                    j({
                        status:res?.statusCode || 500,
                        error: new Error(`网络连接错误！ ${err}`)
                    })
                }
            })
        })
    }

    private getHeaders():{
        userAgent:string,
        cookie:string,
        usedNum:number,
        key:string

    }{
        let userAgent :string,cookie:string,usedNum:number   
        const cookie_ = this.config.cookies[this.currentCookieIndex]  
        const key  = typeof cookie_ === "string" ? cookie_ : typeof cookie_ === "object" ? (cookie_.username || cookie_.cookie) :""  
        usedNum = this.useNumMap.get(key)  === undefined ? 0 : this.useNumMap.get(key)
        cookie = typeof cookie_ == "string" ? cookie_ : typeof cookie_ === "object" ? cookie_.cookie : "" 
        userAgent = useragentFromSeed(key) 
        return {
            userAgent,
            cookie,
            key,
            usedNum
        }
    }


    private startLoop(): void { 
        const this_ = this 
        const loopHandler = ()=>{ 
            this_.looper ? clearTimeout(this_.looper) : void 0  
            const cookie =  this_.config.cookies[this_.currentCookieIndex] 
            if(cookie) {
                const key = typeof cookie === "string" ? cookie : (cookie.username || cookie.cookie ) 
                this_.useNumMap.set(key,0) 
                this_.toggle()
            }
            this_.looper = setTimeout(loopHandler,this_.config.switchCookieInterval) 
        }
        
        this_.looper = setTimeout(loopHandler,this_.config.switchCookieInterval)
    }


    // TOGGLE COOKIE
    private toggle() {
        this.currentCookieIndex++
        this.currentCookieIndex >= this.config.cookies.length ?  this.currentCookieIndex = 0 : void 0

        //CHECK COOKIES NUM 
        if(!this.config.cookies.length){ 
            info("当前没有可用的cookie了，自动调用getCookie函数获取，请确保函数能返回正确的cookie数组")
            return this.add()
        }

        const cookie =  this.config.cookies[this.currentCookieIndex]  
        info(`切换到第${this.currentCookieIndex}个cookie : ${JSON.stringify(cookie)}`)  
        info(`当前运行的cookie数量: ${this.config.cookies.length}`) 
        
    }

    //ADD THE COOKIES IF CONFIG.COOKIES IS ZERO 
    private async add() { 
        this.config.cookies = (await this.config.getCookie())  
        info(`自动添加获取到的cookies:${JSON.stringify(this.config.cookies)}`) 
    }
    

  
}


export = Looper