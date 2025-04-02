"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseUtilities = void 0;
class ResponseUtilities {
    /**
     * Return response in custom format
     * @param response
     */
    static sendResponsData(response) {
        let result = {
            statusCode: response.statusCode || response.code,
            message: response.message,
        };
        if (response.data) {
            result.data = response.data;
        }
        if (response.total) {
            result.total = response.total;
        }
        if (response.otp) {
            result.otp = response.otp;
        }
        if (response.pagination) {
            result.pagination = response.pagination;
        }
        return result;
    }
}
exports.ResponseUtilities = ResponseUtilities;
//# sourceMappingURL=response.util.js.map