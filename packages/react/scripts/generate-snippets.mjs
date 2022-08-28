import { DocExcerpt, TSDocParser } from "@microsoft/tsdoc";
import fs from "fs";

/**
 * This is a simplistic solution until we implement proper DocNode rendering APIs.
 */
export class Formatter {
  static renderDocNode(docNode) {
    let result = "";
    if (docNode) {
      if (docNode instanceof DocExcerpt) {
        result += docNode.content.toString();
      }
      for (const childNode of docNode.getChildNodes()) {
        result += Formatter.renderDocNode(childNode);
      }
    }
    return result;
  }

  static renderDocNodes(docNodes) {
    let result = "";
    for (const docNode of docNodes) {
      result += Formatter.renderDocNode(docNode);
    }
    return result;
  }
}

const tsdocParser = new TSDocParser();

const json = JSON.parse(
  fs.readFileSync(`${process.cwd()}/temp/react.api.json`, "utf8"),
);

function languageNameToKey(languageName) {
  switch (languageName) {
    case "js":
    case "jsx":
      return "javascript";
    case "ts":
    case "tsx":
      return "typescript";
    default:
      return languageName;
  }
}

const CONTRACT_HOOKS = [
  "useSignatureDrop",
  "useNFTDrop",
  "useEditionDrop",
  "useNFTCollection",
  "useEdition",
  "useTokenDrop",
  "useToken",
  "useMarketplace",
  "useSplit",
  "useVote",
  "usePack",
  "useMultiwrap",
  "useContract",
];

const NFT_HOOKS = [
  "useNFT",
  "useNFTs",
  "useTotalCirculatingSupply",
  "useOwnedNFTs",
  "useNFTBalance",
  "useMintNFT",
];

const TOKEN_HOOKS = ["useTokenSupply", "useTokenBalance", "useMintToken"];

const MARKETPLACE_HOOKS = [
  "useListing",
  "useListings",
  "useActiveListings",
  "useWinningBid",
  "useAuctionWinner",
  "useBidBuffer",
  "useCreateDirectListing",
  "useCreateAuctionListing",
  "useMakeBid",
  "useBuyNow",
];

const DROP_HOOKS = [
  "useUnclaimedNFTs",
  "useClaimedNFTs",
  "useUnclaimedNFTSupply",
  "useClaimedNFTSupply",
  "useClaimNFT",
  "useClaimToken",
];

const CLAIM_CONDITIONS_HOOKS = [
  "useActiveClaimCondition",
  "useClaimConditions",
  "useClaimIneligibilityReasons",
];

const WALLET_CONNECTION_HOOKS = [
  "useAddress",
  "useMetamask",
  "useWalletConnect",
  "useCoinbaseWallet",
  "useMagic",
  "useGnosis",
  "useDisconnect",
];

const NETWORK_INFO_HOOKS = ["useChainId", "useNetwork", "useNetworkMismatch"];

const CUSTOM_CONTRACT_HOOKS = [
  "useContract",
  "useContractData",
  "useAllContractEvents",
  "useContractEvents",
  "useContractType",
  "useContractPublishMetadata",
  "useContractMetadata",
  "useContractCall",
];

const CONTRACT_SETTINGS_HOOKS = [
  "useMetadata",
  "useUpdateMetadata",
  "usePrimarySalesRecipient",
  "useUpdatePrimarySaleRecipient",
  "useRoyaltySettings",
  "useUpdateRoyaltySettings",
  "usePlatformFees",
  "useUpdatePlatformFees",
  "useAllRoleMembers",
  "useRoleMembers",
  "useIsAddressRole",
  "useSetAllRoleMembers",
  "useGrantRole",
  "useRevokeRole",
];

const CONTRACT_SUBHOOKS = {
  useSignatureDrop: [...NFT_HOOKS, ...DROP_HOOKS, ...CLAIM_CONDITIONS_HOOKS],
  useNFTDrop: [...NFT_HOOKS, ...DROP_HOOKS, ...CLAIM_CONDITIONS_HOOKS],
  useEditionDrop: [...NFT_HOOKS, ...DROP_HOOKS, ...CLAIM_CONDITIONS_HOOKS],
  useNFTCollection: [...NFT_HOOKS],
  useEdition: [...NFT_HOOKS],
  useTokenDrop: [...TOKEN_HOOKS, ...DROP_HOOKS, ...CLAIM_CONDITIONS_HOOKS],
  useToken: [...TOKEN_HOOKS],
  useMarketplace: [...MARKETPLACE_HOOKS],
  useSplit: [],
  useVote: [],
  usePack: [...NFT_HOOKS],
  useMultiwrap: [...NFT_HOOKS],
  useContract: [
    ...WALLET_CONNECTION_HOOKS,
    ...NETWORK_INFO_HOOKS,
    ...CUSTOM_CONTRACT_HOOKS,
    ...CONTRACT_SETTINGS_HOOKS,
  ],
};

const hooks = json.members[0].members.filter(
  (m) => m.kind === "Function" && CONTRACT_HOOKS.includes(m.name),
);

function parseExampleTag(docComment) {
  const exampleBlocks = docComment._customBlocks.filter(
    (b) => b._blockTag._tagName === "@example",
  );

  const examplesString = Formatter.renderDocNodes(exampleBlocks);

  const regex = /```([a-zA-Z]*)\n([\S\s]*?)\n```/g;

  let matches;

  const examples = {};

  while ((matches = regex.exec(examplesString)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (matches.index === regex.lastIndex) {
      regex.lastIndex++;
    }

    const re = /\n( *)\/\/ For example((.|\n)*)\.\.\.\n/g;
    const example = matches[2].replace(re, "");
    examples[languageNameToKey(matches[1])] = example;
  }
  return examples;
}

const baseDocUrl = "https://docs.thirdweb.com/typescript/react.";

const extractReferenceLink = (m, kind, contractName) => {
  if (kind === "Property") {
    return m.excerptTokens
      .filter((e) => e.kind === "Reference")
      .map((e) => `${baseDocUrl}${e.text.toLowerCase()}`)[0];
  }
  if (kind === "Method") {
    return `${baseDocUrl}${contractName}.${m.name}`;
  }
  return `${baseDocUrl}${m.name}`;
};

const moduleMap = hooks.reduce((acc, m) => {
  const parserContext = tsdocParser.parseString(m.docComment);
  const docComment = parserContext.docComment;
  const examples = parseExampleTag(docComment);

  const contractSubhooks = json.members[0].members.filter(
    (f) => f.kind === "Function" && CONTRACT_SUBHOOKS[m.name].includes(f.name),
  );

  const contractHooks = contractSubhooks.map((subhookContent) => {
    const subhookContext = tsdocParser.parseString(subhookContent.docComment);
    const subhookComment = subhookContext.docComment;
    const subhookExamples = parseExampleTag(subhookComment);

    return {
      name: subhookContent.name,
      example: subhookExamples?.javascript || "",
      reference: `https://portal.thirdweb.com/react/react.${subhookContent.name.toLowerCase()}`,
    };
  });

  if (Object.keys(examples).length > 0) {
    acc[m.name] = {
      name: m.name,
      summary: Formatter.renderDocNode(docComment.summarySection),
      examples,
      subhooks: contractHooks,
      reference: extractReferenceLink(m),
    };
  }

  return acc;
}, {});

fs.writeFileSync(
  `${process.cwd()}/docs/snippets.json`,
  JSON.stringify(moduleMap, null, 2),
);
