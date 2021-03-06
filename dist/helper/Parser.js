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
const enum_handler_1 = require("../enum/enum.handler");
class Parser {
    constructor(loop) {
        this.loop = loop;
    }
    parse(url, type) {
        return __awaiter(this, void 0, void 0, function* () {
            let err;
            const body = yield this.loop.getJsonData(url).catch(fail => { err = fail; });
            if (err) {
                if (err.status == 200 && !body)
                    this.loop.checkCookie(true); //remove the bad cookie!
                throw err;
            }
            let json;
            let insJsonData;
            try {
                json = JSON.parse(body);
                switch (type) {
                    case enum_handler_1.InsLinkType.POST:
                        insJsonData = this.linkJsonParser(json);
                        break;
                    case enum_handler_1.InsLinkType.IG:
                        insJsonData = this.linkJsonParser(json);
                        break;
                }
                return insJsonData;
            }
            catch (e) {
                throw new Error(`Parser --- parserError ${e}`);
            }
        });
    }
    parsePost(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.parse(url, enum_handler_1.InsLinkType.POST));
        });
    }
    parseIg(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.parse(url, enum_handler_1.InsLinkType.IG));
        });
    }
    /**
    * TODO : ??????parser?????????????????????????????????
    * @param json
    */
    linkJsonParser(json) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        const shortcode_media = (_a = json === null || json === void 0 ? void 0 : json.graphql) === null || _a === void 0 ? void 0 : _a.shortcode_media;
        const items = json.items ? json.items[0] : null;
        if (!shortcode_media && !items)
            return;
        let insJsonData;
        if (shortcode_media) {
            const { id, shortcode, edge_media_to_caption, owner, edge_sidecar_to_children } = shortcode_media;
            const caption = ((_b = edge_media_to_caption === null || edge_media_to_caption === void 0 ? void 0 : edge_media_to_caption.edges) === null || _b === void 0 ? void 0 : _b.length) > 0 ?
                (_d = (_c = edge_media_to_caption.edges[0]) === null || _c === void 0 ? void 0 : _c.node) === null || _d === void 0 ? void 0 : _d.text
                : '';
            const is_multiple = ((_e = edge_sidecar_to_children === null || edge_sidecar_to_children === void 0 ? void 0 : edge_sidecar_to_children.edges) === null || _e === void 0 ? void 0 : _e.length) > 1;
            const list = [];
            if (is_multiple) {
                for (let node of edge_sidecar_to_children.edges) {
                    node = node.node;
                    const { id, shortcode, display_url, is_video, video_url } = node;
                    list.push({
                        id,
                        shortcode,
                        display_url,
                        is_video,
                        url: is_video ? video_url : display_url,
                        type: is_video ? 'mp4' : 'jpg',
                        typename: is_video ? 'video' : 'image'
                    });
                }
            }
            else {
                const { display_url, is_video, video_url } = shortcode_media;
                list.push({
                    id,
                    shortcode,
                    display_url,
                    is_video,
                    url: is_video ? video_url : display_url,
                    type: is_video ? 'mp4' : 'jpg',
                    typename: is_video ? 'video' : 'image'
                });
            }
            insJsonData = {
                id,
                shortcode,
                caption,
                owner: {
                    id: owner.id,
                    profile_pic_url: owner.profile_pic_url,
                    username: owner.username,
                    full_name: owner.full_name
                },
                is_multiple,
                list,
                version: 1
            };
        }
        else if (items) {
            const { id, code, caption, user, carousel_media } = items;
            const is_multiple = (carousel_media === null || carousel_media === void 0 ? void 0 : carousel_media.length) > 1;
            const list = [];
            if (is_multiple) {
                for (let eachCm of carousel_media) {
                    const { id, media_type, image_versions2, video_versions } = eachCm;
                    switch (media_type) {
                        case 1: //image  
                            list.push({
                                id,
                                shortcode: code,
                                display_url: (_f = image_versions2 === null || image_versions2 === void 0 ? void 0 : image_versions2.candidates[0]) === null || _f === void 0 ? void 0 : _f.url,
                                is_video: false,
                                url: (_g = image_versions2 === null || image_versions2 === void 0 ? void 0 : image_versions2.candidates[0]) === null || _g === void 0 ? void 0 : _g.url,
                                type: "jpg",
                                typename: "image"
                            });
                            break;
                        case 2: //video 
                            list.push({
                                id, shortcode: code,
                                display_url: (_h = image_versions2 === null || image_versions2 === void 0 ? void 0 : image_versions2.candidates[0]) === null || _h === void 0 ? void 0 : _h.url,
                                is_video: true,
                                url: (_j = video_versions[0]) === null || _j === void 0 ? void 0 : _j.url,
                                type: "mp4",
                                typename: "video"
                            });
                            break;
                    }
                }
            }
            else {
                const { image_versions2, video_versions, media_type } = items;
                switch (media_type) {
                    case 1: //image  
                        list.push({
                            id,
                            shortcode: code,
                            display_url: (_k = image_versions2 === null || image_versions2 === void 0 ? void 0 : image_versions2.candidates[0]) === null || _k === void 0 ? void 0 : _k.url,
                            is_video: false,
                            url: (_l = image_versions2 === null || image_versions2 === void 0 ? void 0 : image_versions2.candidates[0]) === null || _l === void 0 ? void 0 : _l.url,
                            type: "jpg",
                            typename: "image"
                        });
                        break;
                    case 2: //video 
                        list.push({
                            id, shortcode: code,
                            display_url: (_m = image_versions2 === null || image_versions2 === void 0 ? void 0 : image_versions2.candidates[0]) === null || _m === void 0 ? void 0 : _m.url,
                            is_video: true,
                            url: (_o = video_versions[0]) === null || _o === void 0 ? void 0 : _o.url,
                            type: "mp4",
                            typename: "video"
                        });
                        break;
                }
            }
            insJsonData = {
                id,
                shortcode: code,
                caption: caption === null || caption === void 0 ? void 0 : caption.text,
                owner: {
                    id: user === null || user === void 0 ? void 0 : user.pk,
                    profile_pic_url: user === null || user === void 0 ? void 0 : user.profile_pic_url,
                    username: user === null || user === void 0 ? void 0 : user.username,
                    full_name: user === null || user === void 0 ? void 0 : user.full_name
                },
                is_multiple,
                list,
                version: 2
            };
        }
        return insJsonData;
    }
}
module.exports = Parser;
//# sourceMappingURL=Parser.js.map