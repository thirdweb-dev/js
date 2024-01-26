import type { Chain } from "../src/types";
export default {
  "chain": "BTCIX",
  "chainId": 19845,
  "explorers": [
    {
      "name": "BTCIXScan",
      "url": "https://btcixscan.com",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://bitcolojix.org",
  "name": "BTCIX Network",
  "nativeCurrency": {
    "name": "BTCIX Network",
    "symbol": "BTCIX",
    "decimals": 18
  },
  "networkId": 19845,
  "rpc": [
    "https://btcix-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://19845.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://seed.btcix.org/rpc"
  ],
  "shortName": "btcix",
  "slug": "btcix-network",
  "testnet": false
} as const satisfies Chain;