import { CookieType, InsKeeperConfig } from "../typings"
import InsSaver from '../src'   

const config :InsKeeperConfig = {
    getCookie:async function (): Promise<CookieType[]> {
       return [
          "csrftoken=hxGbDuBHR4nM2C0cVVHrsDT4pDfnGXMy;rur=ATN;ds_user_id=48888644144;sessionid=48888644144%3AATiVVxHTkAI8Dx%3A3"
       ]
    },
    downloadPath: "D:\\CodeFiles\\workplace\\ins\\ins-saver\\resources\\",
    switchCookieInterval:1000 * 60,
    proxy:"http://127.0.0.1:1080"
}


const saver = new InsSaver(config) 

saver.analysisPost("https://www.instagram.com/p/CXDzvDrPQry__/?utm_medium=copy_link",async (data)=>{ 
    console.log(data)
}) 
.analysisIg("https://www.instagram.com/tv/CXXh16UIGQL__/?__a=1",async data =>{
    console.log(data)
})