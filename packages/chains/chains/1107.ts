import type { Chain } from "../src/types";
export default {
  "chainId": 1107,
  "chain": "BLXQ",
  "name": "BLXq Testnet",
  "rpc": [
    "https://blxq-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnetq1.blx.org"
  ],
  "slug": "blxq-testnet",
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
  "shortName": "tblxq",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "BLXq Explorer",
      "url": "https://explorer.blx.org",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;