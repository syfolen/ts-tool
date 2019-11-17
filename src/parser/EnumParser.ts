import { DefineParser } from "./DefineParser";
import { Util } from "../Util";
import { DfnTypeEnum } from "../interfaces/DfnTypeEnum";

export class EnumParser extends DefineParser {

    constructor(str: string) {
        super(str, DfnTypeEnum.ENUM);
    }

    protected $parseDefineInfomation(): void {
        const line = this.$lines.shift() as string;

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
        Util.sortLines(this.$lines);

        const n = this.$parseVariables(this.$lines.slice(0));
        if (n !== this.$lines.length) {
            throw Error(`解析终止，尚有${this.$lines.length - n}行没有解析 line:${line}`);
        }
    }

    /**
     * 属性结束符
     */
    protected $getVarEndFlag(): string {
        return ",";
    }
}