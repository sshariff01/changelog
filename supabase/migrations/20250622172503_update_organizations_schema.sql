-- Update organizations table to add logo_url and slug
ALTER TABLE organizations
ADD COLUMN logo_url TEXT,
ADD COLUMN slug TEXT UNIQUE,
ADD COLUMN created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Update organization_members to use user_id instead of profile_id
ALTER TABLE organization_members
DROP CONSTRAINT organization_members_pkey,
DROP CONSTRAINT organization_members_profile_id_fkey;

ALTER TABLE organization_members
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
ADD CONSTRAINT organization_members_pkey PRIMARY KEY (organization_id, user_id);

-- Migrate existing data if any
UPDATE organization_members
SET user_id = profile_id
WHERE user_id IS NULL;

-- Remove the old profile_id column
ALTER TABLE organization_members
DROP COLUMN profile_id;

-- Update role constraint to include 'admin' and 'viewer'
ALTER TABLE organization_members
DROP CONSTRAINT organization_members_role_check;

ALTER TABLE organization_members
ADD CONSTRAINT organization_members_role_check
CHECK (role IN ('owner', 'admin', 'viewer'));

-- Create changelogs table
CREATE TABLE changelogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create changelog_posts table
CREATE TABLE changelog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  changelog_id UUID NOT NULL REFERENCES changelogs(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'feature',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Add indexes for better performance
CREATE INDEX idx_organizations_slug ON organizations(slug);
CREATE INDEX idx_organization_members_user_id ON organization_members(user_id);
CREATE INDEX idx_changelogs_organization_id ON changelogs(organization_id);
CREATE INDEX idx_changelog_posts_changelog_id ON changelog_posts(changelog_id);
CREATE INDEX idx_changelog_posts_published_at ON changelog_posts(published_at);

-- Add RLS policies for organizations
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE changelogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE changelog_posts ENABLE ROW LEVEL SECURITY;

-- Organizations: Users can see organizations they're members of
CREATE POLICY "Users can view organizations they're members of" ON organizations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_id = organizations.id
      AND user_id = auth.uid()
    )
  );

-- Organizations: Organization owners can update their organizations
CREATE POLICY "Organization owners can update organizations" ON organizations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_id = organizations.id
      AND user_id = auth.uid()
      AND role = 'owner'
    )
  );

-- Organization members: Users can see members of organizations they're in
CREATE POLICY "Users can view members of their organizations" ON organization_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM organization_members om2
      WHERE om2.organization_id = organization_members.organization_id
      AND om2.user_id = auth.uid()
    )
  );

-- Changelogs: Users can view changelogs of organizations they're members of
CREATE POLICY "Users can view changelogs of their organizations" ON changelogs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM organization_members
      WHERE organization_id = changelogs.organization_id
      AND user_id = auth.uid()
    )
  );

-- Changelog posts: Users can view published posts
CREATE POLICY "Users can view published changelog posts" ON changelog_posts
  FOR SELECT USING (status = 'published');

-- Changelog posts: Organization admins/owners can manage posts
CREATE POLICY "Organization admins can manage changelog posts" ON changelog_posts
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM organization_members om
      JOIN changelogs c ON c.organization_id = om.organization_id
      WHERE c.id = changelog_posts.changelog_id
      AND om.user_id = auth.uid()
      AND om.role IN ('owner', 'admin')
    )
  );