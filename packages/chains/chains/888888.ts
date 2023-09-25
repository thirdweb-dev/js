import type { Chain } from "../src/types";
export default {
  "chainId": 888888,
  "chain": "Vision",
  "name": "Vision - Mainnet",
  "rpc": [
    "https://vision.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://infragrid.v.network/ethereum/compatible"
  ],
  "slug": "vision",
  "faucets": [],
  "nativeCurrency": {
    "name": "VS",
    "symbol": "VS",
    "decimals": 18
  },
  "infoURL": "https://www.v.network",
  "shortName": "vision",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Visionscan",
      "url": "https://www.visionscan.org",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;