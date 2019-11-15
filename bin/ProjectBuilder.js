"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Util_1 = require("./Util");
const Constants_1 = require("./Constants");
const MergeTsFile_1 = require("./MergeTsFile");
const CreateDtsFile_1 = require("./CreateDtsFile");
const CopyJsLibFiles_1 = require("./CopyJsLibFiles");
class ProjectBuilder {
    constructor(name) {
        // this.$root = Util.getAbsolutePath(name);
        this.$rootSrc = Util_1.Util.getAbsolutePath(name, Constants_1.Constants.ROOT_SRC);
        this.$rootOutput = Util_1.Util.getAbsolutePath(name, Constants_1.Constants.ROOT_OUTPUT, name);
        this.$rootRelease = Util_1.Util.getAbsolutePath(name, Constants_1.Constants.ROOT_RELEASE);
        new MergeTsFile_1.MergeTsFile(this.$rootSrc, name);
        new CreateDtsFile_1.CreateDtsFile(this.$rootRelease);
        new CopyJsLibFiles_1.CopyJsLibFiles(this.$rootOutput, this.$rootRelease);
    }
}
exports.ProjectBuilder = ProjectBuilder;
//# sourceMappingURL=ProjectBuilder.js.map