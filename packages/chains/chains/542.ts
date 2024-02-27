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
  "infoURL": "https://pawchainx.com/",
  "name": "PAWCHAIN Testnet",
  "nativeCurrency": {
    "name": "PAW",
    "symbol": "PAW",
    "decimals": 18
  },
  "networkId": 542,
  "rpc": [
    "https://542.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://pawchainx.com/"
  ],
  "shortName": "PAW",
  "slip44": 1,
  "slug": "pawchain-testnet",
  "testnet": true
} as const satisfies Chain;