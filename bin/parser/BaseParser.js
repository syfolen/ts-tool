"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../Constants");
const Util_1 = require("../Util");
class BaseParser {
    constructor(str) {
        /**
         * 解析是否正确
         */
        this.ok = false;
        /**
         * 名字
         */
        this.name = "";
        /**
         * 是否为抽象类
         */
        this.isAbstract = false;
        this.str = str;
        this.$lines = str.split(Constants_1.Constants.NEWLINE);
        this.notes = Util_1.Util.readNotes(this.$lines);
        this.$parseDefineInfomation();
        if (this.name === "") {
            return;
        }
    }
}
exports.BaseParser = BaseParser;
//# sourceMappingURL=BaseParser.js.map