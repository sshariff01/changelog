"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createOrganization(formData: FormData) {
  const supabase = await createClient();

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error("You must be logged in to create an organization");
  }

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const logoFile = formData.get("logo") as File | null;

  if (!name || !slug) {
    throw new Error("Organization name and slug are required");
  }

  // Validate slug format
  if (!/^[a-z0-9-]+$/.test(slug)) {
    throw new Error("Slug can only contain lowercase letters, numbers, and hyphens");
  }

  // Check if slug is already taken
  const { data: existingOrg } = await supabase
    .from("organizations")
    .select("id")
    .eq("slug", slug)
    .single();

  if (existingOrg) {
    throw new Error("An organization with this slug already exists");
  }

  let logoUrl: string | null = null;

  // Upload logo if provided
  if (logoFile && logoFile.size > 0) {
    const fileExt = logoFile.name.split('.').pop();
    const fileName = `${slug}-logo-${Date.now()}.${fileExt}`;
    const filePath = `organization-logos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars') // Using existing bucket, you might want to create a dedicated bucket
      .upload(filePath, logoFile, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error("Error uploading logo:", uploadError);
      throw new Error("Failed to upload logo");
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    logoUrl = urlData.publicUrl;
  }

  // Create organization
  const { data: organization, error: orgError } = await supabase
    .from("organizations")
    .insert({
      name,
      slug,
      logo_url: logoUrl,
      created_by: user.id,
    })
    .select()
    .single();

  if (orgError) {
    console.error("Error creating organization:", orgError);
    throw new Error("Failed to create organization");
  }

  // Create changelog for the organization
  const { data: changelog, error: changelogError } = await supabase
    .from("changelogs")
    .insert({
      organization_id: organization.id,
      title: `${name} Changelog`,
      description: `Stay updated with the latest changes and improvements from ${name}`,
      created_by: user.id,
    })
    .select()
    .single();

  if (changelogError) {
    console.error("Error creating changelog:", changelogError);
    // Clean up the organization if we can't create the changelog
    await supabase.from("organizations").delete().eq("id", organization.id);
    throw new Error("Failed to create changelog for organization");
  }

  // Add user as owner
  const { error: memberError } = await supabase
    .from("organization_members")
    .insert({
      organization_id: organization.id,
      user_id: user.id,
      role: "owner",
    });

  if (memberError) {
    console.error("Error adding user as owner:", memberError);
    // Clean up the organization and changelog if we can't add the user
    await supabase.from("changelogs").delete().eq("id", changelog.id);
    await supabase.from("organizations").delete().eq("id", organization.id);
    throw new Error("Failed to add you as organization owner");
  }

  revalidatePath("/");
  return organization;
}

export async function getOrganizations() {
  const supabase = await createClient();

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error("You must be logged in");
  }

  const { data: organizations, error } = await supabase
    .from("organization_members")
    .select(`
      role,
      organizations (
        id,
        name,
        slug,
        logo_url,
        created_at
      )
    `)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error fetching organizations:", error);
    throw new Error("Failed to fetch organizations");
  }

  return organizations
    .map((member) => {
      const org = Array.isArray(member.organizations)
        ? member.organizations[0]
        : member.organizations;
      if (!org) return null;
      return {
        id: org.id,
        name: org.name,
        slug: org.slug,
        logo_url: org.logo_url,
        created_at: org.created_at,
        role: member.role,
      };
    })
    .filter(Boolean);
}