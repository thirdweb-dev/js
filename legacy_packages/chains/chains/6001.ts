import type { Chain } from "../src/types";
export default {
  "chain": "BounceBit",
  "chainId": 6001,
  "explorers": [
    {
      "name": "BBScan Mainnet Explorer",
      "url": "https://bbscan.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://bouncebit.io",
  "name": "BounceBit Mainnet",
  "nativeCurrency": {
    "name": "BounceBit",
    "symbol": "BB",
    "decimals": 18
  },
  "networkId": 6001,
  "rpc": [
    "https://6001.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://fullnode-mainnet.bouncebitapi.com/"
  ],
  "shortName": "bouncebit-mainnet",
  "slug": "bouncebit",
  "testnet": false
} as const satisfies Chain;