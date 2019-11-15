import { DefineParser } from "./DefineParser";
import { Util } from "../Util";

export class ClassParser extends DefineParser {

    protected $parseDefineInfomation(): void {
        const line = this.$lines.shift() as string;

        const a = line.indexOf(" class ");
        if (a === -1) {
            return;
        }
        if (line.indexOf(" abstract ") > -1) {
            this.keywords.push("abstract");
        }

        const str = line.substr(a + " class ".length);
        const b = str.indexOf(" ");
        if (b === -1) {
            throw Error(`类命名格式有误 line:${line}`);
        }

        this.name = str.substr(0, b);
        this.$lines.pop();

        const array = line.split(" ");
        if (array.pop() !== "{") {
            throw Error(`错误的类定义格式 line:${line}`);
        }

        if (this.keywords.length === 0) {
            array.splice(0, 3);
        }
        else {
            array.splice(0, 4);
        }

        this.$parseParentDefination(array.slice(0));
        this.$paserInterfaceDefination(array.slice(0));

        Util.sortLines(this.$lines);

        const n = this.variables.parse(this.$lines.slice(0));
        this.$lines.splice(0, n);

        this.functions.parse(this.$lines.slice(0));

        for (const info of this.variables.infos) {
            if (info.error !== "") {
                console.error(info.error);
                throw Error("解析变量出错 class " + this.name);
            }
        }

        for (const info of this.functions.infos) {
            if (info.error !== "") {
                console.error(info.error);
                throw Error("解析变量出错 class " + this.name);
            }
        }

        this.ok = true;
    }
}