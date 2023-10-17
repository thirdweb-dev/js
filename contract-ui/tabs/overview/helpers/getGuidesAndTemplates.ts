import { ContractType, FeatureName } from "@thirdweb-dev/sdk";

type Item = {
  title: string;
  url: string;
};

const ALL_GUIDES: Record<string, Item> = {
  claimErc20TokenNextjs: {
    title: "Build An ERC20 Token Claim App in React",
    url: "https://blog.thirdweb.com/guides/claim-erc20-token-nextjs/",
  },
  sellYourInGameCurrencyForCryptoInUnity: {
    title: "Sell An ERC20 Token As In-Game Currency In Unity",
    url: "https://blog.thirdweb.com/guides/sell-your-in-game-currency-for-crypto-in-unity/",
  },
  tokenButtonReact: {
    title: "Build a Token Minting Button with React",
    url: "https://blog.thirdweb.com/guides/token-button-react/",
  },
  howToSellNftsInACustomErc20Token: {
    title: "How To Sell NFTs In A Custom ERC20 token",
    url: "https://blog.thirdweb.com/guides/how-to-sell-nfts-in-a-custom-erc20-token/",
  },
  nftDropWithDelayedReveal: {
    title: "Release an NFT drop with Delayed Reveal",
    url: "https://blog.thirdweb.com/guides/nft-drop-with-delayed-reveal/",
  },
  realeaseAnNftDropWithNoCode: {
    title: "Release an NFT Drop on your own site without writing any code",
    url: "https://blog.thirdweb.com/guides/release-an-nft-drop-with-no-code/",
  },
  biconomyGaslessGuide: {
    title: "Create an NFT Drop with Gasless Transactions using Biconomy",
    url: "https://blog.thirdweb.com/guides/biconomy-gasless-guide/",
  },
  acceptCreditCardPayments: {
    title: "How to accept credit card payments for your NFT drop",
    url: "https://blog.thirdweb.com/guides/accept-credit-card-payments/",
  },
  createGaslessNftDrop: {
    title: "Create a gasless NFT drop with Next.js and OpenZeppelin",
    url: "https://blog.thirdweb.com/guides/create-gasless-nft-drop/",
  },
  createNftDropWithClaimPhases: {
    title: "Release an NFT Drop with an Allowlist and Multiple Claim Phases",
    url: "https://blog.thirdweb.com/guides/create-nft-drop-with-claim-phases/",
  },
  createAnMaycCollectionClone: {
    title: "Build A Mutant Ape Yacht Club (MAYC) NFT Collection Clone",
    url: "https://blog.thirdweb.com/guides/create-an-mayc-collection-clone/",
  },
  howToBatchUpload: {
    title: "How to use batch upload with an NFT Drop",
    url: "https://blog.thirdweb.com/guides/how-to-batch-upload/",
  },
  releaseAnErc721DropWithCentralizedMetadata: {
    title: "Create an NFT Drop with Centralized Metadata",
    url: "https://blog.thirdweb.com/guides/release-an-erc721-drop-with-centralized-metadata/",
  },
  createNftWithNoCode: {
    title: "Mint an NFT with no code",
    url: "https://blog.thirdweb.com/guides/create-nft-with-no-code/",
  },
  howToRenderNftMetadataInAReactAppUsingThirdwebNftMedia: {
    title: "How to Render NFT Metadata In a React App",
    url: "https://blog.thirdweb.com/guides/how-to-render-nft-metadata-in-a-react-app-using-thirdwebnftmedia/",
  },
  onDemandPass: {
    title: "Create ERC721 Access Pass NFTs Using TypeScript",
    url: "https://blog.thirdweb.com/guides/on-demand-pass/",
  },
  mintSpecificNft: {
    title: "Let Users Pick Which NFT They Want to Mint",
    url: "https://blog.thirdweb.com/guides/mint-specific-nft/",
  },
  mintNftUniqueCode: {
    title:
      "Create A Community-Made NFT Collection using Signature-Based Minting",
    url: "https://blog.thirdweb.com/guides/mint-nft-unique-code/",
  },
  airdropEditionNftsToHoldersOfAnNftCollection: {
    title: "Airdrop Edition NFTs to Holders of an NFT Collection",
    url: "https://blog.thirdweb.com/guides/airdrop-edition-nfts-to-holders-of-an-nft-collection/",
  },
  createAnNftGalleryUsingThirdwebAndNextJs: {
    title: "Create an NFT Gallery using thirdweb and Next.js",
    url: "https://blog.thirdweb.com/guides/create-an-nft-gallery-using-thirdweb-and-next-js/",
  },
  nftGatedWebsite: {
    title: "Create An NFT Gated Website",
    url: "https://blog.thirdweb.com/guides/nft-gated-website/",
  },
  allowGithubContributorsToMintAnNft: {
    title: "Allow GitHub contributors to mint an NFT",
    url: "https://blog.thirdweb.com/guides/allow-github-contributors-to-mint-an-nft/",
  },
  airdropFreeToOwnNftsForAWeb3Game: {
    title: "Airdrop Free-To-Own NFTs For Your Web3 Game",
    url: "https://blog.thirdweb.com/guides/airdrop-free-to-own-nfts-for-a-web3-game/",
  },
  createAnNftLootbox: {
    title: "Create NFT Loot-Boxes Using the Pack Contract",
    url: "https://blog.thirdweb.com/guides/create-an-nft-lootbox/",
  },
  signatureDrop: {
    title: "Create an ERC721A NFT Drop with Signature-Based Minting",
    url: "https://blog.thirdweb.com/guides/signature-drop/",
  },
  nftMarketplaceWithTypescriptNext: {
    title: "Create Your Own NFT Marketplace with TypeScript and Next.js",
    url: "https://blog.thirdweb.com/guides/nft-marketplace-with-typescript-next/",
  },
  auctionButtonReact: {
    title: "Build An Auction Button For Your NFT Marketplace",
    url: "https://blog.thirdweb.com/guides/auction-button-react/",
  },
  buildTreasuryAndGovernanceForYourDao: {
    title: "Build a DAO With a Treasury and a Governance Token",
    url: "https://blog.thirdweb.com/guides/build-treasury-and-governance-for-your-dao/",
  },
  deploySmartWallet: {
    title: "How to Deploy a Smart Wallet (ERC-4337)",
    url: "https://blog.thirdweb.com/guides/how-to-use-erc4337-smart-wallets/",
  },
  customSmartWallet: {
    title:
      "How to Extend the Base Smart Wallet Contracts Using the Solidity SDK",
    url: "https://blog.thirdweb.com/guides/custom-smart-wallet-contracts/",
  },
};

const GUIDES_FOR_TYPE: Record<ContractType, Item[]> = {
  pack: [ALL_GUIDES.createAnNftLootbox],
  "signature-drop": [ALL_GUIDES.signatureDrop],
  marketplace: [
    ALL_GUIDES.nftMarketplaceWithTypescriptNext,
    ALL_GUIDES.auctionButtonReact,
  ],
  vote: [ALL_GUIDES.buildTreasuryAndGovernanceForYourDao],
  custom: [],
  "edition-drop": [],
  edition: [],
  "marketplace-v3": [],
  multiwrap: [],
  "nft-collection": [],
  "nft-drop": [],
  split: [],
  "token-drop": [],
  token: [],
};

const GUIDES_FOR_EXTENSION: Record<FeatureName, Item[]> = {
  ERC20ClaimConditionsV1: [
    ALL_GUIDES.claimErc20TokenNextjs,
    ALL_GUIDES.tokenButtonReact,
    ALL_GUIDES.sellYourInGameCurrencyForCryptoInUnity,
  ],
  ERC20ClaimConditionsV2: [
    ALL_GUIDES.claimErc20TokenNextjs,
    ALL_GUIDES.tokenButtonReact,
    ALL_GUIDES.sellYourInGameCurrencyForCryptoInUnity,
  ],
  ERC20ClaimPhasesV2: [
    ALL_GUIDES.claimErc20TokenNextjs,
    ALL_GUIDES.tokenButtonReact,
    ALL_GUIDES.sellYourInGameCurrencyForCryptoInUnity,
  ],
  ERC20ClaimPhasesV1: [
    ALL_GUIDES.claimErc20TokenNextjs,
    ALL_GUIDES.tokenButtonReact,
    ALL_GUIDES.sellYourInGameCurrencyForCryptoInUnity,
  ],
  ERC20Burnable: [],
  ERC20BatchMintable: [],
  ERC20Mintable: [],
  ERC20: [ALL_GUIDES.howToSellNftsInACustomErc20Token],
  ERC721Burnable: [],
  ERC721Revealable: [ALL_GUIDES.nftDropWithDelayedReveal],
  ERC721TieredDrop: [],
  ERC721ClaimConditionsV1: [
    ALL_GUIDES.realeaseAnNftDropWithNoCode,
    ALL_GUIDES.biconomyGaslessGuide,
    ALL_GUIDES.acceptCreditCardPayments,
    ALL_GUIDES.createGaslessNftDrop,
    ALL_GUIDES.createNftDropWithClaimPhases,
  ],
  ERC721ClaimConditionsV2: [
    ALL_GUIDES.realeaseAnNftDropWithNoCode,
    ALL_GUIDES.biconomyGaslessGuide,
    ALL_GUIDES.acceptCreditCardPayments,
    ALL_GUIDES.createGaslessNftDrop,
    ALL_GUIDES.createNftDropWithClaimPhases,
  ],
  ERC721ClaimPhasesV1: [
    ALL_GUIDES.realeaseAnNftDropWithNoCode,
    ALL_GUIDES.biconomyGaslessGuide,
    ALL_GUIDES.acceptCreditCardPayments,
    ALL_GUIDES.createGaslessNftDrop,
    ALL_GUIDES.createNftDropWithClaimPhases,
  ],
  ERC721ClaimPhasesV2: [
    ALL_GUIDES.realeaseAnNftDropWithNoCode,
    ALL_GUIDES.biconomyGaslessGuide,
    ALL_GUIDES.acceptCreditCardPayments,
    ALL_GUIDES.createGaslessNftDrop,
    ALL_GUIDES.createNftDropWithClaimPhases,
  ],
  ERC721ClaimCustom: [],
  ERC721LazyMintable: [ALL_GUIDES.createAnMaycCollectionClone],
  ERC721BatchMintable: [
    ALL_GUIDES.howToBatchUpload,
    ALL_GUIDES.releaseAnErc721DropWithCentralizedMetadata,
  ],
  ERC721Mintable: [
    ALL_GUIDES.createNftWithNoCode,
    ALL_GUIDES.howToRenderNftMetadataInAReactAppUsingThirdwebNftMedia,
  ],
  ERC721SignatureMintV2: [
    ALL_GUIDES.onDemandPass,
    ALL_GUIDES.mintSpecificNft,
    ALL_GUIDES.mintNftUniqueCode,
  ],
  ERC721SignatureMintV1: [
    ALL_GUIDES.onDemandPass,
    ALL_GUIDES.mintSpecificNft,
    ALL_GUIDES.mintNftUniqueCode,
  ],
  ERC721Enumerable: [],
  ERC721Supply: [
    ALL_GUIDES.airdropEditionNftsToHoldersOfAnNftCollection,
    ALL_GUIDES.createAnNftGalleryUsingThirdwebAndNextJs,
  ],
  ERC721: [ALL_GUIDES.nftGatedWebsite],
  ERC1155Burnable: [],
  ERC1155ClaimConditionsV1: [ALL_GUIDES.nftGatedWebsite],
  ERC1155ClaimConditionsV2: [ALL_GUIDES.nftGatedWebsite],
  ERC1155ClaimPhasesV2: [ALL_GUIDES.nftGatedWebsite],
  ERC1155ClaimPhasesV1: [ALL_GUIDES.nftGatedWebsite],
  ERC1155ClaimCustom: [],
  ERC1155Revealable: [ALL_GUIDES.nftDropWithDelayedReveal],
  ERC1155LazyMintableV2: [],
  ERC1155LazyMintableV1: [],
  ERC1155SignatureMintable: [ALL_GUIDES.allowGithubContributorsToMintAnNft],
  ERC1155BatchMintable: [],
  ERC1155Mintable: [],
  ERC1155Enumerable: [ALL_GUIDES.createAnNftGalleryUsingThirdwebAndNextJs],
  ERC1155UpdatableMetadata: [],
  ERC1155Supply: [],
  ERC1155: [ALL_GUIDES.airdropFreeToOwnNftsForAWeb3Game],
  Royalty: [],
  PrimarySale: [],
  PlatformFee: [],
  PermissionsEnumerable: [],
  Permissions: [],
  ContractMetadata: [],
  AppURI: [],
  Ownable: [],
  ERC20SignatureMintable: [],
  ERC20Permit: [],
  ERC721AQueryable: [],
  ERC721ClaimZora: [],
  ERC721SharedMetadata: [],
  ERC721LoyaltyCard: [],
  ERC721UpdatableMetadata: [],
  Gasless: [],
  PackVRF: [],
  PluginRouter: [],
  DynamicContract: [],
  DirectListings: [],
  EnglishAuctions: [],
  Offers: [],
  Account: [],
  AccountFactory: [ALL_GUIDES.deploySmartWallet, ALL_GUIDES.customSmartWallet],
  AccountPermissions: [],
  AccountPermissionsV1: [],
  AirdropERC20: [],
  AirdropERC721: [],
  AirdropERC1155: [],
};

const ALL_TEMPLATES: Record<string, Item> = {
  tokenDrop: {
    title: "Token Drop",
    url: "https://github.com/thirdweb-example/token-drop",
  },
  nftStakingApp: {
    title: "NFT Staking App",
    url: "https://github.com/thirdweb-example/nft-staking-app/",
  },
  nftDrop: {
    title: "NFT Drop Minting Page",
    url: "https://github.com/thirdweb-example/erc721/",
  },
  burn1155Mint721: {
    title: "Burn an ERC1155 to Mint an ERC721 NFT",
    url: "https://github.com/thirdweb-example/burn1155-mint721",
  },
  signatureBasedMinting: {
    title: "Signature Based Minting",
    url: "https://github.com/thirdweb-example/signature-based-minting",
  },
  nftGatedWebsite: {
    title: "NFT Gated Website",
    url: "https://github.com/thirdweb-example/nft-gated-website",
  },
  editionDrop: {
    title: "Edition Drop Minting Page",
    url: "https://github.com/thirdweb-example/edition-drop",
  },
  packs: {
    title: "Packs",
    url: "https://github.com/thirdweb-example/packs",
  },
  signatureDrop: {
    title: "Signature Drop",
    url: "https://github.com/thirdweb-example/signature-drop",
  },
  marketplace: {
    title: "Build your own Marketplace",
    url: "https://github.com/thirdweb-example/marketplace",
  },
  dao: {
    title: "Build your own DAO",
    url: "https://github.com/thirdweb-example/dao",
  },
  multiwrap: {
    title: "Multiwrap",
    url: "https://github.com/thirdweb-example/multiwrap",
  },
  smartWalletScript: {
    title: "Smart Wallet Demo Script",
    url: "https://github.com/thirdweb-example/smart-wallet-script",
  },
  smartWalletReact: {
    title: "Smart Wallet React Demo",
    url: "https://github.com/thirdweb-example/smart-wallet-react",
  },
};

const TEMPLATES_FOR_TYPE: Record<ContractType, Item[]> = {
  pack: [ALL_TEMPLATES.packs],
  "signature-drop": [ALL_TEMPLATES.signatureDrop],
  marketplace: [ALL_TEMPLATES.marketplace],
  vote: [ALL_TEMPLATES.dao],
  multiwrap: [ALL_TEMPLATES.multiwrap],
  "nft-drop": [ALL_TEMPLATES.nftDrop],
  "edition-drop": [ALL_TEMPLATES.editionDrop, ALL_TEMPLATES.nftGatedWebsite],
  "token-drop": [ALL_TEMPLATES.tokenDrop],
  custom: [],
  edition: [],
  "marketplace-v3": [],
  "nft-collection": [],
  split: [],
  token: [],
};

const TEMPLATES_FOR_EXTENSION: Record<FeatureName, Item[]> = {
  ERC20ClaimConditionsV1: [ALL_TEMPLATES.tokenDrop],
  ERC20ClaimConditionsV2: [ALL_TEMPLATES.tokenDrop],
  ERC20ClaimPhasesV1: [ALL_TEMPLATES.tokenDrop],
  ERC20ClaimPhasesV2: [ALL_TEMPLATES.tokenDrop],
  ERC20Burnable: [],
  ERC20BatchMintable: [],
  ERC20Mintable: [],
  ERC20: [ALL_TEMPLATES.nftStakingApp],
  ERC721Burnable: [],
  ERC721Revealable: [],
  ERC721TieredDrop: [],
  ERC721ClaimConditionsV1: [ALL_TEMPLATES.nftDrop],
  ERC721ClaimConditionsV2: [ALL_TEMPLATES.nftDrop],
  ERC721ClaimPhasesV1: [ALL_TEMPLATES.nftDrop],
  ERC721ClaimPhasesV2: [ALL_TEMPLATES.nftDrop],
  ERC721ClaimCustom: [],
  ERC721LazyMintable: [ALL_TEMPLATES.burn1155Mint721],
  ERC721BatchMintable: [],
  ERC721Mintable: [],
  ERC721SignatureMintV2: [ALL_TEMPLATES.signatureBasedMinting],
  ERC721SignatureMintV1: [ALL_TEMPLATES.signatureBasedMinting],
  ERC721Enumerable: [],
  ERC721Supply: [],
  ERC721: [ALL_TEMPLATES.nftGatedWebsite],
  ERC1155Burnable: [],
  ERC1155ClaimConditionsV1: [
    ALL_TEMPLATES.editionDrop,
    ALL_TEMPLATES.nftGatedWebsite,
  ],
  ERC1155ClaimConditionsV2: [
    ALL_TEMPLATES.editionDrop,
    ALL_TEMPLATES.nftGatedWebsite,
  ],
  ERC1155ClaimPhasesV2: [
    ALL_TEMPLATES.editionDrop,
    ALL_TEMPLATES.nftGatedWebsite,
  ],
  ERC1155ClaimPhasesV1: [
    ALL_TEMPLATES.editionDrop,
    ALL_TEMPLATES.nftGatedWebsite,
  ],
  ERC1155ClaimCustom: [],
  ERC1155Revealable: [],
  ERC1155LazyMintableV2: [],
  ERC1155LazyMintableV1: [],
  ERC1155SignatureMintable: [],
  ERC1155BatchMintable: [],
  ERC1155Mintable: [],
  ERC1155Enumerable: [],
  ERC1155Supply: [],
  ERC1155: [],
  Royalty: [],
  PrimarySale: [],
  PlatformFee: [],
  PermissionsEnumerable: [],
  Permissions: [],
  ContractMetadata: [],
  AppURI: [],
  Ownable: [],
  ERC20SignatureMintable: [],
  ERC20Permit: [],
  ERC721AQueryable: [],
  ERC721ClaimZora: [],
  ERC721SharedMetadata: [],
  ERC721LoyaltyCard: [],
  ERC721UpdatableMetadata: [],
  Gasless: [],
  PackVRF: [],
  PluginRouter: [],
  DynamicContract: [],
  DirectListings: [],
  EnglishAuctions: [],
  Offers: [],
  Account: [],
  AccountFactory: [
    ALL_TEMPLATES.smartWalletScript,
    ALL_TEMPLATES.smartWalletReact,
  ],
  AccountPermissions: [],
  AccountPermissionsV1: [],
  ERC1155UpdatableMetadata: [],
  AirdropERC20: [],
  AirdropERC721: [],
  AirdropERC1155: [],
};

export function getGuidesAndTemplates(
  features: string[],
  contractType: ContractType,
): {
  guides: Item[];
  templates: Item[];
} {
  const data = features.reduce(
    (acc, guide) => ({
      guides: [
        ...acc.guides,
        ...(GUIDES_FOR_EXTENSION[guide as keyof typeof GUIDES_FOR_EXTENSION] ||
          []),
      ],
      templates: [
        ...acc.templates,
        ...(TEMPLATES_FOR_EXTENSION[
          guide as keyof typeof TEMPLATES_FOR_EXTENSION
        ] || []),
      ],
    }),
    {
      guides: GUIDES_FOR_TYPE[contractType] || [],
      templates: TEMPLATES_FOR_TYPE[contractType] || [],
    },
  );

  return {
    guides: data.guides.filter(
      (guide, index) =>
        data.guides.findIndex((g) => g.url === guide.url) === index,
    ),
    templates: data.templates.filter(
      (template, index) =>
        data.templates.findIndex((t) => t.url === template.url) === index,
    ),
  };
}
