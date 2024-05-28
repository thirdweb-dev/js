import type { Chain } from "../src/types";
export default {
  "chain": "Metal L2",
  "chainId": 1750,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.metall2.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://metall2.com",
  "name": "Metal L2",
  "nativeCurrency": {
    "name": "ETH",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 1750,
  "rpc": [
    "https://1750.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.metall2.com"
  ],
  "shortName": "metall2",
  "slug": "metal-l2",
  "testnet": false
} as const satisfies Chain;