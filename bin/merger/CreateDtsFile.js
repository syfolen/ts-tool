"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = require("../Util");
var Constants_1 = require("../Constants");
var InterfaceParser_1 = require("../parser/InterfaceParser");
var ClassParser_1 = require("../parser/ClassParser");
var EnumParser_1 = require("../parser/EnumParser");
var NamespaceParser_1 = require("../parser/NamespaceParser");
var CreateDtsFile = /** @class */ (function () {
    function CreateDtsFile(dir, name, files) {
        this.str = "";
        this.$lines = [];
        this.$nameList = [];
        this.$doneList = [];
        this.$mergeNote(name, files);
        for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
            var file = files_1[_i];
            this.$nameList.push(file.parser.name);
        }
        this.$lines.push("declare module " + name + " {");
        var numOfDfn = 0;
        numOfDfn = this.$mergeEnums(numOfDfn, files);
        numOfDfn = this.$mergeInterfaces(numOfDfn, files);
        numOfDfn = this.$mergeClasses(numOfDfn, files);
        numOfDfn = this.$mergeNamepaces(numOfDfn, files);
        this.$lines.push("}");
        this.str = this.$lines.join(Constants_1.Constants.NEWLINE);
        // const url: string = Util.getAbsolutePath(dir, name + ".d.ts");
        // fs.writeFileSync(url, this.str);
    }
    CreateDtsFile.prototype.$mergeEnums = function (numOfDfn, files) {
        files = Util_1.Util.returnFilesOfParser(files.slice(0), EnumParser_1.EnumParser);
        for (var _i = 0, files_2 = files; _i < files_2.length; _i++) {
            var file = files_2[_i];
            var parser = file.parser;
            this.$doneList.push(parser.name);
            if (numOfDfn > 0) {
                this.$checkEndLine();
            }
            numOfDfn++;
            this.$exportNotes(1, parser.notes);
            this.$exportEnumName(parser);
            var vars = parser.variables.slice(0);
            var firstLine = true;
            while (vars.length > 0) {
                if (firstLine === true) {
                    firstLine = false;
                }
                else {
                    this.$checkEndLine();
                }
                var item = vars.shift();
                this.$exportNotes(2, item.notes);
                this.$lines.push("" + Constants_1.Constants.TAB + Constants_1.Constants.TAB + item.line);
            }
            this.$lines.push(Constants_1.Constants.TAB + "}");
        }
        return numOfDfn;
    };
    CreateDtsFile.prototype.$mergeInterfaces = function (numOfDfn, files) {
        files = Util_1.Util.returnFilesOfParser(files.slice(0), InterfaceParser_1.InterfaceParser);
        while (files.length > 0) {
            var array = [];
            for (var _i = 0, files_3 = files; _i < files_3.length; _i++) {
                var file = files_3[_i];
                var parser = file.parser;
                if (this.$notYet(parser) === true) {
                    continue;
                }
                array.push(file);
                this.$doneList.push(parser.name);
                if (numOfDfn > 0) {
                    this.$checkEndLine();
                }
                numOfDfn++;
                this.$exportNotes(1, parser.notes);
                this.$exportInterfaceName(parser);
                var vars = parser.variables.slice(0);
                var funcs = parser.functions.slice(0);
                var firstLine = true;
                while (vars.length > 0) {
                    if (firstLine === true) {
                        firstLine = false;
                    }
                    else {
                        this.$checkEndLine();
                    }
                    var item = vars.shift();
                    this.$exportNotes(2, item.notes);
                    this.$lines.push("" + Constants_1.Constants.TAB + Constants_1.Constants.TAB + item.line);
                }
                while (funcs.length > 0) {
                    this.$checkEndLine();
                    var item = funcs.shift();
                    this.$exportNotes(2, item.notes);
                    this.$lines.push("" + Constants_1.Constants.TAB + Constants_1.Constants.TAB + item.line);
                }
                this.$lines.push(Constants_1.Constants.TAB + "}");
            }
            while (array.length > 0) {
                var file = array.shift();
                var index = files.indexOf(file);
                if (index === -1) {
                    throw Error("未知错误");
                }
                files.splice(index, 1);
            }
        }
        return numOfDfn;
    };
    CreateDtsFile.prototype.$mergeClasses = function (numOfDfn, files) {
        files = Util_1.Util.returnFilesOfParser(files.slice(0), ClassParser_1.ClassParser);
        for (var i = files.length - 1; i > -1; i--) {
            var file = files[i];
            var parser = file.parser;
            var functions = parser.functions;
            // 同时拥有get和set的方法应当视为属性
            var setters = [];
            for (var i_1 = functions.length - 1; i_1 > -1; i_1--) {
                var func = functions[i_1];
                var line = " " + func.line;
                var reg0 = line.indexOf(" set ");
                if (reg0 === -1) {
                    continue;
                }
                setters.push(func);
                functions.splice(i_1, 1);
            }
            if (setters.length === 0) {
                continue;
            }
            while (setters.length > 0) {
                var func = setters.pop();
                var s0 = this.$getSetterName(func);
                for (var i_2 = 0; i_2 < functions.length; i_2++) {
                    var func_1 = functions[i_2];
                    var s1 = this.$getGetterName(func_1);
                    if (s0 !== s1) {
                        continue;
                    }
                    functions.splice(i_2, 1);
                }
                debugger;
            }
            debugger;
        }
        while (files.length > 0) {
            var array = [];
            for (var _i = 0, files_4 = files; _i < files_4.length; _i++) {
                var file = files_4[_i];
                var parser = file.parser;
                if (this.$notYet(parser) === true) {
                    continue;
                }
                array.push(file);
                this.$doneList.push(parser.name);
                if (numOfDfn > 0) {
                    this.$checkEndLine();
                }
                numOfDfn++;
                this.$exportNotes(1, parser.notes);
                this.$exportClassName(parser);
                var vars = parser.variables.slice(0);
                var funcs = parser.functions.slice(0);
                var firstLine = true;
                while (vars.length > 0) {
                    if (firstLine === true) {
                        firstLine = false;
                    }
                    else {
                        this.$checkEndLine();
                    }
                    var item = vars.shift();
                    this.$exportNotes(2, item.notes);
                    this.$exportClassVariable(item.line);
                }
                while (funcs.length > 0) {
                    this.$checkEndLine();
                    var item = funcs.shift();
                    this.$exportNotes(2, item.notes);
                    this.$exportClassFunction(item.line);
                    // this.$lines.push(`${Constants.TAB}${Constants.TAB}${item.line}`);
                }
                this.$lines.push(Constants_1.Constants.TAB + "}");
            }
            while (array.length > 0) {
                var file = array.shift();
                var index = files.indexOf(file);
                if (index === -1) {
                    throw Error("未知错误");
                }
                files.splice(index, 1);
            }
        }
        return numOfDfn;
    };
    CreateDtsFile.prototype.$getSetterName = function (func) {
        var line = " " + func.line;
        var reg0 = line.indexOf(" set ");
        if (reg0 === -1) {
            throw Error("\u51FD\u6570\u547D\u540D\u683C\u5F0F\u6709\u8BEF line:" + line);
        }
        var reg1 = line.indexOf("(");
        if (reg1 === -1) {
            throw Error("\u51FD\u6570\u547D\u540D\u683C\u5F0F\u6709\u8BEF line:" + line);
        }
        var s0 = line.substring(reg0 + " set ".length, reg1);
        return s0;
    };
    CreateDtsFile.prototype.$getGetterName = function (func) {
        var line = " " + func.line;
        var reg0 = line.indexOf(" get ");
        if (reg0 === -1) {
            throw Error("\u51FD\u6570\u547D\u540D\u683C\u5F0F\u6709\u8BEF line:" + line);
        }
        var reg1 = line.indexOf("(");
        if (reg1 === -1) {
            throw Error("\u51FD\u6570\u547D\u540D\u683C\u5F0F\u6709\u8BEF line:" + line);
        }
        var s0 = line.substring(reg0 + " get ".length, reg1);
        return s0;
    };
    CreateDtsFile.prototype.$exportClassFunction = function (line) {
        var str = line;
        do {
            var reg0 = str.indexOf(" = ");
            if (reg0 === -1) {
                break;
            }
            var reg1 = str.indexOf("(");
            if (reg1 === -1) {
                throw Error("\u51FD\u6570\u5B9A\u4E49\u7684\u683C\u5F0F\u6709\u8BEF line:" + line);
            }
            reg1 += 1;
            var s9 = str.substr(0, reg1);
            var reg9 = -1;
            var ok = false;
            while (ok === false) {
                var reg2 = str.indexOf(", ", reg1);
                if (reg2 === -1) {
                    reg2 = str.indexOf("): ");
                    if (reg2 === -1) {
                        reg2 = str.indexOf(") {");
                        if (reg2 === -1) {
                            throw Error("\u51FD\u6570\u5B9A\u4E49\u7684\u683C\u5F0F\u6709\u8BEF line:" + line);
                        }
                        else {
                            ok = true;
                            reg9 = reg2 + 3;
                        }
                    }
                    else {
                        ok = true;
                        reg9 = reg2 + 3;
                    }
                }
                else {
                    reg9 = reg2 + 2;
                }
                var s0 = str.substring(reg1, reg2);
                var reg3 = s0.indexOf(" = ");
                if (reg3 === -1) {
                    s9 += str.substring(reg1, reg9);
                    reg1 = reg9;
                    continue;
                }
                var s1 = s0.substr(0, reg3);
                var reg4 = s1.indexOf(": ");
                if (reg4 === -1) {
                    throw Error("\u51FD\u6570\u5B9A\u4E49\u7684\u683C\u5F0F\u6709\u8BEF line:" + line);
                }
                var name_1 = s1.substr(0, reg4);
                var reg5 = reg4 + 2;
                var type = s1.substring(reg5, reg3);
                var s2 = str.substring(reg2, reg9);
                s9 += name_1 + "?: " + type + s2;
                reg1 = reg9;
                if (ok === true) {
                    var s3_1 = str.substring(reg9);
                    s9 += s3_1;
                }
            }
            str = s9;
        } while (false);
        var s3 = str.substr(str.length - 1);
        if (s3 === "{") {
            str = str.substr(0, str.length - 2) + ";";
        }
        this.$lines.push("" + Constants_1.Constants.TAB + Constants_1.Constants.TAB + str);
    };
    CreateDtsFile.prototype.$exportClassVariable = function (line) {
        var reg0 = line.indexOf(" = ");
        var s0;
        if (reg0 === -1) {
            s0 = line;
        }
        else {
            s0 = line.substr(0, reg0) + ";";
        }
        // this.$lines.push(`${Constants.TAB}${Constants.TAB}${s0}`);
    };
    CreateDtsFile.prototype.$mergeNamepaces = function (numOfDfn, files) {
        files = Util_1.Util.returnFilesOfParser(files.slice(0), NamespaceParser_1.NamespaceParser);
        for (var _i = 0, files_5 = files; _i < files_5.length; _i++) {
            var file = files_5[_i];
            var parser = file.parser;
            this.$doneList.push(parser.name);
            if (numOfDfn > 0) {
                this.$checkEndLine();
            }
            numOfDfn++;
            var vars = parser.variables.slice(0);
            var funcs = parser.functions.slice(0);
            var firstLine = true;
            while (vars.length > 0) {
                if (firstLine === true) {
                    firstLine = false;
                }
                else {
                    this.$checkEndLine();
                }
                var item = vars.shift();
                this.$exportNotes(1, item.notes);
                this.$lines.push("" + Constants_1.Constants.TAB + item.line);
            }
            while (funcs.length > 0) {
                this.$checkEndLine();
                var item = funcs.shift();
                this.$exportNotes(1, item.notes);
                this.$lines.push("" + Constants_1.Constants.TAB + item.line);
                for (var _a = 0, _b = item.lines; _a < _b.length; _a++) {
                    var line = _b[_a];
                    this.$lines.push("" + Constants_1.Constants.TAB + Constants_1.Constants.TAB + line);
                }
                this.$lines.push(Constants_1.Constants.TAB + "}");
            }
        }
        return numOfDfn;
    };
    CreateDtsFile.prototype.$exportEnumName = function (parser) {
        var line = "export enum " + parser.name + " {";
        this.$lines.push("" + Constants_1.Constants.TAB + line);
    };
    CreateDtsFile.prototype.$exportClassName = function (parser) {
        this.$lines.push("" + Constants_1.Constants.TAB + parser.line);
    };
    CreateDtsFile.prototype.$exportInterfaceName = function (parser) {
        this.$lines.push("" + Constants_1.Constants.TAB + parser.line);
    };
    CreateDtsFile.prototype.$notYet = function (parser) {
        for (var _i = 0, _a = parser.parents; _i < _a.length; _i++) {
            var name_2 = _a[_i];
            if (this.$nameList.indexOf(name_2) === -1) {
                continue;
            }
            if (this.$doneList.indexOf(name_2) === -1) {
                return true;
            }
        }
        for (var _b = 0, _c = parser.interfaces; _b < _c.length; _b++) {
            var name_3 = _c[_b];
            if (this.$nameList.indexOf(name_3) === -1) {
                continue;
            }
            if (this.$doneList.indexOf(name_3) === -1) {
                return true;
            }
        }
        return false;
    };
    CreateDtsFile.prototype.$exportNotes = function (numOfTab, notes) {
        if (notes.length === 0) {
            this.$checkEndLine();
            return;
        }
        var tabs = "";
        while (numOfTab > 0) {
            numOfTab--;
            tabs += Constants_1.Constants.TAB;
        }
        // 无视 export 标记
        var str = notes.pop();
        if (str !== "export") {
            notes.push(str);
        }
        this.$lines.push(tabs + "/**");
        for (var _i = 0, notes_1 = notes; _i < notes_1.length; _i++) {
            var note = notes_1[_i];
            this.$lines.push(tabs + " * " + note);
        }
        this.$lines.push(tabs + " */");
        if (str === "export") {
            notes.push(str);
        }
    };
    CreateDtsFile.prototype.$checkEndLine = function () {
        if (this.$lines.length > 0) {
            var s0 = this.$lines[this.$lines.length - 1];
            if (s0 === "") {
                return;
            }
        }
        this.$lines.push("");
    };
    CreateDtsFile.prototype.$mergeNote = function (name, files) {
        for (var _i = 0, files_6 = files; _i < files_6.length; _i++) {
            var file = files_6[_i];
            if (file.notes.length > 0) {
                this.$exportNotes(0, file.notes);
                break;
            }
        }
        if (this.$lines.length === 0) {
            this.$lines.push("");
        }
    };
    return CreateDtsFile;
}());
exports.CreateDtsFile = CreateDtsFile;
//# sourceMappingURL=CreateDtsFile.js.map