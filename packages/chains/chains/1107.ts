import type { Chain } from "../src/types";
export default {
  "chain": "BLXQ",
  "chainId": 1107,
  "explorers": [
    {
      "name": "BLXq Explorer",
      "url": "https://explorer.blx.org",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmS9kDKr1rgcz5W55yCQVfFs1vRTCneaLHt1t9cBizpqpH",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "infoURL": "https://blx.org",
  "name": "BLXq Testnet",
  "nativeCurrency": {
    "name": "BLXQ",
    "symbol": "BLXQ",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://blxq-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnetq1.blx.org"
  ],
  "shortName": "tblxq",
  "slug": "blxq-testnet",
  "testnet": true
} as const satisfies Chain;