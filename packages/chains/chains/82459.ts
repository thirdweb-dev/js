import type { Chain } from "../src/types";
export default {
  "chain": "SLN",
  "chainId": 82459,
  "explorers": [
    {
      "name": "SLN Testnet Explorer",
      "url": "https://explorer.test.smartlayer.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.smartlayer.network/",
  "name": "Smart Layer Network Testnet",
  "nativeCurrency": {
    "name": "Service Unit Token",
    "symbol": "SU",
    "decimals": 18
  },
  "networkId": 82459,
  "rpc": [
    "https://82459.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.test.smartlayer.network"
  ],
  "shortName": "tSLN",
  "slug": "smart-layer-network-testnet",
  "testnet": true
} as const satisfies Chain;