import type { Chain } from "../src/types";
export default {
  "chain": "Shardeum",
  "chainId": 8082,
  "explorers": [
    {
      "name": "Shardeum Scan",
      "url": "https://explorer-sphinx.shardeum.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet-sphinx.shardeum.org/"
  ],
  "features": [],
  "infoURL": "https://docs.shardeum.org/",
  "name": "Shardeum Sphinx 1.X",
  "nativeCurrency": {
    "name": "Shardeum SHM",
    "symbol": "SHM",
    "decimals": 18
  },
  "networkId": 8082,
  "redFlags": [
    "reusedChainId"
  ],
  "rpc": [
    "https://8082.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sphinx.shardeum.org/"
  ],
  "shortName": "Sphinx10",
  "slug": "shardeum-sphinx-1-x",
  "testnet": true
} as const satisfies Chain;