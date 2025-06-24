import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardClient } from './dashboard-client'

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url?: string | null;
  created_at: string;
  role: 'owner' | 'admin' | 'viewer';
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function getUserWithOrganizations() {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    return null
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('username, first_name, last_name')
    .eq('id', user.id)
    .single()

  // Get organizations where user is a member
  const { data: organizationMembers } = await supabase
    .from('organization_members')
    .select(`
      role,
      organizations (
        id,
        name,
        slug,
        created_at
      )
    `)
    .eq('user_id', user.id)

  const mappedOrganizations = (organizationMembers?.map((member) => {
    const org = Array.isArray(member.organizations)
      ? member.organizations[0]
      : member.organizations;
    if (!org) return null;
    return {
      id: org.id,
      name: org.name,
      slug: org.slug,
      created_at: org.created_at,
      role: member.role,
    };
  }).filter((org) => org !== null) as Organization[]) || [];

  return {
    user: { ...user, profile },
    organizations: mappedOrganizations
  }
}

export default async function HomePage({
  searchParams,
}: PageProps) {
  const supabase = await createClient()
  const params = await searchParams

  // Handle email confirmation
  if (params.code) {
    const { error } = await supabase.auth.exchangeCodeForSession(params.code as string)

    if (!error) {
      redirect('/')
    } else {
      console.error('Email confirmation failed:', error.message)
      redirect('/login?error=confirmation_failed')
    }
  }

  const userData = await getUserWithOrganizations()

  if (!userData) {
    redirect('/login')
  }

  const { user, organizations } = userData

  return <DashboardClient user={user} organizations={organizations} />
}
