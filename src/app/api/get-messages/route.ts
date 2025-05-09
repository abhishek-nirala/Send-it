import { getServerSession, User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import mongoose from "mongoose";


export async function GET() {
    await dbConnect();
    const session = await getServerSession(authOptions)
    const user: User = session?.user as User
    // console.log("session at get-message route: ",session)

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "User not found"
        }, { status: 401 })
    }
    const userId = new mongoose.Types.ObjectId(user._id)

    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }
        ])

        if (!user || user.length === 0) {
            return Response.json({
                success: false,
                message: "Messages Not Found"
            }, { status: 404 })
        }
        // console.log("messages: ", user[0].messages);
        
        return Response.json({
            success: true,
            messages: user[0].messages
        }, { status: 200 })
    } catch (error) {
        console.log("error while getting messages : ", error);
        return Response.json({
            success: false,
            message: "Internal error occurred while getting messages"
        }, { status: 500 })

    }

}