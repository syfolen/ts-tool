
import fs from "fs";
import { Constants } from "../utils/Constants";
import { Util } from "../utils/Util";
import { ClassParser } from "./ClassParser";
import { EnumParser } from "./EnumParser";
import { DefineParser } from "./DefineParser";
import { InterfaceParser } from "./InterfaceParser";
import { NamespaceParser } from "./NamespaceParser";

export class FileParser {
    /**
     * 行信息
     */
    private $lines: string[] = [];

    /**
     * 文件地址
     */
    url: string;

    /**
     * 文件内容
     */
    str: string;

    /**
     * 模块名
     */
    name: string = "";

    /**
     * 文件注释
     */
    notes: string[] = [];

    /**
     * 定义解析器
     */
    parser: DefineParser;

    constructor(url: string) {
        this.url = url;
        this.str = this.$readContent(url);

        this.$lines = this.str.split(Constants.NEWLINE);

        this.$parseDefineInfomation(this.str);
        this.parser = this.$createDefineParser(this.$lines.join(Constants.NEWLINE));

        console.log(this.parser.toString());
    }

    /**
     * 创建定义解析器
     */
    private $createDefineParser(str: string): DefineParser {
        const e = new EnumParser(str);
        if (e.ok === true) {
            return e;
        }

        const c = new ClassParser(str);
        if (c.ok === true) {
            return c;
        }

        const i = new InterfaceParser(str);
        if (i.ok === true) {
            return i;
        }

        const n = new NamespaceParser(str);
        if (n.ok === true) {
            return n;
        }

        throw Error("yes");
    }

    /**
     * 读取文件注释
     */
    private $parseDefineInfomation(str: string): void {
        this.notes = Util.readNotes(this.$lines);

        // 必定有模块名
        const line = this.$lines.shift() as string;

        const s0 = line.substr(0, "module ".length);
        if (s0 !== "module ") {
            throw Error(`模块命名格式有误 url:${this.url}`);
        }

        const s1 = line.substring(line.length - 2);
        if (s1 !== " {") {
            throw Error(`模块命名格式有误 url:${this.url}`);
        }

        // 需要去掉最后面的一个括号
        while (this.$lines.length > 0) {
            const s2 = Util.trim(this.$lines.pop() as string);
            if (s2 === "") {
                continue;
            }
            if (s2 === "}") {
                break;
            }
        }

        Util.sortLines(this.$lines);
    }

    /**
     * 读取文件内容
     */
    private $readContent(url: string): string {
        return fs.readFileSync(url).toString();
    }
}