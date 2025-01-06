'use client'
import { toast } from '@/hooks/use-toast'
import { verificationCodeSchema } from '@/schemas/verifySchema'
import { ApiResponses } from '@/types/ApiResponses'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import {  useForm } from 'react-hook-form'
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

export default function VerifyCode() {
  const params = useParams<{ username: string }>()
  const [checkingCode, setCheckingCode] = useState(false)
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
    setCheckingCode(true)
    try {
      const response = await axios.post(`/api/verify-code?username=${username}`, data)
      toast({
        title: response.data.success,
        description: response.data.message,
        duration: 3000,
      })

      router.push('/home')
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponses>
      toast({
        title: axiosError.response?.data.message ?? "Error verifying code",
        description: "Please try again",
        duration: 3000,
        variant: "destructive",
      })
    } finally {
      setCheckingCode(false)
    }
  }
  return (<>
    <div>Username : {params.username} </div>

    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        <FormField
          name="code"
          control={form.control}
          render={({ field }) => (
            <FormItem className="text-left space-y-2">
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="012345"
                  {...field}
                />
              </FormControl>
              {
                checkingCode && <Loader2 className="animate-spin" />
              }

              <FormMessage />
            </FormItem>
          )}
        />      
        </form>
    </Form>
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
