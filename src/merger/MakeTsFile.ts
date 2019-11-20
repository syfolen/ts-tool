
import fs from "fs";

import { FileParser } from "../parser/FileParser";
import { Util } from "../utils/Util";

export class MakeTsFile {

    /**
     * @dir 项目目录
     * @name 项目名字
     * @out TS文件信息输出
     */
    constructor(dir: string, name: string, out: FileParser[]) {
        this.$makeDirs(dir, name, out);
    }

    /**
     * @dir 目录地址
     * @name 文件名
     */
    private $makeDirs(dir: string, name: string, out: FileParser[]): void {
        const path: string = Util.getAbsolutePath(dir, name);
        const dirs: string[] = fs.readdirSync(path);

        for (const dir of dirs) {
            const url = Util.getAbsolutePath(path, dir);
            const stat = fs.lstatSync(url);
            if (stat.isDirectory() === true) {
                this.$makeDirs(path, dir, out);
            }
            else {
                this.$makeFile(url, out);
            }
        }
    }

    /**
     * @url 文件地址
     */
    private $makeFile(url: string, out: FileParser[]): void {
        out.push(new FileParser(url));
    }
}