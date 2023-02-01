import { Formatter } from "./generate-snippets-evm.mjs";
import { TSDocParser } from "@microsoft/tsdoc";
import fs from "fs";

const NFT_HOOKS = ["useMintNFT", "useNFT", "useNFTs", "useTransferNFT"];

const DROP_HOOKS = [
  "useClaimedSupply",
  "useClaimNFT",
  "useLazyMintNFT",
  "useUnclaimedSupply",
];

const TOKEN_HOOKS = [
  "useMintToken",
  "useTokenBalance",
  "useTokenSupply",
  "useTransferToken",
];

const HOOKS_CONFIG = {
  useNFTCollection: [...NFT_HOOKS],
  useNFTDrop: [...NFT_HOOKS, ...DROP_HOOKS],
  useToken: [...TOKEN_HOOKS],
  useProgram: [],
};

const tsdocParser = new TSDocParser();

const json = JSON.parse(
  fs.readFileSync(`${process.cwd()}/temp-solana/react-core.api.json`, "utf8"),
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

const baseDocUrl = "https://portal.thirdweb.com/react/solana/react.";

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

const moduleMap = Object.keys(HOOKS_CONFIG).reduce((acc, hookName) => {
  let summary = "";
  let examples = {};
  let reference = "";

  const doc = json.members[0].members.find(
    (m) =>
      m.kind === "Function" && Object.keys(HOOKS_CONFIG).includes(hookName),
  );

  if (doc) {
    const parserContext = tsdocParser.parseString(doc);
    const docComment = parserContext.docComment;
    summary = Formatter.renderDocNode(docComment.summarySection);
    examples = parseExampleTag(docComment);
    reference = extractReferenceLink(doc);
  }

  const contractSubhooks = json.members[0].members.filter(
    (f) => f.kind === "Function" && HOOKS_CONFIG[hookName].includes(f.name),
  );

  const subhooks = contractSubhooks.map((subhookContent) => {
    const subhookContext = tsdocParser.parseString(subhookContent.docComment);
    const subhookComment = subhookContext.docComment;
    const subhookExamples = parseExampleTag(subhookComment);

    return {
      name: subhookContent.name,
      example: subhookExamples?.javascript || "",
      reference: `${baseDocUrl}${subhookContent.name.toLowerCase()}`,
    };
  });

  acc[hookName] = {
    name: hookName,
    summary,
    examples,
    subhooks,
    reference,
  };

  return acc;
}, {});

fs.writeFileSync(
  `${process.cwd()}/docs/solana/snippets.json`,
  JSON.stringify(moduleMap, null, 2),
);
