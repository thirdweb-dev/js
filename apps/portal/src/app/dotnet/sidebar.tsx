import type { SideBar } from "@/components/Layouts/DocLayout";
import type { SidebarLink } from "@/components/others/Sidebar";
import { ZapIcon } from "lucide-react";

const walletProviders: SidebarLink = (() => {
	const parentSlug = "/dotnet/wallets/providers";
	return {
		name: "Wallet Providers",
		links: [
			{
				name: "In App Wallet",
				href: `${parentSlug}/in-app-wallet`,
			},
			{
				name: "Account Abstraction",
				href: `${parentSlug}/account-abstraction`,
			},
			{
				name: "Private Key Wallet",
				href: `${parentSlug}/private-key`,
			},
		],
	};
})();

const walletActions: SidebarLink = (() => {
	const parentSlug = "/dotnet/wallets/actions";
	return {
		name: "Wallet Actions",
		links: [
			{
				name: "GetAddress",
				href: `${parentSlug}/getaddress`,
			},
			{
				name: "IsConnected",
				href: `${parentSlug}/isconnected`,
			},
			{
				name: "Sign",
				href: `${parentSlug}/sign`,
			},
			{
				name: "SignTypedDataV4",
				href: `${parentSlug}/signtypeddatav4`,
			},
			{
				name: "Authenticate",
				href: `${parentSlug}/authenticate`,
			},
			{
				name: "Disconnect",
				href: `${parentSlug}/disconnect`,
			},
			{
				name: "GetEmail",
				href: `${parentSlug}/getemail`,
			},
			{
				name: "GetPhoneNumber",
				href: `${parentSlug}/getphonenumber`,
			},
			{
				name: "IsDeployed",
				href: `${parentSlug}/isdeployed`,
			},
			{
				name: "SendTransaction",
				href: `${parentSlug}/sendtransaction`,
			},
			{
				name: "CreateSessionKey",
				href: `${parentSlug}/createsessionkey`,
			},
			{
				name: "AddAdmin",
				href: `${parentSlug}/addadmin`,
			},
			{
				name: "RemoveAdmin",
				href: `${parentSlug}/removeadmin`,
			},
			{
				name: "GetBalance",
				href: `${parentSlug}/getbalance`,
			},
		],
	};
})();

const contracts: SidebarLink = {
	name: "Contract Interactions",
	links: [
		{
			name: "Create Contract",
			href: "/dotnet/contracts/create",
		},
		{
			name: "Read Contract",
			href: "/dotnet/contracts/read",
		},
		{
			name: "Write Contract",
			href: "/dotnet/contracts/write",
		},
		{
			name: "Prepare Transaction",
			href: "/dotnet/contracts/prepare",
		},
		{
			name: "Contract Extensions",
			href: "/dotnet/contracts/extensions",
		},
	],
};

const transactions: SidebarLink = {
	name: "Transaction Builder",
	links: [
		{
			name: "Create Transaction",
			href: "/dotnet/transactions/create",
		},
		{
			name: "Instance Methods",
			href: "/dotnet/transactions/instance",
		},
		{
			name: "Static Methods",
			href: "/dotnet/transactions/static",
		},
	],
};

const pay: SidebarLink = {
	name: "Pay",
	isCollapsible: false,
	links: [
		{
			name: "Quickstart",
			href: "/dotnet/pay/quickstart",
		},
		{
			name: "Buy With Fiat",
			links: [
				{
					name: "Get Buy With Fiat Quote",
					href: "/dotnet/pay/getbuywithfiatquote",
				},
				{
					name: "Buy With Fiat",
					href: "/dotnet/pay/buywithfiat",
				},
				{
					name: "Get Buy With Fiat Status",
					href: "/dotnet/pay/getbuywithfiatstatus",
				},
				{
					name: "Get Buy With Fiat Currencies",
					href: "/dotnet/pay/getbuywithfiatcurrencies",
				},
			],
		},
		{
			name: "Buy With Crypto",
			links: [
				{
					name: "Get Buy With Crypto Quote",
					href: "/dotnet/pay/getbuywithcryptoquote",
				},
				{
					name: "Buy With Crypto",
					href: "/dotnet/pay/buywithcrypto",
				},
				{
					name: "Get Buy With Crypto Status",
					href: "/dotnet/pay/getbuywithcryptostatus",
				},
			],
		},
		{
			name: "Get Buy History",
			href: "/dotnet/pay/getbuyhistory",
		},
	],
};

export const sidebar: SideBar = {
	name: ".NET SDK",
	links: [
		{ separator: true },
		{
			name: "Overview",
			href: "/dotnet",
		},
		{
			name: "Getting Started",
			href: "/dotnet/getting-started",
			icon: <ZapIcon />,
		},
		{
			name: "Godot Integration",
			href: "/dotnet/godot",
		},
		{
			name: "Unity Integration",
			href: "/unity/v5",
		},
		{
			name: "Core",
			isCollapsible: false,
			links: [
				{
					name: "Thirdweb Client",
					href: "/dotnet/client",
				},
				{
					name: "Storage",
					href: "/dotnet/storage",
				},
			],
		},
		{
			name: "Wallets",
			isCollapsible: false,
			links: [walletProviders, walletActions],
		},
		pay,
		{
			name: "Blockchain API",
			isCollapsible: false,
			links: [contracts, transactions],
		},
		{ separator: true },
		{
			name: "Full Reference",
			href: "https://thirdweb-dev.github.io/thirdweb-dotnet/index.html",
		},
	],
};
