import GithubSlugger from "github-slugger";
import type { MDXComponents } from "mdx/types";
import type { BuiltinLanguage } from "shiki";
import { CodeBlock } from "@/components/Document/Code";
import { DocLink } from "@/components/Document/DocLink";
import { Heading } from "@/components/Document/Heading";
import { OrderedList, UnorderedList } from "@/components/Document/List";
import { Paragraph } from "@/components/Document/Paragraph";
import { Separator } from "@/components/Document/Separator";
import { Table, TBody, Td, Th, Tr } from "@/components/Document/Table";
import { InlineCode } from "./src/components/Document";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  const slugger = new GithubSlugger();

  function nameToLink(name: React.ReactNode) {
    if (typeof name !== "string") {
      return undefined;
    }

    return slugger.slug(name);
  }

  function getHeading(
    depth: number,
    props: {
      children?: React.ReactNode;
      id?: string;
    },
  ) {
    return (
      <Heading
        anchorId={props.id || nameToLink(props.children) || ""}
        level={depth}
      >
        {props.children}
      </Heading>
    );
  }

  return {
    ...components,
    a(props) {
      const { href, children } = props;
      return <DocLink href={href || ""}>{children}</DocLink>;
    },
    code(props) {
      const code = props.children;
      const lang = props.className?.replace("language-", "");

      if (!props.className) {
        return <InlineCode code={typeof code === "string" ? code : ""} />;
      }

      return (
        <CodeBlock
          code={typeof code === "string" ? code : ""}
          lang={lang as BuiltinLanguage}
        />
      );
    },
    h1(props) {
      return getHeading(1, props);
    },
    h2(props) {
      return getHeading(2, props);
    },
    h3(props) {
      return getHeading(3, props);
    },
    h4(props) {
      return getHeading(4, props);
    },
    h5(props) {
      return getHeading(5, props);
    },
    h6(props) {
      return getHeading(6, props);
    },
    hr() {
      return <Separator />;
    },
    ol(props) {
      return <OrderedList>{props.children}</OrderedList>;
    },
    p(props) {
      return <Paragraph>{props.children}</Paragraph>;
    },
    table(props) {
      return <Table>{props.children}</Table>;
    },
    tbody(props) {
      return <TBody>{props.children}</TBody>;
    },
    td(props) {
      return <Td>{props.children}</Td>;
    },
    th(props) {
      return <Th>{props.children}</Th>;
    },
    tr(props) {
      return <Tr>{props.children}</Tr>;
    },
    ul(props) {
      return <UnorderedList>{props.children}</UnorderedList>;
    },
  };
}
