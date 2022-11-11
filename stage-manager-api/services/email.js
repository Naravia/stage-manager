import config from 'config';
import nodemailer from 'nodemailer';

import {} from './database.js';

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

