'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Logo } from '@/components/logo'
import { ChevronRight, ArrowLeft, Gem } from 'lucide-react'
import Pricing from '@/components/pricing-3'

const roles = [
  'Solo professional',
  'Freelancer',
  'Team lead',
  'Business owner'
]

const teamSizes = [
  'Solo',
  '2-5',
  '6-20',
  '20+'
]

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    workspaceName: '',
    role: '',
    teamSize: '',
    plan: 'free'
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
    else handleSubmit()
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        localStorage.setItem('onboarded', 'true')
        router.push('/dashboard')
      } else {
        const data = await res.json()
        alert(data.error || 'Something went wrong')
      }
    } catch (error) {
      console.error('Onboarding submit error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4">
      <div className="mb-12">
        <Logo className="h-8 w-auto" />
      </div>

      <Card className={`w-full ${step === 4 ? 'max-w-6xl' : 'max-w-md'} bg-[#0D0D0D] border-white/5 p-8 rounded-3xl shadow-2xl overflow-hidden relative transition-all duration-500`}>
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 h-1 bg-white/5 w-full">
            <div 
                className="h-full bg-primary transition-all duration-500 ease-out" 
                style={{ width: `${(step / 4) * 100}%` }}
            />
        </div>

        <div className="space-y-6">
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-bold tracking-tight text-white mb-2">Create your workspace</h2>
              <p className="text-zinc-500 text-sm mb-6">This is where your projects and team will live.</p>
              
              <div className="space-y-2">
                <Label htmlFor="workspaceName" className="text-zinc-400">Workspace Name</Label>
                <Input 
                  id="workspaceName"
                  placeholder="e.g. Ali's Projects or Acme Team"
                  className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:ring-primary/20"
                  value={formData.workspaceName}
                  onChange={(e) => setFormData({ ...formData, workspaceName: e.target.value })}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-bold tracking-tight text-white mb-2">What's your role?</h2>
              <p className="text-zinc-500 text-sm mb-6">We'll personalize your experience based on what you do.</p>
              
              <div className="grid grid-cols-1 gap-3">
                {roles.map((role) => (
                  <button
                    key={role}
                    onClick={() => setFormData({ ...formData, role })}
                    className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 ${
                      formData.role === role 
                        ? 'border-primary bg-primary/5 text-white' 
                        : 'border-white/5 bg-white/5 text-zinc-400 hover:border-white/10 hover:bg-white/10'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-bold tracking-tight text-white mb-2">How big is your team?</h2>
              <p className="text-zinc-500 text-sm mb-6">Help us tailor the collaboration tools for you.</p>
              
              <div className="grid grid-cols-2 gap-3">
                {teamSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setFormData({ ...formData, teamSize: size })}
                    className={`text-center px-4 py-6 rounded-xl border transition-all duration-200 ${
                      formData.teamSize === size 
                        ? 'border-primary bg-primary/5 text-white' 
                        : 'border-white/5 bg-white/5 text-zinc-400 hover:border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="text-lg font-bold">{size}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
               <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
                    <Gem size={12} />
                    Tiered Intelligence
                </div>
                <h2 className="text-3xl font-black tracking-tight text-white mb-2">Select Your Strategy</h2>
                <p className="text-zinc-500 text-sm max-w-md mx-auto">All plans include a 3-day full access trial. Choose the velocity that fits your team.</p>
              </div>
              
              <div className="bg-[#0A0A0A]/50 rounded-3xl border border-white/5 overflow-hidden">
                <Pricing />
              </div>

              <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                 <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                    You can change your plan anytime from the billing dashboard.
                 </p>
              </div>
            </div>
          )}

          <div className="pt-8 flex items-center justify-between gap-4">
            {step > 1 ? (
              <Button 
                variant="ghost" 
                onClick={handleBack}
                className="text-zinc-500 hover:text-white hover:bg-white/5 px-6 rounded-xl"
              >
                <ArrowLeft className="mr-2 size-4" />
                Back
              </Button>
            ) : <div />}

            <Button 
              onClick={handleNext}
              disabled={loading || (step === 1 && !formData.workspaceName) || (step === 2 && !formData.role) || (step === 3 && !formData.teamSize)}
              className="bg-primary text-white hover:bg-primary/90 px-8 py-6 rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-95 ml-auto"
            >
              {loading ? 'Setting up...' : step === 4 ? 'Complete Setup' : 'Continue'}
              <ChevronRight className="ml-2 size-4" />
            </Button>
          </div>
        </div>
      </Card>
      
      <p className="mt-8 text-zinc-600 text-[10px] uppercase font-bold tracking-[0.2em]">
        Step {step} of 4
      </p>
    </div>
  )
}
