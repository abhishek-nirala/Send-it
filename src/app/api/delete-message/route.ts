import dbConnect from "@/lib/dbConnect"
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function DELETE(request: Request) {

    const { searchParams } = new URL(request.url)
    const messageId = searchParams.get("id") as string

    const session = await getServerSession(authOptions)
    if (!session) {
        return new Response(
            JSON.stringify({
                status: false,
                message: "User not found ",
            }),
            { status: 200 }
        );

    }

    console.log(messageId)
    await dbConnect();
    try {
        const response = await UserModel.updateOne(
            { _id: session?.user?._id },
            { $pull: { messages: { _id: messageId } } }
        )
        if (response.modifiedCount === 0) {
            return Response.json({
                status: false,
                message: "No messages found to delete or have been deleted",
            }, { status: 404 })


        }

        return Response.json({
            status: true,
            message: "Message deleted successfully",
        }, { status: 201 })


    } catch (e) {
        console.log("e : ", e)
        return Response.json({
            status: false,
            message: "failed to delete the message",
        }, { status: 500 })
    }
}