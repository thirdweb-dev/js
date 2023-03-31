// @ts-check
import axios from "axios";
import merge from "deepmerge";
import fs from "fs";
import path from "path";

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

const chainsJsonUrl = "https://chainid.network/chains.json";
const iconRoute =
  "https://raw.githubusercontent.com/ethereum-lists/chains/master/_data/icons";

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
let chains = (await axios.get(chainsJsonUrl)).data;
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

const takenSlugs = {};

const iconMetaMap = new Map();

async function downloadIcon(icon) {
  if (iconMetaMap.has(icon)) {
    return iconMetaMap.get(icon);
  }
  const result = await axios.get(`${iconRoute}/${icon}.json`);
  if (result.status == 200) {
    const iconMeta = result.data[0];

    iconMetaMap.set(icon, iconMeta);
    return iconMeta;
  }
  throw new Error(`Could not download icon for ${icon}`);
}

function findSlug(chain) {
  let slug = chain.name
    .toLowerCase()
    .replace("mainnet", "")
    .trim()
    // replace all non alpha numeric characters with a dash
    .replace(/[^a-z0-9]/g, "-")
    .replaceAll(" - ", " ")
    .replaceAll(" ", "-");

  if (takenSlugs[slug]) {
    slug = `${slug}-${chain.shortName}`;
  }
  slug = slug.replaceAll("---", "-").replaceAll("--", "-");

  if (slug.endsWith("-")) {
    slug = slug.slice(0, -1);
  }
  // special cases for things that we already had in rpc.thirdweb.com
  if (slug === "fantom-opera") {
    slug = "fantom";
  }
  if (slug === "avalanche-c-chain") {
    slug = "avalanche";
  }
  if (slug === "avalanche-fuji-testnet") {
    slug = "avalanche-fuji";
  }
  if (slug === "optimism-goerli-testnet") {
    slug = "optimism-goerli";
  }
  if (slug === "arbitrum-one") {
    slug = "arbitrum";
  }
  if (slug === "binance-smart-chain") {
    slug = "binance";
  }
  if (slug === "binance-smart-chain-testnet") {
    slug = "binance-testnet";
  }
  if (slug === "base-goerli-testnet") {
    slug = "base-goerli";
  }
  // end special cases

  takenSlugs[slug] = true;
  return slug;
}

const chainDir = `${chainsDir}`;
// clean out the chains directory
fs.rmdirSync(chainDir, { recursive: true });
// make sure the chain directory exists
fs.mkdirSync(chainDir, { recursive: true });

for (const chain of chains) {
  try {
    if ("icon" in chain) {
      if (typeof chain.icon === "string") {
        const iconMeta = await downloadIcon(chain.icon);
        if (iconMeta) {
          chain.icon = iconMeta;
        }
      }
    }
    if ("explorers" in chain && Array.isArray(chain.explorers)) {
      for (const explorer of chain.explorers) {
        if ("icon" in explorer) {
          if (typeof explorer.icon === "string") {
            const iconMeta = await downloadIcon(explorer.icon);
            if (iconMeta) {
              explorer.icon = iconMeta;
            }
          }
        }
      }
    }
  } catch (err) {
    console.log(err.message);
  }

  // figure out a slug for the chain

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

  imports.push(`import c${chain.chainId} from "../chains/${chain.chainId}";`);

  exports.push(`export const ${exportName} = c${chain.chainId};`);

  exportNames.push(exportName);
}

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
