
/**
 * 创建帖子json链接
 * @param urlOrCode 
 * @returns 
 */
export const createUrl = (urlOrCode : string ):string => {   
    return  urlOrCode ?  
        isUrl(urlOrCode) ?  
           createUrl((()=>{
               return urlOrCode.split("/")[urlOrCode.split("/").length-2]
           })())
        : `https://www.instagram.com/p/${urlOrCode}/?__a=1`
        
    : ""
}


/**
 * 创建ig json链接
 * @param urlOrCode 
 * @returns 
 */
export const createTvUrl = ( urlOrCode :string ):string =>{
    return  urlOrCode ?  
     isUrl(urlOrCode) ?  
        createTvUrl((()=>{
          return urlOrCode.split("/")[urlOrCode.split("/").length-2]
        })())
        : `https://www.instagram.com/tv/${urlOrCode}/?__a=1`
        
    : ""
}


/**
 * 创建主页json链接
 * @param username 
 * @returns 
 */
export const createProfileUrl = (username : string):string =>{
   return username ?  
       isUrl(username) ?  
           username
       : `https://www.instagram.com/${username}/?__a=1`
   : ""
}


/**
 * 是否是url
 * @param url 
 * @returns 
 */
export const isUrl = ( url: string ) :boolean =>{
    return url.substring(0, 8) === 'https://' || url.substring(0, 7) === 'http://'
}


/**
 * 获取shortcode
 * @param url 
 * @returns 
 */
export const getShortCode = (url: string ) : string =>{ 
    return url ? 
        isUrl(url) ?  
            url.split("/")[url.split("/").length-2]
        : url
    : ""
}


