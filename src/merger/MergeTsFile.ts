
import fs from "fs";

import { FileParser } from "../parser/FileParser";
import { Util } from "../utils/Util";
import { Constants } from "../utils/Constants";
import { InterfaceParser } from "../parser/InterfaceParser";
import { ClassParser } from "../parser/ClassParser";
import { EnumParser } from "../parser/EnumParser";
import { DefineParser } from "../parser/DefineParser";
import { IVariableInfo } from "../interfaces/IVariableInfo";
import { IFunctionInfo } from "../interfaces/IFunctionInfo";
import { NamespaceParser } from "../parser/NamespaceParser";
import { FileManager } from "../utils/FileManager";

export class MergeTsFile {

    str: string = "";

    private $lines: string[] = [];

    private $nameList: string[] = [];

    private $doneList: string[] = [];

    constructor(dir: string, name: string, files: FileParser[]) {
        this.$mergeNote(name, files);

        for (const file of files) {
            this.$nameList.push(file.parser.name);
        }

        if (FileManager.isInPack(name) === false) {
            this.$lines.push(`module ${name} {`);
        }
        else {
            this.$lines.push(`namespace ${name} {`);
        }

        let numOfDfn = 0;
        numOfDfn = this.$mergeEnums(numOfDfn, files);
        numOfDfn = this.$mergeInterfaces(numOfDfn, files);
        numOfDfn = this.$mergeClasses(numOfDfn, files);
        numOfDfn = this.$mergeNamepaces(numOfDfn, files);

        this.$lines.push(`}`);

        this.str = this.$lines.join(Constants.NEWLINE);
        FileManager.put(name, "ts", this.str);
    }

    private $mergeEnums(numOfDfn: number, files: FileParser[]): number {
        files = Util.returnFilesOfParser(files.slice(0), EnumParser);

        for (const file of files) {
            const parser = file.parser;
            this.$doneList.push(parser.name);

            if (numOfDfn > 0) {
                this.$checkEndLine();
            }
            numOfDfn++;

            this.$exportNotes(1, parser.notes);
            this.$exportEnumName(parser as EnumParser);

            const vars: IVariableInfo[] = parser.variables.slice(0);

            let firstLine = true;
            while (vars.length > 0) {
                if (firstLine === true) {
                    firstLine = false;
                }
                else {
                    this.$checkEndLine();
                }
                const item = vars.shift() as IVariableInfo;
                this.$exportNotes(2, item.notes);
                this.$lines.push(`${Constants.TAB}${Constants.TAB}${item.lines[0]}`);
            }

            this.$lines.push(`${Constants.TAB}}`);
        }

        return numOfDfn;
    }

    private $mergeInterfaces(numOfDfn: number, files: FileParser[]): number {
        files = Util.returnFilesOfParser(files.slice(0), InterfaceParser);

        while (files.length > 0) {
            const array: FileParser[] = [];
            for (const file of files) {
                const parser = file.parser;
                if (this.$notYet(parser) === true) {
                    continue;
                }

                array.push(file);
                this.$doneList.push(parser.name);

                if (numOfDfn > 0) {
                    this.$checkEndLine();
                }
                numOfDfn++;

                this.$exportNotes(1, parser.notes);
                this.$exportInterfaceName(parser as InterfaceParser);

                const vars: IVariableInfo[] = parser.variables.slice(0);
                const funcs: IFunctionInfo[] = parser.functions.slice(0);

                let firstLine = true;
                while (vars.length > 0) {
                    if (firstLine === true) {
                        firstLine = false;
                    }
                    else {
                        this.$checkEndLine();
                    }
                    const item = vars.shift() as IVariableInfo;
                    this.$exportNotes(2, item.notes);
                    this.$lines.push(`${Constants.TAB}${Constants.TAB}${item.lines[0]}`);
                }
                while (funcs.length > 0) {
                    this.$checkEndLine();
                    const item = funcs.shift() as IFunctionInfo;
                    this.$exportNotes(2, item.notes);
                    this.$lines.push(`${Constants.TAB}${Constants.TAB}${item.line}`);
                }

                this.$lines.push(`${Constants.TAB}}`);
            }
            while (array.length > 0) {
                const file = array.shift() as FileParser;
                const index = files.indexOf(file);
                if (index === -1) {
                    throw Error("未知错误");
                }
                files.splice(index, 1);
            }
        }

        return numOfDfn;
    }

    private $mergeClasses(numOfDfn: number, files: FileParser[]): number {
        files = Util.returnFilesOfParser(files.slice(0), ClassParser);

        while (files.length > 0) {
            const array: FileParser[] = [];
            for (const file of files) {
                const parser = file.parser;
                if (this.$notYet(parser) === true) {
                    continue;
                }

                array.push(file);
                this.$doneList.push(parser.name);

                if (numOfDfn > 0) {
                    this.$checkEndLine();
                }
                numOfDfn++;

                this.$exportNotes(1, parser.notes);
                this.$exportClassName(parser as ClassParser);

                const vars: IVariableInfo[] = parser.variables.slice(0);
                const funcs: IFunctionInfo[] = parser.functions.slice(0);

                let firstLine = true;
                while (vars.length > 0) {
                    if (firstLine === true) {
                        firstLine = false;
                    }
                    else {
                        this.$checkEndLine();
                    }
                    const item = vars.shift() as IVariableInfo;
                    this.$exportNotes(2, item.notes);
                    for (const line of item.lines) {
                        this.$lines.push(`${Constants.TAB}${Constants.TAB}${line}`);
                    }
                }
                while (funcs.length > 0) {
                    this.$checkEndLine();
                    const item = funcs.shift() as IFunctionInfo;
                    this.$exportNotes(2, item.notes);
                    this.$lines.push(`${Constants.TAB}${Constants.TAB}${item.line}`);
                    if (item.keywords.indexOf("abstract") === -1) {
                        for (const line of item.lines) {
                            this.$lines.push(`${Constants.TAB}${Constants.TAB}${Constants.TAB}${line}`);
                        }
                        this.$lines.push(`${Constants.TAB}${Constants.TAB}}`);
                    }
                }

                this.$lines.push(`${Constants.TAB}}`);
            }
            while (array.length > 0) {
                const file = array.shift() as FileParser;
                const index = files.indexOf(file);
                if (index === -1) {
                    throw Error("未知错误");
                }
                files.splice(index, 1);
            }
        }

        return numOfDfn;
    }

    private $mergeNamepaces(numOfDfn: number, files: FileParser[]): number {
        files = Util.returnFilesOfParser(files.slice(0), NamespaceParser);

        for (const file of files) {
            const parser = file.parser;
            this.$doneList.push(parser.name);

            if (numOfDfn > 0) {
                this.$checkEndLine();
            }
            numOfDfn++;

            const vars: IVariableInfo[] = parser.variables.slice(0);
            const funcs: IFunctionInfo[] = parser.functions.slice(0);

            let firstLine = true;
            while (vars.length > 0) {
                if (firstLine === true) {
                    firstLine = false;
                }
                else {
                    this.$checkEndLine();
                }
                const item = vars.shift() as IVariableInfo;
                this.$exportNotes(1, item.notes);
                for (const line of item.lines) {
                    this.$lines.push(`${Constants.TAB}${line}`);
                }
            }
            while (funcs.length > 0) {
                this.$checkEndLine();
                const item = funcs.shift() as IFunctionInfo;
                this.$exportNotes(1, item.notes);
                this.$lines.push(`${Constants.TAB}${item.line}`);
                for (const line of item.lines) {
                    this.$lines.push(`${Constants.TAB}${Constants.TAB}${line}`);
                }
                this.$lines.push(`${Constants.TAB}}`);
            }
        }

        return numOfDfn;
    }

    private $exportEnumName(parser: EnumParser): void {
        const line = `export enum ${parser.name} {`;
        this.$lines.push(`${Constants.TAB}${line}`);
    }

    private $exportClassName(parser: ClassParser): void {
        this.$lines.push(`${Constants.TAB}${parser.line}`);
    }

    private $exportInterfaceName(parser: InterfaceParser): void {
        this.$lines.push(`${Constants.TAB}${parser.line}`);
    }

    private $notYet(parser: DefineParser): boolean {
        for (const name of parser.parents) {
            if (this.$nameList.indexOf(name) === -1) {
                continue;
            }
            if (this.$doneList.indexOf(name) === -1) {
                return true;
            }
        }
        for (const name of parser.interfaces) {
            if (this.$nameList.indexOf(name) === -1) {
                continue;
            }
            if (this.$doneList.indexOf(name) === -1) {
                return true;
            }
        }
        return false;
    }

    private $exportNotes(numOfTab: number, notes: string[]): void {
        if (notes.length === 0) {
            this.$checkEndLine();
            return;
        }

        let tabs = "";
        while (numOfTab > 0) {
            numOfTab--;
            tabs += Constants.TAB;
        }

        // 无视 export 标记
        const str = notes.pop() as string;
        if (str !== "export") {
            notes.push(str);
        }

        if (notes.length > 0) {
            this.$lines.push(`${tabs}/**`);
            for (const note of notes) {
                this.$lines.push(`${tabs} * ${note}`);
            }
            this.$lines.push(`${tabs} */`);
        }
        else {
            this.$checkEndLine();
        }

        if (str === "export") {
            notes.push(str);
        }
    }

    private $checkEndLine(): void {
        if (this.$lines.length > 0) {
            const s0 = this.$lines[this.$lines.length - 1];
            if (s0 === "") {
                return;
            }
        }
        this.$lines.push("");
    }

    private $mergeNote(name: string, files: FileParser[]): void {
        for (const file of files) {
            if (file.notes.length > 0) {
                this.$exportNotes(0, file.notes);
                break;
            }
        }
        if (this.$lines.length === 0) {
            this.$lines.push("");
        }
    }
}