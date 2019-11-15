"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const Constants_1 = require("../Constants");
const Util_1 = require("../Util");
const ClassParser_1 = require("./ClassParser");
const EnumParser_1 = require("./EnumParser");
const InterfaceParser_1 = require("./InterfaceParser");
const NamespaceParser_1 = require("./NamespaceParser");
class FileParser {
    constructor(url) {
        /**
         * 行信息
         */
        this.$lines = [];
        /**
         * 模块名
         */
        this.name = "";
        /**
         * 文件注释
         */
        this.notes = [];
        this.url = url;
        this.str = this.$readContent(url);
        this.$lines = this.str.split(Constants_1.Constants.NEWLINE);
        this.$parseDefineInfomation(this.str);
        this.parser = this.$createDefineParser(this.$lines.join(Constants_1.Constants.NEWLINE));
        console.log(this.parser.toString());
    }
    /**
     * 创建定义解析器
     */
    $createDefineParser(str) {
        const e = new EnumParser_1.EnumParser(str);
        if (e.ok === true) {
            return e;
        }
        const c = new ClassParser_1.ClassParser(str);
        if (c.ok === true) {
            return c;
        }
        const i = new InterfaceParser_1.InterfaceParser(str);
        if (i.ok === true) {
            return i;
        }
        const n = new NamespaceParser_1.NamespaceParser(str);
        if (n.ok === true) {
            return n;
        }
        throw Error("yes");
    }
    /**
     * 读取文件注释
     */
    $parseDefineInfomation(str) {
        this.notes = Util_1.Util.readNotes(this.$lines);
        // 必定有模块名
        while (this.$lines.length > 0) {
            const line = Util_1.Util.trim(this.$lines.shift());
            if (line.indexOf("module ") !== 0) {
                continue;
            }
            const str = line.substr("module ".length);
            const index = str.indexOf(" {");
            if (index === -1) {
                continue;
            }
            this.name = str.substr(0, index);
            break;
        }
        if (this.name === "") {
            throw Error(`没有找到模块名 url:${this.url}`);
        }
        const index = str.indexOf(`module ${this.name} {`);
        if (index === -1) {
            throw Error(`模块命名格式有误 url:${this.url}`);
        }
        // 需要去掉最后面的一个括号
        while (this.$lines.length > 0) {
            const line = Util_1.Util.trim(this.$lines.pop());
            if (line === "") {
                continue;
            }
            if (line === "}") {
                break;
            }
        }
        Util_1.Util.sortLines(this.$lines);
    }
    /**
     * 读取文件内容
     */
    $readContent(url) {
        return fs_1.default.readFileSync(url).toString();
    }
}
exports.FileParser = FileParser;
//# sourceMappingURL=FileParser.js.map