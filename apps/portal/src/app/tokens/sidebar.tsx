import { ZapIcon } from "lucide-react";
import type { SideBar } from "@/components/Layouts/DocLayout";

const slug = "/tokens";
const prebuiltSlug = `${slug}/explore/pre-built-contracts`;
const designDocs = `${slug}/design-docs`;

// TODO: Deprecate links that start with the following slugs
const buildSlug = `${slug}/build`;
const extensionsSlug = `${slug}/build/extensions`;
const baseContractsSlug = `${slug}/build/base-contracts`;

export const sidebar: SideBar = {
  links: [
    {
      href: slug,
      name: "Get Started",
      icon: <ZapIcon />,
    },
    { separator: true },
    // explore
    {
      isCollapsible: false,
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
      name: "Pre-built Contracts",
    },

    { separator: true },
    // build
    {
      isCollapsible: false,
      links: [
        {
          href: `${buildSlug}/get-started`,
          name: "Get Started",
        },
        // base contracts
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
      name: "Build your own",
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
  name: "Tokens",
};
