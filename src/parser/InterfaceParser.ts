import { DefineParser } from "./DefineParser";
import { Util } from "../utils/Util";
import { IFunctionInfo } from "../interfaces/IFunctionInfo";
import { DfnTypeEnum } from "../interfaces/DfnTypeEnum";

export class InterfaceParser extends DefineParser {

    constructor(str: string) {
        super(str, DfnTypeEnum.INTERFACE);
    }

    protected $parseDefineInfomation(): void {
        const line = this.$lines.shift() as string;
        const array = line.split(" ");

        const reg0 = array.indexOf("interface");
        if (reg0 === -1) {
            return;
        }

        const ok = array.shift() === "export" && array.pop() === "{";
        if (ok === false) {
            throw Error(`错误的接口定义格式 line:${line}`);
        }
        this.line = line;

        array.shift();

        this.name = this.$removeGenericity(array.shift() as string);
        this.$lines.pop();

        this.$parseParentDefination(array.slice(0));

        Util.sortLines(this.$lines);
        this.$parseLines(this.$lines);

        this.ok = true;
    }
}