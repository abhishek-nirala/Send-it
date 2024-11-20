import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_SERVER_USENAME,
    pass: process.env.SMTP_SERVER_PASSWORD,
  },
});

export async function sendMail(options: nodemailer.SendMailOptions) {
  try {
    const info = await transporter.sendMail(options);
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
