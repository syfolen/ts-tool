import { Constants } from "../Constants";
import { Util } from "../Util";
import { EnumParser } from "./EnumParser";
import { ClassParser } from "./ClassParser";
import { VariableParser } from "./VariableParser";
import { FunctionParser } from "./FunctionParser";

export abstract class DefineParser {

    protected $lines: string[];

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
     * 修饰关键字
     */
    keywords: string[] = [];

    /**
     * 属性解析器
     */
    variables: VariableParser = new VariableParser();

    /**
     * 方法解析器
     */
    functions: FunctionParser = new FunctionParser();

    constructor(str: string) {
        this.str = str;
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
     * 解析实现函数
     */
    protected abstract $parseDefineInfomation(): void;

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
}