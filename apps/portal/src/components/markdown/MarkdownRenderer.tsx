import Link from "next/link";
import { onlyText } from "react-children-utilities"; // Assuming this dependency is available
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; // Assuming this dependency is available
import type { BundledLanguage } from "shiki"; // For CodeClient lang prop
import { CodeClient, CodeLoading } from "@/components/code/code.client"; // Adjusted path for portal
import { PlainTextCodeBlock } from "@/components/code/plaintext-code"; // Adjusted path for portal
import { InlineCode } from "@/components/ui/inline-code"; // Adjusted path for portal
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Adjusted path for portal
import { cn } from "@/lib/utils"; // Adjusted path for portal

// Helper function to remove the 'node' prop before spreading
function cleanedProps<T extends object & { node?: unknown }>(
  props: T,
): Omit<T, "node"> {
  // biome-ignore lint/correctness/noUnusedVariables: node is used for react-markdown
  const { node, ...rest } = props;
  return rest;
}

export const MarkdownRenderer: React.FC<{
  markdownText: string;
  className?: string;
  code?: {
    disableCodeHighlight?: boolean;
    ignoreFormattingErrors?: boolean;
    className?: string;
  };
  inlineCode?: {
    className?: string;
  };
  p?: {
    className?: string;
  };
  li?: {
    className?: string;
  };
  skipHtml?: boolean;
}> = (markdownProps) => {
  const { markdownText, className, code } = markdownProps;
  const commonHeadingClassName = "mb-2 font-semibold leading-5 tracking-tight"; // Updated to match portal styling if needed

  return (
    <div className={className}>
      <ReactMarkdown
        components={{
          a: (props) => (
            <Link
              href={props.href ?? "#"}
              target="_blank"
              {...cleanedProps(props)}
              className="mt-4 text-blue-600 underline visited:text-purple-600 hover:text-blue-800" // Example portal link style
            />
          ),
          code: ({ className: inheritedClassName, children, ...props }) => {
            const codeStr = onlyText(children);

            // Check if it's likely a block or inline code based on className or content length
            if (inheritedClassName || codeStr.length > 80) {
              // Heuristic for block code
              if (
                code?.disableCodeHighlight ||
                !inheritedClassName?.includes("language-")
              ) {
                return (
                  <div className="my-4">
                    <PlainTextCodeBlock
                      {...cleanedProps(props)}
                      className={markdownProps.code?.className}
                      code={codeStr.trim()}
                      onCopy={(code) => {
                        navigator.clipboard.writeText(code);
                      }}
                    />
                  </div>
                );
              }
              const language = inheritedClassName.replace(
                "language-",
                "",
              ) as BundledLanguage;
              return (
                <div className="my-4">
                  <CodeClient
                    lang={language}
                    {...cleanedProps(props)}
                    className={markdownProps.code?.className}
                    code={codeStr.trim()}
                    loader={<CodeLoading />} // Basic loader
                  />
                </div>
              );
            }
            // Inline code
            return (
              <InlineCode
                className={markdownProps.inlineCode?.className}
                code={codeStr.trim()}
              />
            );
          },
          h1: (props) => (
            <h2
              className={cn(
                commonHeadingClassName,
                "mb-3 border-border border-b pb-2 text-xl md:text-2xl", // Sorted
              )}
              {...cleanedProps(props)}
            />
          ),
          h2: (props) => (
            <h3
              {...cleanedProps(props)}
              className={cn(
                commonHeadingClassName,
                "mt-8 mb-3 border-border border-b pb-2 text-lg md:text-xl", // Sorted
              )}
            />
          ),
          h3: (props) => (
            <h4
              {...cleanedProps(props)}
              className={cn(
                commonHeadingClassName,
                "mt-4 text-base md:text-lg", // Consider portal styles
              )}
            />
          ),
          h4: (props) => (
            <h5
              {...cleanedProps(props)}
              className={cn(commonHeadingClassName, "mt-4 text-lg")} // Consider portal styles
            />
          ),
          h5: (props) => (
            <h6
              {...cleanedProps(props)}
              className={cn(commonHeadingClassName, "mt-4 text-lg")} // Consider portal styles
            />
          ),
          h6: (props) => (
            <p
              {...cleanedProps(props)}
              className={cn(commonHeadingClassName, "mt-4 text-lg")} // Consider portal styles
            />
          ),
          hr: (props) => (
            <hr
              {...cleanedProps(props)}
              className="my-5 border-border bg-border"
            /> // Consider portal styles
          ),
          li: ({ children: c, ...props }) => (
            <li
              className={cn(
                "mb-1.5 text-muted-foreground leading-loose [&>p]:m-0",
                markdownProps.li?.className,
              )}
              {...cleanedProps(props)}
            >
              {c}
            </li>
          ),
          ol: (props) => (
            <ol
              className="mb-4 list-outside list-decimal pl-5 [&_ol_li:first-of-type]:mt-1.5 [&_ul_li:first-of-type]:mt-1.5"
              {...cleanedProps(props)}
            />
          ),
          p: (props) => (
            <p
              className={cn(
                "mb-4 text-muted-foreground leading-loose",
                markdownProps.p?.className,
              )}
              {...cleanedProps(props)}
            />
          ),
          strong(props) {
            return <strong className="font-medium" {...cleanedProps(props)} />;
          },
          table: (props) => (
            <div className="mb-6">
              <TableContainer>
                <Table {...cleanedProps(props)} />
              </TableContainer>
            </div>
          ),
          tbody: (props) => <TableBody {...cleanedProps(props)} />,
          td: (props) => (
            <TableCell {...cleanedProps(props)} className="text-left" />
          ),
          th: ({ children: c, ...props }) => (
            <TableHead
              {...cleanedProps(props)}
              className="text-left text-muted-foreground"
            >
              {c}
            </TableHead>
          ),
          thead: (props) => <TableHeader {...cleanedProps(props)} />,
          tr: (props) => <TableRow {...cleanedProps(props)} />,
          ul: (props) => (
            <ul
              className="mb-4 list-outside list-disc pl-5 [&_ol_li:first-of-type]:mt-1.5 [&_ul_li:first-of-type]:mt-1.5"
              {...cleanedProps(props)}
            />
          ),
        }}
        remarkPlugins={[remarkGfm]}
        skipHtml={markdownProps.skipHtml}
      >
        {markdownText}
      </ReactMarkdown>
    </div>
  );
};
