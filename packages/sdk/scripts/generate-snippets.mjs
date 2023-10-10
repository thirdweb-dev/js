import { TSDocParser, DocExcerpt } from "@microsoft/tsdoc";
import fs from "fs";

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

export function generateSnippets(ecosystem) {
  /**
   * This is a simplistic solution until we implement proper DocNode rendering APIs.
   */

  const tsdocParser = new TSDocParser();

  const json = JSON.parse(
    fs.readFileSync(`${process.cwd()}/temp-${ecosystem}/sdk.api.json`, "utf8"),
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

  // just include all classes
  const modules = json.members[0].members.filter((m) => m.kind === "Class");

  const bases = ["StandardErc20", "StandardErc721", "StandardErc1155"];
  const baseClasses = json.members[0].members.filter(
    (m) => m.kind === "Class" && bases.includes(m.name),
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

  const path = "typescript";
  const baseDocUrl = `https://portal.thirdweb.com/${path}/sdk.`;

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
            reference: extractReferenceLink(m, kind, contractName),
          };
        }
        return null;
      })
      .filter((m) => !!m);
  };

  const moduleMap = modules.reduce((acc, m) => {
    const parserContext = tsdocParser.parseString(m.docComment);
    const docComment = parserContext.docComment;
    const examples = parseExampleTag(docComment);
    const baseClassesRefs = m.excerptTokens
      .filter((e) => e.kind === "Reference")
      .map((e) => e.text);
    const baseClassCode = baseClasses.find((m_) =>
      baseClassesRefs.includes(m_.name),
    );
    const baseClassMembers = baseClassCode
      ? parseMembers(baseClassCode.members, "Method", baseClassCode.name)
      : [];
    acc[m.name] = {
      name: m.name,
      summary: Formatter.renderDocNode(docComment.summarySection),
      remarks: docComment.remarksBlock
        ? Formatter.renderDocNode(docComment.remarksBlock.content)
        : null,
      examples,
      methods: parseMembers(m.members, "Method", m.name).concat(
        baseClassMembers,
      ),
      properties: parseMembers(m.members, "Property", m.name),
      reference: extractReferenceLink(m),
    };

    return acc;
  }, {});

  fs.writeFileSync(
    `${process.cwd()}/docs/${ecosystem}/snippets.json`,
    JSON.stringify(moduleMap, null, 2),
  );
}

generateSnippets("evm");
generateSnippets("solana");
