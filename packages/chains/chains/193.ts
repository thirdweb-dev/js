import type { Chain } from "../src/types";
export default {
  "chain": "CEM",
  "chainId": 193,
  "explorers": [
    {
      "name": "cemscan",
      "url": "https://cemscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://cemblockchain.com/",
  "name": "Crypto Emergency",
  "nativeCurrency": {
    "name": "Crypto Emergency",
    "symbol": "CEM",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://crypto-emergency.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://cemchain.com"
  ],
  "shortName": "cem",
  "slug": "crypto-emergency",
  "testnet": false
} as const satisfies Chain;