import config from "../../config/default.json";
import * as nodemailer from "nodemailer";
var sgTransport = require('nodemailer-sendgrid-transport');

export class MailerUtilities {

  public static sendSendgridMail = async (data: any) => {
    console.log("inside function")
    var options = {
      auth: {
        api_key: config.SENDGRID_SETTING.API_KEY
      }
    }

    var mailer = nodemailer.createTransport(sgTransport(options));

    var message: any = {
      to: [...data.recipient_email],
      cc: ['narender@geekinformatic.com'],
      from: config.SENDGRID_SETTING.SENDER.EMAIL,
      subject: data.subject,
      text: data.text,
      html: data.text
    };

    if (data.cc) {
      message.cc = [...data.cc]
    }

    if (data.attachments) {
      message.attachments = [
        {
          filename: 'test.txt',
          path: __dirname + '/test.txt'
        }
      ]
    }

    const mailRes = await mailer.sendMail(message);
    console.log("mailRes", mailRes);
    return mailRes;
  }


  /**
   * Send email using smtp
   * @param data include (recipient_email,subject,message,attachments)
   */
  public static sendSMTPEmail = async (data: any) => {
    return new Promise(function (resolve, reject) {
      let transporter = nodemailer.createTransport({
        host: config.SMTP_SETTING.HOST,
        port: config.SMTP_SETTING.PORT,
        secure: false, // upgrade later with STARTTLS
        auth: {
          user: config.SMTP_SETTING.USERNAME,
          pass: config.SMTP_SETTING.PASSWORD,
        },
        tls: {
          rejectUnauthorized: false
        },
      });

      const mailData: any = {
        from: {
          name: config.SMTP_SETTING.SENDER_NAME,
          address: config.SMTP_SETTING.SENDER,
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
        } else {
          return resolve(info);
        }
      });
    });
  };

}
