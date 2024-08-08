import type { SideBar } from "@/components/Layouts/DocLayout";

const chainsawSlug = "/chainsaw";

export const sidebar: SideBar = {
	name: "Chainsaw",
	links: [
		{
			name: "Overview",
			href: "/chainsaw",
		},
        {
            name: "Get Started",
            href: `${chainsawSlug}/get-started`,
        },
		{ name: "Authentication", links: [
			{
				name: "API Authentication",
				href: `${chainsawSlug}/authentication#api-authentication`,
			},
			{
				name: "SDK Authentication",
				href: `${chainsawSlug}/authentication#sdk-authentication`,
			},
        ] },
        {
            name: "Typescript SDK",
            links: [
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
