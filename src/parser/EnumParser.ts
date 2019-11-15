import { DefineParser } from "./DefineParser";
import { Util } from "../Util";

export class EnumParser extends DefineParser {

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
    }
}