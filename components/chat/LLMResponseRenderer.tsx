import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github-dark.css'; // You can choose a different theme

type Props = {
  content: string;
  typing?: boolean;
  delayPerChar?: number;
};

export const LLMResponseRenderer: React.FC<Props> = ({
  content,
  typing = false,
  delayPerChar = 10,
}) => {
  const [displayedContent, setDisplayedContent] = useState(typing ? '' : content);

  useEffect(() => {
    if (!typing) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedContent(content.slice(0, i));
      i++;
      if (i > content.length) clearInterval(interval);
    }, delayPerChar);
    return () => clearInterval(interval);
  }, [content, typing, delayPerChar]);

  return (
    <div className="prose prose-invert dark:prose-invert leading-relaxed max-w-none">
      <ReactMarkdown
        children={displayedContent}
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          code({ className, children, ...props }) {
            const isInline = !className;
            return isInline ? (
              <code className="bg-gray-800 px-1 py-0.5 rounded" {...props}>
                {children}
              </code>
            ) : (
              <pre className={className}>
                <code {...props}>{children}</code>
              </pre>
            );
          },
        }}
      />
    </div>
  );
};
