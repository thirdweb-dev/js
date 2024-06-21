export function usePascalCaseContractName(contractName: string) {
  if (!contractName) {
    return null;
  }
  if (contractName === "nft-drop") {
    return "NFTDrop";
  }
  if (contractName === "edition-drop") {
    return "EditionDrop";
  }
  if (contractName === "nft-collection") {
    return "NFTCollection";
  }
  if (contractName === "edition") {
    return "Edition";
  }
  if (contractName === "token") {
    return "Token";
  }
  if (contractName === "marketplace") {
    return "Marketplace";
  }
  if (contractName === "vote") {
    return "Vote";
  }
  if (contractName === "split") {
    return "Split";
  }
  if (contractName === "token-drop") {
    return "TokenDrop";
  }
  if (contractName === "signature-drop") {
    return "SignatureDrop";
  }
  if (contractName === "pack") {
    return "Pack";
  }
  if (contractName === "multiwrap") {
    return "Multiwrap";
  }
  if (contractName === "marketplace-v3") {
    return "MarketplaceV3";
  }
  return contractName;
}
