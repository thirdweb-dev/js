export function usePascalCaseContractName(contractName: string) {
  if (!contractName) {
    return null;
  } else if (contractName === "nft-drop") {
    return "NFTDrop";
  } else if (contractName === "edition-drop") {
    return "EditionDrop";
  } else if (contractName === "nft-collection") {
    return "NFTCollection";
  } else if (contractName === "edition") {
    return "Edition";
  } else if (contractName === "token") {
    return "Token";
  } else if (contractName === "marketplace") {
    return "Marketplace";
  } else if (contractName === "vote") {
    return "Vote";
  } else if (contractName === "split") {
    return "Split";
  } else if (contractName === "token-drop") {
    return "TokenDrop";
  } else if (contractName === "signature-drop") {
    return "SignatureDrop";
  } else if (contractName === "pack") {
    return "Pack";
  } else if (contractName === "multiwrap") {
    return "Multiwrap";
  } else if (contractName === "marketplace-v3") {
    return "MarketplaceV3";
  } else {
    return contractName;
  }
}
