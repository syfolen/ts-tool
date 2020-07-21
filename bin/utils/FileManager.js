"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Constants_1 = require("./Constants");
var Util_1 = require("./Util");
var fs_1 = __importDefault(require("fs"));
/**
 * 文件管理类
 * 提供文本写入的接口，用于最终生成各种文件
 */
var FileManager;
(function (FileManager) {
    /**
     * 文本集合
     */
    var files = [];
    /**
     * 封包关系集合
     */
    var packs = [];
    /**
     * @name: 文件名
     * @ext: 文件扩展名
     * @str: 文件内容
     */
    function put(name, ext, str) {
        var info = {
            name: name,
            ext: ext,
            str: str
        };
        files.push(info);
    }
    FileManager.put = put;
    /**
     * 封包接口
     * @name: 包名
     * @list: 需要封包的文件名列表
     */
    function pack(name, list) {
        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
            var s0 = list_1[_i];
            if (isInPack(s0) === false) {
                var info = {
                    name: s0,
                    pack: name
                };
                packs.push(info);
            }
            else {
                throw Error("\u7981\u6B62\u91CD\u590D\u5C01\u5305\uFF0C\u8BF7\u68C0\u67E5 name:" + name + ", list:[" + list.join(",") + "]");
            }
        }
    }
    FileManager.pack = pack;
    /**
     * 写入文件，并清空缓冲区的数据
     */
    function flush() {
        while (files.length > 0) {
            var s0 = "";
            var s1 = "";
            var lines = [];
            var array = [];
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                if (isInPack(file.name) === false) {
                    array.push(file);
                    output(file.name, file.ext, file.str);
                    continue;
                }
                var s2 = getPackName(file.name);
                if (s0 === "") {
                    s0 = s2;
                    s1 = file.ext;
                }
                else if (s2 !== s0 || file.ext !== s1) {
                    continue;
                }
                array.push(file);
                lines.push(file.str);
            }
            if (lines.length > 0) {
                var s2 = lines.join(Constants_1.Constants.NEWLINE + Constants_1.Constants.NEWLINE);
                output(s0, s1, s2);
            }
            while (array.length > 0) {
                var info = array.pop();
                var reg0 = files.indexOf(info);
                if (reg0 === -1) {
                    throw Error("\u975E\u6CD5\u4E0B\u6807 reg0:" + reg0);
                }
                files.splice(reg0, 1);
            }
        }
    }
    FileManager.flush = flush;
    /**
     * 判断是否己经对文件作了封包处理
     */
    function isInPack(name) {
        for (var _i = 0, packs_1 = packs; _i < packs_1.length; _i++) {
            var pack_1 = packs_1[_i];
            if (pack_1.name === name) {
                return pack_1.pack !== "";
            }
        }
        return false;
    }
    FileManager.isInPack = isInPack;
    /**
     * 返回封包名字
     */
    function getPackName(name) {
        for (var _i = 0, packs_2 = packs; _i < packs_2.length; _i++) {
            var pack_2 = packs_2[_i];
            if (pack_2.name === name) {
                return pack_2.pack;
            }
        }
        throw Error("\u4E0D\u5B58\u5728\u5BF9\u5E94\u7684\u5C01\u5305\u4FE1\u606F name:" + name);
    }
    /**
     * 输出文件内容
     * @name: 文件名
     * @ext: 文件扩展名
     * @str: 文件内容
     */
    function output(name, ext, str) {
        var s0;
        if (ext === "ts") {
            s0 = Util_1.Util.getAbsolutePath("my-laya", Constants_1.Constants.DIR_SRC, name + "." + ext);
        }
        else if (ext = "d.ts") {
            s0 = Util_1.Util.getAbsolutePath("my-laya", Constants_1.Constants.DIR_RELEASE, name + "." + ext);
        }
        else if (ext === "log") {
            s0 = Util_1.Util.getAbsolutePath(Constants_1.Constants.DIR_ROOT, name + "." + ext);
        }
        else {
            throw Error("\u672A\u77E5\u7684\u6587\u4EF6\u6269\u5C55\u540D ext:" + ext);
        }
        fs_1.default.writeFileSync(s0, str);
    }
    /**
     * 根据文件名获取文件信息
     */
    function getFileByName(name) {
        for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
            var file = files_1[_i];
            if (file.name === name) {
                return file;
            }
        }
        throw Error("\u4E0D\u5B58\u5728\u5BF9\u5E94\u7684\u6587\u4EF6\u4FE1\u606F name:" + name);
    }
    /**
     * 判断文件信息是否存在
     */
    function isFileExist(name) {
        for (var _i = 0, files_2 = files; _i < files_2.length; _i++) {
            var file = files_2[_i];
            if (file.name === name) {
                return true;
            }
        }
        return false;
    }
})(FileManager = exports.FileManager || (exports.FileManager = {}));
//# sourceMappingURL=FileManager.js.map