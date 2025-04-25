'use client'

import React from 'react'

import {
    Card,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from './ui/button'
import { Trash} from 'lucide-react'
import { Message } from '@/model/User'
import { useToast } from '@/hooks/use-toast'
import axios from 'axios'


type MessageCardPops = {
    message: Message;
    onMessageDelete: (messageId: string) => void

}


const MessageCard = ({ message, onMessageDelete }: MessageCardPops) => {

    const { toast } = useToast()
    const handleMessageDelete = async () => {
        const result = await axios.delete(`/api/delete-message/${message._id}`)
        toast({
            title: result.data.message,
            description: "message has been successfully deleted",
            duration: 3000,

        })
        onMessageDelete(message._id as string);
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>{message.content}</CardTitle>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className='bg-black w-9 h-9 text-2xl hover:bg-red-500 '>
                                <Trash color='white' fill='white' />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Delete Message?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This Message will be deleted permanently!
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleMessageDelete}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardHeader>

            </Card>
        </>

    )
}

export default MessageCard