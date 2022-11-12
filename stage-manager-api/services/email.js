import config from 'config';
import nodemailer from 'nodemailer';

import { } from './database.js';

const appConfig = config.get('appConfig');
const emailConfig = config.get('emailConfig');

function createTransporter() {
  const transporter = nodemailer.createTransport(emailConfig.smtp);
  transporter.verify((err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Server is ready to take our messages");
    }
  });
  return transporter;
}

export function sendWelcomeEmail(to, username, verificationToken) {
  return new Promise((resolve, reject) => {
    const activationUrl = `${appConfig.appUrl}/users/activate/${verificationToken}`;
    let message = {
      from: emailConfig.sender,
      to,
      subject: `Welcome to ${appConfig.appName}`,
      text: `Welcome to ${appConfig.appName}, ${username}. Please activate your account by clicking this link: ${activationUrl}`,
    };
    const transport = nodemailer.createTransport(emailConfig.smtp);
    transport.sendMail(message, (err) => {
      if (err) {
        reject(new Error(err));
        return;
      }
      resolve();
    })
  });
}