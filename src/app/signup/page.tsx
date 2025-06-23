'use client'

import { signup } from './actions'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoadingModal } from '@/components/loading-modal'
import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface FormErrors {
  first_name?: string
  last_name?: string
  username?: string
  email?: string
  password?: string
  general?: string
}

export default function SignupPage() {
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showLoadingModal, setShowLoadingModal] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()

  const handleSubmit = async (formData: FormData) => {
    setErrors({})
    setIsLoading(true)
    setShowLoadingModal(true)

    const result = await signup(formData)

    if (result && 'error' in result) {
      setShowLoadingModal(false)
      setIsLoading(false)
      const { error: errorField, message } = result as { error: string; message: string }
      setErrors({ [errorField]: message })
    }
  }

  const handleLoadingComplete = () => {
    router.push('/changelog')
  }

  const getFieldError = (fieldName: string) => {
    return errors[fieldName as keyof FormErrors]
  }

  const isFieldInvalid = (fieldName: string) => {
    return !!getFieldError(fieldName)
  }

  return (
    <div className="dark">
      <div className="flex items-center justify-center min-h-screen p-4 bg-zinc-950">
        <Card className="mx-auto max-w-md w-full border-zinc-800/50 bg-zinc-900">
          <CardHeader className="pb-1">
            <CardTitle className="text-xl text-zinc-100">Sign Up</CardTitle>
            <CardDescription className="text-zinc-400">
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errors.general && (
              <div className="text-sm text-red-400 bg-red-900/20 p-3 rounded-md mb-3">
                {errors.general}
              </div>
            )}
            <form ref={formRef} action={handleSubmit} className="space-y-2">
              <div className="space-y-2">
                <Label htmlFor="first_name" className="text-zinc-200">First Name</Label>
                <div className="space-y-1">
                  <Input
                    id="first_name"
                    name="first_name"
                    required
                    className={`bg-zinc-800 border-zinc-700 text-zinc-100 ${isFieldInvalid('first_name') ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
                  />
                  <div className="min-h-[16px]">
                    {getFieldError('first_name') && (
                      <p className="text-sm text-red-400">
                        {getFieldError('first_name')}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name" className="text-zinc-200">Last Name</Label>
                <div className="space-y-1">
                  <Input
                    id="last_name"
                    name="last_name"
                    required
                    className={`bg-zinc-800 border-zinc-700 text-zinc-100 ${isFieldInvalid('last_name') ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
                  />
                  <div className="min-h-[16px]">
                    {getFieldError('last_name') && (
                      <p className="text-sm text-red-400">
                        {getFieldError('last_name')}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username" className="text-zinc-200">Username</Label>
                <div className="space-y-1">
                  <Input
                    id="username"
                    name="username"
                    required
                    className={`bg-zinc-800 border-zinc-700 text-zinc-100 ${isFieldInvalid('username') ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
                  />
                  <div className="min-h-[16px]">
                    {getFieldError('username') && (
                      <p className="text-sm text-red-400">
                        {getFieldError('username')}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-zinc-200">Email</Label>
                <div className="space-y-1">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className={`bg-zinc-800 border-zinc-700 text-zinc-100 ${isFieldInvalid('email') ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
                  />
                  <div className="min-h-[16px]">
                    {getFieldError('email') && (
                      <p className="text-sm text-red-400">
                        {getFieldError('email')}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-200">Password</Label>
                <div className="space-y-1">
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className={`bg-zinc-800 border-zinc-700 text-zinc-100 ${isFieldInvalid('password') ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'}`}
                  />
                  <div className="min-h-[16px]">
                    {getFieldError('password') && (
                      <p className="text-sm text-red-400">
                        {getFieldError('password')}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Create an account'}
                </Button>
                <Button variant="outline" className="w-full border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700" disabled>
                  Sign up with Google
                </Button>
              </div>
            </form>
            <div className="text-center text-sm text-zinc-400 mt-6">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <LoadingModal
        isOpen={showLoadingModal}
        onComplete={handleLoadingComplete}
      />
    </div>
  )
}