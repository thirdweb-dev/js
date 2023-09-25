import type { Chain } from "../src/types";
export default {
  "chainId": 108,
  "chain": "TT",
  "name": "ThunderCore Mainnet",
  "rpc": [
    "https://thundercore.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.thundercore.com",
    "https://mainnet-rpc.thundertoken.net",
    "https://mainnet-rpc.thundercore.io"
  ],
  "slug": "thundercore",
  "faucets": [],
  "nativeCurrency": {
    "name": "ThunderCore Token",
    "symbol": "TT",
    "decimals": 18
  },
  "infoURL": "https://thundercore.com",
  "shortName": "TT",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "thundercore-viewblock",
      "url": "https://viewblock.io/thundercore",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;