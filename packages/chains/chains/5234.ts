import type { Chain } from "../src/types";
export default {
  "chain": "HMND",
  "chainId": 5234,
  "explorers": [
    {
      "name": "Subscan",
      "url": "https://humanode.subscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://humanode.io",
  "name": "Humanode Mainnet",
  "nativeCurrency": {
    "name": "eHMND",
    "symbol": "eHMND",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://humanode.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://explorer-rpc-http.mainnet.stages.humanode.io"
  ],
  "shortName": "hmnd",
  "slug": "humanode",
  "testnet": false
} as const satisfies Chain;