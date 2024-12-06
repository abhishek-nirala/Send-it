import { z } from 'zod'
import { usernameValidation } from '@/schemas/signUpSchema'
import UserModel from '@/model/User'
import dbConnect from '@/lib/dbConnect'

const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request) {

    await dbConnect();
    try {
        //getting data from the url.
        const { searchParams } = new URL(request.url);
        const queryParam = {
            username: searchParams.get('username')
        }
        //validating the username with zod
        const result = UsernameQuerySchema.safeParse(queryParam); //the safeParse method requires an object hence queryParams is an object instead of a variable.
        console.log('zod-result : ',result);
        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success : false,
                message : usernameErrors
            },{status:400})
        }
        const {username} = result.data

        const existingVerifiedUser = await UserModel.findOne({username, isVerified:true})
        if(existingVerifiedUser){
            return Response.json({
                success : false,
                message :'username already taken/not available'
            },{status:400})
        }
        return Response.json({
            success : true,
            message : 'username available'
        },{status:200})

    } catch (error) {
        console.error("Error while checking Username : ", error)
        return Response.json({
            success: false,
            message: "Error checking username"
        }, { status: 500 })
    }
}