import nodemailer from "nodemailer";
import { SMTP_HOST, SMTP_MAIL, SMTP_PASSWORD, SMTP_PORT } from "../config.js";

const transporter = nodemailer.createTransport({
  sendMail: true,
  host: SMTP_HOST,
  secure: true,
  port: SMTP_PORT,
  auth: {
    user: `${SMTP_MAIL}`,
    pass: `${SMTP_PASSWORD}`,
  },
});

const mailer = (mailOptions) => {
  return new Promise((resolve) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(`error is ${error}`);
        resolve(false);
      } else {
        console.log(`Email sent: ${info.response}`);
        resolve(true);
      }
    });
  });
};

export const mailEmailVerification = async (url, email) => {
  const mailOptions = {
    from: SMTP_MAIL,
    to: email,
    subject: "Email Verification - Please Confirm Your Email",
    html: `
      <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; text-align: center;">
          <h1 style="color: #0066cc;">Email Verification</h1>
          <p style="color: #333; font-size: 16px; line-height: 1.5;">
            Thank you for registering! Please click the button below to verify your email address.
          </p>
          <a href="${url}" 
             style="display: inline-block; 
                    background-color: #0066cc; 
                    color: white; 
                    padding: 12px 30px; 
                    text-decoration: none; 
                    border-radius: 5px; 
                    margin: 20px 0;">
            Verify Email
          </a>
          <p style="color: #666; font-size: 14px;">
            If the button doesn't work, copy and paste this link in your browser:<br>
            <span style="color: #0066cc;">${url}</span>
          </p>
        </div>
      </div>
    `,
  };

  return await mailer(mailOptions);
};
