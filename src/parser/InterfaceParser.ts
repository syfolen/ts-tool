import { DefineParser } from "./DefineParser";
import { Util } from "../Util";
import { IFunctionInfo } from "../interfaces/IFunctionInfo";
import { DfnTypeEnum } from "../interfaces/DfnTypeEnum";

export class InterfaceParser extends DefineParser {

    constructor(str: string) {
        super(str, DfnTypeEnum.INTERFACE);
    }

    protected $parseDefineInfomation(): void {
        const line = this.$lines.shift() as string;

        const a = line.indexOf(" interface ");
        if (a === -1) {
            return;
        }

        const str = line.substr(a + " interface ".length);
        const b = str.indexOf(" ");
        if (b === -1) {
            throw Error(`接口命名格式有误 line:${line}`);
        }

        this.name = str.substr(0, b);
        this.$lines.pop();

        const array = line.split(" ");
        if (array.pop() !== "{") {
            throw Error(`错误的接口定义格式 line:${line}`);
        }
        array.splice(0, 3);

        this.$parseParentDefination(array.slice(0));

        Util.sortLines(this.$lines);

        const m = this.$parseVariables(this.$lines.slice(0));
        this.$lines.splice(0, m);

        const n = this.$parseFunctions(this.$lines.slice(0));
        if (n !== this.$lines.length) {
            throw Error(`解析终止，尚有${this.$lines.length - n}行没有解析 line:${line}`);
        }

        this.ok = true;
    }

    /**
     * 解析方法
     */
    protected $parseFunctions(lines: string[]): number {
        const total = lines.length;

        while (lines.length > 0) {
            const remain = lines.length;
            const info: IFunctionInfo = {
                line: "",
                lines: [],
                notes: []
            };
            info.notes = Util.readNotes(lines);

            const line = lines.shift() as string;
            if (line.substr(line.length - 1) !== ";") {
                return total - remain;
            }
            info.line = line;

            this.functions.push(info);
        }

        return total;
    }
}