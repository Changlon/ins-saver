"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShortCode = exports.isUrl = exports.createProfileUrl = exports.createTvUrl = exports.createUrl = void 0;
/**
 * 创建帖子json链接
 * @param urlOrCode
 * @returns
 */
const createUrl = (urlOrCode) => {
    return urlOrCode ?
        (0, exports.isUrl)(urlOrCode) ?
            urlOrCode.substring(urlOrCode.length - 1) === "/" ?
                urlOrCode + "?__a=1"
                : urlOrCode + "/?__a=1"
            : `https://www.instagram.com/p/${urlOrCode}/?__a=1`
        : "";
};
exports.createUrl = createUrl;
/**
 * 创建ig json链接
 * @param urlOrCode
 * @returns
 */
const createTvUrl = (urlOrCode) => {
    return urlOrCode ?
        (0, exports.isUrl)(urlOrCode) ?
            (0, exports.createTvUrl)((() => {
                return urlOrCode.split("/")[urlOrCode.split("/").length - 2];
            })())
            : `https://www.instagram.com/tv/${urlOrCode}/?__a=1`
        : "";
};
exports.createTvUrl = createTvUrl;
/**
 * 创建主页json链接
 * @param username
 * @returns
 */
const createProfileUrl = (username) => {
    return username ?
        (0, exports.isUrl)(username) ?
            username
            : `https://www.instagram.com/${username}/?__a=1`
        : "";
};
exports.createProfileUrl = createProfileUrl;
/**
 * 是否是url
 * @param url
 * @returns
 */
const isUrl = (url) => {
    return url.substring(0, 8) === 'https://' || url.substring(0, 7) === 'http://';
};
exports.isUrl = isUrl;
/**
 * 获取shortcode
 * @param url
 * @returns
 */
const getShortCode = (url) => {
    return url ?
        (0, exports.isUrl)(url) ?
            url.split("/")[url.split("/").length - 2]
            : url
        : "";
};
exports.getShortCode = getShortCode;
