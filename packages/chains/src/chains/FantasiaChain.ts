import type { Chain } from "../types";
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
  "infoURL": "https://fantasiachain.com/",
  "name": "Fantasia Chain Mainnet",
  "nativeCurrency": {
    "name": "FST",
    "symbol": "FST",
    "decimals": 18
  },
  "networkId": 868,
  "rpc": [
    "https://fantasia-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://868.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-data1.fantasiachain.com/",
    "https://mainnet-data2.fantasiachain.com/",
    "https://mainnet-data3.fantasiachain.com/"
  ],
  "shortName": "FSCMainnet",
  "slug": "fantasia-chain",
  "testnet": false
} as const satisfies Chain;