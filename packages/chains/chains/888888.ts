import type { Chain } from "../src/types";
export default {
  "chain": "Vision",
  "chainId": 888888,
  "explorers": [
    {
      "name": "Visionscan",
      "url": "https://www.visionscan.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://www.v.network",
  "name": "Vision - Mainnet",
  "nativeCurrency": {
    "name": "VS",
    "symbol": "VS",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://vision.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://infragrid.v.network/ethereum/compatible"
  ],
  "shortName": "vision",
  "slug": "vision",
  "testnet": false
} as const satisfies Chain;