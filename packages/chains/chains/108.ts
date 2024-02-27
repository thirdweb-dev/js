import type { Chain } from "../src/types";
export default {
  "chain": "TT",
  "chainId": 108,
  "explorers": [
    {
      "name": "thundercore-viewblock",
      "url": "https://viewblock.io/thundercore",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://thundercore.com",
  "name": "ThunderCore Mainnet",
  "nativeCurrency": {
    "name": "ThunderCore Token",
    "symbol": "TT",
    "decimals": 18
  },
  "networkId": 108,
  "rpc": [
    "https://108.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.thundercore.com",
    "https://mainnet-rpc.thundertoken.net",
    "https://mainnet-rpc.thundercore.io"
  ],
  "shortName": "TT",
  "slip44": 1001,
  "slug": "thundercore",
  "testnet": false
} as const satisfies Chain;