"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = require("../Util");
var Constants_1 = require("../Constants");
var MergeTsFile_1 = require("./MergeTsFile");
var CreateDtsFile_1 = require("./CreateDtsFile");
var MakeTsFile_1 = require("./MakeTsFile");
var MakeFile = /** @class */ (function () {
    /**
     * @name: 项目名
     */
    function MakeFile(name) {
        this.$dirSrc = Util_1.Util.getAbsolutePath(name, Constants_1.Constants.DIR_SRC);
        this.$dirRelease = Util_1.Util.getAbsolutePath(name, Constants_1.Constants.DIR_RELEASE);
        var files = [];
        new MakeTsFile_1.MakeTsFile(this.$dirSrc, name, files);
        var s0 = Util_1.Util.getAbsolutePath("myLaya", Constants_1.Constants.DIR_SRC);
        new MergeTsFile_1.MergeTsFile(s0, name, files);
        var s1 = Util_1.Util.getAbsolutePath("myLaya", Constants_1.Constants.DIR_RELEASE);
        new CreateDtsFile_1.CreateDtsFile(s1, name, files);
        // new CopyJsLibFiles(this.$dirOutput, this.$dirRelease);
    }
    return MakeFile;
}());
exports.MakeFile = MakeFile;
//# sourceMappingURL=MakeFile.js.map