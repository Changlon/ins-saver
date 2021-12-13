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
const useragent_from_seed_1 = __importDefault(require("useragent-from-seed"));
const request_1 = __importDefault(require("request"));
const enum_handler_1 = require("../enum/enum.handler");
const msg_1 = require("../utils/msg");
class Looper {
    constructor(config, event) {
        this.currentCookieIndex = 0;
        this.config = config;
        this.event = event;
        this.useNumMap = new Map();
        this.startLoop();
    }
    checkCookie(isBad) {
        const cookie = this.config.cookies[this.currentCookieIndex];
        if (cookie) {
            const key = typeof cookie === "string" ? cookie : (cookie.username || cookie.cookie);
            if (!isBad) {
                let usedNum = this.useNumMap.get(key);
                usedNum === undefined ? this.useNumMap.set(key, 0) :
                    (++usedNum,
                        usedNum <= this.config.useCookieMaxNum ? this.useNumMap.set(key, usedNum) :
                            this.useNumMap.set(key, 0),
                        this.toggle());
            }
            else {
                const abnormal = (this.config.cookies.splice(this.currentCookieIndex, 1))[0];
                this.useNumMap.set(key, null);
                this.currentCookieIndex--;
                abnormal ? this.event.emit(enum_handler_1.EventHandlerType.HANDLE_OUT_COOKIE, abnormal) && this.toggle() : this.toggle();
            }
        }
        else {
            this.toggle();
        }
    }
    getJsonData(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const this_ = this;
            const { userAgent, usedNum, cookie } = this.getHeaders();
            const option = {
                url,
                method: 'GET',
                proxy: this_.config.proxy,
                headers: {
                    "User-Agent": userAgent,
                    "Cookie": cookie
                }
            };
            (0, msg_1.log)(Object.assign(Object.assign({}, option), { usedNum, runningNum: this_.config.cookies.length, runningCookies: JSON.stringify(this_.config.cookies) }), "InsSaver Request Log!");
            return new Promise((r, j) => {
                (0, request_1.default)(option, (err, res, body) => {
                    if (!err && body) {
                        switch (res.statusCode) {
                            case 200:
                                if (body.startsWith("<!DOCTYPE html>")) {
                                    j({
                                        status: res.statusCode,
                                        error: new Error(`cookie无效！`)
                                    });
                                }
                                else {
                                    r(body);
                                }
                                break;
                            case 404:
                                j({
                                    status: res.statusCode,
                                    error: new Error(`未获取到资源 404!`)
                                });
                                break;
                        }
                    }
                    else if (err) {
                        j({
                            status: res.statusCode,
                            error: new Error(`网络连接错误！ ${err}`)
                        });
                    }
                });
            });
        });
    }
    getHeaders() {
        let userAgent, cookie, usedNum;
        const cookie_ = this.config.cookies[this.currentCookieIndex];
        const key = typeof cookie_ === "string" ? cookie_ : typeof cookie_ === "object" ? (cookie_.username || cookie_.cookie) : "";
        usedNum = this.useNumMap.get(key) === undefined ? 0 : this.useNumMap.get(key);
        cookie = typeof cookie_ == "string" ? cookie_ : typeof cookie_ === "object" ? cookie_.cookie : "";
        userAgent = (0, useragent_from_seed_1.default)(key);
        return {
            userAgent,
            cookie,
            usedNum
        };
    }
    startLoop() {
        const this_ = this;
        const loopHandler = () => {
            this_.looper ? clearTimeout(this_.looper) : void 0;
            const cookie = this_.config.cookies[this_.currentCookieIndex];
            if (cookie) {
                const key = typeof cookie === "string" ? cookie : (cookie.username || cookie.cookie);
                this_.useNumMap.set(key, 0);
                this_.toggle();
            }
            this_.looper = setTimeout(loopHandler, this_.config.switchCookieInterval);
        };
        this_.looper = setTimeout(loopHandler, this_.config.switchCookieInterval);
    }
    // TOGGLE COOKIE
    toggle() {
        this.currentCookieIndex++;
        this.currentCookieIndex >= this.config.cookies.length ? this.currentCookieIndex = 0 : void 0;
        //CHECK COOKIES NUM 
        if (!this.config.cookies.length) {
            (0, msg_1.info)("当前没有可用的cookie了，自动调用getCookie函数获取，请确保函数能返回正确的cookie数组");
            return this.add();
        }
        const cookie = this.config.cookies[this.currentCookieIndex];
        (0, msg_1.info)(`切换到第${this.currentCookieIndex}个cookie : ${JSON.stringify(cookie)}`);
        (0, msg_1.info)(`当前运行的cookie数量: ${this.config.cookies.length}`);
    }
    //ADD THE COOKIES IF CONFIG.COOKIES IS ZERO 
    add() {
        return __awaiter(this, void 0, void 0, function* () {
            this.config.cookies = (yield this.config.getCookie());
            (0, msg_1.info)(`自动添加获取到的cookies:${JSON.stringify(this.config.cookies)}`);
        });
    }
}
module.exports = Looper;
//# sourceMappingURL=Looper.js.map