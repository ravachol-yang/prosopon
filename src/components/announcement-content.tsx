"use client";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function AnnouncementContent({ content }: { content: string }) {
  return (
    <article className="prose prose-sm md:prose-base prose-slate max-w-none prose-code:before:content-none prose-code:after:content-none">
      <Markdown
        components={{
          h1: "h2",
          code(props) {
            const { node, ...rest } = props;
            return <code className="font-medium bg-destructive/1 text-destructive" {...rest} />;
          },
        }}
        remarkPlugins={[remarkGfm]}
      >
        {content}
      </Markdown>
    </article>
  );
}
