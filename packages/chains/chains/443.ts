import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 443,
  "explorers": [
    {
      "name": "Obscuro Sepolia Rollup Explorer",
      "url": "https://testnet.obscuroscan.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://obscu.ro",
  "name": "Obscuro Testnet",
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://obscuro-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.obscu.ro"
  ],
  "shortName": "obs-testnet",
  "slug": "obscuro-testnet",
  "testnet": true
} as const satisfies Chain;