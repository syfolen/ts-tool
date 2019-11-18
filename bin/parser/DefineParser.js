"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Constants_1 = require("../Constants");
var Util_1 = require("../Util");
var DfnTypeEnum_1 = require("../interfaces/DfnTypeEnum");
var DefineParser = /** @class */ (function () {
    function DefineParser(str, type) {
        this.$type = DfnTypeEnum_1.DfnTypeEnum.NONE;
        /**
         * 解析是否正确
         */
        this.ok = false;
        /**
         * 定义串
         */
        this.line = "";
        /**
         * 名字
         */
        this.name = "";
        /**
         * 说明
         */
        this.notes = [];
        /**
         * 父类
         */
        this.parents = [];
        /**
         * 接口
         */
        this.interfaces = [];
        /**
         * 属性解析器
         */
        this.variables = [];
        /**
         * 方法解析器
         */
        this.functions = [];
        this.str = str;
        this.$type = type;
        this.$lines = str.split(Constants_1.Constants.NEWLINE);
        if (type !== DfnTypeEnum_1.DfnTypeEnum.NAMESPACE) {
            this.notes = Util_1.Util.readNotes(this.$lines);
        }
        this.$parseDefineInfomation();
        if (this.name === "") {
            return;
        }
    }
    DefineParser.prototype.toString = function () {
        return "define " + this.name + " extends [" + this.parents.join(",") + "] implements [" + this.interfaces.join(",") + "]";
    };
    /**
     * 判断是否为变量
     */
    DefineParser.prototype.$isVar = function (line) {
        var reg0 = line.indexOf("(");
        if (reg0 === -1) {
            return true;
        }
        var reg1 = line.indexOf(":");
        if (reg1 < reg0) {
            return true;
        }
        return false;
    };
    /**
     * 判断是否为函数
     */
    DefineParser.prototype.$isFunc = function (line) {
        var s0 = line.substr(line.length - 1);
        if (s0 === "{") {
            return true;
        }
        var s1 = " " + line;
        var reg0 = s1.indexOf(" abstract ");
        if (reg0 > -1) {
            return true;
        }
        return false;
    };
    /**
     * 逐行解析数据
     */
    DefineParser.prototype.$parseLines = function (lines) {
        while (lines.length > 0) {
            var notes = Util_1.Util.readNotes(lines);
            var line = lines.shift();
            if (this.$isVar(line) === true) {
                var info = {
                    line: line,
                    notes: notes
                };
                this.variables.push(info);
            }
            else if (this.$isFunc(line) === true) {
                var info = {
                    line: line,
                    lines: [],
                    notes: notes
                };
                var s0 = " " + line;
                var reg0 = s0.indexOf(" abstract ");
                if (this.$type !== DfnTypeEnum_1.DfnTypeEnum.INTERFACE && reg0 === -1) {
                    var ok = false;
                    while (lines.length > 0) {
                        var line_1 = lines.shift();
                        if (line_1 === "}") {
                            ok = true;
                            break;
                        }
                        info.lines.push(line_1);
                    }
                    if (ok === false) {
                        throw Error("\u51FD\u6570\u89E3\u6790\u5931\u8D25 line:" + info.line);
                    }
                    Util_1.Util.sortLines(info.lines);
                }
                this.functions.push(info);
            }
            else {
                throw Error("\u89E3\u6790\u5931\u8D25 line:" + line);
            }
        }
    };
    /**
     * 父类解析实现函数
     */
    DefineParser.prototype.$parseParentDefination = function (array) {
        var a = array.indexOf("extends");
        var b = array.indexOf("implements");
        if (a === -1) {
            return;
        }
        if (b > -1 && b < a) {
            throw Error("\u5947\u602A\u7684\u5B9A\u4E49\u683C\u5F0F line:" + array.join(" "));
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
    };
    /**
     * 接口解析实现函数
     */
    DefineParser.prototype.$paserInterfaceDefination = function (array) {
        var a = array.indexOf("implements");
        if (a === -1) {
            return;
        }
        array.splice(0, a + 1);
        this.interfaces = array;
        this.$removeCommas(array);
        this.$removeGenericityInArray(array);
    };
    /**
     * 移除定义中的逗号
     */
    DefineParser.prototype.$removeCommas = function (array) {
        for (var i = 0; i < array.length; i++) {
            var str = array[i];
            var index = str.length - 1;
            if (str.substr(index, 1) === ",") {
                array[i] = str.substr(0, index);
            }
        }
    };
    /**
     * 移除名字中的泛型
     */
    DefineParser.prototype.$removeGenericity = function (name) {
        var index = name.indexOf("<");
        if (index === -1) {
            return name;
        }
        return name.substr(0, index);
    };
    /**
     * 移除名字中的泛型
     */
    DefineParser.prototype.$removeGenericityInArray = function (array) {
        for (var i = 0; i < array.length; i++) {
            var name_1 = array[i];
            array[i] = this.$removeGenericity(name_1);
        }
    };
    return DefineParser;
}());
exports.DefineParser = DefineParser;
//# sourceMappingURL=DefineParser.js.map