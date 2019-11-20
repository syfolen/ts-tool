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
var MergeTsFile = /** @class */ (function () {
    function MergeTsFile(dir, name, files) {
        this.str = "";
        this.$lines = [];
        this.$nameList = [];
        this.$doneList = [];
        this.$mergeNote(name, files);
        for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
            var file = files_1[_i];
            this.$nameList.push(file.parser.name);
        }
        this.$lines.push("module " + name + " {");
        var numOfDfn = 0;
        numOfDfn = this.$mergeEnums(numOfDfn, files);
        numOfDfn = this.$mergeInterfaces(numOfDfn, files);
        numOfDfn = this.$mergeClasses(numOfDfn, files);
        numOfDfn = this.$mergeNamepaces(numOfDfn, files);
        this.$lines.push("}");
        this.str = this.$lines.join(Constants_1.Constants.NEWLINE);
        var url = Util_1.Util.getAbsolutePath(dir, name + ".ts");
        fs_1.default.writeFileSync(url, this.str);
    }
    MergeTsFile.prototype.$mergeEnums = function (numOfDfn, files) {
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
                this.$lines.push("" + Constants_1.Constants.TAB + Constants_1.Constants.TAB + item.lines[0]);
            }
            this.$lines.push(Constants_1.Constants.TAB + "}");
        }
        return numOfDfn;
    };
    MergeTsFile.prototype.$mergeInterfaces = function (numOfDfn, files) {
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
    MergeTsFile.prototype.$mergeClasses = function (numOfDfn, files) {
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
                    for (var _a = 0, _b = item.lines; _a < _b.length; _a++) {
                        var line = _b[_a];
                        this.$lines.push("" + Constants_1.Constants.TAB + Constants_1.Constants.TAB + line);
                    }
                }
                while (funcs.length > 0) {
                    this.$checkEndLine();
                    var item = funcs.shift();
                    this.$exportNotes(2, item.notes);
                    this.$lines.push("" + Constants_1.Constants.TAB + Constants_1.Constants.TAB + item.line);
                    if (item.keywords.indexOf("abstract") === -1) {
                        for (var _c = 0, _d = item.lines; _c < _d.length; _c++) {
                            var line = _d[_c];
                            this.$lines.push("" + Constants_1.Constants.TAB + Constants_1.Constants.TAB + Constants_1.Constants.TAB + line);
                        }
                        this.$lines.push("" + Constants_1.Constants.TAB + Constants_1.Constants.TAB + "}");
                    }
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
    MergeTsFile.prototype.$mergeNamepaces = function (numOfDfn, files) {
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
                for (var _a = 0, _b = item.lines; _a < _b.length; _a++) {
                    var line = _b[_a];
                    this.$lines.push("" + Constants_1.Constants.TAB + line);
                }
            }
            while (funcs.length > 0) {
                this.$checkEndLine();
                var item = funcs.shift();
                this.$exportNotes(1, item.notes);
                this.$lines.push("" + Constants_1.Constants.TAB + item.line);
                for (var _c = 0, _d = item.lines; _c < _d.length; _c++) {
                    var line = _d[_c];
                    this.$lines.push("" + Constants_1.Constants.TAB + Constants_1.Constants.TAB + line);
                }
                this.$lines.push(Constants_1.Constants.TAB + "}");
            }
        }
        return numOfDfn;
    };
    MergeTsFile.prototype.$exportEnumName = function (parser) {
        var line = "export enum " + parser.name + " {";
        this.$lines.push("" + Constants_1.Constants.TAB + line);
    };
    MergeTsFile.prototype.$exportClassName = function (parser) {
        this.$lines.push("" + Constants_1.Constants.TAB + parser.line);
    };
    MergeTsFile.prototype.$exportInterfaceName = function (parser) {
        this.$lines.push("" + Constants_1.Constants.TAB + parser.line);
    };
    MergeTsFile.prototype.$notYet = function (parser) {
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
    MergeTsFile.prototype.$exportNotes = function (numOfTab, notes) {
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
    MergeTsFile.prototype.$checkEndLine = function () {
        if (this.$lines.length > 0) {
            var s0 = this.$lines[this.$lines.length - 1];
            if (s0 === "") {
                return;
            }
        }
        this.$lines.push("");
    };
    MergeTsFile.prototype.$mergeNote = function (name, files) {
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
    return MergeTsFile;
}());
exports.MergeTsFile = MergeTsFile;
//# sourceMappingURL=MergeTsFile.js.map