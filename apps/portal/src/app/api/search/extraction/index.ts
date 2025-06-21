import { readFile } from "node:fs/promises";
import {
  parse,
  CommentNode as X_CommentNode,
  HTMLElement as X_HTMLElement,
  type Node as X_Node,
  TextNode as X_TextNode,
} from "node-html-parser";
import type { PageData, PageSectionData } from "../types";
import { getFilesRecursive } from "./getFilesRecursive";
import { ignoreHeadings } from "./settings";
import { trimExtraSpace } from "./trimExtraSpace";

type ExtractedContent = {
  searchData: PageData[];
};

export async function extractContent(
  rootDir: string,
): Promise<ExtractedContent> {
  const nextOutputDir = `${rootDir}/.next/server/app`;
  const htmlFiles = getFilesRecursive(nextOutputDir, "html");

  const pages: PageData[] = [];

  const noMainFound: string[] = [];
  const noH1Found: string[] = [];

  await Promise.all(
    htmlFiles.map(async (filePath) => {
      const htmlContent = await readFile(filePath, "utf-8");
      const mainEl = parse(htmlContent, {
        blockTextElements: {
          pre: true,
        },
        comment: false,
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
    sections: getPageSectionsForSearchIndex(main),
    title: pageTitle ? trimExtraSpace(pageTitle) : "",
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
          content: "",
          href: node.parentNode.querySelector("a")?.getAttribute("href") || "",
          title: node.text,
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
