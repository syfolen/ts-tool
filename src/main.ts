import { Constants } from "./Constants";
import { MakeFile } from "./MakeFile";

defineCompileRoot();

main();

/**
 * 入口函数
 */
function main() {
    new MakeFile("sunui");
}

/**
 * 定义编译目录
 */
function defineCompileRoot(): void {
    const args = process.argv.slice(2);
    Constants.DIR_ROOT = args[0] || "D:\\Project\\laya\\1.x";
}