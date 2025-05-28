"use client";

import { Input } from "../ui/input";

import { Button } from "../ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useId, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { signUpNewUser } from "@/app/actions/auth-actions";
import { useRouter } from "next/navigation";

// const paswordValidator = new RegExp("^(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$")

const formSchema = z
  .object({
    fullname: z.string().min(3, { message: "Name must be at least 3 characters long" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(8, { message: "Password must be at least 8 characters long" }), //regex(paswordValidator, {message: "Password must contain at least one uppercase letter, one number and one special character"})
    confirmPassword: z.string({
      required_error: "Confirm password is required",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function RegisterForm({ setMode }: { setMode: (mode: string) => void }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toasId = useId();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    toast.loading("Signing up...", { id: toasId });
    setLoading(true);

    const validation = formSchema.safeParse(data);
    if (!validation.success) {
      console.log(validation.error);
    }
    const validatedData = validation?.data;

    console.log(validatedData);

    const formData = new FormData();
    formData.append("fullname", validatedData?.fullname || "");
    formData.append("email", validatedData?.email || "");
    formData.append("password", validatedData?.password || "");

    const { success, error } = await signUpNewUser(formData);
    if (!success) {
      toast.error(error || "Something went wrong", { id: toasId });
      setLoading(false);
    } else {
      toast.success("Account created successfully, please verify your email", { id: toasId });
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoading(false);
      router.push("/login");
    }
    setLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <FormField
          control={form.control}
          name="fullname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your fullname" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>

              <FormControl>
                <Input type="password" placeholder="Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>

              <FormControl>
                <Input type="password" placeholder="Confirm Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" disabled={loading}>
          {loading ? <Loader2 className="animate-spin text-blue-500" size={16} /> : "Sign up"}
        </Button>
      </form>
      <div className="mt-4 flex items-center justify-center gap-2 text-sm">
        <p>Already have an account?</p>
        <Button variant={"link"} onClick={() => setMode("login")} className="p-0 text-sm font-normal">
          Sign up
        </Button>
      </div>
    </Form>
  );
}
