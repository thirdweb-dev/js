import type { Chain } from "../types";
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
  "infoURL": "https://cemblockchain.com/",
  "name": "Crypto Emergency",
  "nativeCurrency": {
    "name": "Crypto Emergency",
    "symbol": "CEM",
    "decimals": 18
  },
  "networkId": 193,
  "rpc": [
    "https://crypto-emergency.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://193.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://cemchain.com"
  ],
  "shortName": "cem",
  "slug": "crypto-emergency",
  "testnet": false
} as const satisfies Chain;