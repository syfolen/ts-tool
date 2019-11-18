
import fs from "fs";

import { FileParser } from "../parser/FileParser";
import { Util } from "../Util";

export class MakeTsFile {

    private $files: FileParser[];

    /**
     * @dir 项目目录
     * @name 项目名字
     * @out TS文件信息输出
     */
    constructor(dir: string, name: string, out: FileParser[]) {
        this.$files = out;
        this.$makeDirs(dir, name);
    }

    /**
     * @dir 目录地址
     * @name 文件名
     */
    private $makeDirs(dir: string, name: string): void {
        const path: string = Util.getAbsolutePath(dir, name);
        const dirs: string[] = fs.readdirSync(path);

        for (const dir of dirs) {
            const url = Util.getAbsolutePath(path, dir);
            const stat = fs.lstatSync(url);
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
    private $makeFile(url: string): void {
        this.$files.push(new FileParser(url));
    }
}