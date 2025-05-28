"use client"



import { Input } from '../ui/input'

import { Button } from '../ui/button'
import {z} from "zod"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'

// const paswordValidator = new RegExp("^(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$")


const formSchema = z.object({
  fullname: z.string().min(3, {message: "Name must be at least 3 characters long"}),
  email: z.string().email({message: "Invalid email address"}),
  password: z.string({
    required_error: "Password is required"
  }).min(8, {message: "Password must be at least 8 characters long"}), //regex(paswordValidator, {message: "Password must contain at least one uppercase letter, one number and one special character"})
  confirmPassword: z.string({
    required_error: "Confirm password is required"
  })
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
})


export default function ForgotPasswordForm({setMode}: {setMode: (mode: string) => void}) {


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { 
      email: "",
    }
  })

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const validation = formSchema.safeParse(data)
    if (!validation.success) {
      console.log(validation.error)
    }

    console.log(validation.data)
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
          
            <Button className="w-full">Send Verification Code</Button>
          </form>
          <div className="mt-4 flex text-sm justify-center items-center gap-2 ">

          
          <Button variant={'link'} onClick={() => setMode("login")} className="text-sm font-normal p-0">Back to login</Button>
          </div>
    </Form>
  )
}
