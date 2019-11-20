import { Constants } from "./Constants";
import { Util } from "./Util";

import fs from "fs";

export namespace Logger {

    const data: { [name: string]: Array<string> } = {};

    export function log(name: string, str: string): void {
        let lines = data[name] || null;

        if (lines === null) {
            lines = data[name] = [];
        }

        const reg0 = lines.indexOf(str);
        if (reg0 > -1) {
            return;
        }

        lines.push(str);
    }

    export function output(name: string): void {
        const lines = data[name] || [];
        const str: string = lines.join(Constants.NEWLINE);
        const url: string = Util.getAbsolutePath(Constants.DIR_ROOT, name + ".log");
        fs.writeFileSync(url, str);
    }
}