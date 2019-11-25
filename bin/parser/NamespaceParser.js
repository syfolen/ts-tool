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
var DfnTypeEnum_1 = require("../interfaces/DfnTypeEnum");
var Util_1 = require("../utils/Util");
var NamespaceParser = /** @class */ (function (_super) {
    __extends(NamespaceParser, _super);
    function NamespaceParser(str) {
        return _super.call(this, str, DfnTypeEnum_1.DfnTypeEnum.NAMESPACE) || this;
    }
    NamespaceParser.prototype.$parseDefineInfomation = function () {
        var line = this.$lines.shift();
        var array = line.split(" ");
        var reg0 = array.indexOf("namespace");
        if (reg0 === -1) {
            return;
        }
        var ok = array.shift() === "export" && array.pop() === "{";
        if (ok === false) {
            throw Error("\u9519\u8BEF\u7684\u547D\u540D\u7A7A\u95F4\u5B9A\u4E49\u683C\u5F0F line:" + line);
        }
        array.shift();
        this.name = array[0];
        this.$lines.pop();
        Util_1.Util.sortLines(this.$lines);
        this.$parseLines(this.$lines);
        this.ok = true;
    };
    return NamespaceParser;
}(DefineParser_1.DefineParser));
exports.NamespaceParser = NamespaceParser;
//# sourceMappingURL=NamespaceParser.js.map