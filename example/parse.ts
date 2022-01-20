import { CookieType, InsKeeperConfig } from "../typings"
import InsSaver from '../src'   

const config :InsKeeperConfig = {
    getCookie:async function (): Promise<CookieType[]> {
       return [
          "csrftoken=F1eFKC9tBNdinM1zB24XNNDT6tEClXux;mid=YYhmrwABAAGAA-s9TgLGt-twGPUA;ig_nrcb=1;rur=FRC,51080639397,1674124552:01f7a64e7d59f7bed18d336c2243e8a4c7e7e5c23613a4ed6a4bc0757a96c5f886cfd1cc;ds_user_id=51080639397;ig_did=7B5C1854-44F1-4EB5-A011-49D76053C8CE;sessionid=51080639397%3AsXo81EOkFJ1w9e%3A1;"
       ]
    },
    downloadPath: "D:\\CodeFiles\\workplace\\ins\\ins-saver\\resources\\",
    switchCookieInterval:1000 * 60,
    proxy:"http://127.0.0.1:1080" 
}


const saver = new InsSaver(config) 

saver.analysisPost("https://www.instagram.com/tv/CY6u8bwreJE/?utm_medium=copy_link",async (data)=>{ 
    console.log(data)
}) 
