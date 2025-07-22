import type { SideBar } from "@/components/Layouts/DocLayout";
import { ContractModularContractIcon } from "@/icons";

const prebuiltSlug = "/contracts/explore/pre-built-contracts";
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
  links: [
    {
      href: "/contracts",
      name: "Overview",
    },
    { separator: true },
    {
      isCollapsible: false,
      links: [
        {
          href: `${deploySlug}/overview`,
          name: "Overview",
        },
        {
          href: `${deploySlug}/deploy-contract`,
          name: "Deploy Contract",
        },
        {
          href: `${publishSlug}/publish-contract`,
          name: "Publish Contract",
        },
        {
          href: `${deploySlug}/reference`,
          name: "CLI Reference",
        },
        {
          href: `${publishSlug}/publish-options`,
          name: "Publish Options",
        },
      ],
      name: "Deployment Tools",
    },
    // explore
    {
      isCollapsible: false,
      links: [
        {
          href: "/contracts/explore/overview",
          name: "Overview",
        },

        {
          links: [
            {
              links: [
                {
                  href: `${prebuiltSlug}/token`,
                  name: "Token",
                },
                {
                  href: `${prebuiltSlug}/token-drop`,
                  name: "Token Drop",
                },
                {
                  href: `${prebuiltSlug}/stake-erc20`,
                  name: "Stake ERC-20",
                },
                {
                  href: `${prebuiltSlug}/airdrop-erc20`,
                  name: "Airdrop ERC-20",
                },
                {
                  href: `${prebuiltSlug}/airdrop-erc20-claimable`,
                  name: "Airdrop ERC-20 (Claimable)",
                },
              ],
              name: "ERC-20",
            },
            {
              links: [
                {
                  href: `${prebuiltSlug}/nft-collection`,
                  name: "NFT Collection",
                },
                {
                  href: `${prebuiltSlug}/nft-drop`,
                  name: "NFT Drop",
                },
                {
                  href: `${prebuiltSlug}/loyalty-card`,
                  name: "Loyalty Card",
                },
                {
                  href: `${prebuiltSlug}/open-edition`,
                  name: "Open Edition",
                },
                {
                  href: `${prebuiltSlug}/stake-erc721`,
                  name: "Stake ERC-721",
                },
                {
                  href: `${prebuiltSlug}/airdrop-erc721`,
                  name: "Airdrop ERC-721",
                },
                {
                  href: `${prebuiltSlug}/airdrop-erc721-claimable`,
                  name: "Airdrop ERC-721 (Claimable)",
                },
              ],
              name: "ERC-721",
            },
            {
              links: [
                {
                  href: `${prebuiltSlug}/edition`,
                  name: "Edition",
                },
                {
                  href: `${prebuiltSlug}/edition-drop`,
                  name: "Edition Drop",
                },
                {
                  href: `${prebuiltSlug}/stake-erc1155`,
                  name: "Stake ERC-1155",
                },
                {
                  href: `${prebuiltSlug}/airdrop-erc1155`,
                  name: "Airdrop ERC-1155",
                },
                {
                  href: `${prebuiltSlug}/airdrop-erc1155-claimable`,
                  name: "Airdrop ERC-1155 (Claimable)",
                },
              ],
              name: "ERC-1155",
            },
            {
              links: [
                {
                  href: `${prebuiltSlug}/account-factory`,
                  name: "Account Factory",
                },
                {
                  href: `${prebuiltSlug}/managed-account-factory`,
                  name: "Managed Account Factory",
                },
              ],
              name: "ERC-4337",
            },
            {
              links: [
                {
                  href: `${prebuiltSlug}/marketplace`,
                  name: "Marketplace",
                },
                {
                  href: `${prebuiltSlug}/multiwrap`,
                  name: "Multiwrap",
                },
                {
                  href: `${prebuiltSlug}/split`,
                  name: "Split",
                },
                {
                  href: `${prebuiltSlug}/vote`,
                  name: "Vote",
                },
              ],
              name: "MISC.",
            },
          ],
          name: "Pre-built Standard",
        },
      ],
      name: "Explore (Contract Library)",
    },

    { separator: true },
    // modular contracts
    {
      isCollapsible: false,
      links: [
        {
          href: `${modularContractsSlug}/overview`,
          name: "Overview",
        },
        {
          href: `${modularContractsSlug}/how-it-works`,
          name: "How it works",
        },
        {
          href: `${modularContractsSlug}/get-started`,
          links: [
            {
              href: `${modularContractsSlug}/get-started/create-core-contract`,
              name: "Create a Core Contract",
            },
            {
              href: `${modularContractsSlug}/get-started/create-module-contract`,
              name: "Create a Module Contract",
            },
            {
              href: `${modularContractsSlug}/get-started/deploy-modular-contract`,
              name: "Deploy a Modular Contract",
            },
          ],
          name: "Get Started",
        },
        {
          links: [
            {
              href: `${modularContractsSlug}/tutorials/deploy-erc20-core`,
              name: "Deploy ERC-20 Core",
            },
          ],
          name: "Tutorials",
        },
        // core contracts
        {
          links: [
            {
              href: `${coreContractsSlug}/erc-20`,
              name: "ERC-20",
            },
            {
              href: `${coreContractsSlug}/erc-721`,
              name: "ERC-721",
            },
            {
              href: `${coreContractsSlug}/erc-1155`,
              name: "ERC-1155",
            },
          ],
          name: "Core Contracts",
        },
        // modules
        {
          links: [
            {
              links: [
                {
                  links: [
                    {
                      href: `${modulesContractsSlug}/erc-20/minting/claimableERC20`,
                      name: "ClaimableERC20",
                    },
                    {
                      href: `${modulesContractsSlug}/erc-20/minting/mintableERC20`,
                      name: "MintableERC20",
                    },
                  ],
                  name: "Minting",
                },
                {
                  links: [
                    {
                      href: `${modulesContractsSlug}/erc-20/misc/transferableERC20`,
                      name: "TransferableERC20",
                    },
                    {
                      href: `${modulesContractsSlug}/erc-20/misc/creatorTokenERC20`,
                      name: "CreatorTokenERC20",
                    },
                  ],
                  name: "Miscellaneous",
                },
              ],
              name: "ERC-20",
            },
            {
              links: [
                {
                  links: [
                    {
                      href: `${modulesContractsSlug}/erc-721/metadata/batchMetadataERC721`,
                      name: "BatchMetadataERC721",
                    },
                    {
                      href: `${modulesContractsSlug}/erc-721/metadata/openEditionMetadataERC721`,
                      name: "OpenEditionMetadataERC721",
                    },
                  ],
                  name: "Metadata",
                },
                {
                  links: [
                    {
                      href: `${modulesContractsSlug}/erc-721/minting/claimableERC721`,
                      name: "ClaimableERC721",
                    },
                    {
                      href: `${modulesContractsSlug}/erc-721/minting/mintableERC721`,
                      name: "MintableERC721",
                    },
                  ],
                  name: "Minting",
                },
                {
                  links: [
                    {
                      href: `${modulesContractsSlug}/erc-721/misc/royaltyERC721`,
                      name: "RoyaltyERC721",
                    },
                    {
                      href: `${modulesContractsSlug}/erc-721/misc/transferableERC721`,
                      name: "TransferableERC721",
                    },
                  ],
                  name: "Miscellaneous",
                },
              ],
              name: "ERC-721",
            },
            {
              links: [
                {
                  links: [
                    {
                      href: `${modulesContractsSlug}/erc-1155/metadata/batchMetadataERC1155`,
                      name: "BatchMetadataERC1155",
                    },
                    {
                      href: `${modulesContractsSlug}/erc-1155/metadata/openEditionMetadataERC1155`,
                      name: "OpenEditionMetadataERC1155",
                    },
                  ],
                  name: "Metadata",
                },
                {
                  links: [
                    {
                      href: `${modulesContractsSlug}/erc-1155/minting/claimableERC1155`,
                      name: "ClaimableERC1155",
                    },
                    {
                      href: `${modulesContractsSlug}/erc-1155/minting/mintableERC1155`,
                      name: "MintableERC1155",
                    },
                  ],
                  name: "Minting",
                },
                {
                  links: [
                    {
                      href: `${modulesContractsSlug}/erc-1155/misc/royaltyERC1155`,
                      name: "RoyaltyERC1155",
                    },
                    {
                      href: `${modulesContractsSlug}/erc-1155/misc/transferableERC1155`,
                      name: "TransferableERC1155",
                    },
                    {
                      href: `${modulesContractsSlug}/erc-1155/misc/sequentialTokenIdERC1155`,
                      name: "SequentialTokenIdERC1155",
                    },
                  ],
                  name: "Miscellaneous",
                },
              ],
              name: "ERC-1155",
            },
            {
              links: [
                {
                  href: `${modulesContractsSlug}/cross-chain/agglayer`,
                  name: "Agglayer",
                },
              ],
              name: "Cross-Chain",
            },
          ],
          name: "Module Contracts",
        },
      ],
      name: "Modular Contract Framework",
    },

    { separator: true },
    // build
    {
      icon: <ContractModularContractIcon />,
      isCollapsible: false,
      links: [
        {
          href: `${buildSlug}/overview`,
          name: "Overview",
        },
        {
          href: `${buildSlug}/get-started`,
          name: "Get Started",
        },
        {
          href: `${baseContractsSlug}`,
          links: [
            {
              links: [
                {
                  href: `${baseContractsSlug}/erc-20/base`,
                  name: "Base",
                },
                {
                  href: `${baseContractsSlug}/erc-20/drop`,
                  name: "Drop",
                },
                {
                  href: `${baseContractsSlug}/erc-20/drop-vote`,
                  name: "Drop Vote",
                },
                {
                  href: `${baseContractsSlug}/erc-20/signature-mint`,
                  name: "Signature Mint",
                },
                {
                  href: `${baseContractsSlug}/erc-20/signature-mint-vote`,
                  name: "Signature Mint Vote",
                },
                {
                  href: `${baseContractsSlug}/erc-20/vote`,
                  name: "Vote",
                },
              ],
              name: "ERC-20",
            },
            {
              links: [
                {
                  href: `${baseContractsSlug}/erc-721/base`,
                  name: "Base",
                },
                {
                  href: `${baseContractsSlug}/erc-721/delayed-reveal`,
                  name: "Delayed Reveal",
                },
                {
                  href: `${baseContractsSlug}/erc-721/drop`,
                  name: "Drop",
                },
                {
                  href: `${baseContractsSlug}/erc-721/lazy-mint`,
                  name: "Lazy Mint",
                },
                {
                  href: `${baseContractsSlug}/erc-721/signature-mint`,
                  name: "Signature Mint",
                },
              ],
              name: "ERC-721",
            },
            {
              links: [
                {
                  href: `${baseContractsSlug}/erc-1155/base`,
                  name: "Base",
                },
                {
                  href: `${baseContractsSlug}/erc-1155/delayed-reveal`,
                  name: "Delayed Reveal",
                },
                {
                  href: `${baseContractsSlug}/erc-1155/drop`,
                  name: "Drop",
                },
                {
                  href: `${baseContractsSlug}/erc-1155/lazy-mint`,
                  name: "Lazy Mint",
                },
                {
                  href: `${baseContractsSlug}/erc-1155/signature-mint`,
                  name: "Signature Mint",
                },
              ],
              name: "ERC-1155",
            },
            {
              href: `${baseContractsSlug}/erc-4337`,
              links: [
                {
                  href: `${baseContractsSlug}/erc-4337/account`,
                  name: "Account",
                },
                {
                  href: `${baseContractsSlug}/erc-4337/account-factory`,
                  name: "Account Factory",
                },
                {
                  href: `${baseContractsSlug}/erc-4337/managed-account`,
                  name: "Managed Account",
                },
                {
                  href: `${baseContractsSlug}/erc-4337/managed-account-factory`,
                  name: "Managed Account Factory",
                },
              ],
              name: "ERC-4337",
            },
          ],
          name: "Base Contracts",
        },
        // extensions
        {
          href: `${extensionsSlug}`,
          links: [
            {
              links: [
                {
                  href: `${extensionsSlug}/general/BatchMintMetadata`,
                  name: "BatchMintMetadata",
                },
                {
                  href: `${extensionsSlug}/general/ContractMetadata`,
                  name: "ContractMetadata",
                },
                {
                  href: `${extensionsSlug}/general/DelayedReveal`,
                  name: "DelayedReveal",
                },
                {
                  href: `${extensionsSlug}/general/Drop`,
                  name: "Drop",
                },
                {
                  href: `${extensionsSlug}/general/DropSinglePhase`,
                  name: "DropSinglePhase",
                },
                {
                  href: `${extensionsSlug}/general/LazyMint`,
                  name: "LazyMint",
                },
                {
                  href: `${extensionsSlug}/general/Multicall`,
                  name: "Multicall",
                },
                {
                  href: `${extensionsSlug}/general/Ownable`,
                  name: "Ownable",
                },
                {
                  href: `${extensionsSlug}/general/Permissions`,
                  name: "Permissions",
                },
                {
                  href: `${extensionsSlug}/general/PermissionsEnumerable`,
                  name: "PermissionsEnumerable",
                },
                {
                  href: `${extensionsSlug}/general/PlatformFee`,
                  name: "PlatformFee",
                },
                {
                  href: `${extensionsSlug}/general/PrimarySale`,
                  name: "PrimarySale",
                },
                {
                  href: `${extensionsSlug}/general/Royalty`,
                  name: "Royalty",
                },
              ],
              name: "General",
            },
            {
              links: [
                {
                  href: `${extensionsSlug}/erc-20/ERC20`,
                  name: "ERC20",
                },
                {
                  href: `${extensionsSlug}/erc-20/ERC20BatchMintable`,
                  name: "ERC20BatchMintable",
                },
                {
                  href: `${extensionsSlug}/erc-20/ERC20Burnable`,
                  name: "ERC20Burnable",
                },
                {
                  href: `${extensionsSlug}/erc-20/ERC20ClaimConditions`,
                  name: "ERC20ClaimConditions",
                },
                {
                  href: `${extensionsSlug}/erc-20/ERC20Mintable`,
                  name: "ERC20Mintable",
                },
                {
                  href: `${extensionsSlug}/erc-20/ERC20Permit`,
                  name: "ERC20Permit",
                },
                {
                  href: `${extensionsSlug}/erc-20/ERC20SignatureMint`,
                  name: "ERC20SignatureMint",
                },
                {
                  href: `${extensionsSlug}/erc-20/ERC20Staking`,
                  name: "ERC20Staking",
                },
              ],
              name: "ERC-20",
            },
            {
              links: [
                {
                  href: `${extensionsSlug}/erc-721/ERC721`,
                  name: "ERC721",
                },
                {
                  href: `${extensionsSlug}/erc-721/ERC721BatchMintable`,
                  name: "ERC721BatchMintable",
                },
                {
                  href: `${extensionsSlug}/erc-721/ERC721Burnable`,
                  name: "ERC721Burnable",
                },
                {
                  href: `${extensionsSlug}/erc-721/ERC721ClaimConditions`,
                  name: "ERC721ClaimConditions",
                },
                {
                  href: `${extensionsSlug}/erc-721/ERC721ClaimCustom`,
                  name: "ERC721ClaimCustom",
                },
                {
                  href: `${extensionsSlug}/erc-721/ERC721ClaimPhases`,
                  name: "ERC721ClaimPhases",
                },
                {
                  href: `${extensionsSlug}/erc-721/ERC721Claimable`,
                  name: "ERC721Claimable",
                },
                {
                  href: `${extensionsSlug}/erc-721/ERC721Enumerable`,
                  name: "ERC721Enumerable",
                },
                {
                  href: `${extensionsSlug}/erc-721/ERC721Mintable`,
                  name: "ERC721Mintable",
                },
                {
                  href: `${extensionsSlug}/erc-721/ERC721Revealable`,
                  name: "ERC721Revealable",
                },
                {
                  href: `${extensionsSlug}/erc-721/ERC721SignatureMint`,
                  name: "ERC721SignatureMint",
                },
                {
                  href: `${extensionsSlug}/erc-721/ERC721Staking`,
                  name: "ERC721Staking",
                },
                {
                  href: `${extensionsSlug}/erc-721/ERC721Supply`,
                  name: "ERC721Supply",
                },
              ],
              name: "ERC-721",
            },
            {
              links: [
                {
                  href: `${extensionsSlug}/erc-1155/ERC1155`,
                  name: "ERC1155",
                },
                {
                  href: `${extensionsSlug}/erc-1155/ERC1155BatchMintable`,
                  name: "ERC1155BatchMintable",
                },
                {
                  href: `${extensionsSlug}/erc-1155/ERC1155Burnable`,
                  name: "ERC1155Burnable",
                },
                {
                  href: `${extensionsSlug}/erc-1155/ERC1155ClaimConditions`,
                  name: "ERC1155ClaimConditions",
                },
                {
                  href: `${extensionsSlug}/erc-1155/ERC1155ClaimCustom`,
                  name: "ERC1155ClaimCustom",
                },
                {
                  href: `${extensionsSlug}/erc-1155/ERC1155ClaimPhases`,
                  name: "ERC1155ClaimPhases",
                },
                {
                  href: `${extensionsSlug}/erc-1155/ERC1155Claimable`,
                  name: "ERC1155Claimable",
                },
                {
                  href: `${extensionsSlug}/erc-1155/ERC1155Drop`,
                  name: "ERC1155Drop",
                },
                {
                  href: `${extensionsSlug}/erc-1155/ERC1155DropSinglePhase`,
                  name: "ERC1155DropSinglePhase",
                },
                {
                  href: `${extensionsSlug}/erc-1155/ERC1155Enumerable`,
                  name: "ERC1155Enumerable",
                },
                {
                  href: `${extensionsSlug}/erc-1155/ERC1155Mintable`,
                  name: "ERC1155Mintable",
                },
                {
                  href: `${extensionsSlug}/erc-1155/ERC1155Revealable`,
                  name: "ERC1155Revealable",
                },
                {
                  href: `${extensionsSlug}/erc-1155/ERC1155SignatureMint`,
                  name: "ERC1155SignatureMint",
                },
                {
                  href: `${extensionsSlug}/erc-1155/ERC1155Staking`,
                  name: "ERC1155Staking",
                },
                {
                  href: `${extensionsSlug}/erc-1155/ERC1155Supply`,
                  name: "ERC1155Supply",
                },
              ],
              name: "ERC-1155",
            },
            {
              links: [
                {
                  href: `${extensionsSlug}/erc-4337/SmartWallet`,
                  name: "SmartWallet",
                },
                {
                  href: `${extensionsSlug}/erc-4337/SmartWalletFactory`,
                  name: "SmartWalletFactory",
                },
              ],
              name: "ERC-4337",
            },
          ],
          name: "Extensions",
        },
        // stylus
        {
          href: `${buildSlug}/stylus`,
          name: "Arbitrum Stylus",
        },
      ],
      name: "Build",
    },
    { separator: true },
    // resources
    {
      isCollapsible: false,
      links: [
        {
          href: "/contracts/faq",
          name: "FAQs",
        },
        {
          links: [
            {
              href: `${designDocs}/modular-contracts`,
              name: "Modular Contracts",
            },
            {
              href: `${designDocs}/drop`,
              name: "Drop",
            },
            {
              href: `${designDocs}/marketplace`,
              name: "Marketplace",
            },
            {
              href: `${designDocs}/multiwrap`,
              name: "Multiwrap",
            },
            {
              href: `${designDocs}/pack`,
              name: "Pack",
            },
            {
              href: `${designDocs}/signature-mint`,
              name: "Signature Mint",
            },
          ],
          name: "Design Docs",
        },
      ],
      name: "Resources",
    },
  ],
  name: "Contracts",
};
