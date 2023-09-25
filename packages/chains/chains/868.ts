import type { Chain } from "../src/types";
export default {
  "chainId": 868,
  "chain": "FSC",
  "name": "Fantasia Chain Mainnet",
  "rpc": [
    "https://fantasia-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-data1.fantasiachain.com/",
    "https://mainnet-data2.fantasiachain.com/",
    "https://mainnet-data3.fantasiachain.com/"
  ],
  "slug": "fantasia-chain",
  "faucets": [],
  "nativeCurrency": {
    "name": "FST",
    "symbol": "FST",
    "decimals": 18
  },
  "infoURL": "https://fantasia.technology/",
  "shortName": "FSCMainnet",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "FSCScan",
      "url": "https://explorer.fantasiachain.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;