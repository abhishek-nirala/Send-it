'use client'

import React, { useState } from 'react'
import dummyData from '@/dummyMsg.json'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { motion } from 'framer-motion'
import NavBar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Separator } from '@radix-ui/react-separator'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

function Feed() {
  const [selectedMessage, setSelectedMessage] = useState('')
  return (
    <>
      <NavBar />
      <main className="min-h-screen w-full bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white flex flex-col items-center px-6 py-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-indigo-400"
        >
          Feed
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
          {dummyData.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-[#1e293b] border border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 max-h-[200px] flex flex-col justify-between">
                <CardHeader>
                  <CardTitle className="text-sky-400">{msg.username}</CardTitle>
                  <CardDescription className="text-gray-400">Shared a message</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-white line-clamp-2">{msg.message}</p>
                </CardContent>
                <CardFooter>
                  <p className="text-xs text-gray-400">{msg.time}</p>
                  <AlertDialog>

                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-sky-400 hover:bg-transparent hover:text-white"
                        onClick={() => setSelectedMessage(msg.message)}
                      >
                        Read more
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent className="bg-[#1e293b] text-white border border-gray-700">
                      <AlertDialogHeader>

                        <AlertDialogTitle className="text-sky-400">{msg.username}&#39;s Message
                        </AlertDialogTitle>

                        <AlertDialogDescription className="text-white">
                          {selectedMessage}
                        </AlertDialogDescription>

                      </AlertDialogHeader>

                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-gray-700 hover:bg-gray-600 transition">Cancel</AlertDialogCancel>

                      </AlertDialogFooter>
                    </AlertDialogContent>

                  </AlertDialog>
                </CardFooter>
              </Card>
            </motion.div>))}
        </div>
        <Separator className='my-8' />
        <Footer />
      </main>
    </>
  )


}

export default Feed


