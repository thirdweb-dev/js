import type { Chain } from "../src/types";
export default {
  "chain": "BLX",
  "chainId": 879151,
  "explorers": [
    {
      "name": "BlocX Mainnet Explorer",
      "url": "https://explorer.blxscan.com",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.blocxchain.org/",
  "name": "BlocX Mainnet",
  "nativeCurrency": {
    "name": "BlocX",
    "symbol": "BLX",
    "decimals": 18
  },
  "networkId": 879151,
  "rpc": [
    "https://879151.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.blxscan.com/"
  ],
  "shortName": "blx",
  "slug": "blocx",
  "testnet": false
} as const satisfies Chain;