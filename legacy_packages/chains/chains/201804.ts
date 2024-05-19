import type { Chain } from "../src/types";
export default {
  "chain": "MYTH",
  "chainId": 201804,
  "explorers": [
    {
      "name": "Mythical Chain Explorer",
      "url": "https://explorer.mythicalgames.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://mythicalgames.com/",
  "name": "Mythical Chain",
  "nativeCurrency": {
    "name": "Mythos",
    "symbol": "MYTH",
    "decimals": 18
  },
  "networkId": 201804,
  "rpc": [
    "https://201804.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://chain-rpc.mythicalgames.com"
  ],
  "shortName": "myth",
  "slug": "mythical-chain",
  "testnet": false
} as const satisfies Chain;