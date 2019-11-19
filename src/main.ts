import { Constants } from "./Constants";
import { MakeFile } from "./merger/MakeFile";

defineCompileRoot();

main();

/**
 * 入口函数
 */
function main() {
    new MakeFile("test");
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
function defineCompileRoot(): void {
    const args = process.argv.slice(2);
    Constants.DIR_ROOT = args[0] || "D:\\Project\\laya\\1.x";
}