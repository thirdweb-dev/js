import type { Chain } from "../types";
export default {
  "chain": "BLXQ",
  "chainId": 1108,
  "explorers": [
    {
      "name": "BLXq Explorer",
      "url": "https://explorer.blxq.org",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmS9kDKr1rgcz5W55yCQVfFs1vRTCneaLHt1t9cBizpqpH",
        "width": 1000,
        "height": 1000,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmS9kDKr1rgcz5W55yCQVfFs1vRTCneaLHt1t9cBizpqpH",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "infoURL": "https://blx.org",
  "name": "BLXq Mainnet",
  "nativeCurrency": {
    "name": "BLXQ",
    "symbol": "BLXQ",
    "decimals": 18
  },
  "networkId": 1108,
  "rpc": [
    "https://blxq.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1108.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.blxq.org"
  ],
  "shortName": "blxq",
  "slug": "blxq",
  "testnet": false
} as const satisfies Chain;