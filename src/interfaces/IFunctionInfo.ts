import { IArgumentInfo } from "./IArumentInfo";
import { ExportTypeEnum } from "./ExportTypeEnum";

/**
 * 函数信息
 */
export interface IFunctionInfo {
    /**
     * 注释
     */
    notes: string[];

    /**
     * 导出类型
     */
    exportType: ExportTypeEnum;

    /**
     * 函数定义行信息
     */
    line: string;

    /**
     * 函数体（不包括定义行）
     */
    lines: string[];

    /**
     * 关键字
     */
    keywords: string[];

    /**
     * 函数名
     */
    name: string;

    /**
     * 参数列表
     */
    args: IArgumentInfo[];

    /**
     * 返回值类型
     */
    retVal: string;
}