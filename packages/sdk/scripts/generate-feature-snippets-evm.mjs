import {
  TSDocParser,
  DocExcerpt,
  TSDocConfiguration,
  TSDocTagSyntaxKind,
  TSDocTagDefinition,
} from "@microsoft/tsdoc";
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

const config = new TSDocConfiguration();
const tag = new TSDocTagDefinition({
  tagName: "@twfeature",
  allowMultiple: true,
  syntaxKind: TSDocTagSyntaxKind.BlockTag,
});
config.addTagDefinition(tag);
config.setSupportForTag(tag, true);
const tsdocParser = new TSDocParser(config);

const json = JSON.parse(
  fs.readFileSync(`${process.cwd()}/temp-evm/sdk.api.json`, "utf8"),
);

function languageNameToKey(languageName) {
  switch (languageName) {
    case "js":
    case "jsx":
      return "javascript";
    case "ts":
    case "tsx":
      return "tyepscript";
    default:
      return languageName;
  }
}

// Get all the DetectableFeature classes
const classes = json.members[0].members.filter(
  (m) =>
    m.kind === "Class" &&
    m.excerptTokens.filter((t) => t.text === "DetectableFeature").length > 0,
);
const features = {};

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
    examples[languageNameToKey(matches[1])] = matches[2];
  }
  return examples;
}

function parseTWFeatureTag(docComment) {
  const featureBlocks = docComment._customBlocks.filter(
    (b) => b._blockTag._tagName === "@twfeature",
  );
  const featuresString = Formatter.renderDocNodes(featureBlocks);
  return featuresString.split(" | ").map((f) =>
    f
      .trim()
      .replace(/\\n/g, "")
      .replace("\n\n", "")
      .replace(/`/g, "")
      .replace(/@twfeature/g, ""),
  );
}

const baseDocUrl = "https://docs.thirdweb.com/typescript/sdk.";

const extractReferenceLink = (m, kind, contractName) => {
  if (kind === "Property") {
    return m.excerptTokens
      .filter((e) => e.kind === "Reference")
      .map((e) => `${baseDocUrl}${e.text.toLowerCase()}`)[0];
  }
  if (kind === "Method") {
    return `${baseDocUrl}${contractName}.${m.name}`.toLowerCase();
  }
  return `${baseDocUrl}${m.name}`.toLowerCase();
};

const parseMembers = (members, kind, contractName) => {
  const validMembers = members.filter((m) => m.kind === kind);
  return validMembers
    .map((m) => {
      const parserContext = tsdocParser.parseString(m.docComment);
      const docComment = parserContext.docComment;
      const featureNames = parseTWFeatureTag(docComment);
      if (featureNames.length > 0) {
        for (const feature of featureNames) {
          const examples = parseExampleTag(docComment);
          if (Object.keys(examples).length > 0) {
            const example = {
              name: m.name,
              summary: Formatter.renderDocNode(docComment.summarySection),
              remarks: docComment.remarksBlock
                ? Formatter.renderDocNode(docComment.remarksBlock.content)
                : null,
              examples,
              reference: {
                javascript: extractReferenceLink(m, kind, contractName),
              },
            };
            features[feature] = features[feature]
              ? features[feature].concat(example)
              : [example];
          }
        }
      }
    })
    .filter((m) => !!m);
};

classes.forEach((m) => {
  parseMembers(m.members, "Property", m.name);
  parseMembers(m.members, "Method", m.name);
});

fs.writeFileSync(
  `${process.cwd()}/docs/evm/feature_snippets.json`,
  JSON.stringify(features, null, 2),
);
