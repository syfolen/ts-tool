import { DefineParser } from "./DefineParser";
import { Util } from "../utils/Util";
import { DfnTypeEnum } from "../interfaces/DfnTypeEnum";
import { IVariableInfo } from "../interfaces/IVariableInfo";

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

    /**
     * 解析变量信息
     */
    protected $parserVarInfo(str: string, out: IVariableInfo): void {
        const reg0 = str.indexOf(",");
        if (reg0 !== -1) {
            str = str.substr(0, reg0);
        }

        const reg1 = str.indexOf(" = ");
        if (reg1 === -1) {
            out.name = str;
        }
        else {
            out.name = str.substr(0, reg1);
            out.value = str.substr(reg1 + 3);
            out.optional = true;
        }
    }
}