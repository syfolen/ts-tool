"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("./Constants");
const MakeFile_1 = require("./MakeFile");
defineCompileRoot();
main();
/**
 * 入口函数
 */
function main() {
    new MakeFile_1.MakeFile("puremvc");
}
/**
 * 定义编译目录
 */
function defineCompileRoot() {
    const args = process.argv.slice(2);
    Constants_1.Constants.DIR_ROOT = args[0] || "E:\\work\\laya\\1.x";
}
//# sourceMappingURL=main.js.map