import type { Chain } from "../src/types";
export default {
  "chain": "BounceBit",
  "chainId": 6000,
  "explorers": [
    {
      "name": "BBScan Testnet Explorer",
      "url": "https://bbscan.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://bouncebit.io",
  "name": "BounceBit Testnet",
  "nativeCurrency": {
    "name": "BounceBit",
    "symbol": "BB",
    "decimals": 18
  },
  "networkId": 6000,
  "rpc": [
    "https://6000.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://fullnode-testnet.bouncebitapi.com/"
  ],
  "shortName": "bouncebit-testnet",
  "slug": "bouncebit-testnet",
  "testnet": true
} as const satisfies Chain;