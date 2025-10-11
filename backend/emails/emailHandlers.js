import nodemailer from 'nodemailer';
import { createWelcomeEmailTemplate } from '../emails/emailTemplates.js';
import { ENV } from '../lib/env.js';

// Create a transporter
const transporter = nodemailer.createTransport({
  host: ENV.SMTP_HOST, // e.g. "smtp.gmail.com"
  port: ENV.SMTP_PORT, // e.g. 587
  secure: ENV.SMTP_SECURE, // true for 465, false for 587
  auth: {
    user: ENV.SMTP_USER, // e.g. "your@email.com"
    pass: ENV.SMTP_PASS, // SMTP password or app password
  },
});

export const sendWelcomeEmail = async (email, name, clientURL) => {
  const html = createWelcomeEmailTemplate(name, clientURL);

  const mailOptions = {
    from: `"${ENV.SMTP_FROM_NAME}" <${ENV.SMTP_FROM_EMAIL}>`, // e.g. "Chatify <hello@chatify.com>"
    to: email,
    subject: 'Welcome to Chatify!',
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Welcome Email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw new Error('Failed to send welcome email');
  }
};
