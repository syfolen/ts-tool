"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var Constants_1 = require("../Constants");
var Util_1 = require("../Util");
var ClassParser_1 = require("./ClassParser");
var EnumParser_1 = require("./EnumParser");
var InterfaceParser_1 = require("./InterfaceParser");
var NamespaceParser_1 = require("./NamespaceParser");
var FileParser = /** @class */ (function () {
    function FileParser(url) {
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
    FileParser.prototype.$createDefineParser = function (str) {
        var e = new EnumParser_1.EnumParser(str);
        if (e.ok === true) {
            return e;
        }
        var c = new ClassParser_1.ClassParser(str);
        if (c.ok === true) {
            return c;
        }
        var i = new InterfaceParser_1.InterfaceParser(str);
        if (i.ok === true) {
            return i;
        }
        var n = new NamespaceParser_1.NamespaceParser(str);
        if (n.ok === true) {
            return n;
        }
        throw Error("yes");
    };
    /**
     * 读取文件注释
     */
    FileParser.prototype.$parseDefineInfomation = function (str) {
        this.notes = Util_1.Util.readNotes(this.$lines);
        // 必定有模块名
        while (this.$lines.length > 0) {
            var line = Util_1.Util.trim(this.$lines.shift());
            if (line.indexOf("module ") !== 0) {
                continue;
            }
            var str_1 = line.substr("module ".length);
            var index_1 = str_1.indexOf(" {");
            if (index_1 === -1) {
                continue;
            }
            this.name = str_1.substr(0, index_1);
            break;
        }
        if (this.name === "") {
            throw Error("\u6CA1\u6709\u627E\u5230\u6A21\u5757\u540D url:" + this.url);
        }
        var index = str.indexOf("module " + this.name + " {");
        if (index === -1) {
            throw Error("\u6A21\u5757\u547D\u540D\u683C\u5F0F\u6709\u8BEF url:" + this.url);
        }
        // 需要去掉最后面的一个括号
        while (this.$lines.length > 0) {
            var line = Util_1.Util.trim(this.$lines.pop());
            if (line === "") {
                continue;
            }
            if (line === "}") {
                break;
            }
        }
        Util_1.Util.sortLines(this.$lines);
    };
    /**
     * 读取文件内容
     */
    FileParser.prototype.$readContent = function (url) {
        return fs_1.default.readFileSync(url).toString();
    };
    return FileParser;
}());
exports.FileParser = FileParser;
//# sourceMappingURL=FileParser.js.map