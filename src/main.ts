import { Constants } from "./utils/Constants";
import { MakeFile } from "./merger/MakeFile";
import { Logger } from "./utils/Logger";
import { FileManager } from "./utils/FileManager";

defineCompileRoot();

main();

/**
 * 入口函数
 */
function main() {
    FileManager.pack("sunlib", ["suncom", "suncore", "sunui", "sunnet", "world2d"]);

    // new MakeFile("test");
    new MakeFile("puremvc");
    new MakeFile("suncom");
    new MakeFile("suncore");
    new MakeFile("sunui");
    new MakeFile("sunnet");
    new MakeFile("world2d");
    // new MakeFile("quadtree");

    Logger.output("name");
    Logger.output("type");
    Logger.output("value");
    Logger.output("keywords");

    FileManager.flush();
}

/**
 * 定义编译目录
 */
function defineCompileRoot(): void {
    const args = process.argv.slice(2);
    // Constants.DIR_ROOT = args[0] || "E:\\work\\laya\\1.x";
    Constants.DIR_ROOT = args[0] || "D:\\Project\\laya\\1.x";
}