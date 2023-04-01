// @ts-check
import merge from "deepmerge";
import fs from "fs";
import path from "path";
import fetch from "cross-fetch";
import { checkRpcs, isInvalidChainIdError } from "./utils/checkRpcs.mjs";
import { findSlug } from "./utils/computeSlug.mjs";
import { downloadIcon } from "./utils/download-icon.mjs";

/** @typedef {import("../src/types").Chain} Chain */

const combineMerge = (target, source) => {
  let destination = target.slice();

  source.forEach((item) => {
    if (target.indexOf(item) === -1) {
      destination = [item, ...destination];
    }
  });
  return destination;
};

const chainsDir = "./chains";
const badRPCsFile = "./bad-rpcs.md";

const chainsJsonUrl = "https://chainid.network/chains.json";

/** @type {Record<number, Partial<Chain>>} */
let overrides = {};

// get all overides by reading the overrides directory and importing them
const overridesDir = path.join(process.cwd(), "./data/overrides");
const overridesFiles = fs.readdirSync(overridesDir);
for (const file of overridesFiles) {
  // file:// is required for windows builds
  const override = await import(path.join("file://", overridesDir, file));
  // get file name without extension
  const chainId = parseInt(file.split(".")[0]);
  overrides[chainId] = override.default;
}

// chains from remote src

/** @type {Chain[]} */
let chains = await (await fetch(chainsJsonUrl)).json();
// immediately filter out localhost
chains = chains.filter((c) => c.chainId !== 1337);

// additional chains

// get all additional chains by reading the additional chains directory and importing them
const additionalChainsDir = path.join(process.cwd(), "./data/additional");
const additionalChainsFiles = fs.readdirSync(additionalChainsDir);
for (const file of additionalChainsFiles) {
  // file:// is required for windows builds
  const additionalChain = await import(
    path.join("file://", additionalChainsDir, file)
  );
  chains.push(additionalChain.default);
}

chains = chains
  .filter((c) => c.status !== "deprecated")
  .map((chain) => {
    if (overrides[chain.chainId]) {
      chain = merge(chain, overrides[chain.chainId], {
        arrayMerge: combineMerge,
      });
    }

    // apparently this is the best way to do this off of raw data
    const testnet =
      chain.testnet === false
        ? false
        : JSON.stringify(chain).toLowerCase().includes("test");

    return {
      ...chain,
      testnet,
    };
  });

const imports = [];
const exports = [];
const exportNames = [];

const chainDir = `${chainsDir}`;
// clean out the chains directory
fs.rmdirSync(chainDir, { recursive: true });
// make sure the chain directory exists
fs.mkdirSync(chainDir, { recursive: true });

// clear out the bad rpcs file
fs.writeFileSync(badRPCsFile, `# Bad RPCs\n\n`);

let mismatchedChainIdErrors = [];
let fetchErrors = [];

const CHUNK_SIZE = 250;

let totalProcessed = 0;

console.log("Processing chains, total chains:", chains.length);

while (chains.length > 0) {
  const chunkedChains = chains.splice(0, Math.min(CHUNK_SIZE, chains.length));

  await Promise.all(
    chunkedChains.map(async (chain) => {
      const promises = [
        // chain icon
        Promise.resolve(),
        // chain explorers (may have icons)
        Promise.all(chain.explorers || []),
        // rpcs
        // if the chain is localhost, we don't need to check the rpcs
        chain.chainId === 1337
          ? chain.rpc
          : checkRpcs(chain, (rpcUrl, error) => {
              if (isInvalidChainIdError(error)) {
                mismatchedChainIdErrors.push({ chain, rpcUrl, error });
              } else {
                fetchErrors.push({ chain, rpcUrl, error });
              }
            }),
      ];
      if ("icon" in chain && typeof chain.icon === "string") {
        promises[0] = downloadIcon(chain.icon);
      }
      if ("explorers" in chain && Array.isArray(chain.explorers)) {
        promises[1] = Promise.all(
          chain.explorers.map((explorer) => {
            if ("icon" in explorer && typeof explorer.icon === "string") {
              return downloadIcon(explorer.icon)
                .then((iconMeta) => {
                  if (iconMeta) {
                    explorer.icon = iconMeta;
                  }
                  return explorer;
                })
                .catch(() => {
                  return explorer;
                });
            }
            return explorer;
          }),
        );
      }
      const [icon, explorers, rpcs] = await Promise.all(promises);

      if (icon) {
        // @ts-ignore
        chain.icon = icon;
      }
      if (explorers && explorers.length > 0) {
        // @ts-ignore
        chain.explorers = explorers;
      }
      if (rpcs) {
        chain.rpc = rpcs;
      }
      const slug = findSlug(chain);
      chain.slug = slug;
      // if the chain has RPCs that we can use then prepend our RPC to the list
      const chainHasHttpRpc = chain.rpc.some((rpc) => rpc.startsWith("http"));
      // if the chain has RPCs that we can use then prepend our RPC to the list
      // we're exlcuding localhost because we don't want to use our RPC for localhost
      if (chainHasHttpRpc && chain.chainId !== 1337) {
        chain.rpc = [
          `https://${slug}.rpc.thirdweb.com/${"${THIRDWEB_API_KEY}"}`,
          ...chain.rpc,
        ];
      }
      // unique rpcs
      chain.rpc = [...new Set(chain.rpc)];
      fs.writeFileSync(
        `${chainDir}/${chain.chainId}.ts`,
        `import type { Chain } from "../src/types";
export default ${JSON.stringify(chain, null, 2)} as const satisfies Chain;`,
      );

      let exportName = slug
        .split("-")
        .map((s) => s[0].toUpperCase() + s.slice(1))
        .join("");

      // if chainName starts with a number, prepend an underscore
      if (exportName.match(/^[0-9]/)) {
        exportName = `_${exportName}`;
      }

      imports.push(
        `import c${chain.chainId} from "../chains/${chain.chainId}";`,
      );

      exports.push(`export const ${exportName} = c${chain.chainId};`);

      exportNames.push(exportName);
    }),
  );
  totalProcessed += chunkedChains.length;
  console.log(
    "Chains processed: ",
    totalProcessed,
    "Remaining: ",
    chains.length,
  );
}

// write out the bad rpcs file
// mismatch chain id errors are more important than fetch errors
// sort the errors first by chain id then by rpc url within the chain id
mismatchedChainIdErrors = mismatchedChainIdErrors.sort((a, b) => {
  if (a.chain.chainId < b.chain.chainId) {
    return -1;
  }
  if (a.chain.chainId > b.chain.chainId) {
    return 1;
  }
  if (a.rpcUrl < b.rpcUrl) {
    return -1;
  }
  if (a.rpcUrl > b.rpcUrl) {
    return 1;
  }
  return 0;
});
const hasWrittenChainIdHeader = {};
// write the mismatched chain id errors to the file
if (mismatchedChainIdErrors.length > 0) {
  fs.appendFileSync(
    badRPCsFile,
    `## Mismatched Chain IDs\n
**Why is this bad?**
If the chain ID is mismatched then the RPC is not actually connected to the chain. This means that the RPC is not actually serving the chain and is not a valid RPC for the chain.\n\n`,
  );
}
mismatchedChainIdErrors.forEach(({ chain, rpcUrl, error }) => {
  if (!hasWrittenChainIdHeader[chain.chainId]) {
    fs.appendFileSync(
      badRPCsFile,
      `\n#### ${chain.name} (${chain.chainId})\n\n`,
    );
    hasWrittenChainIdHeader[chain.chainId] = true;
  }
  fs.appendFileSync(
    badRPCsFile,
    `<details>
  <summary>${rpcUrl}</summary>
  
  \`\`\`js
  ${error}
  \`\`\`
</details>
\n\n`,
  );
});

fetchErrors = fetchErrors.sort((a, b) => {
  if (a.chain.chainId < b.chain.chainId) {
    return -1;
  }
  if (a.chain.chainId > b.chain.chainId) {
    return 1;
  }
  if (a.rpcUrl < b.rpcUrl) {
    return -1;
  }
  if (a.rpcUrl > b.rpcUrl) {
    return 1;
  }
  return 0;
});

if (fetchErrors.length > 0) {
  fs.appendFileSync(
    badRPCsFile,
    `## Fetch Errors\n
**Why is this bad?**
If the RPC is not responding then it is not useful.\n\n`,
  );
}
const hasWrittenFetchHeader = {};
fetchErrors.forEach(({ chain, rpcUrl, error }) => {
  if (!hasWrittenFetchHeader[chain.chainId]) {
    fs.appendFileSync(
      badRPCsFile,
      `\n#### ${chain.name} (${chain.chainId})\n\n`,
    );
    hasWrittenFetchHeader[chain.chainId] = true;
  }
  fs.appendFileSync(
    badRPCsFile,
    `<details>
  <summary>${rpcUrl}</summary>

  \`\`\`js
  ${error}
  \`\`\`
</details>\n\n`,
  );
});

fs.writeFileSync(
  `./src/index.ts`,
  `${imports.join("\n")}
import type { Chain } from "./types";

${exports.join("\n")}
export * from "./types";
export * from "./utils";
export const defaultChains = [Ethereum, Goerli, Polygon, Mumbai, Arbitrum, ArbitrumGoerli, Optimism, OptimismGoerli, Binance, BinanceTestnet, Fantom, FantomTestnet, Avalanche, AvalancheFuji, Localhost];
export const allChains = [${exportNames.join(", ")}];

const chainsById = {
  ${exportNames.map((n) => `[${n}.chainId]: ${n}`).join(",\n")}
} as const;

const chainIdsBySlug = {
  ${exportNames.map((n) => `[${n}.slug]: ${n}.chainId`).join(",\n")}
} as const;

function isValidChainId(chainId: number): chainId is ChainId {
  return chainId in chainsById;
}

function isValidChainSlug(slug: string): slug is ChainSlug {
  return slug in chainIdsBySlug;
}

export function getChainByChainId<TChainId extends ChainId>(
  chainId: TChainId | (number & {}),
) {
  if (isValidChainId(chainId)) {
    return chainsById[chainId] as (typeof chainsById)[TChainId];
  }
  throw new Error(\`Chain with chainId "\${chainId}" not found\`);
}

export function getChainBySlug<TSlug extends ChainSlug>(
  slug: TSlug | (string & {}),
) {
  if (isValidChainSlug(slug)) {
    return chainsById[chainIdsBySlug[slug]] as (typeof chainsById)[
      (typeof chainIdsBySlug)[TSlug]
      ];
  }
  throw new Error(\`Chain with slug "\${slug}" not found\`);
}

export type ChainSlug = keyof typeof chainIdsBySlug;
export type ChainId = keyof typeof chainsById;`,
);

process.exit(0);
