"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
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

  if(error) {
    return {
      success: false,
      error: error?.message,
      data: null
    }
  } else if (signUpData?.user?.identities?.length === 0) {
    return {
      success: false,
      error: 'User with email already exists',
      data: null
    }
  }

  revalidatePath("/dashboard", 'layout')
  return {
    success: true,
    error: null,
    data: signUpData
  }
}

export async function signInWithEmail(formData: FormData): Promise<AuthResponse> {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { data: signInData, error } = await supabase.auth.signInWithPassword(data);

  if(error) {
    return {
      success: false,
      error: error?.message,
      data: null
    }
  } 

  // create a new user in the database


}

export async function logoutUser(): Promise<void> {
  const supabase = await createClient();

  await supabase.auth.signOut();

  redirect("/login");
}
