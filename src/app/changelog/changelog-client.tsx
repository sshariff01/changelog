"use client";

import { useState } from "react";
import { GitBranch, Plus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { AdminToggle } from "@/components/admin-toggle";
import { UserAvatar } from '@/components/user-avatar';
import { ChangelogPost } from "@/components/changelog-post";
import Link from 'next/link';

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url?: string | null;
}

interface Changelog {
  id: string;
  title: string;
  description: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  type: string;
  created_at: string;
  published_at: string;
}

interface ChangelogClientProps {
  organization: Organization;
  changelog: Changelog;
  posts: Post[];
}

export function ChangelogClient({ organization, changelog, posts }: ChangelogClientProps) {
  const [isAdmin] = useState(false);

  return (
    <>
      <header className="w-full border-b border-border bg-white dark:bg-black">
        <div className="container mx-auto max-w-6xl px-6 flex items-center justify-between py-4">
          <div className="flex items-center space-x-4">
            <Link href="/" className="cursor-pointer">
              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center border border-gray-300 dark:border-gray-600">
                <GitBranch className="w-5 h-5 text-gray-800 dark:text-white" />
              </div>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-zinc-700 dark:bg-zinc-600 rounded-lg flex items-center justify-center overflow-hidden">
                {organization.logo_url ? (
                  <img
                    src={organization.logo_url}
                    alt={`${organization.name} logo`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <GitBranch className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">{organization.name}</h1>
                <p className="text-sm text-muted-foreground">{changelog.title}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <AdminToggle />
            <ThemeToggle />
            <UserAvatar user={null} />
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-4xl px-6 py-8">
        {/* Changelog Description */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-semibold mb-2 text-foreground">
            {changelog.title}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {changelog.description}
          </p>
        </div>

        {/* Admin Controls */}
        {isAdmin && (
          <div className="mb-8 flex justify-center">
            <Button asChild>
              <Link href={`/create-post?org=${organization.id}`}>
                <Plus className="w-4 h-4 mr-2" />
                Create Post
              </Link>
            </Button>
          </div>
        )}

        {/* Posts */}
        <div className="space-y-6">
          {posts.length === 0 ? (
            <Card className="border-2 border-dashed border-border bg-gray-50 dark:bg-gray-800">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mb-4 border border-gray-200 dark:border-gray-700">
                  <Eye className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold mb-2 text-foreground">
                  No posts yet
                </h4>
                <p className="text-muted-foreground text-center mb-6 max-w-md">
                  This changelog doesn&apos;t have any posts yet. Check back soon for updates!
                </p>
                {isAdmin && (
                  <Button asChild>
                    <Link href={`/create-post?org=${organization.id}`}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Post
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <ChangelogPost
                key={post.id}
                id={post.id}
                title={post.title}
                content={post.content}
                tags={[]}
                published_at={post.published_at}
                isEditing={false}
                isAdmin={isAdmin}
                user={null}
                onEdit={() => {}}
                onSave={() => {}}
                onCancel={() => {}}
                onDelete={() => {}}
              />
            ))
          )}
        </div>
      </main>
    </>
  );
}