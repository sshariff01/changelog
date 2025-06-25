'use client'

import { login } from './actions'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoadingModal } from '@/components/loading-modal'
import { useState, useRef, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface FormErrors {
  username?: string
  password?: string
  general?: string
  credentials?: string
}

function LoginForm() {
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showLoadingModal, setShowLoadingModal] = useState(false)
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const searchParams = useSearchParams()
  const router = useRouter()

  // Handle URL error parameters
  useEffect(() => {
    const error = searchParams.get('error')
    if (error === 'confirmation_failed') {
      setErrors({ general: 'Email confirmation failed. Please try again or contact support.' })
    }
  }, [searchParams])

  const handleSubmit = async (formData: FormData) => {
    setErrors({})
    setIsLoading(true)
    setShowLoadingModal(true)

    const result = await login(formData)

    if (result && 'error' in result) {
      setShowLoadingModal(false)
      setIsLoading(false)

      const { error: errorField, message, email } = result as { error: string; message: string; email?: string }
      if (errorField === 'unconfirmed') {
        setUnconfirmedEmail(email || null)
        return
      }
      if (errorField === 'credentials') {
        setErrors({ credentials: message })
      } else if (errorField === 'general') {
        setErrors({ general: message })
      } else {
        setErrors({ [errorField]: message })
      }
    }
  }

  const handleLoadingComplete = () => {
    router.push('/')
  }

  const getFieldError = (fieldName: string) => {
    return errors[fieldName as keyof FormErrors]
  }

  const isFieldInvalid = (fieldName: string) => {
    return !!getFieldError(fieldName) || !!errors.credentials
  }

  if (unconfirmedEmail) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-zinc-950">
        <Card className="mx-auto max-w-md w-full border-zinc-800/50 bg-zinc-900">
          <CardHeader className="pb-1">
            <CardTitle className="text-xl text-zinc-100">Email Not Confirmed</CardTitle>
            <CardDescription className="text-zinc-400">
              A confirmation code was sent to <span className="font-semibold">{unconfirmedEmail}</span>.<br />
              Please check your inbox and follow the instructions to verify your account.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <>
      <form ref={formRef} action={handleSubmit} className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="username" className="text-zinc-200">Username or Email</Label>
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

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-zinc-200">Password</Label>
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

        {errors.credentials && (
          <div className="text-sm text-red-400 bg-red-900/20 p-3 rounded-md">
            {errors.credentials}
          </div>
        )}

        {errors.general && (
          <div className="text-sm text-red-400 bg-red-900/20 p-3 rounded-md">
            {errors.general}
          </div>
        )}

        <div className="space-y-2 pt-2">
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Login'}
          </Button>
          <Button variant="outline" className="w-full border-zinc-700 bg-zinc-800 text-zinc-300 hover:bg-zinc-700" disabled>
            Login with Google
          </Button>
        </div>
      </form>

      <div className="mt-4 text-center text-sm text-zinc-400">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-blue-400 hover:text-blue-300 underline">
          Sign up
        </Link>
      </div>

      <LoadingModal
        isOpen={showLoadingModal}
        onComplete={handleLoadingComplete}
      />
    </>
  )
}

export default function LoginPage() {
  return (
    <div className="dark">
      <div className="flex items-center justify-center min-h-screen p-4 bg-zinc-950">
        <Card className="mx-auto max-w-md w-full border-zinc-800/50 bg-zinc-900">
          <CardHeader>
            <CardTitle className="text-2xl text-zinc-100">Login</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading...</div>}>
              <LoginForm />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}