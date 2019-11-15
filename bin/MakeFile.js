"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Util_1 = require("./Util");
const Constants_1 = require("./Constants");
const MergeTsFile_1 = require("./MergeTsFile");
const MakeTsFile_1 = require("./MakeTsFile");
class MakeFile {
    /**
     * @name: 项目名
     */
    constructor(name) {
        this.$dirSrc = Util_1.Util.getAbsolutePath(name, Constants_1.Constants.DIR_SRC);
        this.$dirOutput = Util_1.Util.getAbsolutePath(name, Constants_1.Constants.DIR_OUTPUT, name);
        this.$dirRelease = Util_1.Util.getAbsolutePath(name, Constants_1.Constants.DIR_RELEASE);
        const files = [];
        new MakeTsFile_1.MakeTsFile(this.$dirSrc, name, files);
        new MergeTsFile_1.MergeTsFile(this.$dirSrc, name, files);
        // new CreateDtsFile(this.$dirRelease);
        // new CopyJsLibFiles(this.$dirOutput, this.$dirRelease);
    }
}
exports.MakeFile = MakeFile;
//# sourceMappingURL=MakeFile.js.map