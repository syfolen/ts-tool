"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * 定义的导出方式
 */
var ExportTypeEnum;
(function (ExportTypeEnum) {
    /**
     * 默认（不导出）
     */
    ExportTypeEnum[ExportTypeEnum["DEFAULT"] = 0] = "DEFAULT";
    /**
     * 导出
     */
    ExportTypeEnum[ExportTypeEnum["EXPORT"] = 1] = "EXPORT";
    /**
     * 取决于上一个（若上一个定义导出，则导出，否则不导出）
     */
    ExportTypeEnum[ExportTypeEnum["DEPENDS"] = 2] = "DEPENDS";
})(ExportTypeEnum = exports.ExportTypeEnum || (exports.ExportTypeEnum = {}));
//# sourceMappingURL=ExportTypeEnum.js.map