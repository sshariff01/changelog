"use client";

import { useState } from "react";
import { ChangelogPost } from "./changelog-post";
import { Modal } from "./modal";

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

export function ChangelogList({ posts }: Props) {
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditClick = (postId: string) => {
    if (editingPostId && editingPostId !== postId) {
      setIsModalOpen(true);
    } else {
      setEditingPostId(postId);
    }
  };

  const handleSave = () => {
    // In a real app, you'd trigger a data refetch here
    setEditingPostId(null);
  };

  const handleCancel = () => {
    setEditingPostId(null);
  };

  return (
    <>
      <style>
        {`
          .theme-aware-modal-bg {
            background-color: #ffffff;
          }
          .dark .theme-aware-modal-bg {
            background-color: #262626;
          }
          .modal-title {
            color: #000000;
          }
          .dark .modal-title {
             color: #f4f4f5;
          }
          .modal-text {
            color: #374151;
          }
          .dark .modal-text {
            color: #d1d5db;
          }
          .modal-content-box {
            background-color: #ffffff;
            border: 1px solid #e5e7eb;
          }
          .dark .modal-content-box {
            background-color: #27272a;
            border: 1px solid #3f3f46;
          }
          .modal-title {
            color: #111827;
          }
          .dark .modal-title {
            color: #f9fafb;
          }
          .modal-text {
            color: #4b5563;
          }
          .dark .modal-text {
            color: #9ca3af;
          }
        `}
      </style>
      <div className="space-y-12">
        {posts.map((post) => (
          <ChangelogPost
            key={post.id}
            {...post}
            isEditing={editingPostId === post.id}
            onEdit={() => handleEditClick(post.id)}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        ))}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h3 className="modal-title text-lg font-medium">Edit In Progress</h3>
          <p className="modal-text text-sm mt-2">
            Please save or cancel your current changes before editing another post.
          </p>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-zinc-700 dark:text-gray-200 dark:hover:bg-zinc-600"
            >
              OK
            </button>
          </div>
        </Modal>
      </div>
    </>
  );
}
