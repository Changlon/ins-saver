

import Looper from '../src/helper/Looper' 
import { CookieType, InsKeeperConfig } from '../typings'
import Event from 'events'

const config :InsKeeperConfig = {
    getCookie:async function (): Promise<CookieType[]> {
       return [
          "csrftoken=hxGbDuBHR4nM2C0cVVHrsDT4pDfnGXMy;rur=ATN;ds_user_id=48888644144;sessionid=48888644144%3AATiVVxHTkAI8Dx%3A3"
       ]
    },
    cookies:["csrftoken=hxGbDuBHR4nM2C0cVVHrsDT4pDfnGXMy;rur=ATN;ds_user_id=48888644144;sessionid=48888644144%3AATiVVxHTkAI8Dx%3A3"],
    downloadPath: "d:\\",
    switchCookieInterval:1000 * 60,
    proxy:"http://127.0.0.1:1080"
}

try {
    new Looper(config,new Event.EventEmitter())
    .getJsonData("https://www.instagram.com/p/CWmVITVvM0R/")  
    .then(r=>{
        console.log(r)
    })
    .catch(e=>{
        console.log(e)
    })
    
}catch(e) {
    console.log(e)

}


