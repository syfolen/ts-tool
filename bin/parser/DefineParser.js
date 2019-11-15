"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("../Constants");
const Util_1 = require("../Util");
const VariableParser_1 = require("./VariableParser");
const FunctionParser_1 = require("./FunctionParser");
class DefineParser {
    constructor(str) {
        /**
         * 解析是否正确
         */
        this.ok = false;
        /**
         * 名字
         */
        this.name = "";
        /**
         * 父类
         */
        this.parents = [];
        /**
         * 接口
         */
        this.interfaces = [];
        /**
         * 修饰关键字
         */
        this.keywords = [];
        /**
         * 属性解析器
         */
        this.variables = new VariableParser_1.VariableParser();
        /**
         * 方法解析器
         */
        this.functions = new FunctionParser_1.FunctionParser();
        this.str = str;
        this.$lines = str.split(Constants_1.Constants.NEWLINE);
        this.notes = Util_1.Util.readNotes(this.$lines);
        this.$parseDefineInfomation();
        if (this.name === "") {
            return;
        }
    }
    toString() {
        return `define ${this.name} extends [${this.parents.join(",")}] implements [${this.interfaces.join(",")}]`;
    }
    /**
     * 父类解析实现函数
     */
    $parseParentDefination(array) {
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
    $paserInterfaceDefination(array) {
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
    $removeCommas(array) {
        for (let i = 0; i < array.length; i++) {
            const str = array[i];
            const index = str.length - 1;
            if (str.substr(index, 1) === ",") {
                array[i] = str.substr(0, index);
            }
        }
    }
}
exports.DefineParser = DefineParser;
//# sourceMappingURL=DefineParser.js.map