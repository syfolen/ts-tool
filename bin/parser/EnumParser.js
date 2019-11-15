"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DefineParser_1 = require("./DefineParser");
const Util_1 = require("../Util");
class EnumParser extends DefineParser_1.DefineParser {
    $parseDefineInfomation() {
        const line = this.$lines.shift();
        const a = line.indexOf(" enum ");
        if (a === -1) {
            return;
        }
        const str = line.substr(a + " enum ".length);
        const b = str.indexOf(" {");
        if (b === -1) {
            throw Error(`枚举命名格式有误 line:${line}`);
        }
        this.name = str.substr(0, b);
        this.$lines.pop();
        this.ok = true;
        Util_1.Util.sortLines(this.$lines);
    }
}
exports.EnumParser = EnumParser;
//# sourceMappingURL=EnumParser.js.map