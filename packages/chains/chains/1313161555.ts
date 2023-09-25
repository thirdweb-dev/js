import type { Chain } from "../src/types";
export default {
  "chainId": 1313161555,
  "chain": "NEAR",
  "name": "Aurora Testnet",
  "rpc": [
    "https://aurora-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.aurora.dev/"
  ],
  "slug": "aurora-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://aurora.dev",
  "shortName": "aurora-testnet",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "aurorascan.dev",
      "url": "https://testnet.aurorascan.dev",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;