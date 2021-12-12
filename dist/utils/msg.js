"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = exports.title = exports.info = exports.warn = void 0;
const cli_color_1 = __importDefault(require("cli-color"));
const console_1 = __importDefault(require("console"));
const warn = (msg) => {
    console_1.default.log("");
    console_1.default.log(cli_color_1.default.red("【WARN】:"), cli_color_1.default.white(` ${msg} `));
};
exports.warn = warn;
const info = (msg) => {
    console_1.default.log("");
    console_1.default.log(cli_color_1.default.yellow("【INFO】:"), cli_color_1.default.bold(cli_color_1.default.bgWhite(cli_color_1.default.blue(` ${msg} `))));
};
exports.info = info;
const title = (msg, color, indent) => {
    let indents = "";
    for (let i = 0; i < (indent ? indent : 7); i++)
        indents = indents + "\t";
    console_1.default.log("");
    console_1.default.log(`${indents} ${cli_color_1.default.bold(cli_color_1.default[color ? color : "blue"](msg))} ${indents}`);
    console_1.default.log("");
};
exports.title = title;
const log = (o, tit) => {
    if (tit)
        (0, exports.title)(tit);
    Object.keys(o).forEach(k => {
        (0, exports.info)(`${k} --> ${o[k]}`);
    });
};
exports.log = log;
