import type { Chain } from "../src/types";
export default {
  "chain": "NEAR",
  "chainId": 1313161555,
  "explorers": [
    {
      "name": "aurorascan.dev",
      "url": "https://testnet.aurorascan.dev",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://aurora.dev",
  "name": "Aurora Testnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://aurora-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.aurora.dev/"
  ],
  "shortName": "aurora-testnet",
  "slug": "aurora-testnet",
  "testnet": true
} as const satisfies Chain;