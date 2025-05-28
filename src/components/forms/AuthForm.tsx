'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useState } from "react"
import LoginForm from "./LoginForm"

import ForgotPasswordForm from "./ForgotPasswordForm"
import { useSearchParams } from "next/navigation"
import RegisterForm from "./RegisterForm"

export default function AuthForm({

  
}) {

  const searchParams = useSearchParams()
  const mode = searchParams.get('mode') || 'login'

  const setMode = (mode: string) => {
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set('mode', mode)
    window.history.pushState(null, '', `?${newSearchParams.toString()}`)
  }


 
  return (
    <div className="w-96">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{mode === 'login' ? 'Login' : mode === 'sign-up' ? 'Sign up' : 'Forgot Password'}</CardTitle>
          <CardDescription>
            {mode === 'login' ? 'Login to your account to continue' : mode === 'sign-up' ? 'Create an account to continue' : 'Enter your email to reset your password'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {mode === 'login' ? <LoginForm setMode={setMode}/> : mode === 'sign-up' ? <RegisterForm setMode={setMode} /> : <ForgotPasswordForm setMode={setMode} />}
        </CardContent>
      </Card>
    </div>
  )
}
