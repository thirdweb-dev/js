import type { Chain } from "../src/types";
export default {
  "chain": "FSC",
  "chainId": 868,
  "explorers": [
    {
      "name": "FSCScan",
      "url": "https://explorer.fantasiachain.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://fantasia.technology/",
  "name": "Fantasia Chain Mainnet",
  "nativeCurrency": {
    "name": "FST",
    "symbol": "FST",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://fantasia-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-data1.fantasiachain.com/",
    "https://mainnet-data2.fantasiachain.com/",
    "https://mainnet-data3.fantasiachain.com/"
  ],
  "shortName": "FSCMainnet",
  "slug": "fantasia-chain",
  "testnet": false
} as const satisfies Chain;