import type { Chain } from "../src/types";
export default {
  "chainId": 5234,
  "chain": "HMND",
  "name": "Humanode Mainnet",
  "rpc": [
    "https://humanode.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://explorer-rpc-http.mainnet.stages.humanode.io"
  ],
  "slug": "humanode",
  "faucets": [],
  "nativeCurrency": {
    "name": "eHMND",
    "symbol": "eHMND",
    "decimals": 18
  },
  "infoURL": "https://humanode.io",
  "shortName": "hmnd",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Subscan",
      "url": "https://humanode.subscan.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;