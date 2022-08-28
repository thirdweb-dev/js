export default function generateDashboardUrl(
  name: string,
  version: string | undefined,
): string | undefined {
  const splitName = name.split("/");
  // Released contract
  if (splitName.length > 1) {
    return `https://thirdweb.com/dashboard/${splitName[0]}/${splitName[1]}${
      version ? `/${version}` : ""
    }`;
  }

  // Pre-built contract
  else {
    const mapping = {
      "signature-drop": "drop/signature-drop",
      "nft-drop": "drop/nft-drop",
      "edition-drop": "drop/edition-drop",
      "nft-collection": "token/nft-collection",
      edition: "token/edition",
      "token-drop": "drop/token-drop",
      token: "token/token",
      marketplace: "marketplace/marketplace",
      split: "governance/split",
      vote: "governance/vote",
      pack: "token/pack",
      multiwrap: "token/multiwrap",
    };

    const foundMapping = mapping[name as keyof typeof mapping];

    if (!foundMapping) {
      return undefined;
    }

    return `https://thirdweb.com/contracts/new/pre-built/${foundMapping}`;
  }
}
