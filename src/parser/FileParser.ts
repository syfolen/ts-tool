
import fs from "fs";
import { Constants } from "../Constants";
import { Util } from "../Util";
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
        while (this.$lines.length > 0) {
            const line = Util.trim(this.$lines.shift() as string);
            if (line.indexOf("module ") !== 0) {
                continue;
            }
            const str = line.substr("module ".length);
            const index = str.indexOf(" {");
            if (index === -1) {
                continue;
            }
            this.name = str.substr(0, index);
            break;
        }

        if (this.name === "") {
            throw Error(`没有找到模块名 url:${this.url}`);
        }

        const index = str.indexOf(`module ${this.name} {`);
        if (index === -1) {
            throw Error(`模块命名格式有误 url:${this.url}`);
        }

        // 需要去掉最后面的一个括号
        while (this.$lines.length > 0) {
            const line = Util.trim(this.$lines.pop() as string);
            if (line === "") {
                continue;
            }
            if (line === "}") {
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