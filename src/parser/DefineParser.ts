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
        const s0 = line.substr(line.length - 1);
        return s0 === ";";
    }

    /**
     * 判断是否为函数
     */
    protected $isFunc(line: string): boolean {
        const s0 = line.substr(line.length - 1);
        return s0 === "{";
    }

    /**
     * 逐行解析数据
     */
    protected $parseLines(lines: string[]): void {
        while (lines.length > 0) {
            const notes: string[] = Util.readNotes(lines);
            const line: string = lines.shift() as string;

            if (this.$isVar(line) === true) {
                const info: IVariableInfo = {
                    line: line,
                    notes: notes
                };
                this.variables.push(info);
            }
            else if (this.$isFunc(line) === true) {
                const info: IFunctionInfo = {
                    line: line,
                    lines: [],
                    notes: notes
                }
                if (this.$type !== DfnTypeEnum.INTERFACE) {
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
                        throw Error(`函数解析失败 line:${info.line}`);
                    }
                    Util.sortLines(info.lines);
                }
                this.functions.push(info);
            }
            else {
                throw Error(`解析失败 line:${line}`);
            }
        }
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