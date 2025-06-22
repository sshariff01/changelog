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
      status: 'published',
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
            <Link
              href="/changelog"
              className="group inline-flex items-center justify-center h-8 w-8 rounded-full overflow-hidden transition-all duration-300 ease-in-out bg-gray-200 text-gray-800 hover:w-40 hover:bg-gray-300 dark:bg-zinc-700 dark:text-gray-200 dark:hover:bg-zinc-600"
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
            className="inline-flex justify-center items-center gap-2 px-6 h-10 text-sm font-semibold rounded-full transition-all border border-blue-500/50 bg-blue-100 text-blue-600 hover:bg-blue-200 dark:border-blue-400 dark:bg-transparent dark:text-blue-400 dark:hover:bg-blue-400 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating..." : "Create Post"}
          </button>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </form>
      </main>
    </>
  );
}