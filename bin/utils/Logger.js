"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Constants_1 = require("./Constants");
var Util_1 = require("./Util");
var fs_1 = __importDefault(require("fs"));
var Logger;
(function (Logger) {
    var data = {};
    function log(name, str) {
        var lines = data[name] || null;
        if (lines === null) {
            lines = data[name] = [];
        }
        var reg0 = lines.indexOf(str);
        if (reg0 > -1) {
            return;
        }
        lines.push(str);
    }
    Logger.log = log;
    function output(name) {
        var lines = data[name] || [];
        var str = lines.join(Constants_1.Constants.NEWLINE);
        var url = Util_1.Util.getAbsolutePath(Constants_1.Constants.DIR_ROOT, name + ".log");
        fs_1.default.writeFileSync(url, str);
    }
    Logger.output = output;
})(Logger = exports.Logger || (exports.Logger = {}));
//# sourceMappingURL=Logger.js.map