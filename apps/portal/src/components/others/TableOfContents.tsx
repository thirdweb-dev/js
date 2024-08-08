"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Automatically query all the heading anchors inside the <main> and creates a table of contents
 */

export type TableOfContentNode = {
	name: string;
	href: string;
	level: number;
	children: TableOfContentNode[];
};

type AnchorNode = {
	name: string;
	href: string;
	level: number;
};

const DATA_TOC_HREF = "data-toc-href";

export function TableOfContentsSideBar(props: {
	filterHeading?: (heading: HTMLHeadingElement) => boolean;
	linkClassName?: string;
}) {
	const [nodes, setNodes] = useState<TableOfContentNode[]>([]);
	const tocRef = useRef<HTMLDivElement>(null);
	const pathname = usePathname();
	const [hideNav, setHideNav] = useState(false);
	const { filterHeading } = props;

	useEffect(() => {
		const anchorNodes: AnchorNode[] = [];

		// get <main> element as root
		const root = document.querySelector("main");
		if (!root) throw new Error("No main element found");

		// get all anchor links in root
		const anchorsAll = Array.from(
			root.querySelectorAll("a[href^='#']"),
		) as HTMLAnchorElement[];

		// hide anchors inside hidden elements
		const anchors = anchorsAll.filter((anchor) => {
			return anchor.closest("[data-collapsible]") === null;
		});

		if (anchors.length === 0) {
			setHideNav(true);
			return;
		}

		// when heading's intersection changes, update corresponding link's data-active attribute to true/false
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					const href = entry.target.getAttribute(DATA_TOC_HREF);
					if (href) {
						const tocLink = tocRef.current?.querySelector(`a[href="${href}"]`);
						tocLink?.setAttribute("data-active", entry.isIntersecting + "");
					}
				});
			},
			{
				threshold: 1,
			},
		);

		// for each anchor, get its heading and observe the intersection change
		Array.from(anchors).forEach((anchorEl) => {
			const heading =
				anchorEl.parentElement?.querySelector("h2, h3, h4, h5, h6");

			if (!(heading instanceof HTMLHeadingElement)) {
				return;
			}

			if (filterHeading && !filterHeading(heading)) {
				return;
			}

			if (heading) {
				// set corresponding link's href as data-toc-href for usage in observer
				heading.setAttribute(
					DATA_TOC_HREF,
					anchorEl.getAttribute("href") || "",
				);
				observer.observe(heading);
			}

			anchorNodes.push({
				name: heading?.textContent || "",
				href: anchorEl.getAttribute("href") || "",
				level: parseInt(heading?.tagName.slice(1) || "6"),
			});
		});

		setNodes(anchorNodeToTOCNode(anchorNodes));
		return () => {
			observer.disconnect();
		};
	}, [pathname, filterHeading]);

	return (
		<nav
			className={cn(
				"hidden hrink-0 pt-6 xl:block text-sm",
				"sticky top-sticky-top-height h-sidebar-height flex-col overflow-y-auto styled-scrollbar",
			)}
			style={{
				visibility: hideNav ? "hidden" : "visible",
			}}
		>
			<div className="mb-5 text-base font-semibold">On this page</div>
			<div
				ref={tocRef}
				style={{
					opacity: nodes.length > 0 ? 1 : 0,
					transition: "opacity 0.5s ease",
				}}
			>
				<TableOfContents nodes={nodes} linkClassName={props.linkClassName} />
			</div>
		</nav>
	);
}

export function TableOfContents(props: {
	nodes: TableOfContentNode[];
	linkClassName?: string;
}) {
	return (
		<ul className="flex flex-col gap-3">
			{props.nodes.map((node, i) => {
				if (node.children.length > 0) {
					return (
						<li key={i}>
							<TOCLink name={node.name} href={node.href} />
							<div className="pl-3 pt-3">
								<TableOfContents nodes={node.children} key={node.href} />
							</div>
						</li>
					);
				}

				return (
					<li key={i}>
						<TOCLink
							name={node.name}
							href={node.href}
							linkClassName={props.linkClassName}
						/>
					</li>
				);
			})}
		</ul>
	);
}

function TOCLink(props: {
	name: string;
	href: string;
	linkClassName?: string;
}) {
	return (
		<Link
			className={cn(
				"block overflow-hidden text-ellipsis font-medium text-f-300 transition-colors hover:text-f-100 data-[active='true']:text-accent-500",
				props.linkClassName,
			)}
			href={props.href}
		>
			{props.name}
		</Link>
	);
}

function anchorNodeToTOCNode(anchorNodes: AnchorNode[]): TableOfContentNode[] {
	const output = [] as TableOfContentNode[];

	function insertNode(node: AnchorNode, nodeArray: TableOfContentNode[]) {
		if (nodeArray.length === 0) {
			nodeArray.push({ ...node, children: [] });
			return;
		}

		const lastNode = nodeArray[nodeArray.length - 1]!;
		if (node.level <= lastNode.level) {
			nodeArray.push({ ...node, children: [] });
			return;
		} else {
			insertNode(node, lastNode.children!);
		}
	}

	for (const anchorNode of anchorNodes) {
		insertNode(anchorNode, output);
	}

	return output;
}
