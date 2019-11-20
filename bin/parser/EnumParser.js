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
var Util_1 = require("../utils/Util");
var DfnTypeEnum_1 = require("../interfaces/DfnTypeEnum");
var EnumParser = /** @class */ (function (_super) {
    __extends(EnumParser, _super);
    function EnumParser(str) {
        return _super.call(this, str, DfnTypeEnum_1.DfnTypeEnum.ENUM) || this;
    }
    EnumParser.prototype.$parseDefineInfomation = function () {
        var line = this.$lines.shift();
        var array = line.split(" ");
        var reg0 = array.indexOf("enum");
        if (reg0 === -1) {
            return;
        }
        var ok = array.shift() === "export" && array.pop() === "{";
        if (ok === false) {
            throw Error("\u9519\u8BEF\u7684\u679A\u4E3E\u5B9A\u4E49\u683C\u5F0F line:" + line);
        }
        array.shift();
        this.name = array[0];
        this.$lines.pop();
        Util_1.Util.sortLines(this.$lines);
        this.$parseLines(this.$lines);
        this.ok = true;
    };
    /**
     * 判断是否为变量
     */
    EnumParser.prototype.$isVar = function (line) {
        return true;
    };
    /**
     * 解析变量信息
     */
    EnumParser.prototype.$parserVarInfo = function (str, out) {
        var reg0 = str.indexOf(",");
        if (reg0 !== -1) {
            str = str.substr(0, reg0);
        }
        var reg1 = str.indexOf(" = ");
        if (reg1 === -1) {
            out.name = str;
        }
        else {
            out.name = str.substr(0, reg1);
            out.value = str.substr(reg1 + 3);
            out.optional = true;
        }
    };
    return EnumParser;
}(DefineParser_1.DefineParser));
exports.EnumParser = EnumParser;
//# sourceMappingURL=EnumParser.js.map