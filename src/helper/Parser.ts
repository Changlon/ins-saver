
import { Parser as ParserInterface } from 'parser' 
import { InsLinkType } from '../enum/enum.handler'
import { InsJsonDataType } from '../../typings'
import Looper from './Looper'

class Parser implements ParserInterface { 

    private loop : Looper 

    constructor(loop:Looper) { 
        this.loop = loop
    }

    async parse(url: string, type: InsLinkType): Promise<InsJsonDataType> {   
        let err : unknown
        const body = await this.loop.getJsonData(url).catch(fail=>{ err = fail}) 
        if(err || !body ) throw err   
        let json:{[k:string|number|symbol]:any} 
        let insJsonData : InsJsonDataType 
        try {
            json = JSON.parse(body)
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
            debugger
            const shortcode_media = json?.graphql?.shortcode_media  
            if(!shortcode_media) return  
            let insJsonData:InsJsonDataType 
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
                list
            }
            
            return  insJsonData
     }
    
}



export = Parser