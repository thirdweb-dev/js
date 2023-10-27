import type { Chain } from "../src/types";
export default {
  "chain": "BLXQ",
  "chainId": 1107,
  "explorers": [
    {
      "name": "BLXq Explorer",
      "url": "https://explorer.blx.org",
      "standard": "none",
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
  "name": "BLXq Testnet",
  "nativeCurrency": {
    "name": "BLXQ",
    "symbol": "BLXQ",
    "decimals": 18
  },
  "networkId": 1107,
  "rpc": [
    "https://blxq-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1107.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnetq1.blx.org"
  ],
  "shortName": "tblxq",
  "slug": "blxq-testnet",
  "testnet": true
} as const satisfies Chain;