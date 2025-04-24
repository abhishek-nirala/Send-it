'use client'
import { toast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
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
import { singInSchema } from '@/schemas/signInSchema'
import React from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'

const SignIn = () => {

  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter();

  const form = useForm<z.infer<typeof singInSchema>>({
    resolver: zodResolver(singInSchema),
    defaultValues: {
      email: '',
      password: ''
    },
  })

  const onSubmit = async (data: z.infer<typeof singInSchema>) => {
    setIsSubmitting(true)
    try {
      const result = await signIn('credentials', {
        redirect: false,
        identifier: data.email,
        password: data.password
      })
      if (result?.error) {
        toast({
          title: 'Login Failed',
          description: result.error,
          variant: 'destructive'
        })
      }
      if (result?.url) {
        router.push('/look-up')
      }
    } catch (error) {
      console.log(error);
      toast({
        title: 'Status:500',
        description: 'Internal Error',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }

  }

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900">
        <div className="w-full max-w-md text-center bg-white border border-gray-200 rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
            Welcome Back
          </h1>
          {/* <p className="text-lg text-gray-600 mb-8 mt-5">Anonymous Feedback </p> */}
          <h2 className="text-2xl font-bold mb-6">Sign In</h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="text-left space-y-2">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="example001@email.com"
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
                    "Sign In"
                }
              </Button>
            </form>
          </Form>
          <div className="mt-5">
            <span className="">
              Have you not joined yet?
            </span>
            <Link href="/sign-up" className="text-blue-700 font-bold font-mono"> Sign-Up</Link>
          </div>
        </div>
      </main>

    </>
  )
}

export default SignIn