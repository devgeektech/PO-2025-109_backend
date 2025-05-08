"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailerUtilities = void 0;
const default_json_1 = __importDefault(require("../../config/default.json"));
const nodemailer = __importStar(require("nodemailer"));
var sgTransport = require('nodemailer-sendgrid-transport');
class MailerUtilities {
}
exports.MailerUtilities = MailerUtilities;
_a = MailerUtilities;
MailerUtilities.sendSendgridMail = (data) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("inside function");
    var options = {
        auth: {
            api_key: default_json_1.default.SENDGRID_SETTING.API_KEY
        }
    };
    var mailer = nodemailer.createTransport(sgTransport(options));
    var message = {
        to: [...data.recipient_email],
        cc: ['narender@geekinformatic.com'],
        from: default_json_1.default.SENDGRID_SETTING.SENDER.EMAIL,
        subject: data.subject,
        text: data.text,
        html: data.text
    };
    if (data.cc) {
        message.cc = [...data.cc];
    }
    if (data.attachments) {
        message.attachments = [
            {
                filename: 'test.txt',
                path: __dirname + '/test.txt'
            }
        ];
    }
    const mailRes = yield mailer.sendMail(message);
    console.log("mailRes", mailRes);
    return mailRes;
});
/**
 * Send email using smtp
 * @param data include (recipient_email,subject,message,attachments)
 */
MailerUtilities.sendSMTPEmail = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise(function (resolve, reject) {
        let transporter = nodemailer.createTransport({
            host: default_json_1.default.SMTP_SETTING.HOST,
            port: default_json_1.default.SMTP_SETTING.PORT,
            secure: false, // upgrade later with STARTTLS
            auth: {
                user: default_json_1.default.SMTP_SETTING.USERNAME,
                pass: default_json_1.default.SMTP_SETTING.PASSWORD,
            },
            tls: {
                rejectUnauthorized: false
            },
        });
        const mailData = {
            from: {
                name: default_json_1.default.SMTP_SETTING.SENDER_NAME,
                address: default_json_1.default.SMTP_SETTING.SENDER,
            },
            to: data.recipient_email,
            subject: data.subject,
            html: data.text,
        };
        if (data.attachments) {
            mailData.attachments = data.attachments;
        }
        transporter.sendMail(mailData, (err, info) => {
            if (err) {
                return reject(err);
            }
            else {
                return resolve(info);
            }
        });
    });
});
//# sourceMappingURL=MailerUtilities.js.map