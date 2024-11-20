import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { sendVerificationEmail } from '@/helpers/sendVerificationEmail'
import bcrypt from 'bcrypt'


export async function POST(req: Request) {
    await dbConnect();
    try {
        const { username, email, password } = await req.json()

        const existingUserVerifiedByUsername = await UserModel.findOne({ username, isVerified: true })

        if (existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: "Username already exists in the database"
            }, { status: 400 })
        }
        const existingUserByEmail = await UserModel.findOne({ email })

        const verifyCode = Math.ceil(1000 + Math.random() * 5000).toString();

        if (existingUserByEmail) {
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success : false,
                    message : "User exists with this email."
                },{status : 400})
            } else{
                const hashedPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hashedPassword; 
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 360000);
                await existingUserByEmail.save();

            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10)

            const expiryCode = new Date();
            expiryCode.setHours(expiryCode.getHours() + 1)


            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryCode,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })
            await newUser.save()
        }
        //sending verification email.

        const emailResponse = await sendVerificationEmail(email, username, verifyCode)
        console.log(emailResponse);


    } catch (error) {
        console.log("Error while registering user : ", error)
        return Response.json({
            success: false,
            message: "Error while registering user"
        }, { status: 500 })
    }
}