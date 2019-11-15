"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const FileParser_1 = require("./parser/FileParser");
const Util_1 = require("./Util");
class MakeTsFile {
    /**
     * @dir 项目目录
     * @name 项目名字
     * @out TS文件信息输出
     */
    constructor(dir, name, out) {
        this.$files = out;
        this.$makeDirs(dir, name);
    }
    /**
     * @dir 目录地址
     * @name 文件名
     */
    $makeDirs(dir, name) {
        const path = Util_1.Util.getAbsolutePath(dir, name);
        const dirs = fs_1.default.readdirSync(path);
        for (const dir of dirs) {
            const url = Util_1.Util.getAbsolutePath(path, dir);
            const stat = fs_1.default.lstatSync(url);
            if (stat.isDirectory() === true) {
                this.$makeDirs(path, dir);
            }
            else {
                this.$makeFile(url);
            }
        }
    }
    /**
     * @url 文件地址
     */
    $makeFile(url) {
        this.$files.push(new FileParser_1.FileParser(url));
    }
}
exports.MakeTsFile = MakeTsFile;
//# sourceMappingURL=MakeTsFile.js.map