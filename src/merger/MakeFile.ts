import { Util } from "../utils/Util";
import { Constants } from "../utils/Constants";
import { MergeTsFile } from "./MergeTsFile";
import { CreateDtsFile } from "./CreateDtsFile";
import { MakeTsFile } from "./MakeTsFile";
import { FileParser } from "../parser/FileParser";

export class MakeFile {

    /**
     * @name: 项目名
     */
    constructor(name: string) {
        const files: FileParser[] = [];

        const s0 = Util.getAbsolutePath(name, Constants.DIR_SRC);
        new MakeTsFile(s0, name, files);

        new MergeTsFile(name, files);

        new CreateDtsFile(name, files);
    }
}