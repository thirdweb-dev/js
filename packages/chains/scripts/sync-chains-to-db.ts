import merge from "deepmerge";
import fs from "fs/promises";
import path from "path";
import { Chain } from "../src/types";
import { createChain } from "../src/api";

const HOST = "https://api.thirdweb.com";
const SECRET_KEY = process.env.SECRET_KEY as string;

if (!SECRET_KEY) {
  throw new Error("SECRET_KEY env var is required");
}

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

/**
 * @param {Chain['explorers']} explorers
 */
function sortExplorers(explorers: Chain["explorers"] = []) {
  let etherscan: any = null;
  let blockscout: any = null;

  let restExplorers: any = [];

  for (const explorer of explorers) {
    if (explorer.name.includes("etherscan")) {
      etherscan = explorer;
    } else if (explorer.name.includes("blockscout")) {
      blockscout = explorer;
    } else {
      restExplorers.push(explorer);
    }
  }

  const returnExplorers: any = [];
  if (etherscan) {
    returnExplorers.push(etherscan);
  }
  if (blockscout) {
    returnExplorers.push(blockscout);
  }

  return [...returnExplorers, ...restExplorers];
}

/**
 * @param {readonly any[]} values
 * @param {(arg0: any) => void} valueChecker
 */
function filterOutErroringValues(values, valueChecker) {
  return values.filter((value) => {
    try {
      valueChecker(value);
      return true;
    } catch (e) {
      return false;
    }
  });
}

const chainsJsonUrl = "https://chainid.network/chains.json";
const iconRoute =
  "https://raw.githubusercontent.com/ethereum-lists/chains/master/_data/icons";

/** @type {Record<number, Partial<Chain>>} */
let overrides = {};

// get all overides by reading the overrides directory and importing them
const overridesDir = path.join(process.cwd(), "./data/overrides");
const overridesFiles = await fs.readdir(overridesDir);
for (const file of overridesFiles) {
  // file:// is required for windows builds
  const override = await import(path.join(overridesDir, file));
  // get file name without extension
  const chainId = parseInt(file.split(".")[0]);
  overrides[chainId] = override.default;
}

console.log("Downloading...");
// chains from remote src
/** @type {Chain[]} */
const chainsRes = await fetch(chainsJsonUrl);
let chains = await chainsRes.json();
// immediately filter out localhost
chains = chains.filter((c) => c.chainId !== 1337);

// additional chains

// get all additional chains by reading the additional chains directory and importing them
const additionalChainsDir = path.join(process.cwd(), "./data/additional");
const additionalChainsFiles = await fs.readdir(additionalChainsDir);
for (const file of additionalChainsFiles) {
  // file:// is required for windows builds
  const additionalChain = await import(path.join(additionalChainsDir, file));

  chains = chains.filter((c) => c.chainId !== additionalChain.default.chainId);
  chains.push(additionalChain.default);
}
// Keep scroll-alpha-testnet for now even though its deprecated
chains = chains.filter(
  (c) => c.status !== "deprecated" || c.chainId === 534353,
);

console.log("Downloaded: ", chains.length);

/**
 * Sort RPCs in chain
 * @param {Chain} chain
 */
function sortRPCs(chain) {
  const thirdwebRPCs: string[] = [];
  const alchemyRPCs: string[] = [];
  const infuraRPCs: string[] = [];
  const otherRPCs: string[] = [];

  chain.rpc.forEach((rpc) => {
    if (rpc.includes("${THIRDWEB_API_KEY}")) {
      thirdwebRPCs.push(rpc);
    } else if (rpc.includes("${ALCHEMY_API_KEY}")) {
      alchemyRPCs.push(rpc);
    } else if (rpc.includes("${INFURA_API_KEY}")) {
      infuraRPCs.push(rpc);
    } else {
      otherRPCs.push(rpc);
    }
  });

  chain.rpc = [...thirdwebRPCs, ...infuraRPCs, ...alchemyRPCs, ...otherRPCs];
  return chain;
}

const takenSlugs = {};

const iconMetaMap = new Map();

async function downloadIcon(icon) {
  if (iconMetaMap.has(icon)) {
    return iconMetaMap.get(icon);
  }
  const res = await fetch(`${iconRoute}/${icon}.json`);
  const result = await res.json();
  if (res.status == 200) {
    const iconMeta = result[0];

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
  if (slug === "bnb-smart-chain") {
    slug = "binance";
  }
  if (slug === "bnb-smart-chain-testnet") {
    slug = "binance-testnet";
  }
  if (slug === "base-goerli-testnet") {
    slug = "base-goerli";
  }
  // optimisim rename handling
  if (slug === "op") {
    slug = "optimism";
  }
  // end special cases

  takenSlugs[slug] = true;
  return slug;
}

const results: Chain[] = await Promise.all(
  chains.map(async (chain) => {
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

    chain = {
      ...chain,
      testnet,
    };
    // only add the explroers if they were there in the first place
    if (chain.explorers) {
      chain.explorers = sortExplorers(chain.explorers);
      // check every key that *could* contain a url and validate it
      chain.explorers = filterOutErroringValues(
        chain.explorers,
        (explorer) => new URL(explorer.url),
      );
    }
    if (chain.faucets) {
      chain.faucets = filterOutErroringValues(
        chain.faucets,
        (faucet) => new URL(faucet),
      );
    }
    if (chain.rpc) {
      chain.rpc = filterOutErroringValues(chain.rpc, (rpc) => new URL(rpc));
    }
    if (chain.infoURL) {
      try {
        new URL(chain.infoURL);
      } catch (e) {
        delete chain.infoURL;
      }
    }

    chain = sortRPCs(chain);

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

    return chain;
  }),
);

console.log("Uploading...");

let successes = 0;
let duplicates = 0;
let errors = 0;

for (const chain of results) {
  try {
    const res = await createChain(chain, { host: HOST, secretKey: SECRET_KEY });
    if (res.error) {
      if (res.code === "CHAIN_ID_CLASH") {
        duplicates++;
      } else {
        console.log("Error:", res.error, chain.chainId);
        errors++;
      }
    } else {
      successes++;
    }
  } catch (e) {
    console.log("Error:", e, chain.chainId);
    errors++;
  }
}

console.log("Successes:", successes);
console.log("Duplicates:", duplicates);
console.log("Errors:", errors);
