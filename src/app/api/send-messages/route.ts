import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";

export async function POST(request:Request) {
    await dbConnect();
    const {searchParams} = new URL(request.url)
    const queryParam = searchParams.get('username')
    
   console.log("queryParam : ", queryParam) 
    const {content} = await request.json()

    try {
        const user = await UserModel.findOne({username : queryParam})
        if(!user){
            console.log("msg : user not found")
            return Response.json({
                success: false,
                message: "user not found"
            }, { status: 404 })
        }
        if(!user.isAcceptingMessage){
            console.log("user : ", user)
            console.log("isAcceptingMessage : ",user.isAcceptingMessage)
            console.log("msg : not accepting messages")
            return Response.json({
                success: false,
                message: "user is not accepting messages"
            }, { status: 403 })
        }
        const newMessage = {content , createdAt : new Date()}
        user.messages.push(newMessage as Message)
        await user.save();


        console.log("msg: success")
        return Response.json({
            success: true,
            message: "message sent successfully"
        }, { status: 201 })
    } catch (error) {
        console.log("error while sending messages : ",error);
        return Response.json({
            success: false,
            message: "Internal error occurred while sending messages"
        }, { status: 500 })
        
    }
}
