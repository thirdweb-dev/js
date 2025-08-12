import Link from "next/link";
import { onlyText } from "react-children-utilities";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { InlineCode } from "@/components/ui/inline-code";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import CodeClient from "../code/code.client";

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
  const commonHeadingClassName = "mb-2 leading-5 font-semibold tracking-tight";

  return (
    <div className={className}>
      <ReactMarkdown
        components={{
          a: (props) => (
            <Link
              href={props.href ?? "#"}
              target="_blank"
              {...cleanedProps(props)}
              className="mt-4 underline decoration-muted-foreground/50 decoration-dotted underline-offset-[5px] hover:text-foreground hover:decoration-foreground hover:decoration-solid"
            />
          ),

          code: ({ ...props }) => {
            const codeStr = onlyText(props.children);

            if (props?.className || codeStr.length > 100) {
              if (code?.disableCodeHighlight || !props.className) {
                return (
                  <div className="my-4">
                    <InlineCode
                      {...cleanedProps(props)}
                      className={markdownProps.code?.className}
                      code={onlyText(props.children).trim()}
                    />
                  </div>
                );
              }
              const language = props.className.replace("language-", "");
              return (
                <div className="my-4">
                  <CodeClient
                    // @ts-expect-error - TODO: fix this
                    lang={language}
                    {...cleanedProps(props)}
                    className={markdownProps.code?.className}
                    code={onlyText(props.children).trim()}
                    ignoreFormattingErrors={code?.ignoreFormattingErrors}
                  />
                </div>
              );
            }

            return (
              <InlineCode
                className={markdownProps.inlineCode?.className}
                code={onlyText(props.children).trim()}
              />
            );
          },
          h1: (props) => (
            <h2
              className={cn(
                commonHeadingClassName,
                "mb-3 border-border border-b pb-2 text-xl md:text-2xl",
              )}
              {...cleanedProps(props)}
            />
          ),

          h2: (props) => (
            <h3
              {...cleanedProps(props)}
              className={cn(
                commonHeadingClassName,
                "mt-8 mb-3 border-border border-b pb-2 text-lg md:text-xl",
              )}
            />
          ),

          h3: (props) => (
            <h4
              {...cleanedProps(props)}
              className={cn(
                commonHeadingClassName,
                "mt-4 text-base md:text-lg",
              )}
            />
          ),

          h4: (props) => (
            <h5
              {...cleanedProps(props)}
              className={cn(commonHeadingClassName, "mt-4 text-lg")}
            />
          ),

          h5: (props) => (
            <h6
              {...cleanedProps(props)}
              className={cn(commonHeadingClassName, "mt-4 text-lg")}
            />
          ),

          h6: (props) => (
            <p
              {...cleanedProps(props)}
              className={cn(commonHeadingClassName, "mt-4 text-lg")}
            />
          ),

          hr: (props) => (
            <hr {...cleanedProps(props)} className="my-5 bg-border" />
          ),
          li: ({ children: c, ...props }) => (
            <li
              className={cn(
                markdownProps.li?.className,
                "mb-1.5 text-foreground leading-loose [&>p]:m-0",
              )}
              {...cleanedProps(props)}
            >
              {c}
            </li>
          ),
          ol: (props) => (
            <ol
              {...cleanedProps(props)}
              className="mb-4 list-outside list-decimal pl-5 [&_ol_li:first-of-type]:mt-1.5 [&_ul_li:first-of-type]:mt-1.5"
            />
          ),

          p: (props) => (
            <p
              className={cn(
                markdownProps.p?.className,
                "mb-4 text-foreground leading-loose",
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
              className="text-left text-foreground"
            >
              {c}
            </TableHead>
          ),
          thead: (props) => <TableHeader {...cleanedProps(props)} />,
          tr: (props) => <TableRow {...cleanedProps(props)} />,
          ul: (props) => {
            return (
              <ul
                {...cleanedProps(props)}
                className="mb-4 list-outside list-disc pl-5 [&_ol_li:first-of-type]:mt-1.5 [&_ul_li:first-of-type]:mt-1.5"
              />
            );
          },
        }}
        remarkPlugins={[remarkGfm]}
        skipHtml={markdownProps.skipHtml}
      >
        {markdownText}
      </ReactMarkdown>
    </div>
  );
};

function cleanedProps<T extends object & { node?: unknown }>(
  props: T,
): Omit<T, "node"> {
  // biome-ignore lint/correctness/noUnusedVariables: explicitly removing node here
  const { node, ...rest } = props;
  return rest;
}
