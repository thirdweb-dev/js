import type { Chain } from "../src/types";
export default {
  "chain": "NEAR",
  "chainId": 1313161554,
  "explorers": [
    {
      "name": "aurorascan.dev",
      "url": "https://aurorascan.dev",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://aurora.dev",
  "name": "Aurora Mainnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://aurora.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.aurora.dev"
  ],
  "shortName": "aurora",
  "slug": "aurora",
  "testnet": false
} as const satisfies Chain;