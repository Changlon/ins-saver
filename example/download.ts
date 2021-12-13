
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
    proxy:"http://127.0.0.1:1080"
}

const saver = new InsSaver(config)  

saver.download("https://scontent-hkt1-2.cdninstagram.com/v/t51.2885-15/e35/s1080x1080/247245200_999342443975287_3418844811952166141_n.jpg?_nc_ht=scontent-hkt1-2.cdninstagram.com&_nc_cat=107&_nc_ohc=E1I0HoylhrAAX8g1t5m&edm=AABBvjUBAAAA&ccb=7-4&oh=00_AT-LRlwhfazpd-VmXBrUE7TTx6wd9gWIaWcDYL48ZJG9Cw&oe=61BE149E&_nc_sid=83d603")
.then(r => {
    console.log(r)
})





