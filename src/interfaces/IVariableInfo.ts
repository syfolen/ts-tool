import { IArgumentInfo } from "./IArumentInfo";
import { ExportTypeEnum } from "./ExportTypeEnum";

/**
 * 变量信息
 */
export interface IVariableInfo extends IArgumentInfo {
    /**
     * 注释
     */
    notes: string[];

    /**
     * 导出类型
     */
    exportType: ExportTypeEnum;

    /**
     * 变量定义行信息（包括定义行）
     */
    lines: string[];

    /**
     * 关键字
     */
    keywords: string[];
}