
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
import { ModuleParser } from "../parser/ModuleParser";
import { FileManager } from "../utils/FileManager";
import { ExportTypeEnum } from "../interfaces/ExportTypeEnum";
import { NamespaceParser } from "../parser/NamespaceParser";

export class CreateDtsFile {

    str: string;

    private $lines: string[] = [];

    private $nameList: string[] = [];

    private $doneList: string[] = [];

    constructor(name: string, files: FileParser[]) {
        this.$mergeNote(files);

        for (const file of files) {
            this.$nameList.push(file.parser.name);
        }

        this.$lines.push(`declare module ${name} {`);

        let numOfDfn = 0;
        numOfDfn = this.$mergeEnums(numOfDfn, files);
        numOfDfn = this.$mergeInterfaces(numOfDfn, files);
        numOfDfn = this.$mergeClasses(numOfDfn, files);
        numOfDfn = this.$mergeNamespace(numOfDfn, files);
        numOfDfn = this.$mergeModule(numOfDfn, files);

        this.$lines.push(`}`);

        this.str = this.$lines.join(Constants.NEWLINE);
        FileManager.put(name, "d.ts", this.str);
    }

    private $mergeEnums(numOfDfn: number, files: FileParser[]): number {
        files = Util.returnFilesOfParser(files.slice(0), EnumParser);

        for (const file of files) {
            const parser = file.parser;
            this.$doneList.push(parser.name);

            if (parser.exportType === ExportTypeEnum.DEFAULT) {
                continue;
            }
            if (numOfDfn > 0) {
                this.$checkEndLine();
            }
            numOfDfn++;

            this.$exportNotes(1, parser.notes);
            this.$exportEnumName(parser as EnumParser);

            const vars: IVariableInfo[] = parser.variables.slice(0);

            let firstLine = true;
            while (vars.length > 0) {
                const item = vars.shift() as IVariableInfo;
                if (item.exportType === ExportTypeEnum.DEFAULT) {
                    continue;
                }
                else if (item.exportType === ExportTypeEnum.DEPENDS) {
                    throw Error("enum中的属性不支持DEPENDS导出方式");
                }
                if (firstLine === true) {
                    firstLine = false;
                }
                else {
                    this.$checkEndLine();
                }
                this.$exportNotes(2, item.notes);
                const s0 = vars.length === 0 ? "" : ",";
                const s1 = item.value === "" ? "" : ` = ${item.value}`;
                this.$lines.push(`${Constants.TAB}${Constants.TAB}${item.name}${s1}${s0}`);
            }

            const reg0: number = this.$lines.length - 1;
            const s2: string = this.$lines[reg0];

            const reg1: number = s2.length - 1;
            const s3: string = s2.charAt(reg1);
            if (s3 === ",") {
                this.$lines[reg0] = s2.substr(0, reg1);
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

                if (parser.exportType === ExportTypeEnum.DEFAULT) {
                    continue;
                }
                if (numOfDfn > 0) {
                    this.$checkEndLine();
                }
                numOfDfn++;

                this.$exportNotes(1, parser.notes);
                this.$exportInterfaceName(parser as InterfaceParser);

                const vars: IVariableInfo[] = parser.variables.slice(0);
                const funcs: IFunctionInfo[] = parser.functions.slice(0);

                let exportType = ExportTypeEnum.DEFAULT;

                let firstLine = true;
                while (vars.length > 0) {
                    const item = vars.shift() as IVariableInfo;
                    // 导出类型为依赖的，取决于上一次导出模式
                    if (item.exportType === ExportTypeEnum.DEPENDS) {
                        if (exportType === ExportTypeEnum.DEFAULT) {
                            continue;
                        }
                    }
                    else {
                        exportType = item.exportType;
                    }
                    if (item.exportType === ExportTypeEnum.DEFAULT) {
                        continue;
                    }
                    if (firstLine === true) {
                        firstLine = false;
                    }
                    else {
                        this.$checkEndLine();
                    }
                    this.$exportNotes(2, item.notes);
                    this.$lines.push(`${Constants.TAB}${Constants.TAB}${item.lines[0]}`);
                }

                exportType = ExportTypeEnum.DEFAULT;

                while (funcs.length > 0) {
                    const item = funcs.shift() as IFunctionInfo;
                    // 导出类型为依赖的，取决于上一次导出模式
                    if (item.exportType === ExportTypeEnum.DEPENDS) {
                        if (exportType === ExportTypeEnum.DEFAULT) {
                            continue;
                        }
                    }
                    else {
                        exportType = item.exportType;
                    }
                    if (item.exportType === ExportTypeEnum.DEFAULT) {
                        continue;
                    }
                    this.$checkEndLine();
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

    private $mergeNamespace(numOfDfn: number, files: FileParser[]): number {
        files = Util.returnFilesOfParser(files.slice(0), NamespaceParser);

        for (const file of files) {
            const parser = file.parser;
            this.$doneList.push(parser.name);

            if (parser.exportType === ExportTypeEnum.DEFAULT) {
                continue;
            }
            if (numOfDfn > 0) {
                this.$checkEndLine();
            }
            numOfDfn++;

            this.$exportNotes(1, parser.notes);
            this.$exportNamespaceName(parser as NamespaceParser);

            const vars: IVariableInfo[] = parser.variables.slice(0);
            const funcs: IFunctionInfo[] = parser.functions.slice(0);

            let exportType = ExportTypeEnum.DEFAULT;

            let firstLine = true;
            while (vars.length > 0) {
                const item = vars.shift() as IVariableInfo;
                // 导出类型为依赖的，取决于上一次导出模式
                if (item.exportType === ExportTypeEnum.DEPENDS) {
                    if (exportType === ExportTypeEnum.DEFAULT) {
                        continue;
                    }
                }
                else {
                    exportType = item.exportType;
                }
                if (item.exportType === ExportTypeEnum.DEFAULT) {
                    continue;
                }
                if (firstLine === true) {
                    firstLine = false;
                }
                else {
                    this.$checkEndLine();
                }
                this.$exportNotes(2, item.notes);
                if (item.keywords.shift() !== "export") {
                    throw Error(`写入.d.ts文件中的变量必须声明为export`);
                }
                const s0 = `${item.keywords.join(" ")} ${item.name}: ${item.type};`;
                this.$lines.push(`${Constants.TAB}${Constants.TAB}${s0}`);
            }

            exportType = ExportTypeEnum.DEFAULT;

            while (funcs.length > 0) {
                const item = funcs.shift() as IFunctionInfo;
                // 导出类型为依赖的，取决于上一次导出模式
                if (item.exportType === ExportTypeEnum.DEPENDS) {
                    if (exportType === ExportTypeEnum.DEFAULT) {
                        continue;
                    }
                }
                else {
                    exportType = item.exportType;
                }
                if (item.exportType === ExportTypeEnum.DEFAULT) {
                    continue;
                }
                this.$checkEndLine();
                this.$exportNotes(2, item.notes);
                if (item.keywords.shift() !== "export") {
                    throw Error(`写入.d.ts文件中的函数必须声明为export`);
                }
                const args: string[] = [];
                for (const arg of item.args) {
                    const s0 = arg.optional === false ? "" : "?";
                    const s1 = `${arg.name}${s0}: ${arg.type}`;
                    args.push(s1);
                }
                const s2 = `${item.keywords.join(" ")} ${item.name}(${args.join(", ")}): ${item.retVal};`;
                this.$lines.push(`${Constants.TAB}${Constants.TAB}${s2}`);
            }
            this.$lines.push(`${Constants.TAB}}`);
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

                if (parser.exportType === ExportTypeEnum.DEFAULT) {
                    continue;
                }
                if (numOfDfn > 0) {
                    this.$checkEndLine();
                }
                numOfDfn++;

                this.$exportNotes(1, parser.notes);
                this.$exportClassName(parser as ClassParser);

                const vars: IVariableInfo[] = parser.variables.slice(0);
                const funcs: IFunctionInfo[] = parser.functions.slice(0);

                // 将寄存器方法转化为变量
                const a: IFunctionInfo[] = [];
                for (const func of funcs) {
                    if (func.keywords.indexOf("abstract") !== -1) {
                        continue;
                    }
                    if (func.keywords.indexOf("set") !== -1) {
                        a.push(func);
                    }
                }
                while (a.length > 0) {
                    const b = a.pop() as IFunctionInfo;
                    for (let i = funcs.length - 1; i > -1; i--) {
                        const func = funcs[i];
                        if (func === b) {
                            continue;
                        }
                        if (func.name !== b.name) {
                            continue;
                        }
                        funcs.splice(i, 1);
                        const info: IVariableInfo = {
                            notes: func.notes,
                            exportType: func.exportType,
                            lines: func.lines,
                            keywords: func.keywords,
                            name: func.name,
                            type: func.retVal,
                            optional: false,
                            value: ""
                        };
                        const reg0 = info.keywords.indexOf("get");
                        if (reg0 === -1) {
                            throw Error(`试图将寄存器转化为变量，但却没有找到get关键字`);
                        }
                        info.keywords.splice(reg0, 1);
                        vars.push(info);
                    }
                    const reg0 = funcs.indexOf(b);
                    if (reg0 === -1) {
                        throw Error(`意外的索引 reg0:${reg0}`);
                    }
                    funcs.splice(reg0, 1);
                }

                let exportType = ExportTypeEnum.DEFAULT;

                let firstLine = true;
                while (vars.length > 0) {
                    const item = vars.shift() as IVariableInfo;
                    // 导出类型为依赖的，取决于上一次导出模式
                    if (item.exportType === ExportTypeEnum.DEPENDS) {
                        if (exportType === ExportTypeEnum.DEFAULT) {
                            continue;
                        }
                    }
                    else {
                        exportType = item.exportType;
                    }
                    if (item.exportType === ExportTypeEnum.DEFAULT) {
                        continue;
                    }
                    if (firstLine === true) {
                        firstLine = false;
                    }
                    else {
                        this.$checkEndLine();
                    }
                    this.$exportNotes(2, item.notes);
                    const s0 = item.keywords.length === 0 ? "" : `${item.keywords.join(" ")} `;
                    const s1 = `${s0}${item.name}: ${item.type};`;
                    this.$lines.push(`${Constants.TAB}${Constants.TAB}${s1}`);
                }
                while (funcs.length > 0) {
                    const item = funcs.shift() as IFunctionInfo;
                    // 导出类型为依赖的，取决于上一次导出模式
                    if (item.exportType === ExportTypeEnum.DEPENDS) {
                        if (exportType === ExportTypeEnum.DEFAULT) {
                            continue;
                        }
                    }
                    else {
                        exportType = item.exportType;
                    }
                    if (item.exportType === ExportTypeEnum.DEFAULT) {
                        continue;
                    }
                    this.$checkEndLine();
                    this.$exportNotes(2, item.notes);
                    const args: string[] = [];
                    for (const arg of item.args) {
                        const s0 = arg.optional === false ? "" : "?";
                        const s1 = `${arg.name}${s0}: ${arg.type}`;
                        args.push(s1);
                    }

                    const s2 = item.name === "constructor" ? "" : `: ${item.retVal}`;

                    const reg0 = item.keywords.indexOf("get");
                    const reg1 = item.keywords.indexOf("set");
                    const reg2 = item.keywords.indexOf("abstract");
                    if (reg0 !== -1 && reg2 === -1) {
                        item.keywords[reg0] = "readonly";
                    }
                    const s3 = item.keywords.length === 0 ? "" : `${item.keywords.join(" ")} `;

                    let s4;
                    if (reg0 !== -1 && reg2 === -1) {
                        s4 = `${s3}${item.name}${s2};`;
                    }
                    else if (reg1 !== -1) {
                        s4 = `${s3}${item.name}(${args.join(", ")});`;
                    }
                    else {
                        s4 = `${s3}${item.name}(${args.join(", ")})${s2};`;
                    }
                    this.$lines.push(`${Constants.TAB}${Constants.TAB}${s4}`);
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

    private $mergeModule(numOfDfn: number, files: FileParser[]): number {
        files = Util.returnFilesOfParser(files.slice(0), ModuleParser);

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
                const item = vars.shift() as IVariableInfo;
                if (item.exportType === ExportTypeEnum.DEFAULT) {
                    continue;
                }
                else if (item.exportType === ExportTypeEnum.DEPENDS) {
                    throw Error("module中的属性不支持DEPENDS导出方式");
                }
                if (firstLine === true) {
                    firstLine = false;
                }
                else {
                    this.$checkEndLine();
                }
                this.$exportNotes(1, item.notes);
                if (item.keywords.shift() !== "export") {
                    throw Error(`写入.d.ts文件中的变量必须声明为export`);
                }
                const s0 = `${item.keywords.join(" ")} ${item.name}: ${item.type};`;
                this.$lines.push(`${Constants.TAB}${s0}`);
            }
            while (funcs.length > 0) {
                const item = funcs.shift() as IFunctionInfo;
                if (item.exportType === ExportTypeEnum.DEFAULT) {
                    continue;
                }
                else if (item.exportType === ExportTypeEnum.DEPENDS) {
                    throw Error("module中的方法不支持DEPENDS导出方式");
                }
                this.$checkEndLine();
                this.$exportNotes(1, item.notes);
                if (item.keywords.shift() !== "export") {
                    throw Error(`写入.d.ts文件中的函数必须声明为export`);
                }
                const args: string[] = [];
                for (const arg of item.args) {
                    const s0 = arg.optional === false ? "" : "?";
                    const s1 = `${arg.name}${s0}:${arg.type}`;
                    args.push(s1);
                }
                const s2 = `${item.keywords.join(" ")} ${item.name}(${args.join(", ")}): ${item.retVal};`;
                this.$lines.push(`${Constants.TAB}${s2}`);
            }
        }

        return numOfDfn;
    }

    private $exportEnumName(parser: EnumParser): void {
        const line = `enum ${parser.name} {`;
        this.$lines.push(`${Constants.TAB}${line}`);
    }

    private $exportClassName(parser: ClassParser): void {
        const s0 = parser.line;
        const reg0 = s0.indexOf("export ");
        if (reg0 === -1) {
            throw Error(`写入.d.ts文件中的类必须声明为export`);
        }
        const s1 = s0.substr("export ".length);
        this.$lines.push(`${Constants.TAB}${s1}`);
    }

    private $exportNamespaceName(parser: NamespaceParser): void {
        const line = `namespace ${parser.name} {`;
        this.$lines.push(`${Constants.TAB}${line}`);
    }

    private $exportInterfaceName(parser: InterfaceParser): void {
        const s0 = parser.line;
        const reg0 = s0.indexOf("export ");
        if (reg0 === -1) {
            throw Error(`写入.d.ts文件中的接口必须声明为export`);
        }
        const s1 = s0.substr("export ".length);
        this.$lines.push(`${Constants.TAB}${s1}`);
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

    private $mergeNote(files: FileParser[]): void {
        for (const file of files) {
            if (file.exportType === ExportTypeEnum.DEFAULT) {
                continue;
            }
            this.$exportNotes(0, file.notes);
            break;
        }
        if (this.$lines.length === 0) {
            this.$lines.push("");
        }
    }
}