import { Constants } from "./Constants";
import { Util } from "./Util";

import fs from "fs";

/**
 * 文件管理类
 * 提供文本写入的接口，用于最终生成各种文件
 */
export namespace FileManager {
    /**
     * 文件内容
     */
    interface IFileInfo {
        /**
         * 文件名
         */
        name: string;

        /**
         * 文件扩展名
         */
        ext: string;

        /**
         * 文件内容
         */
        str: string;
    }

    /**
     * 封包信息
     */
    interface IPackInfo {
        /**
         * 文件名
         */
        name: string;

        /**
         * 包名
         */
        pack: string;
    }

    /**
     * 文本集合
     */
    const files: Array<IFileInfo> = [];

    /**
     * 封包关系集合
     */
    const packs: Array<IPackInfo> = [];

    /**
     * @name: 文件名
     * @ext: 文件扩展名
     * @str: 文件内容
     */
    export function put(name: string, ext: string, str: string): void {
        const info: IFileInfo = {
            name: name,
            ext: ext,
            str: str
        };
        files.push(info);
    }

    /**
     * 封包接口
     * @name: 包名
     * @list: 需要封包的文件名列表
     */
    export function pack(name: string, list: string[]): void {
        for (const s0 of list) {
            if (isInPack(s0) === false) {
                const info: IPackInfo = {
                    name: s0,
                    pack: name
                };
                packs.push(info);
            }
            else {
                throw Error(`禁止重复封包，请检查 name:${name}, list:[${list.join(",")}]`);
            }
        }
    }

    /**
     * 写入文件，并清空缓冲区的数据
     */
    export function flush(): void {
        while (files.length > 0) {
            let s0 = "";
            let s1 = "";
            const lines: string[] = [];
            const array: IFileInfo[] = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (isInPack(file.name) === false) {
                    array.push(file);
                    output(file.name, file.ext, file.str);
                    continue;
                }
                const s2 = getPackName(file.name);
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
                const s2 = lines.join(Constants.NEWLINE + Constants.NEWLINE);
                output(s0, s1, s2);
            }
            while (array.length > 0) {
                const info = array.pop() as IFileInfo;
                const reg0 = files.indexOf(info);
                if (reg0 === -1) {
                    throw Error(`非法下标 reg0:${reg0}`);
                }
                files.splice(reg0, 1);
            }
        }
    }

    /**
     * 判断是否己经对文件作了封包处理
     */
    export function isInPack(name: string): boolean {
        for (const pack of packs) {
            if (pack.name === name) {
                return pack.pack !== "";
            }
        }
        return false;
    }

    /**
     * 返回封包名字
     */
    function getPackName(name: string): string {
        for (const pack of packs) {
            if (pack.name === name) {
                return pack.pack;
            }
        }
        throw Error(`不存在对应的封包信息 name:${name}`);
    }

    /**
     * 输出文件内容
     * @name: 文件名
     * @ext: 文件扩展名
     * @str: 文件内容
     */
    function output(name: string, ext: string, str: string): void {
        let s0: string;
        if (ext === "ts") {
            s0 = Util.getAbsolutePath("myLaya", Constants.DIR_SRC, `${name}.${ext}`);
        }
        else if (ext = "d.ts") {
            s0 = Util.getAbsolutePath("myLaya", Constants.DIR_RELEASE, `${name}.${ext}`);
        }
        else if (ext === "log") {
            s0 = Util.getAbsolutePath(Constants.DIR_ROOT, `${name}.${ext}`);
        }
        else {
            throw Error(`未知的文件扩展名 ext:${ext}`);
        }
        fs.writeFileSync(s0, str);
    }

    /**
     * 根据文件名获取文件信息
     */
    function getFileByName(name: string): IFileInfo {
        for (const file of files) {
            if (file.name === name) {
                return file;
            }
        }
        throw Error(`不存在对应的文件信息 name:${name}`);
    }

    /**
     * 判断文件信息是否存在
     */
    function isFileExist(name: string): boolean {
        for (const file of files) {
            if (file.name === name) {
                return true;
            }
        }
        return false;
    }
}