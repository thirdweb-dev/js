import type { Chain } from "../src/types";
export default {
  "chainId": 1108,
  "chain": "BLXQ",
  "name": "BLXq Mainnet",
  "rpc": [
    "https://blxq.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.blxq.org"
  ],
  "slug": "blxq",
  "icon": {
    "url": "ipfs://QmS9kDKr1rgcz5W55yCQVfFs1vRTCneaLHt1t9cBizpqpH",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "BLXQ",
    "symbol": "BLXQ",
    "decimals": 18
  },
  "infoURL": "https://blx.org",
  "shortName": "blxq",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "BLXq Explorer",
      "url": "https://explorer.blxq.org",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;