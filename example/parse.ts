import { CookieType, InsKeeperConfig } from "../typings"
import InsSaver from '../src'   

const config :InsKeeperConfig = {
    getCookie:async function (): Promise<CookieType[]> {
       return [
          "mid=Yfo1dQALAAHl-ZixhGXTxOTmiGVX;ig_did=21813403-1968-4957-A18D-E8ECF5329C8C;ig_nrcb=1;csrftoken=dubg4aR6VzlezylV7U8A6xDnC0TJ8rUT;ds_user_id=51675573945;sessionid=51675573945%3AKgn5PeHkOnjdvJ%3A21;rur=NAO,51675573945,1675973170:01f784c061bfb5b6aff7cee345d5583da0b5632049a4311a092f7c0533fcec250c13a3f8;"
       ]
    },
    downloadPath: "D:\\CodeFiles\\workplace\\ins\\ins-saver\\resources\\",
    switchCookieInterval:1000 * 60,
    proxy:"http://127.0.0.1:1080" 
}


const saver = new InsSaver(config) 

saver.analysisPost("https://www.instagram.com/p/CSBUwGmB8mF/?utm_medium",async (data)=>{ 
    console.log(data)
}) 
