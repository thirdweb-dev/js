import type { Chain } from "../src/types";
export default {
  "chain": "Shardeum",
  "chainId": 8081,
  "explorers": [
    {
      "name": "Shardeum Scan",
      "url": "https://explorer-liberty20.shardeum.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.liberty20.shardeum.org"
  ],
  "features": [],
  "infoURL": "https://docs.shardeum.org/",
  "name": "Shardeum Liberty 2.X",
  "nativeCurrency": {
    "name": "Shardeum SHM",
    "symbol": "SHM",
    "decimals": 18
  },
  "networkId": 8081,
  "redFlags": [
    "reusedChainId"
  ],
  "rpc": [
    "https://8081.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://liberty20.shardeum.org/"
  ],
  "shortName": "Liberty20",
  "slug": "shardeum-liberty-2-x",
  "status": "deprecated",
  "testnet": true
} as const satisfies Chain;