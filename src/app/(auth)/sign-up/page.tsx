'use client'

import { zodResolver } from "@hookform/resolvers/zod"
// import Link from "next/link"
import { useForm } from "react-hook-form"
import { useDebounceCallback } from 'usehooks-ts'
import * as z from "zod"
import { useEffect, useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import axios, { AxiosError } from 'axios'
import { ApiResponses } from "@/types/ApiResponses"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import Link from "next/link"


const SignUp = () => {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // const [debouncedUsername, setDebouncedUsername] = useDebounceValue(username, 500)
  const debounced = useDebounceCallback(setUsername, 500)
  const { toast } = useToast()
  const router = useRouter()

  //zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    },
  })

  useEffect(() => {
    const checkUsernameUnique = async () => {
      // setUsernameMessage('')
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage('');
        try {
          //api call to check username &&& this is how to send data using queryParams. 
          const response = await axios.get(`/api/check-username-unique?username=${username}`)
          setUsernameMessage(response.data.message)
        } catch (error) {
          // console.log(error)
          const axiosError = error as AxiosError<ApiResponses>
          setUsernameMessage(axiosError.response?.data.message ?? "Error checking available username")
        } finally {
          setIsCheckingUsername(false)
        }
      }
    }

    checkUsernameUnique();
  }, [username])

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {

    setIsSubmitting(true)
    try {
      //api call to register user
      const response = await axios.post('/api/signUP', data)
      // console.log("onSubmitting data : ", data)
      // console.log("response : ", response)
      toast({
        title: response.data.message,
        description: "You have been registered successfully",
        duration: 3000,
      })
      router.push(`/verifyCode/${username}`)
    } catch (error) {
      console.log(error)
      const axiosError = error as AxiosError<ApiResponses>
      toast({
        title: axiosError.response?.data.message ?? "Error registering user",
        description: "Please try again",
        duration: 3000,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900 ">
        <div className="w-full max-w-md text-center bg-white border border-gray-200 rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold mb-2  bg-gradient-to-r from-fuchsia-400 via-pink-500 to-orange-400 bg-clip-text text-transparent">

            Join FeedBack App
          </h1>
          <p className="text-lg text-gray-600 mb-3 mt-5">to give anonymous Feedback </p>
          <h2 className="text-2xl font-bold mb-3">Sign Up</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="text-left space-y-2">
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="blue_bird"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          debounced(e.target.value)
                        }}
                      />
                    </FormControl>
                    {
                      isCheckingUsername && <Loader2 className="animate-spin" />
                    }
                    <p className={`text-sm ${usernameMessage === 'username available' ? 'text-green-700' : 'text-red-700'
                      }`}>{usernameMessage}</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="text-left space-y-2">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="example001@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="text-left space-y-2">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="!@#$%^&*dip123"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting}>
                {
                  isSubmitting ?
                    <>
                      <Loader2 className="animate-spin" />
                    </>
                    :
                    "Sign Up"
                }
              </Button>
            </form>
          </Form>
          <div className="mt-5">
            <span className="">
              Have you already joined? 
            </span>
            <Link href="/sign-in" className="text-blue-700 font-bold font-mono"> Sign-In</Link>
          </div>
        </div>
      </main>

    </>
  )
}

export default SignUp