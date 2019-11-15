import { IFunctionInfo } from "../interfaces/IFunctionInfo";
import { Util } from "../Util";
import { IVariableInfo } from "../interfaces/IVariableInfo";
import { Constants } from "../Constants";

export class FunctionParser {

    infos: IFunctionInfo[] = [];

    parse(lines: string[]): void {
        while (lines.length > 0) {
            const info: IFunctionInfo = {
                str: "",
                name: "",
                error: "",
                args: [],
                notes: [],
                lines: [],
                keyworkds: []
            };
            info.notes = Util.readNotes(lines);

            const line = lines.shift() as string;
            const error = this.$parseLine(info, line);

            if (error !== "") {
                return;
            }

            while (lines.length > 0) {
                const line = lines.shift() as string;
                if (line === "}") {
                    break;
                }
                info.lines.push(line);
            }

            info.str = this.$joinFuncString(info, line);
            info.error = error;
            Util.sortLines(info.lines);
            
            this.infos.push(info);
        }
    }

    private $joinFuncString(info: IFunctionInfo, line: string): string {
        const lines = info.lines.slice(0);
        lines.unshift(line);
        lines.push("}");

        if (info.notes.length > 0) {
            lines.unshift(" */");
            for (const note of info.notes) {
                lines.unshift(" * " + note);
            }
            lines.unshift("/**");
        }

        return lines.join(Constants.NEWLINE);
    }

    private $parseLine(info: IFunctionInfo, line: string): string {
        const str = line;
        const a: string[] = ["public", "protected", "private"];

        for (const x of a) {
            const index = line.indexOf(x);
            if (index === 0) {
                info.keyworkds.push(x);
                line = line.substr(x.length + 1);
                break;
            }
        }
        if (info.keyworkds.length === 0) {
            info.keyworkds.push("public");
        }

        const b: string[] = ["static", "abstract"];
        line = " " + line;

        for (const x of b) {
            const key = " " + x + " ";
            const index = line.indexOf(x);
            if (index === -1) {
                continue;
            }
            line = line.substr(0, index) + line.substr(index + key.length - 1);
            info.keyworkds.push(x);
        }

        line = line.substr(1);

        const c = line.indexOf("(");
        if (c === -1) {
            return `错误的函数格式 line:${str}`;
        }
        info.name = line.substr(0, c);

        line = line.substr(c + 1);

        const d = line.lastIndexOf(") {");
        const e = line.lastIndexOf("): ");
        if (d > -1) {
            line = line.substr(0, line.length - 3);
        }
        else if (e > -1) {
            const s0 = line.substr(e + 3);
            const reg0 = s0.lastIndexOf(" {");
            if (reg0 === -1) {
                return `返回值格式错误 line:${str}`;
            }
            info.ret = s0.substr(0, reg0);
            line = line.substr(0, e);
        }

        while (line !== "") {
            const reg0 = line.indexOf(": ");
            if (reg0 === -1) {
                return `参数类型格式有误 line:${str}`;
            }

            const name = line.substr(0, reg0);
            line = line.substr(reg0 + 2);

            let reg1 = line.indexOf(", ");
            if (reg1 === -1) {
                reg1 = line.length;
            }
            let reg2 = line.indexOf(" = ", reg0);
            if (reg2 > reg1) {
                reg2 = -1;
            }

            if (reg2 > -1) {
                const reg0 = reg1;
                reg1 = reg2;
                reg2 = reg0;
            }

            const type = line.substr(0, reg1);
            if (reg2 > -1) {
                line = line.substr(reg1 + 3);
            }
            else {
                line = line.substr(reg1 + 2);
            }

            const value = reg2 === -1 ? "" : line.substr(0, reg2);
            if (reg2 > -1) {
                line = line.substr(3);
            }

            info.args.push({
                name: name,
                type: type,
                value: value
            });
        }

        return "";
    }
}