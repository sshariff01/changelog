"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { useAdmin } from "@/lib/admin-context";

export default function CreatePostPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { isAdmin } = useAdmin();

  useEffect(() => {
    if (!isAdmin) {
      router.push("/changelog");
    }
  }, [isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const { error: insertError } = await supabase.from("posts").insert({
      title,
      content,
      tags: tags.split(",").map((tag) => tag.trim()),
    });

    setIsSubmitting(false);

    if (insertError) {
      setError(`Failed to create post: ${insertError.message}`);
    } else {
      setTitle("");
      setContent("");
      setTags("");
      // Redirect to the changelog page to see the new post
      router.push("/changelog");
    }
  };

  // Render nothing or a loading spinner while redirecting
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
            background-color: #262626; /* zinc-800/50 is tricky, using a solid color */
            border: 1px solid #52525b; /* zinc-700 */
            color: #e5e5e5; /* gray-200 */
          }
          .dark .create-post-form-label {
            color: #d4d4d8; /* gray-300 */
          }

          /* Common styles */
           .create-post-form-input:focus {
             outline: 2px solid #3b82f6; /* blue-500 */
             border-color: transparent;
           }
        `}
      </style>
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">New Post</h1>
          <div className="flex items-center gap-4">
            <Link href="/changelog" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:underline">
              Changelog
            </Link>
            <ThemeToggle />
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
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
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center items-center gap-2 px-4 h-8 text-xs font-medium rounded-full transition-colors border cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-blue-600 text-white hover:bg-blue-700 border-transparent dark:border-blue-400 dark:bg-transparent dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-white"
          >
            {isSubmitting ? "Creating..." : "Create Post"}
          </button>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </form>
      </main>
    </>
  );
}