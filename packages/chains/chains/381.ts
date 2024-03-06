import type { Chain } from "../src/types";
export default {
  "chain": "FIL",
  "chainId": 381,
  "explorers": [
    {
      "name": "ZKAmoeba Explorer",
      "url": "https://explorer.zkamoeba.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmRTChjmiwh9HrGsLh9qECsH7WHQAhqT5Ww8S34s8ME2Cp",
        "width": 512,
        "height": 512,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmRTChjmiwh9HrGsLh9qECsH7WHQAhqT5Ww8S34s8ME2Cp",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://www.zkamoeba.com",
  "name": "ZKAmoeba Mainnet",
  "nativeCurrency": {
    "name": "filecoin",
    "symbol": "FIL",
    "decimals": 18
  },
  "networkId": 381,
  "parent": {
    "type": "L2",
    "chain": "eip155-314",
    "bridges": [
      {
        "url": "https://www.zkamoeba.com/en/bridge"
      }
    ]
  },
  "rpc": [
    "https://381.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.mainnet.zkamoeba.com/rpc"
  ],
  "shortName": "zkamoeba",
  "slug": "zkamoeba",
  "testnet": false
} as const satisfies Chain;