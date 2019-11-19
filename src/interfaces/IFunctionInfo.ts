import { IArgumentInfo } from "./IArumentInfo";

export interface IFunctionInfo {

    notes: string[];

    lines: string[];

    keywords: string[];

    line: string;

    name: string;

    args: IArgumentInfo[];

    ret: string;
}