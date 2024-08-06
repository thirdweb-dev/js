import { readFile } from "fs/promises";
import { getFilesRecursive } from "./getFilesRecursive";
import {
	parse,
	HTMLElement as X_HTMLElement,
	Node as X_Node,
	TextNode as X_TextNode,
	CommentNode as X_CommentNode,
} from "node-html-parser";
import { PageData, PageSectionData } from "../types";
import { trimExtraSpace } from "./trimExtraSpace";
import { ignoreHeadings } from "./settings";

export async function extractSearchData(rootDir: string): Promise<PageData[]> {
	const nextOutputDir = `${rootDir}/.next/server/app`;
	const htmlFiles = getFilesRecursive(nextOutputDir, "html");

	const pages: PageData[] = [];

	const noMainFound: string[] = [];
	const noH1Found: string[] = [];

	await Promise.all(
		htmlFiles.map(async (filePath) => {
			const htmlContent = await readFile(filePath, "utf-8");
			const mainEl = parse(htmlContent, {
				comment: false,
				blockTextElements: {
					pre: false, // parse text inside <pre> elements instead of treating it as text
				},
			}).querySelector("main");

			if (!mainEl) {
				noMainFound.push(
					filePath.split(".next/server/app")[1]?.replace(".html", "") || "",
				);
				return;
			}

			const noIndex = mainEl.getAttribute("data-noindex");

			if (noIndex) {
				return;
			}

			const pageTitle = mainEl.querySelector("h1")?.text;

			if (!pageTitle) {
				noH1Found.push(
					filePath.split(".next/server/app")[1]?.replace(".html", "") || "",
				);
			}

			pages.push({
				href: filePath.replace(nextOutputDir, "").replace(".html", ""),
				title: pageTitle ? trimExtraSpace(pageTitle) : "",
				sections: getPageSections(mainEl),
			});
		}),
	);

	if (noMainFound.length) {
		console.warn(
			`\n\nNo <main> element found in below routes, They will not be included in search results :\n`,
		);
		noMainFound.forEach((f) => console.warn("* " + f));
		console.warn("\n");
	}

	if (noH1Found.length) {
		console.warn(`\n\nNo <h1> element found in below routes :\n`);
		noH1Found.forEach((f) => console.warn("* " + f));
		console.warn("\n");
	}

	return pages;
}

function getPageSections(main: X_HTMLElement): PageSectionData[] {
	const sectionData: PageSectionData[] = [];

	const ignoreTags = new Set(["code", "nav"].map((t) => t.toUpperCase()));

	function collector(node: X_Node) {
		if (node instanceof X_CommentNode) {
			return;
		} else if (node instanceof X_HTMLElement) {
			if (ignoreTags.has(node.tagName)) {
				return;
			}

			const noIndexAttribute = node.getAttribute("data-noindex");

			if (noIndexAttribute === "true") {
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
					lastSection.content += node.text + " ";
				} else {
					sectionData.push({
						content: node.text + " ",
						href: "",
					});
				}
			}
		}
	}

	collector(main);

	sectionData.forEach((s) => {
		s.title = s.title ? trimExtraSpace(s.title) : s.title;
		s.content = trimExtraSpace(s.content);
	});

	return sectionData.filter((s) => s.title || s.content);
}
