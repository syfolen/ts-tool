import { Constants } from "./Constants";

export abstract class Util {

    static getAbsolutePath(...args: string[]): string {
        const root = args[0];

        const index = root.indexOf(":");
        if (index < 0) {
            args.unshift(Constants.DIR_ROOT);
        }

        const path = args.join(Constants.SEPARATOR);
        return Util.checkSeperators(path);
    }

    static checkSeperators(path: string): string {
        const seperators = ["\\", "/"];

        // 确认分隔符
        if (seperators[1] === Constants.SEPARATOR) {
            seperators.push(seperators.shift() as string);
        }

        const a = seperators[0];
        const b = seperators[1];

        while (path.indexOf(b) > -1) {
            path = path.replace(b, a);
        }

        return path;
    }

    static trim(str: string): string {
        const array = str.split("");
        const letters = ["", " ", "\t", "\r", "\n"];

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
    }

    static sortLines(lines: string[]): void {
        if (lines.length === 0) {
            return;
        }

        const array: number[] = [];
        const letters: string[] = ["\t", "    "];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (Util.trim(line) === "") {
                array.push(i);
                continue;
            }
            for (const letter of letters) {
                if (line.indexOf(letter) === 0) {
                    lines[i] = line.substr(letter.length);
                    break;
                }
            }
        }

        for (let i = lines.length - 1; i > -1; i--) {
            if (array.indexOf(i) > -1) {
                lines.splice(i, 1);
            }
        }
    }

    static readNotes(lines: string[]): string[] {
        let a: boolean = false;
        let b: boolean = false;

        const notes: string[] = [];

        while (lines.length > 0) {
            const line = lines.shift() as string;

            let str = Util.trim(line);
            if (str === "") {
                continue;
            }

            if (str.indexOf("/**") === 0) {
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
    }
}