import { DefineParser } from "./DefineParser";
import { Util } from "../Util";

export class InterfaceParser extends DefineParser {

    protected $parseDefineInfomation(): void {
        const line = this.$lines.shift() as string;

        const a = line.indexOf(" interface ");
        if (a === -1) {
            return;
        }

        const str = line.substr(a + " interface ".length);
        const b = str.indexOf(" ");
        if (b === -1) {
            throw Error(`接口命名格式有误 line:${line}`);
        }

        this.name = str.substr(0, b);
        this.$lines.pop();

        const array = line.split(" ");
        if (array.pop() !== "{") {
            throw Error(`错误的接口定义格式 line:${line}`);
        }
        array.splice(0, 3);

        this.$parseParentDefination(array.slice(0));

        this.ok = true;
        Util.sortLines(this.$lines);
    }
}