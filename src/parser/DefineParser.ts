import { Constants } from "../Constants";
import { Util } from "../Util";
import { IVariableInfo } from "../interfaces/IVariableInfo";
import { IFunctionInfo } from "../interfaces/IFunctionInfo";
import { DfnTypeEnum } from "../interfaces/DfnTypeEnum";

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
     * 名字
     */
    name: string = "";

    /**
     * 说明
     */
    notes: string[];

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
        this.notes = Util.readNotes(this.$lines);

        this.$parseDefineInfomation();

        if (this.name === "") {
            return;
        }
    }

    toString(): string {
        return `define ${this.name} extends [${this.parents.join(",")}] implements [${this.interfaces.join(",")}]`;
    }

    /**
     * 属性结束符
     */
    protected $getVarEndFlag(): string {
        return ";";
    }

    /**
     * 解析实现函数
     */
    protected abstract $parseDefineInfomation(): void;

    /**
     * 解析单行数据，以判断数据的类型
     */
    protected $parseLine(line: string): boolean {

        return false;
    }

    protected $isVar(line: string): boolean {
        const str = Util.trim(line);

        // 判断结束符
        const s0 = str.substr(str.length - 1);
        if (s0 !== ";") {
            return false;
        }

        // 必须为属性指定类型
        const reg0 = str.indexOf(":");
        if (reg0 === -1) {
            throw Error(`没有指定属性的类型 line:${line}`);
        }

        return true;
    }

    protected $isFunc(str: string): boolean {

    }

    /**
     * 解析方法
     */
    protected $parseFunctions(lines: string[]): number {
        const total = lines.length;

        while (lines.length > 0) {
            const remain = lines.length;
            const info: IFunctionInfo = {
                line: "",
                lines: [],
                notes: []
            };
            info.notes = Util.readNotes(lines);

            const line = lines.shift() as string;
            if (line.substr(line.length - 1) !== "{") {
                return total - remain;
            }
            info.line = line;

            let ok = false;
            while (lines.length > 0) {
                const line = lines.shift() as string;
                if (line === "}") {
                    ok = true;
                    break;
                }
                info.lines.push(line);
            }

            if (ok === false) {
                throw Error(`找不到函数结束符 line:${line}`);
            }
            Util.sortLines(info.lines);

            this.functions.push(info);
        }

        return total;
    }

    /**
     * 解析属性
     */
    protected $parseVariables(lines: string[]): number {
        const total = lines.length;

        while (lines.length > 0) {
            const remain = lines.length;
            const info: IVariableInfo = {
                line: "",
                notes: []
            };
            info.notes = Util.readNotes(lines);

            const line = lines.shift() as string;

            // 若属性结束符为分号，则为class、interface或namespace，此时应当校验结束符
            if (this.$getVarEndFlag() === ";" && line.substr(line.length - 1) !== ";") {
                return total - remain;
            }
            if (this.$isNotVar(line) === true) {
                return total - remain;
            }
            info.line = line;

            this.variables.push(info);
        }

        return total;
    }

    /**
     * 判断是否为属性定义
     */
    private $isNotVar(line: string): boolean {
        const a = line.indexOf(":");
        const b = line.indexOf("(");
        if (b > -1 && b < a) {
            return true;
        }
        return false;
    }

    /**
     * 父类解析实现函数
     */
    protected $parseParentDefination(array: string[]): void {
        const a = array.indexOf("extends");
        const b = array.indexOf("implements");

        if (a === -1) {
            return;
        }

        if (b > -1 && b < a) {
            throw Error(`奇怪的定义格式 line:${array.join(" ")}`);
        }

        if (b > -1) {
            array.length = b;
        }
        if (a > -1) {
            array.splice(0, a + 1);
        }

        this.parents = array;
        this.$removeCommas(array);
        this.$removeGenericityInArray(array);
    }

    /**
     * 接口解析实现函数
     */
    protected $paserInterfaceDefination(array: string[]): void {
        const a = array.indexOf("implements");

        if (a === -1) {
            return;
        }
        array.splice(0, a + 1);

        this.interfaces = array;
        this.$removeCommas(array);
        this.$removeGenericityInArray(array);
    }

    /**
     * 移除定义中的逗号
     */
    private $removeCommas(array: string[]): void {
        for (let i = 0; i < array.length; i++) {
            const str = array[i];
            const index = str.length - 1;
            if (str.substr(index, 1) === ",") {
                array[i] = str.substr(0, index);
            }
        }
    }

    /**
     * 移除名字中的泛型
     */
    protected $removeGenericity(name: string): string {
        const index = name.indexOf("<");
        if (index === -1) {
            return name;
        }
        return name.substr(0, index);
    }

    /**
     * 移除名字中的泛型
     */
    protected $removeGenericityInArray(array: string[]): void {
        for (let i = 0; i < array.length; i++) {
            const name = array[i];
            array[i] = this.$removeGenericity(name);
        }
    }
}