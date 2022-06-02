import { CookieType, InsKeeperConfig } from "../typings"
import InsSaver from '../src'   

const config :InsKeeperConfig = {
    getCookie:async function (): Promise<CookieType[]> {
       return [
          'mid=Yj4ViwAAAAEXgG1gJxFGd0T8K2jf; ig_did=3B88C3A5-EBB9-4919-9147-16558DC8792C; ig_nrcb=1; csrftoken=NpdNMpk7h2rQba6YZPwXtr6IxdP0CrZL; ds_user_id=52988520244; sessionid=52988520244%3ArxYYFaipiG1zgw%3A22; dpr=2; datr=iseXYl3LWZxQjEa4oTIU9oGY; rur="PRN;52988520244;1685651284:01f75257d0377dc74adc42112dabd96ef4795903f4b703170a709974a670a87aa3bd4ad2"'
       ]
    },
    downloadPath: "D:\\CodeFiles\\workplace\\ins\\ins-saver\\resources\\",
    switchCookieInterval:1000 * 60,
    proxy:"http://127.0.0.1:1080" 
}


const saver = new InsSaver(config) 

saver.analysisPost("http://www.instagram.com/p/CeRtG94Fw84/?utm_medium",async (data)=>{ 
    console.log(data)
}) 
