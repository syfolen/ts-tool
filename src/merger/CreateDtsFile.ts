
import fs from "fs";

import { FileParser } from "../parser/FileParser";
import { Util } from "../Util";
import { Constants } from "../Constants";
import { InterfaceParser } from "../parser/InterfaceParser";
import { ClassParser } from "../parser/ClassParser";
import { EnumParser } from "../parser/EnumParser";
import { DefineParser } from "../parser/DefineParser";
import { IVariableInfo } from "../interfaces/IVariableInfo";
import { IFunctionInfo } from "../interfaces/IFunctionInfo";
import { NamespaceParser } from "../parser/NamespaceParser";

export class CreateDtsFile {

    str: string = "";

    private $lines: string[] = [];

    private $nameList: string[] = [];

    private $doneList: string[] = [];

    constructor(dir: string, name: string, files: FileParser[]) {
        this.$mergeNote(name, files);

        for (const file of files) {
            this.$nameList.push(file.parser.name);
        }

        this.$lines.push(`declare module ${name} {`);

        let numOfDfn = 0;
        numOfDfn = this.$mergeEnums(numOfDfn, files);
        numOfDfn = this.$mergeInterfaces(numOfDfn, files);
        numOfDfn = this.$mergeClasses(numOfDfn, files);
        numOfDfn = this.$mergeNamepaces(numOfDfn, files);

        this.$lines.push(`}`);

        this.str = this.$lines.join(Constants.NEWLINE);

        // const url: string = Util.getAbsolutePath(dir, name + ".d.ts");

        // fs.writeFileSync(url, this.str);
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
                const item = vars.shift() as IFunctionInfo;
                this.$exportNotes(2, item.notes);
                this.$lines.push(`${Constants.TAB}${Constants.TAB}${item.line}`);
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
                    const item = vars.shift() as IFunctionInfo;
                    this.$exportNotes(2, item.notes);
                    this.$lines.push(`${Constants.TAB}${Constants.TAB}${item.line}`);
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

        for (let i = files.length - 1; i > -1; i--) {
            const file = files[i];
            const parser = file.parser;
            const functions = parser.functions;

            // 同时拥有get和set的方法应当视为属性
            const setters: IFunctionInfo[] = [];
            for (let i = functions.length - 1; i > -1; i--) {
                const func = functions[i];
                if (this.$isSetter(func) === true) {
                    setters.push(func);
                    functions.splice(i, 1);
                }
            }

            if (setters.length === 0) {
                continue;
            }

            while (setters.length > 0) {
                const func = setters.pop() as IFunctionInfo;
                const s0 = this.$getSetterName(func);

                for (let i = 0; i < functions.length; i++) {
                    const func = functions[i];
                    if (this.$isGetter(func) === false) {
                        continue;
                    }

                    const s1 = this.$getGetterName(func);
                    if (s0 !== s1) {
                        continue;
                    }
                    functions.splice(i, 1);

                    const s2 = func.line.replace("()", "");
                    const info: IVariableInfo = {
                        line: s2,
                        notes: func.notes
                    }
                    parser.variables.push(info);
                }

                debugger;
            }

            debugger;
        }

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
                    const item = vars.shift() as IFunctionInfo;
                    this.$exportNotes(2, item.notes);
                    this.$exportClassVariable(item.line);
                }
                while (funcs.length > 0) {
                    this.$checkEndLine();
                    const item = funcs.shift() as IFunctionInfo;
                    this.$exportNotes(2, item.notes);
                    this.$exportClassFunction(item.line);
                    // this.$lines.push(`${Constants.TAB}${Constants.TAB}${item.line}`);
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

    private $isSetter(func: IFunctionInfo): boolean {
        const s0 = " " + func.line;
        const reg0 = s0.indexOf(" set ");
        return reg0 > -1;
    }

    private $getSetterName(func: IFunctionInfo): string {
        const line = " " + func.line;

        const reg0 = line.indexOf(" set ");
        if (reg0 === -1) {
            throw Error(`函数命名格式有误 line:${line}`);
        }
        const reg1 = line.indexOf("(");
        if (reg1 === -1) {
            throw Error(`函数命名格式有误 line:${line}`);
        }

        const s0 = line.substring(reg0 + " set ".length, reg1);
        return s0;
    }

    private $isGetter(func: IFunctionInfo): boolean {
        const s0 = " " + func.line;
        const reg0 = s0.indexOf(" get ");
        return reg0 > -1;
    }

    private $getGetterName(func: IFunctionInfo): string {
        const line = " " + func.line;

        const reg0 = line.indexOf(" get ");
        if (reg0 === -1) {
            throw Error(`函数命名格式有误 line:${line}`);
        }
        const reg1 = line.indexOf("(");
        if (reg1 === -1) {
            throw Error(`函数命名格式有误 line:${line}`);
        }

        const s0 = line.substring(reg0 + " get ".length, reg1);
        return s0;
    }

    private $exportClassFunction(line: string): void {
        let str = line;

        do {
            const reg0 = str.indexOf(" = ");
            if (reg0 === -1) {
                break;
            }

            let reg1 = str.indexOf("(");
            if (reg1 === -1) {
                throw Error(`函数定义的格式有误 line:${line}`);
            }
            reg1 += 1;

            let s9 = str.substr(0, reg1);
            let reg9 = -1;

            let ok = false;
            while (ok === false) {
                let reg2 = str.indexOf(", ", reg1);
                if (reg2 === -1) {
                    reg2 = str.indexOf("): ");
                    if (reg2 === -1) {
                        reg2 = str.indexOf(") {");
                        if (reg2 === -1) {
                            throw Error(`函数定义的格式有误 line:${line}`);
                        }
                        else {
                            ok = true;
                            reg9 = reg2 + 3;
                        }
                    }
                    else {
                        ok = true;
                        reg9 = reg2 + 3;
                    }
                }
                else {
                    reg9 = reg2 + 2;
                }

                const s0 = str.substring(reg1, reg2);

                const reg3 = s0.indexOf(" = ");
                if (reg3 === -1) {
                    s9 += str.substring(reg1, reg9);
                    reg1 = reg9;
                    continue;
                }

                const s1 = s0.substr(0, reg3);
                const reg4 = s1.indexOf(": ");
                if (reg4 === -1) {
                    throw Error(`函数定义的格式有误 line:${line}`);
                }
                const name = s1.substr(0, reg4);

                const reg5 = reg4 + 2;
                const type = s1.substring(reg5, reg3);

                const s2 = str.substring(reg2, reg9);
                s9 += `${name}?: ${type}${s2}`;

                reg1 = reg9;
                if (ok === true) {
                    const s3 = str.substring(reg9);
                    s9 += s3;
                }
            }

            str = s9;
        } while (false);

        const s3 = str.substr(str.length - 1);
        if (s3 === "{") {
            str = str.substr(0, str.length - 2) + ";";
        }

        this.$lines.push(`${Constants.TAB}${Constants.TAB}${str}`);
    }

    private $exportClassVariable(line: string): void {
        const reg0 = line.indexOf(" = ");

        let s0: string;
        if (reg0 === -1) {
            s0 = line;
        }
        else {
            s0 = line.substr(0, reg0) + ";";
        }

        // this.$lines.push(`${Constants.TAB}${Constants.TAB}${s0}`);
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
                const item = vars.shift() as IFunctionInfo;
                this.$exportNotes(1, item.notes);
                this.$lines.push(`${Constants.TAB}${item.line}`);
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

        this.$lines.push(`${tabs}/**`);
        for (const note of notes) {
            this.$lines.push(`${tabs} * ${note}`);
        }
        this.$lines.push(`${tabs} */`);

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