import { ChangelogList } from "@/components/changelog-list";
import { ChangelogHeader } from "@/components/changelog-header";
import { supabase } from "@/lib/supabase";

async function getPosts() {
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

export default async function ChangelogPage() {
  const posts = await getPosts();

  return (
    <main className="max-w-2xl mx-auto py-8 px-4 md:px-0 md:py-12">
      <ChangelogHeader />
      <ChangelogList posts={posts} />
    </main>
  );
}
