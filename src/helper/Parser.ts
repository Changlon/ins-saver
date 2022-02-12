
import { Parser as ParserInterface } from 'parser' 
import { InsLinkType } from '../enum/enum.handler'
import { InsJsonDataType } from '../../typings'
import Looper from './Looper'
import { checkServerIdentity } from 'tls'

class Parser implements ParserInterface { 

    private loop : Looper 

    constructor(loop:Looper) { 
        this.loop = loop
    }

    async parse(url: string, type: InsLinkType): Promise<InsJsonDataType> {   
        let err : unknown
        const body = await this.loop.getJsonData(url).catch(fail=>{ err = fail}) 
        if(err) {  
            if((err as any).status == 200 && !body) 
                this.loop.checkCookie(true) //remove the bad cookie!
            
            throw err
        } 
        let json:{[k:string|number|symbol]:any} 
        let insJsonData : InsJsonDataType 
        try {
            json = JSON.parse(body as string)
            switch (type) {
                case InsLinkType.POST:
                    insJsonData = this.linkJsonParser(json)
                    break
                case InsLinkType.IG:
                    insJsonData = this.linkJsonParser(json)
                    break    
            }
            return insJsonData
        }catch(e) {
            throw new Error(`Parser --- parserError ${e}`) 
        } 
    }

    async parsePost(url: string): Promise<InsJsonDataType> { 
        return (await this.parse(url,InsLinkType.POST)) 
    } 

    async parseIg(url: string): Promise<InsJsonDataType> {
        return (await this.parse(url,InsLinkType.IG))
    } 

     /**
     * TODO : 链接parser后面可能有主页的，等等
     * @param json 
     */
     private linkJsonParser(json:{[k:string|number|symbol]:any}): InsJsonDataType{  
            
            const shortcode_media = json?.graphql?.shortcode_media   
            const items = json.items ?  json.items[0] : null 
            
            if(!shortcode_media && !items) return   
            
            let insJsonData:InsJsonDataType  
            
            if(shortcode_media) {
                const {id,shortcode,edge_media_to_caption,owner,edge_sidecar_to_children} = shortcode_media 
                const caption =  edge_media_to_caption?.edges?.length>0 ? 
                                 edge_media_to_caption.edges[0]?.node?.text  
                                 : '' 
                const is_multiple = edge_sidecar_to_children?.edges?.length > 1  
                const list = [] 
                
                if(is_multiple) { 
                    for(let node of edge_sidecar_to_children.edges) {  
                        node = node.node 
                        const {id,shortcode,display_url,is_video,video_url} = node
                        list.push({
                            id,
                            shortcode,
                            display_url,
                            is_video,
                            url: is_video ? video_url : display_url,
                            type: is_video ? 'mp4' : 'jpg' ,
                            typename : is_video ? 'video' : 'image'
                        })
                    }
                }else {
                    const {display_url,is_video,video_url} = shortcode_media 
                    list.push({
                        id,
                        shortcode,
                        display_url,
                        is_video,
                        url: is_video ? video_url : display_url ,
                        type : is_video ? 'mp4':'jpg',
                        typename: is_video ? 'video' : 'image'
                    })
                }
    
                insJsonData = {
                    id,
                    shortcode,
                    caption,
                    owner:{
                        id:owner.id,
                        profile_pic_url:owner.profile_pic_url,
                        username:owner.username,
                        full_name:owner.full_name 
                    },
                    is_multiple,
                    list,
                    version:1
                }
            }else if(items) {
                const {id,code,caption,user,carousel_media} = items 
                const is_multiple = carousel_media?.length > 1   
                
                const list = []    

                if(is_multiple) {
                    for(let eachCm of carousel_media) {
                        const {id,media_type,image_versions2,video_versions} = eachCm 
                        switch (media_type)  {
                            case 1: //image  
                                list.push({
                                    id,
                                    shortcode:code,
                                    display_url:image_versions2?.candidates[0]?.url, 
                                    is_video:false,
                                    url:image_versions2?.candidates[0]?.url,
                                    type:"jpg",
                                    typename:"image"
                                })
                                break
                            case 2 : //video 
                                list.push({
                                    id,shortcode:code,
                                    display_url : image_versions2?.candidates[0]?.url ,
                                    is_video : true ,
                                    url: video_versions[0]?.url,
                                    type:"mp4",
                                    typename:"video"
                                })
    
                                break    
                        }
                        
                    }
                }else{ 
                    const {image_versions2,video_versions,media_type} = items  
                    switch (media_type)  {
                        case 1: //image  
                            list.push({
                                id,
                                shortcode:code,
                                display_url:image_versions2?.candidates[0]?.url, 
                                is_video:false,
                                url:image_versions2?.candidates[0]?.url,
                                type:"jpg",
                                typename:"image"
                            })
                            break
                        case 2 : //video 
                            list.push({
                                id,shortcode:code,
                                display_url : image_versions2?.candidates[0]?.url ,
                                is_video : true ,
                                url: video_versions[0]?.url,
                                type:"mp4",
                                typename:"video"
                            })

                            break    
                    }
                  
                }
                
                insJsonData = {
                    id,
                    shortcode:code,
                    caption:caption?.text,
                    owner:{
                        id:user?.pk,
                        profile_pic_url:user?.profile_pic_url,
                        username:user?.username,
                        full_name:user?.full_name 
                    },
                    is_multiple,
                    list,
                    version:2
                }
 
            }
           
            return  insJsonData
     }
    
}



export = Parser