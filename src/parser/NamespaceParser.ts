import { DefineParser } from "./DefineParser";
import { DfnTypeEnum } from "../interfaces/DfnTypeEnum";
import { Util } from "../utils/Util";

export class NamespaceParser extends DefineParser {

    constructor(str: string) {
        super(str, DfnTypeEnum.NAMESPACE);
    }

    protected $parseDefineInfomation(): void {
        const line = this.$lines.shift() as string;
        const array = line.split(" ");

        const reg0 = array.indexOf("namespace");
        if (reg0 === -1) {
            return;
        }

        const ok = array.shift() === "export" && array.pop() === "{";
        if (ok === false) {
            throw Error(`错误的命名空间定义格式 line:${line}`);
        }
        array.shift();

        this.name = array[0];
        this.$lines.pop();

        Util.sortLines(this.$lines);
        this.$parseLines(this.$lines);

        this.ok = true;
    }
}