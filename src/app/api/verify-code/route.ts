import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, code } = await request.json();
        const decodedUsername = decodeURIComponent(username)
        const user = await UserModel.findOne({ username: decodedUsername })

        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, { status: 500 })
        }

        const isCodeValid = user.verifyCode === code;
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true;
            user.save();

            return Response.json({
                success: true,
                message: "Account verified successfully"
            }, { status: 200 })
        } else if (!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: "Verification code expired, please signup again"
            }, { status: 500 })
        } else {
            return Response.json({
                success: false,
                message: " Incorrect verification code"
            }, { status: 500 })
        }

    } catch (error) {
        console.error("Error while verifying code : ", error)
        return Response.json({
            success: false,
            message: "Error verifying code"
        }, { status: 500 })
    }
}