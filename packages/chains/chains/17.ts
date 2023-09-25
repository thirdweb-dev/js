import type { Chain } from "../src/types";
export default {
  "chainId": 17,
  "chain": "TCH",
  "name": "ThaiChain 2.0 ThaiFi",
  "rpc": [
    "https://thaichain-2-0-thaifi.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.thaifi.com"
  ],
  "slug": "thaichain-2-0-thaifi",
  "faucets": [],
  "nativeCurrency": {
    "name": "Thaifi Ether",
    "symbol": "TFI",
    "decimals": 18
  },
  "infoURL": "https://exp.thaifi.com",
  "shortName": "tfi",
  "testnet": false,
  "redFlags": [],
  "explorers": [],
  "features": []
} as const satisfies Chain;