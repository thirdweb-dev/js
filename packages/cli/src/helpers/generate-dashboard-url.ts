export default function generateDashboardUrl(
  name: string,
  version: string | undefined,
): string | undefined {
  const splitName = name.split("/");
  // Published contract
  if (splitName.length > 1) {
    return `https://thirdweb.com/dashboard/${splitName[0]}/${splitName[1]}${
      version ? `/${version}` : ""
    }`;
  }

  // Pre-built contract
  else {
    const mapping = {
      "signature-drop": "SignatureDrop",
      "nft-drop": "DropERC721",
      "edition-drop": "DropERC1155",
      "nft-collection": "TokenERC721",
      edition: "TokenERC1155",
      "token-drop": "DropERC20",
      token: "TokenERC20",
      marketplace: "Marketplace",
      split: "Split",
      vote: "VoteERC20",
      pack: "Pack",
      multiwrap: "Multiwrap",
    };

    const foundMapping = mapping[name as keyof typeof mapping];

    return foundMapping
      ? `https://thirdweb.com/dashboard/${foundMapping}`
      : undefined;
  }
}
