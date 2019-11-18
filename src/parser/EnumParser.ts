import { DefineParser } from "./DefineParser";
import { Util } from "../Util";
import { DfnTypeEnum } from "../interfaces/DfnTypeEnum";

export class EnumParser extends DefineParser {

    constructor(str: string) {
        super(str, DfnTypeEnum.ENUM);
    }

    protected $parseDefineInfomation(): void {
        const line = this.$lines.shift() as string;
        const array = line.split(" ");

        const reg0 = array.indexOf("enum");
        if (reg0 === -1) {
            return;
        }

        const ok = array.shift() === "export" && array.pop() === "{";
        if (ok === false) {
            throw Error(`错误的枚举定义格式 line:${line}`);
        }
        array.shift();

        this.name = array[0];
        this.$lines.pop();

        Util.sortLines(this.$lines);
        this.$parseLines(this.$lines);

        this.ok = true;
    }

    /**
     * 判断是否为变量
     */
    protected $isVar(line: string): boolean {
        return true;
    }
}