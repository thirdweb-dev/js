import { SideBar } from "@/components/Layouts/DocLayout";
import { SidebarLink } from "@/components/others/Sidebar";
import { ZapIcon } from "lucide-react";

const walletProviders: SidebarLink = (() => {
	const parentSlug = "/unity/wallets/providers";
	return {
		name: "Wallet Providers",
		links: [
			{
				name: "In-App Wallet",
				href: `${parentSlug}/in-app-wallet`,
			},
			{
				name: "Account Abstraction",
				href: `${parentSlug}/account-abstraction`,
			},
			{
				name: "Local Wallet",
				href: `${parentSlug}/local-wallet`,
			},
			{
				name: "MetaMask Wallet",
				href: `${parentSlug}/metamask`,
			},
			{
				name: "Coinbase Wallet",
				href: `${parentSlug}/coinbase`,
			},
			{
				name: "WalletConnect",
				href: `${parentSlug}/walletconnect`,
			},
			{
				name: "HyperPlay",
				href: `${parentSlug}/hyperplay`,
			},
			{
				name: "Rabby",
				href: `${parentSlug}/rabby`,
			},
		],
	};
})();

const walletActions: SidebarLink = (() => {
	const parentSlug = "/unity/wallets/actions";
	return {
		name: "Wallet Actions",
		links: [
			{
				name: "Connect",
				href: `${parentSlug}/connect`,
			},
			{
				name: "Disconnect",
				href: `${parentSlug}/disconnect`,
			},
			{
				name: "Authenticate",
				href: `${parentSlug}/authenticate`,
			},
			{
				name: "GetAddress",
				href: `${parentSlug}/getaddress`,
			},
			{
				name: "GetBalance",
				href: `${parentSlug}/getbalance`,
			},
			{
				name: "GetChainID",
				href: `${parentSlug}/getchainid`,
			},
			{
				name: "IsConnected",
				href: `${parentSlug}/isconnected`,
			},
			{
				name: "RecoverAddress",
				href: `${parentSlug}/recoveraddress`,
			},
			{
				name: "SendRawTransaction",
				href: `${parentSlug}/sendrawtransaction`,
			},
			{
				name: "ExecuteRawTransaction",
				href: `${parentSlug}/executerawtransaction`,
			},
			{
				name: "Sign",
				href: `${parentSlug}/sign`,
			},
			{
				name: "SwitchNetwork",
				href: `${parentSlug}/switchnetwork`,
			},
			{
				name: "Transfer",
				href: `${parentSlug}/transfer`,
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
				name: "CreateSessionKey",
				href: `${parentSlug}/createsessionkey`,
			},
			{
				name: "RevokeSessionKey",
				href: `${parentSlug}/revokesessionkey`,
			},
			{
				name: "GetAllActiveSigners",
				href: `${parentSlug}/getallactivesigners`,
			},
			{
				name: "GetEmail",
				href: `${parentSlug}/getemail`,
			},
			{
				name: "GetNonce",
				href: `${parentSlug}/getnonce`,
			},
			{
				name: "GetSignerAddress",
				href: `${parentSlug}/getsigneraddress`,
			},
			{
				name: "SignTypedDataV4",
				href: `${parentSlug}/signtypeddatav4`,
			},
		],
	};
})();

const wallets: SidebarLink = (() => {
	const parentSlug = "/unity/wallets";
	return {
		name: "Wallets",
		isCollapsible: false,
		links: [
			{ name: "Prefab", href: `${parentSlug}/prefab` },
			walletProviders,
			walletActions,
			{ name: "Submit Wallet", href: `${parentSlug}/submission` },
		],
	};
})();

const contractEvents: SidebarLink = (() => {
	const parentSlug = "/unity/contracts/events";
	return {
		name: "Events",
		links: [
			{
				name: "Get",
				href: `${parentSlug}/get`,
			},
			{
				name: "Get All",
				href: `${parentSlug}/getall`,
			},
			{
				name: "ListenToAll",
				href: `${parentSlug}/listentoall`,
			},
			{
				name: "RemoveAllListeners",
				href: `${parentSlug}/removealllisteners`,
			},
		],
	};
})();

const contract20: SidebarLink = (() => {
	const parentSlug = "/unity/contracts/erc20";
	return {
		name: "ERC20",
		links: [
			{
				name: "ERC20",
				href: `${parentSlug}/erc20`,
			},
			{
				name: "ERC20Burnable",
				href: `${parentSlug}/erc20burnable`,
			},
			{
				name: "ERC20ClaimConditions",
				href: `${parentSlug}/erc20claimconditions`,
			},
			{
				name: "ERC20Mintable",
				href: `${parentSlug}/erc20mintable`,
			},
			{
				name: "ERC20SignatureMintable",
				href: `${parentSlug}/erc20signaturemintable`,
			},
		],
	};
})();

const contract721: SidebarLink = (() => {
	const parentSlug = "/unity/contracts/erc721";
	return {
		name: "ERC721",
		links: [
			{
				name: "ERC721",
				href: `${parentSlug}/erc721`,
			},
			{
				name: "ERC721Burnable",
				href: `${parentSlug}/erc721burnable`,
			},
			{
				name: "ERC721ClaimConditions",
				href: `${parentSlug}/erc721claimconditions`,
			},
			{
				name: "ERC721Enumerable",
				href: `${parentSlug}/erc721enumerable`,
			},
			{
				name: "ERC721Mintable",
				href: `${parentSlug}/erc721mintable`,
			},
			{
				name: "ERC721SignatureMintable",
				href: `${parentSlug}/erc721signaturemintable`,
			},

			{
				name: "ERC721Supply",
				href: `${parentSlug}/erc721supply`,
			},
		],
	};
})();

const contract1155: SidebarLink = (() => {
	const parentSlug = "/unity/contracts/erc1155";
	return {
		name: "ERC1155",
		links: [
			{
				name: "ERC1155",
				href: `${parentSlug}/erc1155`,
			},
			{
				name: "ERC1155Burnable",
				href: `${parentSlug}/erc1155burnable`,
			},
			{
				name: "ERC1155ClaimConditions",
				href: `${parentSlug}/erc1155claimconditions`,
			},
			{
				name: "ERC1155Enumerable",
				href: `${parentSlug}/erc1155enumerable`,
			},
			{
				name: "ERC1155Mintable",
				href: `${parentSlug}/erc1155mintable`,
			},
			{
				name: "ERC1155SignatureMintable",
				href: `${parentSlug}/erc1155signaturemintable`,
			},
		],
	};
})();

const blocks: SidebarLink = {
	name: "Blocks",
	links: [
		{
			name: "Get Block",
			href: "/unity/blocks/getblock",
		},
		{
			name: "Get Block With Transactions",
			href: "/unity/blocks/getblockwithtransactions",
		},
		{
			name: "Get Latest Block Number",
			href: "/unity/blocks/getlatestblocknumber",
		},
		{
			name: "Get Latest Block Timestamp",
			href: "/unity/blocks/getlatestblocktimestamp",
		},
	],
};

const contracts: SidebarLink = {
	name: "Blockchain API",
	isCollapsible: false,
	links: [
		{ name: "Overview", href: "/unity/contracts" },
		{
			name: "Get Contract",
			href: "/unity/contracts/get",
		},
		{
			name: "Read Contract",
			href: "/unity/contracts/read",
		},
		{
			name: "Write Contract",
			href: "/unity/contracts/write",
		},
		{
			name: "Transaction Builder",
			href: "/unity/contracts/prepare",
		},
		contract20,
		contract721,
		contract1155,
		{
			name: "Marketplace",
			href: "/unity/contracts/marketplace",
		},
		{
			name: "Pack",
			href: "/unity/contracts/pack",
		},
		contractEvents,
		blocks,
	],
};

const pay: SidebarLink = {
	name: "Pay",
	isCollapsible: false,
	links: [
		{
			name: "Buy With Fiat",
			links: [
				{
					name: "Get Buy With Fiat Quote",
					href: "/unity/pay/getbuywithfiatquote",
				},
				{
					name: "Buy With Fiat",
					href: "/unity/pay/buywithfiat",
				},
				{
					name: "Get Buy With Fiat Status",
					href: "/unity/pay/getbuywithfiatstatus",
				},
				{
					name: "Get Buy With Fiat Currencies",
					href: "/unity/pay/getbuywithfiatcurrencies",
				},
			],
		},
		{
			name: "Buy With Crypto",
			links: [
				{
					name: "Get Buy With Crypto Quote",
					href: "/unity/pay/getbuywithcryptoquote",
				},
				{
					name: "Buy With Crypto",
					href: "/unity/pay/buywithcrypto",
				},
				{
					name: "Get Buy With Crypto Status",
					href: "/unity/pay/getbuywithcryptostatus",
				},
			],
		},
		{
			name: "Get Buy History",
			href: "/unity/pay/getbuyhistory",
		},
	],
};

export const sidebar: SideBar = {
	name: "Unity SDK",
	links: [
		{ separator: true },
		{
			name: "Overview",
			href: "/unity",
		},
		{
			name: "Getting Started",
			href: "/unity/getting-started",
			icon: <ZapIcon />,
		},
		{
			name: "Core",
			isCollapsible: false,
			links: [
				{
					name: "Thirdweb Manager",
					href: "/unity/thirdwebmanager",
				},
				{
					name: "Storage",
					href: "/unity/storage",
				},
			],
		},
		wallets,
		pay,
		contracts,
		// {
		// 	name: "Full Reference",
		// 	href: "/references/unity",
		// },
	],
};
