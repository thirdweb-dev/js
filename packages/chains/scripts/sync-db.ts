import fs from "fs/promises";
import { ApiChain, Chain } from "../src/types";

const BASE_URI = process.env.BASE_URI as string;

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

async function sync() {
  const allChainsInDB = (await getAllPaginatedChains()) as ApiChain[];
  const chainsDir = "./chains";
  // clean out the chains directory
  await fs.rmdir(chainsDir, { recursive: true });
  // make sure the chain directory exists
  await fs.mkdir(chainsDir, { recursive: true });

  const results = await Promise.all(
    allChainsInDB.map(async (chain) => {
      const pkgChain: Chain = {
        ...chain,
        chainId: Number(chain.chainId),
        features: chain.features?.map((feature) => ({ name: feature })),
      };
      // remove all null values
      Object.keys(pkgChain).forEach((key) => {
        // @ts-ignore
        if (pkgChain[key] === null || pkgChain[key] === undefined) {
          // @ts-ignore
          delete pkgChain[key];
        }
      });

      // sort top level keys alphabetically
      // @ts-ignore
      const sortedChain: Chain = {};
      Object.keys(pkgChain)
        .sort()
        .forEach((key) => {
          // @ts-ignore
          sortedChain[key] = pkgChain[key];
        });

      // @ts-ignore
      await fs.writeFile(
        `${chainsDir}/${sortedChain.chainId}.ts`,
        `import type { Chain } from "../src/types";
export default ${JSON.stringify(
          sortedChain,
          null,
          2,
        )} as const satisfies Chain;`,
      );

      let exportName = sortedChain.slug
        .split("-")
        .map((s) => s[0].toUpperCase() + s.slice(1))
        .join("");

      // if chainName starts with a number, prepend an underscore
      if (exportName.match(/^[0-9]/)) {
        exportName = `_${exportName}`;
      }

      // imports.push(`import c${chain.chainId} from "../chains/${chain.chainId}";`);

      // exports.push(
      //   `export { default as ${exportName} } from "../chains/${chain.chainId}"`,
      // );

      const key = `c${sortedChain.chainId}`;

      // exportNames.push(key);
      // exportNameToChain[key] = chain;

      return {
        imp: `import c${sortedChain.chainId} from "../chains/${sortedChain.chainId}";`,
        exp: `export { default as ${exportName} } from "../chains/${sortedChain.chainId}"`,
        chain: sortedChain as Chain,
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
}

sync()
  .then(() => {
    console.log("Done");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
