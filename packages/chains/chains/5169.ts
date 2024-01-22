import type { Chain } from "../src/types";
export default {
  "chain": "SLN",
  "chainId": 5169,
  "explorers": [
    {
      "name": "SLN Mainnet Explorer",
      "url": "https://explorer.main.smartlayer.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.smartlayer.network/",
  "name": "Smart Layer Network",
  "nativeCurrency": {
    "name": "Service Unit Token",
    "symbol": "SU",
    "decimals": 18
  },
  "networkId": 5169,
  "rpc": [
    "https://smart-layer-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://5169.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.main.smartlayer.network"
  ],
  "shortName": "SLN",
  "slug": "smart-layer-network",
  "testnet": false
} as const satisfies Chain;