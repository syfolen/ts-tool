"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var DefineParser_1 = require("./DefineParser");
var Util_1 = require("../Util");
var DfnTypeEnum_1 = require("../interfaces/DfnTypeEnum");
var InterfaceParser = /** @class */ (function (_super) {
    __extends(InterfaceParser, _super);
    function InterfaceParser(str) {
        return _super.call(this, str, DfnTypeEnum_1.DfnTypeEnum.INTERFACE) || this;
    }
    InterfaceParser.prototype.$parseDefineInfomation = function () {
        var line = this.$lines.shift();
        var array = line.split(" ");
        var reg0 = array.indexOf("interface");
        if (reg0 === -1) {
            return;
        }
        var ok = array.shift() === "export" && array.pop() === "{";
        if (ok === false) {
            throw Error("\u9519\u8BEF\u7684\u63A5\u53E3\u5B9A\u4E49\u683C\u5F0F line:" + line);
        }
        this.line = line;
        array.shift();
        this.name = this.$removeGenericity(array.shift());
        this.$lines.pop();
        this.$parseParentDefination(array.slice(0));
        Util_1.Util.sortLines(this.$lines);
        this.$parseLines(this.$lines);
        this.ok = true;
    };
    /**
     * 解析方法
     */
    InterfaceParser.prototype.$parseFunctions = function (lines) {
        var total = lines.length;
        while (lines.length > 0) {
            var remain = lines.length;
            var info = {
                line: "",
                lines: [],
                notes: []
            };
            info.notes = Util_1.Util.readNotes(lines);
            var line = lines.shift();
            if (line.substr(line.length - 1) !== ";") {
                return total - remain;
            }
            info.line = line;
            this.functions.push(info);
        }
        return total;
    };
    /**
     * 判断是否为变量
     */
    InterfaceParser.prototype.$isVar = function (line) {
        var reg0 = line.indexOf("(");
        if (reg0 === -1) {
            return true;
        }
        var reg1 = line.indexOf(":");
        if (reg1 < reg0) {
            return true;
        }
        return false;
    };
    /**
     * 判断是否为函数
     */
    InterfaceParser.prototype.$isFunc = function (line) {
        return true;
    };
    return InterfaceParser;
}(DefineParser_1.DefineParser));
exports.InterfaceParser = InterfaceParser;
//# sourceMappingURL=InterfaceParser.js.map