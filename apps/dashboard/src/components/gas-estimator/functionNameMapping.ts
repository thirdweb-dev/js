import type { contractSlugMapping } from "./contractSlugMapping";
// Map the alias of the benchmark function to the operation it carries
// eg. "erc20_100" -> "Claim 100 ERC20 token"
export const functionNameMapping: Record<
  keyof typeof contractSlugMapping,
  Record<string, string>
> = {
  multiwrap: {
    unwrap: "Unwrap one ERC20, one ERC721 and one ERC1155 token",
    wrap: "Wrap one ERC20, one ERC721 and one ERC1155 token",
  },
  signatureDrop: {
    claim_five_tokens: "Claim 5 tokens",
    lazyMint: "Lazy mint 100 ERC721 tokens",
    lazyMint_for_delayed_reveal:
      "Lazy mint 100 ERC721 tokens for Delayed Reveal",
    reveal: "Reveal a token",
    setClaimConditions: "Set a claim condition",
  },
  editionStake: {
    claimRewards: "Claim rewards",
    stake: "Stake 50 ERC1155 tokens",
    withdraw: "Withdraw 40 tokens",
  },
  nftStake: {
    claimRewards: "Claim rewards",
    stake_five_tokens: "Stake 5 tokens",
    withdraw: "Withdraw a token",
  },
  airdropERC20: {
    airdrop: "Airdrop to 1,000 recipients",
  },
  airdropERC721: {
    airdrop: "Airdrop 1,000 ERC721 tokens",
  },
  pack: {
    addPackContents: "Add 2 more tokens to the created pack",
    createPack: "Create a pack with 10 different tokens",
    openPack: "Open the created pack",
  },
  tokenERC20: {
    mintTo: "Mint 100 tokens",
    mintWithSignature_pay_with_ERC20: "",
    mintWithSignature_pay_with_native_token: "",
  },
  tokenERC721: {
    burn: "Burn a token",
    mintTo: "Mint a token",
    mintWithSignature_pay_with_ERC20: "",
    mintWithSignature_pay_with_native_token: "",
  },
  tokenERC1155: {
    burn: "Burn an ERC1155 token (quantity: 100)",
    mintTo: "Mint an ERC1155 token (quantity: 100)",
    mintWithSignature_pay_with_ERC20: "",
    mintWithSignature_pay_with_native_token: "",
  },
  tokenStake: {
    claimRewards: "Claim rewards",
    stake: "Stake 400 tokens",
    withdraw: "Withdraw 100 tokens",
  },
  airdropERC1155: {
    airdrop: "Airdrop to 1,000 recipients (5 tokens each)",
  },
  packvrf: {
    createPack: "Create a pack with 10 different tokens",
    openPack: "Open the created pack",
    openPackAndClaimRewards: "Open the created pack and claim rewards",
  },
  dropERC1155: {
    claim: "Claim 100 tokens",
    lazyMint: "Lazy mint 100 tokens",
    setClaimConditions_five_conditions: "Set 5 conditions",
  },
  dropERC20: {
    claim: "",
    setClaimConditions_five_conditions: "Set 5 claim conditions",
  },
  airdropClaim: {
    erc1155: "Claim 5 ERC1155 tokens",
    erc20: "Claim 5 ERC20 tokens",
    erc721: "Claim an ERC721 token",
  },
  airdropPush: {
    erc1155ReceiverCompliant: "",
    erc1155_10: "",
    erc1155_100: "",
    erc1155_1000: "",
    erc20_10: "",
    erc20_100: "",
    erc20_1000: "",
    erc721ReceiverCompliant: "",
    erc721_10: "",
    erc721_100: "",
    erc721_1000: "",
  },
  airdropSignature: {
    erc115_10: "",
    erc115_100: "",
    erc115_1000: "",
    erc20_10: "",
    erc20_100: "",
    erc20_1000: "",
    erc721_10: "",
    erc721_100: "",
    erc721_1000: "",
  },
  dropERC721: {
    claim_five_tokens: "Claim 5 ERC721 tokens",
    lazyMint: "Lazy mint 100 ERC721 tokens",
    lazyMint_for_delayed_reveal:
      "Lazy mint 100 ERC721 tokens for Delayed Reveal",
    reveal: "Reveal a token",
    setClaimConditions_five_conditions: "Set 5 claim conditions",
  },
};
