"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Constants_1 = require("./utils/Constants");
var MakeFile_1 = require("./merger/MakeFile");
var Logger_1 = require("./utils/Logger");
defineCompileRoot();
main();
/**
 * 入口函数
 */
function main() {
    // new MakeFile("test");
    // new MakeFile("puremvc");
    new MakeFile_1.MakeFile("suncom");
    new MakeFile_1.MakeFile("suncore");
    new MakeFile_1.MakeFile("sunui");
    // new MakeFile("sunnet");
    new MakeFile_1.MakeFile("world2d");
    // new MakeFile("quadtree");
    Logger_1.Logger.output("name");
    Logger_1.Logger.output("type");
    Logger_1.Logger.output("value");
    Logger_1.Logger.output("keywords");
}
/**
 * 定义编译目录
 */
function defineCompileRoot() {
    var args = process.argv.slice(2);
    // Constants.DIR_ROOT = args[0] || "E:\\work\\laya\\1.x";
    Constants_1.Constants.DIR_ROOT = args[0] || "D:\\Project\\laya\\1.x";
}
//# sourceMappingURL=main.js.map