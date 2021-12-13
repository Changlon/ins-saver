"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventHandlerType = exports.InsLinkType = void 0;
//请求链接的类型
var InsLinkType;
(function (InsLinkType) {
    InsLinkType["POST"] = "post";
    InsLinkType["IG"] = "ig";
})(InsLinkType = exports.InsLinkType || (exports.InsLinkType = {}));
//注册事件类型
var EventHandlerType;
(function (EventHandlerType) {
    EventHandlerType["HANDLE_QUEUE"] = "handle_queue";
    EventHandlerType["HANDLE_OUT_COOKIE"] = "handle_out_cookie";
    EventHandlerType["HANDLE_GET_JSONDATA"] = "handle_get_jsondata";
})(EventHandlerType = exports.EventHandlerType || (exports.EventHandlerType = {}));
//# sourceMappingURL=enum.handler.js.map