import type { Chain } from "../src/types";
export default {
  "chainId": 1898,
  "chain": "BON",
  "name": "BON Network",
  "rpc": [
    "https://bon-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "http://rpc.boyanet.org:8545",
    "ws://rpc.boyanet.org:8546"
  ],
  "slug": "bon-network",
  "faucets": [],
  "nativeCurrency": {
    "name": "BOYACoin",
    "symbol": "BOY",
    "decimals": 18
  },
  "infoURL": "https://boyanet.org",
  "shortName": "boya",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "explorer",
      "url": "https://explorer.boyanet.org:4001",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;