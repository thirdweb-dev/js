import type { Chain } from "../src/types";
export default {
  "chainId": 1313161554,
  "chain": "NEAR",
  "name": "Aurora Mainnet",
  "rpc": [
    "https://aurora.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.aurora.dev"
  ],
  "slug": "aurora",
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://aurora.dev",
  "shortName": "aurora",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "aurorascan.dev",
      "url": "https://aurorascan.dev",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;