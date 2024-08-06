import type { SideBar } from "@/components/Layouts/DocLayout";

const chainsawSlug = "/chainsaw";

export const sidebar: SideBar = {
	name: "Chainsaw",
	links: [
		{
			name: "Overview",
			href: "/chainsaw",
		},
		{ name: "Authentication", href: `${chainsawSlug}/authentication` },
		{
			name: "Get Started",
			href: `${chainsawSlug}/get-started`,
		},
		{
			name: "API Reference",
			links: [
                {
					name: "Events",
					href: `${chainsawSlug}/api-reference#events`,
				},
				{
                    name: "Transactions",
					href: `${chainsawSlug}/api-reference#transactions`,
				},
				{
                    name: "Blocks",
					href: `${chainsawSlug}/api-reference#blocks`,
				},
                {
                    name: "Latest Block Number",
                    href: `${chainsawSlug}/api-reference#latest-blocknumber`,
                },
				{
                    name: "NFTs By Collection",
					href: `${chainsawSlug}/api-reference#nfts-by-collection`,
				},
				{
                    name: "NFTs By Owner",
					href: `${chainsawSlug}/api-reference#nfts-by-owner`,
				},

            ]
		},
		{
			name: "Typescript SDK",
			links: [
                {
                    name: "Setup",
                    href: `${chainsawSlug}/typescript-sdk#setup`,
                },
                {
                    name: "Usage",
                    href: `${chainsawSlug}/typescript-sdk#usage`,
                },
                {
                    name: "getBlock",
                    href: `${chainsawSlug}/typescript-sdk#getblock`,
                },
                {
                    name: "getEvents",
                    href: `${chainsawSlug}/typescript-sdk#getevents`,
                },
                {
                    name: "getLatestBlockNumber",
                    href: `${chainsawSlug}/typescript-sdk#getlatestblocknumber`,
                },
                {
                    name: "getNFTsByCollection",
                    href: `${chainsawSlug}/typescript-sdk#getnftsbycollection`,
                },
                {
                    name: "getNFTsByOwner",
                    href: `${chainsawSlug}/typescript-sdk#getnftsbyowner`,
                },
                {
                    name: "getTransactions",
                    href: `${chainsawSlug}/typescript-sdk#gettransactions`,
                }
            ]
		},
		{
			name: "Guides",
			links: [
				{
					name: "Get wallet NFTs",
					href: `${chainsawSlug}/guides/get-address-nfts`,
				},
			],
		},
		{
			name: "FAQ",
			href: `${chainsawSlug}/faq`,
		},
	],
};
