import type { Chain } from "../src/types";
export default {
  "chainId": 542,
  "chain": "PAW",
  "name": "PAWCHAIN Testnet",
  "rpc": [
    "https://pawchain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://pawchainx.com/"
  ],
  "slug": "pawchain-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "PAW",
    "symbol": "PAW",
    "decimals": 18
  },
  "infoURL": "https://pawchainx.com/",
  "shortName": "PAW",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "PAWCHAIN Testnet",
      "url": "https://pawscan.io",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;