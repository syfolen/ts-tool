import { DefineParser } from "./DefineParser";
import { DfnTypeEnum } from "../interfaces/DfnTypeEnum";

export class ModuleParser extends DefineParser {

    constructor(str: string) {
        super(str, DfnTypeEnum.MODULE);
    }

    protected $parseDefineInfomation(): void {
        this.$parseLines(this.$lines);

        this.ok = true;
    }
}