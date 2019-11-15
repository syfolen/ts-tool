import { IVariableInfo } from "../interfaces/IVariableInfo";
import { Util } from "../Util";
import { Constants } from "../Constants";

export class VariableParser {

    infos: IVariableInfo[] = [];

    parse(lines: string[]): number {
        const numOfLines = lines.length;

        while (lines.length > 0) {
            const info: IVariableInfo = {
                str: "",
                line: "",
                name: "",
                type: "",
                value: "",
                error: "",
                notes: [],
                keyworkds: []
            };
            info.notes = Util.readNotes(lines);

            const line = lines.shift() as string;
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

    private $joinVarString(info: IVariableInfo, line: string): string {
        const lines = [line];

        if (info.notes.length > 0) {
            lines.unshift(" */");
            for (const note of info.notes) {
                lines.unshift(" * " + note);
            }
            lines.unshift("/**");
        }

        return lines.join(Constants.NEWLINE);
    }

    private $parseLine(info: IVariableInfo, line: string): string {
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

        const array: string[] = line.split(" ");
        info.name = array.pop() as string;
        info.keyworkds = array;

        return "";
    }
}