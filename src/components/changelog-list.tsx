import { ChangelogPost } from "./changelog-post";

type Props = {
  posts: {
    id: string;
    title: string;
    content: string;
    tags: string[];
    date: string;
  }[];
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
