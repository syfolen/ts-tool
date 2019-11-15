import { IArguInfo } from "./IArguInfo";

export interface IFunctionInfo {

    str: string;

    name: string;

    error: string;

    ret?: string;

    args: IArguInfo[];

    notes: string[];

    lines: string[];

    keyworkds: string[];
}