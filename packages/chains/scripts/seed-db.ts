import axios from "axios";
import merge from "deepmerge";
import fs from "fs/promises";
import path from "path";
import { Chain, ChainExplorer } from "../src/types";

const BASE_URI = process.env.BASE_URI as string;
const SECRET_KEY = process.env.SECRET_KEY as string;

console.log("====== Seeding DB ======");

// merging for arrays for "deepMerge" strategy
function combineMerge<TData>(target: TData[], source: TData[]): TData[] {
  let destination = target.slice();

  source.forEach((item) => {
    if (target.indexOf(item) === -1) {
      destination = [item, ...destination];
    }
  });
  return destination;
}

function sortExplorers(explorers: ChainExplorer[] = []): ChainExplorer[] {
  let etherscan: ChainExplorer | null = null;
  let blockscout: ChainExplorer | null = null;

  let restExplorers: ChainExplorer[] = [];

  for (const explorer of explorers) {
    if (explorer.name.includes("etherscan")) {
      etherscan = explorer;
    } else if (explorer.name.includes("blockscout")) {
      blockscout = explorer;
    } else {
      restExplorers.push(explorer);
    }
  }

  const returnExplorers: ChainExplorer[] = [];
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
  const override = await import(path.join(overridesDir, file));
  // get file name without extension
  const chainId = parseInt(file.split(".")[0]);
  overrides[chainId] = override.default;
}

// chains from remote src

/** @type {Chain[]} */
let chains = (await axios.get(chainsJsonUrl)).data;
// immediately filter out localhost
chains = chains.filter((c: Chain) => c.chainId !== 1337);

// additional chains

// get all additional chains by reading the additional chains directory and importing them
const additionalChainsDir = path.join(process.cwd(), "./data/additional");
const additionalChainsFiles = await fs.readdir(additionalChainsDir);
for (const file of additionalChainsFiles) {
  const additionalChain = await import(path.join(additionalChainsDir, file));

  chains = chains.filter(
    (c: Chain) => c.chainId !== additionalChain.default.chainId,
  );
  chains.push(additionalChain.default);
}
// Keep scroll-alpha-testnet for now even though its deprecated
chains = chains.filter(
  (c: Chain) => c.status !== "deprecated" || c.chainId === 534353,
);

/**
 * Sort RPCs in chain
 */
function sortRPCs(chain: Chain) {
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

const results: Chain[] = await Promise.all(
  chains.map(async (chain: Chain) => {
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
      chain.explorers = sortExplorers(chain?.explorers as any);
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

    chain.rpc = [...new Set(chain.rpc)];

    chain.features = chain.features?.map((feature) => feature.name) as any;

    return chain;
  }),
);

async function getAllPaginatedChains(
  chains: any[] = [],
  pathname = "/v1/chains",
) {
  const url = new URL(BASE_URI);
  url.pathname = pathname;
  const res = await fetch(decodeURIComponent(url.toString()));
  const json = await res.json();

  if (json.error) {
    console.error("Failed to fully load chains from DB", json.error);
    return chains;
  }
  if (json.next) {
    return getAllPaginatedChains([...chains, ...json.data], json.next);
  }
  return [...chains, ...json.data];
}

// get the chains that are already in the db
const existingChains = await getAllPaginatedChains();
// get all chainIds that are already in the db
const existingChainIds = existingChains.map((chain) => BigInt(chain.chainId));
// filter out chains that are already in the db
const chainsToSeed = results.filter(
  (c) => existingChainIds.indexOf(BigInt(c.chainId)) === -1,
);

console.log(`Total chains to seed: ${chainsToSeed.length}`);

let success = 0;
let error = 0;
let progress = 0;
let conflict = 0;

for (let seedChain of chainsToSeed) {
  progress++;
  const res = await fetch(`${BASE_URI}/v1/chains?public=true`, {
    method: "POST",
    body: JSON.stringify(seedChain),
    headers: {
      "Content-Type": "application/json",
      "x-secret-key": SECRET_KEY,
    },
  });

  if (res.status === 200) {
    success++;
  } else if (res.status === 409) {
    conflict++;
  } else {
    error++;
  }
  // delay to not overload server
  process.stdout.write(".");
  await new Promise((resolve) => setTimeout(resolve, 50));
}

console.log(`
========================
  Success: ${success}
 Conflict: ${conflict}
    Error: ${error}
========================
`);
