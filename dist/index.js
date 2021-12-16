"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const request_1 = __importDefault(require("request"));
const fs_1 = __importDefault(require("fs"));
const events_1 = __importDefault(require("events"));
const url_1 = require("./utils/url");
const Looper_1 = __importDefault(require("./helper/Looper"));
const Parser_1 = __importDefault(require("./helper/Parser"));
const enum_handler_1 = require("./enum/enum.handler");
const msg_1 = require("./utils/msg");
class InsSaver {
    constructor(config) {
        this.init(config);
    }
    init(config) {
        return __awaiter(this, void 0, void 0, function* () {
            this.ready = false;
            config.switchCookieInterval = config.switchCookieInterval || (1000 * 60 * 10);
            config.useCookieMaxNum = config.useCookieMaxNum || 24;
            config.outCookie = config.outCookie || ((cookie) => __awaiter(this, void 0, void 0, function* () { }));
            this.event = new events_1.default.EventEmitter();
            this.queue = [];
            this.regiteEvent();
            this.config = config;
            config.cookies = config.cookies || (yield config.getCookie());
            this.loop = new Looper_1.default(this.config, this.event);
            this.parser = new Parser_1.default(this.loop);
            this.config.cookies.length > 0 ? (this.ready = true, this.event.emit(enum_handler_1.EventHandlerType.HANDLE_QUEUE)) : (0, msg_1.warn)("getCookie 获取到0个cookie, 请编写能正确返回cookie的异步函数！");
        });
    }
    regiteEvent() {
        const this_ = this;
        this_.event.on(enum_handler_1.EventHandlerType.HANDLE_QUEUE, () => __awaiter(this, void 0, void 0, function* () {
            while (this_.queue.length > 0 && this_.ready) {
                const task = this_.queue.shift();
                const callback = task.callback || ((json) => __awaiter(this, void 0, void 0, function* () { }));
                let json;
                try {
                    switch (task.type) {
                        case enum_handler_1.InsLinkType.POST:
                            json = yield this_.parser.parsePost(task.url);
                            break;
                        case enum_handler_1.InsLinkType.IG:
                            json = yield this_.parser.parseIg(task.url);
                            break;
                        default:
                            break;
                    }
                    callback(json);
                }
                catch (e) {
                    (0, msg_1.warn)(JSON.stringify(e));
                }
            }
        }));
        this_.event.on(enum_handler_1.EventHandlerType.HANDLE_OUT_COOKIE, (cookie) => __awaiter(this, void 0, void 0, function* () { this_.config.outCookie(cookie); }));
    }
    analysis(urlOrCode, type, handleDataCallback) {
        const task = {
            type,
            code: (0, url_1.getShortCode)(urlOrCode),
            url: type === enum_handler_1.InsLinkType.POST ? (0, url_1.createUrl)(urlOrCode) :
                type === enum_handler_1.InsLinkType.IG ? (0, url_1.createTvUrl)(urlOrCode) : urlOrCode,
            callback: handleDataCallback
        };
        this.queue.push(task);
        return this.ready ? (this.event.emit(enum_handler_1.EventHandlerType.HANDLE_QUEUE) && this) : this;
    }
    analysisPost(urlOrCode, handleDataCallback) {
        return this.analysis(urlOrCode, enum_handler_1.InsLinkType.POST, handleDataCallback);
    }
    analysisIg(urlOrCode, handleDataCallback) {
        return this.analysis(urlOrCode, enum_handler_1.InsLinkType.IG, handleDataCallback);
    }
    download(url, filename) {
        const this_ = this;
        return new Promise(r => {
            if (!url) {
                let r_ = {
                    status: "error",
                    statusCode: -1,
                    createtime: new Date(),
                    error: new Error(`url : ${url} is required!`),
                };
                return r(r_);
            }
            const afterfix = /.jpg/g.test(url) ? '.jpg' :
                /.mp4/g.test(url) ? '.mp4' : '';
            filename = filename || new Date().getTime().toString();
            const fullpath = `${this_.config.downloadPath}${filename}${afterfix}`;
            if (!fs_1.default.existsSync(this_.config.downloadPath))
                fs_1.default.mkdirSync(this_.config.downloadPath);
            let isExpiredUrl = false;
            (0, request_1.default)({
                url,
                proxy: this_.config.proxy,
            }, (err, res, body) => {
                if (err)
                    return r({
                        status: "error",
                        statusCode: res.statusCode,
                        createtime: new Date(),
                        error: new Error(err)
                    });
                //CHECK IF URL signature expired
                if (res.statusCode === 403 && body === "URL signature expired") {
                    isExpiredUrl = true;
                    r({
                        status: "error",
                        statusCode: 403,
                        createtime: new Date(),
                        error: new Error(body)
                    });
                }
            })
                .pipe(fs_1.default.createWriteStream(fullpath))
                .on('close', () => {
                if (!isExpiredUrl && fs_1.default.existsSync(fullpath) && fs_1.default.statSync(fullpath).size > 21) {
                    const resolved = {
                        status: "ok",
                        statusCode: 200,
                        createtime: new Date(),
                        filename: `${filename}${afterfix}`,
                        filepath: this_.config.downloadPath,
                        fullpath,
                        size: fs_1.default.statSync(fullpath).size
                    };
                    r(resolved);
                    (0, msg_1.log)(resolved, "InsSaver Download Sucess!", "yellow");
                }
            })
                .on('err', err => {
                const erred = {
                    status: "error",
                    statusCode: -1,
                    createtime: new Date(),
                    error: new Error(err)
                };
                r(erred);
                (0, msg_1.warn)(`insSaver downloadFile failed! errInfo : ${erred}`);
            });
        });
    }
}
InsSaver.warn = msg_1.warn;
InsSaver.info = msg_1.info;
InsSaver.title = msg_1.title;
InsSaver.log = msg_1.log;
InsSaver.createUrl = url_1.createUrl;
InsSaver.createTvUrl = url_1.createTvUrl;
InsSaver.getShortCode = url_1.getShortCode;
module.exports = InsSaver;
//# sourceMappingURL=index.js.map