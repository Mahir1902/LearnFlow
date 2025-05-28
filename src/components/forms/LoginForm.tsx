"use client"


import { Label } from '../ui/label'
import { Input } from '../ui/input'
import Link from 'next/link'
import { Button } from '../ui/button'
import {z} from "zod"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { useState } from 'react'
import { useId } from 'react'
import { toast } from 'sonner'
import { signInWithEmail } from '@/app/actions/auth-actions'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

const formSchema = z.object({
  email: z.string().email({message: "Invalid email address"}),
  password: z.string().min(8, {message: "Password must be at least 8 characters long"}),
})


export default function LoginForm({setMode}: {setMode: (mode: string) => void}) {

  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const toastId = useId()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",


    }
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    toast.loading("Logging in...", {id: toastId})
    setLoading(true)
    const validation = formSchema.safeParse(data)
    if (!validation.success) {
      console.log(validation.error)
    }

    const validatedData = validation?.data

    const formData = new FormData()
    formData.append("email", validatedData?.email || "")
    formData.append("password", validatedData?.password || "")

    const {success, error} = await signInWithEmail(formData)

    if(!success) {
      toast.error(error || "Something went wrong", {id: toastId})
      setLoading(false)
    } else {
      toast.success("Logged in successfully", {id: toastId})
      setLoading(false)
      router.push("/dashboard")
    }
  }

  return (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <FormField
          control={form.control}
          name="email"
          render={({field}) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>)}
          />
          <FormField
          control={form.control}
          name="password"
          render={({field}) => (
            <FormItem>
              <div className="flex justify-between">
              <FormLabel>Password</FormLabel>
              <Button variant={'link'} onClick={() => setMode("forgot-password")} className="text-sm text-muted-foreground font-normal">Forgot password?</Button>
              </div>
              <FormControl>
                <Input type="password" placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>)}
          />
            <Button className="w-full">{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Login"}</Button>
          </form>
          <div className="mt-4 flex text-sm justify-center items-center gap-2 ">

          <p>Don't have an account?</p>
          <Button variant={'link'} onClick={() => setMode("sign-up")} className="text-sm font-normal p-0">Sign up</Button>
          </div>
    </Form>
  )
}
