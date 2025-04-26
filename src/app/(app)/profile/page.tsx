'use client'

import Footer from "@/components/Footer"
import NavBar from "@/components/Navbar"
import MessageCard from "@/components/MessageCard"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Message, User } from "@/model/User"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { ApiResponses } from "@/types/ApiResponses"
import { zodResolver } from "@hookform/resolvers/zod"
import axios, { AxiosError } from "axios"
import { Loader2, RefreshCcw } from "lucide-react"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { motion, AnimatePresence } from "framer-motion"

const greetings = [
  "नमस्ते",
  "Hello",
  "Hola",
  "Bonjour",
  "Ciao",
  "こんにちは",
  "안녕하세요",
  "Olá",
  "مرحبا",
]
export default function Dashboard() {
  const [message, setMessage] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)
  const [profileUrl, setProfileUrl] = useState('')
  const { toast } = useToast()
  const [index, setIndex] = useState(0)

  const { data: session } = useSession()
  const form = useForm({ resolver: zodResolver(acceptMessageSchema) })
  const { register, watch, setValue } = form
  const acceptingMessages = watch("acceptingMessages")

  const fetchIsAcceptingMessage = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await axios.get('/api/accept-messages')
      setValue('acceptingMessages', result.data.isAcceptingMessages)
    } catch (err) {
      const axiosError = err as AxiosError<ApiResponses>
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to update message settings",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }, [setValue, toast])

  const fetchAllMessages = useCallback(async (refresh = false) => {
    setIsLoading(true)
    setIsSwitchLoading(false)
    try {
      const result = await axios.get<ApiResponses>('/api/get-messages')
      setMessage(result.data.messages || [])
      if (refresh) {
        toast({ title: "Messages Refreshed", description: "Showing recent messages" })
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponses>
      toast({
        title: "Error",
        description: axiosError.response?.data.message || "Failed to fetch messages",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
      setIsSwitchLoading(false)
    }
  }, [toast])

  const handleDeleteMessage = async () => {
    try {
      const response = await axios.delete(`/api/delete-message?username=${session?.user?.username}`)
      if (response.data.status) {
        toast({
          title: "Success",
          description: response.data.message,
          variant: "default"
        })
      }

    } catch (error) {
      console.log("error while deleting msg @profile/page.tsx : ", error)
      const axiosErr = error as AxiosError<ApiResponses>;
      toast({
        title: "Error while deleting message",
        description: axiosErr?.response?.data.message,
        variant: "destructive"
      })
    }
  }
  useEffect(() => {
    if (!session?.user) return
    fetchAllMessages()
    fetchIsAcceptingMessage()
  }, [session, fetchAllMessages, fetchIsAcceptingMessage])

  useEffect(() => {
    if (!session?.user) return
    const { username } = session.user as User
    const baseUrl = `${window.location.protocol}//${window.location.hostname}`
    setProfileUrl(`${baseUrl}/u/${username}`)
  }, [session])

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % greetings.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  if (!session?.user) return <div className="text-white text-center p-10">User not found</div>

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast({ title: "Link copied", variant: "default" })
  }


  return (
    <div className="bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] min-h-screen text-white scroll-smooth">
      <NavBar />
      <main className="max-w-5xl mx-auto px-6 py-10 animate-fade-in">

        <AnimatePresence mode="wait">
          <motion.h1
            key={greetings[index]}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold mb-6 text-center"
          >
            {greetings[index]} {session?.user?.username}
          </motion.h1>
        </AnimatePresence>


        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-2">Your Message Link</h2>
          <div className="flex flex-col md:flex-row items-center gap-2">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-md w-full md:w-auto"
            />
            <Button onClick={copyToClipboard}>Copy</Button>
          </div>
        </section>

        <section className="mb-10">
          <div className="flex items-center gap-3">
            <SwitchPrimitive.Root
              {...register('acceptingMessages')}
              checked={acceptingMessages}
              onCheckedChange={async () => {
                setIsSwitchLoading(true)
                try {
                  const res = await axios.post<ApiResponses>('/api/accept-messages', {
                    acceptingMessages: !acceptingMessages
                  })
                  setValue('acceptingMessages', !acceptingMessages)
                  toast({ title: res.data.message })
                } catch (err) {
                  const axiosError = err as AxiosError<ApiResponses>
                  toast({
                    title: "Error",
                    description: axiosError.response?.data.message || "Failed to toggle",
                    variant: "destructive"
                  })
                } finally {
                  setIsSwitchLoading(false)
                }
              }}
              disabled={isSwitchLoading}
              className="w-12 h-6 bg-gray-300 rounded-full relative data-[state=checked]:bg-green-500 transition-colors"
            >
              <SwitchPrimitive.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform translate-x-1 data-[state=checked]:translate-x-6" />

            </SwitchPrimitive.Root>

            <span className="text-sm">Accept Messages: {acceptingMessages ? "On" : "Off"}</span>

          </div>
        </section>

        <section className="mb-10">
          <Button
            onClick={(e) => {
              e.preventDefault()
              fetchAllMessages(true)
            }}
            variant="outline"
            className="flex items-center gap-2 text-black"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCcw className="w-4 h-4" />
            )}
            Refresh
          </Button>
        </section>

        <motion.section
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          {message.length > 0 ? (
            message.map((msg) => (
              <motion.div key={msg._id as string} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
                <MessageCard message={msg} onMessageDelete={handleDeleteMessage} />
              </motion.div>
            ))
          ) : (
            <p>No messages to display.</p>
          )}
        </motion.section>
      </main>
      <Footer />
    </div>
  )
}