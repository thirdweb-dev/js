import { readFile } from "node:fs/promises";
import he from "he";
import { NodeHtmlMarkdown } from "node-html-markdown";
import { type HTMLElement as X_HTMLElement, parse } from "node-html-parser";
import type { LinkGroup } from "../../../../components/others/Sidebar";
import { fetchTypeScriptDoc } from "../../../references/components/TDoc/fetchDocs/fetchTypeScriptDoc";
import { getSidebarLinkGroups } from "../../../references/components/TDoc/utils/getSidebarLinkgroups";
import { getFilesRecursive } from "./getFilesRecursive";
import { trimExtraSpace } from "./trimExtraSpace";

type ExtractedContent = {
  llmContent: string;
  llmFullContent: string;
};

const baseUrl = "https://portal.thirdweb.com";

const llmsContentHeader = `\
# __thirdweb TypeScript SDK Documentation__

> Frontend, Backend, and Onchain tools to build complete web3 apps — on every EVM chain.
`;

const llmsFullContentHeader = `\
# __thirdweb TypeScript SDK Documentation__

> Frontend, Backend, and Onchain tools to build complete web3 apps — on every EVM chain.
`;

export async function extractContentForLLM(
  rootDir: string,
): Promise<ExtractedContent> {
  const nextOutputDir = `${rootDir}/.next/server/app`;
  const htmlFiles = getFilesRecursive(nextOutputDir, "html");

  let llmContent = "";
  let llmFullContent = "";

  const noMainFound: string[] = [];
  const noH1Found: string[] = [];

  const doc = await fetchTypeScriptDoc();
  const sidebarLinks = getSidebarLinkGroups(doc, "/references/typescript/v5");

  async function processSideBarLink(sideBarLink: LinkGroup, level = 0) {
    // Add the sidebar link name as header with appropriate formatting based on level
    llmContent +=
      level === 0
        ? `---\n**${sideBarLink.name}**\n`
        : `---\n${"#".repeat(Math.min(level, 5))} ${sideBarLink.name}\n`;
    llmFullContent +=
      level === 0
        ? `---\n**${sideBarLink.name}**\n`
        : `---\n${"#".repeat(Math.min(level, 5))} ${sideBarLink.name}\n`;

    // Process this link's own href if it exists
    if (sideBarLink.href && level > 0) {
      await processLinkPath(sideBarLink.href);
    }

    // Process all child links
    if (sideBarLink.links && sideBarLink.links.length > 0) {
      for (const link of sideBarLink.links) {
        // Skip separators
        if ("separator" in link) {
          continue;
        }

        // If the link is a group, process it recursively
        if ("links" in link) {
          await processSideBarLink(link, level + 1);
        } else {
          // Process the link path if it exists
          if (link.href) {
            await processLinkPath(link.href);
          }
        }
      }
    }
  }

  // Helper function to process the content from a link path
  async function processLinkPath(filePath: string) {
    if (!filePath) {
      return;
    }

    const htmlFilePath = htmlFiles.find((f) => f.includes(filePath));
    if (!htmlFilePath) {
      return;
    }

    try {
      const htmlContent = await readFile(htmlFilePath, "utf-8");
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

      // Extract LLM content
      const { links, full } = extractPageLLMContent(
        mainEl,
        pageTitle,
        filePath,
        nextOutputDir,
      );
      llmContent += links ? `${links}\n` : "";
      llmFullContent += full ? `---\n\n${full}\n` : "";
    } catch (error) {
      console.error(`Error processing file ${htmlFilePath}:`, error);
    }
  }

  for (const sideBarLink of sidebarLinks) {
    await processSideBarLink(sideBarLink);
  }

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
    llmContent: `${llmsContentHeader}\n${llmContent}`,
    llmFullContent: `${llmsFullContentHeader}\n${llmFullContent}`,
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

  linksContent += `* [${pageTitle}](${baseUrl}${pageUrl}): ${description || `Reference for ${pageTitle}`}`;

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

  const codeTags = main.querySelectorAll("code");
  for (const codeTag of codeTags) {
    const lang = codeTag.getAttribute("lang");
    if (lang) {
      const code = codeTag
        .querySelectorAll("div > div > div > div")
        .map((x) => x.textContent)
        .join("\n")
        .trim();
      codeTag.replaceWith(
        `<pre><code class=${lang ? `language-${lang}` : ""}>${he.encode(code)}</code></pre>`,
      );
    }
  }

  // Convert the cleaned HTML to markdown
  fullContent += `${htmlToMarkdown.translate(main.toString())}`;

  return {
    links: linksContent,
    full: fullContent,
  };
}
