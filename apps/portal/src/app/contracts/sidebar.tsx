import type { SideBar } from "@/components/Layouts/DocLayout";
import {
  ContractDeployIcon,
  ContractExploreIcon,
  ContractModularContractIcon,
  ContractPublishIcon,
} from "@/icons";

const prebuiltSlug = "/contracts/explore/pre-built-contracts";
const prebuiltModular = "/contracts/explore/pre-built-modular";
const modularContractsSlug = "/contracts/modular-contracts";
const deploySlug = "/contracts/deploy";
const publishSlug = "/contracts/publish";
const designDocs = "/contracts/design-docs";
const modulesContractsSlug = "/contracts/modular-contracts/module-contracts";
const coreContractsSlug = "/contracts/modular-contracts/core-contracts";

// TODO: Deprecate links that start with the following slugs
const buildSlug = "/contracts/build";
const extensionsSlug = "/contracts/build/extensions";
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
          href: "/contracts/explore/overview",
        },
        {
          name: "Pre-built Modular",
          links: [
            {
              name: "ERC-20",
              links: [
                {
                  name: "Token",
                  href: `${prebuiltModular}/token`,
                },
                {
                  name: "Token Drop",
                  href: `${prebuiltModular}/token-drop`,
                },
              ],
            },
            {
              name: "ERC-721",
              links: [
                {
                  name: "NFT Collection",
                  href: `${prebuiltModular}/nft-collection`,
                },
                {
                  name: "NFT Drop",
                  href: `${prebuiltModular}/nft-drop`,
                },
                {
                  name: "Open Edition",
                  href: `${prebuiltModular}/open-edition`,
                },
              ],
            },
            {
              name: "ERC-1155",
              links: [
                {
                  name: "Edition",
                  href: `${prebuiltModular}/edition`,
                },
                {
                  name: "Edition Drop",
                  href: `${prebuiltModular}/edition-drop`,
                },
              ],
            },
          ],
        },
        {
          name: "Pre-built Standard",
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
          name: "How it works",
          href: `${modularContractsSlug}/how-it-works`,
        },
        {
          name: "Get Started",
          href: `${modularContractsSlug}/get-started`,
          links: [
            {
              name: "Create a Core Contract",
              href: `${modularContractsSlug}/get-started/create-core-contract`,
            },
            {
              name: "Create a Module Contract",
              href: `${modularContractsSlug}/get-started/create-module-contract`,
            },
            {
              name: "Deploy a Modular Contract",
              href: `${modularContractsSlug}/get-started/deploy-modular-contract`,
            },
          ],
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
                    },
                  ],
                },
                {
                  name: "Miscellaneous",
                  links: [
                    {
                      name: "TransferableERC20",
                      href: `${modulesContractsSlug}/erc-20/misc/transferableERC20`,
                    },
                    {
                      name: "CreatorTokenERC20",
                      href: `${modulesContractsSlug}/erc-20/misc/creatorTokenERC20`,
                    },
                  ],
                },
              ],
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
                      name: "OpenEditionMetadataERC721",
                      href: `${modulesContractsSlug}/erc-721/metadata/openEditionMetadataERC721`,
                    },
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
                    },
                  ],
                },
                {
                  name: "Miscellaneous",
                  links: [
                    {
                      name: "RoyaltyERC721",
                      href: `${modulesContractsSlug}/erc-721/misc/royaltyERC721`,
                    },
                    {
                      name: "TransferableERC721",
                      href: `${modulesContractsSlug}/erc-721/misc/transferableERC721`,
                    },
                  ],
                },
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
                    },
                  ],
                },
                {
                  name: "Miscellaneous",
                  links: [
                    {
                      name: "RoyaltyERC1155",
                      href: `${modulesContractsSlug}/erc-1155/misc/royaltyERC1155`,
                    },
                    {
                      name: "TransferableERC1155",
                      href: `${modulesContractsSlug}/erc-1155/misc/transferableERC1155`,
                    },
                    {
                      name: "SequentialTokenIdERC1155",
                      href: `${modulesContractsSlug}/erc-1155/misc/sequentialTokenIdERC1155`,
                    },
                  ],
                },
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
        // extensions
        {
          name: "Extensions",
          href: `${extensionsSlug}`,
          links: [
            {
              name: "General",
              links: [
                {
                  name: "BatchMintMetadata",
                  href: `${extensionsSlug}/general/BatchMintMetadata`,
                },
                {
                  name: "ContractMetadata",
                  href: `${extensionsSlug}/general/ContractMetadata`,
                },
                {
                  name: "DelayedReveal",
                  href: `${extensionsSlug}/general/DelayedReveal`,
                },
                {
                  name: "Drop",
                  href: `${extensionsSlug}/general/Drop`,
                },
                {
                  name: "DropSinglePhase",
                  href: `${extensionsSlug}/general/DropSinglePhase`,
                },
                {
                  name: "LazyMint",
                  href: `${extensionsSlug}/general/LazyMint`,
                },
                {
                  name: "Multicall",
                  href: `${extensionsSlug}/general/Multicall`,
                },
                {
                  name: "Ownable",
                  href: `${extensionsSlug}/general/Ownable`,
                },
                {
                  name: "Permissions",
                  href: `${extensionsSlug}/general/Permissions`,
                },
                {
                  name: "PermissionsEnumerable",
                  href: `${extensionsSlug}/general/PermissionsEnumerable`,
                },
                {
                  name: "PlatformFee",
                  href: `${extensionsSlug}/general/PlatformFee`,
                },
                {
                  name: "PrimarySale",
                  href: `${extensionsSlug}/general/PrimarySale`,
                },
                {
                  name: "Royalty",
                  href: `${extensionsSlug}/general/Royalty`,
                },
              ],
            },
            {
              name: "ERC-20",
              links: [
                {
                  name: "ERC20",
                  href: `${extensionsSlug}/erc-20/ERC20`,
                },
                {
                  name: "ERC20BatchMintable",
                  href: `${extensionsSlug}/erc-20/ERC20BatchMintable`,
                },
                {
                  name: "ERC20Burnable",
                  href: `${extensionsSlug}/erc-20/ERC20Burnable`,
                },
                {
                  name: "ERC20ClaimConditions",
                  href: `${extensionsSlug}/erc-20/ERC20ClaimConditions`,
                },
                {
                  name: "ERC20ClaimPhases",
                  href: `${extensionsSlug}/erc-20/ERC20ClaimPhases`,
                },
                {
                  name: "ERC20Mintable",
                  href: `${extensionsSlug}/erc-20/ERC20Mintable`,
                },
                {
                  name: "ERC20Permit",
                  href: `${extensionsSlug}/erc-20/ERC20Permit`,
                },
                {
                  name: "ERC20SignatureMint",
                  href: `${extensionsSlug}/erc-20/ERC20SignatureMint`,
                },
                {
                  name: "ERC20Staking",
                  href: `${extensionsSlug}/erc-20/ERC20Staking`,
                },
              ],
            },
            {
              name: "ERC-721",
              links: [
                {
                  name: "ERC721",
                  href: `${extensionsSlug}/erc-721/ERC721`,
                },
                {
                  name: "ERC721BatchMintable",
                  href: `${extensionsSlug}/erc-721/ERC721BatchMintable`,
                },
                {
                  name: "ERC721Burnable",
                  href: `${extensionsSlug}/erc-721/ERC721Burnable`,
                },
                {
                  name: "ERC721ClaimConditions",
                  href: `${extensionsSlug}/erc-721/ERC721ClaimConditions`,
                },
                {
                  name: "ERC721ClaimCustom",
                  href: `${extensionsSlug}/erc-721/ERC721ClaimCustom`,
                },
                {
                  name: "ERC721ClaimPhases",
                  href: `${extensionsSlug}/erc-721/ERC721ClaimPhases`,
                },
                {
                  name: "ERC721Claimable",
                  href: `${extensionsSlug}/erc-721/ERC721Claimable`,
                },
                {
                  name: "ERC721Enumerable",
                  href: `${extensionsSlug}/erc-721/ERC721Enumerable`,
                },
                {
                  name: "ERC721Mintable",
                  href: `${extensionsSlug}/erc-721/ERC721Mintable`,
                },
                {
                  name: "ERC721Revealable",
                  href: `${extensionsSlug}/erc-721/ERC721Revealable`,
                },
                {
                  name: "ERC721SignatureMint",
                  href: `${extensionsSlug}/erc-721/ERC721SignatureMint`,
                },
                {
                  name: "ERC721Staking",
                  href: `${extensionsSlug}/erc-721/ERC721Staking`,
                },
                {
                  name: "ERC721Supply",
                  href: `${extensionsSlug}/erc-721/ERC721Supply`,
                },
              ],
            },
            {
              name: "ERC-1155",
              links: [
                {
                  name: "ERC1155",
                  href: `${extensionsSlug}/erc-1155/ERC1155`,
                },
                {
                  name: "ERC1155BatchMintable",
                  href: `${extensionsSlug}/erc-1155/ERC1155BatchMintable`,
                },
                {
                  name: "ERC1155Burnable",
                  href: `${extensionsSlug}/erc-1155/ERC1155Burnable`,
                },
                {
                  name: "ERC1155ClaimConditions",
                  href: `${extensionsSlug}/erc-1155/ERC1155ClaimConditions`,
                },
                {
                  name: "ERC1155ClaimCustom",
                  href: `${extensionsSlug}/erc-1155/ERC1155ClaimCustom`,
                },
                {
                  name: "ERC1155ClaimPhases",
                  href: `${extensionsSlug}/erc-1155/ERC1155ClaimPhases`,
                },
                {
                  name: "ERC1155Claimable",
                  href: `${extensionsSlug}/erc-1155/ERC1155Claimable`,
                },
                {
                  name: "ERC1155Drop",
                  href: `${extensionsSlug}/erc-1155/ERC1155Drop`,
                },
                {
                  name: "ERC1155DropSinglePhase",
                  href: `${extensionsSlug}/erc-1155/ERC1155DropSinglePhase`,
                },
                {
                  name: "ERC1155Enumerable",
                  href: `${extensionsSlug}/erc-1155/ERC1155Enumerable`,
                },
                {
                  name: "ERC1155Mintable",
                  href: `${extensionsSlug}/erc-1155/ERC1155Mintable`,
                },
                {
                  name: "ERC1155Revealable",
                  href: `${extensionsSlug}/erc-1155/ERC1155Revealable`,
                },
                {
                  name: "ERC1155SignatureMint",
                  href: `${extensionsSlug}/erc-1155/ERC1155SignatureMint`,
                },
                {
                  name: "ERC1155Staking",
                  href: `${extensionsSlug}/erc-1155/ERC1155Staking`,
                },
                {
                  name: "ERC1155Supply",
                  href: `${extensionsSlug}/erc-1155/ERC1155Supply`,
                },
              ],
            },
            {
              name: "ERC-4337",
              links: [
                {
                  name: "AccountModule",
                  href: `${extensionsSlug}/erc-4337/AccountModule`,
                },
                {
                  name: "SmartWallet",
                  href: `${extensionsSlug}/erc-4337/SmartWallet`,
                },
                {
                  name: "SmartWalletFactory",
                  href: `${extensionsSlug}/erc-4337/SmartWalletFactory`,
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
