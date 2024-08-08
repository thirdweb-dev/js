import FlexSearch from "flexsearch";

export type PageSectionData = {
	title?: string;
	href: string;
	content: string;
};

export type PageData = {
	href: string;
	title: string;
	sections?: PageSectionData[];
};

export type SectionIndex = FlexSearch.Document<
	{
		id: number;
		title: string;
		content: string;
		pageId: number;
		href: string;
	},
	["title", "content", "pageId", "href", "id"]
>;

export type PageTitleIndex = FlexSearch.Document<
	{
		id: number;
		title: string;
	},
	["title", "id"]
>;

export type SearchResultSection = {
	href: string;
	title: string;
	content: string;
};

export type SearchResultItem = {
	pageTitle: string;
	pageHref: string;
	sections?: Array<SearchResultSection>;
};

export type SearchResult = {
	results: Array<SearchResultItem>;
};
