import type { Chain } from "../src/types";
export default {
  "chain": "FIL",
  "chainId": 380,
  "explorers": [
    {
      "name": "ZKAmoeba Test Explorer",
      "url": "https://testnetexplorer.zkamoeba.com",
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
  "infoURL": "https://testnet.zkamoeba.com",
  "name": "ZKAmoeba Testnet",
  "nativeCurrency": {
    "name": "filecoin",
    "symbol": "FIL",
    "decimals": 18
  },
  "networkId": 380,
  "parent": {
    "type": "L2",
    "chain": "eip155-314",
    "bridges": [
      {
        "url": "https://testnet.zkamoeba.com/en/bridge"
      }
    ]
  },
  "rpc": [
    "https://zkamoeba-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://380.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.zkamoeba.com:4050/",
    "https://rpc1.testnet.zkamoeba.com:4050/"
  ],
  "shortName": "zkamoeba-test",
  "slug": "zkamoeba-testnet",
  "testnet": true
} as const satisfies Chain;