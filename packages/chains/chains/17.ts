import type { Chain } from "../src/types";
export default {
  "chain": "TCH",
  "chainId": 17,
  "explorers": [],
  "faucets": [],
  "infoURL": "https://exp.thaifi.com",
  "name": "ThaiChain 2.0 ThaiFi",
  "nativeCurrency": {
    "name": "Thaifi Ether",
    "symbol": "TFI",
    "decimals": 18
  },
  "networkId": 17,
  "rpc": [
    "https://thaichain-2-0-thaifi.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://17.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.thaifi.com"
  ],
  "shortName": "tfi",
  "slug": "thaichain-2-0-thaifi",
  "testnet": false
} as const satisfies Chain;