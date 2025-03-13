import * as bcrypt from "bcrypt";

export class BcryptUtilities {
    /**
     * Generate encrypted password
     * @param {string} password
     */
    public static cryptPassword = async (password: string) => {
        return new Promise(function (resolve, reject) {
            return bcrypt.hash(
                password,
                10,
                (err: any, hash: any) => {
                    if (err) {
                        return reject(err);
                    } else {
                        return resolve(hash);
                    }
                }
            );
        });
    };

    /**
     * Verify password
     * @param {string} password
     */
    public static VerifyPassword = async (password: string, hash: string) => {
        return new Promise(function (resolve, reject) {
            return bcrypt.compare(password, hash, (error: any, result: any) => {
                if (error) {
                    return reject(error);
                } else {
                    return resolve(result);
                }
            });
        });
    };
}


