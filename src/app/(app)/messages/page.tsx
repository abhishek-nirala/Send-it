'use client'

import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import React, { useState } from 'react'
import { z } from 'zod'
import { messageSchema } from '@/schemas/messageSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
// import { toast } from '@/hooks/use-toast'

function Message() {
    // const [message, setMessage] = useState<typeof messageSchema>()
    const [loading, setIsLoading] = useState(false)
    const { data: session } = useSession();
    // if (status === "unauthenticated") {
    //     toast({
    //         title: "Auth failed",
    //         description: "User not authenticated",
    //         variant: "destructive"
    //     })
    //     return

    console.log("session.user @messages at client : ", session?.user?.username)
    const username = session?.user?.username

    const form = useForm<z.infer<typeof messageSchema>>({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            content: ''
        }
    })
    const onSubmit = async (data: z.infer<typeof messageSchema>) => {
        setIsLoading(true)
        console.log("data @message: ", data)

        try {
            const response = await axios.post(`/api/send-messages?username=${username}`, data)
            console.log('response @message: ', response.data)
        } catch (error) {
            console.log("error @ message: ", error)
        }finally{
            setIsLoading(false)
        }

    }

    return (
        <>
            <div>message</div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>

                    <FormField
                        name="content"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem className="text-left space-y-2">
                                <FormLabel>Message</FormLabel>
                                <FormControl>
                                    <Input placeholder="type your message here"
                                        {...field}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    {/* <input type="submit" /> */}
                    <Button type='submit' disabled={loading}>
                        {
                            loading? <>
                                <Loader2 className='animate-spin'/> 
                            </>
                            : 
                            "Submit"
                        }
                    </Button>
                </form>
            </Form>
        </>



    )
}

export default Message



