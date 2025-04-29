
'use client'

import { useSession } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import React, { useEffect, useState } from 'react'
import { z } from 'zod'
import { messageSchema } from '@/schemas/messageSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import axios, { AxiosError } from 'axios'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { ApiResponses } from '@/types/ApiResponses'
import NavBar from '@/components/Navbar'
import { motion } from 'framer-motion'
import Footer from '@/components/Footer'
import { Separator } from '@radix-ui/react-separator'

function Message() {
  const [loading, setIsLoading] = useState(false)
  const { data: session } = useSession()
  const username = session?.user?.username
  const [message, setMessage] = useState<string[]>([])

  const suggestMessage = async () => {
    const response = await axios.get('/api/suggest-messages')
    if (response.data.success) {
      const splitMessage = response.data.message.split("||")
      setMessage(splitMessage)
    }
  }
  useEffect(() => {
    suggestMessage();
  }, [])

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: '',
    },
  })

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true)
    // console.log('data @message: ', data)

    try {
      const response = await axios.post(`/api/send-messages?username=${username}`, data)

      if (response.data.success) {
        toast({
          title: 'Success',
          description: response.data.message,
          variant: 'default',
        })
        form.reset()
      }
    } catch (error) {
      console.log('error @ message: ', error)
      const axiosError = error as AxiosError<ApiResponses>
      toast({
        title: 'Error',
        description: axiosError.response?.data.message || 'Something went wrong',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }

  }


  return (
    <>
      <NavBar />
      <main className="min-h-screen w-full bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white flex flex-col items-center justify-center px-6 py-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-indigo-400"
        >
          Enter your Send
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md bg-[#1e293b] border border-gray-700 rounded-xl p-8 shadow-xl backdrop-blur-md"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="content"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-gray-300 text-sm">Message</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Type your message here..."
                        className="bg-[#334155] border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-sky-500 transition"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-sky-500 to-indigo-500 hover:opacity-90 transition-all duration-300 text-white font-semibold"
              >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Send'}
              </Button>
            </form>
          </Form>
        </motion.div>
        <div className="mt-12 w-full max-w-md flex flex-col gap-4 items-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-lg font-semibold text-sky-400 mb-2"
          >
            AI Generated Suggestions
          </motion.p>

          {message && message.map((msg, index) => (
            <motion.input
              key={index}
              type="text"
              value={msg}
              disabled
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-[#334155] border border-gray-600 text-white placeholder-gray-400 
                focus:ring-2 focus:ring-sky-500 
                px-5 py-3 rounded-lg w-full 
                text-center text-sm shadow-md"
            />
          ))}
        </div>
        <Separator className='my-8'/>
          <Footer/>
      </main>


    </>
  )
}

export default Message

