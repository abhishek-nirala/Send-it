"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import dummyMsg from "@/dummyMsg.json"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { motion } from "framer-motion"
import Autoplay from "embla-carousel-autoplay"
import Footer from "@/components/Footer"
import Image from "next/image"
import NavBar from "@/components/Navbar"


export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  }

  return (<>
    <NavBar />
    <div className="min-h-screen bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white">
      <div className="container mx-auto px-4 py-16">
        {mounted && (
          <motion.div initial="hidden" animate="visible" variants={containerVariants} className="space-y-20">
            <motion.div variants={itemVariants} className="text-center space-y-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="inline-block mb-4"
              >
                <Image className="rounded-[50%] border-orange-700 border-[2px]" src='/logo.png' width={100} height={100} alt="Brand Logo" />
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-extrabold leading-tight md:leading-[1.15] bg-gradient-to-r from-fuchsia-400 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                Share Your Thoughts Anonymously
              </h1>
              <h5 className="text-center mt-6 font-medium text-lg text-slate-300">
                An open platform to share your <span className="font-bold text-fuchsia-400">thoughts</span>,
                <span className="font-bold text-fuchsia-400"> feedback</span>, and
                <span className="font-bold text-fuchsia-400"> feelings</span> completely anonymously.
                <br></br>
                No <span className="font-bold text-fuchsia-400">names</span>.
                No <span className="font-bold text-fuchsia-400">judgment</span>. No
                <span className="font-bold text-fuchsia-400"> identity</span>. Just your honest voice.
              </h5>
            </motion.div>

            <motion.div variants={itemVariants} className="relative py-12">
              <div className="absolute inset-0 bg-white/5 backdrop-blur-md rounded-3xl -z-10 border border-white/10 shadow-xl shadow-fuchsia-800/10"></div>
              <Carousel
                opts={{ align: "center", loop: true }}
                plugins={[Autoplay({ delay: 2500 })]}
                className="w-full max-w-5xl mx-auto"
              >
                <CarouselContent>
                  {dummyMsg.map((msg, index) => (
                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                      <motion.div className="p-2" whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}>
                        <Card className="bg-[#1e293b] border border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300 h-[200px]">
                          <CardHeader>
                            <CardTitle className="text-sky-400">{msg.username}</CardTitle>
                            <CardDescription className="text-gray-400">Shared a message</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-white line-clamp-2">{msg.message}</p>
                          </CardContent>
                          <CardFooter>
                            <p className="text-xs text-gray-400">{msg.time}</p>
                          </CardFooter>
                        </Card>

                      </motion.div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex items-center justify-center gap-2 mt-6">
                  <CarouselPrevious className="static transform-none mx-2 bg-fuchsia-400/20 hover:bg-fuchsia-400/30 border-white/10" />
                  <CarouselNext className="static transform-none mx-2 bg-fuchsia-400/20 hover:bg-fuchsia-400/30 border-white/10" />
                </div>
              </Carousel>
            </motion.div>
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  </>
  )
}



