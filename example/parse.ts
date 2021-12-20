import { CookieType, InsKeeperConfig } from "../typings"
import InsSaver from '../src'   

const config :InsKeeperConfig = {
    getCookie:async function (): Promise<CookieType[]> {
       return [
          "csrftoken=Kcrhd1oKyb7vMo9fLtoevYDTFGUxI9HU;rur=PRN;ds_user_id=50964005995;sessionid=50964005995%3AM1lalwmPzDDchM%3A27"
       ]
    },
    downloadPath: "D:\\CodeFiles\\workplace\\ins\\ins-saver\\resources\\",
    switchCookieInterval:1000 * 60,
    proxy:"http://127.0.0.1:1080"
}


const saver = new InsSaver(config) 

saver.analysisPost("http://www.instagram.com/p/CXDzvDrPQry/?utm_medium=copy_link",async (data)=>{ 
    console.log(data)
}) 
.analysisIg("https://www.instagram.com/tv/CXXh16UIGQL__/?__a=1",async data =>{
    console.log(data)
})