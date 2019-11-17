import { DefineParser } from "./DefineParser";
import { Util } from "../Util";
import { DfnTypeEnum } from "../interfaces/DfnTypeEnum";

export class ClassParser extends DefineParser {

    constructor(str: string) {
        super(str, DfnTypeEnum.CLASS);
    }

    protected $parseDefineInfomation(): void {
        const line = this.$lines.shift() as string;

        const a = line.indexOf(" class ");
        if (a === -1) {
            return;
        }

        const keywords: string[] = [];
        if (line.indexOf(" abstract ") > -1) {
            keywords.push("abstract");
        }

        const str = line.substr(a + " class ".length);
        const b = str.indexOf(" ");
        if (b === -1) {
            throw Error(`类命名格式有误 line:${line}`);
        }

        this.name = this.$removeGenericity(str.substr(0, b));
        this.$lines.pop();

        const array = line.split(" ");
        if (array.pop() !== "{") {
            throw Error(`错误的类定义格式 line:${line}`);
        }

        if (keywords.length === 0) {
            array.splice(0, 3);
        }
        else {
            array.splice(0, 4);
        }

        this.$parseParentDefination(array.slice(0));
        this.$paserInterfaceDefination(array.slice(0));

        Util.sortLines(this.$lines);

        const m = this.$parseVariables(this.$lines.slice(0));
        this.$lines.splice(0, m);

        const n = this.$parseFunctions(this.$lines.slice(0));
        if (n !== this.$lines.length) {
            throw Error(`解析终止，尚有${this.$lines.length - n}行没有解析 line:${line}`);
        }

        this.ok = true;
    }
}