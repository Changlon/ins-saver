"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const enum_handler_1 = require("./enum/enum.handler");
const msg = __importStar(require("./utils/msg"));
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
            config.cookies = config.cookies || (yield config.getCookie());
            this.config = config;
            this.event = new events_1.default.EventEmitter();
            this.queue = [];
            this.regiteEvent();
            //TODO 完成Loop ,Parser类
            // this.loop = {} 
            // this.parser = {} 
            this.config.cookies.length > 0 ? (this.ready = true && this.event.emit(enum_handler_1.EventHandlerType.HANDLE_QUEUE)) : void 0;
        });
    }
    regiteEvent() {
        const this_ = this;
        this_.event.on(enum_handler_1.EventHandlerType.HANDLE_QUEUE, () => __awaiter(this, void 0, void 0, function* () {
            while (this_.queue.length > 0) {
                const task = this_.queue.shift();
                const callback = task.callback || ((json) => __awaiter(this, void 0, void 0, function* () { }));
                let json;
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
        }));
        this_.event.on(enum_handler_1.EventHandlerType.HANDLE_OUT_COOKIE, (cookie) => __awaiter(this, void 0, void 0, function* () { yield this_.config.outCookie(cookie); }));
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
            (0, request_1.default)({
                url,
                proxy: this_.config.proxy,
            })
                .pipe(fs_1.default.createWriteStream(fullpath))
                .on('close', () => {
                if (fs_1.default.existsSync(fullpath) && fs_1.default.statSync(fullpath).size) {
                    r({
                        status: "ok",
                        createtime: new Date(),
                        filename: `${filename}${afterfix}`,
                        filepath: this_.config.downloadPath,
                        fullpath,
                        size: fs_1.default.statSync(fullpath).size
                    });
                }
                else {
                    r({
                        status: "error",
                        createtime: new Date(),
                        error: new Error(`文件下载失败!`)
                    });
                }
            })
                .on('err', err => {
                r({
                    status: "error",
                    createtime: new Date(),
                    error: new Error(err)
                });
            });
        });
    }
}
let config = {
    getCookie: function () {
        throw new Error("Function not implemented.");
    },
    downloadPath: ""
};
InsSaver.msg = msg;
module.exports = InsSaver;
