import { ChangelogList } from "@/components/changelog-list";
import { ThemeToggle } from "@/components/theme-toggle";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

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
        <div className="flex items-center gap-4">
          <Link href="/create-post" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:underline">
            New Post
          </Link>
          <ThemeToggle />
        </div>
      </div>
      <ChangelogList posts={posts} />
    </main>
  );
}
