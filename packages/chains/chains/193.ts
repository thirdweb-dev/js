import type { Chain } from "../src/types";
export default {
  "chainId": 193,
  "chain": "CEM",
  "name": "Crypto Emergency",
  "rpc": [
    "https://crypto-emergency.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://cemchain.com"
  ],
  "slug": "crypto-emergency",
  "faucets": [],
  "nativeCurrency": {
    "name": "Crypto Emergency",
    "symbol": "CEM",
    "decimals": 18
  },
  "infoURL": "https://cemblockchain.com/",
  "shortName": "cem",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "cemscan",
      "url": "https://cemscan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;