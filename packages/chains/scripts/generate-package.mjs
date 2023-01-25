import axios from "axios";
import fs from "fs";

const chainsDir = "./chains";

/** @typedef {{name: string, chain: string, icon: string, rpc: string[], faucets?: any[], nativeCurrency: {name: string, symbol: string, decimals: number}, infoURL?: string, shortName: string, chainId: number, networkId: number, slip44?: number, ens: {registry: string}, explorers?: {name: string, url: string, standard: string}[] }} Chain */

const chainsJsonUrl = "https://chainid.network/chains.json";
const iconRoute =
  "https://raw.githubusercontent.com/ethereum-lists/chains/master/_data/icons";

const thirdwebRpc = JSON.parse(fs.readFileSync("./thirdweb-rpc.json"));

/** @type {Chain[]} */
let chains = (await axios.get(chainsJsonUrl)).data;

chains = chains
  .filter((c) => c.status !== "deprecated")
  .map((chain) => {
    if (thirdwebRpc[chain.chainId]) {
      chain.rpc = [
        `https://${
          thirdwebRpc[chain.chainId]
        }.rpc.thirdweb.com/${"${THIRDWEB_API_KEY}"}`,
        ...chain.rpc,
      ];
    }

    // apparently this is the best way to do this off of raw data
    const testnet = JSON.stringify(chain).toLowerCase().includes("test");

    return {
      ...chain,
      testnet,
    };
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
  takenSlugs[slug] = true;
  return slug;
}

for (const chain of chains) {
  const chainDir = `${chainsDir}`;
  if (!fs.existsSync(chainDir)) {
    fs.mkdirSync(chainDir, { recursive: true });
  }

  try {
    if ("icon" in chain) {
      const response = await axios.get(`${iconRoute}/${chain.icon}.json`);
      if (response.status == 200) {
        const iconMeta = response.data[0];
        chain.icon = iconMeta;
        if (!chainToIcon[chain.chain]) {
          chainToIcon[chain.chain] = iconMeta;
        }
      } else {
        console.log(response);
      }
    } else {
      // if no icon, use the icon of the chain with the same name
      if (chainToIcon[chain.chain]) {
        chain.icon = chainToIcon[chain.chain];
      }
    }
  } catch (err) {
    console.log(err.message);
  }

  // figure out a slug for the chain

  const slug = findSlug(chain);
  chain.slug = slug;

  fs.writeFileSync(
    `${chainDir}/${chain.chainId}.json`,
    JSON.stringify(chain, null, 2),
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
    `import c${chain.chainId} from "../chains/${chain.chainId}.json";`,
  );

  exports.push(`export const ${exportName} = c${chain.chainId} as Chain;`);

  exportNames.push(exportName);
}

fs.writeFileSync(
  `./src/index.ts`,
  `${imports.join("\n")}
import type { Chain } from "./types";

${exports.join("\n")}
export * from "./types";
export const defaultChains = [Ethereum, Goerli, Polygon, Mumbai, ArbitrumOne, ArbitrumGoerli, Optimism, OptimismGoerliTestnet, BinanceSmartChain, BinanceSmartChainTestnet, FantomOpera, FantomTestnet, AvalancheCChain, AvalancheFujiTestnet];
export const allChains = [${exportNames.join(", ")}];
`,
);
