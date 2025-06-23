import { ChangelogList } from "@/components/changelog-list";
import { ChangelogHeader } from "@/components/changelog-header";
import { createClient } from "@/lib/supabase/server";

async function getPosts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load posts:", error.message);
    return [];
  }

  return data;
}

async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // Get user profile information
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("username, first_name, last_name")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Failed to load user profile:", error.message);
    return user;
  }

  return { ...user, profile };
}

export default async function ChangelogPage() {
  const [posts, user] = await Promise.all([getPosts(), getUser()]);

  return (
    <main className="max-w-2xl mx-auto py-12 px-6">
      <ChangelogHeader user={user} />
      <ChangelogList posts={posts} />
    </main>
  );
}
