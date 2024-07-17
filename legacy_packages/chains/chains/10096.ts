import type { Chain } from "../src/types";
export default {
  "chain": "MNV",
  "chainId": 10096,
  "explorers": [
    {
      "name": "Blockscout",
      "url": "https://explorer.blockxnet.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://www.blockxnet.com/",
  "name": "MetaNova Verse",
  "nativeCurrency": {
    "name": "MNV",
    "symbol": "MNV",
    "decimals": 18
  },
  "networkId": 10096,
  "rpc": [
    "https://10096.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://web3.metanovaverse.com"
  ],
  "shortName": "mnv",
  "slug": "metanova-verse",
  "testnet": false
} as const satisfies Chain;