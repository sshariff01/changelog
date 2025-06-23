"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { useAdmin } from "@/lib/admin-context";
import { useTheme } from "@/lib/theme-context";
import { UserAvatar } from "@/components/user-avatar";

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const { isAdmin } = useAdmin();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    if (!isAdmin) {
      router.push("/changelog");
    }
  }, [isAdmin, router]);

  useEffect(() => {
    async function getUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username, first_name, last_name")
          .eq("id", user.id)
          .single();

        setUser({ ...user, profile });
      }
    }

    getUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const supabase = createClient();
    const { error: insertError } = await supabase.from("posts").insert({
      title,
      content,
      tags: tags.split(",").map((tag) => tag.trim()),
      status: 'published',
    });

    setIsSubmitting(false);

    if (insertError) {
      setError(`Failed to create post: ${insertError.message}`);
    } else {
      setTitle("");
      setContent("");
      setTags("");
      router.push("/changelog");
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <style>
        {`
          /* Light Mode Form Styles */
          .create-post-form-input {
            background-color: #ffffff;
            border: 1px solid #000000;
            color: #000000;
          }
          .create-post-form-label {
            color: #000000;
          }

          /* Dark Mode Form Styles */
          .dark .create-post-form-input {
            background-color: #262626;
            border: 1px solid #52525b;
            color: #e5e5e5;
          }
          .dark .create-post-form-label {
            color: #d4d4d8;
          }

          /* Common styles */
           .create-post-form-input:focus {
             outline: 2px solid #3b82f6;
             border-color: transparent;
           }
        `}
      </style>
      <main className="container mx-auto py-8 max-w-2xl">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">New Post</h1>
          <div className="flex items-center gap-4">
            <Link
              href="/changelog"
              className={`group inline-flex items-center justify-center h-8 w-8 rounded-full overflow-hidden transition-all duration-300 ease-in-out border-2 hover:w-40 border-border hover:bg-muted text-foreground`}
            >
              <svg
                className="transition-transform duration-300 ease-in-out group-hover:-translate-x-1"
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              <span className="opacity-0 w-0 whitespace-nowrap transition-opacity duration-100 ease-in-out group-hover:opacity-100 group-hover:w-auto group-hover:ml-1.5 text-xs font-semibold">
                Back to Changelog
              </span>
            </Link>
            <ThemeToggle />
            <UserAvatar user={user} />
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
          <div>
            <label htmlFor="title" className="create-post-form-label block text-sm font-medium">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="create-post-form-input mt-1 block w-full rounded-md shadow-sm py-2 px-3"
              required
            />
          </div>
          <div>
            <label htmlFor="content" className="create-post-form-label block text-sm font-medium">
              Content (Markdown)
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="create-post-form-input mt-1 block w-full rounded-md shadow-sm py-2 px-3"
              required
            />
          </div>
          <div>
            <label htmlFor="tags" className="create-post-form-label block text-sm font-medium">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="create-post-form-input mt-1 block w-full rounded-md shadow-sm py-2 px-3"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-500 text-white h-10 px-4 text-sm font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating..." : "Create Post"}
            </button>
          </div>
          {error && <p className="text-red-500 mt-4 text-right">{error}</p>}
        </form>
      </main>
    </>
  );
}