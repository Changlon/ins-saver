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
const events_1 = __importDefault(require("events"));
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
            config.cookies.length > 0 ? (this.ready = true) : void 0;
            this.config = config;
            this.event = new events_1.default.EventEmitter();
            this.queue = [];
            //TODO 完成Loop ,Parser类
            // this.loop = {} 
            // this.parser = {} 
            this.regiteEvent();
        });
    }
    regiteEvent() {
        if (!this.ready)
            return void 0;
    }
    analysis(urlOrCode, handleDataCallback, type) {
        throw new Error("Method not implemented.");
    }
    analysisPost(urlOrCode, handleDataCallback) {
        throw new Error("Method not implemented.");
    }
    analysisIg(urlOrCode, handleDataCallback) {
        throw new Error("Method not implemented.");
    }
    download(url, filename) {
        throw new Error("Method not implemented.");
    }
}
module.exports = InsSaver;
