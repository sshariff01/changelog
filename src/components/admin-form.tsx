"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Post = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  published_at: string;
};

type Props = {
  posts: Post[];
};

export function AdminForm({ posts }: Props) {
  const router = useRouter();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  const handleSelectPost = (post: Post) => {
    setSelectedPost(post);
    setTitle(post.title);
    setContent(post.content);
    setTags(post.tags.join(", "));
  };

  const handleNewPost = () => {
    setSelectedPost(null);
    setTitle("");
    setContent("");
    setTags("");
  };

  const handleSave = async () => {
    const postData = {
      title,
      content,
      tags: tags.split(",").map((t) => t.trim()),
      published_at: new Date().toISOString(),
    };

    if (selectedPost) {
      // Update existing post
      const { error } = await supabase
        .from("posts")
        .update(postData)
        .eq("id", selectedPost.id);

      if (error) {
        console.error("Failed to update post:", error.message);
        return;
      }
    } else {
      // Create new post
      const { error } = await supabase.from("posts").insert(postData);

      if (error) {
        console.error("Failed to create post:", error.message);
        return;
      }
    }

    handleNewPost(); // Reset form
    router.refresh(); // Refresh the page to show the new/updated post
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button onClick={handleNewPost} className="font-bold">New Post</button>
      </div>

      <ul className="space-y-2 mb-8">
        {posts.map((post) => (
          <li key={post.id} className="flex justify-between items-center">
            <span>{post.title}</span>
            <button onClick={() => handleSelectPost(post)}>Edit</button>
          </li>
        ))}
      </ul>

      <div className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border"
        />
        <textarea
          placeholder="Content (Markdown)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border h-64"
        />
        <input
          type="text"
          placeholder="Tags (comma-separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full p-2 border"
        />
        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            className="inline-flex justify-center items-center gap-2 px-6 h-10 text-sm font-semibold rounded-full transition-all border-transparent bg-blue-600 text-white hover:bg-blue-700"
          >
            {selectedPost ? "Save Changes" : "Create Post"}
          </button>
          <button
            onClick={handleNewPost}
            className="inline-flex justify-center items-center gap-2 px-6 h-10 text-sm font-semibold rounded-full transition-all border-transparent bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-zinc-700 dark:text-gray-200 dark:hover:bg-zinc-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
