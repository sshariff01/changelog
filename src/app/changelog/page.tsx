import { ChangelogList } from "@/components/changelog-list";
import { mockPosts } from "@/lib/mock-posts";

export default function ChangelogPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Changelog</h1>
      <ChangelogList posts={mockPosts} />
    </main>
  );
}
