import type { Chain } from "../src/types";
export default {
  "chainId": 8007736,
  "chain": "Plian",
  "name": "Plian Mainnet Subchain 1",
  "rpc": [
    "https://plian-subchain-1.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.plian.io/child_0"
  ],
  "slug": "plian-subchain-1",
  "faucets": [],
  "nativeCurrency": {
    "name": "Plian Token",
    "symbol": "PI",
    "decimals": 18
  },
  "infoURL": "https://plian.org",
  "shortName": "plian-mainnet-l2",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "piscan",
      "url": "https://piscan.plian.org/child_0",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;