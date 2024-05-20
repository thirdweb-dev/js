import type { Chain } from "../src/types";
export default {
  "chain": "BLXQ",
  "chainId": 1108,
  "explorers": [
    {
      "name": "BLXq Explorer",
      "url": "https://explorer.blxq.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://blx.org",
  "name": "BLXq Mainnet",
  "nativeCurrency": {
    "name": "BLXQ",
    "symbol": "BLXQ",
    "decimals": 18
  },
  "networkId": 1108,
  "rpc": [
    "https://1108.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.blxq.org"
  ],
  "shortName": "blxq",
  "slug": "blxq",
  "testnet": false
} as const satisfies Chain;