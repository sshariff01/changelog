import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";

type Props = {
  title: string;
  content: string;
  tags: string[];
  date: string;
};

export function ChangelogPost({ title, content, tags, date }: Props) {
  return (
    <article className="border rounded-xl p-6">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="text-sm text-gray-500">{new Date(date).toDateString()}</div>
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
