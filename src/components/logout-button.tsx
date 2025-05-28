
import { logoutUser } from '@/app/actions/auth-actions'
import React from 'react'
import { Button } from './ui/button'
import { LogOut } from 'lucide-react'
import { redirect } from 'next/navigation'

export default function LogoutButton() {

    const handleLogout = async () => {
        await logoutUser()
        redirect('/login')
    }

  return (
    <Button  className="text-red-500 border-red-600 hover:text-red-500 hover:bg-red-500/30 bg-inherit flex items-center justify-start gap-2 w-full" onClick={handleLogout}>
        <LogOut className='text-red-500' />
        Logout
    </Button>
  )
}
