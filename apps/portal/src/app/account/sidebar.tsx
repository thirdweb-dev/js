const accountSlug = "/account";
import { SideBar } from "@/components/Layouts/DocLayout";

export const sidebar: SideBar = {
	name: "Account",
	links: [
		{
			name: "Billing",
			links: [
				{
					name: "Account Info",
					href: `${accountSlug}/billing/account-info`,
				},
				{
					name: "Manage Billing",
					href: `${accountSlug}/billing/manage-billing`,
				},
				{
					name: "Credits",
					href: `${accountSlug}/billing/credits`,
				},
				{
					name: "Upgrade Plan",
					href: `${accountSlug}/billing/upgrade-plan`,
				}
				
			],
		},
		{
			name: "API Keys",
			links: [
				{
					name: "Overview",
					href: `${accountSlug}/api-keys`,
				},
				{
					name: "Create API Key",
					href: `${accountSlug}/api-keys/create`,
				},
				{
					name: "Use API Key",
					href: `${accountSlug}/api-keys/use`,
				},
				{
					name: "Edit enabled services",
					href: `${accountSlug}/api-keys/edit-services`,
				},
				{
					name: "Delete API Key",
					href: `${accountSlug}/api-keys/delete`,
				},
				{
					name: "Access Restrictions",
					href: `${accountSlug}/api-keys/access`,
				},
				{
					name: "FAQs",
					href: `${accountSlug}/api-keys/faq`,
				},
			],
		},
	],
};
