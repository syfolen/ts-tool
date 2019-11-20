import { Constants } from "../utils/Constants";
import { Util } from "../utils/Util";
import { IVariableInfo } from "../interfaces/IVariableInfo";
import { IFunctionInfo } from "../interfaces/IFunctionInfo";
import { DfnTypeEnum } from "../interfaces/DfnTypeEnum";
import { IArgumentInfo } from "../interfaces/IArumentInfo";
import { Logger } from "../utils/Logger";

export abstract class DefineParser {

    protected $lines: string[];

    protected $type: DfnTypeEnum = DfnTypeEnum.NONE;

    /**
     * 解析是否正确
     */
    ok: boolean = false;

    /**
     * 文本
     */
    str: string;

    /**
     * 定义串
     */
    line: string = "";

    /**
     * 名字
     */
    name: string = "";

    /**
     * 说明
     */
    notes: string[] = [];

    /**
     * 父类
     */
    parents: string[] = [];

    /**
     * 接口
     */
    interfaces: string[] = [];

    /**
     * 属性解析器
     */
    variables: IVariableInfo[] = [];

    /**
     * 方法解析器
     */
    functions: IFunctionInfo[] = [];

    constructor(str: string, type: DfnTypeEnum) {
        this.str = str;
        this.$type = type;
        this.$lines = str.split(Constants.NEWLINE);

        if (type !== DfnTypeEnum.NAMESPACE) {
            this.notes = Util.readNotes(this.$lines);
        }

        this.$parseDefineInfomation();

        if (this.name === "") {
            return;
        }
    }

    toString(): string {
        return `define ${this.name} extends [${this.parents.join(",")}] implements [${this.interfaces.join(",")}]`;
    }

    /**
     * 解析实现函数
     */
    protected abstract $parseDefineInfomation(): void;

    /**
     * 判断是否为变量
     */
    protected $isVar(line: string): boolean {
        if (line === "constructor() {") {
            return false;
        }

        const reg0 = line.indexOf("(");
        if (reg0 === -1) {
            return true;
        }

        const reg1 = line.indexOf(":");
        if (reg1 < reg0) {
            return true;
        }

        return false;
    }

    /**
     * 逐行解析数据
     */
    protected $parseLines(lines: string[]): void {
        while (lines.length > 0) {
            const notes: string[] = Util.readNotes(lines);
            if (this.$isVar(lines[0]) === true) {
                const info = this.$readVariableInfomation(lines);
                info.notes = notes;
                this.variables.push(info);
            }
            else {
                const info = this.$readFunctionInfomation(lines);
                info.notes = notes;
                this.functions.push(info);
            }
        }
        for (const item of this.variables) {
            Logger.log("name", item.name);
            Logger.log("type", item.type);
            Logger.log("value", item.value);
            for (const a of item.keywords) {
                Logger.log("keywords", a);
            }
        }
        for (const item of this.functions) {
            Logger.log("name", item.name);
            Logger.log("type", item.ret);
            for (const a of item.keywords) {
                Logger.log("keywords", a);
            }
            for (const a of item.args) {
                Logger.log("name", a.name);
                Logger.log("type", a.type);
                Logger.log("value", a.value);
            }
        }
    }

    /**
     * 父类解析实现函数
     */
    protected $parseParentDefination(array: string[]): void {
        const reg0 = array.indexOf("extends");
        const reg1 = array.indexOf("implements");

        if (reg0 === -1) {
            return;
        }

        if (reg1 > -1 && reg1 < reg0) {
            throw Error(`奇怪的定义格式 line:${array.join(" ")}`);
        }

        if (reg1 > -1) {
            array.length = reg1;
        }
        if (reg0 > -1) {
            array.splice(0, reg0 + 1);
        }

        this.parents = array;
        this.$removeCommas(array);
        this.$removeGenericityInArray(array);
    }

    /**
     * 接口解析实现函数
     */
    protected $paserInterfaceDefination(array: string[]): void {
        const reg0 = array.indexOf("implements");

        if (reg0 === -1) {
            return;
        }
        array.splice(0, reg0 + 1);

        this.interfaces = array;
        this.$removeCommas(array);
        this.$removeGenericityInArray(array);
    }

    /**
     * 移除定义中的逗号
     */
    private $removeCommas(array: string[]): void {
        for (let i = 0; i < array.length; i++) {
            const s0 = array[i];
            const reg0 = s0.length - 1;
            if (s0.substr(reg0) === ",") {
                array[i] = s0.substr(0, reg0);
            }
        }
    }

    /**
     * 移除名字中的泛型
     */
    protected $removeGenericity(name: string): string {
        const reg0 = name.indexOf("<");
        if (reg0 === -1) {
            return name;
        }
        return name.substr(0, reg0);
    }

    /**
     * 移除名字中的泛型
     */
    protected $removeGenericityInArray(array: string[]): void {
        for (let i = 0; i < array.length; i++) {
            const s0 = array[i];
            array[i] = this.$removeGenericity(s0);
        }
    }

    /**
     * 读取方法信息
     */
    protected $readFunctionInfomation(lines: string[]): IFunctionInfo {
        const info: IFunctionInfo = {
            notes: [],
            lines: [],
            keywords: [],
            line: "",
            name: "",
            args: [],
            ret: ""
        };

        const line = lines.shift() as string;
        let str = this.$readKeyworkds(line, info.keywords);

        info.line = line;
        this.$parseFuncInfo(str, info);

        const reg0 = this.$type === DfnTypeEnum.INTERFACE ? 0 : info.keywords.indexOf("abstract");
        if (reg0 === -1) {
            let ok = false;
            while (lines.length > 0) {
                const s5 = lines.shift() as string;
                if (s5 === "}") {
                    ok = true;
                    break;
                }
                info.lines.push(s5);
            }
            if (ok === false) {
                throw Error(`解析函数失败 line:${line}`);
            }
            Util.sortLines(info.lines);
        }

        return info;
    }

    /**
     * 解析方法信息
     */
    protected $parseFuncInfo(str: string, out: IFunctionInfo): void {
        const line = out.line;

        const reg0 = str.indexOf("(");
        if (reg0 === -1) {
            throw Error(`函数定义格式有误 line:${line}`);
        }

        // 获取函数名
        out.name = str.substr(0, reg0);
        if (out.name.indexOf(" ") !== -1) {
            throw Error(`函数定义格式有误 line:${line}`);
        }

        str = str.substr(reg0 + 1);

        // 参数区域
        let min = 0;
        let max = 0;

        const reg2 = out.name === "constructor" ? 0 : out.keywords.indexOf("set");
        const reg3 = this.$type === DfnTypeEnum.INTERFACE ? 0 : out.keywords.indexOf("abstract");

        if (reg2 !== -1 && reg3 !== -1) {
            const reg0 = str.length - 2;
            if (reg0 < 0) {
                throw Error(`函数解析失败 line:${line}`);
            }
            const s0 = str.substr(reg0);
            if (s0 !== ");") {
                throw Error(`函数解析失败 line:${line}`);
            }
            max = reg0;
        }
        else if (reg2 !== -1) {
            const reg0 = str.length - 3;
            if (reg0 < 0) {
                throw Error(`函数解析失败 line:${line}`);
            }
            const s0 = str.substr(reg0);
            if (s0 !== ") {") {
                throw Error(`函数解析失败 line:${line}`);
            }
            max = reg0;
        }
        else {
            const reg0 = str.indexOf("): ");
            if (reg0 === -1) {
                throw Error(`函数解析失败 line:${line}`);
            }
            max = reg0;
        }

        if (max < min) {
            throw Error(`函数解析失败 line:${line}`);
        }

        let s0 = str.substr(min, max);
        out.args = this.$parseArguments(s0);

        if (reg2 !== -1) {
            return;
        }
        const reg4 = max + 3;

        s0 = str.substr(reg4, str.length);

        let reg5;
        if (reg3 > -1) {
            reg5 = s0.length - 1;
        }
        else {
            reg5 = s0.length - 2;
        }
        if (reg5 < -1) {
            throw Error(`函数解析失败 line:${line}`);
        }
        const s1 = s0.substr(reg5);
        if (reg3 > -1) {
            if (s1 !== ";") {
                throw Error(`函数解析失败 line:${line}`);
            }
        }
        else {
            if (s1 !== " {") {
                throw Error(`函数解析失败 line:${line}`);
            }
        }
        out.ret = s0.substr(0, reg5);
    }

    /**
     * 将函数的参数解析成字符串列表并返回
     */
    protected $parseArguments(str: string): IArgumentInfo[] {
        const infos: IArgumentInfo[] = [];

        let s0 = str;

        while (s0.length > 0) {
            const info: IArgumentInfo = {
                name: "",
                type: "",
                optional: false,
                value: ""
            }

            const reg0 = s0.indexOf(": ");
            if (reg0 === -1) {
                throw Error(`列表中存在未指定类型的参数 str:${str}`);
            }
            info.name = s0.substr(0, reg0);

            s0 = s0.substr(reg0 + 2);

            let ok = false;

            let reg1 = 0;
            while (reg1 < s0.length) {
                const reg2 = s0.indexOf(", ", reg1);
                const reg3 = s0.indexOf(" = ", reg1);

                let reg4;
                if (reg2 === -1) {
                    reg4 = reg3;
                }
                else if (reg3 === -1) {
                    reg4 = reg2;
                }
                else {
                    reg4 = reg2 < reg3 ? reg2 : reg3;
                }
                if (reg4 === -1) {
                    reg4 = s0.length;
                }

                let reg5 = reg4;
                if (reg5 === reg2) {
                    reg5 += 2;
                }
                else if (reg5 === reg3) {
                    reg5 += 3;
                    info.optional = true;
                }

                const s1 = s0.substr(0, reg4);
                if (this.$isDfnOk(s1) === false) {
                    reg1 = reg5;
                    continue;
                }
                info.type = s1;

                ok = true;
                s0 = s0.substr(reg5);

                break;
            }
            if (ok === false) {
                throw Error(`参数类型解析失败 str:${str}`);
            }

            if (info.optional === true) {
                ok = false;
                let reg2 = 0;
                while (reg2 < s0.length) {
                    const reg3 = s0.indexOf(", ", reg2);
                    const reg4 = reg3 > -1 ? reg3 : s0.length;

                    const reg5 = reg4 === reg3 ? reg3 + 2 : reg4;

                    const s6 = s0.substr(0, reg4);
                    if (this.$isDfnOk(s6) === false) {
                        reg2 = reg5;
                        continue;
                    }
                    info.value = s6;

                    ok = true;
                    s0 = s0.substr(reg5);

                    break;
                }
                if (ok === false) {
                    throw Error(`参数默认值解析失败 str:${str}`);
                }
            }

            infos.push(info);
        }

        return infos;
    }

    /**
     * 判断定义是否完整
     */
    private $isDfnOk(str: string): boolean {
        const a = ["\"", "'", "`"];
        const b = ["<", "(", "{", "["];
        const c = [">", ")", "}", "]"];

        let s0 = "";

        let reg0 = 0;
        let reg1 = 0;
        let reg2 = 0;

        const array = str.split("");

        for (let i = 0; i < array.length; i++) {
            const s1 = array[i];
            const s2 = i === 0 ? "" : array[i - 1];
            if (s1 === ">" && s2 === "=") {
                continue;
            }
            if (a.indexOf(s1) > -1) {
                if (s2 === "\\") {
                    continue;
                }
                if (s0 !== "" && s1 !== s0) {
                    continue;
                }
                if (s0 === "") {
                    s0 = s1;
                }
                else {
                    s0 = "";
                }
                reg0++;
            }
            else if (b.indexOf(s1) > -1) {
                reg1++;
            }
            else if (c.indexOf(s1) > -1) {
                reg2++;
            }
        }

        const ok = reg0 % 2 === 0 && reg1 === reg2;

        return ok;
    }

    /**
     * 读取变量信息
     */
    protected $readVariableInfomation(lines: string[]): IVariableInfo {
        const info: IVariableInfo = {
            notes: [],
            lines: [],
            keywords: [],
            name: "",
            type: "",
            optional: false,
            value: ""
        };

        const line = lines.shift() as string;
        let str = this.$readKeyworkds(line, info.keywords);

        do {
            const reg0 = str.indexOf(" = ");
            if (reg0 > -1) {
                const s0 = str.substr(reg0 + 3);

                let s1: string;
                if (s0 === "[") {
                    s1 = "];";
                }
                else if (s0 === "{") {
                    s1 = "};";
                }
                else {
                    s1 = "";
                }

                if (s1 !== "") {
                    let ok = false;
                    while (lines.length > 0) {
                        const s2 = lines.shift() as string;
                        info.lines.push(s2);
                        if (s2 === s1) {
                            ok = true;
                            break;
                        }
                    }
                    if (ok === false) {
                        throw Error(`属性解析出错 line:${line}`);
                    }
                }
            }

            info.lines.unshift(line);
        } while (false);

        const reg1 = str.length - 1;
        const s3 = str.substr(reg1);

        if (s3 !== ";") {
            this.$parserVarInfo(str, info);
        }
        else {
            this.$parserVarInfo(str.substr(0, reg1), info);
        }


        return info;
    }

    /**
     * 解析变量信息
     */
    protected $parserVarInfo(str: string, out: IVariableInfo): void {
        const line = out.lines[0];

        const reg0 = str.indexOf(": ");
        if (reg0 === -1) {
            throw Error(`必须为变量指定类型 line:${line}`);
        }

        // 获取变量名
        out.name = str.substr(0, reg0);

        const reg1 = out.name.lastIndexOf(" ");
        if (reg1 !== -1) {
            throw Error(`变量解析出错 line:${line}`);
        }

        const reg6 = out.name.length - 1;
        const s0 = out.name.substr(reg6);
        const reg2 = str.indexOf(" = ");

        let s1 = "";
        if (s0 === "?") {
            out.name = out.name.substr(0, reg6);
            out.optional = true;
        }
        else if (reg2 > -1) {
            s1 = str.substr(reg2 + 3);
            out.optional = true;
        }
        else {
            out.optional = false;
        }

        if (s1 !== "") {
            const reg3 = s1.length - 1;
            const s2 = s1.substr(reg3);
            if (s2 === ";") {
                out.value = s1.substr(0, reg3);
            }
            else {
                out.value = s1;
            }
        }

        const reg4 = reg0 + 2;
        if (reg2 === -1) {
            out.type = str.substr(reg4);
        }
        else {
            out.type = str.substring(reg4, reg2);
        }
    }

    private $readKeyworkds(line: string, out: string[]): string {
        let str = " " + line;

        const a = ["public", "protected", "private"];
        for (const s1 of a) {
            const s0 = " " + s1 + " ";
            const reg0 = str.indexOf(s0);
            if (reg0 === -1) {
                continue;
            }
            str = str.substr(0, reg0) + " " + str.substr(reg0 + s0.length);
            if (s1 !== "public") {
                out.push(s1);
            }
        }

        const b = ["static", "readonly", "abstract", "get", "set", "export", "function", "const", "let"];
        for (const s3 of b) {
            const s2 = " " + s3 + " ";
            const reg1 = str.indexOf(s2);
            if (reg1 === -1) {
                continue;
            }
            str = str.substr(0, reg1) + " " + str.substr(reg1 + s2.length);
            out.push(s3);
        }

        return str.substr(1);
    }
}