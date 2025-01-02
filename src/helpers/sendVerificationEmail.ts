import { ApiResponses } from '../types/ApiResponses'
import {sendMailOptions} from '../lib/SendEmail'

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponses> {
    try {

        await sendMailOptions({
            from: process.env.SMTP_SERVER_USERNAME,
            to: email,
            subject: 'FeedBack App | Verification Code',
            text: `your verification code for ${username} is ${verifyCode}`,
            html: `<p>your verification code for ${username} is ${verifyCode} </p>`,
        });

        return { success: true, message: "verification email sent" }

    } catch (emailError) {
        console.log("Error sending email error", emailError);
        return { success: false, message: "Failed to send verification email" }

    }
}