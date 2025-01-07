//verify code page

'use client'
import { toast } from '@/hooks/use-toast'
import { verificationCodeSchema } from '@/schemas/verifySchema'
import { ApiResponses } from '@/types/ApiResponses'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'


export default function VerifyCode() {
  const params = useParams<{ username: string }>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const username = params.username;
  const router = useRouter();
  //console.log(params)

  const form = useForm<z.infer<typeof verificationCodeSchema>>({
    resolver: zodResolver(verificationCodeSchema),
    defaultValues: {
      code: "",
    },
  })

  const onSubmit = async (data: z.infer<typeof verificationCodeSchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post(`/api/verify-code`, {
        username,
        code : data.code
      })
      toast({
        title: response.data.success,
        description: response.data.message,
        duration: 3000,
      })

      router.push('/sign-in')
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponses>
      toast({
        title: axiosError.response?.data.message ?? "Error verifying code",
        description: "Please try again",
        duration: 3000,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  return (<>
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-200">
      <div className="w-full max-w-md text-center bg-white border border-gray-200 rounded-lg shadow-md p-8">
        <h5 className="text-xl font-bold mb-2 bg-gradient-to-r from-gray-400 to-slate-800 text-transparent bg-clip-text">
          verification code has been sent to your email
        </h5>
        <p>username : {params.username} </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem className="text-left space-y-2">
                  <FormLabel className='ml-2'>Verification Code</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="012345" className='no-spin'
                      {...field}
                    />
                  </FormControl>
                  {/* {
                isSubmitting && <Loader2 className="animate-spin" />
              } */}

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
                  "Verify"
              }
            </Button>
          </form>
        </Form>
      </div>
    </main>
  </>
  )
}








//this method for accessing the dynamic data from the url is done in server-side means backend.
// export default async function Page({
//     params,
//   }: {
//     params: Promise<{ username : string }>
//   }) {
//     const slug = (await params).username
//     return <div>My Post: {slug}</div>
// }
