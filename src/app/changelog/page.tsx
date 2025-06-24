import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ChangelogClient } from './changelog-client'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function getChangelogData(orgId: string) {
  const supabase = await createClient()

  // Get organization details
  const { data: organization, error: orgError } = await supabase
    .from('organizations')
    .select('id, name, slug, logo_url')
    .eq('id', orgId)
    .single()

  if (orgError || !organization) {
    throw new Error('Organization not found')
  }

  // Get changelog for this organization
  const { data: changelog, error: changelogError } = await supabase
    .from('changelogs')
    .select('id, title, description')
    .eq('organization_id', orgId)
    .single()

  if (changelogError || !changelog) {
    throw new Error('Changelog not found')
  }

  // Get posts for this changelog
  const { data: posts, error: postsError } = await supabase
    .from('changelog_posts')
    .select(`
      id,
      title,
      content,
      type,
      created_at,
      published_at
    `)
    .eq('changelog_id', changelog.id)
    .order('published_at', { ascending: false })

  if (postsError) {
    console.error('Error fetching posts:', postsError)
    throw new Error('Failed to fetch changelog posts')
  }

  return {
    organization,
    changelog,
    posts: posts || []
  }
}

export default async function ChangelogPage({
  searchParams,
}: PageProps) {
  const params = await searchParams
  const orgId = params.org as string

  if (!orgId) {
    redirect('/')
  }

  try {
    const data = await getChangelogData(orgId)
    return <ChangelogClient {...data} />
  } catch (error) {
    console.error('Error loading changelog:', error)
    redirect('/')
  }
}
