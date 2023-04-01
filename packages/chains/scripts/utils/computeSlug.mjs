const slugSpecialCases = {
  "fantom-opera": "fantom",
  "avalanche-c-chain": "avalanche",
  "avalanche-fuji-testnet": "avalanche-fuji",
  "optimism-goerli-testnet": "optimism-goerli",
  "arbitrum-one": "arbitrum",
  "binance-smart-chain": "binance",
  "binance-smart-chain-testnet": "binance-testnet",
  "base-goerli-testnet": "base-goerli",
};

const takenSlugs = {};

export function findSlug(chain) {
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
  if (slugSpecialCases[slug]) {
    slug = slugSpecialCases[slug];
  }
  // end special cases

  takenSlugs[slug] = true;
  return slug;
}
