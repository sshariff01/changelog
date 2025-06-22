"use client";

import { ChangelogList } from "@/components/changelog-list";
import { mockPosts } from "@/lib/mock-posts";
import { ThemeToggle } from "@/components/theme-toggle";

export default function ChangelogPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">Changelog</h1>
        <ThemeToggle />
      </div>
      <ChangelogList posts={mockPosts} />
    </main>
  );
}
