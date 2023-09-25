import type { Chain } from "../src/types";
export default {
  "chainId": 19845,
  "chain": "BTCIX",
  "name": "BTCIX Network",
  "rpc": [
    "https://btcix-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://seed.btcix.org/rpc"
  ],
  "slug": "btcix-network",
  "faucets": [],
  "nativeCurrency": {
    "name": "BTCIX Network",
    "symbol": "BTCIX",
    "decimals": 18
  },
  "infoURL": "https://bitcolojix.org",
  "shortName": "btcix",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "BTCIXScan",
      "url": "https://btcixscan.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;