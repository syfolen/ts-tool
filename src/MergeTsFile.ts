
import fs from "fs";

import { FileParser } from "./parser/FileParser";
import { Util } from "./Util";
import { Constants } from "./Constants";
import { InterfaceParser } from "./parser/InterfaceParser";
import { ClassParser } from "./parser/ClassParser";

export class MergeTsFile {

    str: string = "";

    private $lines: string[] = [];

    private $doneList: string[] = [];

    constructor(dir: string, name: string, files: FileParser[]) {
        this.$mergeNote(name, files);

        this.$lines.push(`module ${name} {`);

        this.$mergeEnums(files);
        this.$mergeInterfaces(files);
        this.$mergeClasses(files);
        this.$mergeNamepaces(files);

        this.$lines.push(`}`);

        this.str = this.$lines.join(Constants.NEWLINE);

        const url: string = Util.getAbsolutePath(dir, name + ".ts");

        fs.writeFileSync(url, this.str);
    }

    private $mergeNote(name: string, files: FileParser[]): void {
        for (const file of files) {
            if (file.notes.length > 0) {
                this.$exportNotes(0, file.notes);
                break;
            }
        }
    }

    private $mergeEnums(files: FileParser[]): void {

    }

    private $mergeInterfaces(files: FileParser[]): void {
        for (const file of files) {
            if (file.parser instanceof InterfaceParser) {
                const parser = file.parser;
                if (this.$notYet(parser.name) === true) {
                    continue;
                }
                this.$exportNotes(1, parser.notes);
            }
        }
    }

    private $notYet(name: string): boolean {
        return false;
    }

    private $mergeClasses(files: FileParser[]): void {
        for (const file of files) {
            if (file.parser instanceof ClassParser) {
                const parser = file.parser;
                this.$exportNotes(1, parser.notes);
            }
        }
    }

    private $mergeNamepaces(files: FileParser[]): void {

    }

    private $needExport(notes: string[]): boolean {
        if (notes.length === 0) {
            return false;
        }
        const str = notes.pop() as string;
        if (str === "export") {
            return true;
        }
        notes.push(str);
        return false;
    }

    private $exportNotes(numOfTab: number, notes: string[]): void {
        if (notes.length === 0) {
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
}