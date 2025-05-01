'use client'

import React, { useState } from 'react'

import {
  Card,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

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
} from '@/components/ui/alert-dialog'

import { Button } from './ui/button'
import { Trash } from 'lucide-react'
import { Message } from '@/model/User'
import { useToast } from '@/hooks/use-toast'
import axios, { AxiosError } from 'axios'
import { cn } from '@/lib/utils'
import { ApiResponses } from '@/types/ApiResponses'

type MessageCardProps = {
  message: Message,
  onDelete: (id: string) => void
}

const MessageCard = ({ message, onDelete }: MessageCardProps) => {
  const [isVisible, setIsVisible] = useState(true)
  const [isReadMoreVisible, setIsReadMoreVisible] = useState(false)
  const { toast } = useToast()

  const handleMessageDelete = async () => {
    try {
      const result = await axios.delete(`/api/delete-message?id=${message._id}`)
      toast({
        title: result.data.message,
        description: 'Message has been successfully deleted',
        duration: 3000,
      })
      setIsVisible(false)
      setTimeout(() => {
        onDelete(message._id as string)

      }, 800)
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponses>
      toast({
        title: axiosError.response?.data.message,
        variant: "destructive"
      })
    }
  }

  return (
    <>
      <Card
        className={cn(
          "transition-all duration-500 overflow-hidden bg-[#1e293b] border border-gray-700 rounded-xl p-6 shadow-lg hover:shadow-2xl",
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95 h-0 p-0 m-0"
        )}
      >
        <CardHeader className="flex flex-row justify-between items-start gap-4 p-0">
          <CardTitle className="text-lg font-semibold text-gray-200 max-w-[80%] line-clamp-1 break-words">
            {message.content}
          </CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                className="p-2 rounded-full bg-gradient-to-r from-red-500 to-pink-500 hover:opacity-90 transition"
              >
                <Trash size={20} className="text-white" />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="bg-[#1e293b] text-white border border-gray-700">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-red-400">Delete Message?</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-400">
                  This message will be deleted permanently!
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-gray-700 hover:bg-gray-600 transition">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleMessageDelete}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardHeader>

        <Dialog open={isReadMoreVisible} onOpenChange={setIsReadMoreVisible}>
          <DialogTrigger asChild>
            <button
              className="text-blue-400 hover:text-blue-300 text-sm mt-2"
              onClick={() => setIsReadMoreVisible(true)}
            >
              Read more
            </button>
          </DialogTrigger>

          <DialogContent className="bg-[#1e293b] text-white border border-gray-700 max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-sky-400 text-sm">Full Message</DialogTitle>
              <DialogDescription className="text-gray-300 mt-2 text-xl">
                {message.content}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>


      </Card>
    </>
  )
}


export default MessageCard
