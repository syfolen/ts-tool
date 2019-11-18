import { DefineParser } from "./DefineParser";
import { DfnTypeEnum } from "../interfaces/DfnTypeEnum";

export class NamespaceParser extends DefineParser {

    constructor(str: string) {
        super(str, DfnTypeEnum.NAMESPACE);
    }

    protected $parseDefineInfomation(): void {
        this.$parseLines(this.$lines);

        this.ok = true;
    }
}