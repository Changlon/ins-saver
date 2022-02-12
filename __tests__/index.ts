 
import {describe,it,expect} from '@jest/globals'
import { doesNotThrow } from 'assert'
import InsSaver from '../src/index' 

describe("Class InsSaver",()=>{
    
    const saver =  new InsSaver({
        getCookie:async ()=>["mid=Yfo1dQALAAHl-ZixhGXTxOTmiGVX;ig_did=21813403-1968-4957-A18D-E8ECF5329C8C;ig_nrcb=1;csrftoken=dubg4aR6VzlezylV7U8A6xDnC0TJ8rUT;ds_user_id=51675573945;sessionid=51675573945%3AKgn5PeHkOnjdvJ%3A21;rur=NAO,51675573945,1675973170:01f784c061bfb5b6aff7cee345d5583da0b5632049a4311a092f7c0533fcec250c13a3f8;"],
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
        saver.download("https://scontent-hkt1-1.cdninstagram.com/v/t51.2885-19/s150x150/271346579_227318226236682_4454977645743228796_n.jpg?_nc_ht=scontent-hkt1-1.cdninstagram.com&_nc_cat=1&_nc_ohc=ZsyU39te70cAX8Ww3LR&edm=AABBvjUBAAAA&ccb=7-4&oh=00_AT8otA2Fk41rkC_m1kbx1ZayYBW6yK6lo-C5RmXiwHYlFQ&oe=61E53251&_nc_sid=83d603","test")
             .then(data=>{ 
                 expect(data).toBeInstanceOf(Object) 
                 done()
        })
    })

    it("expect the analysisXXX function return the right data",done=>{
        saver.analysisPost("https://www.instagram.com/p/CSBUwGmB8mF/?utm_medium",async data=>{  
            console.log(data)
            expect(data.version === 1 || data.version === 2).toBe(true)
            done()
        })
    })
})



