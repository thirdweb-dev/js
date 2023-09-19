import type { Chain } from "../src/types";
export default {
  "name": "BLXq Testnet",
  "chain": "BLXQ",
  "icon": {
    "url": "ipfs://QmS9kDKr1rgcz5W55yCQVfFs1vRTCneaLHt1t9cBizpqpH",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "rpc": [
    "https://blxq-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnetq1.blx.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "BLXQ",
    "symbol": "BLXQ",
    "decimals": 18
  },
  "infoURL": "https://blx.org",
  "shortName": "tblxq",
  "chainId": 1107,
  "networkId": 1107,
  "explorers": [
    {
      "name": "BLXq Explorer",
      "url": "https://explorer.blx.org",
      "icon": {
        "url": "ipfs://QmS9kDKr1rgcz5W55yCQVfFs1vRTCneaLHt1t9cBizpqpH",
        "width": 1000,
        "height": 1000,
        "format": "png"
      },
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "blxq-testnet"
} as const satisfies Chain;