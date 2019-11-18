"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var Util_1 = require("./Util");
var Constants_1 = require("./Constants");
var InterfaceParser_1 = require("./parser/InterfaceParser");
var ClassParser_1 = require("./parser/ClassParser");
var EnumParser_1 = require("./parser/EnumParser");
var MergeTsFile = /** @class */ (function () {
    function MergeTsFile(dir, name, files) {
        this.str = "";
        this.$lines = [];
        this.$doneList = [];
        this.$mergeNote(name, files);
        this.$lines.push("module " + name + " {");
        this.$mergeEnums(files);
        this.$mergeInterfaces(files);
        this.$mergeClasses(files);
        this.$mergeNamepaces(files);
        this.$lines.push("}");
        this.str = this.$lines.join(Constants_1.Constants.NEWLINE);
        var url = Util_1.Util.getAbsolutePath(dir, name + ".ts");
        fs_1.default.writeFileSync(url, this.str);
    }
    MergeTsFile.prototype.$mergeNote = function (name, files) {
        for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
            var file = files_1[_i];
            if (file.notes.length > 0) {
                this.$exportNotes(0, file.notes);
                break;
            }
        }
    };
    MergeTsFile.prototype.$mergeEnums = function (files) {
        for (var _i = 0, files_2 = files; _i < files_2.length; _i++) {
            var file = files_2[_i];
            if (file.parser instanceof EnumParser_1.EnumParser) {
                var parser = file.parser;
            }
        }
    };
    MergeTsFile.prototype.$mergeInterfaces = function (files) {
        for (var _i = 0, files_3 = files; _i < files_3.length; _i++) {
            var file = files_3[_i];
            if (file.parser instanceof InterfaceParser_1.InterfaceParser) {
                var parser = file.parser;
                if (this.$notYet(parser.name) === true) {
                    continue;
                }
                this.$exportNotes(1, parser.notes);
            }
        }
    };
    MergeTsFile.prototype.$notYet = function (name) {
        return false;
    };
    MergeTsFile.prototype.$mergeClasses = function (files) {
        for (var _i = 0, files_4 = files; _i < files_4.length; _i++) {
            var file = files_4[_i];
            if (file.parser instanceof ClassParser_1.ClassParser) {
                var parser = file.parser;
                this.$exportNotes(1, parser.notes);
            }
        }
    };
    MergeTsFile.prototype.$mergeNamepaces = function (files) {
    };
    MergeTsFile.prototype.$needExport = function (notes) {
        if (notes.length === 0) {
            return false;
        }
        var str = notes.pop();
        if (str === "export") {
            return true;
        }
        notes.push(str);
        return false;
    };
    MergeTsFile.prototype.$exportNotes = function (numOfTab, notes) {
        if (notes.length === 0) {
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
    return MergeTsFile;
}());
exports.MergeTsFile = MergeTsFile;
//# sourceMappingURL=MergeTsFile.js.map