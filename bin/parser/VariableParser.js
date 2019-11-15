"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Util_1 = require("../Util");
const Constants_1 = require("../Constants");
class VariableParser {
    constructor() {
        this.infos = [];
    }
    parse(lines) {
        const numOfLines = lines.length;
        while (lines.length > 0) {
            const info = {
                str: "",
                line: "",
                name: "",
                type: "",
                value: "",
                error: "",
                notes: [],
                keyworkds: []
            };
            info.notes = Util_1.Util.readNotes(lines);
            const line = lines.shift();
            const error = this.$parseLine(info, line);
            if (error !== "") {
                lines.unshift(line);
                return numOfLines - lines.length;
            }
            info.line = line;
            info.str = this.$joinVarString(info, line);
            info.error = error;
            this.infos.push(info);
        }
        return numOfLines;
    }
    $joinVarString(info, line) {
        const lines = [line];
        if (info.notes.length > 0) {
            lines.unshift(" */");
            for (const note of info.notes) {
                lines.unshift(" * " + note);
            }
            lines.unshift("/**");
        }
        return lines.join(Constants_1.Constants.NEWLINE);
    }
    $parseLine(info, line) {
        const s0 = line.substr(line.length - 1);
        if (s0 !== ";") {
            return `定义属性时缺少了分号 line:${line}`;
        }
        line = line.substr(0, line.length - 1);
        // 获取变量值
        const a = line.indexOf(" = ");
        if (a === -1) {
            return `没有为变量指定默认值 line:${line}`;
        }
        info.value = line.substr(a + " = ".length);
        line = line.substr(0, a);
        const b = line.indexOf(": ");
        if (b === -1) {
            return `没有为变量指定类型 line:${line}`;
        }
        info.type = line.substr(b + ": ".length);
        line = line.substr(0, b);
        const c = line.lastIndexOf(" ");
        if (c === -1) {
            line = "public " + line;
        }
        const array = line.split(" ");
        info.name = array.pop();
        info.keyworkds = array;
        return "";
    }
}
exports.VariableParser = VariableParser;
//# sourceMappingURL=VariableParser.js.map