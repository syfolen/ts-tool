"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Constants_1 = require("./Constants");
var MakeFile_1 = require("./merger/MakeFile");
defineCompileRoot();
main();
/**
 * 入口函数
 */
function main() {
    new MakeFile_1.MakeFile("test");
    // new MakeFile("puremvc");
    // new MakeFile("suncom");
    // new MakeFile("suncore");
    // new MakeFile("sunui");
    // new MakeFile("sunnet");
    // new MakeFile("world2d");
    // new MakeFile("quadtree");
}
/**
 * 定义编译目录
 */
function defineCompileRoot() {
    var args = process.argv.slice(2);
    Constants_1.Constants.DIR_ROOT = args[0] || "E:\\work\\laya\\1.x";
}
//# sourceMappingURL=main.js.map