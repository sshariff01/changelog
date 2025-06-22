import { ChangelogList } from "@/components/changelog-list";
import { ThemeToggle } from "@/components/theme-toggle";
import { supabase } from "@/lib/supabase";

async function getPosts() {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
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
    <main className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Changelog</h1>
        <ThemeToggle />
      </div>
      <ChangelogList posts={posts} />
    </main>
  );
}
