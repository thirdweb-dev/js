/* eslint-disable @next/next/no-img-element */
import {
  CodeBlock,
  DocLink,
  Heading,
  InlineCode,
  Paragraph,
  Separator,
  UnorderedList,
} from "@/components/Document";
import { Fragment } from "react";
import { convertNodeToElement } from "react-html-parser";
import type { Transform } from "react-html-parser";
import type { BundledLanguage, SpecialLanguage } from "shiki";

const headingTags = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);

const knownLangs = new Set([
  "js",
  "jsx",
  "tsx",
  "ts",
  "bash",
  "text",
  "javascript",
  "typescript",
  "python",
  "go",
  "json",
  "shell",
  "sol",
  "groovy",
  "solidity",
]);

export const transform: Transform = (node, index: number) => {
  if (node.type !== "tag" || !node.name) {
    return;
  }

  const getChildren = () => {
    return node.children?.map((n, i) => (
      // biome-ignore lint/suspicious/noArrayIndexKey: nothing better available
      <Fragment key={i}>{convertNodeToElement(n, index, transform)}</Fragment>
    ));
  };

  if (headingTags.has(node.name)) {
    const level = Number.parseInt(node.name[1] || "");

    return (
      <Heading level={level} id="#" anchorClassName="mt-10">
        {getChildren()}
      </Heading>
    );
  }

  if (node.name === "p") {
    if (node.parent && node.parent.name === "figcaption") {
      if (!node.attribs) {
        node.attribs = {};
      }
      node.attribs.class = "text-center text-sm text-muted-foreground";
      return;
    }
    return <Paragraph>{getChildren()}</Paragraph>;
  }

  if (node.name === "ul") {
    return <UnorderedList>{getChildren()}</UnorderedList>;
  }

  if (node.name === "img") {
    if (!node.attribs) {
      node.attribs = {};
    }
    node.attribs.class = "rounded-lg";
    return (
      <div className="my-5 flex justify-center rounded-lg border p-4">
        {convertNodeToElement(node, index, transform)}
      </div>
    );
  }

  if (node.name === "code" && node.children) {
    if (!node.attribs?.class) {
      const code = node.children[0]?.data;
      if (code && code.length < 50) {
        return <InlineCode code={code} />;
      }
    }

    const className = node.attribs?.class;
    const code = node.children[0]?.data;
    let lang: BundledLanguage | SpecialLanguage = "plaintext";
    if (className) {
      const specifiedLang = className
        .toLowerCase()
        .replace("language-", "")
        .trim();
      if (knownLangs.has(specifiedLang)) {
        lang = specifiedLang as BundledLanguage | SpecialLanguage;
      }
      // else {
      // 	console.warn(
      // 		`Unknown language "${specifiedLang}" specified for code block in Changelog`,
      // 	);
      // }
    }
    if (code) {
      return <CodeBlock lang={lang} code={code} />;
    }
  }

  if (node.name === "a") {
    return <DocLink href={node.attribs?.href || "#"}>{getChildren()}</DocLink>;
  }

  if (node.name === "hr") {
    return <Separator />;
  }

  if (node.name === "figcaption") {
    if (!node.attribs) {
      node.attribs = {};
    }
    node.attribs.class = "mb-8 -mt-2";
  }

  if (node.name === "video") {
    if (!node.attribs) {
      node.attribs = {};
    }
    node.attribs.controls = "false";
    node.attribs.autoplay = "autoplay";
    node.attribs.loop = "loop";
    node.attribs.muted = "muted";
  }
};
