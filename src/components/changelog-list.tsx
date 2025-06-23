"use client";

import { useState, useEffect } from "react";
import { ChangelogPost } from "./changelog-post";
import { Modal } from "./modal";
import { Toast, useToast } from "./toast";
import { createClient } from "@/lib/supabase/client";
import { useAdmin } from "@/lib/admin-context";
import { useEditing } from "@/lib/editing-context";
import { User } from "@supabase/supabase-js";

type Post = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  published_at: string;
};

type Props = {
  posts: Post[];
  user: User | null;
};

export function ChangelogList({ posts: initialPosts, user }: Props) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const { editingPostId, setEditingPostId, isConflictModalOpen, setConflictModalOpen } = useEditing();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingSave, setPendingSave] = useState<{
    id: string;
    title: string;
    content: string;
  } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const { toast, showToast, hideToast } = useToast();
  const { isAdmin } = useAdmin();

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (editingPostId) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [editingPostId]);

  useEffect(() => {
    const handlePopState = () => {
      if (editingPostId) {
        setConflictModalOpen(true);
        history.pushState(null, "", window.location.href);
      }
    };

    if (editingPostId) {
      history.pushState(null, "", window.location.href);
      window.addEventListener("popstate", handlePopState);
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [editingPostId, setConflictModalOpen]);

  const handleEditClick = (postId: string) => {
    if (editingPostId && editingPostId !== postId) {
      setConflictModalOpen(true);
    } else {
      setEditingPostId(postId);
    }
  };

  const handleSave = async (id: string, newTitle: string, newContent: string) => {
    setPendingSave({ id, title: newTitle, content: newContent });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (postId: string) => {
    setPendingDelete(postId);
    setIsModalOpen(true);
  };

  const confirmSave = async () => {
    if (!pendingSave) return;

    setIsSaving(true);
    setIsModalOpen(false);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("posts")
        .update({
          title: pendingSave.title,
          content: pendingSave.content,
          updated_at: new Date().toISOString()
        })
        .eq("id", pendingSave.id);

      if (error) {
        console.error("Failed to update post:", error.message);
        showToast("Failed to save changes. Please try again.", "error");
        return;
      }

      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === pendingSave.id
            ? { ...post, title: pendingSave.title, content: pendingSave.content }
            : post
        )
      );

      setEditingPostId(null);
      showToast("Changes saved successfully!", "success");
    } catch (error) {
      console.error("Error saving post:", error);
      showToast("An unexpected error occurred. Please try again.", "error");
    } finally {
      setIsSaving(false);
      setPendingSave(null);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;

    const originalPosts = [...posts];
    setPosts(prevPosts => prevPosts.filter(post => post.id !== pendingDelete));

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("posts")
        .update({ status: "deleted" })
        .eq("id", pendingDelete);

      if (error) {
        setPosts(originalPosts);
        console.error("Failed to delete post:", error.message);
        showToast("Failed to delete post. Please try again.", "error");
      } else {
        showToast("Post deleted successfully!", "success");
      }
    } catch (error) {
      setPosts(originalPosts);
      console.error("Error deleting post:", error);
      showToast("An unexpected error occurred. Please try again.", "error");
    } finally {
      setIsModalOpen(false);
      setPendingDelete(null);
    }
  };

  const cancelSave = () => {
    setIsModalOpen(false);
    setPendingSave(null);
  };

  const cancelDelete = () => {
    setIsModalOpen(false);
    setPendingDelete(null);
  };

  const handleCancel = () => {
    setEditingPostId(null);
  };

  const handleEditConflict = () => {
    setConflictModalOpen(false);
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
    <div className="space-y-12 mt-8">
      {posts.map((post) => (
          <ChangelogPost
            key={post.id}
            {...post}
            isEditing={editingPostId === post.id}
            isSaving={isSaving && editingPostId === post.id}
            isAdmin={isAdmin}
            user={user}
            onEdit={() => handleEditClick(post.id)}
            onSave={handleSave}
            onCancel={handleCancel}
            onDelete={() => handleDeleteClick(post.id)}
          />
      ))}
    </div>

      <Modal isOpen={isModalOpen || isConflictModalOpen} onClose={pendingSave ? cancelSave : pendingDelete ? cancelDelete : handleEditConflict}>
        {pendingSave ? (
          <>
            <h3 className="modal-title text-lg font-medium">Confirm Save</h3>
            <p className="modal-text text-sm mt-2">
              Are you sure you want to save these changes?
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={cancelSave}
                className="px-4 h-8 text-xs font-medium rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-zinc-700 dark:text-gray-200 dark:hover:bg-zinc-600 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmSave}
                className="px-4 h-8 text-xs font-medium rounded-full bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </>
        ) : pendingDelete ? (
          <>
            <h3 className="modal-title text-lg font-medium">Confirm Deletion</h3>
            <p className="modal-text text-sm mt-2">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={cancelDelete}
                className="px-4 h-8 text-xs font-medium rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-zinc-700 dark:text-gray-200 dark:hover:bg-zinc-600 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 h-8 text-xs font-medium rounded-full bg-red-600 text-white hover:bg-red-700 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 className="modal-title text-lg font-medium">Edit In Progress</h3>
            <p className="modal-text text-sm mt-2">
              Please save or cancel your current changes first.
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleEditConflict}
                className="px-4 h-8 text-xs font-medium rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-zinc-700 dark:text-gray-200 dark:hover:bg-zinc-600 cursor-pointer"
              >
                OK
              </button>
            </div>
          </>
        )}
      </Modal>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </>
  );
}
