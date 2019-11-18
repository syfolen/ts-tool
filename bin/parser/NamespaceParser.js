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
var NamespaceParser = /** @class */ (function (_super) {
    __extends(NamespaceParser, _super);
    function NamespaceParser(str) {
        return _super.call(this, str, DfnTypeEnum_1.DfnTypeEnum.NAMESPACE) || this;
    }
    NamespaceParser.prototype.$parseDefineInfomation = function () {
        this.$parseLines(this.$lines);
        this.ok = true;
    };
    return NamespaceParser;
}(DefineParser_1.DefineParser));
exports.NamespaceParser = NamespaceParser;
//# sourceMappingURL=NamespaceParser.js.map