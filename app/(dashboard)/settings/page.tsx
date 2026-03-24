'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Trash2, Shield, User as UserIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user)
          setName(data.user.name || '')
        }
      })
  }, [])

  const handleUpdateName = async () => {
    setLoading(true)
    // Implementation for updating name
    // ...
    setLoading(false)
    alert('Name updated successfully')
  }

  const handleDeleteAccount = async () => {
    if (confirm('Are you sure you want to delete your account? This action is permanent.')) {
      setLoading(true)
      const res = await fetch('/api/auth/delete-account', { method: 'DELETE' })
      if (res.ok) {
          localStorage.removeItem('isLoggedIn')
          router.push('/')
      }
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 min-h-screen bg-[#0A0A0A] p-8 space-y-8 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-zinc-500 mt-2">Manage your account and preferences.</p>
      </header>

      <div className="space-y-6">
        {/* Profile Settings */}
        <Card className="bg-[#0D0D0D] border-white/5 p-8 rounded-[32px]">
          <div className="flex items-center gap-3 mb-8">
            <UserIcon className="text-primary" size={20} />
            <h2 className="text-xl font-bold text-white">Profile Information</h2>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-zinc-400">Display Name</Label>
              <Input 
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
              />
            </div>
            
            <div className="space-y-2 opacity-50">
              <Label htmlFor="email" className="text-zinc-400">Email Address</Label>
              <Input 
                id="email"
                value={user?.email || ''}
                disabled
                className="bg-white/5 border-white/10 text-white h-12 rounded-xl cursor-not-allowed"
              />
            </div>

            <Button 
                onClick={handleUpdateName}
                disabled={loading}
                className="bg-white text-black hover:bg-zinc-200 px-8 py-5 rounded-xl font-bold transition-all active:scale-95"
            >
              Update Profile
            </Button>
          </div>
        </Card>

        {/* Security Settings */}
        <Card className="bg-[#0D0D0D] border-white/5 p-8 rounded-[32px]">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="text-primary" size={20} />
            <h2 className="text-xl font-bold text-white">Security</h2>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="pass" className="text-zinc-400">New Password</Label>
              <Input 
                id="pass"
                type="password"
                placeholder="••••••••"
                className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
              />
            </div>
            
            <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 px-8 py-5 rounded-xl font-bold transition-all active:scale-95">
              Change Password
            </Button>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="bg-red-500/5 border-red-500/10 p-8 rounded-[32px]">
          <div className="flex items-center gap-3 mb-4">
            <Trash2 className="text-red-500" size={20} />
            <h2 className="text-xl font-bold text-white">Danger Zone</h2>
          </div>
          <p className="text-zinc-500 text-sm mb-8">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          
          <Button 
            onClick={handleDeleteAccount}
            variant="ghost" 
            className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-8 py-6 rounded-xl font-bold transition-all active:scale-95"
          >
            Delete Account
          </Button>
        </Card>
      </div>
    </div>
  )
}
