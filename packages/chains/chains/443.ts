import type { Chain } from "../src/types";
export default {
  "chainId": 443,
  "chain": "ETH",
  "name": "Obscuro Testnet",
  "rpc": [
    "https://obscuro-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.obscu.ro"
  ],
  "slug": "obscuro-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://obscu.ro",
  "shortName": "obs-testnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Obscuro Sepolia Rollup Explorer",
      "url": "https://testnet.obscuroscan.io",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;