// @ts-check
import fs from "fs";
import createCSharpSnippet from "./utils/create-csharp-snippet.mjs";
import createReactSnippet from "./utils/create-react-snippet-from-mapping.mjs";
// Note: these JSON files are only available after running the `pnpm generate-docs` in root
import typescriptSnippets from "../../packages/sdk/docs/evm/snippets.json" assert { type: "json" };
import reactWebSnippets from "../../packages/react/docs/evm/snippets.json" assert { type: "json" };
import reactCoreSnippets from "../../packages/react-core/docs/evm/snippets.json" assert { type: "json" };
import typescriptFeatureSnippets from "../../packages/sdk/docs/evm/feature_snippets.json" assert { type: "json" };
import reactFeatureSnippets from "../../packages/react/docs/evm/feature_snippets.json" assert { type: "json" };
import reactCoreFeatureSnippets from "../../packages/react-core/docs/evm/feature_snippets.json" assert { type: "json" };

// Maybe feature_snippets_sdk.json and feature_snippets_sdk.json is not being used anywhere
// TODO: if that's the case - stop generating them here

const CLASSES = [
  "ThirdwebSDK",
  "NFTCollection",
  "Edition",
  "TokenDrop",
  "Token",
  "NFTDrop",
  "EditionDrop",
  "Marketplace",
  "MarketplaceDirect",
  "MarketplaceAuction",
  "Split",
  "Pack",
  "Vote",
  "Multiwrap",
  "ContractDeployer",
  "ContractEvents",
  "DelayedReveal",
  "GasCostEstimator",
  "RemoteStorage",
  "ContractInterceptor",
  "ContractMetadata",
  "ContractRoles",
  "SignatureDrop",
  "SmartContract",
  "WalletAuthenticator",
  "UserWallet",
];

/**
 * @typedef {{
 *  name: string;
 *  summary: string;
 *  remarks: string;
 *  examples: {
 *    javascript: string;
 *    python: string;
 *    go: string;
 *    react: string;
 *    unity: string;
 *  },
 *  reference: {
 *    javascript: string;
 *    python: string;
 *    go: string;
 *    react: string;
 *  }
 * }} SnippetInfo
 */

async function main() {
  const typescript = typescriptSnippets;
  const react = {
    ...reactWebSnippets,
    ...reactCoreSnippets,
  };

  const [python, go] = await Promise.all([
    getPythonSnippetsJSON(),
    getGoSnippetsJSON(),
  ]);

  const snippets = CLASSES.reduce((acc, contractName) => {
    const data = {
      name: contractName,
      summary: "",
      examples: {},
      methods: /** @type {SnippetInfo[]} */ ([]),
      properties: /** @type {SnippetInfo[]} */ ([]),
      reference: {},
    };

    // Get snippets from every SDK
    const tsExample = Object.values(typescript).find(
      (snippet) => snippet.name.toLowerCase() === contractName.toLowerCase(),
    );
    const reactExample = Object.values(react).find((snippet) =>
      snippet.name.toLowerCase().includes(contractName.toLowerCase()),
    );
    const pythonExample = Object.values(python).find((snippet) =>
      snippet.name.toLowerCase().includes(contractName.toLowerCase()),
    );
    const goExample = Object.values(go).find((snippet) =>
      snippet.name.toLowerCase().includes(contractName.toLowerCase()),
    );

    // Get contract summary from typescript docs
    data.summary = tsExample?.summary || "";

    // Get snippets for methods
    data.methods =
      tsExample?.methods?.map((method) => ({
        name: method.name,
        summary: method.summary,
        remarks: method.remarks,
        examples: {
          javascript:
            tsExample?.methods?.find(
              (m) => m.name.toLowerCase() === method.name.toLowerCase(),
            )?.examples?.javascript || "",
          python:
            pythonExample?.methods?.find(
              (m) =>
                m.name.replaceAll("_", "").toLowerCase() ===
                method.name.toLowerCase(),
            )?.example || "",
          go:
            goExample?.methods?.find(
              (m) => m.name.toLowerCase() === method.name.toLowerCase(),
            )?.example || "",
          react:
            createReactSnippet(contractName, method.name).example ||
            (function gen() {
              const ts =
                tsExample?.methods?.find(
                  (m) => m.name.toLowerCase() === method.name.toLowerCase(),
                )?.examples?.javascript || "";

              if (ts.includes("sdk")) {
                return `const sdk = useSDK();\n\n${ts}`;
              } else {
                return ts;
              }
            })(),
          unity: createCSharpSnippet(contractName, method.name),
        },
        reference: {
          javascript:
            tsExample?.methods
              ?.find((m) => m.name.toLowerCase() === method.name.toLowerCase())
              ?.reference?.toLowerCase() || "",
          python:
            pythonExample?.methods?.find(
              (m) =>
                m.name.replaceAll("_", "").toLowerCase() ===
                method.name.toLowerCase(),
            )?.reference || "",
          go:
            goExample?.methods?.find(
              (m) => m.name.toLowerCase() === method.name.toLowerCase(),
            )?.reference || "",
          react:
            createReactSnippet(contractName, method.name).reference ||
            tsExample?.methods
              ?.find((m) => m.name.toLowerCase() === method.name.toLowerCase())
              ?.reference?.toLowerCase() ||
            "",
        },
      })) || [];

    // Get snippets for properties
    data.properties =
      tsExample?.properties?.map((property) => ({
        name: property.name,
        summary: property.summary,
        remarks: property.remarks,
        examples: {
          javascript:
            tsExample?.properties?.find(
              (p) => p.name.toLowerCase() === property.name.toLowerCase(),
            )?.examples?.javascript || "",
          python:
            pythonExample?.properties?.find(
              (p) =>
                p.name.replaceAll("_", "").toLowerCase() ===
                property.name.toLowerCase(),
            )?.example || "",
          go:
            goExample?.properties?.find(
              (p) => p.name.toLowerCase() === property.name.toLowerCase(),
            )?.example || "",
          react:
            createReactSnippet(contractName, property.name).example ||
            (function gen() {
              const ts =
                tsExample?.properties?.find(
                  (p) => p.name.toLowerCase() === property.name.toLowerCase(),
                )?.examples?.javascript || "";

              if (ts.includes("sdk")) {
                return `const sdk = useSDK();\n\n${ts}`;
              } else {
                return ts;
              }
            })(),
          unity: createCSharpSnippet(contractName, property.name),
        },
        reference: {
          javascript:
            tsExample?.properties
              ?.find(
                (p) => p.name.toLowerCase() === property.name.toLowerCase(),
              )
              ?.reference?.toLowerCase() || "",
          python:
            pythonExample?.properties?.find(
              (p) =>
                p.name.replaceALl("_", "").toLowerCase() ===
                property.name.toLowerCase(),
            )?.reference || "",
          go:
            goExample?.properties?.find(
              (p) => p.name.toLowerCase() === property.name.toLowerCase(),
            )?.reference || "",
          react:
            createReactSnippet(contractName, property.name).reference ||
            tsExample?.properties
              ?.find(
                (p) => p.name.toLowerCase() === property.name.toLowerCase(),
              )
              ?.reference?.toLowerCase() ||
            "",
        },
      })) || [];

    // Add reference for typescript contract interface
    if (tsExample?.reference) {
      data.reference.typescript = tsExample.reference;
    }

    // Add reference for python contract interface
    if (pythonExample?.reference) {
      data.reference.python = pythonExample.reference;
    }

    // Add reference for go contract interface
    if (goExample?.reference) {
      data.reference.go = goExample.reference;
    }

    // Add setup examples for each SDK
    data.examples = {
      ...(tsExample?.examples || {}),
      ...(reactExample?.examples?.javascript
        ? { react: reactExample.examples.javascript }
        : {}),
      ...(pythonExample?.example ? { python: pythonExample.example } : {}),
      ...(goExample?.example ? { go: goExample.example } : {}),
    };

    acc[contractName.replace("", "")] = data;

    return acc;
  }, {});

  // snippets.json
  fs.writeFileSync(
    `${process.cwd()}/snippets/snippets.json`,
    JSON.stringify(snippets, null, 2),
  );

  // feature_snippets_sdk
  fs.writeFileSync(
    `${process.cwd()}/snippets/feature_snippets_sdk.json`,
    JSON.stringify(typescriptFeatureSnippets, null, 2),
  );

  // feature_snippets_react
  fs.writeFileSync(
    `${process.cwd()}/snippets/feature_snippets_react.json`,
    JSON.stringify(
      {
        ...reactFeatureSnippets,
        ...reactCoreFeatureSnippets,
      },
      null,
      2,
    ),
  );
}

async function getPythonSnippetsJSON() {
  const res = await fetch(
    "https://raw.githubusercontent.com/thirdweb-dev/python-sdk/main/docs/docs/snippets.json",
  );
  const data = await res.json();
  return data;
}

async function getGoSnippetsJSON() {
  const res = await fetch(
    "https://raw.githubusercontent.com/thirdweb-dev/go-sdk/main/docs/snippets.json",
  );
  const data = await res.json();
  return data;
}

main();
