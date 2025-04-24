'use client'

import MessageCard from "@/components/MessageCard"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Message } from "@/model/User"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { ApiResponses } from "@/types/ApiResponses"
import { zodResolver } from "@hookform/resolvers/zod"
import { Separator } from "@radix-ui/react-separator"
import { Switch } from "@radix-ui/react-switch"
import axios, { AxiosError } from "axios"
import { Loader2, RefreshCcw } from "lucide-react"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"

export default function Dashboard() {

  const [message, setMessage] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  const { toast } = useToast()

  const handleDeleteMessage = (messageId: string) => {
    setMessage(message.filter((msg) => msg._id !== messageId))
  }

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  })
  const { register, watch, setValue } = form;

  const acceptingMessages = watch("acceptingMessages")

  const fetchIsAcceptingMessage = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await axios.get('/api/accept-messages')
      setValue('acceptMessages', result.data.isAcceptingMessages)
    } catch (err) {
      // console.log("error : ", err)
      const axiosError = err as AxiosError<ApiResponses>
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to update message settings",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false);
    }
  }, [setValue, toast])

  const fetchAllMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true)
    setIsSwitchLoading(false)
    try {
      const result = await axios.get<ApiResponses>('/api/get-messages')
      setMessage(result.data.messages || [])
      if (refresh) {
        toast({
          title: "Messages Refreshed",
          description: "Showing recent messages"
        })
      }
    } catch (error) {
      console.log("error : ", error)
      const axiosError = error as AxiosError<ApiResponses>
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to update message",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
      setIsSwitchLoading(false)
    }
  }, [toast, setMessage])

  useEffect(() => {
    if (!session || !session.user) return
    fetchAllMessages()
    fetchIsAcceptingMessage();

  }, [session, fetchAllMessages, fetchIsAcceptingMessage])

  //handle switching
  const handleSwitching = async () => {
    try {
      const result = await axios.post<ApiResponses>('/api/accept-messages', {
        acceptingMessages: !acceptingMessages
      })
      setValue('acceptingMessages', !acceptingMessages)
      toast({
        title: result.data.message,
        variant: 'default'
      })
    } catch (error) {
      console.log("error : ", error)
      const axiosError = error as AxiosError<ApiResponses>
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to update message",
        variant: "destructive"
      })
    }
  }
  if (!session || !session.user) return <><div>Did not find User</div></>
  const username = session?.user?.username
  
  const baseUrl = `${window.location.protocol}//${window.location.hostname}`
  const profileUrl = `${baseUrl}/u/${username}`
  console.log("profileUrl @look-up : ", profileUrl);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast({
      title: "Text Copied",
      variant: "default"
    })
  }
  return (<>
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptingMessages')}
          checked={acceptingMessages}
          onCheckedChange={handleSwitching}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptingMessages ? 'On' : 'Off'}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchAllMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {message.length > 0 ? (
          message.map((message) => (
            <MessageCard
              key={message._id as string}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  </>)
}










