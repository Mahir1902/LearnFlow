"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
type AuthResponse = {
  error: null | string;
  success: boolean;
  data: unknown | null;
};

export async function signUpNewUser(formData: FormData): Promise<AuthResponse> {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      data: {
        fullname: formData.get("fullname") as string,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  };

  const { data: signUpData, error } = await supabase.auth.signUp(data);

  console.log(signUpData);
  console.log(error);

  return {
    error: error?.message || "Something went wrong with sign up",
    success: !error,
    data: signUpData || null,
  };
}


export async function signInWithEmail(formData: FormData): Promise<AuthResponse> {

  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const { data: signInData, error } = await supabase.auth.signInWithPassword(data)

  console.log(signInData)
  console.log(error)

  return {
    error: error?.message || "Something went wrong with logging in",
    success: !error,
    data: signInData || null,
  }
}

export async function logoutUser(): Promise<void> {
  const supabase = await createClient();

  await supabase.auth.signOut();

  redirect("/login");
}
