
/**
 * 定义的导出方式
 */
export enum ExportTypeEnum {
    /**
     * 默认（不导出）
     */
    DEFAULT = 0,

    /**
     * 导出
     */
    EXPORT,

    /**
     * 取决于上一个（若上一个定义导出，则导出，否则不导出）
     */
    DEPENDS
}