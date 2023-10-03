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
  "icon": {
    "url": "ipfs://Qma1bfuubpepKn7DLDy4NPSKDeT3S4VPCNhu6UmdGrb6YD",
    "width": 609,
    "height": 533,
    "format": "png"
  },
  "infoURL": "https://docs.shardeum.org/",
  "name": "Shardeum Sphinx 1.X",
  "nativeCurrency": {
    "name": "Shardeum SHM",
    "symbol": "SHM",
    "decimals": 18
  },
  "redFlags": [
    "reusedChainId"
  ],
  "rpc": [
    "https://shardeum-sphinx-1-x.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sphinx.shardeum.org/"
  ],
  "shortName": "Sphinx10",
  "slug": "shardeum-sphinx-1-x",
  "testnet": false
} as const satisfies Chain;