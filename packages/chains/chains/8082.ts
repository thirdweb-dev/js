import type { Chain } from "../src/types";
export default {
  "chainId": 8082,
  "chain": "Shardeum",
  "name": "Shardeum Sphinx 1.X",
  "rpc": [
    "https://shardeum-sphinx-1-x.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sphinx.shardeum.org/"
  ],
  "slug": "shardeum-sphinx-1-x",
  "icon": {
    "url": "ipfs://Qma1bfuubpepKn7DLDy4NPSKDeT3S4VPCNhu6UmdGrb6YD",
    "width": 609,
    "height": 533,
    "format": "png"
  },
  "faucets": [
    "https://faucet-sphinx.shardeum.org/"
  ],
  "nativeCurrency": {
    "name": "Shardeum SHM",
    "symbol": "SHM",
    "decimals": 18
  },
  "infoURL": "https://docs.shardeum.org/",
  "shortName": "Sphinx10",
  "testnet": false,
  "redFlags": [
    "reusedChainId"
  ],
  "explorers": [
    {
      "name": "Shardeum Scan",
      "url": "https://explorer-sphinx.shardeum.org",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;