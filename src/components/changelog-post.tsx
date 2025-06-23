"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeHighlight from "rehype-highlight";
import { useEffect, useState } from "react";
import { useTheme } from "@/lib/theme-context";
import { User } from "@supabase/supabase-js";

type Props = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  published_at: string;
  isEditing: boolean;
  isSaving?: boolean;
  isAdmin: boolean;
  user: User | null;
  onEdit: () => void;
  onSave: (id: string, newTitle: string, newContent: string) => void;
  onCancel: () => void;
  onDelete: () => void;
};

// Custom hook for dynamic syntax highlighting themes
function useSyntaxHighlighting() {
  const { theme } = useTheme();

  useEffect(() => {
    // Remove existing highlight.js style tags
    const existingStyles = document.querySelectorAll('style[data-highlight-theme]');
    existingStyles.forEach(style => style.remove());

    // Create a new style tag for the appropriate theme
    const style = document.createElement('style');
    style.setAttribute('data-highlight-theme', theme);

    // Import the appropriate CSS content
    if (theme === 'dark') {
      // Dracula theme (dark) - vibrant colors on dark background
      style.textContent = `
        /* General markdown styles */
        .markdown-content h1, .markdown-content h2, .markdown-content h3, .markdown-content h4, .markdown-content h5, .markdown-content h6 {
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
        }
        .markdown-content h1 { font-size: 2rem; }
        .markdown-content h2 { font-size: 1.5rem; }
        .markdown-content h3 { font-size: 1.25rem; }
        .markdown-content p { margin-bottom: 1rem; }
        .markdown-content ul, .markdown-content ol {
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .markdown-content ul { list-style-type: disc; }
        .markdown-content ol { list-style-type: decimal; }
        .markdown-content li { margin-bottom: 0.25rem; }
        .markdown-content a { color: #60a5fa; text-decoration: underline; }
        .markdown-content blockquote {
          border-left: 4px solid #44475a;
          padding-left: 1rem;
          margin-left: 0;
          font-style: italic;
          color: #a9a9a9;
        }

        /* Code block container */
        pre {
          background: #282a36 !important;
          border-radius: 8px !important;
          padding: 16px !important;
          margin: 16px 0 !important;
          overflow-x: auto !important;
          border: 1px solid #44475a !important;
        }

        /* Code block content */
        pre code {
          background: transparent !important;
          padding: 0 !important;
          border-radius: 0 !important;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
          font-size: 14px !important;
          line-height: 1.5 !important;
        }

        /* Syntax highlighting */
        .hljs {
          color: #f8f8f2 !important;
          background: transparent !important;
          display: block !important;
          width: 100% !important;
        }
        .hljs-keyword {
          color: #ff79c6 !important;
        }
        .hljs-string {
          color: #f1fa8c !important;
        }
        .hljs-comment {
          color: #6272a4 !important;
          font-style: italic !important;
        }
        .hljs-number {
          color: #bd93f9 !important;
        }
        .hljs-function {
          color: #50fa7b !important;
        }
        .hljs-params {
          color: #f8f8f2 !important;
        }
        .hljs-title {
          color: #50fa7b !important;
        }
        .hljs-built_in {
          color: #8be9fd !important;
        }
        .hljs-literal {
          color: #bd93f9 !important;
        }
        .hljs-type {
          color: #8be9fd !important;
        }
        .hljs-attr {
          color: #50fa7b !important;
        }
        .hljs-tag {
          color: #ff79c6 !important;
        }
        .hljs-name {
          color: #ff79c6 !important;
        }
        .hljs-attribute {
          color: #50fa7b !important;
        }
        .hljs-value {
          color: #f1fa8c !important;
        }
        .hljs-regexp {
          color: #ff5555 !important;
        }
        .hljs-symbol {
          color: #f1fa8c !important;
        }
        .hljs-variable {
          color: #f8f8f2 !important;
        }
        .hljs-selector-tag {
          color: #ff79c6 !important;
        }
        .hljs-selector-id {
          color: #50fa7b !important;
        }
        .hljs-selector-class {
          color: #50fa7b !important;
        }
        .hljs-selector-attr {
          color: #50fa7b !important;
        }
        .hljs-selector-pseudo {
          color: #ff79c6 !important;
        }
        .hljs-addition {
          color: #50fa7b !important;
          background-color: #44475a !important;
        }
        .hljs-deletion {
          color: #ff5555 !important;
          background-color: #44475a !important;
        }
        .hljs-meta {
          color: #6272a4 !important;
        }
        .hljs-emphasis {
          font-style: italic !important;
        }
        .hljs-strong {
          font-weight: bold !important;
        }
        .edit-button-save {
          background-color: #2563eb; /* blue-600 */
          color: white;
        }
        .edit-button-save:hover {
          background-color: #1d4ed8; /* blue-700 */
        }
        .edit-button-cancel {
          background-color: #e5e7eb; /* gray-200 */
          color: #1f2937; /* gray-800 */
        }
        .edit-button-cancel:hover {
           background-color: #d1d5db; /* gray-300 */
        }
        .dark .edit-button-cancel {
          background-color: #3f3f46; /* zinc-700 */
          color: #e5e7eb; /* gray-200 */
        }
        .dark .edit-button-cancel:hover {
          background-color: #52525b; /* zinc-600 */
        }
        .date-badge {
          background-color: #374151;
          color: white;
        }
        .dark .date-badge {
          background-color: #1e3a8a;
          color: #93c5fd;
        }
      `;
    } else {
      // Monokai theme (light) - vibrant colors on light background
      style.textContent = `
        /* General markdown styles */
        .markdown-content h1, .markdown-content h2, .markdown-content h3, .markdown-content h4, .markdown-content h5, .markdown-content h6 {
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
        }
        .markdown-content h1 { font-size: 2rem; }
        .markdown-content h2 { font-size: 1.5rem; }
        .markdown-content h3 { font-size: 1.25rem; }
        .markdown-content p { margin-bottom: 1rem; }
        .markdown-content ul, .markdown-content ol {
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .markdown-content ul { list-style-type: disc; }
        .markdown-content ol { list-style-type: decimal; }
        .markdown-content li { margin-bottom: 0.25rem; }
        .markdown-content a { color: #3b82f6; text-decoration: underline; }
        .markdown-content blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1rem;
          margin-left: 0;
          font-style: italic;
          color: #6b7280;
        }

        /* Code block container */
        pre {
          background: #fafafa !important;
          border-radius: 8px !important;
          padding: 16px !important;
          margin: 16px 0 !important;
          overflow-x: auto !important;
          border: 1px solid #e1e4e8 !important;
        }

        /* Code block content */
        pre code {
          background: transparent !important;
          padding: 0 !important;
          border-radius: 0 !important;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
          font-size: 14px !important;
          line-height: 1.5 !important;
        }

        /* Syntax highlighting */
        .hljs {
          color: #272822 !important;
          background: transparent !important;
          display: block !important;
          width: 100% !important;
        }
        .hljs-keyword {
          color: #f92672 !important;
        }
        .hljs-string {
          color: #e6db74 !important;
        }
        .hljs-comment {
          color: #75715e !important;
          font-style: italic !important;
        }
        .hljs-number {
          color: #ae81ff !important;
        }
        .hljs-function {
          color: #a6e22e !important;
        }
        .hljs-params {
          color: #272822 !important;
        }
        .hljs-title {
          color: #a6e22e !important;
        }
        .hljs-built_in {
          color: #66d9ef !important;
        }
        .hljs-literal {
          color: #ae81ff !important;
        }
        .hljs-type {
          color: #66d9ef !important;
        }
        .hljs-attr {
          color: #a6e22e !important;
        }
        .hljs-tag {
          color: #f92672 !important;
        }
        .hljs-name {
          color: #f92672 !important;
        }
        .hljs-attribute {
          color: #a6e22e !important;
        }
        .hljs-value {
          color: #e6db74 !important;
        }
        .hljs-regexp {
          color: #fd971f !important;
        }
        .hljs-symbol {
          color: #e6db74 !important;
        }
        .hljs-variable {
          color: #272822 !important;
        }
        .hljs-selector-tag {
          color: #f92672 !important;
        }
        .hljs-selector-id {
          color: #a6e22e !important;
        }
        .hljs-selector-class {
          color: #a6e22e !important;
        }
        .hljs-selector-attr {
          color: #a6e22e !important;
        }
        .hljs-selector-pseudo {
          color: #f92672 !important;
        }
        .hljs-addition {
          color: #a6e22e !important;
          background-color: #e6ffed !important;
        }
        .hljs-deletion {
          color: #f92672 !important;
          background-color: #ffeef0 !important;
        }
        .hljs-meta {
          color: #75715e !important;
        }
        .hljs-emphasis {
          font-style: italic !important;
        }
        .hljs-strong {
          font-weight: bold !important;
        }
        .edit-button-save {
          background-color: #2563eb; /* blue-600 */
          color: white;
        }
        .edit-button-save:hover {
          background-color: #1d4ed8; /* blue-700 */
        }
        .edit-button-cancel {
          background-color: #e5e7eb; /* gray-200 */
          color: #1f2937; /* gray-800 */
        }
        .edit-button-cancel:hover {
           background-color: #d1d5db; /* gray-300 */
        }
        .dark .edit-button-cancel {
          background-color: #3f3f46; /* zinc-700 */
          color: #e5e7eb; /* gray-200 */
        }
        .dark .edit-button-cancel:hover {
          background-color: #52525b; /* zinc-600 */
        }
        .date-badge {
          background-color: #dbeafe;
          color: #1e40af;
        }
        .dark .date-badge {
          background-color: #1e3a8a;
          color: #93c5fd;
        }
      `;
    }

    document.head.appendChild(style);

    // Cleanup function
    return () => {
      style.remove();
    };
  }, [theme]);
}

export function ChangelogPost({
  id,
  title,
  content,
  tags,
  published_at,
  isEditing,
  isSaving,
  isAdmin,
  user,
  onEdit,
  onSave,
  onCancel,
  onDelete,
}: Props) {
  useSyntaxHighlighting();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [editableTitle, setEditableTitle] = useState(title);
  const [editableContent, setEditableContent] = useState(content);
  const [isPreviewing, setIsPreviewing] = useState(false);

  const date = new Date(published_at);
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const handleSave = () => {
    // TODO: Implement actual save logic to the database
    console.log("Saving:", { id, title: editableTitle, content: editableContent });
    onSave(id, editableTitle, editableContent);
  };

  const handleCancel = () => {
    setEditableTitle(title);
    setEditableContent(content);
    onCancel();
  };

  return (
    <>
    <style>
      {`
        .date-badge {
          background-color: #dbeafe;
          color: #1e40af;
        }
        .dark .date-badge {
          background-color: #1e3a8a;
          color: #93c5fd;
        }
      `}
    </style>
    <article
      className={`relative group rounded-xl py-6 transition-colors duration-300 ${
        isEditing
          ? ""
          : ""
      }`}
    >
      {isEditing ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <div className="date-badge text-xs font-semibold px-2.5 py-1 rounded-full inline-block">{formattedDate}</div>
            <button
              onClick={handleCancel}
              className={`px-4 h-8 text-xs font-semibold rounded-full cursor-pointer border-[1.5px] transition-colors ${
                isDark
                  ? "border-gray-600 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:border-gray-500"
                  : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:border-gray-300"
              }`}
            >
              Cancel
            </button>
          </div>
          {isPreviewing ? (
            <h2 className="text-2xl font-semibold w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none bg-transparent py-1">
              {editableTitle}
            </h2>
          ) : (
            <input
              type="text"
              value={editableTitle}
              onChange={(e) => setEditableTitle(e.target.value)}
              className="text-2xl font-semibold w-full border-b-2 border-gray-300 focus:border-blue-500 outline-none bg-transparent"
            />
          )}

          {isPreviewing ? (
            <div className="markdown-content mt-4">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeHighlight]}
              >
                {editableContent}
              </ReactMarkdown>
            </div>
          ) : (
            <textarea
              value={editableContent}
              onChange={(e) => setEditableContent(e.target.value)}
              rows={10}
              className="w-full border rounded-md p-2 bg-transparent"
            />
          )}

          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsPreviewing(!isPreviewing)}
              className={`px-4 h-8 text-xs font-semibold rounded-full cursor-pointer border-[1.5px] transition-colors ${
                isDark
                  ? "border-gray-600 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:border-gray-500"
                  : "border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:border-gray-300"
              }`}
            >
              {isPreviewing ? "Edit" : "Preview"}
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`px-4 h-8 text-xs font-semibold rounded-full cursor-pointer border-[1.5px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isDark
                  ? "border-blue-400 bg-blue-900/20 text-blue-400 hover:bg-blue-500 hover:text-white hover:border-blue-400"
                  : "border-blue-300 bg-blue-100 text-blue-600 hover:bg-blue-500 hover:text-white hover:border-blue-500"
              }`}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-2">
            <div className="date-badge text-xs font-semibold px-2.5 py-1 rounded-full inline-block mb-2">{formattedDate}</div>
            <h2 className="text-2xl font-semibold pt-2">{title}</h2>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 text-gray-800 px-2 py-0.5 text-xs rounded"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="markdown-content mt-4">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeHighlight]}
            >
              {content}
            </ReactMarkdown>
          </div>
          {isAdmin && user && (
            <div className="absolute top-4 right-0 flex items-center gap-2 transition-opacity">
              <button
                onClick={onEdit}
                title="Edit post"
                className={`w-8 h-8 flex items-center justify-center rounded-full cursor-pointer bg-transparent border-[1.5px] transition-colors ${
                  isDark
                    ? "text-gray-400/80 border-gray-400/80 hover:bg-gray-400 hover:text-white hover:border-gray-400"
                    : "text-gray-500/80 border-gray-500/80 hover:bg-gray-500 hover:text-white"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                </svg>
              </button>
              <button
                onClick={onDelete}
                title="Delete post"
                className={`w-8 h-8 flex items-center justify-center rounded-full cursor-pointer bg-transparent border-[1.5px] transition-colors ${
                  isDark
                    ? "text-red-600/80 border-red-600/80 hover:bg-red-600 hover:text-white"
                    : "text-red-500/80 border-red-500/80 hover:bg-red-500 hover:text-white"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </article>
    </>
  );
}
