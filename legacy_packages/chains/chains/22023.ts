import type { Chain } from "../src/types";
export default {
  "chain": "Taycan",
  "chainId": 22023,
  "explorers": [
    {
      "name": "Taycan Explorer(Blockscout)",
      "url": "https://taycan-evmscan.hupayx.io",
      "standard": "none"
    },
    {
      "name": "Taycan Cosmos Explorer(BigDipper)",
      "url": "https://taycan-cosmoscan.hupayx.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://hupayx.io",
  "name": "Taycan",
  "nativeCurrency": {
    "name": "shuffle",
    "symbol": "SFL",
    "decimals": 18
  },
  "networkId": 22023,
  "rpc": [
    "https://22023.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://taycan-rpc.hupayx.io:8545"
  ],
  "shortName": "SFL",
  "slug": "taycan",
  "testnet": false
} as const satisfies Chain;