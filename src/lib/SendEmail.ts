import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_SERVER_USERNAME,
    pass: process.env.SMTP_SERVER_PASSWORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN
  },
});
// console.log("user : ",process.env.SMTP_SERVER_USERNAME)
// console.log("password : ",process.env.SMTP_SERVER_PASSWORD)
// console.log("clientId : ",process.env.OAUTH_CLIENTID)
// console.log("clientsecret : ",process.env.OAUTH_CLIENT_SECRET)
// console.log("rfshtkn : ",process.env.OAUTH_REFRESH_TOKEN)

export async function sendMailOptions(options: nodemailer.SendMailOptions) {
  try {
    const info = await transporter.sendMail(options);
    console.log('Message sent: %s', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
