import { SideBar } from "@/components/Layouts/DocLayout";
import {
	ContractModularContractIcon,
	ContractInteractIcon,
	ContractExploreIcon,
	ContractDeployIcon,
	ContractPublishIcon,
} from "@/icons";

const prebuiltSlug = "/contracts/explore/pre-built-contracts";
const modularContractsSlug = "/contracts/modular-contracts";
const deploySlug = "/contracts/deploy";
const publishSlug = "/contracts/publish";
const designDocs = "/contracts/design-docs";
const modulesContractsSlug = "/contracts/modular-contracts/module-contracts";
const coreContractsSlug = "/contracts/modular-contracts/core-contracts";

// TODO: Deprecate links that start with the following slugs
const buildSlug = "/contracts/build";
const interactSlug = "/contracts/interact";
const modulesSlug = "/contracts/build/modules";
const baseContractsSlug = "/contracts/build/base-contracts";

export const sidebar: SideBar = {
	name: "Contracts",
	links: [
		{
			name: "Overview",
			href: "/contracts",
		},
		{ separator: true },
		// explore
		{
			name: "Explore",
			icon: <ContractExploreIcon />,
			isCollapsible: false,
			links: [
				{
					name: "Overview",
					href: `/contracts/explore/overview`,
				},
				{
					name: "Pre-built Contracts",
					links: [
						{
							name: "ERC-20",
							links: [
								{
									name: "Token",
									href: `${prebuiltSlug}/token`,
								},
								{
									name: "Token Drop",
									href: `${prebuiltSlug}/token-drop`,
								},
								{
									name: "Stake ERC-20",
									href: `${prebuiltSlug}/stake-erc20`,
								},
								{
									name: "Airdrop ERC-20",
									href: `${prebuiltSlug}/airdrop-erc20`,
								},
								{
									name: "Airdrop ERC-20 (Claimable)",
									href: `${prebuiltSlug}/airdrop-erc20-claimable`,
								},
							],
						},
						{
							name: "ERC-721",
							links: [
								{
									name: "NFT Collection",
									href: `${prebuiltSlug}/nft-collection`,
								},
								{
									name: "NFT Drop",
									href: `${prebuiltSlug}/nft-drop`,
								},
								{
									name: "Loyalty Card",
									href: `${prebuiltSlug}/loyalty-card`,
								},
								{
									name: "Open Edition",
									href: `${prebuiltSlug}/open-edition`,
								},
								{
									name: "Stake ERC-721",
									href: `${prebuiltSlug}/stake-erc721`,
								},
								{
									name: "Airdrop ERC-721",
									href: `${prebuiltSlug}/airdrop-erc721`,
								},
								{
									name: "Airdrop ERC-721 (Claimable)",
									href: `${prebuiltSlug}/airdrop-erc721-claimable`,
								},
							],
						},
						{
							name: "ERC-1155",
							links: [
								{
									name: "Edition",
									href: `${prebuiltSlug}/edition`,
								},
								{
									name: "Edition Drop",
									href: `${prebuiltSlug}/edition-drop`,
								},
								{
									name: "Stake ERC-1155",
									href: `${prebuiltSlug}/stake-erc1155`,
								},
								{
									name: "Airdrop ERC-1155",
									href: `${prebuiltSlug}/airdrop-erc1155`,
								},
								{
									name: "Airdrop ERC-1155 (Claimable)",
									href: `${prebuiltSlug}/airdrop-erc1155-claimable`,
								},
							],
						},
						{
							name: "ERC-4337",
							links: [
								{
									name: "Account Factory",
									href: `${prebuiltSlug}/account-factory`,
								},
								{
									name: "Managed Account Factory",
									href: `${prebuiltSlug}/managed-account-factory`,
								},
							],
						},
						{
							name: "MISC.",
							links: [
								{
									name: "Marketplace",
									href: `${prebuiltSlug}/marketplace`,
								},
								{
									name: "Multiwrap",
									href: `${prebuiltSlug}/multiwrap`,
								},
								{
									name: "Pack",
									href: `${prebuiltSlug}/pack`,
								},
								{
									name: "Split",
									href: `${prebuiltSlug}/split`,
								},
								{
									name: "Vote",
									href: `${prebuiltSlug}/vote`,
								},
							],
						},
					],
				},
			],
		},
		{ separator: true },
		// modular contracts

		{
			name: "Modular Contracts",
			icon: <ContractModularContractIcon />,
			isCollapsible: false,
			links: [
				{
					name: "Overview",
					href: `${modularContractsSlug}/overview`,
				},
				{
					name: "Get Started",
					href: `${modularContractsSlug}/get-started`,
				},
				{
					name: "How it works",
					href: `${modularContractsSlug}/how-it-works`,
				},
				// core contracts
				{
					name: "Core Contracts",
					links: [
						{
							name: "ERC-20",
							href: `${coreContractsSlug}/erc-20`,
						},
						{
							name: "ERC-721",
							href: `${coreContractsSlug}/erc-721`,
						},
						{
							name: "ERC-1155",
							href: `${coreContractsSlug}/erc-1155`,
						},
					],
				},
				// modules
				{
					name: "Module Contracts",
					links: [
						{
							name: "ERC-20",
							links: [
								{
									name: "Minting",
									links: [
										{
											name: "ClaimableERC20",
											href: `${modulesContractsSlug}/erc-20/minting/claimableERC20`,
										},
										{
											name: "MintableERC20",
											href: `${modulesContractsSlug}/erc-20/minting/mintableERC20`,
										}
									]
								},
								{
									name: "Misc",
									links: [
										{
											name: "TransferableERC20",
											href: `${modulesContractsSlug}/erc-20/misc/transferableERC20`,
										}
									]
								}
							]
						},
						{
							name: "ERC-721",
							links: [
								{
									name: "Metadata",
									links: [
										{
											name: "BatchMetadataERC721",
											href: `${modulesContractsSlug}/erc-721/metadata/batchMetadataERC721`,
										},
										{
											name: "DelayedRevealBatchMetadataERC721",
											href: `${modulesContractsSlug}/erc-721/metadata/delayedRevealBatchMetadataERC721`,
										},
										{
											name: "OpenEditionMetadataERC721",
											href: `${modulesContractsSlug}/erc-721/metadata/openEditionMetadataERC721`,
										},
										{
											name: "SimpleMetadtaERC721",
											href: `${modulesContractsSlug}/erc-721/metadata/simpleMetadataERC721`,
										}
									],
								},
								{
									name: "Minting",
									links: [
										{
											name: "ClaimableERC721",
											href: `${modulesContractsSlug}/erc-721/minting/claimableERC721`,
										},
										{
											name: "MintableERC721",
											href: `${modulesContractsSlug}/erc-721/minting/mintableERC721`,
										}
									],
								},
								{
									name: "Misc",
									links: [
										{
											name: "RoyaltyERC721",
											href: `${modulesContractsSlug}/erc-721/misc/royaltyERC721`,
										},
										{
											name: "TransferableERC721",
											href: `${modulesContractsSlug}/erc-721/misc/transferableERC721`,
										}
									],
								}
							],
						},
						{
							name: "ERC-1155",
							links: [
								{
									name: "Metadata",
									links: [
										{
											name: "BatchMetadataERC1155",
											href: `${modulesContractsSlug}/erc-1155/metadata/batchMetadataERC1155`,
										},
										{
											name: "OpenEditionMetadataERC1155",
											href: `${modulesContractsSlug}/erc-1155/metadata/openEditionMetadataERC1155`,
										},
										{
											name: "SimpleMetadataERC1155",
											href: `${modulesContractsSlug}/erc-1155/metadata/simpleMetadataERC1155`,
										}
									],
								},
								{
									name: "Minting",
									links: [
										{
											name: "ClaimableERC1155",
											href: `${modulesContractsSlug}/erc-1155/minting/claimableERC1155`,
										},
										{
											name: "MintableERC1155",
											href: `${modulesContractsSlug}/erc-1155/minting/mintableERC1155`,
										}
									],
								},
								{
									name: "Misc",
									links: [
										{
											name: "RoyaltyERC1155",
											href: `${modulesContractsSlug}/erc-1155/misc/royaltyERC1155`,
										},
										{
											name: "TransferableERC1155",
											href: `${modulesContractsSlug}/erc-1155/misc/transferableERC1155`,
										}
									],
								}
							],
						},
					],
				},
			],
		},

		{ separator: true },
		// build
		{
			name: "Build",
			icon: <ContractModularContractIcon />,
			isCollapsible: false,
			links: [
				{
					name: "Overview",
					href: `${buildSlug}/overview`,
				},
				{
					name: "Get Started",
					href: `${buildSlug}/get-started`,
				},
				// modular contracts
				{
					name: "Modular Contracts",
					href: `${buildSlug}/modular-contracts`,
				},
				// base contracts
				{
					name: "Base Contracts",
					href: `${baseContractsSlug}`,
					links: [
						{
							name: "ERC-20",
							links: [
								{
									name: "Base",
									href: `${baseContractsSlug}/erc-20/base`,
								},
								{
									name: "Drop",
									href: `${baseContractsSlug}/erc-20/drop`,
								},
								{
									name: "Drop Vote",
									href: `${baseContractsSlug}/erc-20/drop-vote`,
								},
								{
									name: "Signature Mint",
									href: `${baseContractsSlug}/erc-20/signature-mint`,
								},
								{
									name: "Signature Mint Vote",
									href: `${baseContractsSlug}/erc-20/signature-mint-vote`,
								},
								{
									name: "Vote",
									href: `${baseContractsSlug}/erc-20/vote`,
								},
							],
						},
						{
							name: "ERC-721",
							links: [
								{
									name: "Base",
									href: `${baseContractsSlug}/erc-721/base`,
								},
								{
									name: "Delayed Reveal",
									href: `${baseContractsSlug}/erc-721/delayed-reveal`,
								},
								{
									name: "Drop",
									href: `${baseContractsSlug}/erc-721/drop`,
								},
								{
									name: "Lazy Mint",
									href: `${baseContractsSlug}/erc-721/lazy-mint`,
								},
								{
									name: "Signature Mint",
									href: `${baseContractsSlug}/erc-721/signature-mint`,
								},
							],
						},
						{
							name: "ERC-1155",
							links: [
								{
									name: "Base",
									href: `${baseContractsSlug}/erc-1155/base`,
								},
								{
									name: "Delayed Reveal",
									href: `${baseContractsSlug}/erc-1155/delayed-reveal`,
								},
								{
									name: "Drop",
									href: `${baseContractsSlug}/erc-1155/drop`,
								},
								{
									name: "Lazy Mint",
									href: `${baseContractsSlug}/erc-1155/lazy-mint`,
								},
								{
									name: "Signature Mint",
									href: `${baseContractsSlug}/erc-1155/signature-mint`,
								},
							],
						},
						{
							name: "ERC-4337",
							href: `${baseContractsSlug}/erc-4337`,
							links: [
								{
									name: "Account",
									href: `${baseContractsSlug}/erc-4337/account`,
								},
								{
									name: "Account Factory",
									href: `${baseContractsSlug}/erc-4337/account-factory`,
								},
								{
									name: "Managed Account",
									href: `${baseContractsSlug}/erc-4337/managed-account`,
								},
								{
									name: "Managed Account Factory",
									href: `${baseContractsSlug}/erc-4337/managed-account-factory`,
								},
							],
						},
					],
				},
				// modules
				{
					name: "Modules",
					href: `${modulesSlug}`,
					links: [
						{
							name: "General",
							links: [
								{
									name: "BatchMintMetadata",
									href: `${modulesSlug}/general/BatchMintMetadata`,
								},
								{
									name: "ContractMetadata",
									href: `${modulesSlug}/general/ContractMetadata`,
								},
								{
									name: "DelayedReveal",
									href: `${modulesSlug}/general/DelayedReveal`,
								},
								{
									name: "Drop",
									href: `${modulesSlug}/general/Drop`,
								},
								{
									name: "DropSinglePhase",
									href: `${modulesSlug}/general/DropSinglePhase`,
								},
								{
									name: "LazyMint",
									href: `${modulesSlug}/general/LazyMint`,
								},
								{
									name: "Multicall",
									href: `${modulesSlug}/general/Multicall`,
								},
								{
									name: "Ownable",
									href: `${modulesSlug}/general/Ownable`,
								},
								{
									name: "Permissions",
									href: `${modulesSlug}/general/Permissions`,
								},
								{
									name: "PermissionsEnumerable",
									href: `${modulesSlug}/general/PermissionsEnumerable`,
								},
								{
									name: "PlatformFee",
									href: `${modulesSlug}/general/PlatformFee`,
								},
								{
									name: "PrimarySale",
									href: `${modulesSlug}/general/PrimarySale`,
								},
								{
									name: "Royalty",
									href: `${modulesSlug}/general/Royalty`,
								},
							],
						},
						{
							name: "ERC-20",
							links: [
								{
									name: "ERC20",
									href: `${modulesSlug}/erc-20/ERC20`,
								},
								{
									name: "ERC20BatchMintable",
									href: `${modulesSlug}/erc-20/ERC20BatchMintable`,
								},
								{
									name: "ERC20Burnable",
									href: `${modulesSlug}/erc-20/ERC20Burnable`,
								},
								{
									name: "ERC20ClaimConditions",
									href: `${modulesSlug}/erc-20/ERC20ClaimConditions`,
								},
								{
									name: "ERC20ClaimPhases",
									href: `${modulesSlug}/erc-20/ERC20ClaimPhases`,
								},
								{
									name: "ERC20Mintable",
									href: `${modulesSlug}/erc-20/ERC20Mintable`,
								},
								{
									name: "ERC20Permit",
									href: `${modulesSlug}/erc-20/ERC20Permit`,
								},
								{
									name: "ERC20SignatureMint",
									href: `${modulesSlug}/erc-20/ERC20SignatureMint`,
								},
								{
									name: "ERC20Staking",
									href: `${modulesSlug}/erc-20/ERC20Staking`,
								},
							],
						},
						{
							name: "ERC-721",
							links: [
								{
									name: "ERC721",
									href: `${modulesSlug}/erc-721/ERC721`,
								},
								{
									name: "ERC721BatchMintable",
									href: `${modulesSlug}/erc-721/ERC721BatchMintable`,
								},
								{
									name: "ERC721Burnable",
									href: `${modulesSlug}/erc-721/ERC721Burnable`,
								},
								{
									name: "ERC721ClaimConditions",
									href: `${modulesSlug}/erc-721/ERC721ClaimConditions`,
								},
								{
									name: "ERC721ClaimCustom",
									href: `${modulesSlug}/erc-721/ERC721ClaimCustom`,
								},
								{
									name: "ERC721ClaimPhases",
									href: `${modulesSlug}/erc-721/ERC721ClaimPhases`,
								},
								{
									name: "ERC721Claimable",
									href: `${modulesSlug}/erc-721/ERC721Claimable`,
								},
								{
									name: "ERC721Enumerable",
									href: `${modulesSlug}/erc-721/ERC721Enumerable`,
								},
								{
									name: "ERC721Mintable",
									href: `${modulesSlug}/erc-721/ERC721Mintable`,
								},
								{
									name: "ERC721Revealable",
									href: `${modulesSlug}/erc-721/ERC721Revealable`,
								},
								{
									name: "ERC721SignatureMint",
									href: `${modulesSlug}/erc-721/ERC721SignatureMint`,
								},
								{
									name: "ERC721Staking",
									href: `${modulesSlug}/erc-721/ERC721Staking`,
								},
								{
									name: "ERC721Supply",
									href: `${modulesSlug}/erc-721/ERC721Supply`,
								},
							],
						},
						{
							name: "ERC-1155",
							links: [
								{
									name: "ERC1155",
									href: `${modulesSlug}/erc-1155/ERC1155`,
								},
								{
									name: "ERC1155BatchMintable",
									href: `${modulesSlug}/erc-1155/ERC1155BatchMintable`,
								},
								{
									name: "ERC1155Burnable",
									href: `${modulesSlug}/erc-1155/ERC1155Burnable`,
								},
								{
									name: "ERC1155ClaimConditions",
									href: `${modulesSlug}/erc-1155/ERC1155ClaimConditions`,
								},
								{
									name: "ERC1155ClaimCustom",
									href: `${modulesSlug}/erc-1155/ERC1155ClaimCustom`,
								},
								{
									name: "ERC1155ClaimPhases",
									href: `${modulesSlug}/erc-1155/ERC1155ClaimPhases`,
								},
								{
									name: "ERC1155Claimable",
									href: `${modulesSlug}/erc-1155/ERC1155Claimable`,
								},
								{
									name: "ERC1155Drop",
									href: `${modulesSlug}/erc-1155/ERC1155Drop`,
								},
								{
									name: "ERC1155DropSinglePhase",
									href: `${modulesSlug}/erc-1155/ERC1155DropSinglePhase`,
								},
								{
									name: "ERC1155Enumerable",
									href: `${modulesSlug}/erc-1155/ERC1155Enumerable`,
								},
								{
									name: "ERC1155Mintable",
									href: `${modulesSlug}/erc-1155/ERC1155Mintable`,
								},
								{
									name: "ERC1155Revealable",
									href: `${modulesSlug}/erc-1155/ERC1155Revealable`,
								},
								{
									name: "ERC1155SignatureMint",
									href: `${modulesSlug}/erc-1155/ERC1155SignatureMint`,
								},
								{
									name: "ERC1155Staking",
									href: `${modulesSlug}/erc-1155/ERC1155Staking`,
								},
								{
									name: "ERC1155Supply",
									href: `${modulesSlug}/erc-1155/ERC1155Supply`,
								},
							],
						},
						{
							name: "ERC-4337",
							links: [
								{
									name: "AccountModule",
									href: `${modulesSlug}/erc-4337/AccountModule`,
								},
								{
									name: "SmartWallet",
									href: `${modulesSlug}/erc-4337/SmartWallet`,
								},
								{
									name: "SmartWalletFactory",
									href: `${modulesSlug}/erc-4337/SmartWalletFactory`,
								},
							],
						},
					],
				},
			],
		},
		{ separator: true },
		// deploy
		{
			name: "Deploy",
			icon: <ContractDeployIcon />,
			isCollapsible: false,
			links: [
				{
					name: "Overview",
					href: `${deploySlug}/overview`,
				},
				{
					name: "Deploy Contract",
					href: `${deploySlug}/deploy-contract`,
				},
				{
					name: "CLI Reference",
					href: `${deploySlug}/reference`,
				},
			],
		},
		{ separator: true },
		// interact
		{
			name: "Interact",
			icon: <ContractInteractIcon />,
			isCollapsible: false,
			links: [
				{
					name: "Overview",
					href: `${interactSlug}/overview`,
				},
				{
					name: "References",
					links: [
						{
							name: "TypeScript",
							href: "/typescript/v5",
						},
						{
							name: "Unity",
							href: "/unity",
						},
					],
				},
			],
		},
		{ separator: true },
		// publish
		{
			name: "Publish",
			icon: <ContractPublishIcon />,
			isCollapsible: false,
			links: [
				{
					name: "Overview",
					href: `${publishSlug}/overview`,
				},
				{
					name: "Publish Contract",
					href: `${publishSlug}/publish-contract`,
				},
				{
					name: "Publish Options",
					href: `${publishSlug}/publish-options`,
				},
				{
					name: "CLI Reference",
					href: `${publishSlug}/reference`,
				},
			],
		},
		{ separator: true },
		// resources
		{
			name: "Resources",
			isCollapsible: false,
			links: [
				{
					name: "Design Docs",
					links: [
						{
							name: "Modular Contracts",
							href: `${designDocs}/modular-contracts`,
						},
						{
							name: "Drop",
							href: `${designDocs}/drop`,
						},
						{
							name: "Marketplace",
							href: `${designDocs}/marketplace`,
						},
						{
							name: "Multiwrap",
							href: `${designDocs}/multiwrap`,
						},
						{
							name: "Pack",
							href: `${designDocs}/pack`,
						},
						{
							name: "Signature Mint",
							href: `${designDocs}/signature-mint`,
						},
					],
				},
			],
		},
	],
};
