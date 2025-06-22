"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { useEffect } from "react";
import { useTheme } from "@/lib/theme-context";

type Props = {
  title: string;
  content: string;
  tags: string[];
  published_at: string;
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
      `;
    } else {
      // Monokai theme (light) - vibrant colors on light background
      style.textContent = `
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
      `;
    }

    document.head.appendChild(style);

    // Cleanup function
    return () => {
      style.remove();
    };
  }, [theme]);
}

export function ChangelogPost({ title, content, tags, published_at }: Props) {
  useSyntaxHighlighting();

  const date = new Date(published_at);
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="border rounded-xl p-6">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="text-sm text-gray-500">{formattedDate}</div>
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
      <div className="prose prose-sm dark:prose-invert mt-4">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
        >
          {content}
        </ReactMarkdown>
      </div>
    </article>
  );
}
