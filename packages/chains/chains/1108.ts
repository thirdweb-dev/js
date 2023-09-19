import type { Chain } from "../src/types";
export default {
  "name": "BLXq Mainnet",
  "chain": "BLXQ",
  "icon": {
    "url": "ipfs://QmS9kDKr1rgcz5W55yCQVfFs1vRTCneaLHt1t9cBizpqpH",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "rpc": [
    "https://blxq.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.blxq.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BLXQ",
    "symbol": "BLXQ",
    "decimals": 18
  },
  "infoURL": "https://blx.org",
  "shortName": "blxq",
  "chainId": 1108,
  "networkId": 1108,
  "explorers": [
    {
      "name": "BLXq Explorer",
      "url": "https://explorer.blxq.org",
      "icon": {
        "url": "ipfs://QmS9kDKr1rgcz5W55yCQVfFs1vRTCneaLHt1t9cBizpqpH",
        "width": 1000,
        "height": 1000,
        "format": "png"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "blxq"
} as const satisfies Chain;