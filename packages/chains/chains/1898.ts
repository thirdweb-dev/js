import type { Chain } from "../src/types";
export default {
  "chain": "BON",
  "chainId": 1898,
  "explorers": [
    {
      "name": "explorer",
      "url": "https://explorer.boyanet.org:4001",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://boyanet.org",
  "name": "BON Network",
  "nativeCurrency": {
    "name": "BOYACoin",
    "symbol": "BOY",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://bon-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://rpc.boyanet.org:8545",
    "ws://rpc.boyanet.org:8546"
  ],
  "shortName": "boya",
  "slug": "bon-network",
  "testnet": false
} as const satisfies Chain;