'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Building2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeToggle } from '@/components/theme-toggle'
import { UserAvatar } from '@/components/user-avatar'
import { User as SupabaseUser } from '@supabase/supabase-js'

interface User extends SupabaseUser {
  profile?: {
    username?: string;
    first_name?: string;
    last_name?: string;
  } | null;
}

export default function CreateOrganizationPage() {
  const [name, setName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  // Get user data on component mount
  useEffect(() => {
    async function getUser() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, first_name, last_name')
          .eq('id', user.id)
          .single()

        setUser({
          ...user,
          profile: profile || null
        })
      }
    }

    getUser()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    if (!name.trim()) {
      setError('Organization name is required')
      setIsSubmitting(false)
      return
    }

    const supabase = createClient()

    try {
      // Create the organization
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert({ name: name.trim() })
        .select()
        .single()

      if (orgError) {
        throw orgError
      }

      // Add the user as an owner of the organization
      const { error: memberError } = await supabase
        .from('organization_members')
        .insert({
          organization_id: org.id,
          profile_id: user?.id,
          role: 'owner'
        })

      if (memberError) {
        throw memberError
      }

      // Redirect to the new organization's changelog
      router.push(`/changelog?org=${org.id}`)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create organization'
      setError(errorMessage)
      setIsSubmitting(false)
    }
  }

  return (
    <main className="container mx-auto py-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="group inline-flex items-center justify-center h-8 w-8 rounded-full overflow-hidden transition-all duration-300 ease-in-out border-2 hover:w-32 border-border hover:bg-muted text-foreground"
          >
            <ArrowLeft className="transition-transform duration-300 ease-in-out group-hover:-translate-x-1" />
            <span className="opacity-0 w-0 whitespace-nowrap transition-opacity duration-100 ease-in-out group-hover:opacity-100 group-hover:w-auto group-hover:ml-1.5 text-xs font-semibold">
              Back to Dashboard
            </span>
          </Link>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Changelog Hub</h1>
        </div>
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <UserAvatar user={user} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">
            Create Organization
          </h2>
          <p className="text-muted-foreground">
            Set up a new organization to start building changelogs with your team.
          </p>
        </div>

        <Card className="border-2 border-dashed">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">New Organization</CardTitle>
                <CardDescription>
                  Create a workspace for your team&apos;s changelogs
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Organization Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter organization name..."
                  className="w-full"
                  disabled={isSubmitting}
                />
                <p className="text-sm text-muted-foreground">
                  This will be the name of your organization and workspace.
                </p>
              </div>

              {error && (
                <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-md">
                  {error}
                </div>
              )}

              <div className="flex space-x-3">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? 'Creating...' : 'Create Organization'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/')}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Section */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What happens next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">1</span>
                </div>
                <div>
                  <h4 className="font-medium">Organization Created</h4>
                  <p className="text-sm text-muted-foreground">
                    Your organization will be created and you&apos;ll be set as the owner.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">2</span>
                </div>
                <div>
                  <h4 className="font-medium">Access Changelog</h4>
                  <p className="text-sm text-muted-foreground">
                    You&apos;ll be redirected to your organization&apos;s changelog where you can start creating posts.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">3</span>
                </div>
                <div>
                  <h4 className="font-medium">Invite Team Members</h4>
                  <p className="text-sm text-muted-foreground">
                    Invite your team members to collaborate on changelogs and posts.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}