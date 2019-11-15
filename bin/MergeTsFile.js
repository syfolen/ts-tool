"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const Util_1 = require("./Util");
const Constants_1 = require("./Constants");
const InterfaceParser_1 = require("./parser/InterfaceParser");
const ClassParser_1 = require("./parser/ClassParser");
class MergeTsFile {
    constructor(dir, name, files) {
        this.str = "";
        this.$lines = [];
        this.$mergeNote(name, files);
        this.$lines.push(`module ${name} {`);
        this.$mergeEnums(files);
        this.$mergeInterfaces(files);
        this.$mergeClasses(files);
        this.$mergeNamepaces(files);
        this.$lines.push(`}`);
        this.str = this.$lines.join(Constants_1.Constants.NEWLINE);
        const url = Util_1.Util.getAbsolutePath(dir, name + ".ts");
        fs_1.default.writeFileSync(url, this.str);
    }
    $mergeNote(name, files) {
        for (const file of files) {
            if (file.notes.length > 0) {
                this.$exportNotes(0, file.notes);
                break;
            }
        }
    }
    $mergeEnums(files) {
    }
    $mergeInterfaces(files) {
        for (const file of files) {
            if (file.parser instanceof InterfaceParser_1.InterfaceParser) {
                const parser = file.parser;
                this.$exportNotes(1, parser.notes);
            }
        }
    }
    $mergeClasses(files) {
        for (const file of files) {
            if (file.parser instanceof ClassParser_1.ClassParser) {
                const parser = file.parser;
                this.$exportNotes(1, parser.notes);
                const s0 = parser.keywords.length === 0 ? "" : parser.keywords.join(" ");
            }
        }
    }
    $mergeNamepaces(files) {
    }
    $needExport(notes) {
        if (notes.length === 0) {
            return false;
        }
        const str = notes.pop();
        if (str === "export") {
            return true;
        }
        notes.push(str);
        return false;
    }
    $exportNotes(numOfTab, notes) {
        if (notes.length === 0) {
            return;
        }
        let tabs = "";
        while (numOfTab > 0) {
            numOfTab--;
            tabs += "\t";
        }
        // 无视 export 标记
        const str = notes.pop();
        if (str !== "export") {
            notes.push(str);
        }
        this.$lines.push(`${tabs}/**`);
        for (const note of notes) {
            this.$lines.push(`${tabs} * ${note}`);
        }
        this.$lines.push(`${tabs} */`);
        if (str === "export") {
            notes.push(str);
        }
    }
}
exports.MergeTsFile = MergeTsFile;
//# sourceMappingURL=MergeTsFile.js.map