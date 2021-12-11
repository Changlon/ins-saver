
import InsKeeper,{InsJsonDataType} from '../typings' 


import event from 'events' 
import { InsLinkType } from 'enum'

console.log(event.EventEmitter)

let d :InsJsonDataType = {
    id: 0,
    shortcode: '',
    caption: '',
    owner: {
        id: 0,
        profile_pic_url: '',
        username: '',
        full_name: ''
    },
    is_multiple: false,
    list: []
}


