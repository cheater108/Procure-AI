import 'dotenv/config';
import sgMail, { type MailDataRequired } from '@sendgrid/mail';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL;

class EmailManager {
    constructor() {
      if (!SENDGRID_API_KEY) {
        throw new Error("SENDGRID_API_KEY is not defined");
      }
      sgMail.setApiKey(SENDGRID_API_KEY);
    }

    async sendEmail(to: string, body: string, subject: string) {
      if (!SENDGRID_FROM_EMAIL) {
        throw new Error("SENDGRID_FROM_EMAIL is not defined");
      }
      console.log(SENDGRID_API_KEY, SENDGRID_FROM_EMAIL);
      const msg: MailDataRequired = {
        to,
        from: SENDGRID_FROM_EMAIL,
        subject,
        text: body,
      };
      await sgMail.send(msg);
    }
}

export default new EmailManager();