"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommonUtilities = void 0;
class CommonUtilities {
    /**
     * Generate alphanumer random string of given length
     * @param length
     */
    static genAlphaNumericCode(length) {
        var result = "";
        var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    /**
     *
     * @param length of otp we want to generate
     * @returns numeric code for specified length
     */
    static genNumericCode(length) {
        let min = Math.pow(10, length - 1);
        let max = (Math.pow(10, length) - Math.pow(10, length - 1) - 1);
        return Math.floor(min + Math.random() * max);
    }
}
exports.CommonUtilities = CommonUtilities;
//# sourceMappingURL=common.util.js.map