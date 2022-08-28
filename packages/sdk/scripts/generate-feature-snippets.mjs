import fs from "fs";
import { TSDocParser, DocExcerpt } from "@microsoft/tsdoc";

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
  fs.readFileSync(`${process.cwd()}/temp/sdk.api.json`, "utf8"),
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

const baseDocUrl = "https://docs.thirdweb.com/typescript/sdk.";

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

const parseMembers = (members, kind, contractName) => {
  const validMembers = members.filter((m) => m.kind === kind);
  return validMembers
    .map((m) => {
      const parserContext = tsdocParser.parseString(m.docComment);
      const docComment = parserContext.docComment;
      const examples = parseExampleTag(docComment);
      if (Object.keys(examples).length > 0) {
        return {
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
      }
      return null;
    })
    .filter((m) => !!m);
};

const moduleMap = classes.reduce((acc, m) => {
  const parserContext = tsdocParser.parseString(m.docComment);
  const docComment = parserContext.docComment;
  const examples = parseExampleTag(docComment);
  // if (Object.keys(examples).length > 0) {
  const featureName = m.members
    .filter((m) => m.kind === "Property" && m.name === "featureName")
    .map((m) => m.excerptTokens[1].text.replace('"', "").replace('"', ""))[0];
  acc[featureName] = {
    name: m.name,
    summary: Formatter.renderDocNode(docComment.summarySection),
    remarks: docComment.remarksBlock
      ? Formatter.renderDocNode(docComment.remarksBlock.content)
      : null,
    examples,
    methods: parseMembers(m.members, "Method", m.name),
    properties: parseMembers(m.members, "Property", m.name),
    reference: {
      javascript: extractReferenceLink(m),
    },
  };
  // }

  return acc;
}, {});

fs.writeFileSync(
  `${process.cwd()}/docs/feature_snippets.json`,
  JSON.stringify(moduleMap, null, 2),
);
