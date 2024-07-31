// Used to map the contractName to this link: https://portal.thirdweb.com/contracts/explore/pre-built-contracts/<contract-slug>
// some pages don't exist in docs-v2
export const contractSlugMapping: Record<string, Lowercase<string>> = {
  multiwrap: "multiwrap",
  signatureDrop: "",
  editionStake: "stake-erc1155",
  nftStake: "stake-erc721",
  airdropERC20: "airdrop-erc20",
  airdropERC721: "airdrop-erc721",
  pack: "pack",
  tokenERC20: "token",
  tokenERC721: "nft-collection",
  tokenERC1155: "edition",
  tokenStake: "stake-erc20",
  airdropERC1155: "airdrop-erc1155",
  packvrf: "",
  dropERC1155: "edition-drop",
  dropERC20: "token-drop",
  airdropClaim: "",
  airdropPush: "",
  airdropSignature: "",
  dropERC721: "nft-drop",
};
