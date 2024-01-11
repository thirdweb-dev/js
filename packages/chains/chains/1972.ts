import type { Chain } from "../src/types";
export default {
  "chain": "REDEV2",
  "chainId": 1972,
  "explorers": [
    {
      "name": "RedeCoin Explorer",
      "url": "https://explorer3.redecoin.eu",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.redecoin.eu",
  "name": "RedeCoin",
  "nativeCurrency": {
    "name": "RedeCoin",
    "symbol": "REDEV2",
    "decimals": 18
  },
  "networkId": 1972,
  "rpc": [
    "https://redecoin.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1972.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc2.redecoin.eu"
  ],
  "shortName": "rede",
  "slug": "redecoin",
  "testnet": false
} as const satisfies Chain;