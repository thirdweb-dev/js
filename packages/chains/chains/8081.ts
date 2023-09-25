import type { Chain } from "../src/types";
export default {
  "chainId": 8081,
  "chain": "Shardeum",
  "name": "Shardeum Sphinx DApp 1.X",
  "rpc": [
    "https://shardeum-sphinx-dapp-1-x.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://dapps.shardeum.org/sphinx"
  ],
  "slug": "shardeum-sphinx-dapp-1-x",
  "icon": {
    "url": "ipfs://QmQWzHUy4kmk1eGksDREGQL3GWrssdAPBxHt4aKGAFHSfJ",
    "width": 1200,
    "height": 1200,
    "format": "png"
  },
  "faucets": [
    "https://faucet-dapps.shardeum.org/"
  ],
  "nativeCurrency": {
    "name": "Shardeum",
    "symbol": "SHM",
    "decimals": 18
  },
  "infoURL": "https://docs.shardeum.org/",
  "shortName": "Sphinx",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Shardeum Scan",
      "url": "https://explorer-dapps.shardeum.org",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;