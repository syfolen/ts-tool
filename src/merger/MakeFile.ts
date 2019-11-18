import { Util } from "../Util";
import { Constants } from "../Constants";
import { MergeTsFile } from "./MergeTsFile";
import { CreateDtsFile } from "./CreateDtsFile";
import { CopyJsLibFiles } from "./CopyJsLibFiles";
import { MakeTsFile } from "./MakeTsFile";
import { FileParser } from "../parser/FileParser";

export class MakeFile {
    /**
     * 源码目录
     */
    private $dirSrc: string;

    /**
     * JS文件输出目录
     */
    // private $dirOutput: string;

    /**
     * 发布目录
     */
    private $dirRelease: string;

    /**
     * @name: 项目名
     */
    constructor(name: string) {
        this.$dirSrc = Util.getAbsolutePath(name, Constants.DIR_SRC);
        this.$dirRelease = Util.getAbsolutePath(name, Constants.DIR_RELEASE);

        const files: FileParser[] = [];
        new MakeTsFile(this.$dirSrc, name, files);

        new MergeTsFile(this.$dirSrc, name, files);
        new CreateDtsFile(this.$dirRelease, name, files);
        // new CopyJsLibFiles(this.$dirOutput, this.$dirRelease);
    }
}