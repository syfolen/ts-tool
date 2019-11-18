import { DefineParser } from "./DefineParser";
import { Util } from "../Util";
import { DfnTypeEnum } from "../interfaces/DfnTypeEnum";

export class ClassParser extends DefineParser {

    constructor(str: string) {
        super(str, DfnTypeEnum.CLASS);
    }

    protected $parseDefineInfomation(): void {
        const line = this.$lines.shift() as string;
        const array = line.split(" ");

        const reg0 = array.indexOf("class");
        if (reg0 === -1) {
            return;
        }

        const ok = array.shift() === "export" && array.pop() === "{";
        if (ok === false) {
            throw Error(`错误的类定义格式 line:${line}`);
        }
        this.line = line;

        const keywords: string[] = [];
        if (array[0] === "abstract") {
            keywords.push(array.shift() as string);
        }
        array.shift();

        this.name = this.$removeGenericity(array.shift() as string);
        this.$lines.pop();

        this.$parseParentDefination(array.slice(0));
        this.$paserInterfaceDefination(array.slice(0));

        Util.sortLines(this.$lines);
        this.$parseLines(this.$lines);

        this.ok = true;
    }
}