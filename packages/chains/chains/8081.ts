import type { Chain } from "../src/types";
export default {
  "chain": "Shardeum",
  "chainId": 8081,
  "explorers": [
    {
      "name": "Shardeum Scan",
      "url": "https://explorer-dapps.shardeum.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet-dapps.shardeum.org/"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmQWzHUy4kmk1eGksDREGQL3GWrssdAPBxHt4aKGAFHSfJ",
    "width": 1200,
    "height": 1200,
    "format": "png"
  },
  "infoURL": "https://docs.shardeum.org/",
  "name": "Shardeum Sphinx DApp 1.X",
  "nativeCurrency": {
    "name": "Shardeum",
    "symbol": "SHM",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://shardeum-sphinx-dapp-1-x.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://dapps.shardeum.org/sphinx"
  ],
  "shortName": "Sphinx",
  "slug": "shardeum-sphinx-dapp-1-x",
  "testnet": true
} as const satisfies Chain;