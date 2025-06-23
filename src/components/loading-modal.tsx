'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'

interface LoadingModalProps {
  isOpen: boolean
  onComplete?: () => void
  operation?: 'login' | 'logout'
}

export function LoadingModal({ isOpen, onComplete, operation = 'login' }: LoadingModalProps) {
  const [stage, setStage] = useState<'loading' | 'success'>('loading')

  useEffect(() => {
    if (isOpen) {
      const loadingDuration = 2500; // 2.5s for both login and logout
      const successDuration = 2500; // 2.5s for both login and logout

      // Show loading for a minimum duration for better UX
      const timer = setTimeout(() => {
        setStage('success')
        // Give user time to see success message before redirect
        const redirectTimer = setTimeout(() => {
          onComplete?.()
        }, successDuration)
        return () => clearTimeout(redirectTimer)
      }, loadingDuration)

      return () => clearTimeout(timer)
    } else {
      setStage('loading')
    }
  }, [isOpen, onComplete, operation])

  if (!isOpen) return null

  const getLoadingMessage = () => {
    if (operation === 'logout') {
      return {
        title: 'Logging out...',
        description: 'Please wait while we securely log you out'
      }
    }
    return {
      title: 'Authenticating...',
      description: 'Please wait while we verify your credentials'
    }
  }

  const getSuccessMessage = () => {
    if (operation === 'logout') {
      return {
        title: 'Logout Successful!',
        description: 'Redirecting you to the login page...'
      }
    }
    return {
      title: 'Authentication Successful!',
      description: 'Redirecting you to your home page...'
    }
  }

  const loadingMsg = getLoadingMessage()
  const successMsg = getSuccessMessage()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

      {/* Modal */}
      <Card className="relative mx-4 max-w-sm w-full">
        <CardContent className="p-6 text-center">
          {stage === 'loading' ? (
            <>
              <div className="mb-4">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{loadingMsg.title}</h3>
              <p className="text-sm text-muted-foreground">
                {loadingMsg.description}
              </p>
            </>
          ) : (
            <>
              <div className="mb-4">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2 text-green-600">
                {successMsg.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {successMsg.description}
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}