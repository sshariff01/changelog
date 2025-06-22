import { ChangelogPost } from "./changelog-post";

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
  return (
    <div className="space-y-12">
      {posts.map((post) => (
        <ChangelogPost key={post.id} {...post} />
      ))}
    </div>
  );
}
