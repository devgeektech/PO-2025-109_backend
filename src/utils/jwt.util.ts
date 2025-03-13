import jwt from "jsonwebtoken";
import config from "../../config/default.json";
import Users from "../models/Users";
import { MESSAGES } from "../constants/messages";

interface JwtPayload {
    _id: string;
    authProvider: any;
    email?: string,
    issuedAt?: number;
  }

export class JWTUtilities {
    /**
     * Create jwt token
     * @param {object} payload
     * @param {string} token - return token
     */
    public static createJWTToken = async (payload: any) => {
        const secretKey = config.JWT_SECRET_KEY;
        if (typeof secretKey !== 'string') {
            throw new Error('JWT_SECRET_KEY is not defined or not a string');
        }

        return jwt.sign(payload, secretKey, {});
    };

    /**
     * Verify token is valid or not
     * @param {string} token
     */
    public static verifyToken = async (token: string) => {
        return new Promise(function (resolve, reject) {
            jwt.verify(token, config.JWT_SECRET_KEY, async function (error: any, result: any) {
                if (error) {
                    return reject(error);
                }
                // const userRes = await Users.findOne({ accessToken: token });

                //     if (userRes) {
                        return resolve(result);
                  //   } else {
                  //       return reject({ message: MESSAGES.USER_CANNOT_BE_FOUND });
                  // }

            });
        });
    };

    /**
     * decoded jwt token
     * @param token string
     */
    public static getDecoded = async (token: any) => {
        return jwt.decode(token);
    };

    public static generateGuestToken = (sessionId: string, expiresIn: string = '24H'): string => {
        return this.generateToken(sessionId, 'guest', expiresIn);
    };

    public static generateToken = (_id: string, authProvider: any, expireIn:any = '24H', email: string = ''): any => {

        const payload: JwtPayload = {
          _id,
          authProvider,
          email,
          issuedAt: Math.floor(Date.now() / 1000),
        };

        const secretKey = String(config.JWT_SECRET_KEY)||"";
        const token = jwt.sign(payload, secretKey,{expiresIn: expireIn})
        return token;
      };
}


