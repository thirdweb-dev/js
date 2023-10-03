import type { Chain } from "../src/types";
export default {
  "chain": "PAW",
  "chainId": 542,
  "explorers": [
    {
      "name": "PAWCHAIN Testnet",
      "url": "https://pawscan.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://pawchainx.com/",
  "name": "PAWCHAIN Testnet",
  "nativeCurrency": {
    "name": "PAW",
    "symbol": "PAW",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://pawchain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://pawchainx.com/"
  ],
  "shortName": "PAW",
  "slug": "pawchain-testnet",
  "testnet": true
} as const satisfies Chain;