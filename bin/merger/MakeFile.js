"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = require("../utils/Util");
var Constants_1 = require("../utils/Constants");
var MergeTsFile_1 = require("./MergeTsFile");
var CreateDtsFile_1 = require("./CreateDtsFile");
var MakeTsFile_1 = require("./MakeTsFile");
var MakeFile = /** @class */ (function () {
    /**
     * @name: 项目名
     */
    function MakeFile(name) {
        var files = [];
        var s0 = Util_1.Util.getAbsolutePath(name, Constants_1.Constants.DIR_SRC);
        new MakeTsFile_1.MakeTsFile(s0, name, files);
        new MergeTsFile_1.MergeTsFile(name, files);
        new CreateDtsFile_1.CreateDtsFile(name, files);
    }
    return MakeFile;
}());
exports.MakeFile = MakeFile;
//# sourceMappingURL=MakeFile.js.map