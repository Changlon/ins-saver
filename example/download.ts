
import InsSaver from '../src'   
import { CookieType, InsKeeperConfig } from '../typings'


let config :InsKeeperConfig = {
    getCookie: async function (): Promise<CookieType[]> {
        return [
            {
                username : "test_cookie_1",
                cookie: "csrftoken=hxGbDuBHR4nM2C0cVVHrsDT4pDfnGXMy;rur=ATN;ds_user_id=48888644144;sessionid=48888644144%3AATiVVxHTkAI8Dx%3A3"
                
            }
        ]
    },
    downloadPath: 'D:\\CodeFiles\\workplace\\ins\\ins-saver\\resources\\' ,
    // proxy:"http://127.0.0.1:1080"
}

const saver = new InsSaver(config)  

saver.download("https://qiniu.ujnhand.com/ins/145322388_prem_space_avatar_1639922223585.jpg")
.then(r => {
    console.log(r)
})





