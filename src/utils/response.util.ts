export class ResponseUtilities {
    /**
     * Return response in custom format
     * @param response
     */
    public static sendResponsData(response: any) {
        let result: any = {
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
            result.otp = response.otp
        }
        if (response.pagination) {
            result.pagination = response.pagination
        }
        return result;
    }
}


