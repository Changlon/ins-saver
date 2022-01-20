 
import {describe,it,expect} from '@jest/globals'
import { doesNotThrow } from 'assert'
import InsSaver from '../src/index' 

describe("Class InsSaver",()=>{
    
    const saver =  new InsSaver({
        getCookie:async ()=>["csrftoken=iMbrvbsJX9lczAHzPSSyDPGiVxVr92fg;mid=YYhmrAABAAFaDeSzKGfQGaQZSTAz;ig_nrcb=1;rur=CLN,51605286108,1674123225:01f791dd0acc5cf5f4dd0028372d24f052bc52e605d2b60923bc52385a8d598b2b61d654;ds_user_id=51605286108;ig_did=1F372D0F-BB8F-4B78-8FD5-03E52F825EDA;sessionid=51605286108%3AU3zjGdGmIBZeB1%3A14;"],
        downloadPath:"D:\\CodeFiles\\workplace\\ins\\ins-saver\\resources\\" ,
        proxy:"http://127.0.0.1:1080" //you can remove this option if you in the outside network or do not use the proxy 
    })

    it("Class InsSaver export  some static  functions",()=>{
        expect(typeof InsSaver.info).toBe("function")
        expect(typeof InsSaver.warn).toBe("function")
        expect(typeof InsSaver.log).toBe("function")
        expect(typeof InsSaver.createTvUrl).toBe("function")
        expect(typeof InsSaver.createUrl).toBe("function")
        expect(typeof InsSaver.getShortCode).toBe("function")
    }) 
 
    it("download of instance from Class InsSaver",done=>{
        saver.download("https://qiniu.ujnhand.com/ins/145322388_prem_space_avatar_1639922223585.jpg","test")
             .then(data=>{ 
                 expect(data).toBeInstanceOf(Object) 
                 done()
        })
    })

    it("expect the analysisXXX function return the right data",done=>{
        saver.analysisPost("https://www.instagram.com/p/CW0l-MRJEbr/?utm_medium=copy_link",async data=>{ 
            expect(data.version === 1 || data.version === 2).toBe(true)
            done()
        })
    })
})



