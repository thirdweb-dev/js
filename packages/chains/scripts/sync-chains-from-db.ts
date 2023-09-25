import fs from "fs/promises";
import { getChainList } from "../src/api";
import { Chain } from "../src/types";

const HOST = "https://api.thirdweb.com";

// accumulate all chains

let page = 0;
let allChains: Chain[] = [];

async function getAllChains() {
  const list = await getChainList({ page, limit: 1000 }, { host: HOST });

  allChains = [...allChains, ...list.data];
  console.log(list);
  if (list.data.length < 1000) {
    return;
  }
  page++;
  await getAllChains();
}
await getAllChains();

console.log("Total chains:", allChains.length);

const chainDir = "./chains";
// clean out the chains directory
await fs.rmdir(chainDir, { recursive: true });
// make sure the chain directory exists
await fs.mkdir(chainDir, { recursive: true });

const results = await Promise.all(
  allChains.map(async (chain) => {
    // @ts-ignore
    await fs.writeFile(
      `${chainDir}/${chain.chainId}.ts`,
      `import type { Chain } from "../src/types";
export default ${JSON.stringify(chain, null, 2)} as const satisfies Chain;`,
    );

    let exportName = chain.slug
      .split("-")
      .map((s) => s[0].toUpperCase() + s.slice(1))
      .join("");

    // if chainName starts with a number, prepend an underscore
    if (exportName.match(/^[0-9]/)) {
      exportName = `_${exportName}`;
    }

    const key = `c${chain.chainId}`;

    return {
      imp: `import c${chain.chainId} from "../chains/${chain.chainId}";`,
      exp: `export { default as ${exportName} } from "../chains/${chain.chainId}"`,
      chain,
      key,
      exportName,
    };
  }),
);

const { imports, exports, exportNames, exportNameToChain } = results.reduce(
  (acc, result) => {
    // @ts-ignore
    acc.imports.push(result.imp);
    // @ts-ignore
    acc.exports.push(result.exp);
    // @ts-ignore
    acc.exportNames.push(result.key);
    acc.exportNameToChain[result.key] = result.chain;
    return acc;
  },
  {
    imports: [],
    exports: [],
    exportNames: [],
    exportNameToChain: {},
  },
);

// @ts-ignore
await fs.writeFile(
  `./src/index.ts`,
  `${imports.join("\n")}
import type { Chain } from "./types";

${exports.join("\n")}
export * from "./types";
export * from "./utils";
export * from "./api";
export const defaultChains = [c1, c5, c8453, c84531, c137, c80001, c42161, c421613, c10, c420, c56, c97, c250, c4002, c43114, c43113, c1337];
// @ts-expect-error - TODO: fix this later
export const allChains: Chain[] = [${exportNames.join(", ")}];

type ChainsById = {
  ${exportNames
    // @ts-ignore
    .map((n) => `${exportNameToChain[n].chainId}: typeof ${n}`)
    .join(",\n")}
};

type ChainIdsBySlug = {
  ${exportNames
    .map(
      // @ts-ignore
      (n) => `"${exportNameToChain[n].slug}": ${exportNameToChain[n].chainId}`,
    )
    .join(",\n")}
};

let _chainsById: Record<number, Chain>;
let _chainIdsBySlug: Record<string, number>;

function getChainsById() {
  if (_chainsById) {
    return _chainsById;
  }
  _chainsById = {};
  allChains.forEach((chain) => {
    _chainsById[chain.chainId] = chain;
  });
  return _chainsById;
}

export function getChainIdsBySlug() {
  if (_chainIdsBySlug) {
    return _chainIdsBySlug;
  }
  _chainIdsBySlug = {};
  allChains.forEach((chain) => {
    _chainIdsBySlug[chain.slug] = chain.chainId;
  });
  return _chainIdsBySlug;
}

export type ChainSlug = keyof ChainIdsBySlug;
export type ChainId = keyof ChainsById;

function isValidChainId(chainId: number): chainId is ChainId {
  const chainsById = getChainsById();
  return chainId in chainsById;
}

function isValidChainSlug(slug: string): slug is ChainSlug {
  const chainIdsBySlug = getChainIdsBySlug();
  return slug in chainIdsBySlug;
}

export function getChainByChainId<TChainId extends ChainId>(
  chainId: TChainId | (number & {}),
) {
  if (isValidChainId(chainId)) {
    const chainsById = getChainsById();
    return chainsById[chainId] as ChainsById[TChainId];
  }
  throw new Error(\`Chain with chainId "\${chainId}" not found\`);
}

export function getChainBySlug<TSlug extends ChainSlug>(
  slug: TSlug | (string & {}),
) {
  if (isValidChainSlug(slug)) {
    const chainIdsBySlug = getChainIdsBySlug();
    const chainsById = getChainsById();
    return chainsById[
      chainIdsBySlug[slug]
    ] as ChainsById[ChainIdsBySlug[TSlug]];
  }
  throw new Error(\`Chain with slug "\${slug}" not found\`);
}
`,
);
