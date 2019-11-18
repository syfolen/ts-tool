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
var ClassParser = /** @class */ (function (_super) {
    __extends(ClassParser, _super);
    function ClassParser(str) {
        return _super.call(this, str, DfnTypeEnum_1.DfnTypeEnum.CLASS) || this;
    }
    ClassParser.prototype.$parseDefineInfomation = function () {
        var line = this.$lines.shift();
        var array = line.split(" ");
        var reg0 = array.indexOf("class");
        if (reg0 === -1) {
            return;
        }
        var ok = array.shift() === "export" && array.pop() === "{";
        if (ok === false) {
            throw Error("\u9519\u8BEF\u7684\u7C7B\u5B9A\u4E49\u683C\u5F0F line:" + line);
        }
        this.line = line;
        var keywords = [];
        if (array[0] === "abstract") {
            keywords.push(array.shift());
        }
        array.shift();
        this.name = this.$removeGenericity(array.shift());
        this.$lines.pop();
        this.$parseParentDefination(array.slice(0));
        this.$paserInterfaceDefination(array.slice(0));
        Util_1.Util.sortLines(this.$lines);
        this.$parseLines(this.$lines);
        this.ok = true;
    };
    return ClassParser;
}(DefineParser_1.DefineParser));
exports.ClassParser = ClassParser;
//# sourceMappingURL=ClassParser.js.map