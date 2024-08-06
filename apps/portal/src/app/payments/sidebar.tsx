import { SideBar } from "@/components/Layouts/DocLayout";
import { PaymentsNFTCheckoutIcon } from "@/icons";

const checkoutSlug = "/payments/nft-checkout";

export const sidebar: SideBar = {
	name: "Payments",
	links: [
		{
			name: "Overview",
			href: "/payments",
		},
		{ separator: true },
		{
			name: "NFT Checkout",
			icon: <PaymentsNFTCheckoutIcon />,
			isCollapsible: false,
			links: [
				{
					name: "Get Started",
					href: `${checkoutSlug}/getting-started`,
					links: [
						{
							name: "Enable Contract for Payments",
							href: `${checkoutSlug}/enable-contract`,
						},
						{
							name: "Create Checkout Link",
							href: `${checkoutSlug}/checkout-link`,
						},
						{
							name: "Go Live Checklist",
							href: `${checkoutSlug}/go-live-checklist`,
						},
					],
				},

				{
					name: "Embedded Elements",

					links: [
						{
							name: "Overview",
							href: `${checkoutSlug}/elements`,
						},
						{
							name: "CheckoutWithCard",
							href: `${checkoutSlug}/checkout-with-card`,
						},
						{
							name: "CheckoutWithEth",
							href: `${checkoutSlug}/checkout-with-eth`,
						},
					],
				},
				{
					name: "Webhooks",
					href: `${checkoutSlug}/webhooks`,
				},
				{ name: "Translations", href: `${checkoutSlug}/translations` },
				{ name: "Marketplaces", href: `${checkoutSlug}/marketplaces` },
				{
					name: "One-Time Checkout Link",
					href: `${checkoutSlug}/one-time-checkout-link`,
				},
				{
					name: "Pre-built Contracts",
					href: `${checkoutSlug}/pre-built-contracts`,
				},
				{
					name: "Custom Contracts",
					href: `${checkoutSlug}/custom-contracts`,
				},
				{
					name: "ERC-20 Pricing",
					href: `${checkoutSlug}/erc20-pricing`,
				},
			],
		},
		{ separator: true },
		{ name: "API Reference", href: `${checkoutSlug}/api-reference` },
		{ name: "FAQ", href: `${checkoutSlug}/faq` },
	],
};
