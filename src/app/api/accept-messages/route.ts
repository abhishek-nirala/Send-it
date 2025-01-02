import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
    await dbConnect();
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "User not found"
        }, { status: 401 })
    }
    const userId = user._id
    const { acceptingMessages } = await request.json();

    try {
        const updateUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptingMessages },
            { new: true }
        )
        if (!updateUser) {
            return Response.json({
                success: false,
                message: "Unable to update user status to accepting messages"
            }, { status: 500 })
        }
        return Response.json({
            success: true,
            message: "Message Accepting"
        }, { status: 200 })

    } catch (error) {
        console.log("Unable to update user status to accepting messages", error)
        return Response.json({
            success: false,
            message: "Unable to update user status to accepting messages"
        }, { status: 500 })
    }
}

export async function GET() {
    await dbConnect();
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "User not found"
        }, { status: 404 })
    }
    const userId = user._id
    try {
        const foundUser = await UserModel.findById(userId)
        if (!foundUser) {
            return Response.json({
                status: false,
                message: "User not found"
            }, { status: 404 })
        }
        return Response.json({
            status: true,
            isAcceptingMessages: foundUser?.isAcceptingMessage
        }, { status: 200 })

    } catch (error) {
        console.log("Unable to get user status", error)
        return Response.json({
            success: false,
            message: "Unable to get user status"
        }, { status: 500 })
    }

}