//请求链接的类型
export declare enum InsLinkType { 
    POST = "post",
    IG = "ig" 
}

//注册事件类型
export declare enum EventHandlerType {  
    HANDLE_QUEUE = "handle_queue", //处理queue队列的事件钩子 
    HANDLE_OUT_COOKIE = "handle_out_cookie", //cookie失效时调用的钩子 
    HANDLE_GET_JSONDATA = "handle_get_jsondata", //获取到json数据时的钩子
    
}