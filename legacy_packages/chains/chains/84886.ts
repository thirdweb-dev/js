import type { Chain } from "../src/types";
export default {
  "chain": "Aerie",
  "chainId": 84886,
  "explorers": [
    {
      "name": "Aerie Explorer",
      "url": "https://explorer.aerielab.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://aerielab.io/",
  "name": "Aerie Network",
  "nativeCurrency": {
    "name": "Aerie",
    "symbol": "AER",
    "decimals": 18
  },
  "networkId": 84886,
  "rpc": [
    "https://84886.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.aerielab.io"
  ],
  "shortName": "Aerie",
  "slug": "aerie-network",
  "testnet": false
} as const satisfies Chain;