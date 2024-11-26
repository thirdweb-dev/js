import { CodeClient } from "@/components/ui/code/code.client";
import { PlainTextCodeBlock } from "@/components/ui/code/plaintext-code";
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
import Link from "next/link";
import { onlyText } from "react-children-utilities";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const MarkdownRenderer: React.FC<{
  markdownText: string;
  className?: string;
  disableCodeHighlight?: boolean;
}> = ({ markdownText, className, disableCodeHighlight }) => {
  const commonHeadingClassName =
    "mb-2 pb-2 leading-5 font-semibold tracking-tight";

  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: (props) => (
            <h2
              className={cn(
                commonHeadingClassName,
                "mb-4 border-border border-b text-3xl",
              )}
              {...cleanedProps(props)}
            />
          ),

          h2: (props) => (
            <h3
              {...cleanedProps(props)}
              className={cn(
                commonHeadingClassName,
                "mt-8 mb-4 border-border border-b text-2xl",
              )}
            />
          ),

          h3: (props) => (
            <h4
              {...cleanedProps(props)}
              className={cn(commonHeadingClassName, "mt-4 text-xl")}
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

          a: (props) => (
            <Link
              href={props.href}
              target="_blank"
              {...cleanedProps(props)}
              className="mt-4 text-link-foreground hover:text-foreground"
            />
          ),

          code: ({ ...props }) => {
            if (props?.className) {
              if (disableCodeHighlight) {
                return (
                  <div className="mb-4">
                    <PlainTextCodeBlock
                      {...cleanedProps(props)}
                      code={onlyText(props.children).trim()}
                    />
                  </div>
                );
              }
              const language = props.className.replace("language-", "");
              return (
                <div className="mb-4">
                  <CodeClient
                    lang={language}
                    {...cleanedProps(props)}
                    code={onlyText(props.children).trim()}
                  />
                </div>
              );
            }

            return <InlineCode code={onlyText(props.children).trim()} />;
          },

          p: (props) => (
            <p
              className="mb-4 text-muted-foreground leading-relaxed"
              {...cleanedProps(props)}
            />
          ),

          table: (props) => (
            <div className="mb-6">
              <TableContainer>
                <Table {...cleanedProps(props)} />
              </TableContainer>
            </div>
          ),

          th: ({ children: c, ...props }) => (
            <TableHead
              {...cleanedProps(props)}
              className="text-left text-muted-foreground"
            >
              {c}
            </TableHead>
          ),

          td: (props) => (
            <TableCell {...cleanedProps(props)} className="text-left" />
          ),
          thead: (props) => <TableHeader {...cleanedProps(props)} />,
          tbody: (props) => <TableBody {...cleanedProps(props)} />,
          tr: (props) => <TableRow {...cleanedProps(props)} />,
          ul: (props) => {
            return (
              <ul
                className="mb-6 list-outside list-disc pl-5 [&_ol_li:first-of-type]:mt-1.5 [&_ul_li:first-of-type]:mt-1.5"
                {...cleanedProps(props)}
              />
            );
          },
          ol: (props) => (
            <ol
              className="mb-6 list-outside list-decimal pl-5 [&_ol_li:first-of-type]:mt-1.5 [&_ul_li:first-of-type]:mt-1.5"
              {...cleanedProps(props)}
            />
          ),
          li: ({ children: c, ...props }) => (
            <li
              className="mb-1.5 text-muted-foreground"
              {...cleanedProps(props)}
            >
              {c}
            </li>
          ),
        }}
      >
        {markdownText}
      </ReactMarkdown>
    </div>
  );
};

function cleanedProps<T extends object & { node?: unknown }>(
  props: T,
): Omit<T, "node"> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { node, ...rest } = props;
  return rest;
}
