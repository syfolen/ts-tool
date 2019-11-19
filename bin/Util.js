"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Constants_1 = require("./Constants");
var Util = /** @class */ (function () {
    function Util() {
    }
    Util.getAbsolutePath = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var s0 = args[0];
        var reg0 = s0.indexOf(":\\");
        if (reg0 < 0) {
            args.unshift(Constants_1.Constants.DIR_ROOT);
        }
        var s1 = args.join(Constants_1.Constants.SEPARATOR);
        return Util.checkSeperators(s1);
    };
    Util.checkSeperators = function (path) {
        var seperators = ["\\", "/"];
        // 确认分隔符
        if (seperators[1] === Constants_1.Constants.SEPARATOR) {
            seperators.push(seperators.shift());
        }
        var s0 = seperators[0];
        var s1 = seperators[1];
        while (path.indexOf(s1) > -1) {
            path = path.replace(s1, s0);
        }
        return path;
    };
    Util.trim = function (str) {
        var array = str.split("");
        var letters = ["", " ", "\t", "\r", "\n"];
        while (true) {
            if (letters.indexOf(array[0]) > -1) {
                array.shift();
            }
            else if (letters.indexOf(array[array.length - 1]) > -1) {
                array.pop();
            }
            else {
                break;
            }
        }
        return array.join("");
    };
    Util.sortLines = function (lines) {
        if (lines.length === 0) {
            return;
        }
        var array = [];
        var letters = ["\t", "    "];
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            if (Util.trim(line) === "") {
                array.push(i);
                continue;
            }
            for (var _i = 0, letters_1 = letters; _i < letters_1.length; _i++) {
                var letter = letters_1[_i];
                if (line.indexOf(letter) === 0) {
                    lines[i] = line.substr(letter.length);
                    break;
                }
            }
        }
        for (var i = lines.length - 1; i > -1; i--) {
            if (array.indexOf(i) > -1) {
                lines.splice(i, 1);
            }
        }
    };
    Util.readNotes = function (lines) {
        var a = false;
        var b = false;
        var notes = [];
        while (lines.length > 0) {
            var line = lines.shift();
            var str = Util.trim(line);
            if (str === "") {
                continue;
            }
            if (str.indexOf("/*") === 0) {
                a = true;
                continue;
            }
            if (str.indexOf("*/") === 0) {
                b = true;
                break;
            }
            if (str.indexOf("*") === 0) {
                str = Util.trim(str.substr(1));
            }
            else if (str.indexOf(" *") === 0) {
                str = Util.trim(str.substr(2));
            }
            else if (str.indexOf("//") === 0) {
                str = Util.trim(str.substr(2));
            }
            else if (a === true) {
                str = Util.trim(str);
            }
            else {
                lines.unshift(line);
                break;
            }
            notes.push(str);
        }
        if (a !== b) {
            throw Error("读取注释有误");
        }
        if (notes.length === 0) {
            return notes;
        }
        return notes.concat(Util.readNotes(lines));
    };
    Util.returnFilesOfParser = function (files, parserClass) {
        for (var i = files.length - 1; i > -1; i--) {
            var file = files[i];
            if (file.parser instanceof parserClass === false) {
                files.splice(i, 1);
            }
        }
        var names = [];
        for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
            var file = files_1[_i];
            names.push(file.parser.name);
        }
        names.sort();
        var array = [];
        while (names.length > 0) {
            var name_1 = names.shift();
            for (var _a = 0, files_2 = files; _a < files_2.length; _a++) {
                var file = files_2[_a];
                if (file.parser.name === name_1) {
                    array.push(file);
                    break;
                }
            }
        }
        return array;
    };
    return Util;
}());
exports.Util = Util;
//# sourceMappingURL=Util.js.map