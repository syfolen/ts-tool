"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var Util_1 = require("../utils/Util");
var Constants_1 = require("../utils/Constants");
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
        var url = Util_1.Util.getAbsolutePath(dir, name + ".d.ts");
        fs_1.default.writeFileSync(url, this.str);
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
                var s0 = vars.length === 0 ? "" : ",";
                this.$lines.push("" + Constants_1.Constants.TAB + Constants_1.Constants.TAB + item.name + s0);
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
                    this.$lines.push("" + Constants_1.Constants.TAB + Constants_1.Constants.TAB + item.lines[0]);
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
                // 将寄存器方法转化为变量
                var a = [];
                for (var _a = 0, funcs_1 = funcs; _a < funcs_1.length; _a++) {
                    var func = funcs_1[_a];
                    if (func.keywords.indexOf("set") !== -1) {
                        a.push(func);
                    }
                }
                while (a.length > 0) {
                    var b = a.pop();
                    for (var i = funcs.length - 1; i > -1; i--) {
                        var func = funcs[i];
                        if (func === b) {
                            continue;
                        }
                        if (func.name !== b.name) {
                            continue;
                        }
                        funcs.splice(i, 1);
                        var info = {
                            notes: func.notes,
                            lines: func.lines,
                            keywords: func.keywords,
                            name: func.name,
                            type: func.ret,
                            optional: false,
                            value: ""
                        };
                        var reg0_1 = info.keywords.indexOf("get");
                        if (reg0_1 === -1) {
                            throw Error("\u8BD5\u56FE\u5C06\u5BC4\u5B58\u5668\u8F6C\u5316\u4E3A\u53D8\u91CF\uFF0C\u4F46\u5374\u6CA1\u6709\u627E\u5230get\u5173\u952E\u5B57");
                        }
                        info.keywords.splice(reg0_1, 1);
                        vars.push(info);
                    }
                    var reg0 = funcs.indexOf(b);
                    if (reg0 === -1) {
                        throw Error("\u610F\u5916\u7684\u7D22\u5F15 reg0:" + reg0);
                    }
                    funcs.splice(reg0, 1);
                }
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
                    var s0 = item.keywords.length === 0 ? "" : item.keywords.join(" ") + " ";
                    var s1 = "" + s0 + item.name + ": " + item.type + ";";
                    this.$lines.push("" + Constants_1.Constants.TAB + Constants_1.Constants.TAB + s1);
                }
                while (funcs.length > 0) {
                    this.$checkEndLine();
                    var item = funcs.shift();
                    this.$exportNotes(2, item.notes);
                    var args = [];
                    for (var _b = 0, _c = item.args; _b < _c.length; _b++) {
                        var arg = _c[_b];
                        var s0 = arg.optional === false ? "" : "?";
                        var s1 = "" + arg.name + s0 + ":" + arg.type;
                        args.push(s1);
                    }
                    var s2 = item.name === "constructor" ? "" : ": " + item.ret;
                    var reg0 = item.keywords.indexOf("get");
                    if (reg0 !== -1) {
                        item.keywords[reg0] = "readonly";
                    }
                    var s3 = item.keywords.length === 0 ? "" : item.keywords.join(" ") + " ";
                    var s4 = void 0;
                    if (reg0 !== -1) {
                        s4 = "" + s3 + item.name + s2 + ";";
                    }
                    else {
                        s4 = "" + s3 + item.name + "(" + args.join(", ") + ")" + s2 + ";";
                    }
                    this.$lines.push("" + Constants_1.Constants.TAB + Constants_1.Constants.TAB + s4);
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
                if (item.keywords.shift() !== "export") {
                    throw Error("\u5199\u5165.d.ts\u6587\u4EF6\u4E2D\u7684\u53D8\u91CF\u5FC5\u987B\u58F0\u660E\u4E3Aexport");
                }
                var s0 = item.keywords.join(" ") + " " + item.name + ": " + item.type + ";";
                this.$lines.push("" + Constants_1.Constants.TAB + s0);
            }
            while (funcs.length > 0) {
                this.$checkEndLine();
                var item = funcs.shift();
                this.$exportNotes(1, item.notes);
                if (item.keywords.shift() !== "export") {
                    throw Error("\u5199\u5165.d.ts\u6587\u4EF6\u4E2D\u7684\u51FD\u6570\u5FC5\u987B\u58F0\u660E\u4E3Aexport");
                }
                var args = [];
                for (var _a = 0, _b = item.args; _a < _b.length; _a++) {
                    var arg = _b[_a];
                    var s0 = arg.optional === false ? "" : "?";
                    var s1 = "" + arg.name + s0 + ":" + arg.type;
                    args.push(s1);
                }
                var s2 = item.keywords.join(" ") + " " + item.name + "(" + args.join(", ") + "): " + item.ret + ";";
                this.$lines.push("" + Constants_1.Constants.TAB + s2);
            }
        }
        return numOfDfn;
    };
    CreateDtsFile.prototype.$exportEnumName = function (parser) {
        var line = "enum " + parser.name + " {";
        this.$lines.push("" + Constants_1.Constants.TAB + line);
    };
    CreateDtsFile.prototype.$exportClassName = function (parser) {
        var s0 = parser.line;
        var reg0 = s0.indexOf("export ");
        if (reg0 === -1) {
            throw Error("\u5199\u5165.d.ts\u6587\u4EF6\u4E2D\u7684\u7C7B\u5FC5\u987B\u58F0\u660E\u4E3Aexport");
        }
        var s1 = s0.substr("export ".length);
        this.$lines.push("" + Constants_1.Constants.TAB + s1);
    };
    CreateDtsFile.prototype.$exportInterfaceName = function (parser) {
        var s0 = parser.line;
        var reg0 = s0.indexOf("export ");
        if (reg0 === -1) {
            throw Error("\u5199\u5165.d.ts\u6587\u4EF6\u4E2D\u7684\u63A5\u53E3\u5FC5\u987B\u58F0\u660E\u4E3Aexport");
        }
        var s1 = s0.substr("export ".length);
        this.$lines.push("" + Constants_1.Constants.TAB + s1);
    };
    CreateDtsFile.prototype.$notYet = function (parser) {
        for (var _i = 0, _a = parser.parents; _i < _a.length; _i++) {
            var name_1 = _a[_i];
            if (this.$nameList.indexOf(name_1) === -1) {
                continue;
            }
            if (this.$doneList.indexOf(name_1) === -1) {
                return true;
            }
        }
        for (var _b = 0, _c = parser.interfaces; _b < _c.length; _b++) {
            var name_2 = _c[_b];
            if (this.$nameList.indexOf(name_2) === -1) {
                continue;
            }
            if (this.$doneList.indexOf(name_2) === -1) {
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