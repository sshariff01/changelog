"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AdminPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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

  return (
    <>
      <style>
        {`
          /* Light Mode Form Styles */
          .admin-form-input {
            background-color: #ffffff;
            border: 1px solid #000000;
            color: #000000;
          }
          .admin-form-label {
            color: #000000;
          }
          .admin-form-button {
            background-color: #000000;
            color: #ffffff;
          }
          .admin-form-button:hover {
            background-color: #333333;
          }

          /* Dark Mode Form Styles */
          .dark .admin-form-input {
            background-color: #262626; /* zinc-800/50 is tricky, using a solid color */
            border: 1px solid #52525b; /* zinc-700 */
            color: #e5e5e5; /* gray-200 */
          }
          .dark .admin-form-label {
            color: #d4d4d8; /* gray-300 */
          }
          .dark .admin-form-button {
            background-color: #f4f4f5; /* gray-100 */
            color: #18181b; /* gray-900 */
          }
          .dark .admin-form-button:hover {
            background-color: #e5e5e5; /* gray-200 */
          }

          /* Common styles */
           .admin-form-input:focus {
             outline: 2px solid #3b82f6; /* blue-500 */
             border-color: transparent;
           }
        `}
      </style>
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Admin Portal</h1>
          <ThemeToggle />
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="admin-form-label block text-sm font-medium">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="admin-form-input mt-1 block w-full rounded-md shadow-sm py-2 px-3"
              required
            />
          </div>
          <div>
            <label htmlFor="content" className="admin-form-label block text-sm font-medium">
              Content (Markdown)
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="admin-form-input mt-1 block w-full rounded-md shadow-sm py-2 px-3"
              required
            />
          </div>
          <div>
            <label htmlFor="tags" className="admin-form-label block text-sm font-medium">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="admin-form-input mt-1 block w-full rounded-md shadow-sm py-2 px-3"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="admin-form-button inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium shadow-sm disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create Post"}
          </button>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </form>
      </main>
    </>
  );
}