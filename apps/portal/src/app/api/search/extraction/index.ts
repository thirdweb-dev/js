import { readFile } from "node:fs/promises";
import he from "he";
import { NodeHtmlMarkdown } from "node-html-markdown";
import {
  CommentNode as X_CommentNode,
  HTMLElement as X_HTMLElement,
  type Node as X_Node,
  TextNode as X_TextNode,
  parse,
} from "node-html-parser";
import type { PageData, PageSectionData } from "../types";
import { getFilesRecursive } from "./getFilesRecursive";
import { ignoreHeadings } from "./settings";
import { trimExtraSpace } from "./trimExtraSpace";

type ExtractedContent = {
  searchData: PageData[];
  llmContent: string;
  llmFullContent: string;
};

const llmsContentHeader = `\
# thirdweb

> Frontend, Backend, and Onchain tools to build complete web3 apps — on every EVM chain.

## Docs
`;

const llmsFullContentHeader = `\
# thirdweb

> Frontend, Backend, and Onchain tools to build complete web3 apps — on every EVM chain.
`;

export async function extractContent(
  rootDir: string,
): Promise<ExtractedContent> {
  const nextOutputDir = `${rootDir}/.next/server/app`;
  const htmlFiles = getFilesRecursive(nextOutputDir, "html");

  const pages: PageData[] = [];
  let llmContent = "";
  let llmFullContent = "";

  const noMainFound: string[] = [];
  const noH1Found: string[] = [];

  await Promise.all(
    htmlFiles.map(async (filePath) => {
      const htmlContent = await readFile(filePath, "utf-8");
      const mainEl = parse(htmlContent, {
        comment: false,
        blockTextElements: {
          pre: true,
        },
      }).querySelector("main");

      if (!mainEl) {
        noMainFound.push(
          filePath.split(".next/server/app")[1]?.replace(".html", "") || "",
        );
        return;
      }

      if (mainEl.getAttribute("data-noindex") === "true") {
        return;
      }

      const pageTitle = mainEl.querySelector("h1")?.text;
      if (!pageTitle) {
        noH1Found.push(
          filePath.split(".next/server/app")[1]?.replace(".html", "") || "",
        );
      }

      // Important: do the search index collection first - we will modify the main element in the next step
      // Extract search data
      const pageData = extractPageSearchData(
        mainEl,
        filePath,
        nextOutputDir,
        pageTitle,
      );
      if (pageData) {
        pages.push(pageData);
      }

      // Extract LLM content
      const { links, full } = extractPageLLMContent(
        mainEl,
        pageTitle,
        filePath,
        nextOutputDir,
      );
      llmContent += links ? `${links}\n` : "";
      llmFullContent += full ? `${full}\n` : "";
    }),
  );

  if (noMainFound.length) {
    console.warn(
      "\n\nNo <main> element found in below routes, They will not be included in search results :\n",
    );
    for (const f of noMainFound) {
      console.warn(`* ${f}`);
    }
    console.warn("\n");
  }

  if (noH1Found.length) {
    console.warn("\n\nNo <h1> element found in below routes :\n");
    for (const f of noH1Found) {
      console.warn(`* ${f}`);
    }
    console.warn("\n");
  }

  return {
    searchData: pages,
    llmContent: `${llmsContentHeader}\n${llmContent}`,
    llmFullContent: `${llmsFullContentHeader}\n${llmFullContent}`,
  };
}

function extractPageSearchData(
  main: X_HTMLElement,
  filePath: string,
  nextOutputDir: string,
  pageTitle: string | undefined,
): PageData | null {
  if (main.getAttribute("data-noindex") === "true") {
    return null;
  }

  return {
    href: filePath.replace(nextOutputDir, "").replace(".html", ""),
    title: pageTitle ? trimExtraSpace(pageTitle) : "",
    sections: getPageSectionsForSearchIndex(main),
  };
}

function extractPageLLMContent(
  main: X_HTMLElement,
  pageTitle: string | undefined,
  filePath: string,
  nextOutputDir: string,
): { links: string; full: string } {
  if (
    main.getAttribute("data-noindex") === "true" ||
    main.getAttribute("data-no-llm") === "true"
  ) {
    return { links: "", full: "" };
  }

  const htmlToMarkdown = new NodeHtmlMarkdown({
    keepDataImages: false,
    ignore: ["button"],
    maxConsecutiveNewlines: 2,
  });

  let linksContent = "";
  let fullContent = "";

  const pageUrl = filePath.replace(nextOutputDir, "").replace(".html", "");

  // Get first non-empty paragraph for description
  const paragraphs = main.querySelectorAll("p");
  let description = "";
  for (const p of paragraphs) {
    // skip noindex or no-llm paragraphs
    if (p.closest("[data-noindex]") || p.closest("[data-no-llm]")) {
      continue;
    }

    description = trimExtraSpace(htmlToMarkdown.translate(p.toString()));
    if (description) {
      break;
    }
  }

  linksContent += `* [${pageTitle}](${pageUrl}): ${description || `Reference for ${pageTitle}`}`;

  // Remove noindex and no-llm elements
  const contentElements = main.querySelectorAll("*");
  for (const element of contentElements) {
    if (
      element.getAttribute("data-noindex") === "true" ||
      element.getAttribute("data-no-llm") === "true"
    ) {
      element.remove();
    }
  }

  // Shift all heading elements to 1 step down (h1 > h2, h2 > h3, etc.)
  const headings = main.querySelectorAll("h1, h2, h3, h4, h5, h6");
  for (const heading of headings) {
    const headingLevel = Number.parseInt(heading.tagName.replace("H", ""));
    const newLevel = Math.min(headingLevel + 1, 6);
    heading.tagName = `H${newLevel}`;
  }

  // prefix all the relative links with the `https://portal.thirdweb.com`
  const links = main.querySelectorAll("a");
  for (const link of links) {
    const href = link.getAttribute("href");
    if (href?.startsWith("/")) {
      link.setAttribute("href", `https://portal.thirdweb.com${href}`);
    }
  }

  // prefix all relative image links with the `https://portal.thirdweb.com`
  const images = main.querySelectorAll("img");
  for (const image of images) {
    const src = image.getAttribute("src");
    if (src?.startsWith("/")) {
      image.setAttribute("src", `https://portal.thirdweb.com${src}`);
    }
  }

  // for code blocks inside pre tags -> make them direct descendants of the pre tag
  // so they are parsed as blocks by node-html-markdown + add language class
  const preTags = main.querySelectorAll("pre");
  for (const preTag of preTags) {
    const codeBlock = parse(preTag.innerHTML.toString(), {
      comment: false,
      blockTextElements: {
        pre: true,
      },
    }).querySelector("code");

    if (codeBlock) {
      const code = codeBlock
        .querySelectorAll("div > div > div > div")
        .map((x) => x.textContent)
        .join("\n")
        .trim();

      const lang = codeBlock.getAttribute("lang");
      codeBlock.textContent = code;

      const newCodePreBlock = parse(
        `<pre><code class=${lang ? `language-${lang}` : ""}>${he.encode(code)}</code></pre>`,
      );

      preTag.replaceWith(newCodePreBlock);
    }
  }

  // Convert the cleaned HTML to markdown
  fullContent += `${htmlToMarkdown.translate(main.toString())}`;

  return {
    links: linksContent,
    full: fullContent,
  };
}

function getPageSectionsForSearchIndex(main: X_HTMLElement): PageSectionData[] {
  const sectionData: PageSectionData[] = [];

  const ignoreTags = new Set(
    ["code", "nav", "pre"].map((t) => t.toUpperCase()),
  );

  function collector(node: X_Node) {
    if (node instanceof X_CommentNode) {
      return;
    }
    if (node instanceof X_HTMLElement) {
      if (ignoreTags.has(node.tagName)) {
        return;
      }

      if (node.getAttribute("data-noindex") === "true") {
        return;
      }

      // headings -> start new section
      if (node.tagName.startsWith("H")) {
        if (node.tagName === "H1") {
          return;
        }

        if (ignoreHeadings.has(node.text.toLowerCase())) {
          return;
        }

        sectionData.push({
          title: node.text,
          href: node.parentNode.querySelector("a")?.getAttribute("href") || "",
          content: "",
        });
      } else {
        for (const child of node.childNodes) {
          collector(child);
        }
      }
    } else if (node instanceof X_TextNode) {
      const lastSection = sectionData[sectionData.length - 1];
      const text = node.text;
      if (text) {
        if (lastSection) {
          lastSection.content += `${node.text} `;
        } else {
          sectionData.push({
            content: `${node.text} `,
            href: "",
          });
        }
      }
    }
  }

  collector(main);

  for (const s of sectionData) {
    s.title = s.title ? trimExtraSpace(s.title) : s.title;
    s.content = trimExtraSpace(s.content);
  }

  return sectionData.filter((s) => s.title || s.content);
}
