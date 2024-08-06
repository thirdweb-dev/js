"use client";

import {
	QueryClient,
	QueryClientProvider,
	keepPreviousData,
	useQuery,
} from "@tanstack/react-query";

import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "../ui/input";
import {
	Search as SearchIcon,
	FileText as FileTextIcon,
	Command as CommandIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { DynamicHeight } from "./DynamicHeight";
import type { SearchResult } from "@/app/api/search/types";
import { Spinner } from "../ui/Spinner/Spinner";
import { usePathname } from "next/navigation";

const suggestedLinks: { title: string; href: string }[] = [
	{
		title: "TypeScript SDK",
		href: "/typescript/v5",
	},
	{
		title: "Connect",
		href: "/connect",
	},
	{
		title: "Contracts",
		href: "/contracts",
	},
	{
		title: "Engine",
		href: "/engine",
	},
	{
		title: "Payments",
		href: "/payments",
	},
];

type Tag =
	| "React"
	| "React Native"
	| "Unity"
	| "TypeScript"
	| "Wallet SDK"
	| "Connect"
	| "Reference"
	| "Python"
	| "Contracts"
	| "Go"
	| "All"
	| "Infra"
	| "Solidity"
	| "Payments"
	| "Glossary"
	| "Engine";

function SearchModalContent(props: { closeModal: () => void }) {
	const [input, setInput] = useState("");
	const debouncedInput = useDebounce(input, 500);
	const pathname = usePathname();

	const [showOldSDK, setShowOldSDK] = useState(false);

	useEffect(() => {
		if (isOldSDK(pathname)) {
			setShowOldSDK(true);
		} else {
			setShowOldSDK(false);
		}
	}, [pathname]);

	const [selectedTags, setSelectedTags] = useState<{
		[T in Tag]?: boolean;
	}>({});

	const [enabledTags, setEnabledTags] = useState<Tag[]>([]);
	const scrollableElement = useRef<HTMLDivElement | null>(null);

	const searchQuery = useQuery({
		queryKey: ["search-index", debouncedInput],
		queryFn: async () => {
			const res = await fetch(`/api/search?q=${encodeURI(debouncedInput)}`);
			const { results: _results } = (await res.json()) as SearchResult;

			const results = _results.filter((x) => {
				const isOld = isOldSDK(x.pageHref);

				// filter out old SDKs if should not be shown
				if (isOld && !showOldSDK) {
					return false;
				}

				// filter out new SDKs if should not be shown
				if (!isOld && showOldSDK) {
					return false;
				}

				return true;
			});

			const tagsSet: Set<Tag> = new Set([]);

			if (results.length > 0) {
				tagsSet.add("All");
				setSelectedTags({
					All: true,
				});
			}

			results.forEach((r) => {
				const tags = getTagsFromHref(r.pageHref);
				if (tags) {
					tags.forEach((tag) => {
						tagsSet.add(tag);
					});
				}
			});

			const tags = Array.from(tagsSet);
			setEnabledTags(tags);

			scrollableElement.current?.scrollTo({
				top: 0,
			});

			return results;
		},
		enabled: debouncedInput.length > 0,
		placeholderData: keepPreviousData,
	});

	const data = searchQuery.data;
	const noResults =
		debouncedInput && searchQuery.isFetched && data && data.length === 0;

	const handleLinkClick = () => {
		props.closeModal();
	};

	return (
		<div>
			{/* Search  */}
			<div className="flex items-center gap-4 border-b px-4">
				{searchQuery.isFetching ? (
					<Spinner className="size-5" />
				) : (
					<SearchIcon className="size-5 shrink-0 text-f-300" />
				)}

				<Input
					onChange={(e) => {
						setInput(e.target.value);
					}}
					onKeyDown={(e) => {
						if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
							e.target.blur();
						}
					}}
					placeholder="Search documentation"
					className={cn(
						"flex-1 border-none bg-transparent p-4 placeholder:text-base px-0 text-base placeholder:text-f-300 caret-accent-500",
						"focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-transparent",
					)}
				/>
			</div>

			<DynamicHeight>
				<div className="min-h-[200px]">
					{/* tags */}
					{enabledTags && enabledTags.length > 0 && (
						<div className="flex flex-wrap gap-2 border-b p-4">
							{enabledTags.map((tag) => (
								<Button
									variant="ghost"
									key={tag}
									className={cn(
										"rounded-lg border px-3 py-1 text-sm ",
										selectedTags[tag]
											? "!bg-b-600 !text-f-100 border-f-300"
											: "!bg-b-800 !text-f-300",
									)}
									onClick={() => {
										// do not allow removing the last remaining tag
										const enabledTags = Object.keys(selectedTags).filter(
											(k) => selectedTags[k as Tag],
										);
										if (enabledTags.length === 1 && enabledTags[0] === tag) {
											return;
										}

										setSelectedTags((prev) => {
											const newValue = !prev[tag];

											if (tag === "All") {
												if (newValue) {
													return {
														[tag]: true,
													};
												}

												return {
													...prev,
													[tag]: false,
												};
											}

											return {
												...prev,
												[tag]: newValue,
												All: newValue ? false : prev.All,
											};
										});
									}}
								>
									{tag}
								</Button>
							))}
						</div>
					)}

					{/* links */}
					{data && data.length > 0 && (
						<div
							className="styled-scrollbar flex max-h-[50vh] min-h-[200px] flex-col gap-2 overflow-y-auto p-4"
							ref={scrollableElement}
						>
							{data.map((result, i) => {
								const tags = getTagsFromHref(result.pageHref);

								if (
									!selectedTags["All"] &&
									tags &&
									!tags.find((t) => selectedTags[t] === true)
								)
									return null;

								if (!tags && !selectedTags["All"]) {
									return null;
								}

								const sections = result.sections
									?.filter((d) => d.content.length > 50)
									.slice(0, 2);

								return (
									<div key={i} className="flex flex-col gap-2">
										<SearchResultItem
											type="page"
											href={result.pageHref}
											title={result.pageTitle}
											tags={tags}
											onClick={handleLinkClick}
										/>

										{sections && sections.length > 0 && (
											<div className="flex flex-col gap-2 border-l pl-3">
												{sections.map((sectionData) => {
													return (
														<SearchResultItem
															type="section"
															href={result.pageHref + sectionData.href}
															key={sectionData.href}
															title={sectionData.title}
															content={
																sectionData.content.length < 100
																	? sectionData.content
																	: sectionData.content.slice(0, 100) + " ..."
															}
															onClick={handleLinkClick}
														/>
													);
												})}
											</div>
										)}
									</div>
								);
							})}
						</div>
					)}

					{/* No Results */}
					{noResults && (
						<div className="flex min-h-[200px] items-center justify-center">
							<p> No Results </p>
						</div>
					)}

					{!debouncedInput && (!data || data.length === 0) && (
						<NoSearchLinks onClick={handleLinkClick} />
					)}
				</div>
			</DynamicHeight>
		</div>
	);
}

function NoSearchLinks(props: { onClick?: () => void }) {
	return (
		<div className="flex flex-col gap-2 p-4">
			{suggestedLinks.map((link) => {
				return (
					<SearchResultItem
						type="page"
						href={link.href}
						title={link.title}
						key={link.href}
						onClick={props.onClick}
					/>
				);
			})}
		</div>
	);
}

function useDebounce(value: string, delay: number) {
	const [debouncedValue, setDebouncedValue] = useState(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
}

const queryClient = new QueryClient();

export function DocSearch(props: { variant: "icon" | "search" }) {
	const [open, setOpen] = useState(false);

	const forDesktop = props.variant === "search";
	useEffect(() => {
		if (!forDesktop) {
			return;
		}
		// when cmd+k on MacOS or ctrl+k on Windows is pressed, open the search modal
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((v) => !v);
			}
		};

		document.body.addEventListener("keydown", handleKeyDown);
		return () => {
			document.body.removeEventListener("keydown", handleKeyDown);
		};
	}, [forDesktop]);

	// when escape is pressed, close the search modal
	useEffect(() => {
		if (!forDesktop) {
			return;
		}
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				setOpen(false);
			}
		};

		document.body.addEventListener("keydown", handleKeyDown);
		return () => {
			document.body.removeEventListener("keydown", handleKeyDown);
		};
	}, [forDesktop]);

	return (
		<QueryClientProvider client={queryClient}>
			<Dialog open={open} onOpenChange={setOpen}>
				{/* Desktop */}

				{forDesktop && (
					<DialogTrigger asChild>
						<Button
							variant="outline"
							className="flex w-56 justify-between px-3"
						>
							Search Docs
							<div className="flex items-center gap-1 rounded-sm border bg-b-900 px-2 py-1 text-xs text-f-300">
								<CommandIcon className="size-3" />K
							</div>
						</Button>
					</DialogTrigger>
				)}

				{!forDesktop && (
					<DialogTrigger asChild>
						<Button variant="ghost" className="px-3">
							<SearchIcon className="size-6 text-f-100" />
						</Button>
					</DialogTrigger>
				)}

				<DialogContent className="bg-b-900 sm:max-w-[550px]">
					<SearchModalContent
						closeModal={() => {
							setOpen(false);
						}}
					/>
				</DialogContent>
			</Dialog>
		</QueryClientProvider>
	);
}

function isOldSDK(href: string) {
	return (
		href.includes("/react-native/v0") ||
		href.includes("/typescript/v4") ||
		href.includes("/react/v4") ||
		href.includes("/wallet-sdk/v2") ||
		href.includes("/wallets/v2") ||
		href.includes("/storage-sdk/v2") ||
		href.includes("/storage/v2")
	);
}

// function isNewSDK(href: string) {
// 	return href.includes("/typescript/v5");
// }

function getTagsFromHref(href: string): Tag[] | undefined {
	if (href.includes("/react-native/v0")) {
		if (href.includes("/references")) {
			return ["Reference", "React Native"];
		}
		return ["React Native"];
	} else if (href.includes("/react/v4")) {
		if (href.includes("/references")) {
			return ["Reference", "React"];
		}
		return ["React"];
	} else if (href.includes("/typescript/v4")) {
		if (href.includes("/references")) {
			return ["Reference", "TypeScript"];
		}
		return ["TypeScript"];
	} else if (href.includes("/wallet-sdk/v2")) {
		if (href.includes("/references")) {
			return ["Reference", "Wallet SDK"];
		}
		return ["Wallet SDK"];
	} else if (href.includes("/unity")) {
		return ["Unity"];
	} else if (href.includes("/typescript/v5")) {
		if (href.includes("/references")) {
			return ["Reference", "TypeScript"];
		}
		return ["TypeScript"];
	} else if (href.includes("/react/v5")) {
		return ["React"];
	} else if (href.includes("/connect")) {
		return ["Connect"];
	} else if (href.includes("/engine")) {
		return ["Engine"];
	} else if (href.includes("/infrastructure")) {
		return ["Infra"];
	} else if (href.includes("/solidity")) {
		return ["Solidity"];
	} else if (href.includes("/contracts")) {
		return ["Contracts"];
	} else if (href.includes("/payments")) {
		return ["Payments"];
	} else if (href.includes("/glossary")) {
		return ["Glossary"];
	}
}

function SearchResultItem(props: {
	href: string;
	title: string;
	content?: string;
	tags?: Tag[];
	type: "page" | "section";
	onClick?: () => void;
}) {
	return (
		<Link
			className="flex gap-3 rounded-sm bg-b-700 px-4 py-3 text-f-300 transition-colors hover:bg-b-600 hover:text-f-100"
			href={props.href}
			onClick={props.onClick}
		>
			<div className="flex w-full flex-col gap-1">
				{props.title && (
					<div className="flex flex-wrap items-center justify-between gap-2 break-all text-base text-f-100">
						<div
							className={cn(
								"flex items-center gap-2",
								props.type === "page" ? "text-f-100" : "text-f-200",
							)}
						>
							{props.type === "page" && (
								<FileTextIcon className="size-5 text-f-300" />
							)}

							{props.title}
						</div>

						{props.tags && (
							<div className="flex gap-2">
								{props.tags.map((tag) => {
									return (
										<span
											key={tag}
											className={cn(
												"rounded-lg border px-1.5 py-1 text-xs bg-b-700 text-f-300 shrink-0",
											)}
										>
											{tag}
										</span>
									);
								})}
							</div>
						)}
					</div>
				)}
				{props.content && <div className="text-sm">{props.content}</div>}
			</div>
		</Link>
	);
}

// const HighlightMatches = memo(function _HighlightMatches(props: {
// 	value: string;
// 	match: string;
// }) {
// 	const tokens = getMatches(props);
// 	return (
// 		<div>
// 			{tokens.map((t) => {
// 				return (
// 					<span
// 						key={t.text}
// 						className={t.highlight ? "bg-b-700 text-f-100" : "text-f-300"}
// 					>
// 						{t.text}
// 					</span>
// 				);
// 			})}
// 		</div>
// 	);
// });
