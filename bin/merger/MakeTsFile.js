"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var FileParser_1 = require("../parser/FileParser");
var Util_1 = require("../Util");
var MakeTsFile = /** @class */ (function () {
    /**
     * @dir 项目目录
     * @name 项目名字
     * @out TS文件信息输出
     */
    function MakeTsFile(dir, name, out) {
        this.$files = out;
        this.$makeDirs(dir, name);
    }
    /**
     * @dir 目录地址
     * @name 文件名
     */
    MakeTsFile.prototype.$makeDirs = function (dir, name) {
        var path = Util_1.Util.getAbsolutePath(dir, name);
        var dirs = fs_1.default.readdirSync(path);
        for (var _i = 0, dirs_1 = dirs; _i < dirs_1.length; _i++) {
            var dir_1 = dirs_1[_i];
            var url = Util_1.Util.getAbsolutePath(path, dir_1);
            var stat = fs_1.default.lstatSync(url);
            if (stat.isDirectory() === true) {
                this.$makeDirs(path, dir_1);
            }
            else {
                this.$makeFile(url);
            }
        }
    };
    /**
     * @url 文件地址
     */
    MakeTsFile.prototype.$makeFile = function (url) {
        this.$files.push(new FileParser_1.FileParser(url));
    };
    return MakeTsFile;
}());
exports.MakeTsFile = MakeTsFile;
//# sourceMappingURL=MakeTsFile.js.map