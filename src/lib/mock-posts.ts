export const mockPosts = [
  {
    id: "1",
    title: "Initial release 🎉",
    content: `
We've launched our first version of the changelog app!

## Features
- Markdown support
- Tag display
- Simple styling

\`\`\`ts
const greeting = "Hello world";
console.log(greeting);
\`\`\`
  `.trim(),
    tags: ["New", "Release"],
    date: "2025-06-21",
  },
  {
    id: "2",
    title: "Added dark mode support 🌑",
    content: `
You can now view the changelog in dark mode.

To enable dark mode, toggle your system theme or use the switch in settings.
  `.trim(),
    tags: ["Improved"],
    date: "2025-06-20",
  },
];