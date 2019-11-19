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
     * 逐行解析数据
     */
    DefineParser.prototype.$parseLines = function (lines) {
        while (lines.length > 0) {
            var notes = Util_1.Util.readNotes(lines);
            if (this.$isVar(lines[0]) === true) {
                var info = this.$readVariableInfomation(lines);
                info.notes = notes;
                this.variables.push(info);
            }
            else {
                var info = this.$readFunctionInfomation(lines);
                info.notes = notes;
                this.functions.push(info);
            }
        }
    };
    /**
     * 父类解析实现函数
     */
    DefineParser.prototype.$parseParentDefination = function (array) {
        var reg0 = array.indexOf("extends");
        var reg1 = array.indexOf("implements");
        if (reg0 === -1) {
            return;
        }
        if (reg1 > -1 && reg1 < reg0) {
            throw Error("\u5947\u602A\u7684\u5B9A\u4E49\u683C\u5F0F line:" + array.join(" "));
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
    };
    /**
     * 接口解析实现函数
     */
    DefineParser.prototype.$paserInterfaceDefination = function (array) {
        var reg0 = array.indexOf("implements");
        if (reg0 === -1) {
            return;
        }
        array.splice(0, reg0 + 1);
        this.interfaces = array;
        this.$removeCommas(array);
        this.$removeGenericityInArray(array);
    };
    /**
     * 移除定义中的逗号
     */
    DefineParser.prototype.$removeCommas = function (array) {
        for (var i = 0; i < array.length; i++) {
            var s0 = array[i];
            var reg0 = s0.length - 1;
            if (s0.substr(reg0) === ",") {
                array[i] = s0.substr(0, reg0);
            }
        }
    };
    /**
     * 移除名字中的泛型
     */
    DefineParser.prototype.$removeGenericity = function (name) {
        var reg0 = name.indexOf("<");
        if (reg0 === -1) {
            return name;
        }
        return name.substr(0, reg0);
    };
    /**
     * 移除名字中的泛型
     */
    DefineParser.prototype.$removeGenericityInArray = function (array) {
        for (var i = 0; i < array.length; i++) {
            var s0 = array[i];
            array[i] = this.$removeGenericity(s0);
        }
    };
    /**
     * 读取方法信息
     */
    DefineParser.prototype.$readFunctionInfomation = function (lines) {
        var info = {
            notes: [],
            lines: [],
            keywords: [],
            line: "",
            name: "",
            args: [],
            ret: ""
        };
        var line = lines.shift();
        var str = this.$readKeyworkds(line, info.keywords);
        info.line = line;
        this.$parseFuncInfo(str, info);
        if (info.keywords.indexOf("abstract") === -1) {
            var ok = false;
            while (lines.length > 0) {
                var s5 = lines.shift();
                if (s5 === "}") {
                    ok = true;
                    break;
                }
                info.lines.push(s5);
            }
            if (ok === false) {
                throw Error("\u89E3\u6790\u51FD\u6570\u5931\u8D25 line:" + line);
            }
            Util_1.Util.sortLines(info.lines);
        }
        return info;
    };
    /**
     * 解析方法信息
     */
    DefineParser.prototype.$parseFuncInfo = function (str, out) {
        var line = out.line;
        var reg0 = str.indexOf("(");
        if (reg0 === -1) {
            throw Error("\u51FD\u6570\u5B9A\u4E49\u683C\u5F0F\u6709\u8BEF line:" + line);
        }
        // 获取函数名
        out.name = str.substr(0, reg0);
        if (out.name.indexOf(" ") !== -1) {
            throw Error("\u51FD\u6570\u5B9A\u4E49\u683C\u5F0F\u6709\u8BEF line:" + line);
        }
        str = str.substr(reg0 + 1);
        // 参数区域
        var min = 0;
        var max = 0;
        var reg2 = out.keywords.indexOf("set");
        var reg3 = out.keywords.indexOf("abstract");
        if (reg2 !== -1 && reg3 !== -1) {
            var reg0_1 = str.length - 2;
            if (reg0_1 < 0) {
                throw Error("\u51FD\u6570\u89E3\u6790\u5931\u8D25 line:" + line);
            }
            var s0_1 = str.substr(reg0_1);
            if (s0_1 !== ");") {
                throw Error("\u51FD\u6570\u89E3\u6790\u5931\u8D25 line:" + line);
            }
            max = reg0_1;
        }
        else if (reg2 !== -1) {
            var reg0_2 = str.length - 3;
            if (reg0_2 < 0) {
                throw Error("\u51FD\u6570\u89E3\u6790\u5931\u8D25 line:" + line);
            }
            var s0_2 = str.substr(reg0_2);
            if (s0_2 !== ") {") {
                throw Error("\u51FD\u6570\u89E3\u6790\u5931\u8D25 line:" + line);
            }
            max = reg0_2;
        }
        else {
            var reg0_3 = str.indexOf("): ");
            if (reg0_3 === -1) {
                throw Error("\u51FD\u6570\u89E3\u6790\u5931\u8D25 line:" + line);
            }
            max = reg0_3;
        }
        if (max < min) {
            throw Error("\u51FD\u6570\u89E3\u6790\u5931\u8D25 line:" + line);
        }
        var s0 = str.substr(min, max);
        out.args = this.$parseArguments(s0);
        if (reg2 !== -1) {
            return;
        }
        var reg4 = max + 3;
        s0 = str.substr(reg4, str.length);
        var reg5;
        if (reg3 > -1) {
            reg5 = s0.length - 1;
        }
        else {
            reg5 = s0.length - 2;
        }
        if (reg5 < -1) {
            throw Error("\u51FD\u6570\u89E3\u6790\u5931\u8D25 line:" + line);
        }
        var s1 = s0.substr(reg5);
        if (reg3 > -1) {
            if (s1 !== ";") {
                throw Error("\u51FD\u6570\u89E3\u6790\u5931\u8D25 line:" + line);
            }
        }
        else {
            if (s1 !== " {") {
                throw Error("\u51FD\u6570\u89E3\u6790\u5931\u8D25 line:" + line);
            }
        }
        out.ret = s0.substr(0, reg5);
    };
    /**
     * 将函数的参数解析成字符串列表并返回
     */
    DefineParser.prototype.$parseArguments = function (str) {
        var infos = [];
        var s0 = str;
        while (s0.length > 0) {
            var info = {
                name: "",
                type: "",
                optional: false,
                value: ""
            };
            var reg0 = s0.indexOf(": ");
            if (reg0 === -1) {
                throw Error("\u5217\u8868\u4E2D\u5B58\u5728\u672A\u6307\u5B9A\u7C7B\u578B\u7684\u53C2\u6570 str:" + str);
            }
            info.name = s0.substr(0, reg0);
            s0 = s0.substr(reg0 + 2);
            var ok = false;
            var reg1 = 0;
            while (reg1 < s0.length) {
                var reg2 = s0.indexOf(", ", reg1);
                var reg3 = s0.indexOf(" = ", reg1);
                var reg4 = void 0;
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
                var reg5 = reg4;
                if (reg5 === reg2) {
                    reg5 += 2;
                }
                else if (reg5 === reg3) {
                    reg5 += 3;
                    info.optional = true;
                }
                var s1 = s0.substr(0, reg4);
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
                throw Error("\u53C2\u6570\u7C7B\u578B\u89E3\u6790\u5931\u8D25 str:" + str);
            }
            if (info.optional === true) {
                ok = false;
                var reg2 = 0;
                while (reg2 < s0.length) {
                    var reg3 = s0.indexOf(", ", reg2);
                    var reg4 = reg3 > -1 ? reg3 : s0.length;
                    var reg5 = reg4 === reg3 ? reg3 + 2 : reg4;
                    var s6 = s0.substr(0, reg4);
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
                    throw Error("\u53C2\u6570\u9ED8\u8BA4\u503C\u89E3\u6790\u5931\u8D25 str:" + str);
                }
            }
            infos.push(info);
        }
        return infos;
    };
    /**
     * 判断定义是否完整
     */
    DefineParser.prototype.$isDfnOk = function (str) {
        var a = ["\"", "'", "`"];
        var b = ["<", "(", "{", "["];
        var c = [">", ")", "}", "]"];
        var s0 = "";
        var reg0 = 0;
        var reg1 = 0;
        var reg2 = 0;
        var array = str.split("");
        for (var i = 0; i < array.length; i++) {
            var s1 = array[i];
            var s2 = i === 0 ? "" : array[i - 1];
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
        var ok = reg0 % 2 === 0 && reg1 === reg2;
        return ok;
    };
    /**
     * 读取变量信息
     */
    DefineParser.prototype.$readVariableInfomation = function (lines) {
        var info = {
            notes: [],
            lines: [],
            keywords: [],
            name: "",
            type: "",
            optional: false,
            value: ""
        };
        var line = lines.shift();
        var str = this.$readKeyworkds(line, info.keywords);
        do {
            var reg0 = str.indexOf(" = ");
            if (reg0 > -1) {
                var s0 = str.substr(reg0 + 3);
                var s1 = void 0;
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
                    var ok = false;
                    while (lines.length > 0) {
                        var s2 = lines.shift();
                        info.lines.push(s2);
                        if (s2 === s1) {
                            ok = true;
                            break;
                        }
                    }
                    if (ok === false) {
                        throw Error("\u5C5E\u6027\u89E3\u6790\u51FA\u9519 line:" + line);
                    }
                }
            }
            info.lines.unshift(line);
        } while (false);
        this.$parserVarInfo(str, info);
        return info;
    };
    /**
     * 解析变量信息
     */
    DefineParser.prototype.$parserVarInfo = function (str, out) {
        var line = out.lines[0];
        var reg0 = str.indexOf(": ");
        if (reg0 === -1) {
            throw Error("\u5FC5\u987B\u4E3A\u53D8\u91CF\u6307\u5B9A\u7C7B\u578B line:" + line);
        }
        // 获取变量名
        out.name = str.substr(0, reg0);
        var reg1 = out.name.lastIndexOf(" ");
        if (reg1 !== -1) {
            throw Error("\u53D8\u91CF\u89E3\u6790\u51FA\u9519 line:" + line);
        }
        var s0 = out.name.substr(out.name.length - 1);
        var reg2 = str.indexOf(" = ");
        var s1 = "";
        if (s0 === "?") {
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
            var reg3 = s1.length - 1;
            var s2 = s1.substr(reg3);
            if (s2 === ";") {
                out.value = s1.substr(0, reg3);
            }
            else {
                out.value = s1;
            }
        }
        var reg4 = reg0 + 2;
        if (reg2 === -1) {
            out.type = str.substr(reg4);
        }
        else {
            out.type = str.substring(reg4, reg2);
        }
    };
    DefineParser.prototype.$readKeyworkds = function (line, out) {
        var str = " " + line;
        var a = ["public", "protected", "private"];
        for (var _i = 0, a_1 = a; _i < a_1.length; _i++) {
            var s1 = a_1[_i];
            var s0 = " " + s1 + " ";
            var reg0 = str.indexOf(s0);
            if (reg0 === -1) {
                continue;
            }
            str = str.substr(0, reg0) + " " + str.substr(reg0 + s0.length);
            out.push(s1);
        }
        if (out.length === 0) {
            out.push("public");
        }
        var b = ["static", "readonly", "abstract", "get", "set"];
        for (var _a = 0, b_1 = b; _a < b_1.length; _a++) {
            var s3 = b_1[_a];
            var s2 = " " + s3 + " ";
            var reg1 = str.indexOf(s2);
            if (reg1 === -1) {
                continue;
            }
            str = str.substr(0, reg1) + " " + str.substr(reg1 + s2.length);
            out.push(s3);
        }
        return str.substr(1);
    };
    return DefineParser;
}());
exports.DefineParser = DefineParser;
//# sourceMappingURL=DefineParser.js.map