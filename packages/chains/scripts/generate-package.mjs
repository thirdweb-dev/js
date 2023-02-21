import axios from "axios";
import merge from "deepmerge";
import fs from "fs";

const combineMerge = (target, source, options) => {
  let destination = target.slice();

  source.forEach((item, index) => {
    if (target.indexOf(item) === -1) {
      destination = [item, ...destination];
    }
  });
  return destination;
};

const chainsDir = "./chains";

/** @typedef {{name: string, chain: string, icon: string, rpc: string[], faucets?: any[], nativeCurrency: {name: string, symbol: string, decimals: number}, infoURL?: string, shortName: string, chainId: number, networkId: number, slip44?: number, ens: {registry: string}, explorers?: {name: string, url: string, standard: string}[] }} Chain */

const chainsJsonUrl = "https://chainid.network/chains.json";
const iconRoute =
  "https://raw.githubusercontent.com/ethereum-lists/chains/master/_data/icons";

const overrides = JSON.parse(fs.readFileSync("./overrides.json"));

/** @type {Chain[]} */
let chains = (await axios.get(chainsJsonUrl)).data;

chains = chains
  .filter((c) => c.status !== "deprecated")
  .map((chain) => {
    if (overrides[chain.chainId]) {
      chain = merge(chain, overrides[chain.chainId], {
        arrayMerge: combineMerge,
      });
    }

    // apparently this is the best way to do this off of raw data
    const testnet = JSON.stringify(chain).toLowerCase().includes("test");

    return {
      ...chain,
      testnet,
    };
  });

chains = chains.filter((c) => c.chainId !== 1337);
// inject in localhost
chains.push({
  name: "Localhost",
  chain: "ETH",
  rpc: ["http://localhost:8545"],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  // hard code eth icon for now
  icon: {
    url: "ipfs://QmcxZHpyJa8T4i63xqjPYrZ6tKrt55tZJpbXcjSDKuKaf9/ethereum/512.png",
    height: 512,
    width: 512,
    format: "png",
    sizes: [16, 32, 64, 128, 256, 512],
  },
  shortName: "local",
  chainId: 1337,
  networkId: 1337,
  testnet: true,
});

const imports = [];
const exports = [];
const exportNames = [];

const chainToIcon = {};

const takenSlugs = {};

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
        const response = await axios.get(`${iconRoute}/${chain.icon}.json`);
        if (response.status == 200) {
          const iconMeta = response.data[0];
          chain.icon = iconMeta;
          if (!chainToIcon[chain.chain]) {
            chainToIcon[chain.chain] = iconMeta;
          }
        }
      } else {
        // just pass it through
        chainToIcon[chain.chain] = chain.icon;
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
    `export default ${JSON.stringify(chain, null, 2)} as const;`,
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

  exports.push(
    `export const ${exportName} = c${chain.chainId} satisfies Chain;`,
  );

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
`,
);
